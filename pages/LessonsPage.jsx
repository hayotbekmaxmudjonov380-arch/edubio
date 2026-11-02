import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, BookOpen, Video, Box, PenTool, Play, ExternalLink, Atom, Users, FlaskConical, ChevronRight, Sparkles, CheckCircle2, Clock, Rocket } from 'lucide-react';
import EtchedAccretion from '../components/ui/etched-accretion';
import { BotanikaIntro } from '../components/lessons/botanika/BotanikaIntro';
import { PlaceholderPage } from '../components/PlaceholderPage';
import { useSystem, useSubject } from '../context/SystemContext';
import { FloweringPlants } from '../components/lessons/botanika/FloweringPlants';
import { PlantLifeForms } from '../components/lessons/botanika/PlantLifeForms';
import { PlantCellStructure } from '../components/lessons/botanika/PlantCellStructure';
import { CellActivity } from '../components/lessons/botanika/CellActivity';
import { PlantTissues } from '../components/lessons/botanika/PlantTissues';
import { RootTypes } from '../components/lessons/botanika/RootTypes';
import { RootInternalStructure } from '../components/lessons/botanika/RootInternalStructure';

// Asosiy Bo'limlar (Kategoriyalar)
const categories = [
  { 
    title: "BOTANIKA", 
    id: "botanika", 
    color: "#10b981",
    gradient: "bg-gradient-to-br from-green-600 to-emerald-900",
    image: "/images/batanikabo'limi.png",
    imageClass: "object-cover object-center"
  },
  { 
    title: "ZOOLOGIYA", 
    id: "zoologiya", 
    color: "#3b82f6",
    gradient: "bg-gradient-to-br from-blue-600 to-indigo-900",
    image: "/images/zoologiyabo'limi.png",
    imageClass: "object-cover object-center"
  },
  { 
    title: "ODAM ANATOMIYASI", 
    id: "anatomiya", 
    color: "#ef4444",
    gradient: "bg-gradient-to-br from-red-600 to-rose-900",
    image: "/images/anatomiyabolimi.png"
  },
  { 
    title: "BIOLOGIYA VA SITOLOGIYA", 
    id: "sitologiya", 
    color: "#8b5cf6",
    gradient: "bg-gradient-to-br from-purple-600 to-violet-900",
    image: "/images/biologiyavasitologiya.png"
  },
  { 
    title: "UMUMIY BIOLOGIYA", 
    id: "umumiy", 
    color: "#f59e0b",
    gradient: "bg-gradient-to-br from-amber-500 to-orange-900",
    image: "/images/umumiybiologiya.png"
  },
  { 
    title: "BIOLOGIYA VA EKOLOGIYA", 
    id: "ekologiya", 
    color: "#14b8a6",
    gradient: "bg-gradient-to-br from-teal-600 to-cyan-900",
    image: "/images/biologiyavaekologiya.png"
  },
];

// O'quv resurs turlari (Sub-menu)
const resourceTypes = [
  { id: 'lessons', title: "DARS MAVZULARI", icon: <BookOpen size={24} />, color: "bg-blue-500" },
  { id: 'videos', title: "VIDEO DARSLAR", icon: <Video size={24} />, color: "bg-red-500" },
  { id: '3d', title: "3D ANIMATSIYALAR", icon: <Box size={24} />, color: "bg-purple-500" },
  { id: 'quiz', title: "QUIZ TESTLAR", icon: <PenTool size={24} />, color: "bg-orange-500" },
];

// Darslar ma'lumotlari (Matnli)
const lessonsData = {
  botanika: [
    { id: 1, title: "1-§. Botanika – o‘simliklar haqidagi fan", duration: "O'qish", type: "reading", component: <BotanikaIntro /> },
    { id: 2, title: "2-§. Gulli o‘simliklar bilan umumiy tanishish", duration: "O'qish", type: "reading", component: <FloweringPlants /> },
    { id: 3, title: "3-§. O‘simliklarning hayotiy shakllari", duration: "O'qish", type: "reading", component: <PlantLifeForms /> },
    { id: 4, title: "4-§. O‘simlik hujayrasining tuzilishi", duration: "O'qish", type: "reading", component: <PlantCellStructure /> },
    { id: 5, title: "5-§. Hujayralarning hayotiy faoliyati", duration: "O'qish", type: "reading", component: <CellActivity /> },
    { id: 6, title: "6-§. O‘simlik to‘qimalari", duration: "O'qish", type: "reading", component: <PlantTissues /> },
    { id: 7, title: "7-§. Ildiz turlari va tizimlari", duration: "O'qish", type: "reading", component: <RootTypes /> },
    { id: 8, title: "8-§. Ildizning ichki tuzilishi", duration: "O'qish", type: "reading", component: <RootInternalStructure /> },
  ],
  zoologiya: [],
  anatomiya: [],
};

const videosData = {
  botanika: [
    { id: 1, title: "1-§. Botanika – o‘simliklar haqidagi fan", url: "https://www.youtube.com/embed/KVLR1aSp4cY" },
    { id: 2, title: "2-§. Gulli o‘simliklar bilan umumiy tanishish", url: "https://www.youtube.com/embed/qY3qfaJoVLA" },
  ],
  zoologiya: [],
  anatomiya: [],
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const LessonsPage = () => {
  const system = useSystem();
  const subject = useSubject();

  if (system === 'institute') {
    if (subject?.id === 'fizika') {
      return <PhysicsLessonsPage />;
    }
    if (subject?.id === 'astronomiya') {
      return <AstronomyLessonsPage />;
    }
    return (
      <PlaceholderPage
        title={`${subject?.title || 'Fan'} darslari`}
        description={`Institut tizimi uchun ${subject?.title?.toLowerCase() || 'fan'} darslari hozir tayyorlanmoqda. Tez orada shu yerda joylashadi.`}
      />
    );
  }

  return <SchoolLessonsPage />;
};

// INSTITUT -> 3D ASTRONOMIYA (Sketchfab 3D Modellar & Etched Accretion Black Hole WebGL)
const AstronomyLessonsPage = () => {
  const [preset, setPreset] = useState('crimson');

  const astronomy3DModels = [
    {
      id: 'milky-way',
      title: "Milky Way (Sut Yo'li Galaktikasi)",
      author: 'AVRcontent',
      authorUrl: 'https://sketchfab.com/AVRcontent',
      modelUrl: 'https://sketchfab.com/3d-models/milky-way-eb0087b800414744b4cee3440888088c',
      embedUrl: 'https://sketchfab.com/models/eb0087b800414744b4cee3440888088c/embed',
      description: "Bizning galaktikamiz — Sut Yo'lining (Milky Way) interaktiv 3D modeli. Sichqoncha yoki barmoq orqali 360° aylantirib va yaqinlashtirib ko'rishingiz mumkin.",
      badge: "Galaktikalar",
    },
    {
      id: 'solar-system',
      title: "Solar System (Quyosh Tizimi)",
      author: 'shooogp',
      authorUrl: 'https://sketchfab.com/shooogp',
      modelUrl: 'https://sketchfab.com/3d-models/solar-system-fad1f8a62d3848d0be664339e6f3b1a2',
      embedUrl: 'https://sketchfab.com/models/fad1f8a62d3848d0be664339e6f3b1a2/embed',
      description: "Quyosh va uning atrofida aylanuvchi barcha sayyoralarning interaktiv 3D harakat modeli.",
      badge: "Quyosh Tizimi",
    },
    {
      id: 'moon',
      title: "Moon (Oy — Yerning Yo'ldoshi)",
      author: 'Mieke Roth',
      authorUrl: 'https://sketchfab.com/miekeroth',
      modelUrl: 'https://sketchfab.com/3d-models/moon-870de693475d436c8e925ab0bcda4ca4',
      embedUrl: 'https://sketchfab.com/models/870de693475d436c8e925ab0bcda4ca4/embed',
      description: "Yerning yagona tabiiy yo'ldoshi bo'lmish Oyning (Moon) sirt tuzilishi va kraterlari aks etgan batafsil 3D modeli.",
      badge: "Tabiiy Yo'ldoshlar",
    },
    {
      id: 'solar-system-orrery',
      title: "Solar System Model (Orrery Mexanik Modeli)",
      author: 'Smoggybeard',
      authorUrl: 'https://sketchfab.com/Smoggybeard',
      modelUrl: 'https://sketchfab.com/3d-models/solar-system-model-orrery-ca0a6f6971a94fcc8d47421342dc6f40',
      embedUrl: 'https://sketchfab.com/models/ca0a6f6971a94fcc8d47421342dc6f40/embed',
      description: "Quyosh va uning atrofida aylanuvchi sayyoralar mexanizmini namoyish etuvchi klassik mexanik telluriy (Orrery) 3D modeli.",
      badge: "Mexanik Modellar",
    },
  ];

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-white p-6 md:p-10 pb-36 overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Interactive 3D WebGL Shader Hero Banner (Etched Accretion) */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl h-[380px] md:h-[450px]">
          <EtchedAccretion preset={preset} interactive={true}>
            <div className="pointer-events-none flex h-full flex-col justify-between p-6 sm:p-10 text-white bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
              <div className="pointer-events-auto flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold backdrop-blur-md">
                  <Rocket size={16} /> 3D WebGL Simulyatsiya & Modellar
                </div>
                <div className="flex gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                  {['crimson', 'ember', 'glacier', 'ash', 'orchid'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPreset(p)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition-all ${
                        preset === p ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-w-xl">
                <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                  Qora O'ralar va Akkretsiya Diski <span className="text-purple-400 italic">Simulyatsiyasi</span>
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 font-mono tracking-wide opacity-90">
                  Kursor harakati orqali burilish · Bosib tursangiz gravitatsion yemlanish yuz beradi
                </p>
              </div>
            </div>
          </EtchedAccretion>
        </div>

        {/* 3D Models Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Rocket className="text-purple-400" size={24} /> Interaktiv 3D Astronomiya Modellari Ro'yxati
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {astronomy3DModels.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-5 shadow-2xl transition-all flex flex-col justify-between backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-full">
                      {item.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">3D Model</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{item.description}</p>

                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner">
                    <iframe
                      title={item.title}
                      className="w-full h-full border-0"
                      frameBorder="0"
                      allowFullScreen
                      mozallowfullscreen="true"
                      webkitallowfullscreen="true"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      xr-spatial-tracking="true"
                      execution-while-out-of-viewport="true"
                      execution-while-not-rendered="true"
                      web-share="true"
                      src={item.embedUrl}
                    ></iframe>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Muallif:{' '}
                    <a
                      href={item.authorUrl}
                      target="_blank"
                      rel="nofollow noreferrer"
                      className="text-teal-400 hover:underline font-semibold"
                    >
                      {item.author}
                    </a>
                  </span>
                  <a
                    href={item.modelUrl}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
                  >
                    Sketchfab'da ko'rish <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// INSTITUT -> FIZIKA DARSLARI VA VIRTUAL LABORATORIYALAR (Word Hujjatiga Asosan)
const PhysicsLessonsPage = () => {
  const navigate = useNavigate();

  const physicsTopics = [
    { id: 1, title: "1-§. Fizika – tabiat haqidagi fan va o'rganish usullari", status: "Tayyor" },
    { id: 2, title: "2-§. Fizik kattaliklar va ularni o'lchash asboblari", status: "Tayyor" },
    { id: 3, title: "3-§. Jism massasi va modda zichligi", status: "Tayyor" },
    { id: 4, title: "4-§. Kuch. Og'irlik kuchi va elastiklik kuchi", status: "Tayyor" },
    { id: 5, title: "5-§. Arximed kuchi va jismning suzish shartlari", status: "FizLab AI Laboratoriya", active: true },
    { id: 6, title: "6-§. Mexanik ish, quvvat va energiya", status: "Tayyor" },
  ];

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-white p-6 md:p-12 pb-24 overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold mb-3">
            <Atom size={16} /> Fizika Fanidan Darslar & Laboratoriyalar
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            7-Sinf Fizika: <span className="text-teal-400">FizLab AI Virtual Laboratoriyalar</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Interaktiv simulyatsiyalar, 7-sinf fizika laboratoriya ishlari va sun'iy intellektga asoslangan diagnostika moduli.
          </p>
        </div>

        {/* Featured Main Lab (Word document - Arximed Kuchi) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950/80 border border-teal-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-teal-500 text-slate-950 font-bold text-xs rounded-full">
                  1-LABORATORIYA ISHI
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium rounded-full">
                  FizLab AI Ishga Tushirilgan
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                «Arximed kuchini o'lchash va jismning suzish shartlari»
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                7-sinf fizika darsligining 5-laboratoriya mashg'uloti. O'quvchi 7 ta bosqichda tajriba o'tkazadi (nazariya, asbob tanlash, havoda/suyuqlikda o'lchash, slayderlar, hisoblash va xulosa). O'qituvchi esa real vaqtda sinf holatini va AI diagnostikasini kuzatadi.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/fizlab-lab')}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2"
                >
                  <FlaskConical size={18} /> O'quvchi Laboratoriyasiga Kirish
                </button>
                <button
                  onClick={() => navigate('/fizlab-teacher')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Users size={18} /> O'qituvchi Paneli
                </button>
              </div>
            </div>

            <div className="w-full md:w-72 bg-slate-900/80 border border-slate-700/60 p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Laboratoriya Imkoniyatlari</h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" /> 7 ta bosqichli tajriba jarayoni
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" /> Dinamometr, stakan va suyuqliklar
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" /> Hajm va Zichlik slayderlari
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" /> Avtomatik loglar & AI Diagnostika
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Labs Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FlaskConical className="text-teal-400" size={22} /> Keyingi Laboratoriyalar Ro'yxati
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">2-Laboratoriya</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={12} /> Rejalashtirilgan</span>
              </div>
              <h3 className="font-bold text-sm text-white mb-2">To'g'ri chiziqli harakat tezligini aniqlash</h3>
              <p className="text-xs text-slate-400">Yo'l, vaqt va tezlik o'rtasidagi bog'liqlikni interaktiv o'lchash.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md">3-Laboratoriya</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={12} /> Rejalashtirilgan</span>
              </div>
              <h3 className="font-bold text-sm text-white mb-2">Suyuqlik va gazlar bosimini o'lchash</h3>
              <p className="text-xs text-slate-400">Manometr va Paskal qonunini virtual idishlarda o'rganish.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">4-Laboratoriya</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={12} /> Rejalashtirilgan</span>
              </div>
              <h3 className="font-bold text-sm text-white mb-2">Ishqalanish kuchi va koeffitsiyenti</h3>
              <p className="text-xs text-slate-400">Yuzalar turi va dinamometr yordamida ishqalanishni o'lchash.</p>
            </div>
          </div>
        </div>

        {/* 7-Sinf Fizika Darslik Mavzulari */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="text-teal-400" size={22} /> 7-Sinf Fizika Dars Mavzulari
          </h2>
          <div className="space-y-3">
            {physicsTopics.map((topic) => (
              <div
                key={topic.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  topic.active
                    ? 'bg-teal-500/10 border-teal-500/50 text-teal-300'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className={topic.active ? 'text-teal-400' : 'text-slate-500'} />
                  <span className="text-sm font-medium">{topic.title}</span>
                </div>
                {topic.active ? (
                  <button
                    onClick={() => navigate('/fizlab-lab')}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    Laboratoriyaga o'tish <ChevronRight size={14} />
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">{topic.status}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// MAKTAB TIZIMI — avvalgi barcha kontent saqlangan
const SchoolLessonsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedResourceType(null);
    setSelectedLesson(null);
  };

  const handleResourceTypeClick = (typeId) => {
    setSelectedResourceType(typeId);
    setSelectedLesson(null);
  };

  const handleBackClick = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
    } else if (selectedResourceType) {
      setSelectedResourceType(null);
    } else {
      setSelectedCategory(null);
    }
  };

  const handleLessonClick = (lesson) => {
    if (lesson.component) {
      setSelectedLesson(lesson);
    } else {
      alert("Bu dars uchun ma'lumot hali tayyorlanmoqda.");
    }
  };

  const handleVideoClick = (video) => {
    const videoId = getYouTubeId(video.url);
    if (videoId) {
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(watchUrl, '_blank');
    } else {
      alert("Video havolasi noto'g'ri");
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const currentLessons = selectedCategory ? (lessonsData[selectedCategory] || []) : [];
  const currentVideos = selectedCategory ? (videosData[selectedCategory] || []) : [];

  return (
    <div className="w-full h-full min-h-screen bg-slate-900 overflow-y-auto no-scrollbar pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src="/images/darslarbo'limiuchun.png"
            alt="Lessons background"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto w-full pt-10">
        {!selectedCategory && (
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">
              Biologiya Fanidan Bo'limlar
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/10"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className={`w-full h-full ${category.imageClass || 'object-cover'} group-hover:scale-110 transition-transform duration-500`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {category.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCategory && !selectedResourceType && (
          <div>
            <button
              onClick={handleBackClick}
              className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={18} /> Orqaga
            </button>

            <h1 className="text-2xl font-bold text-white mb-6">
              {currentCategory?.title} — Resurslar
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resourceTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => handleResourceTypeClick(type.id)}
                  className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl cursor-pointer hover:border-teal-500/50 hover:bg-slate-800 transition-all flex items-center gap-4 group"
                >
                  <div className={`p-3 rounded-xl text-white ${type.color} group-hover:scale-110 transition-transform`}>
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-teal-400 transition-colors">
                      {type.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Ko'rish va o'rganish</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedResourceType && !selectedLesson && (
          <div>
            <button
              onClick={handleBackClick}
              className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={18} /> Orqaga
            </button>

            <h1 className="text-2xl font-bold text-white mb-6">
              {currentCategory?.title} — {resourceTypes.find(r => r.id === selectedResourceType)?.title}
            </h1>

            {selectedResourceType === 'lessons' && (
              <div className="space-y-3">
                {currentLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:border-teal-500/50 hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <span className="text-white font-medium text-sm">{lesson.title}</span>
                    <span className="text-xs text-teal-400 font-semibold">{lesson.duration}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedResourceType === 'videos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoClick(video)}
                    className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:border-red-500/50 cursor-pointer transition-all flex items-center gap-3"
                  >
                    <PlayCircle size={24} className="text-red-500 flex-shrink-0" />
                    <span className="text-white font-medium text-sm">{video.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedLesson && (
          <div>
            <button
              onClick={handleBackClick}
              className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={18} /> Orqaga
            </button>
            <div className="bg-slate-800/90 border border-slate-700 p-6 md:p-8 rounded-2xl">
              {selectedLesson.component}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
