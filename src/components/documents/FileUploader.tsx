import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatBytes, isValidFileType, getFileIcon } from '../../lib/utils';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxSize?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAdded,
  acceptedFileTypes = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png'],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({});

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle accepted files
      const validFiles = acceptedFiles.filter((file) =>
        isValidFileType(file, acceptedFileTypes)
      );

      // Update file errors for rejected files
      const errors: { [key: string]: string } = {};
      rejectedFiles.forEach((rejected) => {
        errors[rejected.file.name] = rejected.errors[0].message;
      });

      // Check file types manually since dropzone might not catch all
      acceptedFiles.forEach((file) => {
        if (!isValidFileType(file, acceptedFileTypes)) {
          errors[file.name] = `File type not supported. Accepted: ${acceptedFileTypes.join(', ')}`;
        }
      });

      // Check if we're exceeding max files
      if (files.length + validFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }

      setFileErrors(errors);
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      onFilesAdded(validFiles);
    },
    [acceptedFileTypes, files.length, maxFiles, onFilesAdded]
  );

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    
    // Remove from errors if exists
    if (fileErrors[fileToRemove.name]) {
      const newErrors = { ...fileErrors };
      delete newErrors[fileToRemove.name];
      setFileErrors(newErrors);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    multiple: true,
  });

  const IconComponent = (filename: string) => {
    const iconName = getFileIcon(filename);
    switch (iconName) {
      case 'file-text':
        return <FileText size={24} className="text-primary-500" />;
      case 'file-spreadsheet':
        return <FileText size={24} className="text-success-500" />;
      case 'image':
        return <FileText size={24} className="text-accent-500" />;
      default:
        return <FileText size={24} className="text-gray-500" />;
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <Upload
              size={24}
              className="text-primary-500 dark:text-primary-400"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              or <span className="text-primary-500">browse</span> to upload
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Supported formats: {acceptedFileTypes.join(', ')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Max size: {formatBytes(maxSize)}
          </div>
        </div>
      </div>

      {(files.length > 0 || Object.keys(fileErrors).length > 0) && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={`${file.name}-${file.size}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                >
                  <div className="flex items-center">
                    {IconComponent(file.name)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}

              {Object.entries(fileErrors).map(([fileName, error]) => (
                <motion.div
                  key={fileName}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-md"
                >
                  <div className="flex items-center">
                    <AlertCircle size={24} className="text-error-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-error-700 dark:text-error-300 max-w-xs truncate">
                        {fileName}
                      </p>
                      <p className="text-xs text-error-600 dark:text-error-400">
                        {error}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newErrors = { ...fileErrors };
                      delete newErrors[fileName];
                      setFileErrors(newErrors);
                    }}
                    className="p-1 rounded-full hover:bg-error-100 dark:hover:bg-error-800 text-error-500"
                    aria-label="Dismiss error"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {files.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="default"
                size="sm"
                leftIcon={<CheckCircle2 size={16} />}
                className="ml-auto"
              >
                Process Files
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;