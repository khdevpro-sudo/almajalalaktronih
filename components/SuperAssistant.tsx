
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';

// Simple check for Speech Recognition support
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

type AIModel = 'gemini-3-pro-preview' | 'gemini-3-flash-preview';

const SuperAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; thinking?: string; sources?: any[] }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [useMaps, setUseMaps] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-3-pro-preview');
  const [isListening, setIsListening] = useState(false);
  const [media, setMedia] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const lang = document.documentElement.lang || 'ar';

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = lang === 'ar' ? 'ar-SA' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setInput(prev => prev + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(lang === 'ar' ? 'متصفحك لا يدعم الإدخال الصوتي.' : 'Your browser does not support voice input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setMedia({ data: base64, mimeType: file.type, name: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearHistory = () => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من مسح سجل المحادثة؟' : 'Are you sure you want to clear the chat history?')) {
      setMessages([]);
      setMedia(null);
      setInput('');
    }
  };

  const askGemini = async () => {
    if (!input && !media) return;
    if (isListening) toggleListening(); // Stop listening when sending

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg || (lang === 'ar' ? `رفع ملف: ${media?.name}` : `Uploaded file: ${media?.name}`) }]);
    setInput('');
    setLoading(true);
    setThinking(true);

    try {
      // Initialize right before use to ensure the latest API key environment is captured
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const tools: any[] = [];
      if (useSearch) tools.push({ googleSearch: {} });
      if (useMaps) tools.push({ googleMaps: {} });

      const parts: any[] = [];
      if (media) parts.push({ inlineData: { data: media.data, mimeType: media.mimeType } });
      if (userMsg) parts.push({ text: userMsg });

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: { parts },
        config: {
          thinkingConfig: { thinkingBudget: selectedModel === 'gemini-3-pro-preview' ? 32768 : 24576 },
          tools: tools.length > 0 ? tools : undefined,
          systemInstruction: lang === 'ar' 
            ? "أنت مساعد المجال الخارق. خبير تقني وأمني. أجب بالعربية باحترافية." 
            : "You are Al-Majal Super Assistant. Technical and security expert. Answer professionally."
        }
      });

      const aiText = response.text || (lang === 'ar' ? "لم أتمكن من استيعاب الطلب." : "I couldn't process the request.");
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: aiText,
        sources: grounding
      }]);
      setMedia(null);
    } catch (e) {
      console.error('Gemini API Error:', e);
      let errorMsg = lang === 'ar' ? "حدث خطأ تقني. يرجى المحاولة لاحقاً." : "Technical error. Please try again later.";
      
      if (e instanceof Error && e.message.includes('fetch')) {
        errorMsg = lang === 'ar' ? "فشل الاتصال بالخادم. تأكد من جودة الإنترنت ومفتاح الـ API." : "Connection failed. Check your internet and API key.";
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: errorMsg 
      }]);
    } finally {
      setLoading(false);
      setThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] pb-4 animate-in fade-in duration-500">
      {/* Dynamic Header */}
      <div className="p-4 glass-card mx-4 mb-4 flex flex-col gap-4 border-amber-500/30 shadow-2xl">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-xl shadow-inner">🧠</div>
            <div>
              <h3 className="text-sm font-black text-white">{lang === 'ar' ? 'المساعد الخارق Pro' : 'Super Assistant Pro'}</h3>
              <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">
                {thinking ? (lang === 'ar' ? 'جاري التفكير العميق...' : 'Thinking deeply...') : (lang === 'ar' ? 'جاهز للمهام المعقدة' : 'Ready for complex tasks')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={clearHistory}
              title={lang === 'ar' ? 'حذف سجل المحادثة' : 'Clear Chat History'}
              className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button 
              onClick={() => setUseSearch(!useSearch)}
              className={`p-2 rounded-lg text-[10px] font-black transition-all ${useSearch ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40'}`}
            >{lang === 'ar' ? '🌍 بحث' : '🌍 Search'}</button>
            <button 
              onClick={() => setUseMaps(!useMaps)}
              className={`p-2 rounded-lg text-[10px] font-black transition-all ${useMaps ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white/40'}`}
            >{lang === 'ar' ? '📍 خرائط' : '📍 Maps'}</button>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex bg-black/20 p-1 rounded-xl w-full border border-white/5">
          <button 
            onClick={() => setSelectedModel('gemini-3-pro-preview')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedModel === 'gemini-3-pro-preview' ? 'bg-amber-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            {lang === 'ar' ? 'Gemini 3 Pro (الأذكى)' : 'Gemini 3 Pro (Smartest)'}
          </button>
          <button 
            onClick={() => setSelectedModel('gemini-3-flash-preview')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedModel === 'gemini-3-flash-preview' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            {lang === 'ar' ? 'Gemini 3 Flash (الأسرع)' : 'Gemini 3 Flash (Fastest)'}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto px-4 space-y-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <div className="text-6xl mb-4">✨</div>
            <h4 className="font-black text-xl mb-2">{lang === 'ar' ? 'كيف يمكنني مساعدتك اليوم؟' : 'How can I help you today?'}</h4>
            <p className="text-sm font-bold max-w-xs mx-auto">
              {lang === 'ar' 
                ? 'يمكنني حل المسائل الرياضية، تحليل الصور، والبحث عن أحدث الأخبار العالمية.' 
                : 'I can solve math problems, analyze images, and search for the latest global news.'}
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl shadow-xl ${
              m.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'glass-card border-amber-500/20 text-white rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-bold">{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[9px] font-black opacity-40 uppercase">{lang === 'ar' ? 'المصادر الموثوقة:' : 'Reliable Sources:'}</p>
                  {m.sources.map((s: any, idx: number) => (
                    <a key={idx} href={s.web?.uri || s.maps?.uri} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-blue-400 hover:underline truncate">
                       🔗 {s.web?.title || s.maps?.title || (lang === 'ar' ? "رابط المصدر" : "Source Link")}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="glass-card p-4 rounded-3xl rounded-tl-none flex gap-3 items-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] font-black text-amber-400 opacity-60 uppercase">{lang === 'ar' ? 'جاري التفكير...' : 'Thinking...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4">
        <div className={`glass-card p-2 flex items-center gap-2 border-white/20 ${isListening ? 'ring-2 ring-red-500/50' : ''}`}>
          <div className="flex items-center gap-1">
            <div className="relative">
              <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <button className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${media ? 'bg-amber-600 text-white' : 'bg-white/5 text-white/40'}`}>
                {media ? '📎' : '📷'}
              </button>
            </div>
            
            <button 
              onClick={toggleListening}
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${
                isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
              title={lang === 'ar' ? 'تحدث الآن' : 'Speak now'}
            >
              {isListening ? '🛑' : '🎙️'}
            </button>
          </div>

          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askGemini()}
            placeholder={isListening ? (lang === 'ar' ? 'أنا أسمعك...' : 'Listening...') : (lang === 'ar' ? 'اسأل أي شيء..' : 'Ask anything..')}
            className="flex-grow bg-transparent p-3 text-sm font-bold text-white outline-none"
          />
          
          <button 
            onClick={askGemini}
            disabled={loading}
            className="w-11 h-11 blue-gradient rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          >
            <svg className={`w-6 h-6 ${lang === 'ar' ? '' : 'transform rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {media && (
          <div className="mt-2 px-4 flex justify-between items-center bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 animate-in slide-in-from-top-2">
            <span className="text-[10px] font-black text-amber-400 truncate max-w-[200px]">{lang === 'ar' ? 'تم إرفاق:' : 'Attached:'} {media.name}</span>
            <button onClick={() => setMedia(null)} className="text-amber-400 hover:text-white">✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAssistant;
