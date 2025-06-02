import { supabase } from '../lib/supabase.js';

export const createTemplate = async (req, res, next) => {
  try {
    const { config } = req.body;
    const configParsed = JSON.parse(config);
    console.log('Todo lo recibido en server: ', configParsed);
    const { data, error } = await supabase
      .from('templates')
      .insert([{ name: configParsed.name, type: configParsed.documentType, fields: configParsed.fields }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating template:', error);
    next(error);
  }
};

export const getTemplates = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, fields, config } = req.body;
    
    const { data, error } = await supabase
      .from('templates')
      .update({ name, fields, config })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};