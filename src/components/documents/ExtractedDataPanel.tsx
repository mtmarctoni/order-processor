import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { calculateConfidenceColor } from '../../lib/utils';
import { DocumentStatus } from '../../services/documentService';

interface FieldGroup {
  id: string;
  name: string;
  fields: {
    id: string;
    label: string;
    value: string | number | boolean | null;
    confidence?: number;
    verified?: boolean;
  }[];
  expanded: boolean;
}

interface ExtractedDataPanelProps {
  document: DocumentStatus;
}

const ExtractedDataPanel: React.FC<ExtractedDataPanelProps> = ({ document }) => {
  const [groups, setGroups] = useState<FieldGroup[]>(() => {
    if (!document.result) return [];
    
    // Convert the document result into field groups
    const result = document.result;
    return [
      {
        id: 'document_info',
        name: 'Document Information',
        expanded: true,
        fields: [
          { id: 'file_name', label: 'File Name', value: document.file_name },
          { id: 'file_type', label: 'File Type', value: document.file_type },
          { id: 'status', label: 'Status', value: document.status },
          { id: 'uploaded_at', label: 'Uploaded', value: new Date(document.created_at).toLocaleString() },
        ],
      },
      {
        id: 'extracted_data',
        name: 'Extracted Data',
        expanded: true,
        fields: Object.entries(result).map(([key, value]) => ({
          id: key,
          label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          value: value?.toString() || 'N/A',
          confidence: 1, // Default confidence if not provided
        })),
      },
    ];
  });

  const toggleGroup = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, expanded: !group.expanded } 
        : group
    ));
  };

  if (!document) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>No Document Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            Select a document to view its extracted data
          </p>
        </CardContent>
      </Card>
    );
  }

  if (document.status === 'processing') {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Processing Document</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">
              Extracting data from {document.file_name}...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (document.status === 'failed') {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Processing Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Failed to process {document.file_name}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {document.error || 'An unknown error occurred while processing the document.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="border-b">
        <CardTitle>Extracted Data</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {document.file_name} • {new Date(document.updated_at).toLocaleString()}
        </p>
      </CardHeader>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No data extracted from this document.</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span>{group.name}</span>
                {group.expanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {group.expanded && (
                <div className="bg-white dark:bg-gray-900 p-4 space-y-3">
                  {group.fields.map((field) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 py-2">
                      <div className="col-span-5 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}:
                      </div>
                      <div className="col-span-7 text-sm text-gray-900 dark:text-white">
                        {field.value}
                        {field.confidence !== undefined && (
                          <span 
                            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${calculateConfidenceColor(field.confidence)}`}
                          >
                            {Math.round(field.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t flex justify-end space-x-2">
        <Button variant="outline" size="sm">
          Export Data
        </Button>
        <Button variant="default" size="sm">
          Save Changes
        </Button>
      </div>
    </Card>
  );
};

export default ExtractedDataPanel;