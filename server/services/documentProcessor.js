// import pdf from 'pdf-parse';
import pdf from '../utils/pdfParseLoader.cjs';
import ExcelJS from 'exceljs';
import { processingService } from '../lib/supabase.js';
import fs from 'fs/promises';
import path from 'path';

export const processFileWithAIandTemplate = async (jobId, templateId) => {
  try {
    // Get the job details
    const job = await processingService.getById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // Get the template
    const template = await processingService.getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // call your AI service to process the text with the template
    // analyzeDocumentWithTemplate -> modify this function to accept the job and template
    // first be clear of the format of the job and template
    console.log('Job:', job);
    console.log('Template:', template);
    
    // For now, we'll return a mock response
    const processedData = {
      extracted_text: text,
      metadata: {
        ...metadata,
        template_used: template.name,
        processed_at: new Date().toISOString()
      },
      // Add any other fields your AI processing would generate
    };

    return processedData;
  } catch (error) {
    console.error('Error processing file with AI:', error);
    throw error;
  }
}

export const processFile = async (file) => {
  try {
    // Create a processing job
    const job = await processingService.createJob({
      status: 'processing',
      file_name: file.originalname,
      file_type: file.mimetype
    });

    const fileWithBuffer = {
      ...file,
      buffer: await getFileBuffer(file.path)
    };

    // Process the file based on its type
    const result = await extractDataFromFile(fileWithBuffer);

    // Update job with results
    await processingService.updateJobStatus(job.id, 'completed', result);

    return job;
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
};

const extractDataFromFile = async (file) => {
  switch (file.mimetype) {
    case 'application/pdf':
      return await extractFromPDF(file);
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return await extractFromExcel(file);
    default:
      throw new Error('Unsupported file type');
  }
};

const extractFromPDF = async (file) => {

  console.log('Processing PDF file:', file);
  const dataBuffer = file.buffer;
  console.log('Data buffer:', dataBuffer);

  
  try {
    const data = await pdf(dataBuffer);
    console.log('PDF data:', data);
    return {
      text: data.text,
      info: data.info,
      metadata: data.metadata
    };
  } catch (error) {
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
};

const extractFromExcel = async (file) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file.buffer);
  const result = {};
  
  workbook.eachSheet((worksheet, sheetId) => {
    result[sheetId] = worksheet.getSheetValues();
  });
  
  return result;
};

const getFileBuffer = async (filePath) => {
  const absolutePath = path.resolve(filePath);
  const fileBuffer = await fs.readFile(absolutePath);
  return fileBuffer;
}