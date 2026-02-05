
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ToolsLayout: React.FC = () => {
  const { tool } = useParams();
  const navigate = useNavigate();

  const renderTool = () => {
    switch(tool) {
      case 'keyboard':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4">تخصيص لوحة المفاتيح</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="p-4 rounded-2xl bg-blue-600 text-white font-bold text-sm">ثيم كلاسيك</button>
                <button className="p-4 rounded-2xl bg-gray-800 text-white font-bold text-sm">ثيم ليلي</button>
                <button className="p-4 rounded-2xl bg-blue-100 text-blue-800 font-bold text-sm">ثيم المجال</button>
                <button className="p-4 rounded-2xl bg-purple-100 text-purple-800 font-bold text-sm">ثيم رويال</button>
              </div>
              <label className="block text-sm font-bold mb-2">حجم الأزرار</label>
              <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
            <div className="bg-green-50 p-4 rounded-2xl text-green-700 text-xs font-bold flex items-center gap-2">
              <span>✅</span> خصوصية كاملة: لا يتم تسجيل أي بيانات مكتوبة.
            </div>
          </div>
        );
      case 'vpn':
        return (
          <div className="space-y-4">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🌐</div>
              <h3 className="font-bold text-xl mb-1">اتصال VPN آمن</h3>
              <p className="text-gray-500 text-xs mb-6">أنت غير متصل حالياً</p>
              <button className="w-full blue-gradient py-4 rounded-2xl text-white font-bold shadow-lg">اتصال سريع</button>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-sm mb-3">الدول المتاحة</h4>
              {['ألمانيا', 'أمريكا', 'سنغافورة', 'تركيا'].map(c => (
                <div key={c} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-medium">{c}</span>
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">مستقر</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'recorder':
        return (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">مسجل المكالمات</h3>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl text-center border-2 border-dashed border-red-100">
                <p className="text-red-800 text-xs font-bold">يتطلب التطبيق صلاحية الوصول للميكروفون</p>
                <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-bold">منح الصلاحية</button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-sm mb-3">التسجيلات المحفوظة</h4>
              <p className="text-center py-8 text-gray-400 text-xs">لا توجد تسجيلات حتى الآن</p>
            </div>
          </div>
        );
      default:
        return <div>أداة غير معروفة</div>;
    }
  }

  const titles = { keyboard: 'لوحة المفاتيح', vpn: 'خدمة VPN', recorder: 'مسجل المكالمات' };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm">
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{(titles as any)[tool || '']}</h2>
      </div>
      {renderTool()}
    </div>
  );
};

export default ToolsLayout;
