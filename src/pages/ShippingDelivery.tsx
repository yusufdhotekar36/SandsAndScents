import React from 'react';
import { Truck } from 'lucide-react';

const ShippingDelivery: React.FC = () => {
  return (
    <div className="pt-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Truck className="w-6 h-6 mr-2 text-green-600" />
        Shipping & Delivery
      </h1>
      <p className="text-gray-700 mb-4">
        We ship across India using trusted courier partners.
      </p>
      <p className="text-gray-700">
        Orders are typically dispatched within 2-3 business days and delivered within 5-7 working days based on your location.
      </p>
    </div>
  );
};

export default ShippingDelivery; 