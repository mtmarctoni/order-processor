import React from 'react';
import { FileText, FileCheck, AlertTriangle, Users, FileSpreadsheet, Clock } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ActivityList from '../components/dashboard/ActivityList';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';

const Dashboard: React.FC = () => {
  // Mock data for document processing stats
  const documentStats = [
    { id: 1, type: 'PDF', count: 120, percentage: 48 },
    { id: 2, type: 'DOCX', count: 65, percentage: 26 },
    { id: 3, type: 'XLSX', count: 35, percentage: 14 },
    { id: 4, type: 'JPG/PNG', count: 30, percentage: 12 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Documents Processed"
          value="1,254"
          icon={<FileText size={24} className="text-primary-500" />}
          change={{ value: 12.5, trend: 'up' }}
          description="Last 30 days"
        />
        
        <StatCard
          title="Success Rate"
          value="95.2%"
          icon={<FileCheck size={24} className="text-success-500" />}
          change={{ value: 3.1, trend: 'up' }}
          description="Last 30 days"
        />
        
        <StatCard
          title="Review Required"
          value="24"
          icon={<AlertTriangle size={24} className="text-warning-500" />}
          change={{ value: 5.8, trend: 'down' }}
          description="Documents pending review"
        />
        
        <StatCard
          title="Active Users"
          value="18"
          icon={<Users size={24} className="text-secondary-500" />}
          description="Using the system today"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Processing by Document Type</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {documentStats.map((stat) => (
                  <div key={stat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <FileSpreadsheet size={16} className="mr-2 text-primary-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {stat.type}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.count} documents
                      </span>
                    </div>
                    <Progress 
                      value={stat.percentage} 
                      max={100} 
                      color={stat.id === 1 ? 'default' : stat.id === 2 ? 'success' : stat.id === 3 ? 'warning' : 'error'}
                      size="md"
                      showValue
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Processing Queue</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mr-4">
                    <Clock size={24} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Documents in queue
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Estimated completion
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      ~12 minutes
                    </span>
                  </div>
                  <Progress value={30} size="sm" />
                </div>
                
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mr-3">
                      <FileText size={16} className="text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        invoice-q2-2023.pdf
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Processing now
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <FileText size={16} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        purchase-order-123.docx
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Waiting in queue
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <ActivityList />
      </div>
    </div>
  );
};

export default Dashboard;