import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, ChevronRight, Settings, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import FileUploader from '../components/documents/FileUploader';

interface TemplateConfig {
  name: string;
  description: string;
  documentType: 'invoice' | 'purchase_order' | 'receipt' | 'custom';
  fields: {
    id: string;
    name: string;
    type: 'text' | 'number' | 'date' | 'currency';
    required: boolean;
    aiRules: {
      keywords: string[];
      position: 'header' | 'body' | 'footer';
      validation?: string;
    };
  }[];
}

const TemplateUpload: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [config, setConfig] = useState<TemplateConfig>({
    name: '',
    description: '',
    documentType: 'invoice',
    fields: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      setTemplateFile(files[0]);
      setIsProcessing(true);
      
      // Simulate template analysis
      setTimeout(() => {
        setIsProcessing(false);
        setConfig({
          name: 'Invoice Template',
          description: 'Standard invoice processing template',
          documentType: 'invoice',
          fields: [
            {
              id: 'invoice_number',
              name: 'Invoice Number',
              type: 'text',
              required: true,
              aiRules: {
                keywords: ['Invoice #', 'Invoice Number', 'No.'],
                position: 'header',
                validation: '^[A-Z0-9-]+$'
              }
            },
            {
              id: 'date',
              name: 'Invoice Date',
              type: 'date',
              required: true,
              aiRules: {
                keywords: ['Date', 'Invoice Date'],
                position: 'header'
              }
            },
            {
              id: 'total',
              name: 'Total Amount',
              type: 'currency',
              required: true,
              aiRules: {
                keywords: ['Total', 'Amount Due', 'Balance Due'],
                position: 'footer'
              }
            }
          ]
        });
        setStep(2);
      }, 2000);
    }
  };

  const handleSaveTemplate = async () => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      if (templateFile) {
        formData.append('file', templateFile);
      }
      formData.append('config', JSON.stringify(config));
      
      const response = await fetch('/api/templates', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to save template');
      }
      
      setStep(3);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Processing Template
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload a sample document and configure AI processing rules
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center w-full max-w-3xl mx-auto">
          <div className="w-full flex items-center">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="relative flex items-center justify-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                      step === s
                        ? 'bg-primary-500 text-white'
                        : step > s
                        ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  <span className={`absolute -bottom-6 whitespace-nowrap text-xs font-medium ${
                    step === s 
                      ? 'text-primary-500' 
                      : step > s
                      ? 'text-success-500'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {s === 1 ? 'Upload Template' : s === 2 ? 'Configure Rules' : 'Review & Save'}
                  </span>
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 ${
                    step > s ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <motion.div
          key={`step-${step}-left`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col"
        >
          {step === 1 ? (
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Upload Template Document</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploader
                  onFilesAdded={handleFileUpload}
                  acceptedFileTypes={['pdf', 'docx', 'xlsx']}
                  maxFiles={1}
                />
              </CardContent>
            </Card>
          ) : step === 2 ? (
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Template Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Document Type
                  </label>
                  <select
                    value={config.documentType}
                    onChange={(e) => setConfig({ ...config, documentType: e.target.value as any })}
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="invoice">Invoice</option>
                    <option value="purchase_order">Purchase Order</option>
                    <option value="receipt">Receipt</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fields Configuration
                  </label>
                  <div className="space-y-4">
                    {config.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {field.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Settings size={14} />}
                          >
                            Configure
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium mr-2">Type:</span>
                            {field.type}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium mr-2">Keywords:</span>
                            {field.aiRules.keywords.join(', ')}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium mr-2">Position:</span>
                            {field.aiRules.position}
                          </div>
                          {field.aiRules.validation && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-medium mr-2">Validation:</span>
                              {field.aiRules.validation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Template Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Template Details
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Name
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-white mt-1">
                          {config.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Description
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-white mt-1">
                          {config.description}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Document Type
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-white mt-1">
                          {config.documentType}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Fields ({config.fields.length})
                    </h3>
                    <div className="space-y-4">
                      {config.fields.map((field) => (
                        <div
                          key={field.id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            {field.name}
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Type:</span>
                              <span className="ml-2 text-gray-900 dark:text-white">
                                {field.type}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Required:</span>
                              <span className="ml-2 text-gray-900 dark:text-white">
                                {field.required ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div
          key={`step-${step}-right`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col"
        >
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>
                {step === 1 ? 'Template Preview' : step === 2 ? 'AI Processing Rules' : 'Processing Test'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && !templateFile && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <FileText size={24} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Template Selected
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload a template document to preview and configure processing rules
                  </p>
                </div>
              )}

              {step === 1 && templateFile && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                    <Upload size={24} className="text-primary-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Analyzing Template
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Our AI is analyzing your template to suggest processing rules
                  </p>
                  {isProcessing && (
                    <div className="w-full max-w-xs">
                      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle size={20} className="text-warning-500 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-warning-800 dark:text-warning-300">
                          AI Processing Recommendations
                        </h4>
                        <p className="text-sm text-warning-700 dark:text-warning-400 mt-1">
                          Based on the template analysis, we've suggested optimal processing rules.
                          Review and adjust as needed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Processing Configuration
                    </h4>
                    
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Enable smart field detection
                        </span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Auto-correct common OCR errors
                        </span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Validate extracted data
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Confidence Thresholds
                    </h4>
                    
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Minimum confidence score
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="80"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Less strict</span>
                        <span>More strict</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/20 flex items-center justify-center mb-4">
                    <FileText size={24} className="text-success-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Template Ready
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Your template has been configured and is ready for processing documents
                  </p>
                  <Button
                    variant="default"
                    leftIcon={<ChevronRight size={16} />}
                  >
                    Start Processing Documents
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(step > 1 ? (step - 1) as 1 | 2 | 3 : 1)}
          disabled={step === 1}
        >
          Back
        </Button>
        
        <Button
          variant="default"
          leftIcon={step === 3 ? <Save size={16} /> : undefined}
          rightIcon={step !== 3 ? <ChevronRight size={16} /> : undefined}
          onClick={() => {
            if (step === 3) {
              handleSaveTemplate();
            } else {
              setStep((step + 1) as 1 | 2 | 3);
            }
          }}
          disabled={step === 1 && !templateFile}
        >
          {step === 3 ? 'Save Template' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default TemplateUpload;