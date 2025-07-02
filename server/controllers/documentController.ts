import { Request, Response, NextFunction } from 'express';
import { processingService } from '../lib/supabase.js';
import { processFile, processFileWithAIandTemplate } from '../services/documentProcessor.js';

export const processDocumentWithAIandTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { docId, templateId } = req.body as { docId: string; templateId: string };
    const processedOrder = await processFileWithAIandTemplate(docId, templateId);
    
    res.json(processedOrder);
    return;
  } catch (error) {
    next(error);
  }
};

export const processDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
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

export const getDocumentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await processingService.getById(id);

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    res.json(document);
  } catch (error) {
    next(error);
  }
};

export const getAllDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documents = await processingService.getAll();

    if (!documents) {
      res.status(404).json({ error: 'Documents not found' });
      return;
    }

    res.json(documents);
  } catch (error) {
    next(error);
  }
};
