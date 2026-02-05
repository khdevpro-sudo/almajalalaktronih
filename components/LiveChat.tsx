
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const LiveChat: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('جاهز لمساعدتك');
  const [transcription, setTranscription] = useState('');
  const [showTips, setShowTips] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    try {
      setStatus('جاري الاتصال السحابي...');
      setTranscription('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: { 
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } 
          },
          systemInstruction: 'أنت مجال AI، المساعد الذكي الرسمي لمنصة المجال الإلكترونية. تتحدث بلهجة عربية احترافية وودودة. إجاباتك سريعة جداً ومختصرة. ساعد المستخدمين في توثيق الحسابات، شحن الألعاب، وفحص الأمان.'
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('أنا أسمعك الآن...');
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              sessionPromise.then(session => session.sendRealtimeInput({ media: createBlob(inputData) }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            // تحديث النص المفرغ فوراً للسرعة
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent.outputTranscription.text);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setStatus('المساعد يتحدث...');
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('أنا أسمعك الآن...');
              };
            }
          },
          interrupted: () => {
            for (const source of sourcesRef.current.values()) {
              source.stop();
              sourcesRef.current.delete(source);
            }
            nextStartTimeRef.current = 0;
            setStatus('أسمعك الآن..');
          },
          onclose: () => {
            setIsActive(false);
            setStatus('انتهت الجلسة');
            setTranscription('');
          }
        } as any
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setStatus('حدث خطأ في الاتصال');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setStatus('جاهز لمساعدتك');
  };

  const SUGGESTIONS = [
    "كيف أوثق حسابي؟",
    "أسعار شدات ببجي",
    "فحص الهاتف من الاختراق",
    "فك حظر واتساب"
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 pb-40 space-y-8 animate-in fade-in duration-500">
      {/* Smart Header */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center text-xl shadow-inner">🤖</div>
          <div>
            <h3 className="text-sm font-black text-white">مجال AI</h3>
            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{status}</p>
          </div>
        </div>
        <button onClick={() => setShowTips(!showTips)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg hover:bg-white/10 transition-all">❓</button>
      </div>

      {/* The Central Orb Experience */}
      <div className={`relative p-12 rounded-[4rem] border transition-all duration-700 overflow-hidden flex flex-col items-center justify-center min-h-[450px] ${
        isActive ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_100px_rgba(16,185,129,0.15)]' : 'glass-card border-white/10 shadow-2xl'
      }`}>
        {isActive && <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent animate-pulse" />}
        
        <div className="relative z-10 mb-12">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center relative transition-all duration-700 ${
            isActive ? 'scale-110 shadow-[0_0_80px_rgba(16,185,129,0.5)]' : 'scale-95 grayscale'
          }`}>
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-600 to-blue-700 transition-all ${isActive ? 'animate-pulse' : ''}`} />
            <div className={`absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-20 ${!isActive && 'hidden'}`} />
            <div className="relative text-7xl drop-shadow-2xl">{isActive ? '🌌' : '🛡️'}</div>
          </div>

          {isActive && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 items-end h-8">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="w-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ height: `${Math.random()*100 + 20}%`, animationDelay: `${i*0.1}s` }} />
              ))}
            </div>
          )}
        </div>

        {/* Live Transcription Box */}
        <div className={`w-full max-w-sm h-32 overflow-y-auto no-scrollbar relative z-10 text-center transition-all duration-500 ${isActive && transcription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           <p className="text-xl font-black text-white leading-relaxed drop-shadow-lg">{transcription || 'جارِ التفكير...'}</p>
        </div>

        {!isActive ? (
          <button onClick={startSession} className="relative z-10 bg-white text-blue-900 px-12 py-5 rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <span>ابدأ التحدث الآن</span>
            <span className="text-2xl animate-pulse">⚡</span>
          </button>
        ) : (
          <button onClick={stopSession} className="relative z-10 bg-red-500/20 hover:bg-red-500 text-white px-10 py-4 rounded-3xl font-black text-sm border border-red-500/50 transition-all">إنهاء المحادثة</button>
        )}
      </div>

      {!isActive && (
        <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-4 duration-500 delay-200">
           {SUGGESTIONS.map((q, i) => (
             <button key={i} className="text-right p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
               <span className="text-[10px] font-bold text-white/60">{q}</span>
             </button>
           ))}
        </div>
      )}

      {showTips && (
        <div className="glass-card p-6 border-blue-500/30 animate-in zoom-in-95 duration-300">
           <h4 className="font-black text-blue-400 mb-2 flex items-center gap-2"><span>💡</span> كيف تستفيد؟</h4>
           <p className="text-[11px] font-bold text-white/50 leading-relaxed">المساعد يدعم الأوامر الصوتية المباشرة. جرب سؤاله عن أي خدمة بالمنصة وسيقوم بتوجيهك فوراً.</p>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
