
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVICES, WHATSAPP_NUMBER } from '../constants';
import { AppSettings } from '../types';

const ServiceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = SERVICES.find(s => s.id === id);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [settings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('majal_settings');
    return saved ? JSON.parse(saved) : {
      themeColor: 'professional',
      displayMode: 'light',
      cardSize: 'medium',
      textSize: 'medium'
    };
  });

  const isDark = settings.displayMode === 'dark';

  if (!service) {
    return <div className={`p-8 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>الخدمة غير موجودة</div>;
  }

  const handleShare = async () => {
    const shareData = {
      title: `المجال الإلكترونية - ${service.title}`,
      text: `${service.description}\nاطلب الخدمة الآن عبر منصة المجال الإلكترونية:`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleFileChange = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for the preview
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [fieldId]: previewUrl }));
      setFormData(prev => ({ ...prev, [fieldId]: file.name }));
    }
  };

  const removeFile = (fieldId: string) => {
    // Revoke the URL to save memory
    if (previews[fieldId]) {
      URL.revokeObjectURL(previews[fieldId]);
    }
    setPreviews(prev => {
      const newState = { ...prev };
      delete newState[fieldId];
      return newState;
    });
    setFormData(prev => {
      const newState = { ...prev };
      delete newState[fieldId];
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `MAJAL-${Math.floor(100000 + Math.random() * 900000)}`;
    let message = `طلب جديد من المجال الإلكترونية\n`;
    message += `رقم الطلب: ${orderId}\n`;
    message += `الخدمة: ${service.title}\n`;
    message += `-----------\n`;
    
    Object.entries(formData).forEach(([key, value]) => {
      const field = service.fields.find(f => f.id === key);
      message += `${field?.label}: ${value}\n`;
    });

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className={`max-w-3xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32`}>
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 font-bold hover:translate-x-1 transition-transform"
        >
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          رجوع للرئيسية
        </button>

        <button 
          onClick={handleShare}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            isDark ? 'bg-slate-800 text-blue-400 border border-slate-700' : 'bg-white text-blue-600 border border-gray-100 shadow-sm'
          }`}
        >
          {copySuccess ? (
            <>
              <span className="text-green-500">تم النسخ!</span>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </>
          ) : (
            <>
              <span>مشاركة الخدمة</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </>
          )}
        </button>
      </div>

      <div className={`rounded-[2.5rem] shadow-2xl overflow-hidden border transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className="h-64 relative">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-8">
            <div>
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black mb-3 inline-block shadow-lg">
                {service.icon} {service.category}
              </span>
              <h2 className="text-3xl font-black text-white">{service.title}</h2>
            </div>
          </div>
        </div>

        <div className="p-8">
          <p className={`mb-10 leading-relaxed text-lg opacity-80 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {service.description}
          </p>

          {service.steps && (
            <div className="mb-14">
              <h3 className={`text-xl font-black mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">🚀</span>
                دليل مراحل التنفيذ
              </h3>
              
              <div className="relative pr-6">
                <div className="absolute right-[23px] top-4 bottom-4 w-1 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200 rounded-full opacity-20" />
                
                <div className="space-y-10 relative">
                  {service.steps.map((step, index) => (
                    <div key={index} className="flex gap-6 items-start group">
                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-2xl blue-gradient text-white flex items-center justify-center text-2xl shadow-xl transform group-hover:scale-110 transition-all duration-300 border-4 ${isDark ? 'border-slate-800' : 'border-white'}`}>
                          {step.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black shadow-md border border-blue-100">
                          {index + 1}
                        </div>
                      </div>

                      <div className={`flex-grow p-5 rounded-2xl transition-all duration-300 border ${
                        isDark 
                          ? 'bg-slate-900/40 border-slate-700 group-hover:bg-slate-900/60' 
                          : 'bg-gray-50/50 border-gray-100 group-hover:bg-gray-50'
                      }`}>
                        <h4 className={`font-black text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{step.title}</h4>
                        <p className={`text-sm leading-relaxed opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {service.details && (
            <div className={`mb-10 p-7 rounded-[2rem] border transition-colors ${
              isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-blue-50/40 border-blue-100'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h4 className="font-black text-blue-600 flex items-center gap-2">
                    <span className="text-xl">💎</span> الفوائد والمميزات
                  </h4>
                  <ul className="space-y-3">
                    {service.details.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-bold opacity-80">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-blue-600 flex items-center gap-2">
                    <span className="text-xl">📝</span> متطلبات الطلب
                  </h4>
                  <ul className="space-y-3">
                    {service.details.requirements.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-bold opacity-80">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {service.details.notes && (
                <div className={`p-5 rounded-2xl border flex gap-4 items-start mb-6 ${
                  isDark ? 'bg-amber-900/20 border-amber-900/30 text-amber-200' : 'bg-amber-50 border-amber-100 text-amber-900'
                }`}>
                  <span className="text-2xl mt-1">⚠️</span>
                  <div className="space-y-1">
                    <h5 className="font-black text-sm uppercase tracking-wider">ملاحظات هامة للعميل:</h5>
                    <p className="text-xs leading-relaxed opacity-90 font-medium">{service.details.notes}</p>
                  </div>
                </div>
              )}

              <div className="pt-5 border-t border-blue-200/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-black shadow-lg">
                  <span>⏱️</span>
                  مدة التنفيذ: {service.details.duration}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={`space-y-6 p-8 rounded-[2rem] border transition-colors ${
            isDark ? 'bg-slate-900/30 border-slate-700' : 'bg-gray-50/30 border-gray-100'
          }`}>
            <div className="mb-6">
              <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>بدء طلب الخدمة</h3>
              <p className="text-xs opacity-60">يرجى إدخال البيانات بدقة لضمان سرعة التنفيذ</p>
            </div>

            {service.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-black opacity-80">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    className={`w-full p-4 rounded-2xl border transition outline-none focus:ring-2 focus:ring-blue-500 font-bold ${
                      isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-800'
                    }`}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData(p => ({...p, [field.id]: e.target.value}))}
                  >
                    <option value="">-- اختر من القائمة --</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    className={`w-full p-4 rounded-2xl border transition outline-none focus:ring-2 focus:ring-blue-500 font-bold ${
                      isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-800'
                    }`}
                    placeholder={field.placeholder}
                    rows={4}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData(p => ({...p, [field.id]: e.target.value}))}
                  />
                ) : field.type === 'file' ? (
                  <div className="space-y-4">
                    {!previews[field.id] ? (
                      <div className="relative group/file">
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full opacity-0 absolute inset-0 cursor-pointer z-10"
                          required={field.required}
                          onChange={(e) => handleFileChange(field.id, e)}
                        />
                        <div className={`w-full p-8 rounded-2xl border-2 border-dashed text-center transition group-hover/file:border-blue-400 ${
                          isDark ? 'bg-slate-800 border-slate-600 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
                        }`}>
                          <div className="text-4xl mb-3">🖼️</div>
                          <p className="font-black text-sm">انقر أو اسحب لرفع الصور المطلوبة</p>
                          <p className="text-[10px] mt-1 opacity-60">يدعم: PNG, JPG (الحد الأقصى 5MB)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative animate-in zoom-in-95 duration-300">
                        <div className={`rounded-2xl border overflow-hidden p-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5">
                            <img src={previews[field.id]} alt="Preview" className="w-full h-full object-contain" />
                            <button
                              type="button"
                              onClick={() => removeFile(field.id)}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-lg active:scale-90"
                              title="إزالة الصورة"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-2 px-2 py-1 flex justify-between items-center">
                            <p className="text-[10px] font-black opacity-50 truncate max-w-[200px]">{formData[field.id]}</p>
                            <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-black">جاهز للرفع</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    className={`w-full p-4 rounded-2xl border transition outline-none focus:ring-2 focus:ring-blue-500 font-bold ${
                      isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-800'
                    }`}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData(p => ({...p, [field.id]: e.target.value}))}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full blue-gradient text-white py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-8"
            >
              <span>إرسال الطلب الموحد عبر واتساب</span>
              <div className="bg-white/20 p-1.5 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
