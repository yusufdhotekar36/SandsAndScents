import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useNotification } from '../contexts/NotificationContext';
import { ShoppingCart, Star, Heart, ArrowLeft } from 'lucide-react';

interface PerfumeDetailPageProps {
  onAddToCart: (perfume: any, quantity: number) => void;
}

const PerfumeDetailPage: React.FC<PerfumeDetailPageProps> = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [perfume, setPerfume] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [mainImage, setMainImage] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPerfume();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchPerfume = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('perfumes').select('*').eq('id', id).single();
    if (!error && data) {
      setPerfume(data);
      setMainImage(data.image_url || '');
      setQuantity(1);
      setSelectedSize('100ml');
      fetchRecommendations(data);
    } else {
      setPerfume(null);
    }
    setLoading(false);
  };

  const fetchRecommendations = async (perfume: any) => {
    if (!perfume) return;
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .eq('category', perfume.category)
      .neq('id', perfume.id)
      .limit(10);
    if (!error && data) setRecommendations(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }
  if (!perfume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Perfume not found.</div>
      </div>
    );
  }

  const sizes = ['100ml'];

  const handleAddToCart = () => {
    onAddToCart(perfume, quantity);
    showNotification('success', 'Added to Cart', `Added ${quantity} ${perfume.name} to cart`);
  };

  const handleBuyNow = () => {
    onAddToCart(perfume, quantity);
    showNotification('success', 'Added to Cart', 'Added to cart! Proceed to checkout.');
    navigate('/');
  };

  return (
    <div className="pt-20 min-h-screen bg-[#eff3fc]">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 mt-8 mb-8">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-black hover:underline">
          <ArrowLeft className="h-5 w-5 mr-1" /> Back
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            <img src={mainImage} alt={perfume.name} className="w-64 h-64 object-cover rounded-xl mb-4" />
            <div className="flex gap-2">
              {[perfume.image_url, perfume.image_ur2, perfume.image_ur3, perfume.image_ur4].filter(Boolean).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={perfume.name + ' ' + idx}
                  className={`w-14 h-14 object-cover rounded cursor-pointer border ${mainImage === img ? 'border-[#6d2480]' : 'border-gray-200'}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#010101] mb-2">{perfume.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-600 text-sm">({perfume.stock} in stock)</span>
              </div>
              <span className="bg-[#6d2480]/10 text-[#6d2480] px-3 py-1 rounded-full text-sm font-medium">
                {perfume.category}
              </span>
            </div>
            <div className="text-2xl font-bold text-[#010101]">
              ₹{perfume.price}
              <span className="text-sm font-normal text-gray-500 ml-2">Free delivery</span>
            </div>
            {/* Size */}
            <div>
              <h3 className="font-semibold text-[#010101] mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'border-[#6d2480] bg-[#eff3fc] text-[#6d2480]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-[#010101] mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 rounded bg-[#eff3fc] text-[#6d2480] font-bold text-lg"
                  aria-label="Decrease quantity"
                >-</button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1 rounded bg-[#eff3fc] text-[#6d2480] font-bold text-lg"
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>
            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                disabled={perfume.stock === 0}
                className="btn-primary w-full disabled:opacity-50"
              >
                {perfume.stock === 0 ? 'Out of Stock' : 'Buy Now'}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={perfume.stock === 0}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{perfume.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Add to Wishlist</span>
              </button>
            </div>
            {/* Description */}
            <div>
              <h3 className="font-semibold text-[#010101] mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{perfume.description}</p>
            </div>
            {/* You May Also Like */}
            {recommendations.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-[#010101] mb-3">You May Also Like</h3>
                <div className="flex gap-4 overflow-x-auto pb-2" role="list" aria-label="Recommended perfumes">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="min-w-[160px] bg-white rounded-xl shadow p-3 cursor-pointer hover:shadow-lg transition-all border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6d2480]"
                      onClick={() => navigate(`/perfume/${rec.id}`)}
                      tabIndex={0}
                      aria-label={`View details for ${rec.name}`}
                    >
                      <img src={rec.image_url} alt={rec.name} className="w-full h-28 object-cover rounded mb-2" />
                      <div className="font-medium text-gray-900 truncate">{rec.name}</div>
                      <div className="text-sm text-gray-600">₹{rec.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeDetailPage; 