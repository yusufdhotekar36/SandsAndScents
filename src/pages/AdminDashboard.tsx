import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AddPerfumeModal from '../components/AddPerfumeModal';
import EditPerfumeModal from '../components/EditPerfumeModal';
import toast from 'react-hot-toast';

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

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchPerfumes();
  }, [user, navigate]);

  const fetchPerfumes = async () => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPerfumes(data || []);
    } catch (error) {
      toast.error('Error fetching perfumes');
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
      toast.success('Perfume deleted successfully');
    } catch (error) {
      toast.error('Error deleting perfume');
      console.error('Error:', error);
    }
  };

  const handleEdit = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    setShowEditModal(true);
  };

  const stats = [
    {
      title: 'Total Products',
      value: perfumes.length,
      icon: <Package className="h-8 w-8" />,
      color: 'text-blue-600'
    },
    {
      title: 'Total Value',
      value: `$${perfumes.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'text-green-600'
    },
    {
      title: 'Low Stock',
      value: perfumes.filter(p => p.stock < 10).length,
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'text-red-600'
    },
    {
      title: 'Categories',
      value: new Set(perfumes.map(p => p.category)).size,
      icon: <Users className="h-8 w-8" />,
      color: 'text-purple-600'
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
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gold-gradient text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span>Add Perfume</span>
          </motion.button>
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

        {/* Perfumes Table */}
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
    </div>
  );
};

export default AdminDashboard;