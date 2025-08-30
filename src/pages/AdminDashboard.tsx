import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, DollarSign, Users, TrendingUp, LogOut, ShoppingCart, Eye } from 'lucide-react';
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
        .select(`
          *,
          order_items (
            id,
            perfume_id,
            quantity,
            price,
            perfumes (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedOrders = data?.map(order => ({
        ...order,
        order_items: order.order_items?.map(item => ({
          ...item,
          perfume_name: item.perfumes?.name || 'Unknown Product',
          perfume_image: item.perfumes?.image_url || ''
        })) || []
      })) || [];

      setOrders(transformedOrders);
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

  const stats = [
    {
      title: 'Total Products',
      value: perfumes.length,
      icon: <Package className="h-8 w-8" />,
      color: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <ShoppingCart className="h-8 w-8" />,
      color: 'text-orange-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'text-green-600'
    },
    {
      title: 'Pending Orders',
      value: orders.filter(order => order.status === 'pending').length,
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
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold font-arabic text-desert-800">
              Admin Dashboard
            </h1>
            <p className="text-desert-600 mt-2">
              Manage your perfume collection
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-gold-gradient text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
              <span>Add Perfume</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-desert-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-desert-800">{stat.value}</p>
                </div>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-gold-gradient text-white'
                : 'bg-white/20 text-desert-700 hover:bg-white/30'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-gold-gradient text-white'
                : 'bg-white/20 text-desert-700 hover:bg-white/30'
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
            className="glass-effect rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-desert-800">Perfume Inventory</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-desert-800 font-medium">Image</th>
                    <th className="px-6 py-4 text-left text-desert-800 font-medium">Name</th>
                    <th className="px-6 py-4 text-left text-desert-800 font-medium">Category</th>
                    <th className="px-6 py-4 text-left text-desert-800 font-medium">Price</th>
                    <th className="px-6 py-4 text-left text-desert-800 font-medium">Stock</th>
                    <th className="px-6 py-4 text-left text-desert-800 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {perfumes.map((perfume) => (
                    <tr key={perfume.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-6 py-4">
                        <img
                          src={perfume.image_url}
                          alt={perfume.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-desert-800">{perfume.name}</p>
                          <p className="text-sm text-desert-600 truncate max-w-xs">
                            {perfume.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded-full text-xs">
                          {perfume.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-desert-800 font-medium">
                        ${perfume.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          perfume.stock < 10 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {perfume.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(perfume)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(perfume.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
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
            className="glass-effect rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-desert-800">Customer Orders</h2>
            </div>
            
            {ordersLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto"></div>
                <p className="text-desert-600 mt-2">Loading orders...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-desert-800 font-medium">Order ID</th>
                      <th className="px-6 py-4 text-left text-desert-800 font-medium">Customer</th>
                      <th className="px-6 py-4 text-left text-desert-800 font-medium">Products</th>
                      <th className="px-6 py-4 text-left text-desert-800 font-medium">Total</th>
                      <th className="px-6 py-4 text-left text-desert-800 font-medium">Status</th>
                      <th className="px-6 py-4 text-left text-desert-800 font-medium">Date</th>
                      <th className="px-6 py-4 text-left text-desert-800 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-6 py-4 text-desert-800 font-medium">#{order.id.slice(-8)}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-desert-800 font-medium">{order.user_name}</p>
                            <p className="text-desert-600 text-sm">{order.user_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {order.order_items.slice(0, 2).map((item, index) => (
                              <img
                                key={index}
                                src={item.perfume_image}
                                alt={item.perfume_name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ))}
                            {order.order_items.length > 2 && (
                              <span className="text-desert-600 text-sm">+{order.order_items.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-desert-800 font-medium">₹{order.total_amount}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border-none ${
                              order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-desert-600 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
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