import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  MoreVertical,
  RefreshCw,
  Pause,
  Play,
  Trash2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';

interface QueueItem {
  id: string;
  filename: string;
  fileType: string;
  status: 'waiting' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  timeRemaining?: string;
  errorMessage?: string;
  timestamp: string;
  size: string;
}

const ProcessingQueue: React.FC = () => {
  // Mock queue data
  const queueItems: QueueItem[] = [
    {
      id: '1',
      filename: 'invoice-2023-Q2.pdf',
      fileType: 'pdf',
      status: 'processing',
      progress: 45,
      timeRemaining: '~1 min',
      timestamp: '2 minutes ago',
      size: '1.2 MB'
    },
    {
      id: '2',
      filename: 'purchase-order-10587.docx',
      fileType: 'docx',
      status: 'waiting',
      progress: 0,
      timestamp: '5 minutes ago',
      size: '450 KB'
    },
    {
      id: '3',
      filename: 'expense-report-march.xlsx',
      fileType: 'xlsx',
      status: 'waiting',
      progress: 0,
      timestamp: '10 minutes ago',
      size: '280 KB'
    },
    {
      id: '4',
      filename: 'receipt-office-supplies.jpg',
      fileType: 'jpg',
      status: 'completed',
      progress: 100,
      timestamp: '15 minutes ago',
      size: '120 KB'
    },
    {
      id: '5',
      filename: 'contract-2023.pdf',
      fileType: 'pdf',
      status: 'failed',
      progress: 20,
      errorMessage: 'Failed to extract content: Password protected document',
      timestamp: '30 minutes ago',
      size: '3.5 MB'
    },
    {
      id: '6',
      filename: 'statement-january.pdf',
      fileType: 'pdf',
      status: 'paused',
      progress: 60,
      timestamp: '45 minutes ago',
      size: '850 KB'
    }
  ];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} className="text-success-500" />;
      case 'processing':
        return <Clock size={18} className="text-primary-500" />;
      case 'waiting':
        return <Clock size={18} className="text-gray-500" />;
      case 'failed':
        return <XCircle size={18} className="text-error-500" />;
      case 'paused':
        return <Pause size={18} className="text-warning-500" />;
      default:
        return <FileText size={18} className="text-gray-500" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'waiting':
        return 'Waiting';
      case 'failed':
        return 'Failed';
      case 'paused':
        return 'Paused';
      default:
        return status;
    }
  };
  
  const getActionButton = (item: QueueItem) => {
    switch (item.status) {
      case 'paused':
        return (
          <Button 
            variant="ghost" 
            size="sm"
            leftIcon={<Play size={14} />}
          >
            Resume
          </Button>
        );
      case 'processing':
        return (
          <Button 
            variant="ghost" 
            size="sm"
            leftIcon={<Pause size={14} />}
          >
            Pause
          </Button>
        );
      case 'failed':
        return (
          <Button 
            variant="ghost" 
            size="sm"
            leftIcon={<RefreshCw size={14} />}
          >
            Retry
          </Button>
        );
      case 'waiting':
        return (
          <Button 
            variant="ghost" 
            size="sm"
            leftIcon={<Trash2 size={14} />}
          >
            Remove
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Processing Queue
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage document processing tasks
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>
          <Button
            variant="default"
            leftIcon={<Pause size={16} />}
          >
            Pause All
          </Button>
        </div>
      </div>
      
      <Card className="flex-1">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Queue Status</CardTitle>
            <div className="flex items-center space-x-2 text-sm">
              <span className="flex items-center text-primary-500 font-medium">
                <Clock size={14} className="mr-1" />
                Processing: 1
              </span>
              <span className="flex items-center text-gray-500 dark:text-gray-400 font-medium">
                <Clock size={14} className="mr-1" />
                Waiting: 2
              </span>
              <span className="flex items-center text-success-500 font-medium">
                <CheckCircle size={14} className="mr-1" />
                Completed: 1
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {queueItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getStatusIcon(item.status)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.filename}
                      </h3>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.fileType.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.size}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Uploaded {item.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getActionButton(item)}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-1 mr-4">
                    <Progress 
                      value={item.progress} 
                      max={100}
                      color={
                        item.status === 'completed' 
                          ? 'success' 
                          : item.status === 'failed' 
                          ? 'error' 
                          : item.status === 'paused'
                          ? 'warning'
                          : 'default'
                      }
                      size="sm"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[40px] text-right">
                      {item.progress}%
                    </span>
                    
                    {item.status === 'processing' && item.timeRemaining && (
                      <span className="ml-4 text-xs text-gray-500 dark:text-gray-400 min-w-[60px]">
                        {item.timeRemaining}
                      </span>
                    )}
                    
                    <span className="ml-4 text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
                
                {item.errorMessage && (
                  <div className="mt-2 text-xs text-error-500 flex items-center">
                    <AlertTriangle size={12} className="mr-1" />
                    {item.errorMessage}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
            Showing 6 items in queue • Completed items are removed after 24 hours
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingQueue;