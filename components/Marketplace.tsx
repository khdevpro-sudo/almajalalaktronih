
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppSettings, GameAccount } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

const Marketplace: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const navigate = useNavigate();
  const [gameFilter, setGameFilter] = useState('الكل');
  
  // بيانات تجريبية للحسابات المتاحة
  const accounts: GameAccount[] = [
    { id: '1', game: 'PUBG', level: 75, skins: 120, server: 'أوروبا', binding: 'تويتر', price: 450, status: 'verified', images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e'], description: 'حساب مشحون 8 مواسم رويال باس' },
    { id: '2', game: 'Free Fire', level: 60, skins: 85, server: 'الشرق الأوسط', binding: 'فيسبوك', price: 200, status: 'pending', images: ['https://images.unsplash.com/photo-1511512578047-dfb367046420'], description: 'حساب قديم سكنات نادرة' },
    { id: '3', game: 'COD', level: 150, skins: 50, server: 'عالمي', binding: 'جيميل', price: 300, status: 'verified', images: ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5'], description: 'حساب ميثيك كامل' },
  ];

  const filtered = useMemo(() => {
    let list = gameFilter === 'الكل' ? accounts : accounts.filter(a => a.game === gameFilter);
    if (settings.marketSorting === 'price') list.sort((a, b) => a.price - b.price);
    if (settings.marketSorting === 'level') list.sort((a, b) => b.level - a.level);
    return list;
  }, [gameFilter, settings.marketSorting]);

  const handleBuy = (acc: GameAccount) => {
    const msg = `مهتم بشراء حساب ${acc.game} (رقم الطلب: ACC-${acc.id})\nالسعر: ${acc.price} ريال\nالمستوى: ${acc.level}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const isDark = settings.displayMode === 'dark';

  return (
    <div className="max-w-4xl mx-auto p-4 pb-32 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black">🎮 سوق الحسابات</h2>
        <Link to="/market/sell" className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-bold text-sm shadow-lg hover:scale-105 transition">بيع حساب</Link>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
        {['الكل', 'PUBG', 'Free Fire', 'COD', 'Fortnite', 'FIFA'].map(game => (
          <button
            key={game}
            onClick={() => setGameFilter(game)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
              gameFilter === game ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
            } border`}
          >
            {game}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(acc => (
          <div key={acc.id} className={`rounded-3xl overflow-hidden border transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
            {settings.showMarketImages && (
              <div className="h-48 relative">
                <img src={acc.images[0]} alt={acc.game} className="w-full h-full object-cover" />
                <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg ${
                  acc.status === 'verified' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                  {acc.status === 'verified' ? '✔ تم التحقق' : '⏳ قيد المراجعة'}
                </div>
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{acc.game} - ليفل {acc.level}</h3>
                  <p className="text-xs opacity-60">سيرفر: {acc.server} | ربط: {acc.binding}</p>
                </div>
                <div className="text-blue-600 font-black text-xl">{acc.price} ريال</div>
              </div>
              <p className="text-sm opacity-70 mb-6 leading-relaxed">{acc.description}</p>
              <button 
                onClick={() => handleBuy(acc)}
                className="w-full blue-gradient text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-blue-500/20 active:scale-95 transition"
              >
                طلب شراء الحساب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
