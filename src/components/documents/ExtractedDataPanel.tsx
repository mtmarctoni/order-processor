import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { calculateConfidenceColor } from '../../lib/utils';

// Mock data structure for extracted fields
interface ExtractedField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  verified: boolean;
}

interface FieldGroup {
  id: string;
  name: string;
  fields: ExtractedField[];
  expanded: boolean;
}

interface ExtractedDataPanelProps {
  isProcessing?: boolean;
}

const ExtractedDataPanel: React.FC<ExtractedDataPanelProps> = ({ isProcessing = false }) => {
  // Mock data
  const initialGroups: FieldGroup[] = [
    {
      id: 'header',
      name: 'Document Information',
      expanded: true,
      fields: [
        { id: 'invoice_number', label: 'Invoice Number', value: 'INV-2023-05-12', confidence: 0.95, verified: true },
        { id: 'date', label: 'Date', value: '2023-05-12', confidence: 0.92, verified: true },
        { id: 'due_date', label: 'Due Date', value: '2023-06-12', confidence: 0.91, verified: false },
        { id: 'po_number', label: 'PO Number', value: 'PO-98765', confidence: 0.88, verified: false },
      ],
    },
    {
      id: 'customer',
      name: 'Customer Details',
      expanded: true,
      fields: [
        { id: 'customer_name', label: 'Customer Name', value: 'Acme Corporation', confidence: 0.89, verified: false },
        { id: 'customer_address', label: 'Address', value: '123 Business Ave, Suite 100', confidence: 0.76, verified: false },
        { id: 'customer_city', label: 'City', value: 'San Francisco', confidence: 0.94, verified: true },
        { id: 'customer_zipcode', label: 'Zip Code', value: '94107', confidence: 0.97, verified: true },
      ],
    },
    {
      id: 'financial',
      name: 'Financial Details',
      expanded: false,
      fields: [
        { id: 'subtotal', label: 'Subtotal', value: '$2,450.00', confidence: 0.96, verified: true },
        { id: 'tax', label: 'Tax', value: '$196.00', confidence: 0.93, verified: false },
        { id: 'total', label: 'Total Amount', value: '$2,646.00', confidence: 0.97, verified: true },
        { id: 'payment_terms', label: 'Payment Terms', value: 'Net 30', confidence: 0.65, verified: false },
      ],
    },
  ];

  const [fieldGroups, setFieldGroups] = useState<FieldGroup[]>(initialGroups);

  const toggleGroupExpansion = (groupId: string) => {
    setFieldGroups(
      fieldGroups.map((group) =>
        group.id === groupId ? { ...group, expanded: !group.expanded } : group
      )
    );
  };

  const toggleFieldVerification = (groupId: string, fieldId: string) => {
    setFieldGroups(
      fieldGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            fields: group.fields.map((field) =>
              field.id === fieldId ? { ...field, verified: !field.verified } : field
            ),
          };
        }
        return group;
      })
    );
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Extracted Data</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0">
        {isProcessing ? (
          <div className="h-full flex items-center justify-center p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Processing document... Extracted data will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {fieldGroups.map((group) => (
              <div key={group.id} className="py-2">
                <button
                  onClick={() => toggleGroupExpansion(group.id)}
                  className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {group.name}
                  </span>
                  {group.expanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
                
                {group.expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 py-2 space-y-3"
                  >
                    {group.fields.map((field) => (
                      <div
                        key={field.id}
                        className="flex flex-col p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                              {field.label}
                            </span>
                            <span className={`text-xs ${calculateConfidenceColor(field.confidence)}`}>
                              {Math.round(field.confidence * 100)}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleFieldVerification(group.id, field.id)}
                              className={`p-1 rounded-full ${
                                field.verified
                                  ? 'bg-success-100 dark:bg-success-900/20 text-success-500'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                              }`}
                              aria-label={field.verified ? 'Mark as unverified' : 'Mark as verified'}
                            >
                              <Check size={14} />
                            </button>
                            <button
                              className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                              aria-label="Edit field"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={field.value}
                            className="w-full text-sm border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900"
                            readOnly
                          />
                        </div>
                        {field.confidence < 0.8 && (
                          <div className="mt-2 flex items-center text-xs text-warning-500">
                            <AlertCircle size={12} className="mr-1" />
                            Low confidence detection. Please verify.
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {!isProcessing && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              12 fields detected (8 verified)
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Button variant="default" size="sm">
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ExtractedDataPanel;