export interface TemplateField {
    id: string;
    name: string;
    type: string;
    required?: boolean;
}

export interface Template {
id: string;
name: string;
type: string;
fields: TemplateField[];
created_at: string;
updated_at: string;
}