import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

class AIService {
  constructor(provider = 'openai', options = {}) {
    this.provider = provider.toLowerCase();
    this.options = options;
    this.initializeProvider();
  }

  initializeProvider() {
    switch (this.provider) {
      case 'openai':
        this.chatModel = new ChatOpenAI({
          temperature: 0.2,
          modelName: 'gpt-4',
          openAIApiKey: process.env.OPENAI_API_KEY,
          ...this.options
        });
        break;
      case 'gemini':
        this.chatModel = new ChatGoogleGenerativeAI({
          modelName: 'gemini-2.0-flash',
          apiKey: process.env.GOOGLE_API_KEY,
          temperature: 0.2,
          ...this.options
        });
        break;
      default:
        throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  async invoke(systemPrompt, userPrompt) {
    const systemMsg = new SystemMessage(systemPrompt);
    const userMsg = new HumanMessage(userPrompt);
    let response = await this.chatModel.invoke([systemMsg, userMsg]);

    if (typeof response.content === 'string' && response.content.includes('```json')) {
      response.content = response.content.split('```json')[1].split('```')[0];
    }
    return response.content;
  }

  /**
   * Analyzes a document using a specified template
   * @param {string} text - The text content of the document
   * @param {Object} metadata - Document metadata
   * @param {string} templateId - ID of the template to use for analysis
   * @returns {Promise<Object>} - Analyzed document data in the format expected by processing_jobs
   */
  async analyzeDocumentWithTemplate(text, metadata, templateId) {
    // Get the template from the database
    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      throw new Error('Failed to load template for analysis');
    }

    const systemPrompt = `You are an expert document processor. Your task is to extract and structure information from documents according to a predefined template.

Template Details:
- Name: ${template.name}
- Document Type: ${template.type}
- Fields: ${JSON.stringify(template.fields, null, 2)}

Extract all fields specified in the template from the provided document text. For each field, provide:
1. The extracted value
2. The confidence level (high/medium/low)
3. The location in the document where the value was found (page number, section, etc.)
4. Any notes or observations about the extraction`;

    const userPrompt = `Please process the following document according to the template "${template.name}" (${template.type}):

Document Content:
${text}

Extract all fields from the template and return them in a structured JSON format. If a field cannot be found, set its value to null and explain why in the notes.`;

    try {
      const systemMsg = new SystemMessage(systemPrompt);
      const userMsg = new HumanMessage(userPrompt);
      
      let response = await this.chatModel.invoke([systemMsg, userMsg]);
      
      // Process the response to extract JSON
      let result;
      if (typeof response.content === 'string') {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = response.content.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          result = JSON.parse(jsonMatch[1]);
        } else {
          // If no code block, try to parse the entire response as JSON
          result = JSON.parse(response.content);
        }
      } else {
        result = response.content;
      }

      // Format the result for the processing_jobs table
      return {
        status: 'completed',
        result: {
          extracted_data: result,
          template_used: template.id,
          template_version: template.updated_at || template.created_at,
          analysis_date: new Date().toISOString(),
          confidence: this.calculateOverallConfidence(result)
        },
        metadata: {
          ...metadata,
          template_name: template.name,
          template_type: template.type
        }
      };
    } catch (error) {
      console.error('Error in document analysis:', error);
      return {
        status: 'error',
        error: error.message,
        metadata: {
          ...metadata,
          template_id: templateId,
          error_type: 'analysis_error'
        }
      };
    }
  }

  /**
   * Calculates the overall confidence level based on extracted fields
   * @private
   */
  calculateOverallConfidence(extractedData) {
    if (!extractedData || Object.keys(extractedData).length === 0) {
      return 'low';
    }

    const confidences = [];
    
    // Recursively collect all confidence values
    const collectConfidences = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if ('confidence' in obj) {
          confidences.push(obj.confidence);
        }
        Object.values(obj).forEach(value => collectConfidences(value));
      }
    };
    
    collectConfidences(extractedData);
    
    if (confidences.length === 0) return 'medium';
    
    // Calculate average confidence
    const confidenceScores = confidences.map(c => 
      c === 'high' ? 1 : (c === 'medium' ? 0.5 : 0)
    );
    const avgScore = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
    
    return avgScore > 0.75 ? 'high' : (avgScore > 0.25 ? 'medium' : 'low');
  }

  async analyzeDocument(text, metadata) {
    const systemPrompt = `You are an expert document analyzer. Analyze the provided document text and identify:
1. Document type and purpose
2. Key fields and their locations
3. Document structure and layout
4. Data relationships and hierarchies
5. Validation rules and patterns`;

    const userPrompt = `Analyze this document:
Type: ${metadata.type}
Content:
${text.substring(0, 4000)}

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
}`;

    const response = await this.invoke(systemPrompt, userPrompt);
    console.log('AI response:', response);
    return JSON.parse(response);
  }

  async generateFieldSuggestions(analysis) {
    const systemPrompt = `You are an expert in document processing automation. Generate field extraction rules and suggestions based on the document analysis.`;
    const userPrompt = `Based on this analysis:
${JSON.stringify(analysis, null, 2)}

Generate detailed field processing rules including:
1. AI detection strategies
2. Validation patterns
3. Data transformation rules
4. Error handling suggestions
5. Confidence scoring criteria

Provide output in JSON format.`;

    const response = await this.invoke(systemPrompt, userPrompt);
    return JSON.parse(response);
  }

  async validateTemplate(template, sampleData) {
    const systemPrompt = `You are a document validation expert. Validate the template configuration against sample data.`;
    const userPrompt = `Template configuration:
${JSON.stringify(template, null, 2)}

Sample data:
${JSON.stringify(sampleData, null, 2)}

Validate and provide:
1. Configuration issues
2. Missing fields
3. Validation rule conflicts
4. Processing efficiency suggestions
5. Accuracy improvement recommendations

Provide output in JSON format.`;

    const response = await this.invoke(systemPrompt, userPrompt);
    return JSON.parse(response);
  }
}

// Create a singleton instance
export const aiService = new AIService(process.env.AI_PROVIDER || 'gemini');
