// @ts-ignore
import express, { type Router } from 'express';
import { createProcessedOrder, getProcessedOrder, getProcessedOrdersByJob, updateProcessedOrder, deleteProcessedOrder } from '../controllers/processedOrderController.js';
// import { authMiddleware } from '../middleware/authMiddleware.js';

const router: Router = express.Router();

// Apply auth middleware to all routes
// router.use(authMiddleware);

// Create a new processed order
router.post('/', createProcessedOrder);

// Get a single processed order by ID
router.get('/:id', getProcessedOrder);

// Get all processed orders for a job
router.get('/job/:jobId', getProcessedOrdersByJob);

// Update a processed order
router.put('/:id', updateProcessedOrder);

// Delete a processed order
router.delete('/:id', deleteProcessedOrder);

export default router;
