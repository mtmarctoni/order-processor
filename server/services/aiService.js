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
