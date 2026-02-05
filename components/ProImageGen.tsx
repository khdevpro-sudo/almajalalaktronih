
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { WHATSAPP_NUMBER } from '../constants';

const ProImageGen: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspect, setAspect] = useState<'1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9'>('1:1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt) return;
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            imageSize: size,
            aspectRatio: aspect as any
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ. يرجى التأكد من صلاحية مفتاح API المختار.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 glass-card text-white hover:bg-white/20 transition-all">
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        </button>
        <h2 className="text-3xl font-black text-white">المصمم الذكي Pro 4K</h2>
      </div>

      <div className="glass-card p-8 border-white/10 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-3">
              <label className="text-[10px] font-black opacity-30 uppercase tracking-widest text-white">دقة التصميم</label>
              <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5">
                {(['1K', '2K', '4K'] as const).map(s => (
                  <button key={s} onClick={() => setSize(s)} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${size === s ? 'bg-indigo-600 text-white' : 'text-white/30'}`}>{s}</button>
                ))}
              </div>
           </div>
           
           <div className="space-y-3">
              <label className="text-[10px] font-black opacity-30 uppercase tracking-widest text-white">الأبعاد النهائية</label>
              <div className="flex flex-wrap bg-black/20 p-1.5 rounded-2xl border border-white/5 gap-1">
                {(['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'] as const).map(a => (
                  <button key={a} onClick={() => setAspect(a)} className={`px-3 py-2 rounded-lg text-[9px] font-black transition-all ${aspect === a ? 'bg-indigo-600 text-white' : 'text-white/30'}`}>{a}</button>
                ))}
              </div>
           </div>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="صف ما تتخيله بدقة.. (مثلاً: رائد فضاء عربي يسير فوق سحب المريخ، أسلوب سريالي، جودة 8k)"
          className="w-full p-6 rounded-[2rem] bg-black/30 border border-white/10 text-white placeholder-white/20 focus:ring-2 focus:ring-indigo-500 outline-none transition h-40 font-bold text-sm"
        />

        <button
          onClick={generate}
          disabled={loading || !prompt}
          className={`w-full py-6 rounded-[2.5rem] font-black text-xl text-white shadow-2xl transition-all ${
            loading ? 'bg-gray-800' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110'
          }`}
        >
          {loading ? 'جاري الرسم الرقمي...' : 'توليد اللوحة الاحترافية'}
        </button>
      </div>

      {result && (
        <div className="glass-card p-6 animate-in zoom-in-95 duration-700 border-white/20 text-center">
           <img src={result} alt="Pro Result" className="w-full rounded-[2rem] shadow-2xl mb-6 border-4 border-white/10" />
           <div className="flex gap-4">
              <a href={result} download="art.png" className="flex-1 bg-white/5 py-4 rounded-2xl font-black text-xs text-white">تنزيل</a>
              <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black text-xs text-white">طلب طباعة</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProImageGen;
