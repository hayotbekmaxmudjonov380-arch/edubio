import React from 'react';
import {
  Atom,
  Rocket,
  Calculator,
  FlaskConical,
  Dna,
  Code,
  Languages,
  Stethoscope,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

// Institut tizimidagi fanlar ro'yxati
export const INSTITUTE_SUBJECTS = [
  { id: 'fizika', title: 'Fizika', icon: Atom, gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/30' },
  { id: 'astronomiya', title: 'Astronomiya', icon: Rocket, gradient: 'from-purple-500 to-violet-700', glow: 'shadow-purple-500/30' },
  { id: 'matematika', title: 'Matematika', icon: Calculator, gradient: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/30' },
  { id: 'kimyo', title: 'Kimyo', icon: FlaskConical, gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/30' },
  { id: 'biologiya', title: 'Biologiya', icon: Dna, gradient: 'from-green-500 to-emerald-700', glow: 'shadow-green-500/30' },
  { id: 'informatika', title: 'Informatika', icon: Code, gradient: 'from-cyan-500 to-sky-700', glow: 'shadow-cyan-500/30' },
  { id: 'ingliz_tili', title: 'Ingliz tili', icon: Languages, gradient: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/30' },
  { id: 'tibbiyot', title: 'Tibbiyot', icon: Stethoscope, gradient: 'from-red-500 to-rose-700', glow: 'shadow-red-500/30' },
];

export const SubjectPicker = ({ onSelect, onBack }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/kirishqism.png')" }}
    >
      <div className="absolute inset-0 bg-slate-950/70 z-0"></div>
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl max-w-2xl w-full relative z-10 backdrop-blur-xl shadow-2xl">

        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5 shadow-2xl relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl relative z-10">
              <Atom size={36} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight relative z-10">
            Fanlarni tanlang
          </h1>
          <p className="text-gray-400 relative z-10 text-sm md:text-base">
            Institut tizimida o'rganmoqchi bo'lgan fanni tanlang
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 relative z-10">
          {INSTITUTE_SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSelect(subject)}
              className="group bg-white/5 text-white font-semibold p-4 rounded-2xl flex items-center gap-3.5 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/10 hover:border-white/25 hover:shadow-lg text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center shadow-lg ${subject.glow} flex-none group-hover:scale-110 transition-transform`}>
                <subject.icon size={24} className="text-white" />
              </div>
              <span className="text-base tracking-wide">{subject.title}</span>
              <ChevronRight size={20} className="ml-auto text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-none" />
            </button>
          ))}
        </div>

        <button
          onClick={onBack}
          className="mt-6 mx-auto flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors relative z-10"
        >
          <ArrowLeft size={16} />
          Boshqa tizimni tanlash
        </button>
      </div>
    </div>
  );
};
