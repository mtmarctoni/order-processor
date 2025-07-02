import { FileWithBuffer, ProcessingJob, Template, ProcessedDocument } from '../types/document.types';
import { processingService } from '../lib/supabase.js';
import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import path from 'path';
// @ts-ignore
// import pdf from 'pdf-parse';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export const processFileWithAIandTemplate = async (
  jobId: string, 
  templateId: string
): Promise<ProcessedDocument> => {
  try {
    const job = await processingService.getById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // const template = await processingService.getTemplateById(templateId) as Template | null;
    // if (!template) {
    //   throw new Error('Template not found');
    // }

    // TODO: Implement actual AI processing with the template
    // For now, returning a mock response
    return {
      extracted_text: '', // This should be populated with actual text extraction
      metadata: {
        template_used: 'template.name',
        processed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error processing file with AI:', error);
    throw error;
  }
};

export const processFile = async (file: Express.Multer.File): Promise<ProcessingJob> => {
  try {
    const { data: job, error: createError } = await processingService.createJob({
      status: 'processing',
      file_name: file.originalname,
      file_type: file.mimetype
    });

    if (createError || !job) {
      throw createError || new Error('Failed to create job');
    }

    const fileWithBuffer: FileWithBuffer = {
      ...file,
      buffer: await getFileBuffer(file.path)
    };

    const result = await extractDataFromFile(fileWithBuffer);
    const { error: updateError } = await processingService.updateJobStatus(job.id, 'completed', result);
    
    if (updateError) {
      throw updateError;
    }

    return job;
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
};

const extractDataFromFile = async (file: FileWithBuffer): Promise<Record<string, any>> => {
  switch (file.mimetype) {
    case 'application/pdf':
      return await extractFromPDF(file);
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return await extractFromExcel(file);
    default:
      throw new Error('Unsupported file type');
  }
};

const extractFromPDF = async (file: FileWithBuffer): Promise<{ text: string; info: any; metadata: any }> => {
  try {
    const data = await pdf(file.buffer);
    return {
      text: data.text,
      info: data.info,
      metadata: data.metadata
    };
  } catch (error) {
    throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const extractFromExcel = async (file: FileWithBuffer): Promise<Record<string, any>> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file.buffer);
  const result: Record<string, any> = {};
  
  workbook.eachSheet((worksheet, sheetId) => {
    result[sheetId] = worksheet.getSheetValues();
  });
  
  return result;
};

const getFileBuffer = async (filePath: string): Promise<Buffer> => {
  const absolutePath = path.resolve(filePath);
  return await fs.readFile(absolutePath);
};
