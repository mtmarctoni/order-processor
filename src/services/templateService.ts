import axios from 'axios';
import { Template } from '../types/template';

export const templateService = {
  async uploadTemplate(file: File, config: any): Promise<Template> {
    const formData = new FormData();
    formData.append('file', JSON.stringify(file));
    formData.append('config', JSON.stringify(config));

    console.log('Template data sended to server:', { file, config });

    const response = await axios.post('/api/templates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async analyzeTemplate(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/templates/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getTemplates(): Promise<Template[]> {
    const response = await axios.get('/api/templates');
    return response.data;
  },

  async getTemplateById(id: string): Promise<Template> {
    const response = await axios.get(`/api/templates/${id}`);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await axios.delete(`/api/templates/${id}`);
  },
};
