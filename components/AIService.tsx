
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
// Import WHATSAPP_NUMBER from constants
import { WHATSAPP_NUMBER } from '../constants';

const AIService: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [base64Input, setBase64Input] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBase64Input(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const processAI = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      // Fix: Strictly use process.env.API_KEY for initialization as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contents: any = {
        parts: [
          ...(base64Input ? [{ inlineData: { data: base64Input, mimeType: 'image/png' } }] : []),
          { text: base64Input ? `Edit this image based on: ${prompt}` : `Create a professional digital art for: ${prompt}` }
        ]
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert('فشل في المعالجة. يرجى التأكد من اتصال الإنترنت.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 space-y-6">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-2xl border border-purple-100 dark:border-purple-900/30">
        <h2 className="text-2xl font-black text-purple-600 mb-2 flex items-center gap-3">
          <span className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">🎨</span> 
          محرر الصور الذكي
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">أرفق صورة لتعديلها (إزالة خلفية، إضافة عناصر) أو اطلب تصميماً جديداً كلياً.</p>
        
        <div className="space-y-6">
          <div className="relative group">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className={`p-8 border-2 border-dashed rounded-3xl text-center transition ${base64Input ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-400' : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700'}`}>
              <span className="text-4xl block mb-2">{base64Input ? '✅' : '📷'}</span>
              <p className="font-bold text-sm">{base64Input ? 'تم اختيار صورة للتعديل' : 'اضغط لإضافة صورة للتعديل عليها'}</p>
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={base64Input ? "مثال: أزل الشخص في الخلفية واجعل السماء غروباً..." : "صف ما تريد تصميمه من البداية..."}
            className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-purple-500 outline-none transition h-32 font-bold text-sm"
          />

          <button
            onClick={processAI}
            disabled={loading || !prompt}
            className={`w-full py-5 rounded-[2rem] font-black text-white shadow-xl transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {loading ? 'جاري المعالجة الرقمية...' : (base64Input ? 'تعديل الصورة الآن' : 'توليد تصميم جديد')}
          </button>
        </div>
      </div>

      {image && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-500">
          <img src={image} alt="AI result" className="w-full rounded-2xl shadow-inner mb-6 border border-gray-100 dark:border-slate-700" />
          <div className="flex gap-3">
            <a href={image} download="al-majal-ai.png" className="flex-1 bg-gray-100 dark:bg-slate-700 py-4 rounded-2xl font-black text-xs text-center">حفظ في الجهاز</a>
            {/* Fix: Use WHATSAPP_NUMBER constant instead of non-existent environment variable */}
            <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=اطلب طباعة هذا التصميم الذكي`, '_blank')} className="flex-1 blue-gradient text-white py-4 rounded-2xl font-black text-xs">طلب طباعة التصميم</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIService;
