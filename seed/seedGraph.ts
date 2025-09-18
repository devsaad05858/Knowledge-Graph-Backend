// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { NodeModel } from '../src/models/NodeModel';
import { EdgeModel } from '../src/models/EdgeModel';
import { connectDB } from '../src/db';

interface SeedNode {
  label: string;
  type: string;
  properties: Record<string, any>;
  x: number;
  y: number;
}

interface SeedEdge {
  sourceLabel: string;
  targetLabel: string;
  label: string;
  properties: Record<string, any>;
  directed: boolean;
}

const seedNodes: SeedNode[] = [
  {
    label: 'React',
    type: 'frontend-framework',
    properties: { description: 'JavaScript library for building user interfaces', category: 'Frontend' },
    x: -200,
    y: -100
  },
  {
    label: 'TypeScript',
    type: 'programming-language',
    properties: { description: 'Typed superset of JavaScript', category: 'Language' },
    x: 0,
    y: -200
  },
  {
    label: 'Node.js',
    type: 'runtime',
    properties: { description: 'JavaScript runtime built on Chrome V8 engine', category: 'Backend' },
    x: 200,
    y: -100
  },
  {
    label: 'Express',
    type: 'backend-framework',
    properties: { description: 'Fast, unopinionated web framework for Node.js', category: 'Backend' },
    x: 300,
    y: 0
  },
  {
    label: 'MongoDB',
    type: 'database',
    properties: { description: 'Document-oriented NoSQL database', category: 'Database' },
    x: 200,
    y: 100
  },
  {
    label: 'Mongoose',
    type: 'orm',
    properties: { description: 'MongoDB object modeling for Node.js', category: 'Database' },
    x: 100,
    y: 150
  },
  {
    label: 'D3.js',
    type: 'visualization-library',
    properties: { description: 'Data-driven documents library for visualization', category: 'Frontend' },
    x: -300,
    y: 0
  },
  {
    label: 'Force Graph',
    type: 'component',
    properties: { description: 'Physics-based graph visualization component', category: 'Frontend' },
    x: -250,
    y: 100
  },
  {
    label: 'REST API',
    type: 'architecture',
    properties: { description: 'Representational State Transfer architecture', category: 'Architecture' },
    x: 0,
    y: 0
  },
  {
    label: 'Graph Database',
    type: 'concept',
    properties: { description: 'Database that uses graph structures for queries', category: 'Database' },
    x: 0,
    y: 200
  },
  {
    label: 'Tailwind CSS',
    type: 'css-framework',
    properties: { description: 'Utility-first CSS framework', category: 'Frontend' },
    x: -100,
    y: -150
  },
  {
    label: 'Vite',
    type: 'build-tool',
    properties: { description: 'Fast build tool for modern web development', category: 'Frontend' },
    x: 100,
    y: -50
  },
  {
    label: 'Neo4j',
    type: 'graph-database',
    properties: { description: 'Native graph database management system', category: 'Database' },
    x: -100,
    y: 250
  },
  {
    label: 'MongoDB Atlas',
    type: 'cloud-database',
    properties: { description: 'Cloud-hosted MongoDB database service', category: 'Database' },
    x: 300,
    y: 150
  }
];

const seedEdges: SeedEdge[] = [
  { sourceLabel: 'React', targetLabel: 'TypeScript', label: 'uses', properties: {}, directed: true },
  { sourceLabel: 'Node.js', targetLabel: 'TypeScript', label: 'supports', properties: {}, directed: true },
  { sourceLabel: 'Express', targetLabel: 'Node.js', label: 'runs-on', properties: {}, directed: true },
  { sourceLabel: 'Mongoose', targetLabel: 'MongoDB', label: 'connects-to', properties: {}, directed: true },
  { sourceLabel: 'Express', targetLabel: 'Mongoose', label: 'uses', properties: {}, directed: true },
  { sourceLabel: 'Force Graph', targetLabel: 'D3.js', label: 'built-with', properties: {}, directed: true },
  { sourceLabel: 'React', targetLabel: 'Force Graph', label: 'renders', properties: {}, directed: true },
  { sourceLabel: 'Express', targetLabel: 'REST API', label: 'implements', properties: {}, directed: true },
  { sourceLabel: 'MongoDB', targetLabel: 'Graph Database', label: 'can-model', properties: {}, directed: true },
  { sourceLabel: 'React', targetLabel: 'Tailwind CSS', label: 'styled-with', properties: {}, directed: true },
  { sourceLabel: 'React', targetLabel: 'Vite', label: 'built-with', properties: {}, directed: true },
  { sourceLabel: 'MongoDB', targetLabel: 'MongoDB Atlas', label: 'hosted-on', properties: {}, directed: true },
  { sourceLabel: 'Neo4j', targetLabel: 'Graph Database', label: 'is-type-of', properties: {}, directed: true },
  { sourceLabel: 'Force Graph', targetLabel: 'Neo4j', label: 'inspired-by', properties: {}, directed: false },
  { sourceLabel: 'REST API', targetLabel: 'TypeScript', label: 'typed-with', properties: {}, directed: true },
  { sourceLabel: 'Vite', targetLabel: 'TypeScript', label: 'supports', properties: {}, directed: true }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('📍 Using MongoDB URI:', process.env.MONGODB_URI ? 'From .env file' : 'Default localhost');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await EdgeModel.deleteMany({});
    await NodeModel.deleteMany({});
    
    // Create nodes
    console.log('📍 Creating nodes...');
    const nodeMap = new Map<string, mongoose.Types.ObjectId>();
    
    for (const seedNode of seedNodes) {
      const node = new NodeModel(seedNode);
      await node.save();
      nodeMap.set(seedNode.label, node._id);
      console.log(`  ✓ Created node: ${seedNode.label} (${seedNode.type})`);
    }
    
    // Create edges
    console.log('🔗 Creating edges...');
    for (const seedEdge of seedEdges) {
      const sourceId = nodeMap.get(seedEdge.sourceLabel);
      const targetId = nodeMap.get(seedEdge.targetLabel);
      
      if (!sourceId || !targetId) {
        console.warn(`  ⚠️  Skipping edge: ${seedEdge.sourceLabel} -> ${seedEdge.targetLabel} (node not found)`);
        continue;
      }
      
      const edge = new EdgeModel({
        source: sourceId,
        target: targetId,
        label: seedEdge.label,
        properties: seedEdge.properties,
        directed: seedEdge.directed
      });
      
      await edge.save();
      console.log(`  ✓ Created edge: ${seedEdge.sourceLabel} --[${seedEdge.label}]--> ${seedEdge.targetLabel}`);
    }
    
    // Summary
    const nodeCount = await NodeModel.countDocuments();
    const edgeCount = await EdgeModel.countDocuments();
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log(`📊 Created ${nodeCount} nodes and ${edgeCount} edges`);
    console.log('💡 The graph represents a technology stack with relationships between different components');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
} 