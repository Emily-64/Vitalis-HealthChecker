
import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/30 border-l-4 border-red-500 text-red-300 p-4 rounded-md" role="alert">
      <div className="flex items-center">
        <AlertTriangleIcon className="w-6 h-6 mr-3" />
        <div>
          <p className="font-bold">Error</p>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;