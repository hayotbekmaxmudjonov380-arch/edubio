import React from 'react';
import { Construction } from 'lucide-react';

// Institut tizimi uchun hozircha bo'sh bo'limlar (maktab tizimi bilan bir xil dizayn)
export const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="h-full w-full relative overflow-hidden bg-slate-900 flex items-center justify-center p-6">
      {/* Fon effektlari — Dashboard uslubida */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-10 max-w-md w-full text-center ring-1 ring-white/5">
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full"></div>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-teal-500/30 relative z-10">
            <Construction size={36} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
          {description}
        </p>

        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="text-teal-300 text-xs font-bold uppercase tracking-wider">
            Tez orada ochiladi
          </span>
        </div>
      </div>
    </div>
  );
};
