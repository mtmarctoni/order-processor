import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, Search } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = React.useState(false);

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/upload':
        return 'Document Upload';
      case '/templates':
        return 'Template Designer';
      case '/queue':
        return 'Processing Queue';
      case '/drive':
        return 'Google Drive Integration';
      case '/settings':
        return 'Settings';
      default:
        return 'Document Processor';
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-error-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
            JP
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;