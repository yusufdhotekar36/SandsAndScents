import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, Clock, UserCheck } from 'lucide-react';

const DataDeletionPolicy = () => {
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
              Data Deletion Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              At Sands & Scents, we respect your privacy and are committed to protecting your personal data.
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
                    If you have signed in or interacted with our services using Facebook or Meta platforms 
                    and wish to delete your data, please follow the instructions below.
                  </p>
                </div>
              </div>
            </div>

            {/* How to Request */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Mail className="h-8 w-8 text-orange-600 mr-3" />
                How to Request Data Deletion
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <p className="text-gray-700">
                  If you want your data associated with our app to be deleted:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email us at:</p>
                      <a 
                        href="mailto:support@sandsandscents.com" 
                        className="text-orange-600 hover:text-orange-700 font-medium break-all"
                      >
                        support@sandsandscents.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Include the subject:</p>
                      <p className="text-gray-700 font-mono bg-white px-3 py-1 rounded border">
                        "Facebook Data Deletion Request"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mention your registered email or phone number</p>
                      <p className="text-gray-700">
                        So we can verify and delete your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Time */}
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Processing Time
                  </h3>
                  <p className="text-green-800">
                    We will process your request and delete your information from our servers within 
                    <span className="font-bold"> 7 working days</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What Data We Delete
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Personal information (name, email, phone number)
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Account details and preferences
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Order history and transaction data
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Any stored authentication tokens
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="text-center bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about our data deletion policy, feel free to contact us.
              </p>
              <a 
                href="mailto:support@sandsandscents.com"
                className="btn-primary inline-flex items-center px-6 py-3 font-medium"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataDeletionPolicy; 