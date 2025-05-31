import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Save, Plus, Trash2, ArrowLeft, ArrowRight, FlipHorizontal as DragHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'selection';
  required: boolean;
  mapping: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  fields: TemplateField[];
}

const TemplateDesigner: React.FC = () => {
  const [templateName, setTemplateName] = useState('Invoice Template');
  const [categories, setCategories] = useState<TemplateCategory[]>([
    {
      id: 'header',
      name: 'Document Information',
      fields: [
        { id: 'invoice_number', label: 'Invoice Number', type: 'text', required: true, mapping: 'invoice.number' },
        { id: 'invoice_date', label: 'Invoice Date', type: 'date', required: true, mapping: 'invoice.date' },
        { id: 'due_date', label: 'Due Date', type: 'date', required: false, mapping: 'invoice.dueDate' },
        { id: 'po_number', label: 'PO Number', type: 'text', required: false, mapping: 'invoice.poNumber' },
      ],
    },
    {
      id: 'customer',
      name: 'Customer Details',
      fields: [
        { id: 'customer_name', label: 'Customer Name', type: 'text', required: true, mapping: 'customer.name' },
        { id: 'customer_address', label: 'Address', type: 'text', required: false, mapping: 'customer.address' },
        { id: 'customer_email', label: 'Email', type: 'text', required: false, mapping: 'customer.email' },
        { id: 'customer_phone', label: 'Phone', type: 'text', required: false, mapping: 'customer.phone' },
      ],
    },
    {
      id: 'financial',
      name: 'Financial Details',
      fields: [
        { id: 'subtotal', label: 'Subtotal', type: 'number', required: true, mapping: 'financial.subtotal' },
        { id: 'tax', label: 'Tax', type: 'number', required: false, mapping: 'financial.tax' },
        { id: 'total', label: 'Total Amount', type: 'number', required: true, mapping: 'financial.total' },
        { id: 'currency', label: 'Currency', type: 'selection', required: true, mapping: 'financial.currency' },
      ],
    },
  ]);
  
  const [availableFields, setAvailableFields] = useState<TemplateField[]>([
    { id: 'shipping_method', label: 'Shipping Method', type: 'text', required: false, mapping: '' },
    { id: 'payment_terms', label: 'Payment Terms', type: 'text', required: false, mapping: '' },
    { id: 'discount', label: 'Discount', type: 'number', required: false, mapping: '' },
    { id: 'notes', label: 'Notes', type: 'text', required: false, mapping: '' },
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>('header');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  
  const handleAddField = (field: TemplateField) => {
    if (!selectedCategory) return;
    
    // Add field to selected category
    setCategories(categories.map(category => {
      if (category.id === selectedCategory) {
        return {
          ...category,
          fields: [...category.fields, { ...field, id: `${field.id}_${Date.now()}` }]
        };
      }
      return category;
    }));
    
    // Remove from available fields
    setAvailableFields(availableFields.filter(f => f.id !== field.id));
  };
  
  const handleRemoveField = (categoryId: string, fieldId: string) => {
    // Get the field to remove
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const field = category.fields.find(f => f.id === fieldId);
    if (!field) return;
    
    // Remove field from category
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          fields: category.fields.filter(f => f.id !== fieldId)
        };
      }
      return category;
    }));
    
    // Add to available fields if it's a standard field
    if (!fieldId.includes('_')) {
      setAvailableFields([...availableFields, field]);
    }
  };
  
  const handleAddCategory = () => {
    const newCategory = {
      id: `category_${Date.now()}`,
      name: 'New Category',
      fields: []
    };
    
    setCategories([...categories, newCategory]);
    setSelectedCategory(newCategory.id);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Template Designer
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Create and manage document processing templates
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            leftIcon={<Layers size={16} />}
          >
            Load Template
          </Button>
          <Button
            variant="default"
            leftIcon={<Save size={16} />}
          >
            Save Template
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        <div className="w-full md:w-64 flex flex-col">
          <Card className="flex-1">
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Template Fields</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddCategory}
                >
                  <Plus size={16} />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full px-4 py-2 text-left text-sm font-medium ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {category.name} ({category.fields.length})
                    </button>
                    
                    {selectedCategory === category.id && (
                      <div className="pl-4 pr-2 py-2 space-y-1 bg-gray-50 dark:bg-gray-800/50">
                        {category.fields.map((field) => (
                          <button
                            key={field.id}
                            onClick={() => setSelectedField(field.id)}
                            className={`w-full px-3 py-1.5 rounded text-xs flex items-center justify-between ${
                              selectedField === field.id
                                ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <span className="truncate">{field.label}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveField(category.id, field.id);
                              }}
                              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              <Trash2 size={12} className="text-gray-500 dark:text-gray-400" />
                            </button>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Available Fields</CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="p-4 space-y-2">
                {availableFields.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No available fields
                  </p>
                ) : (
                  availableFields.map((field) => (
                    <div
                      key={field.id}
                      className="p-2 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {field.label}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectedCategory && handleAddField(field)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1 flex flex-col">
          <Card className="flex-1">
            <CardHeader className="py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="text-lg font-semibold bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-0 px-0 py-1"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ArrowLeft size={14} />}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Test Processing
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    Field Configuration
                  </h3>
                  
                  {selectedCategory && selectedField ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {categories
                        .find((c) => c.id === selectedCategory)
                        ?.fields.filter((f) => f.id === selectedField)
                        .map((field) => (
                          <div key={field.id}>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Field Label
                                </label>
                                <input
                                  type="text"
                                  value={field.label}
                                  className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Field Type
                                </label>
                                <select className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                  <option value="text">Text</option>
                                  <option value="number">Number</option>
                                  <option value="date">Date</option>
                                  <option value="selection">Selection</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Data Mapping
                                </label>
                                <input
                                  type="text"
                                  value={field.mapping}
                                  className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                />
                              </div>
                              
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="required"
                                  checked={field.required}
                                  className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                />
                                <label
                                  htmlFor="required"
                                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                >
                                  Required Field
                                </label>
                              </div>
                              
                              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  AI Detection Settings
                                </h4>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Keywords
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g., invoice, number, #"
                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select a field to configure
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    Template Preview
                  </h3>
                  
                  <div className="border border-gray-200 dark:border-gray-800 rounded-md h-[500px] bg-white dark:bg-gray-900 overflow-auto p-6 relative">
                    {/* Mock template preview */}
                    <div className="text-center text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                      INVOICE
                    </div>
                    
                    <div className="flex justify-between mb-8">
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From:</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Your Company Name</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">123 Business St</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">City, State, ZIP</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice Details:</div>
                        <div className="flex text-sm">
                          <span className="text-gray-600 dark:text-gray-400 w-24">Invoice #:</span>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">INV-001</span>
                        </div>
                        <div className="flex text-sm">
                          <span className="text-gray-600 dark:text-gray-400 w-24">Date:</span>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">2023-05-15</span>
                        </div>
                        <div className="flex text-sm">
                          <span className="text-gray-600 dark:text-gray-400 w-24">Due Date:</span>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">2023-06-15</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bill To:</div>
                      <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">Customer Name</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Customer Address</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">City, State, ZIP</div>
                    </div>
                    
                    <table className="w-full mb-8 text-sm">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">Item</th>
                          <th className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">Quantity</th>
                          <th className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">Price</th>
                          <th className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">Service A</td>
                          <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">1</td>
                          <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">$1,000.00</td>
                          <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-200">$1,000.00</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 text-gray-800 dark:text-gray-200">Service B</td>
                          <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">2</td>
                          <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">$750.00</td>
                          <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-200">$1,500.00</td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div className="flex justify-end">
                      <div className="w-64">
                        <div className="flex justify-between py-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">$2,500.00</span>
                        </div>
                        <div className="flex justify-between py-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Tax (8%):</span>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">$200.00</span>
                        </div>
                        <div className="flex justify-between py-2 text-sm font-medium border-t border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Total:</span>
                          <span className="text-primary-600 dark:text-primary-400">$2,700.00</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Drag handles for the visual editor */}
                    <div className="absolute top-1/4 right-8 p-1 bg-primary-100 dark:bg-primary-900/20 rounded-full cursor-move opacity-50 hover:opacity-100">
                      <DragHorizontal size={16} className="text-primary-500" />
                    </div>
                    <div className="absolute top-1/3 left-8 p-1 bg-primary-100 dark:bg-primary-900/20 rounded-full cursor-move opacity-50 hover:opacity-100">
                      <DragHorizontal size={16} className="text-primary-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplateDesigner;