import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Package, CreditCard, Calendar } from 'lucide-react';

interface OrderItem {
  id: string;
  perfume_id: string;
  quantity: number;
  price: number;
  perfume_name: string;
  perfume_image: string;
}

interface Order {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 sticky top-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Order Details</h2>
                  <p className="text-white/80 text-sm mt-1">Order #{order.id.slice(-8)}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Information
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{order.user_name}</p>
                        <p className="text-sm text-gray-600">Customer Name</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{order.user_email}</p>
                        <p className="text-sm text-gray-600">Email Address</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{order.user_phone}</p>
                        <p className="text-sm text-gray-600">Phone Number</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{order.address}</p>
                    <p className="text-gray-900">{order.city}, {order.state} {order.pincode}</p>
                  </div>
                </div>

                {/* Order Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Information
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm text-gray-600">Order Date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{order.payment_method.toUpperCase()}</p>
                        <p className="text-sm text-gray-600">Payment Method</p>
                      </div>
                    </div>
                    
                    {order.transaction_id && (
                      <div>
                        <p className="font-medium text-gray-900">#{order.transaction_id}</p>
                        <p className="text-sm text-gray-600">Transaction ID</p>
                      </div>
                    )}
                    
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">Order Status</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ordered Products</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700 font-medium">Product</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-medium">Price</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-medium">Quantity</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.order_items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 last:border-b-0">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img
                                src={item.perfume_image}
                                alt={item.perfume_name}
                                className="w-12 h-12 object-cover rounded-lg mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{item.perfume_name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">₹{item.price}</td>
                          <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Total */}
                <div className="mt-4 flex justify-end">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-orange-600">Total: ₹{order.total_amount}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailModal; 