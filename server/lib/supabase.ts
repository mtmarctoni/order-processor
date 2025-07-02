import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

import {type ProcessingService} from '../types/supabase.types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Template-specific operations
export const templateService = {
  async create(template) {
    const { data, error } = await supabase
      .from('templates')
      .insert([template])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Processing job operations


export const processingService: ProcessingService = {
  async createJob(jobData) {
    const { data, error } = await supabase
      .from('processing_jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateJobStatus(id, status, result = null) {
    const { data, error } = await supabase
      .from('processing_jobs')
      .update({
        status,
        result,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('processing_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('processing_jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};

export const processedOrdersService = {
  async createProcessedOrder({ job_id, template_id, processed_data }) {
    const { data, error } = await supabase
      .from('processed_orders')
      .insert({
        job_id,
        template_id,
        processed_data,
        status: 'completed'
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async getProcessedOrderById(id) {
    const { data, error } = await supabase
      .from('processed_orders')
      .select(`
        *,
        processing_jobs:job_id(*),
        templates:template_id(*)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async getProcessedOrdersByJobId(jobId) {
    const { data, error } = await supabase
      .from('processed_orders')
      .select(`
        *,
        templates:template_id(*)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  async updateProcessedOrder(id, updates) {
    const { data, error } = await supabase
      .from('processed_orders')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async deleteProcessedOrder(id) {
    const { error } = await supabase
      .from('processed_orders')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }  
};
