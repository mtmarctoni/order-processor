import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Lock, Bell, Database, CreditCard, Laptop, Moon, RefreshCw, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'account', label: 'Account', icon: <CreditCard size={16} /> },
    { id: 'security', label: 'Security', icon: <Lock size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'api', label: 'API Keys', icon: <Database size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Laptop size={16} /> },
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account and application preferences
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        <Card className="md:w-64 shrink-0">
          <CardContent className="p-0">
            <nav className="space-y-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-gray-500 dark:text-gray-400">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-white">
                      JP
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        JPG, GIF or PNG. Max size 1MB.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        defaultValue="Operations Manager"
                        className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        defaultValue="Acme Corporation"
                        className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
                  <Button variant="default" leftIcon={<Save size={16} />}>
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {activeTab === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Theme
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        onClick={() => setDarkMode(false)}
                        className={`border ${
                          !darkMode 
                            ? 'border-primary-500 ring-2 ring-primary-500/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        } rounded-lg overflow-hidden cursor-pointer`}
                      >
                        <div className="h-24 bg-white"></div>
                        <div className="p-3 flex items-center justify-between bg-gray-50">
                          <span className="text-sm font-medium text-gray-900">Light</span>
                          {!darkMode && <Check size={16} className="text-primary-500" />}
                        </div>
                      </div>
                      
                      <div
                        onClick={() => setDarkMode(true)}
                        className={`border ${
                          darkMode 
                            ? 'border-primary-500 ring-2 ring-primary-500/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        } rounded-lg overflow-hidden cursor-pointer`}
                      >
                        <div className="h-24 bg-gray-900"></div>
                        <div className="p-3 flex items-center justify-between bg-gray-800">
                          <span className="text-sm font-medium text-white">Dark</span>
                          {darkMode && <Check size={16} className="text-primary-500" />}
                        </div>
                      </div>
                      
                      <div
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer"
                      >
                        <div className="h-24 bg-gradient-to-b from-white to-gray-900"></div>
                        <div className="p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Density
                    </h3>
                    
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="density"
                          defaultChecked
                          className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Comfortable</span>
                      </label>
                      
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="density"
                          className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Compact</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Accent Color
                    </h3>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500 ring-2 ring-offset-2 ring-primary-500 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-indigo-500 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
                  <Button variant="default" leftIcon={<RefreshCw size={16} />}>
                    Reset to Defaults
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Change Password
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <Button variant="default">Update Password</Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Two-Factor Authentication
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Add an extra layer of security to your account
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          We'll ask for a verification code in addition to your password
                        </p>
                      </div>
                      
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Session Management
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Session (Chrome on Windows)
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Active now • IP: 192.168.1.1
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300 text-xs rounded-full">
                          Current
                        </span>
                      </div>
                      
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mobile App (iPhone 13)
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Last active 2 hours ago • IP: 203.0.113.1
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;