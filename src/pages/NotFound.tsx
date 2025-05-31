import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6 w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
        <FileQuestion size={48} className="text-primary-500 dark:text-primary-400" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
        404 - Page Not Found
      </h1>
      
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mb-8">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        
        <Button
          variant="default"
          leftIcon={<Home size={18} />}
          onClick={() => navigate('/')}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;