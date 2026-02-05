
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';

const URLScanner: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const scanUrl = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `قم بتحليل هذا الرابط من الناحية الأمنية واذكر إذا كان يبدو آمناً أم محاولة تصيد احتيالي (Phishing). اذكر الأسباب باختصار شديد جداً. الرابط هو: ${url}`,
        config: {
          systemInstruction: "أنت خبير أمن سيبراني. قدم إجابة قصيرة جداً ومباشرة بالعربية. صنف الرابط كـ (آمن، مشبوه، خطر)."
        }
      });

      const text = response.text || "فشل التحليل";
      const status = text.includes('خطر') ? 'danger' : text.includes('مشبوه') ? 'warning' : 'safe';
      
      setResult({ status, message: text });
    } catch (e) {
      console.error(e);
      setResult({ status: 'error', message: 'حدث خطأ أثناء فحص الرابط.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/10 rounded-xl text-white">
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        </button>
        <h2 className="text-2xl font-black text-white">فحص الروابط الذكي</h2>
      </div>

      <div className="glass-card p-8 border-blue-500/20 shadow-2xl space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 animate-pulse shadow-inner">🔍</div>
          <p className="text-xs font-bold text-blue-300 opacity-60 uppercase tracking-widest">تحليل مدعوم بالذكاء الاصطناعي</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="انسخ الرابط هنا (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-5 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-white/20 focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-sm"
          />

          <button
            onClick={scanUrl}
            disabled={loading || !url}
            className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${
              loading ? 'bg-gray-800 text-gray-400' : 'blue-gradient text-white hover:scale-[1.02] active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>جاري تحليل الرابط...</span>
              </>
            ) : (
              <>
                <span>ابدأ الفحص الأمني</span>
                <span className="text-xl">🛡️</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <div className={`p-6 rounded-3xl border-2 animate-in zoom-in-95 duration-300 ${
            result.status === 'safe' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
            result.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
            'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">
                {result.status === 'safe' ? '✅' : result.status === 'warning' ? '⚠️' : '🚫'}
              </span>
              <div>
                <h4 className="font-black text-lg mb-1">
                  {result.status === 'safe' ? 'الرابط يبدو آمناً' : result.status === 'warning' ? 'تنبيه: الرابط مشبوه' : 'خطر: محتوى ضار!'}
                </h4>
                <p className="text-xs leading-relaxed opacity-80 font-bold">{result.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-900/20 border border-blue-500/20 p-5 rounded-[2rem] flex items-start gap-4">
        <span className="text-2xl">💡</span>
        <div className="space-y-1">
          <h5 className="font-black text-blue-400 text-xs">نصيحة أمنية:</h5>
          <p className="text-[10px] font-bold text-white/50 leading-relaxed">المخترقون يستخدمون روابط تشبه الروابط الأصلية (مثال: faceboook.com بدل facebook.com). دائماً تأكد من تهجئة اسم الموقع بدقة قبل إدخال بياناتك.</p>
        </div>
      </div>
    </div>
  );
};

export default URLScanner;
