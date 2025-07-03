import React, { useState } from 'react';
import { Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import FileUploader from '../components/documents/FileUploader';
import ExtractedDataPanel from '../components/documents/ExtractedDataPanel';
import { documentService, DocumentStatus } from '../services/documentService';
import { useNavigate } from 'react-router-dom';

const DocumentUpload: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentStatus | null>(null);
  const [processingJobs, setProcessingJobs] = useState<Record<string, DocumentStatus>>({});

  const handleFilesAdded = async (files: File[]) => {
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
  
  const handleProceedToProcessing = () => {
    navigate('/process');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Document Upload
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload your documents for processing
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 gap-6">
        {/* Left Column - Upload and Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium">Upload Documents</h2>
            </div>
            <FileUploader 
              onFilesAdded={handleFilesAdded} 
              isProcessing={isProcessing} 
            />
          </div>
          
          {/* Status Section */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h2 className="text-lg font-medium">Document Status</h2>
              </div>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => {
                  const job = processingJobs[file.name];
                  const isCompleted = job?.status === 'completed';
                  const isError = job?.status === 'error';
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDocument?.file_name === file.name 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => job && setSelectedDocument(job)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : isError ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className="font-medium truncate">{file.name}</span>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          !job ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          isCompleted ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          isError ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {!job ? 'Pending' : job.status}
                        </span>
                      </div>
                      {job?.updated_at && (
                        <div className="text-xs text-gray-500 mt-1 ml-7">
                          {isCompleted ? 'Completed: ' : 'Last updated: '} 
                          {new Date(job.updated_at).toLocaleString()}
                        </div>
                      )}
                      {isError && job.error && (
                        <div className="text-xs text-red-500 mt-1 ml-7 truncate">
                          Error: {job.error}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Extracted Data */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-medium">Extracted Data</h2>
            </div>
            
            {selectedDocument ? (
              <div className="space-y-4">
                <ExtractedDataPanel document={selectedDocument} />
                {selectedDocument.status === 'completed' && (
                  <Button 
                    className="w-full mt-4"
                    onClick={handleProceedToProcessing}
                  >
                    Process Document
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a document to view extracted data
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
