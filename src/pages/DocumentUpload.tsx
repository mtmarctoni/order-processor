import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, ListFilter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import FileUploader from '../components/documents/FileUploader';
import DocumentPreview from '../components/documents/DocumentPreview';
import ExtractedDataPanel from '../components/documents/ExtractedDataPanel';

const DocumentUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | undefined>(undefined);
  
  const handleFilesAdded = (files: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    
    // Simulate processing when files are added
    if (files.length > 0) {
      setIsProcessing(true);
      
      // Mock processing delay
      setTimeout(() => {
        setIsProcessing(false);
        setSelectedDocumentUrl('https://images.pexels.com/photos/3760093/pexels-photo-3760093.jpeg');
      }, 3000);
    }
  };
  
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Document Upload & Processing
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Upload documents for AI-powered extraction and processing
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ListFilter size={16} />}
          >
            Filters
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center w-full max-w-3xl mx-auto">
          <div className="w-full flex items-center">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="relative flex items-center justify-center flex-1">
                  <button
                    onClick={() => step < currentStep && setCurrentStep(step)}
                    disabled={step > currentStep}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                      currentStep === step
                        ? 'bg-primary-500 text-white'
                        : currentStep > step
                        ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {step}
                  </button>
                  
                  <span className={`absolute -bottom-6 whitespace-nowrap text-xs font-medium ${
                    currentStep === step 
                      ? 'text-primary-500' 
                      : currentStep > step
                      ? 'text-success-500'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step === 1 ? 'Upload' : step === 2 ? 'Extract & Verify' : 'Export'}
                  </span>
                </div>
                
                {step < 3 && (
                  <div className={`flex-1 h-1 ${
                    currentStep > step ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <motion.div
          key={`step-${currentStep}-left`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col"
        >
          {currentStep === 1 ? (
            <FileUploader onFilesAdded={handleFilesAdded} />
          ) : (
            <DocumentPreview 
              documentUrl={selectedDocumentUrl} 
              isProcessing={isProcessing} 
            />
          )}
        </motion.div>
        
        <motion.div
          key={`step-${currentStep}-right`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col"
        >
          {currentStep === 1 ? (
            <DocumentPreview 
              documentUrl={selectedDocumentUrl} 
              isProcessing={isProcessing} 
            />
          ) : (
            <ExtractedDataPanel isProcessing={isProcessing} />
          )}
        </motion.div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button 
          variant="outline" 
          leftIcon={<ChevronLeft size={16} />}
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <Button 
          rightIcon={<ChevronRight size={16} />}
          onClick={nextStep}
          disabled={currentStep === 3 || isProcessing || (!uploadedFiles.length && currentStep === 1)}
        >
          {currentStep === 3 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;