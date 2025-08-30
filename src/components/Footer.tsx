import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, } from 'lucide-react';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Logo and Description */}
        <div>
          <img
            src="/logo.jpeg"
            alt="Sands And Scents Logo"
            className="w-28 h-auto mb-4"
          />
          <p className="text-gray-400">
            Bringing you the finest Arabian fragrances that speak elegance, tradition, and luxury.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-300">
                            <li><Link to="/" className="hover:text-slate-400">Home</Link></li>
                <li><Link to="/products" className="hover:text-slate-400">Shop</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-slate-400">Privacy Policy</Link></li>
                <li><Link to="/data-deletion-policy" className="hover:text-slate-400">Data Deletion Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-center space-x-2">
                              <Mail className="w-5 h-5 text-slate-400" />
              <span>support@sandsandscents.com</span>
            </p>
            <p className="flex items-center space-x-2">
                              <Phone className="w-5 h-5 text-slate-400" />
              <span>+91 95187 74431</span>
            </p>
            <p className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <a href="https://chat.whatsapp.com/JbmJWWnLTpgL7ejtBoy4Qs?mode=r_c" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 underline">WhatsApp Community</a>
            </p>
          </div>
        </div>

        {/* WhatsApp QR Code */}
        <div className="flex flex-col items-center justify-center">
          <img src="/QR.jpeg" alt="WhatsApp Community QR" className="w-24 h-24 rounded mb-2 border-2 border-green-500" />
          <a href="https://chat.whatsapp.com/JbmJWWnLTpgL7ejtBoy4Qs?mode=r_c" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-500 underline text-sm mt-1">Join WhatsApp Community</a>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Sands & Scents. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
