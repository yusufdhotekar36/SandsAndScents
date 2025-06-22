import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, QrCode, CheckCircle, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ThankYouModal from './ThankYouModal';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerDetails: CustomerDetails;
  cartItems: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  customerDetails,
  cartItems,
  total,
  onOrderComplete
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank'>('upi');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderId, setOrderId] = useState('');

  const upiId = 'sandsandscents@paytm';
  const bankDetails = {
    accountName: 'Sands & Scents',
    accountNumber: '1234567890',
    ifsc: 'HDFC0001234',
    bankName: 'HDFC Bank'
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const generateOrderId = () => {
    return 'SS' + Date.now().toString().slice(-8);
  };

  const sendWhatsAppMessage = async (orderData: any) => {
    try {
      console.log('Sending WhatsApp message with data:', orderData);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-whatsapp-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('WhatsApp API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('WhatsApp API Error Response:', errorText);
        throw new Error(`WhatsApp API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('WhatsApp message sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      // Don't throw error here as order is already placed
      toast.error('Order placed but WhatsApp notification failed');
      return null;
    }
  };

  const saveOrderToDatabase = async (orderData: any) => {
    try {
      console.log('Saving order to database:', orderData);
      
      // Save order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_id: orderData.orderId,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          customer_email: orderData.customerEmail,
          shipping_address: orderData.shippingAddress,
          city: orderData.city,
          state: orderData.state,
          pincode: orderData.pincode,
          total_amount: orderData.totalAmount,
          payment_method: paymentMethod,
          transaction_id: orderData.transactionId,
          status: 'confirmed'
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Order insert error:', orderError);
        throw orderError;
      }

      console.log('Order saved successfully:', orderResult);

      // Save order items
      const orderItems = cartItems.map(item => ({
        order_id: orderResult.id,
        perfume_id: item.id,
        perfume_name: item.name,
        perfume_image: item.image_url,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items insert error:', itemsError);
        throw itemsError;
      }

      console.log('Order items saved successfully');
      return orderResult;
    } catch (error) {
      console.error('Error saving order to database:', error);
      throw error;
    }
  };

  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newOrderId = generateOrderId();
      console.log('Processing order with ID:', newOrderId);
      
      const orderData = {
        orderId: newOrderId,
        customerName: customerDetails.fullName,
        customerPhone: customerDetails.phone,
        customerEmail: customerDetails.email,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: customerDetails.address,
        city: customerDetails.city,
        state: customerDetails.state,
        pincode: customerDetails.pincode,
        transactionId: transactionId.trim()
      };

      console.log('Order data prepared:', orderData);

      // Save order to database first
      await saveOrderToDatabase(orderData);
      console.log('Order saved to database successfully');

      // Send WhatsApp message (non-blocking)
      sendWhatsAppMessage(orderData);

      setOrderId(newOrderId);
      setShowThankYou(true);
      
      toast.success('Order placed successfully!');
      onOrderComplete();
    } catch (error) {
      console.error('Error processing order:', error);
      
      // More specific error messages
      if (error.message?.includes('duplicate key')) {
        toast.error('Order ID already exists. Please try again.');
      } else if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (error.message?.includes('permission')) {
        toast.error('Permission denied. Please contact support.');
      } else {
        toast.error(`Failed to process order: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThankYouClose = () => {
    setShowThankYou(false);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showThankYou && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <CreditCard className="h-6 w-6 mr-2" />
                  Payment Gateway
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Payment Amount */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Total Amount to Pay</p>
                    <p className="text-3xl font-bold text-orange-600">₹{total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Smartphone className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <p className="font-medium">UPI Payment</p>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === 'bank'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <p className="font-medium">Bank Transfer</p>
                    </button>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mb-6">
                  {paymentMethod === 'upi' ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <QrCode className="h-5 w-5 mr-2" />
                        UPI Payment Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-gray-600">UPI ID:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-medium">{upiId}</span>
                            <button
                              onClick={() => copyToClipboard(upiId, 'UPI ID')}
                              className="text-orange-500 hover:text-orange-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-orange-600">₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        💡 Pay using any UPI app (PhonePe, Google Pay, Paytm, etc.)
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Bank Transfer Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-gray-600">Account Name:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{bankDetails.accountName}</span>
                            <button
                              onClick={() => copyToClipboard(bankDetails.accountName, 'Account Name')}
                              className="text-orange-500 hover:text-orange-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-gray-600">Account Number:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-medium">{bankDetails.accountNumber}</span>
                            <button
                              onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account Number')}
                              className="text-orange-500 hover:text-orange-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-gray-600">IFSC Code:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-medium">{bankDetails.ifsc}</span>
                            <button
                              onClick={() => copyToClipboard(bankDetails.ifsc, 'IFSC Code')}
                              className="text-orange-500 hover:text-orange-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-gray-600">Bank Name:</span>
                          <span className="font-medium">{bankDetails.bankName}</span>
                        </div>
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-orange-600">₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Transaction ID Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID / UTR Number *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter transaction ID after payment"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Enter the transaction ID you received after making the payment
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitPayment}
                  disabled={isSubmitting || !transactionId.trim()}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Confirm Payment & Place Order
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  🔒 Your payment information is secure. Order confirmation will be sent via WhatsApp.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ThankYouModal
        isOpen={showThankYou}
        onClose={handleThankYouClose}
        orderId={orderId}
        customerName={customerDetails.fullName}
        customerPhone={customerDetails.phone}
      />
    </>
  );
};

export default PaymentModal;