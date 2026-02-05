
import React, { useState, useMemo, useEffect, useRef, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { SERVICES, WHATSAPP_NUMBER } from './constants';
import { Category, AppSettings } from './types';
import ServiceDetails from './components/ServiceDetails';
import PhoneScanner from './components/PhoneScanner';
import AIService from './components/AIService';
import Notifications from './components/Notifications';
import ToolsLayout from './components/ToolsLayout';
import Settings from './components/Settings';
import Marketplace from './components/Marketplace';
import SellAccount from './components/SellAccount';
import LiveChat from './components/LiveChat';
import ProImageGen from './components/ProImageGen';
import VirtualNumbersStore from './components/VirtualNumbersStore';
import VideoAIService from './components/VideoAIService';
import PasswordGenerator from './components/PasswordGenerator';
import URLScanner from './components/URLScanner';
import NetworkInfo from './components/NetworkInfo';
import SuperAssistant from './components/SuperAssistant';

// --- I18N SETUP ---
type Language = 'ar' | 'en';

const translations = {
  ar: {
    title: 'المجال الإلكترونية',
    subtitle: 'الخدمات الرقمية والأمنية الشاملة',
    searchPlaceholder: 'ابحث عن خدمة أو تطبيق...',
    categories: {
      all: 'الكل',
      main: 'رئيسية',
      security: 'الأمن والحماية',
      social: 'التوثيق والفك',
      ecommerce: 'متجر الأرقام والبطاقات',
      games: 'شحن الألعاب',
      tools: 'أدوات ذكية',
      ai: 'الذكاء اصطناعي',
      market: 'سوق الحسابات'
    },
    nav: {
      home: 'الرئيسية',
      super: 'الخارق',
      security: 'الأمان',
      settings: 'الإعدادات'
    },
    home: {
      topTools: 'الأدوات الأكثر استخداماً',
      superAssistant: 'المساعد الخارق',
      superAssistantSub: 'أقوى ذكاء اصطناعي',
      securityScan: 'فحص الأمان',
      securityScanSub: 'حماية هاتفك',
      passwords: 'كلمات المرور',
      passwordsSub: 'توليد تشفير قوي',
      talkToAi: 'تحدث مع المساعد',
      talkToAiSub: 'صوتي مباشر'
    },
    alerts: {
      securityTitle: 'تنبيه أمني مهم',
      securityMsg: 'تم رصد محاولات دخول مشبوهة عالمياً، ننصح بتفعيل المصادقة الثنائية لحساباتك.'
    }
  },
  en: {
    title: 'Al-Majal Electronic',
    subtitle: 'Comprehensive Digital & Security Services',
    searchPlaceholder: 'Search for a service or app...',
    categories: {
      all: 'All',
      main: 'Main',
      security: 'Security & Protection',
      social: 'Verification & Unlocking',
      ecommerce: 'Numbers & Cards Store',
      games: 'Game Topup',
      tools: 'Smart Tools',
      ai: 'Artificial Intelligence',
      market: 'Accounts Market'
    },
    nav: {
      home: 'Home',
      super: 'Super',
      security: 'Security',
      settings: 'Settings'
    },
    home: {
      topTools: 'Most Used Tools',
      superAssistant: 'Super Assistant',
      superAssistantSub: 'Powerful AI',
      securityScan: 'Security Scan',
      securityScanSub: 'Protect Your Phone',
      passwords: 'Passwords',
      passwordsSub: 'Generate Strong Encryption',
      talkToAi: 'Talk to AI',
      talkToAiSub: 'Live Voice'
    },
    alerts: {
      securityTitle: 'Important Security Alert',
      securityMsg: 'Suspicious login attempts detected globally. We recommend enabling 2FA for your accounts.'
    }
  }
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => any;
}>({
  lang: 'ar',
  setLang: () => {},
  t: () => ''
});

const useTrans = () => useContext(LanguageContext);

interface Toast {
  id: string;
  type: 'security' | 'order' | 'promo';
  title: string;
  message: string;
  icon: string;
}

const Header = ({ settings }: { settings: AppSettings }) => {
  const { lang, setLang, t } = useTrans();
  
  return (
    <header className="p-6 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-4xl mx-auto flex justify-between items-center glass-card p-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">🛡️</Link>
          <div className={lang === 'en' ? 'text-left' : 'text-right'}>
            <h1 className="text-lg font-black leading-tight text-white">{t('title')}</h1>
            <p className="text-[9px] font-bold opacity-60">{t('subtitle')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="bg-white/10 px-3 py-2 rounded-xl text-[10px] font-black text-white hover:bg-white/20 transition uppercase"
          >
            {lang === 'ar' ? 'English' : 'عربي'}
          </button>
          <Link to="/notifications" className="bg-white/10 p-2.5 rounded-xl hover:bg-white/20 transition relative">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) => {
  const { lang } = useTrans();
  return (
    <div className={`fixed top-24 left-4 right-4 z-[100] flex flex-col gap-3 max-w-md mx-auto pointer-events-none`}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto glass-card p-4 flex items-start gap-4 shadow-2xl animate-in slide-in-from-top-4 duration-500 border-l-4 ${
            toast.type === 'security' ? 'border-l-red-500 bg-red-500/10' :
            toast.type === 'order' ? 'border-l-blue-500 bg-blue-500/10' :
            'border-l-amber-500 bg-amber-500/10'
          } ${lang === 'en' ? 'text-left' : 'text-right'}`}
        >
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            {toast.icon}
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-black text-white mb-1">{toast.title}</h4>
            <p className="text-[10px] font-bold opacity-70 leading-relaxed text-white">{toast.message}</p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-28 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 flex items-center justify-center border-4 border-white/20 backdrop-blur-sm"
  >
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  </a>
);

const Home = ({ settings }: { settings: AppSettings }) => {
  const { lang, t } = useTrans();
  const [activeCategory, setActiveCategory] = useState<Category | 'الكل' | 'All'>('الكل');
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Auto-sync category selection if language switches
  useEffect(() => {
    if (lang === 'en' && activeCategory === 'الكل') setActiveCategory('All');
    if (lang === 'ar' && activeCategory === 'All') setActiveCategory('الكل');
  }, [lang]);

  const filteredServices = useMemo(() => {
    return SERVICES.filter(s => 
      (activeCategory === 'الكل' || activeCategory === 'All' || s.category === activeCategory) &&
      (s.title.includes(search) || s.description.includes(search))
    );
  }, [activeCategory, search]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return SERVICES.filter(s => 
      s.title.includes(search) || s.description.includes(search)
    ).slice(0, 5);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getServicePath = (serviceId: string) => {
    switch(serviceId) {
      case 'super-ai': return '/super-assistant';
      case 'password-gen': return '/tools/password-gen';
      case 'virtual-numbers-service': return '/virtual-numbers';
      case 'url-scanner': return '/tools/url-scanner';
      case 'network-info': return '/tools/network-info';
      case 'ai-video-gen': return '/ai-video';
      case 'phone-inspection': return '/phone-scan';
      default: return `/service/${serviceId}`;
    }
  };

  const getAnimationClass = (serviceId: string) => {
    if (serviceId === 'super-ai') return 'pulse-glow scale-110';
    switch(serviceId) {
      case 'verify-social': return 'animate-pulse';
      case 'phone-inspection': return 'scan-ring';
      case 'game-topup': return 'pulse-glow';
      default: return 'animate-float';
    }
  };

  const categories = [
    lang === 'ar' ? 'الكل' : 'All',
    ...Object.values(Category)
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-32">
      <div 
        ref={searchContainerRef}
        className="mb-6 relative staggered-entry z-[60]" 
        style={{ animationDelay: '0.1s' }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className={`w-full p-5 ${lang === 'en' ? 'pl-12 pr-5' : 'pr-12 pl-5'} glass-card border-none text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400 outline-none transition-all font-bold text-sm shadow-2xl`}
            value={search}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
          />
          <svg className={`w-6 h-6 absolute ${lang === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-white/40`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card z-[70] overflow-hidden p-2 animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xl border-white/30 backdrop-blur-2xl">
            {suggestions.map((s) => (
              <Link
                key={s.id}
                to={getServicePath(s.id)}
                onClick={() => setShowSuggestions(false)}
                className={`flex items-center gap-4 p-3 hover:bg-white/10 rounded-2xl transition-all group ${lang === 'en' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <div className="flex-grow">
                  <h4 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors">{s.title}</h4>
                  <p className="text-[9px] opacity-40 font-bold">{s.category}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar pb-2 staggered-entry" style={{ animationDelay: '0.2s' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-black text-[11px] transition-all border ${
              activeCategory === cat 
              ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20' 
              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 staggered-entry" style={{ animationDelay: '0.3s' }}>
        {filteredServices.map((service, index) => (
          <Link
            key={service.id}
            to={getServicePath(service.id)}
            className={`glass-card overflow-hidden group hover:scale-[1.03] hover:bg-white/15 active:scale-95 transition-all duration-300 flex flex-col items-center text-center p-4 relative h-[210px] w-full max-w-[180px] mx-auto shadow-xl ${service.id === 'super-ai' ? 'border-amber-400/50 bg-amber-400/5 shadow-amber-500/10' : ''}`}
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-4 transition-transform group-hover:rotate-6 ${getAnimationClass(service.id)}`}>
              {service.icon}
            </div>
            <h3 className="font-black text-sm mb-2 text-white leading-tight">{service.title}</h3>
            <p className="text-[10px] font-bold opacity-40 line-clamp-2 px-1">{service.id === 'super-ai' ? t('home.superAssistantSub') : 'Secured • Reliable'}</p>
            
            <div className="mt-auto pt-2">
              <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 opacity-80">{service.category}</span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 staggered-entry" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-sm font-black mb-4 flex items-center gap-2 opacity-60 uppercase tracking-widest">
          <span>✨</span> {t('home.topTools')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/super-assistant" className={`glass-card p-4 flex items-center gap-4 hover:bg-white/20 transition-all group border-amber-500/30 ${lang === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🧠</div>
            <div className={lang === 'en' ? 'text-left' : 'text-right'}>
              <span className="block font-black text-xs">{t('home.superAssistant')}</span>
              <span className="text-[9px] opacity-40">{t('home.superAssistantSub')}</span>
            </div>
          </Link>
          <Link to="/phone-scan" className={`glass-card p-4 flex items-center gap-4 hover:bg-white/20 transition-all group border-blue-500/30 ${lang === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🛡️</div>
            <div className={lang === 'en' ? 'text-left' : 'text-right'}>
              <span className="block font-black text-xs">{t('home.securityScan')}</span>
              <span className="text-[9px] opacity-40">{t('home.securityScanSub')}</span>
            </div>
          </Link>
          <Link to="/tools/password-gen" className={`glass-card p-4 flex items-center gap-4 hover:bg-white/20 transition-all group border-purple-500/30 ${lang === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🔑</div>
            <div className={lang === 'en' ? 'text-left' : 'text-right'}>
              <span className="block font-black text-xs">{t('home.passwords')}</span>
              <span className="text-[9px] opacity-40">{t('home.passwordsSub')}</span>
            </div>
          </Link>
          <Link to="/ai-live" className={`glass-card p-4 flex items-center gap-4 hover:bg-white/20 transition-all group border-emerald-500/30 ${lang === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🎙️</div>
            <div className={lang === 'en' ? 'text-left' : 'text-right'}>
              <span className="block font-black text-xs">{t('home.talkToAi')}</span>
              <span className="text-[9px] opacity-40">{t('home.talkToAiSub')}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('majal_lang') as Language) || 'ar');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('majal_settings');
    return saved ? JSON.parse(saved) : {
      themeColor: 'professional',
      displayMode: 'dark',
      cardSize: 'medium',
      textSize: 'medium',
      imageQuality: 'medium',
      dataSaving: false,
      marketSorting: 'price',
      showMarketImages: true,
      notificationsEnabled: true,
      orderNotifications: true,
      offerNotifications: true,
      marketNotifications: true
    };
  });

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      if (value) value = value[k];
    }
    return value || key;
  };

  const addToast = (type: 'security' | 'order' | 'promo', title: string, message: string, icon: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message, icon };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('majal_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('majal_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Simulate alert on app load
  useEffect(() => {
    if (settings.notificationsEnabled) {
      const timer = setTimeout(() => {
        addToast(
          'security',
          t('alerts.securityTitle'),
          t('alerts.securityMsg'),
          '🛡️'
        );
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Header settings={settings} />
          <ToastContainer toasts={toasts} removeToast={removeToast} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home settings={settings} />} />
              <Route path="/service/:id" element={<ServiceDetails />} />
              <Route path="/phone-scan" element={<PhoneScanner />} />
              <Route path="/ai" element={<AIService />} />
              <Route path="/super-assistant" element={<SuperAssistant />} />
              <Route path="/ai-video" element={<VideoAIService />} />
              <Route path="/ai-live" element={<LiveChat />} />
              <Route path="/pro-image" element={<ProImageGen />} />
              <Route path="/virtual-numbers" element={<VirtualNumbersStore />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/tools/password-gen" element={<PasswordGenerator />} />
              <Route path="/tools/url-scanner" element={<URLScanner />} />
              <Route path="/tools/network-info" element={<NetworkInfo />} />
              <Route path="/tools/:tool" element={<ToolsLayout />} />
              <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} />} />
              <Route path="/market" element={<Marketplace settings={settings} />} />
              <Route path="/market/sell" element={<SellAccount settings={settings} />} />
            </Routes>
          </main>
          <WhatsAppButton />
          
          <nav className="fixed bottom-0 left-0 right-0 p-4 z-40">
             <div className="max-w-md mx-auto glass-card flex justify-around p-3 shadow-2xl">
                <Link to="/" className="flex flex-col items-center text-blue-400 group">
                  <div className="bg-blue-500/10 p-2 rounded-xl group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></div>
                  <span className="text-[9px] mt-1 font-black">{t('nav.home')}</span>
                </Link>
                <Link to="/super-assistant" className="flex flex-col items-center text-white/40 group">
                  <div className="p-2 group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
                  <span className="text-[9px] mt-1 font-black">{t('nav.super')}</span>
                </Link>
                <Link to="/phone-scan" className="flex flex-col items-center text-white/40 group">
                  <div className="p-2 group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
                  <span className="text-[9px] mt-1 font-black">{t('nav.security')}</span>
                </Link>
                <Link to="/settings" className="flex flex-col items-center text-white/40 group">
                  <div className="p-2 group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg></div>
                  <span className="text-[9px] mt-1 font-black">{t('nav.settings')}</span>
                </Link>
             </div>
          </nav>
        </div>
      </HashRouter>
    </LanguageContext.Provider>
  );
};

export default App;
