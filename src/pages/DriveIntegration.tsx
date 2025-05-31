import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, UploadCloud, FolderOpen, Shield, RefreshCw, CheckCircle, Link } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';

interface FolderMapping {
  id: string;
  source: string;
  destination: string;
  template: string;
  status: 'active' | 'paused' | 'error';
  lastSync: string;
  documentCount: number;
}

const DriveIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  
  // Mock folder mappings
  const [folderMappings, setFolderMappings] = useState<FolderMapping[]>([
    {
      id: '1',
      source: 'Invoices/Incoming',
      destination: 'Processed/Invoices',
      template: 'Invoice Template',
      status: 'active',
      lastSync: '5 minutes ago',
      documentCount: 124
    },
    {
      id: '2',
      source: 'PurchaseOrders',
      destination: 'Processed/POs',
      template: 'Purchase Order Template',
      status: 'active',
      lastSync: '30 minutes ago',
      documentCount: 87
    },
    {
      id: '3',
      source: 'Receipts',
      destination: 'Processed/Receipts',
      template: 'Receipt Template',
      status: 'paused',
      lastSync: '2 hours ago',
      documentCount: 56
    },
    {
      id: '4',
      source: 'Contracts/2023',
      destination: 'Processed/Contracts',
      template: 'Contract Template',
      status: 'error',
      lastSync: '3 days ago',
      documentCount: 12
    }
  ]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success-500';
      case 'paused':
        return 'text-warning-500';
      case 'error':
        return 'text-error-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Google Drive Integration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Set up automated document processing from Google Drive
          </p>
        </div>
        
        <Button
          variant={isConnected ? 'outline' : 'default'}
          leftIcon={isConnected ? <RefreshCw size={16} /> : <Cloud size={16} />}
          onClick={() => setIsConnected(!isConnected)}
        >
          {isConnected ? 'Refresh Connection' : 'Connect to Google Drive'}
        </Button>
      </div>
      
      {isConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Folder Mappings</CardTitle>
                  <Button variant="default" size="sm" leftIcon={<FolderOpen size={16} />}>
                    Add Mapping
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {folderMappings.map((mapping, index) => (
                    <motion.div
                      key={mapping.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            <FolderOpen size={16} className="mr-2 text-primary-500" />
                            {mapping.source}
                            <span className="mx-2 text-gray-400">→</span>
                            <FolderOpen size={16} className="mr-2 text-success-500" />
                            {mapping.destination}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Template: {mapping.template} • Last sync: {mapping.lastSync}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium ${getStatusColor(mapping.status)}`}>
                            {mapping.status.charAt(0).toUpperCase() + mapping.status.slice(1)}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            {mapping.status === 'active' ? 'Pause' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex-1 mr-4">
                          <Progress 
                            value={70} 
                            max={100}
                            color={mapping.status === 'active' ? 'success' : mapping.status === 'paused' ? 'warning' : 'error'}
                            size="sm"
                          />
                        </div>
                        
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {mapping.documentCount} documents
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Connection Status</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-success-100 dark:bg-success-900/20 flex items-center justify-center mr-4">
                    <CheckCircle size={24} className="text-success-500" />
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">
                      Connected
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last verified: 10 minutes ago
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Account</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">business@example.com</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">API Quota</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">68% remaining</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Webhook Status</span>
                    <span className="text-success-500 font-medium">Active</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
                <Button variant="outline" size="sm" className="w-full" leftIcon={<Link size={16} />}>
                  Reconnect Account
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/20 mr-3">
                      <Shield size={16} className="text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        File Validation
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        All files are checked for integrity and scanned for malware
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/20 mr-3">
                      <Shield size={16} className="text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        OAuth 2.0 Security
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Secure authentication with limited scope permissions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/20 mr-3">
                      <Shield size={16} className="text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Data Encryption
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        All data in transit and at rest is encrypted
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                  <UploadCloud size={32} className="text-primary-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Connect to Google Drive
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Link your Google Drive account to automate document processing directly from your cloud storage.
                </p>
                
                <Button 
                  variant="default" 
                  className="w-full"
                  leftIcon={<Cloud size={18} />}
                  onClick={() => setIsConnected(true)}
                >
                  Connect with Google
                </Button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  We'll only request access to the specific folders you choose to integrate with our service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DriveIntegration;