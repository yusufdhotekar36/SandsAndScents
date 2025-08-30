import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        This Privacy Policy describes how we collect, use, and protect your personal information when you use our website.
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>We respect your privacy and are committed to protecting your data.</li>
        <li>Your information is used only to process orders and improve your experience.</li>
        <li>We do not share your data with third parties except as required by law.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2">Contact</h2>
      <p className="text-gray-700">
        If you have any questions about this policy, contact us at <a href="mailto:support@sandsandscents.com" className="text-orange-600 hover:underline">support@sandsandscents.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
