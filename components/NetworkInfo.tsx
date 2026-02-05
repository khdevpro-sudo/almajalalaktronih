
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NetworkInfo: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ipapi.co/json/');
      const json = await response.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/10 rounded-xl text-white">
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        </button>
        <h2 className="text-2xl font-black text-white">معلومات الشبكة و IP</h2>
      </div>

      <div className="glass-card p-8 border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-black text-blue-400 animate-pulse">جاري جلب تفاصيل الاتصال...</p>
          </div>
        ) : data ? (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center pb-6 border-b border-white/5">
              <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">Your Public IP Address</div>
              <div className="text-4xl font-black text-white tabular-nums drop-shadow-md">{data.ip}</div>
              <div className="mt-2 text-xs font-bold text-green-400 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                متصل عبر {data.org}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'الدولة', value: data.country_name, icon: '🌍' },
                { label: 'المدينة', value: data.city, icon: '📍' },
                { label: 'المزود', value: data.asn, icon: '🏢' },
                { label: 'المنطقة الزمانية', value: data.timezone, icon: '⏰' },
                { label: 'خط العرض', value: data.latitude, icon: '🌐' },
                { label: 'خط الطول', value: data.longitude, icon: '🧭' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                  <span className="text-2xl mb-2">{item.icon}</span>
                  <span className="text-[10px] font-black opacity-40 uppercase mb-1">{item.label}</span>
                  <span className="text-xs font-black text-white">{item.value || 'N/A'}</span>
                </div>
              ))}
            </div>

            <button
              onClick={fetchInfo}
              className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <span>تحديث البيانات</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-red-400 font-bold">فشل في جلب البيانات. تأكد من اتصال الإنترنت أو عطل الـ AdBlock.</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-amber-900/20 border border-amber-500/20 p-5 rounded-[2rem] flex items-start gap-4">
        <span className="text-2xl">⚠️</span>
        <div className="space-y-1">
          <h5 className="font-black text-amber-400 text-xs">ملاحظة الخصوصية:</h5>
          <p className="text-[10px] font-bold text-white/50 leading-relaxed">عنوان الـ IP هو بصمتك على الإنترنت. تجنب مشاركة لقطات شاشة لهذه الصفحة مع الغرباء، واستخدم VPN إذا كنت ترغب في تشفير موقعك الحقيقي.</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkInfo;
