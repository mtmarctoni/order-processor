import { templateService } from '../lib/supabase.js';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createWorker } from 'tesseract.js';
import pdf from 'pdf-parse';
import xlsx from 'xlsx';

// Initialize OpenAI chat model
const chatModel = new ChatOpenAI({
  temperature: 0.2,
  modelName: 'gpt-4',
  openAIApiKey: process.env.OPENAI_API_KEY
});

export const analyzeTemplate = async (file) => {
  try {
    // Extract raw content from the document
    const { text, metadata } = await extractRawContent(file);
    
    // Use AI to analyze the document structure
    const analysis = await analyzeDocumentWithAI(text, metadata);
    
    // Generate field suggestions based on AI analysis
    const suggestions = await generateFieldSuggestions(analysis);
    
    return {
      fields: analysis.fields,
      metadata: metadata,
      suggestions: suggestions,
      layout: analysis.layout
    };
  } catch (error) {
    console.error('Error analyzing template:', error);
    throw error;
  }
};

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
  const workbook = xlsx.read(file.buffer);
  let text = '';
  
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    text += `Sheet: ${sheetName}\n`;
    text += xlsx.utils.sheet_to_csv(sheet) + '\n\n';
  });
  
  return {
    text,
    metadata: {
      sheets: workbook.SheetNames,
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