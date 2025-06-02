import { templateService } from '../lib/supabase.js';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createWorker } from 'tesseract.js';
import pdf from '../utils/pdfParseLoader.cjs';
import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import path from 'path';

// Initialize OpenAI chat model
const chatModel = new ChatOpenAI({
  temperature: 0.2,
  modelName: 'gpt-4',
  openAIApiKey: process.env.OPENAI_API_KEY
});

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
      analysis = await analyzeDocumentWithAI(text, metadata);
      
      // Generate field suggestions based on AI analysis
      suggestions = await generateFieldSuggestions(analysis);
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

const analyzeDocumentWithAI = async (text, metadata) => {
  const systemPrompt = new SystemMessage(`You are an expert document analyzer. Analyze the provided document text and identify:
1. Document type and purpose
2. Key fields and their locations
3. Document structure and layout
4. Data relationships and hierarchies
5. Validation rules and patterns

Provide a structured analysis that can be used for automated processing.`);

  const userPrompt = new HumanMessage(`Analyze this document:
Type: ${metadata.type}
Content:
${text.substring(0, 4000)} // Truncate to avoid token limits

Provide analysis in JSON format with the following structure:
{
  "documentType": "string",
  "purpose": "string",
  "fields": [{
    "name": "string",
    "type": "string",
    "location": "string",
    "importance": "high|medium|low",
    "relationships": ["field_names"],
    "validationRules": ["rules"]
  }],
  "layout": {
    "sections": ["header", "body", "footer"],
    "structure": "string"
  }
}`);

  const response = await chatModel.invoke([systemPrompt, userPrompt]);
  return JSON.parse(response.content);
};

const generateFieldSuggestions = async (analysis) => {
  const systemPrompt = new SystemMessage(`You are an expert in document processing automation. Generate field extraction rules and suggestions based on the document analysis.`);

  const userPrompt = new HumanMessage(`Based on this analysis:
${JSON.stringify(analysis, null, 2)}

Generate detailed field processing rules including:
1. AI detection strategies
2. Validation patterns
3. Data transformation rules
4. Error handling suggestions
5. Confidence scoring criteria

Provide output in JSON format.`);

  const response = await chatModel.invoke([systemPrompt, userPrompt]);
  return JSON.parse(response.content);
};

export const validateTemplate = async (template, sampleData) => {
  const systemPrompt = new SystemMessage(`You are a document validation expert. Validate the template configuration against sample data.`);

  const userPrompt = new HumanMessage(`Template configuration:
${JSON.stringify(template, null, 2)}

Sample data:
${JSON.stringify(sampleData, null, 2)}

Validate and provide:
1. Configuration issues
2. Missing fields
3. Validation rule conflicts
4. Processing efficiency suggestions
5. Accuracy improvement recommendations

Provide output in JSON format.`);

  const response = await chatModel.invoke([systemPrompt, userPrompt]);
  return JSON.parse(response.content);
};