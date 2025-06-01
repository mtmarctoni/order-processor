import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const storage = {
  async uploadDocument(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  },

  async getDocumentUrl(path: string): Promise<string> {
    const { data } = await supabase.storage
      .from('documents')
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  async deleteDocument(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('documents')
      .remove([path]);
    
    if (error) throw error;
  },

  async listDocuments(userId: string): Promise<string[]> {
    const { data, error } = await supabase.storage
      .from('documents')
      .list(userId);
    
    if (error) throw error;
    return data.map(file => file.name);
  },

  async saveTemplate(template: any, userId: string): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .insert([{ ...template, user_id: userId }]);
    
    if (error) throw error;
  },

  async getTemplates(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
};