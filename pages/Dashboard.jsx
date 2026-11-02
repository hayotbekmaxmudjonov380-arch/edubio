import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystem, useSubject } from '../context/SystemContext';
import { Atom, Users, FlaskConical, Activity, BrainCircuit, ChevronRight, Award, Sparkles, BarChart3, Clock, Rocket, Globe, Compass, BookOpen } from 'lucide-react';
import MurmurationWordmark from '../components/ui/murmuration-wordmark';

export const Dashboard = () => {
  const system = useSystem();
  const subject = useSubject();
  const navigate = useNavigate();

  const isInstitute = system === 'institute';
  const isPhysics = isInstitute && subject?.id === 'fizika';
  const isAstronomy = isInstitute && subject?.id === 'astronomiya';

  const [astroPreset, setAstroPreset] = useState('night');
  const [textOffset, setTextOffset] = useState({ x: 0, y: 0, rx: 0, ry: 0 });

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTextOffset({
      x: (x / rect.width) * 24, // 24px parallax shift
      y: (y / rect.height) * 24,
      rx: -(y / rect.height) * 15, // 15 deg 3D tilt
      ry: (x / rect.width) * 15,
    });
  };

  const handleHeroMouseLeave = () => {
    setTextOffset({ x: 0, y: 0, rx: 0, ry: 0 });
  };

  // INSTITUT -> ASTRONOMIYA BOSH SAHIFASI
  if (isAstronomy) {
    return (
      <div className="relative w-full min-h-full bg-slate-950 p-6 md:p-10 text-white pb-36">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Murmuration Canvas Hero Section */}
          <div
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
            className="relative w-full rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl h-[460px] md:h-[520px]"
          >
            <MurmurationWordmark
              word="ASTRONOMIYA"
              wordYRatio={0.25}
              preset={astroPreset}
              birds={4500}
              height="100%"
              reeds={false}
              interactive={true}
            >
              <div className="pointer-events-none flex h-full flex-col justify-between p-6 sm:p-10 text-white bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent">
                <div className="pointer-events-auto flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold backdrop-blur-md">
                    <Rocket size={16} /> 3D Astronomiya · Interaktiv Koinot
                  </div>
                  <div className="flex gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                    {['night', 'dusk', 'dawn', 'paper'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setAstroPreset(p)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition-all ${
                          astroPreset === p ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive 3D Tilting & Floating Text Block */}
                <div
                  className="max-w-2xl pointer-events-auto transition-transform duration-150 ease-out"
                  style={{
                    transform: `perspective(1000px) translate3d(${textOffset.x}px, ${textOffset.y}px, 20px) rotateX(${textOffset.rx}deg) rotateY(${textOffset.ry}deg)`,
                  }}
                >
                  <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-2xl">
                    Koinot, Yulduzlar va <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Galaktikalar Olami</span>
                  </h1>
                  <p className="mt-3 text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow-lg max-w-xl">
                    Minglab yulduz zarrachalari to'planib "ASTRONOMIYA" so'zini hosil qiladi. Sichqonchani sursangiz qora tuynuk kabi zarrachalar harakatlanadi.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate('/lessons')}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                      <Rocket size={18} /> 3D Modellarga O'tish <ChevronRight size={18} />
                    </button>
                    <button
                      onClick={() => navigate('/library')}
                      className="px-6 py-3 bg-black/60 hover:bg-black/80 text-purple-300 border border-purple-500/40 rounded-xl font-bold transition-all flex items-center gap-2 backdrop-blur-md hover:scale-105 active:scale-95"
                    >
                      <BookOpen size={18} /> Kutubxona
                    </button>
                  </div>
                </div>
              </div>
            </MurmurationWordmark>
          </div>

          {/* Quick Hub Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 md:p-8 transition-all hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                  <Rocket size={30} />
                </div>
                <h2 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
                  3D Astronomiya Modellari
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Sut Yo'li galaktikasi, Quyosh Tizimi, Oy va Orrery mexanik modellarining Sketchfab hamda WebGL formatidagi 360° interaktiv 3D modellari.
                </p>
              </div>
              <button
                onClick={() => navigate('/lessons')}
                className="w-full py-3 bg-purple-600/20 hover:bg-purple-600 border border-purple-500/40 text-purple-300 hover:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                3D Modellarni Ochish <ChevronRight size={18} />
              </button>
            </div>

            <div className="group bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 md:p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                  <Globe size={30} />
                </div>
                <h2 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors">
                  Virtual Observatoriya & Planetariy
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Sayyoralarning orbitalari, yulduz toudalari, burjlar va koinot hodisalarini zamonaviy vizual simulyatsiya orqali o'rganing.
                </p>
              </div>
              <button
                onClick={() => navigate('/library')}
                className="w-full py-3 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                Planetariy Materiallari <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Interactive Feature Grid */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-300">
              <Compass size={22} /> Astronomiya Bo'limi Imkoniyatlari
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                <Rocket size={24} className="text-purple-400 mb-3" />
                <h3 className="font-bold text-sm text-white mb-1">3D Galaktikalar</h3>
                <p className="text-xs text-slate-400">
                  Sut Yo'li va boshqa galaktikalarning spiral tuzilishi hamda qora o'ralar.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                <Globe size={24} className="text-pink-400 mb-3" />
                <h3 className="font-bold text-sm text-white mb-1">Quyosh Tizimi</h3>
                <p className="text-xs text-slate-400">
                  8 ta sayyora, ularning yo'ldoshlari va Quyosh atrofida aylanish mexanizmi.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                <Compass size={24} className="text-indigo-400 mb-3" />
                <h3 className="font-bold text-sm text-white mb-1">Yulduzlar & Burjlar</h3>
                <p className="text-xs text-slate-400">
                  Tungi osmon xaritasi, yulduz toudalari va burjlarni tahlil qilish.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                <Sparkles size={24} className="text-amber-400 mb-3" />
                <h3 className="font-bold text-sm text-white mb-1">AI Astronom Yordamchi</h3>
                <p className="text-xs text-slate-400">
                  Koinot haqidagi barcha savollaringizga sun'iy intellekt orqali javob oling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Muallif imzosi */}
        <div className="absolute bottom-4 right-4 z-50 pointer-events-none select-none">
          <span className="text-[10px] md:text-xs font-black tracking-[0.2em] font-sans uppercase opacity-90 drop-shadow-md">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">MAXMUD</span>
            <span className="bg-gradient-to-r from-slate-100 via-slate-400 to-slate-100 bg-clip-text text-transparent mx-0.5">JONOV</span>
            <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 bg-clip-text text-transparent ml-1">HAYOTBEK</span>
          </span>
        </div>
      </div>
    );
  }

  // INSTITUT -> FIZIKA BOSH SAHIFASI
  if (isPhysics) {
    return (
      <div className="relative w-full min-h-full bg-slate-950 p-6 md:p-10 text-white pb-36">
        {/* Background glow effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-8">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950/60 border border-teal-500/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <Atom size={320} className="text-teal-400 animate-spin-slow" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold mb-4">
                <Sparkles size={14} /> FizLab AI — Virtual Laboratoriya & Diagnostika
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
                Fizika Fanidan <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">AI Virtual Laboratoriya</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                7-sinf Fizika kursi uchun mo'ljallangan interaktiv simulyatsiyalar, real vaqt rejimidagi sinf monitoringi va sun'iy intellektga asoslangan bilim diagnostikasi tizimi.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/fizlab-teacher')}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Users size={20} /> O'qituvchi Paneli
                </button>
                <button
                  onClick={() => navigate('/fizlab-lab')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 rounded-xl font-bold transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <FlaskConical size={20} /> O'quvchi Laboratoriyasi
                </button>
              </div>
            </div>
          </div>

          {/* Core Hub Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teacher Panel Card */}
            <div className="group bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 md:p-8 transition-all hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
                  <Users size={30} />
                </div>
                <h2 className="text-xl font-bold mb-2 text-white group-hover:text-teal-300 transition-colors">
                  O'qituvchi Paneli (Monitoring)
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Sinf kodi yaratib, 25–40 ta o'quvchining laboratoriya topshirish jarayonini real vaqtda yashil, sariq, qizil rangli indikatorlarda kuzating va ⚡ Tezkor diagnostika hisoboti oling.
                </p>
              </div>
              <button
                onClick={() => navigate('/fizlab-teacher')}
                className="w-full py-3 bg-teal-600/20 hover:bg-teal-600 border border-teal-500/40 text-teal-300 hover:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                Sinf Monitoringiga Kirish <ChevronRight size={18} />
              </button>
            </div>

            {/* Student Lab Card */}
            <div className="group bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 md:p-8 transition-all hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                  <FlaskConical size={30} />
                </div>
                <h2 className="text-xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">
                  Virtual Laboratoriya ("Arximed kuchi")
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  7 bosqichli interaktiv simulyatsiya: nazariy savollar, asboblar tanlovi, havoda va suyuqlikda o'lchash, slayderlar bilan parametrlarni o'zgartirish hamda AI xulosa.
                </p>
              </div>
              <button
                onClick={() => navigate('/fizlab-lab')}
                className="w-full py-3 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                Laboratoriyani Boshlash <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Module Architecture Overview (Word hujjatiga asosan) */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-teal-300">
              <Activity size={22} /> FizLab AI Asosiy Modullari (Texnik Topshiriq Boyicha)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                <FlaskConical size={24} className="text-teal-400 mb-3" />
                <h3 className="font-bold text-sm text-white mb-1">Virtual Laboratoriya</h3>
                <p className="text-xs text-slate-400">
                  7-sinf "Arximed kuchi" interaktiv simulyatsiyasi, asboblar va slayderlar.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                <Activity size={24} className="text-emerald-400 mb-3" />
                <h3 className="font-bold text-sm text-white mb-1">Real Vaqt Monitoringi</h3>
                <p className="text-xs text-slate-400">
                  Rangli indikatorlar (yashil, sariq, qizil) va real vaqt vaqt-vaqt holati.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                <BrainCircuit size={24} className="text-purple-400 mb-3" />
                <h3 className="font-bold text-sm text-white mb-1">AI Diagnostika Moduli</h3>
                <p className="text-xs text-slate-400">
                  Ko'nikma darajasi, xato turlari va o'zbek tilidagi avtomatik matnli xulosa.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                <BarChart3 size={24} className="text-amber-400 mb-3" />
                <h3 className="font-bold text-sm text-white mb-1">Sinf va Individual Hisobot</h3>
                <p className="text-xs text-slate-400">
                  Har bir o'quvchi va darslik sinf uchun statistik tahlil hamda diagnostika.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Muallif imzosi */}
        <div className="absolute bottom-4 right-4 z-50 pointer-events-none select-none">
          <span className="text-[10px] md:text-xs font-black tracking-[0.2em] font-sans uppercase opacity-90 drop-shadow-md">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">MAXMUD</span>
            <span className="bg-gradient-to-r from-slate-100 via-slate-400 to-slate-100 bg-clip-text text-transparent mx-0.5">JONOV</span>
            <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 bg-clip-text text-transparent ml-1">HAYOTBEK</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    // Scrollable container for the Dashboard content
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      {/* Background Image - Fixed position */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/images/asosiysahifa.png" 
            alt="Background" 
            className="w-full h-full object-cover object-[40%_28%] animate-fade-in opacity-100"
          />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="w-full md:w-2/3 lg:w-[42%] bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:p-7 text-left shadow-2xl animate-fade-in transition-all ring-1 ring-white/5 mb-6">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-3 drop-shadow-lg tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">EduBio</span>{' '}
            <span className="bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
              {isInstitute ? `${subject?.title || 'Institut'} — Institut v1.0` : 'Platformasi v1.0'}
            </span>
          </h1>
          <p className="text-gray-100 text-sm md:text-base font-medium leading-relaxed opacity-95 drop-shadow-md mb-4">
            {isInstitute ? (
              <>
                Salom! {subject?.title || 'Institut'} fani bo'limiga xush kelibsiz.<br/>
                Hozircha bu bo'lim tayyorlanmoqda — tez orada darslar va kutubxona bilan tanishasiz.
              </>
            ) : (
              <>
                Salom O'quvchilar! Platformaga xush kelibsiz.<br/>
                Biologiya fanini zamonaviy usulda, sun'iy intellekt yordamida o'rganing.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Muallif imzosi */}
      <div className="absolute bottom-4 right-4 z-50 pointer-events-none select-none">
        <span className="text-[10px] md:text-xs font-black tracking-[0.2em] font-sans uppercase opacity-90 drop-shadow-md">
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">MAXMUD</span>
          <span className="bg-gradient-to-r from-slate-100 via-slate-400 to-slate-100 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] mx-0.5">JONOV</span>
          <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] ml-1">HAYOTBEK</span>
        </span>
      </div>
    </div>
  );
};
