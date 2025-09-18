import express from 'express';
import {
  getGraph,
  createNode,
  updateNode,
  deleteNode,
  createEdge,
  updateEdge,
  deleteEdge
} from '../controllers/graphController';

const router = express.Router();

// Graph routes
router.get('/graph', getGraph);

// Node routes
router.post('/nodes', createNode);
router.put('/nodes/:id', updateNode);
router.delete('/nodes/:id', deleteNode);

// Edge routes
router.post('/edges', createEdge);
router.put('/edges/:id', updateEdge);
router.delete('/edges/:id', deleteEdge);

export default router; 