import express from 'express';
import * as processedOrderController from '../controllers/processedOrderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new processed order
router.post('/', processedOrderController.createProcessedOrder);

// Get a single processed order by ID
router.get('/:id', processedOrderController.getProcessedOrder);

// Get all processed orders for a job
router.get('/job/:jobId', processedOrderController.getProcessedOrdersByJob);

// Update a processed order
router.put('/:id', processedOrderController.updateProcessedOrder);

// Delete a processed order
router.delete('/:id', processedOrderController.deleteProcessedOrder);

export default router;
