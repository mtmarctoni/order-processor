import { templateService } from '../lib/supabase.js';
import pdf from 'pdf-parse';
import xlsx from 'xlsx';

export const analyzeTemplate = async (file) => {
  try {
    const result = await extractTemplateStructure(file);
    return {
      fields: result.fields,
      metadata: result.metadata,
      suggestions: generateFieldSuggestions(result)
    };
  } catch (error) {
    console.error('Error analyzing template:', error);
    throw error;
  }
};

const extractTemplateStructure = async (file) => {
  switch (file.mimetype) {
    case 'application/pdf':
      return await analyzePDFTemplate(file);
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return await analyzeExcelTemplate(file);
    default:
      throw new Error('Unsupported file type');
  }
};

const analyzePDFTemplate = async (file) => {
  const dataBuffer = file.buffer;
  const data = await pdf(dataBuffer);
  
  // Extract text and analyze structure
  const text = data.text;
  const lines = text.split('\n').filter(line => line.trim());
  
  // Basic field detection
  const fields = [];
  const commonLabels = [
    'invoice', 'date', 'number', 'total', 'subtotal', 'tax',
    'bill to', 'ship to', 'payment terms', 'due date'
  ];

  lines.forEach((line, index) => {
    commonLabels.forEach(label => {
      if (line.toLowerCase().includes(label)) {
        fields.push({
          label: label,
          position: index,
          context: line.trim()
        });
      }
    });
  });

  return {
    fields,
    metadata: {
      pageCount: data.numpages,
      info: data.info
    }
  };
};

const analyzeExcelTemplate = async (file) => {
  const workbook = xlsx.read(file.buffer);
  const fields = [];
  
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const headers = xlsx.utils.sheet_to_json(sheet, { header: 1 })[0];
    
    headers.forEach(header => {
      if (header) {
        fields.push({
          label: header,
          position: 'header',
          context: sheetName
        });
      }
    });
  });

  return {
    fields,
    metadata: {
      sheets: workbook.SheetNames,
      sheetCount: workbook.SheetNames.length
    }
  };
};

const generateFieldSuggestions = (analysisResult) => {
  const suggestions = [];
  
  analysisResult.fields.forEach(field => {
    const suggestion = {
      name: field.label.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      type: inferFieldType(field.label),
      required: isLikelyRequired(field.label),
      aiRules: {
        keywords: generateKeywords(field.label),
        position: inferPosition(field.position),
        validation: generateValidationRule(field.label)
      }
    };
    
    suggestions.push(suggestion);
  });

  return suggestions;
};

const inferFieldType = (label) => {
  label = label.toLowerCase();
  if (label.includes('date')) return 'date';
  if (label.includes('total') || label.includes('amount') || label.includes('price')) return 'currency';
  if (label.includes('number') || label.includes('quantity')) return 'number';
  return 'text';
};

const isLikelyRequired = (label) => {
  const criticalFields = ['total', 'number', 'date', 'amount'];
  return criticalFields.some(field => label.toLowerCase().includes(field));
};

const generateKeywords = (label) => {
  const base = label.toLowerCase().split(' ');
  const variations = [];
  
  base.forEach(word => {
    variations.push(word);
    if (word === 'number') variations.push('no', '#');
    if (word === 'total') variations.push('sum', 'amount');
  });
  
  return [...new Set(variations)];
};

const inferPosition = (position) => {
  if (typeof position === 'number') {
    if (position < 10) return 'header';
    if (position > 30) return 'footer';
    return 'body';
  }
  return position;
};

const generateValidationRule = (label) => {
  label = label.toLowerCase();
  if (label.includes('email')) return '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  if (label.includes('phone')) return '^\\+?[1-9]\\d{1,14}$';
  if (label.includes('number')) return '^[A-Z0-9-]+$';
  return null;
};