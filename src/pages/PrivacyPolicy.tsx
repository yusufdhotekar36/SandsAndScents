import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, UserCheck, Lock, Globe, FileText } from 'lucide-react';

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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Last updated: June 22, 2025
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <div className="flex items-start">
                <UserCheck className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-blue-900 mb-2">
                    Your Privacy Matters
                  </h2>
                  <p className="text-blue-800">
                    This Privacy Policy describes our policies and procedures on the collection, use, and disclosure of your information when you use our service and tells you about your privacy rights and how the law protects you.
                  </p>
                </div>
              </div>
            </div>

            {/* Definitions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="h-7 w-7 text-orange-600 mr-2" />
                Interpretation and Definitions
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><span className="font-semibold">Company</span> ("We", "Us", "Our"): Sands & Scents</li>
                <li><span className="font-semibold">Website</span>: <a href="https://www.sandsandscents.com" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.sandsandscents.com</a></li>
                <li><span className="font-semibold">Service</span>: The Website</li>
                <li><span className="font-semibold">You</span>: The individual using the Service</li>
              </ul>
            </div>

            {/* Data Collection */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <div className="flex items-start">
                <Lock className="h-6 w-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-yellow-900 mb-2">
                    Collecting and Using Your Personal Data
                  </h2>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Address, State, ZIP/Postal code, City</li>
                    <li>Usage Data (IP address, browser type, pages visited, device info)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cookies & Tracking */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="h-7 w-7 text-orange-600 mr-2" />
                Tracking Technologies and Cookies
              </h2>
              <p className="text-gray-700">
                We use cookies and similar tracking technologies to track activity on our service and store certain information.
              </p>
            </div>

            {/* Use of Data */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                Use of Your Personal Data
              </h2>
              <ul className="list-disc pl-6 text-blue-800 space-y-1">
                <li>To provide and maintain our Service</li>
                <li>To manage Your Account</li>
                <li>To contact You</li>
                <li>To provide You with news, offers, and general info</li>
              </ul>
            </div>

            {/* Retention & Transfer */}
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                <Lock className="h-6 w-6 text-green-600 mr-2" />
                Retention and Transfer
              </h2>
              <p className="text-green-800">
                We retain personal data only for as long as necessary. Your information may be transferred and maintained on computers outside your state or country.
              </p>
            </div>

            {/* Delete Your Data */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <UserCheck className="h-7 w-7 text-orange-600 mr-2" />
                Delete Your Data
              </h2>
              <p className="text-gray-700">
                You have the right to delete or request that we assist in deleting your data. Please contact us for assistance.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center">
                <Shield className="h-6 w-6 text-yellow-600 mr-2" />
                Children's Privacy
              </h2>
              <p className="text-yellow-800">
                Our service does not address anyone under the age of 13.
              </p>
            </div>

            {/* Contact Information */}
            <div className="text-center bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help or Have Questions?
              </h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about our privacy policy, feel free to contact us.
              </p>
              <a 
                href="mailto:support@sandsandscents.com"
                className="btn-primary inline-flex items-center px-6 py-3 font-medium"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </a>
              <div className="mt-4 text-gray-600">
                <div>Email: <a href="mailto:support@sandsandscents.com" className="text-slate-600 hover:underline">support@sandsandscents.com</a></div>
                <div>Phone: +91 9518774431</div>
                                  <div>Website: <a href="https://www.sandsandscents.com" className="text-slate-600 hover:underline" target="_blank" rel="noopener noreferrer">sandsandscents.com</a></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;