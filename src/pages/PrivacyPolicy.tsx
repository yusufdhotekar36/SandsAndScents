// PrivacyPolicy.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, UserCheck, Lock, Globe, FileText, Truck, RefreshCw, Phone } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-100 p-4 rounded-full">
                <Shield className="h-12 w-12 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Last updated: June 22, 2025
            </p>
          </div>

          {/* Existing Content... */}
          {/* [Keep all your current content from before here] */}

          {/* --- New Sections Below --- */}

          {/* Terms and Conditions */}
          <div className="bg-gray-50 rounded-lg p-6 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="h-6 w-6 text-orange-600 mr-2" />
              Terms and Conditions
            </h2>
            <p className="text-gray-700">
              Please read our <a href="/terms-and-conditions" className="text-orange-600 hover:underline">Terms and Conditions</a> carefully before using our website. By accessing or using our services, you agree to be bound by them.
            </p>
          </div>

          {/* Cancellation and Refund */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mt-6">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center">
              <RefreshCw className="h-6 w-6 text-yellow-600 mr-2" />
              Cancellation & Refund Policy
            </h2>
            <p className="text-yellow-800">
              You can cancel your order within 24 hours of placing it. Refunds will be processed within 5-7 business days to your original payment method.
            </p>
          </div>

          {/* Shipping and Delivery */}
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg mt-6">
            <h2 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
              <Truck className="h-6 w-6 text-green-600 mr-2" />
              Shipping & Delivery Policy
            </h2>
            <p className="text-green-800">
              We ship products across India. Orders are usually dispatched within 2-3 working days and delivered within 5-7 days depending on your location.
            </p>
          </div>

          {/* Contact Us */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mt-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
              <Phone className="h-6 w-6 text-blue-600 mr-2" />
              Contact Us
            </h2>
            <p className="text-blue-800 mb-2">
              For any queries regarding orders, refunds, or policies, feel free to reach out to us:
            </p>
            <ul className="text-blue-800 space-y-1 pl-4 list-disc">
              <li>Email: <a href="mailto:support@sandsandscents.com" className="text-orange-600 hover:underline">support@sandsandscents.com</a></li>
              <li>Phone: +91 9518774431</li>
              <li>Website: <a href="https://www.sandsandscents.com" className="text-orange-600 hover:underline">www.sandsandscents.com</a></li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
