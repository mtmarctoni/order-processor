import axios from 'axios';

export const templateService = {
  async uploadTemplate(file: File, config: any) {
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

  async analyzeTemplate(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/templates/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getTemplates() {
    const response = await axios.get('/api/templates');
    return response.data;
  },
};
