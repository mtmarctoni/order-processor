import React from 'react';
import { motion } from 'framer-motion';
import { File, Search, Download, Share2, RotateCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface DocumentPreviewProps {
  documentUrl?: string;
  documentType?: string;
  isProcessing?: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentUrl,
  documentType = 'pdf',
  isProcessing = false,
}) => {
  // Mock highlighted fields for the preview
  const highlightedFields = [
    { id: 1, top: '15%', left: '10%', width: '25%', height: '5%', label: 'Invoice Number', confidence: 0.95 },
    { id: 2, top: '25%', left: '70%', width: '20%', height: '4%', label: 'Date', confidence: 0.92 },
    { id: 3, top: '35%', left: '10%', width: '40%', height: '8%', label: 'Customer Name', confidence: 0.88 },
    { id: 4, top: '50%', left: '70%', width: '20%', height: '4%', label: 'Total Amount', confidence: 0.97 },
    { id: 5, top: '65%', left: '10%', width: '80%', height: '15%', label: 'Line Items', confidence: 0.75 },
  ];

  return (
    <Card className="w-full h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <File size={20} className="text-gray-500 dark:text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Document Preview
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" leftIcon={<Search size={16} />}>
            Zoom
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Download size={16} />}>
            Download
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Share2 size={16} />}>
            Share
          </Button>
        </div>
      </div>
      
      <CardContent className="flex-1 p-0 relative overflow-hidden">
        {documentUrl ? (
          <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800">
            {/* This would be replaced with an actual document viewer component */}
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src="https://images.pexels.com/photos/3760093/pexels-photo-3760093.jpeg" 
                alt="Document preview" 
                className="max-h-full object-contain"
              />
              
              {/* Highlight boxes for extracted fields */}
              {!isProcessing && highlightedFields.map((field) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: field.id * 0.1 }}
                  className="absolute border-2 border-primary-500 bg-primary-100/30 dark:bg-primary-900/30 rounded-sm cursor-pointer hover:bg-primary-100/50 dark:hover:bg-primary-900/50 transition-colors"
                  style={{
                    top: field.top,
                    left: field.left,
                    width: field.width,
                    height: field.height,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-white dark:bg-gray-800 text-xs font-medium px-2 py-1 rounded shadow-sm border border-gray-200 dark:border-gray-700">
                    {field.label} ({Math.round(field.confidence * 100)}%)
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            {isProcessing ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                  <RotateCw size={24} className="text-primary-500 dark:text-primary-400 animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Processing Document</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                  Our AI is analyzing your document. This may take a moment depending on the document complexity.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <File size={24} className="text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Document Selected</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                  Upload a document or select one from your library to preview and process it.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;