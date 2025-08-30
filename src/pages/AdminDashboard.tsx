import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, DollarSign, Users, TrendingUp, LogOut, ShoppingCart, Eye, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AddPerfumeModal from '../components/AddPerfumeModal';
import EditPerfumeModal from '../components/EditPerfumeModal';
import OrderDetailModal from '../components/OrderDetailModal';
import { useNotification } from '../contexts/NotificationContext';

interface Perfume {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_at: string;
}

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
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
  num_of_order: number;
  is_prepared: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchPerfumes();
    fetchOrders();
  }, []);

  const handleLogout = () => {
    showNotification('success', 'Logged Out', 'You have been logged out from admin panel.');
    navigate('/');
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('num_of_order', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      showNotification('error', 'Error', 'Error fetching orders');
      console.error('Error:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchPerfumes = async () => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPerfumes(data || []);
    } catch (error) {
      showNotification('error', 'Error', 'Error fetching perfumes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this perfume?')) return;

    try {
      const { error } = await supabase
        .from('perfumes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPerfumes(perfumes.filter(p => p.id !== id));
      showNotification('success', 'Deleted', 'Perfume deleted successfully');
    } catch (error) {
      showNotification('error', 'Error', 'Error deleting perfume');
      console.error('Error:', error);
    }
  };

  const handleEdit = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    setShowEditModal(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      showNotification('success', 'Updated', `Order status updated to ${newStatus}`);
    } catch (error) {
      showNotification('error', 'Error', 'Error updating order status');
      console.error('Error:', error);
    }
  };

  const totalOrders = orders.length > 0 ? Math.max(...orders.map(o => o.num_of_order || 0)) : 0;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const pendingOrders = orders.filter(order => !order.is_prepared).length;

  const stats = [
    {
      title: 'Total Products',
      value: perfumes.length,
      icon: <Package className="h-8 w-8" />,
      color: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingCart className="h-8 w-8" />,
      color: 'text-orange-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'text-green-600'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="glass-effect p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="text-desert-700 mt-4 text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-[#eff3fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="w-full md:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-arabic text-[#010101]">
              Admin Dashboard
            </h1>
            <p className="text-[#6d2480] mt-2 text-sm md:text-base">
              Manage your perfume collection
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-[#6d2480] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#4a185a] transition-all duration-300 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#6d2480] focus:ring-opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 md:p-6 rounded-2xl shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6d2480] text-xs md:text-sm">{stat.title}</p>
                  <p className="text-lg md:text-2xl font-bold text-[#010101]">{stat.value}</p>
                </div>
                <div className="text-[#6d2480]">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-2 md:space-x-4 mb-6 scrollbar-thin scrollbar-thumb-[#6d2480] scrollbar-track-transparent">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap min-w-[100px] text-sm md:text-base ${
              activeTab === 'dashboard'
                ? 'bg-[#6d2480] text-white'
                : 'bg-[#fff]/20 text-[#010101] hover:bg-[#eff3fc]'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap min-w-[100px] text-sm md:text-base ${
              activeTab === 'orders'
                ? 'bg-[#6d2480] text-white'
                : 'bg-[#fff]/20 text-[#010101] hover:bg-[#eff3fc]'
            }`}
          >
            Orders
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'dashboard' ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl overflow-hidden shadow"
          >
            <div className="p-4 md:p-6 border-b border-[#eff3fc]">
              <h2 className="text-lg md:text-2xl font-bold text-[#010101]">Perfume Inventory</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-xs md:text-sm">
                <thead className="bg-[#eff3fc]">
                  <tr>
                    <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Image</th>
                    <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Name</th>
                    <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Category</th>
                    <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Price</th>
                    <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Stock</th>
                    <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {perfumes.map((perfume) => (
                    <tr key={perfume.id} className="border-b border-[#eff3fc] hover:bg-[#eff3fc]/5">
                      <td className="px-2 md:px-6 py-2 md:py-4">
                        <img
                          src={perfume.image_url}
                          alt={perfume.name}
                          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4">
                        <div>
                          <p className="font-medium text-[#010101] text-xs md:text-base">{perfume.name}</p>
                          <p className="text-xs md:text-sm text-[#6d2480] truncate max-w-[120px] md:max-w-xs">
                            {perfume.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4">
                        <span className="bg-[#6d2480]/10 text-[#6d2480] px-2 py-1 rounded-full text-xs">
                          {perfume.category}
                        </span>
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101] font-medium">
                        ${perfume.price}
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          perfume.stock < 10 
                            ? 'bg-[#6d2480]/10 text-[#6d2480]' 
                            : 'bg-[#6d2480]/10 text-[#6d2480]'
                        }`}>
                          {perfume.stock} units
                        </span>
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(perfume)}
                            className="text-[#6d2480] hover:text-[#4a185a] transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(perfume.id)}
                            className="text-[#6d2480] hover:text-[#4a185a] transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl overflow-hidden shadow"
          >
            <div className="p-4 md:p-6 border-b border-[#eff3fc]">
              <h2 className="text-lg md:text-2xl font-bold text-[#010101]">Customer Orders</h2>
            </div>
            
            {ordersLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto"></div>
                <p className="text-[#6d2480] mt-2">Loading orders...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full text-xs md:text-sm">
                  <thead className="bg-[#eff3fc]">
                    <tr>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">#</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Order ID</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Customer Name</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Phone</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Email</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Address</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">City</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">State</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Pincode</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Total</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Payment</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Txn ID</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Status</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Date</th>
                      <th className="px-2 md:px-6 py-2 md:py-4 text-left text-[#010101] font-medium">Prepared</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr key={order.id} className="border-b border-[#eff3fc] hover:bg-[#eff3fc]/5">
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101] font-bold">{order.num_of_order}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.order_id}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.customer_name}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.customer_phone}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.customer_email}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.shipping_address}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.city}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.state}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.pincode}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">₹{order.total_amount}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.payment_method}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#010101]">{order.transaction_id}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border-none ${
                              order.status === 'confirmed' ? 'bg-[#6d2480]/10 text-[#6d2480]' :
                              order.status === 'pending' ? 'bg-[#6d2480]/10 text-[#6d2480]' :
                              'bg-[#6d2480]/10 text-[#6d2480]'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 text-[#6d2480] text-xs md:text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4">
                          <button
                            onClick={async () => {
                              const newValue = !order.is_prepared;
                              // Optimistically update UI
                              setOrders(orders => orders.map(o => o.id === order.id ? { ...o, is_prepared: newValue } : o));
                              // Update in database
                              const { error } = await supabase
                                .from('orders')
                                .update({ is_prepared: newValue })
                                .eq('id', order.id);
                              if (error) {
                                showNotification('error', 'Error', 'Failed to update prepared status');
                                // Revert UI if error
                                setOrders(orders => orders.map(o => o.id === order.id ? { ...o, is_prepared: !newValue } : o));
                              }
                            }}
                            className="focus:outline-none"
                          >
                            {order.is_prepared ? (
                              <motion.span
                                initial={{ scale: 0.8, rotate: -20 }}
                                animate={{ scale: 1.2, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="inline-flex items-center justify-center text-green-600"
                              >
                                <CheckCircle className="h-6 w-6" />
                              </motion.span>
                            ) : (
                              <motion.span
                                initial={{ scale: 0.8, rotate: 20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="inline-flex items-center justify-center text-red-600"
                              >
                                <XCircle className="h-6 w-6" />
                              </motion.span>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPerfumeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchPerfumes();
          }}
        />
      )}

      {showEditModal && selectedPerfume && (
        <EditPerfumeModal
          perfume={selectedPerfume}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPerfume(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedPerfume(null);
            fetchPerfumes();
          }}
        />
      )}

      <OrderDetailModal
        order={selectedOrder}
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </div>
  );
};

export default AdminDashboard;