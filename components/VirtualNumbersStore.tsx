
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { VirtualNumber } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

const VIRTUAL_NUMBERS: VirtualNumber[] = [
  { id: '1', country: 'الولايات المتحدة', flag: '🇺🇸', code: '+1', price: 15, services: ['واتساب', 'تليجرام', 'جوجل'], type: 'SMS', duration: 'صلاحية شهر', isAvailable: true },
  { id: '2', country: 'المملكة المتحدة', flag: '🇬🇧', code: '+44', price: 20, services: ['واتساب', 'تيك توك', 'تويتر'], type: 'Both', duration: 'صلاحية 3 أشهر', isAvailable: true },
  { id: '3', country: 'روسيا', flag: '🇷🇺', code: '+7', price: 8, services: ['تليجرام', 'واتساب'], type: 'SMS', duration: 'استخدام مرة واحدة', isAvailable: true },
  { id: '4', country: 'ألمانيا', flag: '🇩🇪', code: '+49', price: 25, services: ['واتساب', 'تليجرام', 'باي بال'], type: 'SMS', duration: 'صلاحية سنة', isAvailable: true },
  { id: '5', country: 'فرنسا', flag: '🇫🇷', code: '+33', price: 22, services: ['واتساب', 'إنستغرام'], type: 'SMS', duration: 'صلاحية شهر', isAvailable: true },
  { id: '6', country: 'تركيا', flag: '🇹🇷', code: '+90', price: 12, services: ['واتساب', 'تليجرام'], type: 'SMS', duration: 'صلاحية 15 يوم', isAvailable: true },
  { id: '7', country: 'كندا', flag: '🇨🇦', code: '+1', price: 18, services: ['واتساب', 'فيسبوك'], type: 'SMS', duration: 'صلاحية شهر', isAvailable: true },
  { id: '8', country: 'هولندا', flag: '🇳🇱', code: '+31', price: 30, services: ['واتساب', 'تليجرام', 'بنوك'], type: 'Both', duration: 'دائم', isAvailable: true },
  { id: '9', country: 'إندونيسيا', flag: '🇮🇩', code: '+62', price: 5, services: ['تليجرام'], type: 'SMS', duration: 'استخدام مرة واحدة', isAvailable: true },
  { id: '10', country: 'الهند', flag: '🇮🇳', code: '+91', price: 7, services: ['واتساب'], type: 'SMS', duration: 'صلاحية أسبوع', isAvailable: true },
];

const VirtualNumbersStore: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeService, setActiveService] = useState('الكل');

  const filtered = useMemo(() => {
    return VIRTUAL_NUMBERS.filter(n => 
      (n.country.includes(search) || n.code.includes(search)) &&
      (activeService === 'الكل' || n.services.includes(activeService))
    );
  }, [search, activeService]);

  const handleOrder = (num: VirtualNumber) => {
    const msg = `طلب رقم وهمي جديد من المجال الإلكترونية\nالدولة: ${num.country} (${num.flag})\nالكود: ${num.code}\nالخدمة المطلوبة: ${activeService === 'الكل' ? 'واتساب' : activeService}\nالسعر: ${num.price} ريال`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-32 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-10 staggered-entry" style={{ animationDelay: '0.1s' }}>
        <button onClick={() => navigate(-1)} className="p-3 glass-card text-white hover:bg-white/20 transition-all border-none shadow-xl active:scale-90">
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">متجر الأرقام العالمية</h2>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
             <p className="text-[10px] font-bold text-blue-200 opacity-90 uppercase tracking-[2px]">Secure Global Activation</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-10 space-y-6 staggered-entry" style={{ animationDelay: '0.2s' }}>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
          <input
            type="text"
            placeholder="ابحث عن دولة أو كود (مثال: +1)..."
            className="relative w-full p-6 pr-14 glass-card border-white/10 text-white placeholder-white/30 focus:ring-0 outline-none transition-all font-bold text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl opacity-40 group-hover:scale-110 transition-transform pointer-events-none">🔍</span>
        </div>

        <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2">
          {['الكل', 'واتساب', 'تليجرام', 'تيك توك', 'إنستغرام', 'جوجل', 'بنوك'].map(service => (
            <button
              key={service}
              onClick={() => setActiveService(service)}
              className={`whitespace-nowrap px-8 py-3.5 rounded-2xl font-black text-xs transition-all border ${
                activeService === service 
                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] scale-105' 
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 staggered-entry" style={{ animationDelay: '0.3s' }}>
        {filtered.map((num, index) => (
          <div 
            key={num.id} 
            className="group relative glass-card p-0 border-white/10 hover:border-blue-400/50 transition-all duration-500 overflow-hidden flex flex-col h-full hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
            style={{ animationDelay: `${0.05 * index}s` }}
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 opacity-[0.03] blur-[80px] rounded-full -mr-20 -mt-20 group-hover:opacity-[0.07] transition-opacity"></div>
            
            <div className="p-7 flex-grow">
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-5 items-center">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-blue-500/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-6xl bg-white/5 w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 border border-white/5">
                      {num.flag}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-2xl text-white group-hover:text-blue-400 transition-colors tracking-tight">{num.country}</h3>
                    <div className="inline-flex items-center gap-1.5 bg-blue-600/20 px-3 py-1 rounded-lg border border-blue-500/20">
                      <span className="text-blue-400 font-black text-sm tabular-nums tracking-tighter">{num.code}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5 group-hover:border-blue-500/30 transition-all">
                    <span className="text-2xl font-black text-white tabular-nums">{num.price}</span>
                    <span className="text-[10px] font-black text-blue-400 mr-1 uppercase">ريال</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                    <span>متاح للتفعيل</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">التطبيقات المدعومة</p>
                  <div className="flex flex-wrap gap-2">
                    {num.services.map(s => (
                      <span key={s} className="bg-blue-600/10 border border-blue-500/10 text-[9px] font-black px-4 py-2 rounded-xl text-blue-300 group-hover:bg-blue-600/20 transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-3">
                    <span className="text-xl">📧</span>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-white/30 uppercase">النوع</span>
                      <span className="text-[10px] font-bold text-white/70">{num.type === 'SMS' ? 'استقبال رسائل' : num.type === 'Call' ? 'استقبال مكالمات' : 'رسائل واتصال'}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-3">
                    <span className="text-xl">⏱️</span>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-white/30 uppercase">المدة</span>
                      <span className="text-[10px] font-bold text-white/70">{num.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleOrder(num)}
              className="w-full py-6 blue-gradient text-white font-black text-sm transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 border-t border-white/10 group-hover:brightness-125"
            >
              <span>طلب الرقم الآن</span>
              <div className="bg-white/20 p-2 rounded-xl group-hover:translate-x-1 transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-32 glass-card mt-8 border-dashed border-2 border-white/5">
          <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-7xl animate-float">🌍</div>
          <h3 className="font-black text-2xl text-white mb-3 tracking-tight">لم نجد نتائج مطابقة</h3>
          <p className="text-sm text-white/40 font-bold max-w-xs mx-auto leading-relaxed">جرب البحث بكلمة أخرى أو تصفح قسم خدمات مختلف للحصول على طلبك.</p>
          <button 
            onClick={() => {setSearch(''); setActiveService('الكل');}} 
            className="mt-10 bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-600/30"
          >
            استعادة كافة النتائج
          </button>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 staggered-entry" style={{ animationDelay: '0.6s' }}>
        {[
          { icon: '🛡️', title: 'حماية كاملة', desc: 'أرقام آمنة ومشفرة' },
          { icon: '⚡', title: 'تفعيل فوري', desc: 'استلام الكود في ثوانٍ' },
          { icon: '👨‍💻', title: 'دعم تقني', desc: 'متواجدون لمساعدتك 24/7' }
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{badge.icon}</div>
            <div>
              <h4 className="text-xs font-black text-white mb-0.5">{badge.title}</h4>
              <p className="text-[10px] font-bold text-white/30">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualNumbersStore;
