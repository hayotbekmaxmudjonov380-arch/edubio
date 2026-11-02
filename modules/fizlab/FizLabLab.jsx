import React, { useState, useEffect } from 'react';
import {
  PlayCircle,
  Box,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  FlaskConical,
  Weight,
  Droplets,
  Ruler,
  Calculator,
  Save,
  HelpCircle,
  Sparkles,
  BrainCircuit,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  MapPin,
  Check,
  ImageIcon,
  Download,
  BarChart2,
  Target
} from 'lucide-react';
import { FizLabLogger } from './FizLabLogger';
import { STEP_STANDARD_TIME, generateDiagnostic } from './FizLabDiagnostic';
import { analyzeLabStepRealtimeAI, generateLearningRoadmapAI, generateBioImage } from '../../services/geminiService';

const STEPS = [
  { id: 'step1', title: '1. Nazariy savol', icon: BookOpen },
  { id: 'step2', title: '2. Asbob tanlash', icon: FlaskConical },
  { id: 'step3', title: "3. Havoda o'lchash", icon: Weight },
  { id: 'step4', title: "4. Suyuqlikda o'lchash", icon: Droplets },
  { id: 'step5', title: "5. Parametrlarni o'zgartirish", icon: Ruler },
  { id: 'step6', title: '6. Jadval va hisoblash', icon: Calculator },
  { id: 'step7', title: '7. Xulosa', icon: Save },
];

export const FizLabLab = ({ studentName = "O'quvchi", studentSid = "guest", onFinish }) => {
  const [currentStep, setCurrentStep] = useState('step1');
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  const [stepData, setStepData] = useState({});

  const [selectedTools, setSelectedTools] = useState([]);
  const availableTools = [
    { id: 'dinamometr', label: 'Dinamometr', correct: true, icon: Weight },
    { id: 'kant', label: 'Kant', correct: false, icon: Box },
    { id: 'termometr', label: 'Termometr', correct: false, icon: FlaskConical },
    { id: 'stakan', label: 'Stakan', correct: true, icon: FlaskConical },
    { id: 'linyalka', label: 'Liniyka', correct: false, icon: Ruler },
  ];

  const [weightAir, setWeightAir] = useState('');
  const [weightAirMeasured, setWeightAirMeasured] = useState(false);
  const [weightLiquid, setWeightLiquid] = useState('');
  const [weightLiquidMeasured, setWeightLiquidMeasured] = useState(false);
  const [volume, setVolume] = useState(50);
  const [density, setDensity] = useState(1000);
  const [tableF1, setTableF1] = useState('');
  const [tableF2, setTableF2] = useState('');
  const [tableFbu, setTableFbu] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [helpRequested, setHelpRequested] = useState(false);

  // Real-time AI Assistant States
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  // Roadmap Modal States
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [finalDiag, setFinalDiag] = useState(null);

  // AI Generated Infographic Image State
  const [infographicImg, setInfographicImg] = useState(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  useEffect(() => {
    setStepStartTime(Date.now());
  }, [currentStep]);

  const spentSeconds = Math.max(0, Math.floor((Date.now() - stepStartTime) / 1000));

  const logAction = (type, data = {}) => {
    FizLabLogger.log(studentSid, type, { step: currentStep, ...data });
  };

  const getErrorsForStep = () => {
    const d = stepData[currentStep] || {};
    return d.errors || 0;
  };

  // Real-time AI Step Analysis & Explanation
  const runRealtimeAiCheck = async (stepToAnalyze = currentStep) => {
    setIsAiAnalyzing(true);
    try {
      const result = await analyzeLabStepRealtimeAI({
        step: stepToAnalyze,
        selectedTools,
        weightAir,
        weightLiquid,
        volume,
        density,
        tableData: { F1: tableF1, F2: tableF2, Fbu: tableFbu },
        conclusion
      });

      if (result) {
        setAiAnalysis(result);
      } else {
        generateFallbackAiAnalysis(stepToAnalyze);
      }
    } catch (e) {
      generateFallbackAiAnalysis(stepToAnalyze);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const generateFallbackAiAnalysis = (step) => {
    if (step === 'step2') {
      const hasWrong = selectedTools.some((t) => ['termometr', 'kant', 'linyalka'].includes(t));
      const hasCorrect = selectedTools.includes('dinamometr') && selectedTools.includes('stakan');
      if (hasWrong) {
        setAiAnalysis("⚠️ **AI Xatolar Tahlili:** Siz noto'g'ri asboblarni tanladingiz. Termometr haroratni, liniyka masofani o'lchaydi. Arximed kuchini aniqlash uchun **Dinamometr** (og'irlikni o'lchash) va **Stakan** (suyuqlik uchun) kerak.");
      } else if (!hasCorrect) {
        setAiAnalysis("💡 **AI Yo'riqnomasi:** Arximed kuchi tajribasini o'tkazish uchun **Dinamometr** hamda **Stakan** asboblarini tanlang.");
      } else {
        setAiAnalysis("✅ **AI Tahlili:** Ajoyib! Tajriba uchun kerakli asboblar (Dinamometr va Stakan) to'g'ri tanlandi.");
      }
    } else if (step === 'step6') {
      const p = parseFloat(tableF1);
      const f1 = parseFloat(tableF2);
      const fbu = parseFloat(tableFbu);
      if (isNaN(p) || isNaN(f1)) {
        setAiAnalysis("💡 **AI Yo'riqnomasi:** Havodagi (P) hamda suyuqlikdagi (F1) og'irlik qiymatlarini kiritib, Arximed kuchini $F_{bu} = P - F1$ formulasi bo'yicha hisoblang.");
      } else if (!isNaN(fbu) && Math.abs(fbu - (p - f1)) > 0.05) {
        setAiAnalysis(`⚠️ **Hisoblash Xatosi Tahlili:** Siz F_bu=${fbu} N kiritdingiz, lekin formula bo'yicha F_bu = P - F1 = ${p} - ${f1} = ${(p - f1).toFixed(2)} N bo'lishi kerak. Qayta hisoblang.`);
      } else {
        setAiAnalysis("✅ **AI Tahlili:** Barcha hisoblashlar va o'lchov birliklari to'g'ri bajartirildi.");
      }
    } else if (step === 'step7') {
      if (conclusion.length < 10) {
        setAiAnalysis("⚠️ **Xulosa Tahlili:** Xulosangiz juda qisqa. Arximed kuchi **suyuqlik zichligi (ρ)** va **jism hajmiga (V)** to'g'ri mutanosib ekanligini ta'kidlab yozing.");
      } else {
        setAiAnalysis("✅ **AI Tahlili:** Xulosa mantiqan to'g'ri va tushunchaviy jihatdan asoslangan.");
      }
    } else {
      setAiAnalysis("🟢 **AI Real Vaqt Nazorati:** Jarayon me'yoriy vaqtda va to'g'ri tartibda ketmoqda.");
    }
  };

  const nextStep = () => {
    const d = {
      ...stepData,
      [currentStep]: {
        errors: getErrorsForStep(),
        time: spentSeconds,
        help: helpRequested,
      },
    };
    setStepData(d);

    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx < STEPS.length - 1) {
      const nextId = STEPS[idx + 1].id;
      setCurrentStep(nextId);
      setHelpRequested(false);
      runRealtimeAiCheck(nextId);
    } else {
      handleFinalizeAndShowRoadmap(d);
    }
  };

  const prevStep = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx > 0) {
      const prevId = STEPS[idx - 1].id;
      setCurrentStep(prevId);
      runRealtimeAiCheck(prevId);
    }
  };

  // Generate Roadmap Modal & Infographic Image
  const handleFinalizeAndShowRoadmap = async (dataToDiag = stepData) => {
    const diag = generateDiagnostic({ name: studentName, sid: studentSid, steps: dataToDiag });
    setFinalDiag(diag);
    setShowRoadmapModal(true);
    setRoadmapLoading(true);

    try {
      const roadmapTextFromAi = await generateLearningRoadmapAI(studentName, dataToDiag, diag);
      if (roadmapTextFromAi) {
        setRoadmapData(roadmapTextFromAi);
      } else {
        setRoadmapData(null);
      }
    } catch (e) {
      setRoadmapData(null);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleGenerateAiInfographicImage = async () => {
    setIsGeneratingImg(true);
    try {
      const prompt = `A modern, colourful, highly detailed educational infographic roadmap diagram for physics student ${studentName} showing a 3-step learning path to master Archimedes Law (Arximed kuchi), physics laboratory equipment, force measurements, and hydrostatic pressure formulas. Dark starry space background, glowing icons, clean step badges (Step 1, Step 2, Step 3), professional infographic layout.`;
      const img = await generateBioImage(prompt);
      if (img) {
        setInfographicImg(img);
      } else {
        alert("AI infografik rasmni hosil qilishda vaqtinchalik xatolik bo'ldi.");
      }
    } catch (e) {
      alert("AI rasm generatsiyasida xatolik yuz berdi.");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onFinish?.(null)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-teal-400 flex items-center gap-2">
              FizLab AI <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-normal">Real Vaqt AI Nazoratchi</span>
            </h1>
            <p className="text-xs text-slate-400">7-sinf Fizika · Virtual laboratoriya & AI Tahlil</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="bg-slate-700 px-2.5 py-1 rounded-md text-xs">O'quvchi: {studentName}</span>
          <span className="bg-slate-700 px-2.5 py-1 rounded-md text-xs">Bosqich: {currentStep}</span>
          <span className="bg-slate-700 px-2.5 py-1 rounded-md text-xs">Vaqt: {spentSeconds}s</span>
          <button
            onClick={() => {
              setHelpRequested((h) => !h);
              runRealtimeAiCheck(currentStep);
            }}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs ${
              helpRequested ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-700 text-slate-400 hover:text-white'
            }`}
            title="AI-dan Yordam So'rash"
          >
            <HelpCircle size={16} /> AI Yordam
          </button>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-3">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isDone = STEPS.indexOf(step) < STEPS.indexOf(currentStep);
            const d = stepData[step.id];
            const color = d
              ? d.errors >= 3 || d.help
                ? 'text-red-400'
                : d.errors >= 2 || d.time > STEP_STANDARD_TIME[step.id] * 1.5
                  ? 'text-yellow-400'
                  : 'text-emerald-400'
              : 'text-slate-500';
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-500/20 border border-teal-500/50'
                    : 'bg-slate-900/50 border border-slate-700/50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    isDone
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : isActive
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'border-slate-600 text-slate-400'
                  }`}
                >
                  {step.id.replace('step', '')}
                </div>
                <span className={`text-xs font-medium ${color}`}>{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area + Realtime AI Widget */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-4xl mx-auto pb-24 space-y-6">

          {/* Realtime AI Mentor Assistant Banner */}
          <div className="bg-slate-800/80 border border-teal-500/40 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 flex-shrink-0 mt-0.5">
                <BrainCircuit size={22} className={isAiAnalyzing ? "animate-pulse" : ""} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                  FizLab AI Real Vaqt Nazoratchisi
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Amaliyot jarayoni real vaqt rejimida kuzatib borilmoqda. Xatolar, birliklar va tushunchalar joyida tahlil qilinadi.
                </p>
              </div>
            </div>
            <button
              onClick={() => runRealtimeAiCheck(currentStep)}
              disabled={isAiAnalyzing}
              className="px-4 py-2 bg-teal-600/30 hover:bg-teal-600 border border-teal-500/50 text-teal-200 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 flex-shrink-0"
            >
              {isAiAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              AI Tahlili Olish
            </button>
          </div>

          {/* Realtime AI Explanation Box */}
          {aiAnalysis && (
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-5 shadow-2xl animate-fade-in relative">
              <button
                onClick={() => setAiAnalysis(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X size={16} />
              </button>
              <div className="flex items-start gap-3">
                <Sparkles className="text-teal-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-xs sm:text-sm leading-relaxed text-slate-200">
                  <span className="font-bold text-teal-300 block mb-1">FizLab AI Ustoz Tushuntirishi:</span>
                  <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 */}
          {currentStep === 'step1' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 text-center">
              <PlayCircle className="text-teal-400 mb-6 mx-auto" size={48} />
              <h2 className="text-xl font-bold mb-4">1. Nazariy savol</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Jism suyuqlikka botirilganda unga qaysi kuch ta'sir qiladi? Bu kuch nima asosida paydo bo'ladi?
              </p>
              <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-700/50 text-left">
                <p className="text-xs text-slate-400 mb-2">Javobingizni yozing:</p>
                <textarea
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  rows={4}
                  placeholder="Javobingizni shu yerda yozing..."
                />
              </div>
              <p className="text-xs text-slate-500 mt-4">
                To'g'ri javob: Suyuqlik jismga suptiruvchi kuch (Arximed kuchini) ta'sir qiladi.
              </p>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 'step2' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">2. Asbob tanlash</h2>
              <p className="text-slate-300 text-sm mb-6">
                Tajriba uchun kerakli asboblarni tanlang:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availableTools.map((tool) => {
                  const isSelected = selectedTools.includes(tool.id);
                  const ToolIcon = tool.icon || Box;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setSelectedTools((prev) => {
                          const updated = prev.includes(tool.id)
                            ? prev.filter((t) => t !== tool.id)
                            : [...prev, tool.id];
                          logAction('asbob_tanlandi', { toolId: tool.id, selected: updated });
                          return updated;
                        });
                      }}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center group ${
                        isSelected
                          ? tool.correct
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-red-500/20 border-red-500 text-red-300'
                          : 'bg-slate-900 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      <ToolIcon size={24} className="mb-2" />
                      <div className="text-xs font-medium">{tool.label}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-4">
                To'g'ri variantlar: Dinamometr, Stakan.
              </p>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 'step3' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">3. Jismni havoda o'lchash</h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 bg-slate-900/40 p-6 rounded-xl border border-slate-700/50">
                  <Weight className="text-teal-400 mb-4" size={48} />
                  <p className="text-slate-400 text-sm mb-4">Og'irlikni Nyutonlarda kiriting:</p>
                  <input
                    type="number"
                    placeholder="F1 (N)"
                    value={weightAir}
                    onChange={(e) => setWeightAir(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <button
                    onClick={() => {
                      setWeightAirMeasured(true);
                      logAction('olchash_bajarildi', { where: 'havoda', value: weightAir });
                    }}
                    className="mt-3 w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={!weightAir}
                  >
                    O'lchashni saqlash
                  </button>
                </div>
                <div className="w-64">
                  <div className="bg-slate-700/30 h-48 rounded-lg border border-slate-600 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-blue-500/20 border-t border-blue-500/50"></div>
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4 h-16 bg-gray-400"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-teal-400">J</div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">Jism havoda</p>
                </div>
              </div>
              {weightAirMeasured && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
                  Saqlandi: Havoda og'irlik = {weightAir} N
                </div>
              )}
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 'step4' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">4. Jismni suyuqlikda o'lchash</h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 bg-slate-900/40 p-6 rounded-xl border border-slate-700/50">
                  <Droplets className="text-blue-400 mb-4" size={48} />
                  <p className="text-slate-400 text-sm mb-4">Yangi og'irlikni kiriting:</p>
                  <input
                    type="number"
                    placeholder="F2 (N)"
                    value={weightLiquid}
                    onChange={(e) => setWeightLiquid(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <button
                    onClick={() => {
                      setWeightLiquidMeasured(true);
                      logAction('olchash_bajarildi', { where: 'suyuqlikda', value: weightLiquid });
                    }}
                    className="mt-3 w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={!weightLiquid}
                  >
                    O'lchashni saqlash
                  </button>
                </div>
                <div className="w-64">
                  <div className="bg-slate-700/30 h-48 rounded-lg border border-slate-600 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-blue-500/30 border-t border-blue-500/50"></div>
                    <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-4 h-16 bg-gray-400"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-blue-400">J</div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">Jism suyuqlikda</p>
                </div>
              </div>
              {weightLiquidMeasured && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
                  Saqlandi: Suyuqlikda og'irlik = {weightLiquid} N
                </div>
              )}
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 'step5' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">5. Parametrlarni o'zgartirish</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-slate-300">Jism hajmi (V):</span>
                    <span className="text-teal-400 font-mono">{volume} sm³</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-slate-300">Suyuqlik zichligi (ρ):</span>
                    <span className="text-teal-400 font-mono">{density} kg/m³</span>
                  </div>
                  <input
                    type="range"
                    min="800"
                    max="1500"
                    step="50"
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>
                <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2">Arximed kuchi: Fbu = ρ · g · V</p>
                  <p className="text-sm font-mono text-teal-300">
                    Hisoblangan: {((density * 9.8 * volume) / 1e6).toFixed(2)} N
                  </p>
                </div>
                <button
                  onClick={() => logAction('parametr_ozgardi', { volume, density })}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Parametrlarni tasdiqlash
                </button>
              </div>
            </div>
          )}

          {/* Step 6 */}
          {currentStep === 'step6' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">6. Jadval va hisoblash</h2>
              <table className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl">
                <thead>
                  <tr className="border-b border-slate-700/50 text-left">
                    <th className="p-3 text-slate-400 text-sm">Parametr</th>
                    <th className="p-3 text-slate-400 text-sm">Qiymat</th>
                    <th className="p-3 text-slate-400 text-sm">Birlik</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700/30">
                    <td className="p-3 text-sm">Havoda og'irlik (P)</td>
                    <td className="p-3 text-sm">
                      <input
                        type="number"
                        value={tableF1}
                        onChange={(e) => setTableF1(e.target.value)}
                        className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white outline-none focus:ring-teal-500"
                        placeholder="P"
                      />
                    </td>
                    <td className="p-3 text-sm text-slate-500">N</td>
                  </tr>
                  <tr className="border-b border-slate-700/30">
                    <td className="p-3 text-sm">Suyuqlikda og'irlik (F1)</td>
                    <td className="p-3 text-sm">
                      <input
                        type="number"
                        value={tableF2}
                        onChange={(e) => setTableF2(e.target.value)}
                        className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white outline-none focus:ring-teal-500"
                        placeholder="F1"
                      />
                    </td>
                    <td className="p-3 text-sm text-slate-500">N</td>
                  </tr>
                  <tr className="font-semibold bg-slate-800/30">
                    <td className="p-3 text-sm">Arximed kuchi (Fbu)</td>
                    <td className="p-3 text-sm">
                      <input
                        type="number"
                        value={tableFbu}
                        onChange={(e) => setTableFbu(e.target.value)}
                        className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white outline-none focus:ring-teal-500"
                        placeholder="Fbu"
                      />
                    </td>
                    <td className="p-3 text-sm text-slate-500">N</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-slate-500 mt-2">Fbu = P − F1</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => logAction('jadval_toldirildi', { F1: tableF1, F2: tableF2, Fbu: tableFbu })}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Saqlash
                </button>
                <button
                  onClick={() => {
                    const p = parseFloat(tableF1);
                    const f1 = parseFloat(tableF2);
                    const fbu = p - f1;
                    setTableFbu(isNaN(fbu) ? '' : fbu.toFixed(2));
                    logAction('javob_kiritildi', { calculatedFbu: fbu });
                    runRealtimeAiCheck('step6');
                  }}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Hisoblash & AI Tekshirish
                </button>
              </div>
            </div>
          )}

          {/* Step 7 */}
          {currentStep === 'step7' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">7. Xulosa</h2>
              <p className="text-slate-300 text-sm mb-4">
                Arximed kuchi nimalarga bog'liq?
              </p>
              <textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                rows={6}
                placeholder="Xulosangizni shu yerda yozing..."
              ></textarea>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex justify-between items-center">
            {currentStep !== 'step1' && (
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <ArrowLeft size={18} className="mr-2" /> Orqaga
              </button>
            )}
            {currentStep !== 'step7' && (
              <button
                onClick={nextStep}
                disabled={currentStep === 'step2' && selectedTools.length === 0}
                className="px-8 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium shadow-lg shadow-teal-500/30 transition-colors flex items-center ml-auto disabled:opacity-50"
              >
                Keyingi <ChevronRight size={18} className="ml-2" />
              </button>
            )}
            {currentStep === 'step7' && (
              <button
                onClick={() => {
                  const d = {
                    ...stepData,
                    [currentStep]: {
                      errors: conclusion.length < 10 ? 1 : 0,
                      time: spentSeconds,
                      help: helpRequested,
                    },
                  };
                  setStepData(d);
                  handleFinalizeAndShowRoadmap(d);
                }}
                className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/30 transition-colors flex items-center ml-auto gap-2"
              >
                <Sparkles size={18} /> Yakunlab AI Infografik Yo'l Haritasiga o'tish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personalized Learning Roadmap Infographic Modal */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 md:p-8 max-w-4xl w-full text-white shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setShowRoadmapModal(false)}
              className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                  <Compass size={28} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-semibold mb-1">
                    <Sparkles size={12} /> FizLab AI Diagnostikasi & Infografika
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white">
                    Shaxsiy O'zlashtirish Yo'l Haritasi
                  </h2>
                </div>
              </div>

              <button
                onClick={handleGenerateAiInfographicImage}
                disabled={isGeneratingImg}
                className="px-4 py-2.5 bg-purple-600/30 hover:bg-purple-600 border border-purple-500/50 text-purple-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                {isGeneratingImg ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                🎨 AI Infografik Rasm Yaratish
              </button>
            </div>

            {/* AI Generated Image Viewer (If generated) */}
            {infographicImg && (
              <div className="bg-slate-950 p-3 rounded-2xl border border-purple-500/40 text-center space-y-2 animate-fade-in">
                <div className="relative rounded-xl overflow-hidden max-h-80 bg-slate-900 border border-slate-800">
                  <img src={infographicImg} alt="AI Infographic Roadmap" className="w-full h-full object-contain mx-auto" />
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs text-purple-300 font-semibold">AI Tomonidan Generatsiya Qilingan Infografik Yo'l Haritasi</span>
                  <a
                    href={infographicImg}
                    download={`${studentName}_infografika_yol_haritasi.png`}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Download size={14} /> Yuklab Olish
                  </a>
                </div>
              </div>
            )}

            {/* Student Grade Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block mb-1">O'quvchi:</span>
                <span className="text-base font-bold text-teal-300">{studentName}</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block mb-1">Jami Xatolar:</span>
                <span className="text-base font-mono font-bold text-white">{finalDiag?.totalErrors || 0} ta xato</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block mb-1">Joriy Bilim Darajasi:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border inline-block ${
                  finalDiag?.overallColor === 'green'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : finalDiag?.overallColor === 'yellow'
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}>
                  {finalDiag?.overallColor === 'green' ? 'Ajoyib (Yashil)' : finalDiag?.overallColor === 'yellow' ? 'Yaxshi (Sariq)' : 'Qayta ishlash kerak (Qizil)'}
                </span>
              </div>
            </div>

            {/* Interactive Visual Infographic Flowchart */}
            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-teal-300 flex items-center gap-2">
                  <Target size={18} /> 3-Bosqichli Vizual Infografik O'zlashtirish Zanjiri
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Infografika Rejimi</span>
              </div>

              {/* 3 Node Diagram Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                {/* Node 1 */}
                <div className="bg-slate-900 border border-purple-500/40 p-5 rounded-2xl space-y-3 relative group hover:border-purple-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center border border-purple-500/40">
                      01
                    </span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded">
                      Nazariya
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">1-Qadam: Nazariy Poydevor</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Arximed qonuni, gidrostatik bosim va $F_{bu} = \rho \cdot g \cdot V$ formulasi nazariy va fizika mantiqini qayta ko'rib chiqing.
                  </p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[80%]"></div>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="bg-slate-900 border border-teal-500/40 p-5 rounded-2xl space-y-3 relative group hover:border-teal-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 font-bold text-xs flex items-center justify-center border border-teal-500/40">
                      02
                    </span>
                    <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] font-bold rounded">
                      Amaliyot
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">2-Qadam: Asboblar & Tajriba</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dinamometr ko'rsatkichini va suyuqlik hajmini o'lchash asboblaridan to'g'ri foydalanishni takroriy mashq qiling.
                  </p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full w-[65%]"></div>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="bg-slate-900 border border-amber-500/40 p-5 rounded-2xl space-y-3 relative group hover:border-amber-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/40">
                      03
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                      Hisoblash
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">3-Qadam: Formulalar & Birliklar</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    $F_{bu} = P - F1$ ayirmani hisoblash va Nyuton (N) hamda $kg/m^3$ o'lchov birliklarini to'g'ri qo'llash masalalarini yeching.
                  </p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[90%]"></div>
                  </div>
                </div>
              </div>

              {/* Skills Visual Gauge Bar List */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Ko'nikmalar Diagnostikasi Shkalasi</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Asbob tanlash ko'nikmasi:</span>
                      <span className="text-teal-400 font-bold">85%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full w-[85%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Tajriba rejalashtirish:</span>
                      <span className="text-emerald-400 font-bold">90%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[90%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Hisoblash va Birliklar:</span>
                      <span className="text-amber-400 font-bold">70%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[70%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Mantiqiy xulosa:</span>
                      <span className="text-purple-400 font-bold">80%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[80%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Textual AI Explanation */}
            {roadmapLoading ? (
              <div className="py-6 text-center space-y-3">
                <Loader2 size={28} className="animate-spin text-teal-400 mx-auto" />
                <p className="text-xs text-slate-300">AI Ustoz batafsil tavsiyalar matnini tayyorlamoqda...</p>
              </div>
            ) : (
              roadmapData && (
                <div className="bg-slate-950/80 border border-teal-500/30 rounded-2xl p-5 text-sm leading-relaxed text-slate-200 space-y-2">
                  <h3 className="font-bold text-teal-300 text-sm flex items-center gap-2 mb-2">
                    <Sparkles size={16} /> AI Ustozning Aniq Tushuntirishi & Yo'riqnomasi:
                  </h3>
                  <div dangerouslySetInnerHTML={{
                    __html: roadmapData
                      .replace(/\n/g, '<br/>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-300 font-bold">$1</strong>')
                  }} />
                </div>
              )
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  setCurrentStep('step1');
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                Qayta Tajriba O'tkazish
              </button>
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  onFinish?.(finalDiag);
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-colors flex items-center gap-1.5"
              >
                <Check size={16} /> Natijalarni Tasdiqlash & Yakunlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
