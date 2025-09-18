import { Request, Response } from 'express';
import { NodeModel, INode } from '../models/NodeModel';
import { EdgeModel, IEdge } from '../models/EdgeModel';
import mongoose from 'mongoose';

// Get entire graph (nodes + edges)
export const getGraph = async (req: Request, res: Response): Promise<void> => {
  try {
    const [nodes, edges] = await Promise.all([
      NodeModel.find().lean(),
      EdgeModel.find().lean()
    ]);
    
    res.json({ nodes, edges });
  } catch (error) {
    console.error('Error fetching graph:', error);
    res.status(500).json({ error: 'Failed to fetch graph data' });
  }
};

// Node CRUD Operations
export const createNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { label, type = 'default', properties = {}, x = 0, y = 0 } = req.body;
    
    if (!label) {
      res.status(400).json({ error: 'Label is required' });
      return;
    }
    
    const node = new NodeModel({
      label: label.trim(),
      type,
      properties,
      x,
      y
    });
    
    await node.save();
    res.status(201).json(node);
  } catch (error) {
    console.error('Error creating node:', error);
    res.status(500).json({ error: 'Failed to create node' });
  }
};

export const updateNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid node ID' });
      return;
    }
    
    // Sanitize updates - only allow specific fields
    const allowedFields = ['label', 'type', 'properties', 'x', 'y', 'fx', 'fy'];
    const sanitizedUpdates: Partial<INode> = {};
    
    for (const field of allowedFields) {
      if (field in updates) {
        (sanitizedUpdates as any)[field] = updates[field];
      }
    }
    
    const node = await NodeModel.findByIdAndUpdate(
      id, 
      sanitizedUpdates, 
      { new: true, runValidators: true }
    );
    
    if (!node) {
      res.status(404).json({ error: 'Node not found' });
      return;
    }
    
    res.json(node);
  } catch (error) {
    console.error('Error updating node:', error);
    res.status(500).json({ error: 'Failed to update node' });
  }
};

export const deleteNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid node ID' });
      return;
    }
    
    // Start a transaction to ensure data consistency
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Delete all edges connected to this node
        await EdgeModel.deleteMany({
          $or: [{ source: id }, { target: id }]
        }).session(session);
        
        // Delete the node
        const deletedNode = await NodeModel.findByIdAndDelete(id).session(session);
        
        if (!deletedNode) {
          throw new Error('Node not found');
        }
      });
      
      res.json({ message: 'Node and connected edges deleted successfully' });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('Error deleting node:', error);
    if (error instanceof Error && error.message === 'Node not found') {
      res.status(404).json({ error: 'Node not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete node' });
    }
  }
};

// Edge CRUD Operations
export const createEdge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { source, target, label = '', properties = {}, directed = true } = req.body;
    
    if (!source || !target) {
      res.status(400).json({ error: 'Source and target nodes are required' });
      return;
    }
    
    if (!mongoose.Types.ObjectId.isValid(source) || !mongoose.Types.ObjectId.isValid(target)) {
      res.status(400).json({ error: 'Invalid node IDs' });
      return;
    }
    
    // Verify both nodes exist
    const [sourceNode, targetNode] = await Promise.all([
      NodeModel.findById(source),
      NodeModel.findById(target)
    ]);
    
    if (!sourceNode || !targetNode) {
      res.status(404).json({ error: 'One or both nodes not found' });
      return;
    }
    
    const edge = new EdgeModel({
      source,
      target,
      label: label.trim(),
      properties,
      directed
    });
    
    await edge.save();
    res.status(201).json(edge);
  } catch (error) {
    console.error('Error creating edge:', error);
    res.status(500).json({ error: 'Failed to create edge' });
  }
};

export const updateEdge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid edge ID' });
      return;
    }
    
    // Sanitize updates - only allow specific fields
    const allowedFields = ['label', 'properties', 'directed'];
    const sanitizedUpdates: Partial<IEdge> = {};
    
    for (const field of allowedFields) {
      if (field in updates) {
        (sanitizedUpdates as any)[field] = updates[field];
      }
    }
    
    const edge = await EdgeModel.findByIdAndUpdate(
      id, 
      sanitizedUpdates, 
      { new: true, runValidators: true }
    );
    
    if (!edge) {
      res.status(404).json({ error: 'Edge not found' });
      return;
    }
    
    res.json(edge);
  } catch (error) {
    console.error('Error updating edge:', error);
    res.status(500).json({ error: 'Failed to update edge' });
  }
};

export const deleteEdge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid edge ID' });
      return;
    }
    
    const deletedEdge = await EdgeModel.findByIdAndDelete(id);
    
    if (!deletedEdge) {
      res.status(404).json({ error: 'Edge not found' });
      return;
    }
    
    res.json({ message: 'Edge deleted successfully' });
  } catch (error) {
    console.error('Error deleting edge:', error);
    res.status(500).json({ error: 'Failed to delete edge' });
  }
};

// Search functionality
export const searchNodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }
    
    const searchQuery = q.trim();
    if (searchQuery.length === 0) {
      res.json([]);
      return;
    }
    
    // Perform text search on indexed fields
    const nodes = await NodeModel.find({
      $or: [
        { label: { $regex: searchQuery, $options: 'i' } },
        { type: { $regex: searchQuery, $options: 'i' } }
      ]
    }).limit(20).lean();
    
    res.json(nodes);
  } catch (error) {
    console.error('Error searching nodes:', error);
    res.status(500).json({ error: 'Failed to search nodes' });
  }
}; 