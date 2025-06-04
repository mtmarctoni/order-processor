import { processedOrdersService } from '../lib/supabase.js';
import { processFileWithAIandTemplate } from '../services/documentProcessor.js';

export const createProcessedOrder = async (req, res, next) => {
  try {
    const { job_id, template_id } = req.body;
    
    // Process the file with AI and template
    const result = await processFileWithAIandTemplate(job_id, template_id);
    
    // Create the processed order
    const processedOrder = await processedOrdersService.createProcessedOrder({
      job_id,
      template_id,
      processed_data: result
    });
    
    res.status(201).json({
      success: true,
      data: processedOrder
    });
  } catch (error) {
    next(error);
  }
};

export const getProcessedOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await processedOrdersService.getProcessedOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Processed order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getProcessedOrdersByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const orders = await processedOrdersService.getProcessedOrdersByJobId(jobId);
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateProcessedOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedOrder = await processedOrdersService.updateProcessedOrder(id, updates);
    
    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProcessedOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await processedOrdersService.deleteProcessedOrder(id);
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
