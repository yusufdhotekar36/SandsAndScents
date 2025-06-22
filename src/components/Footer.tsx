import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t py-4 text-center text-sm text-gray-600 mt-8">
      <div className="container mx-auto px-4">
        &copy; {new Date().getFullYear()} Sands & Scents. All rights reserved.{' '}
        <Link to="/privacy-policy" className="text-orange-600 hover:underline">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
