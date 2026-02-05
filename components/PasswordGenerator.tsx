
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + 
                    (includeNumbers ? "0123456789" : "") + 
                    (includeSymbols ? "!@#$%^&*()_+~`|}{[]:;?><,./-=" : "");
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
    setCopied(false);
  }, [length, includeSymbols, includeNumbers]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/10 rounded-xl text-white">
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        </button>
        <h2 className="text-2xl font-black text-white">مولد كلمات المرور</h2>
      </div>

      <div className="glass-card p-8 border-purple-500/20 shadow-2xl space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 animate-float shadow-inner">🔑</div>
          <p className="text-xs font-bold text-purple-300 opacity-60 uppercase tracking-widest">تشفير عسكري آمن 100%</p>
        </div>

        <div className="bg-black/40 p-6 rounded-3xl border border-white/5 relative group">
          <div className="text-center">
            <input 
              readOnly 
              value={password || '••••••••••••••••'} 
              className="w-full bg-transparent text-center text-2xl font-mono font-black text-white tracking-widest focus:outline-none"
            />
          </div>
          {password && (
            <button 
              onClick={copyToClipboard}
              className={`absolute top-1/2 -translate-y-1/2 left-4 p-2 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40 hover:text-white'}`}
            >
              {copied ? '✅' : '📋'}
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-sm font-black text-white/80">طول كلمة المرور</label>
              <span className="text-purple-400 font-black font-mono">{length}</span>
            </div>
            <input 
              type="range" min="8" max="32" value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setIncludeNumbers(!includeNumbers)}
              className={`p-4 rounded-2xl font-black text-xs transition-all border ${includeNumbers ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
            >
              🔢 أرقام (0-9)
            </button>
            <button 
              onClick={() => setIncludeSymbols(!includeSymbols)}
              className={`p-4 rounded-2xl font-black text-xs transition-all border ${includeSymbols ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
            >
              #️⃣ رموز (!@#)
            </button>
          </div>

          <button 
            onClick={generatePassword}
            className="w-full py-5 blue-gradient text-white rounded-[2rem] font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span>توليد كلمة مرور جديدة</span>
            <span className="text-xl">⚡</span>
          </button>
        </div>
      </div>

      <div className="mt-8 bg-blue-900/20 border border-blue-500/20 p-5 rounded-[2rem] flex items-start gap-4">
        <span className="text-2xl">💡</span>
        <div className="space-y-1">
          <h5 className="font-black text-blue-400 text-xs">نصيحة أمنية من المجال:</h5>
          <p className="text-[10px] font-bold text-white/50 leading-relaxed">لا تقم أبداً بمشاركة كلمات المرور عبر الرسائل غير المشفرة. استخدام كلمة مرور طولها أكثر من 12 حرفاً مع رموز وأرقام يجعل اختراقها شبه مستحيل بواسطة أجهزة الكمبيوتر التقليدية.</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
