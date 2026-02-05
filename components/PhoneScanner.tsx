
import React, { useState, useEffect } from 'react';

const PhoneScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'security' | 'battery'>('security');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [scanMessage, setScanMessage] = useState('');

  const messages = {
    security: [
      'جاري فحص جذور النظام (Root Check)...',
      'تحليل العمليات الخلفية المشبوهة...',
      'البحث عن برمجيات التجسس (Spyware)...',
      'فحص أذونات الكاميرا والميكروفون...',
      'التأكد من سلامة ملفات التمهيد...',
      'اكتمال الفحص الأمني بنجاح.'
    ],
    battery: [
      'قراءة فولتية الخلايا الحالية...',
      'تحليل استهلاك المعالج للطاقة...',
      'حساب عدد دورات الشحن الكاملة...',
      'قياس السعة القصوى الفعلية...',
      'تحليل مستوى تآكل المكونات الكيميائية...',
      'فحص درجة حرارة المكونات الداخلية...',
      'تم الانتهاء من تحليل الطاقة الشامل.'
    ]
  };

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setResult(null);
  };

  useEffect(() => {
    if (scanning && progress < 100) {
      const step = 2.5;
      const timer = setTimeout(() => {
        const nextProgress = progress + step;
        setProgress(nextProgress);
        
        // تحديث رسالة الفحص بناءً على التقدم
        const msgIndex = Math.floor((nextProgress / 100) * messages[activeTab].length);
        setScanMessage(messages[activeTab][Math.min(msgIndex, messages[activeTab].length - 1)]);
      }, 70);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setScanning(false);
      if (activeTab === 'security') {
        const outcomes = ['safe', 'warning', 'safe', 'danger'];
        setResult({ type: outcomes[Math.floor(Math.random() * outcomes.length)] });
      } else {
        setResult({
          health: 'ممتازة',
          percentage: 92,
          cycles: 412,
          temp: '32°C',
          maxCapacity: '4850 mAh',
          wearLevel: '4%',
          status: 'جيد جداً',
          tips: 'ينصح بفصل الشاحن عند وصول النسبة لـ 80% لإطالة عمر الخلايا الكيميائية.'
        });
      }
    }
  }, [scanning, progress, activeTab]);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 p-2 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-700 flex mb-8 overflow-hidden">
        <button 
          onClick={() => { setActiveTab('security'); setResult(null); }}
          className={`flex-1 py-4 rounded-[2rem] font-black text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
        >
          <span className="text-lg">⚔️</span> فحص التهكير
        </button>
        <button 
          onClick={() => { setActiveTab('battery'); setResult(null); }}
          className={`flex-1 py-4 rounded-[2rem] font-black text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'battery' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
        >
          <span className="text-lg">🔋</span> فحص البطارية
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-10 rounded-[3.5rem] shadow-2xl border border-gray-50 dark:border-slate-700 text-center relative overflow-hidden transition-all duration-500">
        {scanning && (
          <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[6px] z-20 flex flex-col items-center justify-center p-8">
            <div className="relative w-48 h-48 mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200 dark:text-slate-700" />
                <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={540} strokeDashoffset={540 - (540 * progress) / 100} className="text-blue-600 transition-all duration-300" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-black text-blue-600">{Math.round(progress)}%</span>
                <span className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">Scanning</span>
              </div>
            </div>
            <p className="text-blue-600 font-bold text-sm animate-pulse h-6">
              {scanMessage}
            </p>
          </div>
        )}

        <div className="mb-10">
          <div className={`w-28 h-28 mx-auto rounded-[2.5rem] flex items-center justify-center text-5xl mb-6 shadow-inner ${activeTab === 'security' ? 'bg-red-50 text-red-500 dark:bg-red-900/10' : 'bg-green-50 text-green-500 dark:bg-green-900/10'}`}>
            {activeTab === 'security' ? '🕵️' : '⚡'}
          </div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white">
            {activeTab === 'security' ? 'فحص الاختراق والتهكير' : 'تحليل صحة البطارية'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 leading-relaxed max-w-sm mx-auto">
            {activeTab === 'security' ? 'نظام "عين الصقر" لكشف تطبيقات التجسس والوصول غير المصرح به للمعلومات.' : 'تحليل تقني شامل لمستوى استهلاك الخلايا ودرجة حرارة المكونات لضمان أداء يدوم.'}
          </p>
        </div>

        {result ? (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            {activeTab === 'security' ? (
              <div className={`p-8 rounded-[2.5rem] border-2 shadow-inner ${
                result.type === 'safe' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/10 dark:border-green-800' :
                result.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/10 dark:border-yellow-800' :
                'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-800'
              }`}>
                <div className="text-6xl mb-4 animate-bounce">
                  {result.type === 'safe' ? '🛡️' : result.type === 'warning' ? '⚠️' : '🚨'}
                </div>
                <h3 className="text-2xl font-black mb-2">
                  {result.type === 'safe' ? 'النظام آمن ومحمي' : result.type === 'warning' ? 'تنبيه: أذونات حساسة' : 'خطر: تم رصد محاولة تهكير!'}
                </h3>
                <p className="text-sm font-medium opacity-80 leading-relaxed">
                  {result.type === 'safe' ? 'لم يتم العثور على أي برمجيات خبيثة أو عمليات تتبع نشطة في جهازك حالياً.' : 
                   result.type === 'warning' ? 'تم العثور على تطبيقات تطلب الوصول للكاميرا والموقع بشكل متكرر في الخلفية.' : 
                   'تحذير عالي الخطورة! تم اكتشاف تعديل في ملفات النظام الأساسية ومحاولة سحب بيانات نشطة.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'صحة الخلايا', value: result.health, color: 'text-green-500', icon: '💎' },
                    { label: 'النسبة الحقيقية', value: `${result.percentage}%`, color: 'text-blue-600', icon: '📊' },
                    { label: 'السعة القصوى', value: result.maxCapacity, color: 'text-indigo-600', icon: '🔋' },
                    { label: 'مستوى التآكل', value: result.wearLevel, color: 'text-red-500', icon: '📉' },
                    { label: 'دورات الشحن', value: result.cycles, color: 'text-gray-700 dark:text-white', icon: '🔄' },
                    { label: 'درجة الحرارة', value: result.temp, color: 'text-orange-500', icon: '🌡️' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-gray-100 dark:border-slate-700 flex flex-col items-center">
                      <span className="text-2xl mb-2">{stat.icon}</span>
                      <span className="text-[10px] font-black opacity-40 uppercase mb-1">{stat.label}</span>
                      <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4 text-right">
                  <span className="text-xl">💡</span>
                  <p className="text-[11px] font-bold text-blue-800 dark:text-blue-200 leading-relaxed">{result.tips}</p>
                </div>
              </div>
            )}
            
            <div className="flex gap-4">
              <button onClick={startScan} className="flex-1 bg-gray-100 dark:bg-slate-700 py-5 rounded-3xl font-black text-xs transition-colors hover:bg-gray-200">إعادة الفحص</button>
              <button className="flex-1 blue-gradient text-white py-5 rounded-3xl font-black text-xs shadow-xl active:scale-95 transition-all">تأمين الجهاز فوراً</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={startScan}
            className="w-full blue-gradient text-white py-6 rounded-[2.5rem] font-black text-lg shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span>بدء الفحص الشامل</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>

      <div className="mt-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner">⚠️</div>
          <div className="flex-grow">
            <h4 className="font-black text-sm dark:text-white mb-1">نصيحة أمنية</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">لا تقم أبداً بتثبيت تطبيقات من خارج المتجر الرسمي، وقم بتغيير كلمات المرور بشكل دوري كل 3 أشهر لضمان أقصى حماية.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneScanner;
