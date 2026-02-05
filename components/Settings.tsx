
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSettings } from '../types';
import { WHATSAPP_NUMBER, PLATFORM_URL } from '../constants';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const navigate = useNavigate();
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'latest' | 'available'>('idle');
  const [copied, setCopied] = useState(false);

  const update = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckUpdate = () => {
    setCheckingUpdate(true);
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateStatus('latest');
    }, 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(PLATFORM_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = settings.displayMode === 'dark';
  const sectionClass = `p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-slate-800 border-slate-700 shadow-lg' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className={`p-2 rounded-xl transition-transform active:scale-95 ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
          <svg className="w-6 h-6 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <h2 className="text-2xl font-black text-gray-800 dark:text-white">إعدادات المنصة</h2>
      </div>

      <div className="space-y-6">
        {/* رابط المنصة - الجديد */}
        <section className={sectionClass}>
          <h3 className="font-bold mb-6 flex items-center gap-2 text-blue-600">🔗 رابط المنصة الرسمي</h3>
          <div className="bg-black/10 dark:bg-black/40 p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
             <div className="flex items-center justify-between gap-3">
                <code className="text-[11px] font-mono text-blue-400 truncate dir-ltr">{PLATFORM_URL}</code>
                <button 
                  onClick={copyLink}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {copied ? 'تم النسخ!' : 'نسخ الرابط'}
                </button>
             </div>
             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
               يمكنك مشاركة هذا الرابط مع أصدقائك للوصول إلى كافة خدمات "المجال الإلكترونية" بشكل مباشر وآمن.
             </p>
          </div>
        </section>

        {/* تحديث التطبيق */}
        <section className={`${sectionClass} relative overflow-hidden group`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-2xl">🔄</div>
              <div>
                <h3 className="font-bold text-blue-600">تحديث المنصة</h3>
                <p className="text-[10px] opacity-60">الإصدار الحالي: v2.5.0</p>
              </div>
            </div>
            {updateStatus === 'latest' && (
              <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-1 rounded-lg">مُحدّث</span>
            )}
          </div>
          <button 
            onClick={handleCheckUpdate}
            disabled={checkingUpdate}
            className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 ${
              checkingUpdate ? 'bg-gray-100 text-gray-400 cursor-wait' : 'blue-gradient text-white shadow-xl'
            }`}
          >
            {checkingUpdate ? 'جاري التحقق...' : 'التحقق من وجود تحديث'}
          </button>
        </section>

        {/* المظهر العام */}
        <section className={sectionClass}>
          <h3 className="font-bold mb-6 flex items-center gap-2 text-blue-600">🎨 تخصيص المظهر</h3>
          <div className="space-y-6">
            <div className="flex gap-3">
              {(['professional', 'dark-blue', 'light-blue'] as const).map(t => (
                <button 
                  key={t} 
                  onClick={() => update('themeColor', t)} 
                  className={`flex-1 h-14 rounded-2xl border-4 transition-all ${settings.themeColor === t ? 'border-blue-500 scale-105 shadow-lg' : 'border-transparent'} ${t === 'professional' ? 'bg-blue-600' : t === 'dark-blue' ? 'bg-slate-900' : 'bg-sky-500'}`} 
                />
              ))}
            </div>
            <div className="flex bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl shadow-inner">
              <button 
                onClick={() => update('displayMode', 'light')} 
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${settings.displayMode === 'light' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500'}`}
              >☀️ فاتح</button>
              <button 
                onClick={() => update('displayMode', 'dark')} 
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${settings.displayMode === 'dark' ? 'bg-slate-800 shadow-md text-white' : 'text-gray-500'}`}
              >🌙 داكن</button>
            </div>
          </div>
        </section>

        {/* الإشعارات */}
        <section className={sectionClass}>
          <h3 className="font-bold mb-6 flex items-center gap-2 text-blue-600">🔔 الإشعارات</h3>
          <div className="space-y-2">
            {[
              { key: 'notificationsEnabled', label: 'كافة التنبيهات', icon: '📢' },
              { key: 'orderNotifications', label: 'متابعة الطلبات', icon: '🛒' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-bold opacity-80">{item.label}</span>
                </div>
                <div 
                  onClick={() => update(item.key as any, !(settings as any)[item.key])}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${ (settings as any)[item.key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-700' }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${ (settings as any)[item.key] ? 'left-1' : 'left-7' }`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center p-8 mt-4 border-t border-gray-100 dark:border-slate-800">
          <div className="flex flex-col items-center gap-4">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-green-50 dark:bg-green-900/10 px-6 py-3 rounded-2xl border border-green-100 dark:border-green-800/30 group hover:scale-105 transition-all">
              <div className="bg-green-500 p-2 rounded-lg text-white shadow-lg group-hover:rotate-12 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
              <span className="font-black text-green-700 dark:text-green-400 text-lg tabular-nums">{WHATSAPP_NUMBER}</span>
            </a>
            <div className="opacity-30">
              <p className="text-[9px] font-black uppercase tracking-[2px]">Al-Majal Security Hub</p>
              <p className="text-[10px] mt-1">المجال الإلكترونية © 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
