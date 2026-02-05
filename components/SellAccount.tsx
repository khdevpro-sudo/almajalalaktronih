
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSettings } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

const SellAccount: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({ game: 'PUBG', level: '', skins: '', server: '', binding: 'فيسبوك', price: '' });
  const [images, setImages] = useState<string[]>([]);

  const isDark = settings.displayMode === 'dark';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages([...images, e.target.files[0].name]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `طلب عرض حساب للبيع\nلعبة: ${form.game}\nالمستوى: ${form.level}\nالسكنات: ${form.skins}\nالسعر: ${form.price}\nالربط: ${form.binding}\nالصور: ${images.length} صور مرفوعة`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <h2 className="text-2xl font-black">إضافة حساب للبيع</h2>
      </div>

      <form onSubmit={handleSubmit} className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-70">اسم اللعبة</label>
              <select 
                className={`w-full p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50'}`}
                onChange={e => setForm({...form, game: e.target.value})}
              >
                <option>PUBG</option>
                <option>Free Fire</option>
                <option>COD</option>
                <option>Fortnite</option>
                <option>FIFA</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-70">المستوى (Level)</label>
              <input type="number" required className={`w-full p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50'}`} onChange={e => setForm({...form, level: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-70">عدد السكنات</label>
              <input type="number" required className={`w-full p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50'}`} onChange={e => setForm({...form, skins: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold opacity-70">السعر المطلوب (ريال)</label>
              <input type="number" required className={`w-full p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50'}`} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold opacity-70">نوع ربط الحساب</label>
            <select className={`w-full p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50'}`} onChange={e => setForm({...form, binding: e.target.value})}>
              <option>فيسبوك</option>
              <option>تويتر / X</option>
              <option>جيميل</option>
              <option>أخرى</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold opacity-70">إثبات الحساب (صور البروفايل، السكنات، المستوى)</label>
            <div className="relative group">
              <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFile} />
              <div className={`p-8 border-2 border-dashed rounded-3xl text-center transition ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
                <span className="text-4xl block mb-2">📸</span>
                <p className="font-bold text-sm">انقر لاختيار الصور</p>
                <p className="text-[10px] opacity-40 mt-1">يجب رفع 3 صور على الأقل للمراجعة</p>
              </div>
            </div>
            {images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <div key={i} className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] whitespace-nowrap">✔ {img}</div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="w-full blue-gradient text-white py-5 rounded-3xl font-black shadow-xl">إرسال الحساب للمراجعة</button>
          <p className="text-center text-[10px] opacity-50">بإرسالك الحساب توافق على شروط الوساطة الخاصة بالمنصة</p>
        </div>
      </form>
    </div>
  );
};

export default SellAccount;
