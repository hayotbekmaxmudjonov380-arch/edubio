
import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, Book, Sparkles, GraduationCap, Hexagon, Dna, FlaskConical, Atom } from 'lucide-react';
import { useSystem, useSubject } from '../../context/SystemContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const system = useSystem();
  const subject = useSubject();
  const links = [
    { to: '/', label: 'Bosh sahifa', icon: Home },
    { to: '/lessons', label: 'Darslar', icon: GraduationCap },
    { to: '/library', label: 'Kutubxona', icon: Book },
    { to: '/bio-ai', label: 'EduBio AI', icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 border-r border-white/10 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:top-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-hidden bg-[#0f172a]/90 backdrop-blur-xl shadow-2xl`}>
        
        {/* Animated Chemical Background (Dark Mode Style) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           {/* Decorational Molecules - Glowing Effects */}
           <Hexagon className="absolute w-24 h-24 top-10 -left-8 text-teal-500/10 animate-pulse-slow" style={{ animationDelay: '0s' }} />
           <Dna className="absolute w-32 h-32 top-1/3 -right-10 rotate-45 text-blue-500/10 animate-float-molecule" style={{ animationDelay: '2s' }} />
           <Atom className="absolute w-20 h-20 bottom-20 left-4 text-purple-500/10 animate-spin-slow" style={{ animationDuration: '10s' }} />
           <FlaskConical className="absolute w-16 h-16 bottom-10 -right-4 text-emerald-500/10 rotate-12" />
           
           {/* Peptide Chain Simulation (SVG Lines) */}
           <svg className="absolute inset-0 w-full h-full opacity-[0.03] z-[-1]" xmlns="http://www.w3.org/2000/svg">
             <path d="M-10 50 Q 50 100 100 50 T 200 50 T 300 100" stroke="white" strokeWidth="1" fill="none" />
             <path d="M-10 250 Q 50 300 100 250 T 200 250 T 300 300" stroke="white" strokeWidth="1" fill="none" />
             <path d="M-10 450 Q 50 500 100 450 T 200 450 T 300 500" stroke="white" strokeWidth="1" fill="none" />
           </svg>
           
           {/* Gradient Glow at bottom */}
           <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-teal-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Mobile Header inside Sidebar */}
          <div className="p-4 flex justify-between items-center border-b border-white/10 lg:hidden bg-white/5 backdrop-blur-md">
            <span className="font-bold text-lg text-white tracking-wide">Menyu</span>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="py-6 px-3">
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      `relative overflow-hidden flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] ring-1 ring-teal-400/50'
                          : 'text-gray-400 hover:bg-white/10 hover:text-white hover:shadow-lg'
                      }`
                    }
                  >
                    {/* Active State Background Glow */}
                    {({ isActive }) => (
                      <>
                        {isActive && (
                           <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 opacity-100 z-[-1]"></div>
                        )}
                        
                        <link.icon 
                          size={22} 
                          className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-teal-400'}`} 
                        />
                        <span className={`font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                          {link.label}
                        </span>
                        
                        {/* Right Chevron/Dot for active state */}
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]"></div>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Bottom Info Area */}
          <div className="mt-auto p-6 border-t border-white/5">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
               <h4 className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                 {system === 'institute'
                   ? `Institut · ${subject?.title || ''}`
                   : 'Maktab tizimi v1.0'}
               </h4>
               <p className="text-gray-500 text-[10px]">EduBio AI tomonidan quvvatlanadi</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
