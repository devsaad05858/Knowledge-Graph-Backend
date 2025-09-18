import express from 'express';
import { searchNodes } from '../controllers/graphController';

const router = express.Router();

// Search routes
router.get('/search', searchNodes);

export default router; 