import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, QrCode, CheckCircle, Copy, Check, AlertCircle, Phone, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ThankYouModal from './ThankYouModal';
import { useNotification } from '../contexts/NotificationContext';

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
  const { showNotification } = useNotification();
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'bank' | 'cod'>('upi');
  const [transactionId, setTransactionId] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState('');
  const [savedCustomerName, setSavedCustomerName] = useState('');
  const [savedCustomerPhone, setSavedCustomerPhone] = useState('');

  const upiId = 'sandsandscents@paytm';
  const bankDetails = {
    accountName: 'Sands & Scents',
    accountNumber: '1234567890',
    ifsc: 'HDFC0001234',
    bankName: 'HDFC Bank'
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('success', 'Copied!', `${label} copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
      showNotification('error', 'Order Error', 'Order placed but WhatsApp notification failed');
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
          payment_method: selectedMethod,
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

      // Update perfume stock for each item
      for (const item of cartItems) {
        console.log('Decrementing stock for:', { perfume_id: item.id, type: typeof item.id, quantity: item.quantity });
        const { error: stockError } = await supabase.rpc('decrement_perfume_stock', {
          perfume_id: Number(item.id),
          quantity: item.quantity
        });
        if (stockError) {
          console.error('Stock update error:', stockError);
          alert(JSON.stringify(stockError, null, 2));
          showNotification('error', 'Stock Update Error', `Failed to update stock for ${item.name}: ${stockError.message}`);
        }
      }

      // After updating stock for each item, check for low stock and notify
      const LOW_STOCK_THRESHOLD = 5;
      for (const item of cartItems) {
        const { data, error } = await supabase
          .from('perfumes')
          .select('stock, name')
          .eq('id', item.id)
          .single();
        if (!error && data.stock <= LOW_STOCK_THRESHOLD) {
          showNotification('warning', 'Low Stock', `${data.name} is running low! Only ${data.stock} left.`);
          // Optionally, trigger backend/email/WhatsApp notification here
        }
      }

      console.log('Order items saved successfully');
      return orderResult;
    } catch (error) {
      console.error('Error saving order to database:', error);
      throw error;
    }
  };

  // Helper to check stock before checkout
  const checkStockBeforeCheckout = async () => {
    for (const item of cartItems) {
      const { data, error } = await supabase
        .from('perfumes')
        .select('stock, name')
        .eq('id', item.id)
        .single();
      if (error) {
        showNotification('error', 'Stock Check Error', `Could not check stock for ${item.name}`);
        return false;
      }
      if (data.stock < item.quantity) {
        showNotification('error', 'Insufficient Stock', `Only ${data.stock} left for ${item.name}`);
        return false;
      }
    }
    return true;
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    
    try {
      // Debug: Check if environment variable is loaded
      console.log('Razorpay Key:', import.meta.env.VITE_RAZORPAY_KEY_ID);
      console.log('All env vars:', import.meta.env);
      
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        throw new Error('Razorpay key is not defined in environment variables');
      }

      // Prevent checkout if stock is insufficient
      const canCheckout = await checkStockBeforeCheckout();
      if (!canCheckout) {
        setLoading(false);
        return;
      }

      // Generate order data
      const orderId = generateOrderId();
      const orderData = {
        orderId,
        customerName: customerDetails.fullName,
        customerPhone: customerDetails.phone,
        customerEmail: customerDetails.email,
        shippingAddress: customerDetails.address,
        city: customerDetails.city,
        state: customerDetails.state,
        pincode: customerDetails.pincode,
        totalAmount: total,
        transactionId: '', // Will be updated after payment
        cartItems
      };

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100, // Amount in paise
        currency: 'INR',
        name: 'Sands & Scents',
        description: `Order ${orderId}`,
        image: '/logo.jpeg',
        handler: async function (response: any) {
          try {
            // Update order data with payment details
            orderData.transactionId = response.razorpay_payment_id;
            
            // Save order to database
            const savedOrder = await saveOrderToDatabase(orderData);
            
            // Set order details for thank you modal
            setSavedOrderId(orderData.orderId);
            setSavedCustomerName(orderData.customerName);
            setSavedCustomerPhone(orderData.customerPhone);
            
            // Send WhatsApp notification
            await sendWhatsAppMessage(orderData);
            
            // Show success notification and thank you modal
            showNotification('success', 'Payment Successful', 'Your order has been placed successfully!');
            setShowThankYou(true);
            onOrderComplete();
          } catch (error) {
            console.error('Error processing successful payment:', error);
            showNotification('error', 'Order Error', 'Payment successful but order processing failed. Please contact support.');
          }
        },
        prefill: {
          name: customerDetails.fullName,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        theme: {
          color: '#ea580c',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };
      
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      showNotification('error', 'Payment Error', 'Failed to initiate payment. Please try again.');
      setLoading(false);
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
              className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
              {/* Cart Summary and User Details */}
              <div className="p-6 space-y-6">
                <div className="bg-white/80 rounded-xl p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Order Summary</h3>
                  <ul className="divide-y divide-gray-200 mb-2">
                    {cartItems.map(item => (
                      <li key={item.id} className="flex justify-between py-2 text-gray-800">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Shipping Details</h3>
                  <div className="text-gray-800">
                    <div><span className="font-medium">Name:</span> {customerDetails.fullName}</div>
                    <div><span className="font-medium">Phone:</span> {customerDetails.phone}</div>
                    <div><span className="font-medium">Email:</span> {customerDetails.email}</div>
                    <div><span className="font-medium">Address:</span> {customerDetails.address}, {customerDetails.city}, {customerDetails.state} - {customerDetails.pincode}</div>
                  </div>
                </div>
                <button
                  onClick={handleRazorpayPayment}
                  className="btn-primary w-full text-lg font-semibold mt-4"
                >
                  Pay Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Thank You Modal */}
      <ThankYouModal isOpen={showThankYou} onClose={handleThankYouClose} orderId={savedOrderId} customerName={savedCustomerName} customerPhone={savedCustomerPhone} />
    </>
  );
};

export default PaymentModal;