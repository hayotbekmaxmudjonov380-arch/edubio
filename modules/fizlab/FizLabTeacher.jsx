import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  RefreshCw,
  BarChart3,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { FizLabLogger } from './FizLabLogger';
import { generateDiagnostic } from './FizLabDiagnostic';

const COLOR_BADGE = {
  green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red: 'bg-red-100 text-red-800 border-red-200',
};

export const FizLabTeacher = ({ onBack }) => {
  const [classCode, setClassCode] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [students, setStudents] = useState([]);
  const [diagnostics, setDiagnostics] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const logs = FizLabLogger.getAllLogs();
      const sids = [...new Set(logs.map((l) => l.sid))];
      const newStudents = sids.map((sid) => {
        const sidLogs = logs.filter((l) => l.sid === sid);
        const last = sidLogs[sidLogs.length - 1];
        const name = last?.data?.studentName || `O'quvchi-${sid.slice(-4)}`;
        const steps = sidLogs.map((l) => l.type).filter(Boolean);
        return { sid, name, lastEvent: last?.type, steps, lastTs: last?.ts };
      });
      setStudents(newStudents);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const createClass = () => {
    const code = 'FIZ' + Math.random().toString(36).slice(2, 6).toUpperCase();
    setClassCode(code);
    setIsActive(true);
    FizLabLogger.clear();
  };

  const getColor = (sid) => {
    const diag = diagnostics[sid];
    if (!diag) return 'gray';
    return diag.overallColor;
  };

  const finishStudent = (sid, studentName) => {
    const logs = FizLabLogger.getLogsBySid(sid);
    const steps = {};
    logs.forEach((l) => {
      if (
        l.type === 'olchash_bajarildi' ||
        l.type === 'parametr_ozgardi' ||
        l.type === 'jadval_toldirildi' ||
        l.type === 'javob_kiritildi'
      ) {
        steps[l.data?.step || 'unknown'] = {
          errors: l.data?.errors || 0,
          time: l.data?.time || 0,
          help: l.data?.help || false,
        };
      }
    });
    const diag = generateDiagnostic({ name: studentName, sid, steps });
    setDiagnostics((prev) => ({ ...prev, [sid]: diag }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Top Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-teal-400">FizLab AI</h1>
            <p className="text-xs text-slate-400">O'qituvchi paneli · Real vaqt monitoring</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-xs text-slate-400">Sinf kodi: </span>
          <span className="text-lg font-mono text-teal-400 font-bold">{classCode || '—'}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto pb-24">
          {!isActive ? (
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-10 text-center">
              <Users className="text-teal-400 mb-6 mx-auto" size={64} />
              <h2 className="text-xl font-bold mb-4">Sinfni yaratish</h2>
              <p className="text-slate-400 text-sm mb-8">
                "Darsni boshlash" tugmasini bosing. Tizim sinf uchun yagona kod yaratadi.
                O'quvchilar shu kod bilan kiradi.
              </p>
              <button
                onClick={createClass}
                className="w-full max-w-xs bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-lg font-medium shadow-lg shadow-teal-500/30 transition-colors"
              >
                Darsni boshlash
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">O'quvchilar monitoringi</h2>
                  <p className="text-xs text-slate-400">Har 3 soniyada yangilanadi</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDiagnostics({})}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 rounded transition-colors"
                  >
                    <RefreshCw size={14} className="mr-1 inline" /> Yangilash
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(classCode);
                    }}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 rounded transition-colors"
                    title="Kodni nusxalash"
                  >
                    <Eye size={14} className="mr-1 inline" /> Kod: {classCode}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {students.length === 0 ? (
                  <div className="col-span-full bg-slate-800/40 border border-slate-700/50 rounded-xl p-12 text-center">
                    <BarChart3 className="text-slate-600 mb-4 mx-auto" size={48} />
                    <p className="text-slate-400 text-sm">Hozircha o'quvchi yo'q</p>
                    <p className="text-xs text-slate-500 mt-1">O'quvchilar kod bilan kiritilganda shu yerda ko'rinadi</p>
                  </div>
                ) : (
                  students.map((s) => {
                    const color = getColor(s.sid);
                    const diag = diagnostics[s.sid];
                    return (
                      <div
                        key={s.sid}
                        className={`bg-slate-800/60 border rounded-xl p-4 transition-all ${
                          color === 'red'
                            ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                            : color === 'yellow'
                              ? 'border-yellow-500/50'
                              : color === 'green'
                                ? 'border-emerald-500/50'
                                : 'border-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Users className={`w-5 h-5 ${color === 'red' ? 'text-red-400' : color === 'yellow' ? 'text-yellow-400' : 'text-emerald-400'}`} />
                            <span className={`font-bold text-sm ${color === 'red' ? 'text-red-300' : color === 'yellow' ? 'text-yellow-300' : 'text-emerald-300'}`}>
                              {s.name}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${COLOR_BADGE[color] || 'bg-slate-700 text-slate-400 border-slate-600'}`}
                          >
                            {color === 'gray' ? 'Kutilmoqda' : color}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mb-3">
                          <div className="flex justify-between mb-1">
                            <span>Oxirgi harakat:</span>
                            <span className="text-slate-300">{s.lastEvent || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bosqichlar:</span>
                            <span className="text-slate-300">{s.steps.length}</span>
                          </div>
                        </div>
                        {diag && (
                          <div className="bg-slate-900/40 rounded-lg p-2 border border-slate-700/30">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">Xato:</span>
                              <span className="text-slate-300 font-mono">{diag.totalErrors}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Vaqt ko'rsatkichi:</span>
                              <span className="text-slate-300 font-mono">{diag.avgTimeRatio.toFixed(1)}×</span>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => finishStudent(s.sid, s.name)}
                          className="w-full mt-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 rounded transition-colors flex items-center justify-center"
                        >
                          Diagnostika hisoblash <ChevronRight size={12} className="ml-1" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {Object.keys(diagnostics).length > 0 && (
                <div className="mt-8 bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-sm font-bold text-slate-300 mb-4">To'liq diagnostika natijalari</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700/50 text-left">
                          <th className="p-2 text-slate-400">Ism</th>
                          <th className="p-2 text-slate-400">Rang</th>
                          <th className="p-2 text-slate-400">Xatolar</th>
                          <th className="p-2 text-slate-400">Vaqt</th>
                          <th className="p-2 text-slate-400">Xulosa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(diagnostics).map((d) => (
                          <tr key={d.sid} className="border-b border-slate-700/30">
                            <td className="p-2 text-slate-300">{d.name}</td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${COLOR_BADGE[d.overallColor] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                                {d.overallColor}
                              </span>
                            </td>
                            <td className="p-2 text-slate-300 font-mono">{d.totalErrors}</td>
                            <td className="p-2 text-slate-300 font-mono">{d.avgTimeRatio.toFixed(1)}×</td>
                            <td className="p-2 text-slate-400 text-xs max-w-xs truncate" title={d.aiText}>
                              {d.aiText}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
