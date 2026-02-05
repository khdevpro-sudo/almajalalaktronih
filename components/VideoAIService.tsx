
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { WHATSAPP_NUMBER } from '../constants';

const VideoAIService: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [aspect, setAspect] = useState<'16:9' | '9:16'>('16:9');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateVideo = async () => {
    if (!prompt && !image) return;
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
      return;
    }

    setLoading(true);
    setStatus('جاري تحليل الطلب...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: image ? { imageBytes: image.data, mimeType: image.mimeType } : undefined,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspect
        }
      });

      while (!operation.done) {
        setStatus('جاري المعالجة السينمائية (قد تستغرق دقائق)...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء توليد الفيديو.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 glass-card text-white hover:bg-white/20 transition-all shadow-xl">
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        </button>
        <h2 className="text-3xl font-black text-white">استوديو Veo AI</h2>
      </div>

      <div className="glass-card p-8 border-white/20 shadow-2xl space-y-8">
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black opacity-30 uppercase text-white">الدقة</label>
              <select onChange={(e: any) => setResolution(e.target.value)} className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white text-xs font-bold outline-none">
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black opacity-30 uppercase text-white">الأبعاد</label>
              <select onChange={(e: any) => setAspect(e.target.value)} className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white text-xs font-bold outline-none">
                <option value="16:9">لاندسكيب (16:9)</option>
                <option value="9:16">بورتريه (9:16)</option>
              </select>
           </div>
        </div>

        <div className="relative group border-2 border-dashed border-white/10 rounded-[2rem] p-6 text-center hover:border-rose-500/50 transition-all cursor-pointer">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          <div className="text-4xl mb-2">{image ? '✅' : '📸'}</div>
          <p className="text-xs font-bold text-white/50">{image ? 'تم اختيار صورة للتحريك' : 'اضغط لإضافة صورة لتحريكها بالذكاء'}</p>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="صف ما سيحدث في الفيديو.."
          className="w-full p-6 rounded-[2rem] bg-black/30 border border-white/10 text-white placeholder-white/20 focus:ring-2 focus:ring-rose-500 outline-none transition h-32 font-bold text-sm"
        />

        <button
          onClick={generateVideo}
          disabled={loading || (!prompt && !image)}
          className={`w-full py-6 rounded-[2.5rem] font-black text-xl text-white shadow-2xl transition-all ${
            loading ? 'bg-gray-800 animate-pulse' : 'bg-gradient-to-r from-rose-600 to-orange-600 hover:brightness-110'
          }`}
        >
          {loading ? status : 'توليد الفيديو السينمائي'}
        </button>
      </div>

      {videoUrl && (
        <div className="glass-card p-6 animate-in zoom-in-95 duration-700 border-rose-500/30">
           <video src={videoUrl} controls autoPlay loop className="w-full rounded-[2rem] shadow-2xl border border-white/10" />
           <a href={videoUrl} download="video.mp4" className="block w-full text-center mt-6 bg-rose-600 py-4 rounded-2xl font-black text-xs text-white">تنزيل الفيديو</a>
        </div>
      )}
    </div>
  );
};

export default VideoAIService;
