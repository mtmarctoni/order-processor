import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface Activity {
  id: string;
  document: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'error' | 'warning';
  message: string;
}

interface ActivityListProps {
  activities?: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities = [
    {
      id: '1',
      document: 'Invoice-A1234.pdf',
      timestamp: '2 minutes ago',
      status: 'completed',
      message: 'Successfully processed and exported to QuickBooks',
    },
    {
      id: '2',
      document: 'PurchaseOrder-P5678.docx',
      timestamp: '10 minutes ago',
      status: 'warning',
      message: 'Processed with low confidence (68%). Manual review suggested.',
    },
    {
      id: '3',
      document: 'Statement-S9012.xlsx',
      timestamp: '25 minutes ago',
      status: 'processing',
      message: 'Extracting data from document',
    },
    {
      id: '4',
      document: 'Contract-C3456.pdf',
      timestamp: '1 hour ago',
      status: 'error',
      message: 'Failed to process: Unable to read document content',
    },
    {
      id: '5',
      document: 'Receipt-R7890.jpg',
      timestamp: '2 hours ago',
      status: 'completed',
      message: 'Successfully processed and exported to CSV',
    },
  ],
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-success-500" />;
      case 'processing':
        return <Clock size={16} className="text-primary-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-warning-500" />;
      case 'error':
        return <XCircle size={16} className="text-error-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      
      <CardContent className="px-0">
        <div className="space-y-1">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`px-6 py-3 flex items-start hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                index !== activities.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
              }`}
            >
              <div className="mr-3 mt-0.5">{getStatusIcon(activity.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {activity.document}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {activity.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityList;