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
} from 'lucide-react';
import { FizLabLogger } from './FizLabLogger';
import { STEP_STANDARD_TIME, generateDiagnostic } from './FizLabDiagnostic';

const STEPS = [
  { id: 'step1', title: '1. Nazariy savol', icon: BookOpen },
  { id: 'step2', title: '2. Asbob tanlash', icon: FlaskConical },
  { id: 'step3', title: "3. Havoda o'lchash", icon: Weight },
  { id: 'step4', title: "4. Suyuqlikda o'lchash", icon: Droplets },
  { id: 'step5', title: "5. Parametrlarni o'zgartirish", icon: Ruler },
  { id: 'step6', title: '6. Jadval va hisoblash', icon: Calculator },
  { id: 'step7', title: '7. Xulosa', icon: Save },
];

export const FizLabLab = ({ studentName, studentSid, onFinish }) => {
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
      setCurrentStep(STEPS[idx + 1].id);
      setHelpRequested(false);
    } else {
      const diag = generateDiagnostic({ name: studentName, sid: studentSid, steps: d });
      onFinish?.(diag);
    }
  };

  const prevStep = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1].id);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
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
            <h1 className="text-lg font-bold text-teal-400">FizLab AI</h1>
            <p className="text-xs text-slate-400">7-sinf Fizika · Virtual laboratoriya</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="bg-slate-700 px-2 py-1 rounded">O'quvchi: {studentName}</span>
          <span className="bg-slate-700 px-2 py-1 rounded">Bosqich: {currentStep}</span>
          <span className="bg-slate-700 px-2 py-1 rounded">Vaqt: {spentSeconds}s</span>
          <button
            onClick={() => setHelpRequested((h) => !h)}
            className={`p-2 rounded-lg transition-colors ${
              helpRequested ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Yordam so'rash"
          >
            <HelpCircle size={18} />
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-3xl mx-auto pb-24">
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
                        setSelectedTools((prev) =>
                          prev.includes(tool.id)
                            ? prev.filter((t) => t !== tool.id)
                            : [...prev, tool.id]
                        );
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
                  }}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Hisoblash
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
                  const diag = generateDiagnostic({ name: studentName, sid: studentSid, steps: d });
                  onFinish?.(diag);
                }}
                className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/30 transition-colors flex items-center ml-auto"
              >
                Yakunlab diagnostikaga o'tish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
