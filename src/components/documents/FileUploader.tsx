import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatBytes } from '../../lib/utils';

// Map of file extensions to MIME types
const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xls': 'application/vnd.ms-excel',
};

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  isProcessing?: boolean;
  disabled?: boolean;
  acceptedFileTypes?: string[]; // e.g. ['.pdf', '.xlsx']
  maxFiles?: number;
  maxSize?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAdded,
  isProcessing = false,
  acceptedFileTypes = ['.pdf', '.xlsx', '.xls'],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
}) => {
  const [fileErrors, setFileErrors] = React.useState<{ [key: string]: string }>({});

  // Convert extensions to MIME types for react-dropzone
  const acceptedMimeTypes = React.useMemo(() => {
    const result: Record<string, string[]> = {};
    
    acceptedFileTypes.forEach(ext => {
      const mimeType = MIME_TYPES[ext.toLowerCase()];
      if (mimeType) {
        if (!result[mimeType]) {
          result[mimeType] = [];
        }
        result[mimeType].push(ext);
      }
    });
    
    return result;
  }, [acceptedFileTypes]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle accepted files
      const validFiles = acceptedFiles.filter((file) =>
        acceptedFileTypes.some(ext => 
          file.name.toLowerCase().endsWith(ext.toLowerCase())
        )
      );

      // Update file errors for rejected files
      const errors: { [key: string]: string } = {};
      
      rejectedFiles.forEach(({ file, errors: fileErrors }) => {
        if (fileErrors.some((e: { code: string; }) => e.code === 'file-too-large')) {
          errors[file.name] = `File is too large. Max size is ${formatBytes(maxSize)}.`;
        } else if (fileErrors.some((e: { code: string; }) => e.code === 'too-many-files')) {
          errors[file.name] = `Too many files. Maximum ${maxFiles} files allowed.`;
        } else {
          errors[file.name] = `Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`;
        }
      });

      // Check file types manually since dropzone might not catch all
      acceptedFiles.forEach((file) => {
        if (!acceptedFileTypes.some(ext => file.name.toLowerCase().endsWith(ext.toLowerCase()))) {
          errors[file.name] = `File type not supported. Accepted: ${acceptedFileTypes.join(', ')}`;
        }
      });

      setFileErrors(errors);
      
      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    },
    [onFilesAdded, acceptedFileTypes, maxSize, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes,
    maxSize,
    maxFiles,
    disabled: isProcessing,
  });

  const acceptedTypesText = acceptedFileTypes.map(ext => ext.toUpperCase().replace('.', '')).join(', ');

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isDragActive ? 'Drop the files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isProcessing
              ? 'Processing files...'
              : `Supported formats: ${acceptedTypesText}. Max size: ${formatBytes(maxSize)}`}
          </p>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={(e) => e.stopPropagation()}
            >
              Select Files
            </Button>
          </div>
        </div>
      </div>

      {Object.keys(fileErrors).length > 0 && (
        <div className="space-y-2">
          {Object.entries(fileErrors).map(([fileName, error]) => (
            <div key={fileName} className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error with {fileName}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;