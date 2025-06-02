import axios from 'axios';

export const documentService = {
  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getDocumentStatus(jobId: string) {
    const response = await axios.get(`/api/documents/status/${jobId}`);
    return response.data;
  },

  async getAllDocuments() {
    const response = await axios.get('/api/documents');
    return response.data;
  },
};

export type DocumentStatus = {
  error: string;
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_name: string;
  file_type: string;
  result?: any;
  created_at: string;
  updated_at: string;
  completed_at?: string;
};
