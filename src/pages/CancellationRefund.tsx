import React from 'react';
import { RefreshCw } from 'lucide-react';

const CancellationRefund: React.FC = () => {
  return (
    <div className="pt-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <RefreshCw className="w-6 h-6 mr-2 text-yellow-600" />
        Cancellation & Refund Policy
      </h1>
      <p className="text-gray-700 mb-4">
        Orders can be cancelled within 24 hours. Once shipped, cancellations cannot be processed.
      </p>
      <p className="text-gray-700">
        Refunds will be processed within 5-7 business days to your original payment method.
      </p>
    </div>
  );
};

export default CancellationRefund; 