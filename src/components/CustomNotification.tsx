import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, ShoppingCart, User } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface CustomNotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: (id: string) => void;
  duration?: number;
}

const CustomNotification: React.FC<CustomNotificationProps> = ({
  id,
  type,
  title,
  message,
  isVisible,
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${getBgColor()} border rounded-lg shadow-lg backdrop-blur-sm`}
          style={{ bottom: '100px' }} // Position above bottom navigation
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-semibold ${getTitleColor()}`}>
                  {title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {message}
                </p>
              </div>
              
              <button
                onClick={() => onClose(id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          {duration > 0 && (
            <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`h-full ${
                  type === 'success' ? 'bg-green-500' :
                  type === 'error' ? 'bg-red-500' :
                  type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomNotification; 