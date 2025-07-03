import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { documentService, DocumentStatus } from '../services/documentService';
import { Template } from '../types/template';
import { templateService } from '../services/templateService';

const ProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentStatus | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  // Load documents from the server using services API
  useEffect(() => {
    const getDocs = async () => {
      const docs = await documentService.getAllDocuments();
      setDocuments(docs);
    };
    getDocs();
  }, []);

  useEffect(() => {
    const getTemplates = async () => {
      const templates = await templateService.getTemplates();
      setTemplates(templates);
    };
    getTemplates();
  }, []);

  const handleProcess = () => {
    if (!selectedDocument || !selectedTemplate) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      // Generate a mock download URL
      setDownloadUrl(URL.createObjectURL(new Blob(['Mock processed document content'], { type: 'application/pdf' })));
    }, 2000);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `processed_${selectedDocument?.file_name || 'document'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Process Document</h1>
        <div className="w-24"></div> {/* For alignment */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary-500" />
              Select Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDocument?.id === doc.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{doc.file_name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {doc.file_type.toUpperCase()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No documents available. Please upload documents first.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary-500" />
              Select Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.fields.slice(0, 3).map((field) => (
                      <span
                        key={field.id}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                      >
                        {field.name}
                      </span>
                    ))}
                    {template.fields.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        +{template.fields.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="min-h-48 flex items-center justify-center">
          {selectedDocument && selectedTemplate ? (
            <div className="text-center">
              <p className="text-gray-500">
                Preview of {selectedDocument.file_name} with {selectedTemplate.name} template
              </p>
              <div className="mt-4 p-4 border border-dashed rounded-lg">
                <h3 className="font-medium">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Document: {selectedDocument.file_name}
                </p>
                {/* Add more preview details as needed */}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Select a document and template to see a preview
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/upload')}>
          Back to Upload
        </Button>
        {isComplete ? (
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Processed Document
          </Button>
        ) : (
          <Button
            onClick={handleProcess}
            disabled={!selectedDocument || !selectedTemplate || isProcessing}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Process Document'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProcessingPage;
