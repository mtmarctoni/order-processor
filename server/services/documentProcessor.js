import pdf from 'pdf-parse';
import xlsx from 'xlsx';
import { supabase } from '../lib/supabase.js';

export const processFile = async (file) => {
  try {
    // Create a processing job
    const { data: job, error: jobError } = await supabase
      .from('processing_jobs')
      .insert([{
        status: 'processing',
        file_name: file.originalname,
        file_type: file.mimetype
      }])
      .select()
      .single();

    if (jobError) throw jobError;

    // Process the file based on its type
    const result = await extractDataFromFile(file);

    // Update job with results
    const { error: updateError } = await supabase
      .from('processing_jobs')
      .update({
        status: 'completed',
        result: result,
        completed_at: new Date()
      })
      .eq('id', job.id);

    if (updateError) throw updateError;

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
  // Use the buffer directly from the uploaded file
  const dataBuffer = file.buffer;
  
  try {
    const data = await pdf(dataBuffer);
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
  const workbook = xlsx.read(file.buffer);
  const result = {};
  
  workbook.SheetNames.forEach(sheetName => {
    result[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  });
  
  return result;
};