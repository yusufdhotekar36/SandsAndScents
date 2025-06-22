import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

const FloatingWhatsAppQR = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, duration: 0.8, type: "spring" }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(34, 197, 94, 0.3)',
              '0 0 40px rgba(34, 197, 94, 0.6)',
              '0 0 20px rgba(34, 197, 94, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      </motion.div>

      {/* Floating QR Code Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* QR Code Box */}
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-20 right-6 z-50 bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-80"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <img
                    src="/logo.jpeg"
                    alt="Logo"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <h3 className="text-lg font-bold text-gray-800">Sands & Scents</h3>
                </div>
                <p className="text-sm text-gray-600">WhatsApp Community</p>
              </div>

              {/* QR Code */}
              <div className="text-center mb-4">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(34, 197, 94, 0.3)',
                      '0 0 40px rgba(34, 197, 94, 0.6)',
                      '0 0 20px rgba(34, 197, 94, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block p-3 bg-white rounded-lg border-2 border-green-100"
                >
                  <img
                    src="/image copy copy.png"
                    alt="WhatsApp QR Code"
                    className="w-48 h-48 object-cover rounded"
                  />
                </motion.div>
              </div>

              {/* Instructions */}
              <p className="text-sm text-gray-600 text-center mb-4">
                Scan this QR code using the WhatsApp camera to join our community
              </p>

              {/* Join Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                onClick={() => window.open('https://chat.whatsapp.com/your-community-link', '_blank')}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Join WhatsApp Community</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingWhatsAppQR;