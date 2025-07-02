import { ProcessingJob } from './document.types';

export interface ProcessingService {
  updateJobStatus(
    id: string, 
    status: 'pending' | 'processing' | 'completed' | 'failed',
    result?: Record<string, any> | null
  ): Promise<{ data: ProcessingJob | null; error: Error | null }>;
  
  createJob(jobData: Omit<ProcessingJob, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ProcessingJob; error: Error | null }>;
  getById(id: string): Promise<{ data: ProcessingJob | null; error: Error | null }>;
  getAll(): Promise<ProcessingJob[]>;
}

// declare module '../lib/supabase.js' {
//   export const processingService: ProcessingService;
// }
