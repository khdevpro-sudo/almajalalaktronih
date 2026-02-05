
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  
  const notifications = [
    { id: 1, type: 'order', title: 'تم تحديث حالة طلبك', desc: 'طلب توثيق الواتساب (رقم 775) قيد المراجعة حالياً من قبل الفريق الفني.', time: 'منذ ساعتين', icon: '🔔', read: false },
    { id: 2, type: 'security', title: 'تنبيه أمني مهم', desc: 'تم رصد محاولات دخول مشبوهة في حسابات TikTok عالمياً، ننصح بتفعيل المصادقة الثنائية (2FA).', time: 'منذ 5 ساعات', icon: '🛡️', read: false },
    { id: 3, type: 'promo', title: 'عرض جديد وحصري!', desc: 'خصم 20% على شحن شدات PUBG وبطاقات جوجل بلاي لفترة محدودة.', time: 'منذ يوم واحد', icon: '🎁', read: true },
    { id: 4, type: 'order', title: 'اكتمال الطلب بنجاح', desc: 'تم تفعيل الرقم الوهمي الخاص بك بنجاح. يمكنك استخدامه الآن.', time: 'منذ يومين', icon: '✅', read: true },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/10 rounded-xl text-white shadow-xl active:scale-90 transition-all">
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <h2 className="text-2xl font-black text-white">مركز التنبيهات</h2>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`glass-card p-5 border flex gap-4 transition-all hover:bg-white/15 relative ${
              n.read ? 'opacity-60 grayscale-[0.5]' : 'border-blue-500/30 ring-1 ring-blue-500/10'
            }`}
          >
            {!n.read && (
              <span className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner ${
              n.type === 'security' ? 'bg-red-500/20' : 
              n.type === 'order' ? 'bg-blue-500/20' : 'bg-amber-500/20'
            }`}>
              {n.icon}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-black text-white text-sm">{n.title}</h4>
                <span className="text-[9px] font-bold text-white/40 tabular-nums">{n.time}</span>
              </div>
              <p className="text-[11px] font-bold text-white/60 leading-relaxed">{n.desc}</p>
              <div className="mt-3 flex gap-2">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                   n.type === 'security' ? 'bg-red-500/10 text-red-400' : 
                   n.type === 'order' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {n.type === 'security' ? 'أمن وحماية' : n.type === 'order' ? 'حالة الطلب' : 'عروض ترويجية'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-8 py-4 glass-card border-none text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
        تحديد الكل كمقروء
      </button>
    </div>
  );
};

export default Notifications;
