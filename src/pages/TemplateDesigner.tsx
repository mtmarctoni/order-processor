import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Link, Search, FileText, Edit, FileType, Calendar, Hash, List } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { templateService } from '../services/templateService';
import { Template } from '../types/template';

const getFieldIcon = (type: string) => {
  switch (type) {
    case 'text':
      return <FileType size={14} className="text-blue-500" />;
    case 'number':
      return <Hash size={14} className="text-green-500" />;
    case 'date':
      return <Calendar size={14} className="text-purple-500" />;
    case 'select':
      return <List size={14} className="text-orange-500" />;
    default:
      return <FileText size={14} className="text-gray-500" />;
  }
};

const TemplateDesigner: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const data = await templateService.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, []);  
  
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) return;
    
    try {
      await templateService.deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const filteredTemplates = searchQuery
    ? templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : templates;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your document templates
          </p>
        </div>
        <Button>
          <a href="/templates/upload" className="flex items-center gap-2">
            <Plus size={16} /> New Template
          </a>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search templates by name or type..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-1">
              {searchQuery ? 'No matching templates' : 'No templates found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? 'Try adjusting your search or create a new template.'
                : "Get started by creating a new template."}
            </p>
            <Button>
              <Link to="/templates/upload" className="flex items-center gap-2 mx-auto">
                <Plus size={16} /> Create Template
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                      {template.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Link to={`/templates/edit/${template.id}`}>
                        <Edit size={16} className="text-gray-500" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  {template.fields && template.fields.length > 0 ? (
                    template.fields.slice(0, 5).map((field) => (
                      <div key={field.id} className="flex items-center gap-2 text-sm">
                        {getFieldIcon(field.type)}
                        <span>{field.name}</span>
                        {field.required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No fields defined</p>
                  )}
                  {template.fields && template.fields.length > 5 && (
                    <p className="text-xs text-gray-500 mt-1">
                      +{template.fields.length - 5} more fields
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-gray-500 justify-between">
                <span>
                  {template.fields?.length || 0} fields
                </span>
                <span>
                  Updated {new Date(template.updated_at).toLocaleDateString()}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateDesigner;