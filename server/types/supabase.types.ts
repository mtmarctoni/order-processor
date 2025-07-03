import { ProcessingJob } from './document.types.js';

export interface ProcessingService {
  updateJobStatus(
    id: string, 
    status: 'pending' | 'processing' | 'completed' | 'failed',
    result?: Record<string, any> | null
  ): Promise<ProcessingJob | null>;
  
  createJob(jobData: Omit<ProcessingJob, 'id' | 'created_at' | 'updated_at'>): Promise<ProcessingJob>;
  getById(id: string): Promise<ProcessingJob | null>;
  getAll(): Promise<ProcessingJob[]>;
}

// declare module '../lib/supabase.js' {
//   export const processingService: ProcessingService;
// }
