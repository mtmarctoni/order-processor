import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/select';
import FileUploader from '../components/documents/FileUploader';
import ExtractedDataPanel from '../components/documents/ExtractedDataPanel';
import { documentService, DocumentStatus } from '../services/documentService';
import { Template } from '../types/template';
import { templateService } from '../services/templateService';

const DocumentUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<DocumentStatus | null>(null);
  const [processingJobs, setProcessingJobs] = useState<Record<string, DocumentStatus>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  
  const totalSteps = 3;

  useEffect(() => {
    loadTemplates();
  }, []);
  
  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const templates = await templateService.getTemplates();
      setTemplates(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleFilesAdded = async (files: File[]) => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }
    
    const newFiles = [...uploadedFiles, ...files];
    setUploadedFiles(newFiles);
    
    // Process each file
    for (const file of files) {
      try {
        setIsProcessing(true);
        const response = await documentService.uploadDocument(file);
        
        // Track the processing job
        setProcessingJobs(prev => ({
          ...prev,
          [file.name]: {
            id: response.jobId,
            status: 'processing',
            file_name: file.name,
            file_type: file.type,
            error: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }));
        
        // Start polling for status
        pollDocumentStatus(response.jobId, file.name);
      } catch (error) {
        console.error('Error uploading file:', error);
        // Update UI to show error
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const pollDocumentStatus = async (jobId: string, fileName: string) => {
    try {
      const status = await documentService.getDocumentStatus(jobId);
      
      setProcessingJobs(prev => ({
        ...prev,
        [fileName]: {
          ...prev[fileName],
          ...status,
          updated_at: new Date().toISOString(),
        }
      }));

      // If still processing, poll again after delay
      if (status.status === 'processing') {
        setTimeout(() => pollDocumentStatus(jobId, fileName), 2000);
      } else if (status.status === 'completed') {
        // Set as selected document when processing is complete
        setSelectedDocument(status);
      }
    } catch (error) {
      console.error('Error polling document status:', error);
    }
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Document Upload & Processing
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload documents for AI-powered extraction and processing
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
{!isLoadingTemplates && (
<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
<div className="space-y-2">
<label htmlFor="template-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
Select Template
</label>
<Select
  id="template-select"
  value={selectedTemplate}
  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTemplate(e.target.value)}
    options={templates.map((template) => ({
    value: template.id,
    label: `${template.name} (${template.type})`,
    }))}
  placeholder="Select a template"
  className="w-full"
/>
<p className="text-xs text-gray-500 dark:text-gray-400">
Choose a template to define how the document should be processed
</p>
</div>
</div>
)}
          <FileUploader 
            onFilesAdded={handleFilesAdded} 
            isProcessing={isProcessing} 
          />
          
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Uploaded Documents</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => {
                  const job = processingJobs[file.name];
                  return (
                    <div 
                      key={index} 
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => job && setSelectedDocument(job)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium truncate">{file.name}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          !job ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          job.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {!job ? 'Pending' : job.status}
                        </span>
                      </div>
                      {job?.updated_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(job.updated_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedDocument ? (
            <ExtractedDataPanel document={selectedDocument} />
          ) : (
            <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select a document to view extracted data
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          leftIcon={<ChevronLeft size={16} />}
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={nextStep}
          rightIcon={<ChevronRight size={16} />}
          disabled={!selectedDocument || selectedDocument.status !== 'completed'}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;
