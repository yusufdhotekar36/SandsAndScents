import React from 'react';
import { Phone } from 'lucide-react';

const ContactUs: React.FC = () => {
  return (
    <div className="pt-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Phone className="w-6 h-6 mr-2 text-blue-600" />
        Contact Us
      </h1>
      <p className="text-gray-700 mb-2">
        Feel free to contact us for any queries, concerns, or feedback.
      </p>
      <ul className="text-gray-700 space-y-2">
        <li>Email: <a href="mailto:support@sandsandscents.com" className="text-orange-600 hover:underline">support@sandsandscents.com</a></li>
        <li>Phone: +91 9518774431</li>
        <li>Website: <a href="https://www.sandsandscents.com" className="text-orange-600 hover:underline">www.sandsandscents.com</a></li>
      </ul>
    </div>
  );
};

export default ContactUs; 