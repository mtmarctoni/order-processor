import { createWorker } from 'tesseract.js';
import pdf from '../utils/pdfParseLoader.cjs';
import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import path from 'path';
import { aiService } from './aiService.js';

export const analyzeTemplate = async (file) => {
  try {
    console.log('File uploaded:', file);

    const fileWithBuffer = {
      ...file,
      buffer: await getFileBuffer(file.path)
    };

    // Extract raw content from the document
    const extractionResult = await extractRawContent(fileWithBuffer);
    if (!extractionResult || !extractionResult.text) {
      throw new Error('Failed to extract content from file');
    }

    const { text, metadata } = extractionResult;
    
    let analysis = null;
    let suggestions = null;
    try{
      // Use AI to analyze the document structure
      analysis = await aiService.analyzeDocument(text, metadata);
      console.log('Analysis result:', analysis);
      
      // Generate field suggestions based on AI analysis
      suggestions = await aiService.generateFieldSuggestions(analysis);
      console.log('Suggestions result:', suggestions);
    } catch (error) {
      console.error('AI error:', error);
    }
    
    return {
      fields: analysis?.fields || [],
      metadata: metadata,
      suggestions: suggestions || [],
      layout: analysis?.layout || {}
    };
  } catch (error) {
    console.error('Error analyzing template:', error);
    throw error;
  }
};

const getFileBuffer = async (filePath) => {
  const absolutePath = path.resolve(filePath);
  const fileBuffer = await fs.readFile(absolutePath);
  return fileBuffer;
}

const extractRawContent = async (file) => {
  switch (file.mimetype) {
    case 'application/pdf':
      return await extractFromPDF(file);
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return await extractFromExcel(file);
    case 'image/jpeg':
    case 'image/png':
      return await extractFromImage(file);
    default:
      throw new Error('Unsupported file type');
  }
};

const extractFromPDF = async (file) => {
  const dataBuffer = file.buffer;
  const data = await pdf(dataBuffer);
  
  return {
    text: data.text,
    metadata: {
      pageCount: data.numpages,
      info: data.info,
      type: 'pdf'
    }
  };
};

const extractFromExcel = async (file) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file.buffer);
  const allData = {};

  // Iterate through all worksheets
  workbook.eachSheet((worksheet, sheetId) => {
    const sheetData = [];
    
    // Get worksheet name
    const sheetName = worksheet.name;
    
    // Iterate through all rows
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      // Extract cell values, skip empty first element
      const rowValues = row.values.slice(1); 
      
      // Convert rich text to plain text format
      const cleanValues = rowValues.map(cell => {
        if (cell && cell.richText) {
          return cell.richText.map(t => t.text).join('');
        }
        return cell;
      });
      
      sheetData.push(cleanValues);
    });

    allData[sheetName] = {
      headers: sheetData[0] || [], // First row as headers
      rows: sheetData.slice(1)     // Remaining rows as data
    };
  });

  return {
    text: JSON.stringify(allData),
    metadata: {
      sheets: workbook.worksheets.map(ws => ws.name),
      totalSheets: workbook.worksheets.length,
      type: 'excel'
    }
  };
};


const extractFromImage = async (file) => {
  const worker = await createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  
  const { data: { text } } = await worker.recognize(file.buffer);
  await worker.terminate();
  
  return {
    text,
    metadata: {
      type: 'image'
    }
  };
};