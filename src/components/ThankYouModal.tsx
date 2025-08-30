import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Phone, MessageCircle, X } from 'lucide-react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  customerName: string;
  customerPhone: string;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  orderId,
  customerName,
  customerPhone
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-10 w-10" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
              <p className="text-green-100">Your order has been placed successfully</p>
            </div>

            {/* Order Details */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-xl font-bold text-gray-900">{orderId}</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">WhatsApp Confirmation</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your order details will be sent to your WhatsApp number: 
                    <span className="font-medium"> {customerPhone}</span>
                  </p>
                </div>
              </div>

              {/* Customer Support */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Need Help? Contact Our Support
                </h3>
                
                <div className="space-y-3">
                  <motion.a
                    href="tel:+919689938474"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-blue-600 mr-3" />
                    <span className="text-blue-800 font-medium">+91 9689938474</span>
                  </motion.a>
                  
                  <motion.a
                    href="tel:+919518774431"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-blue-600 mr-3" />
                    <span className="text-blue-800 font-medium">+91 9518774431</span>
                  </motion.a>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    onClick={() => window.open('https://wa.me/919689938474', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Chat on WhatsApp</span>
                  </motion.button>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="btn-primary w-full mt-6"
              >
                Continue Shopping
              </motion.button>
            </div>

            {/* Close X Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ThankYouModal;