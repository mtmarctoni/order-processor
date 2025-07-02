export interface FileWithBuffer extends Express.Multer.File {
  buffer: Buffer;
}

export interface ProcessingJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_name: string;
  file_type: string;
  created_at: string;
  updated_at: string;
  result?: any;
  error?: string;
}

export interface Template {
  id: string;
  name: string;
  fields: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProcessedDocument {
  extracted_text: string;
  metadata: {
    [key: string]: any;
    template_used?: string;
    processed_at: string;
  };
  [key: string]: any;
}
