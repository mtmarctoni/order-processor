import { processingService } from '../lib/supabase.js';
import { processFile } from '../services/documentProcessor.js';

// finish this function
export const processDocumentWithAIandTemplate = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const { templateId } = req.body;
    const processedOrder = await processWithAIandTemplate(file, templateId);
    
    // send the excel to download
    res.json(processedOrder);
  } catch (error) {
    next(error);
  }
};

export const processDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const processingJob = await processFile(file);
    
    res.json({
      status: 'processing',
      jobId: processingJob.id,
      message: 'Document processing started'
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await processingService.getById(id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    next(error);
  }
};

export const getAllDocuments = async (req, res, next) => {
  try {
    const documents = await processingService.getAll();

    if (!documents) {
      return res.status(404).json({ error: 'Documents not found' });
    }

    res.json(documents);
  } catch (error) {
    next(error);
  }
};