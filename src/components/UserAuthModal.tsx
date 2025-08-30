import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup' | 'admin';
  onModeChange: (mode: 'login' | 'signup' | 'admin') => void;
}

const UserAuthModal: React.FC<UserAuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const { signIn } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: '', password: '', fullName: '', phone: '' });
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'admin') {
        // Admin login with password only
        if (formData.password === '@Yusuf250203') {
          showNotification('success', 'Admin Access', 'Welcome, Admin!');
          // Redirect to admin dashboard
          window.location.href = '/admin/dashboard';
        } else {
          throw new Error('Invalid admin password');
        }
      } else if (mode === 'signup') {
        // Sign up user with metadata
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
            }
          }
        });

        if (error) {
          console.error('Signup error:', error);
          throw error;
        }

        if (data.user) {
          // Wait for database trigger to process
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Automatically log in the user after signup
          try {
            await signIn(formData.email, formData.password);
            showNotification('success', 'Welcome!', 'Account created successfully! Welcome to Sands&Scents!');
          } catch (loginError) {
            console.error('Auto-login error:', loginError);
            showNotification('success', 'Account Created', 'Account created! Please log in to continue.');
          }
        }
      } else {
        // Sign in user
        await signIn(formData.email, formData.password);
        showNotification('success', 'Welcome Back!', 'Welcome back to Sands&Scents!');
      }

      onClose();
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (mode === 'admin') {
        showNotification('error', 'Access Denied', 'Invalid admin password. Please try again.');
      } else if (error.message.includes('Invalid login credentials')) {
        showNotification('error', 'Login Failed', 'Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        showNotification('error', 'Email Not Verified', 'Please verify your email address before logging in.');
      } else {
        showNotification('error', 'Error', error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Admin Login'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-1">
                {mode === 'login' 
                  ? 'Sign in to access your account' 
                  : mode === 'signup'
                    ? 'Join Sands&Scents for exclusive offers'
                    : 'Admin login'
                }
              </p>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </>
                )}

                {mode !== 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mode === 'admin' ? 'Admin Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all"
                      placeholder={mode === 'admin' ? 'Enter admin password' : 'Enter your password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {mode === 'login' ? 'Signing In...' : mode === 'signup' ? 'Creating Account...' : 'Admin Login'}
                    </div>
                  ) : (
                    mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Admin Login'
                  )}
                </motion.button>
              </form>

              {/* Mode Switch */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  {mode === 'login' ? "Don't have an account? " : mode === 'signup' ? "Already have an account? " : "Back to "}
                  <button
                    onClick={() => onModeChange(mode === 'login' ? 'signup' : mode === 'signup' ? 'login' : 'login')}
                    className="text-slate-600 hover:text-slate-700 font-medium transition-colors"
                  >
                    {mode === 'login' ? 'Sign Up' : mode === 'signup' ? 'Sign In' : 'Sign In'}
                  </button>
                </p>
                
                {/* Admin login option - only show from login page */}
                {mode === 'login' && (
                  <p className="text-gray-600 text-sm mt-2">
                    Admin?{' '}
                    <button
                      onClick={() => onModeChange('admin')}
                      className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Admin Login
                    </button>
                  </p>
                )}
              </div>

              {/* Additional Info */}
              {mode === 'login' && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    💡 Having trouble? Make sure you've verified your email address.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserAuthModal;