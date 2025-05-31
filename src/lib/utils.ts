import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormatter().format(date);
};

export const truncateString = (str: string, num: number) => {
  if (str.length <= num) return str;
  return str.slice(0, num) + '...';
};

export const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toLowerCase();
};

export const isValidFileType = (file: File, acceptedTypes: string[]) => {
  const fileExtension = getFileExtension(file.name) || '';
  return acceptedTypes.includes(fileExtension);
};

export const getFileIcon = (filename: string) => {
  const extension = getFileExtension(filename);
  
  switch (extension) {
    case 'pdf':
      return 'file-text';
    case 'docx':
    case 'doc':
      return 'file-text';
    case 'xlsx':
    case 'xls':
      return 'file-spreadsheet';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    default:
      return 'file';
  }
};

export const calculateConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9) return 'text-success-500';
  if (confidence >= 0.7) return 'text-warning-500';
  return 'text-error-500';
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));