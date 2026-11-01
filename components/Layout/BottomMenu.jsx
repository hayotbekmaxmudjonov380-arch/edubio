import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, GraduationCap, Book, Sparkles } from 'lucide-react';

// Sidebar bilan bir xil dizayn: qorong'i glass + emerald faol holat + oq nuqta indikator
const links = [
  { to: '/', label: 'Bosh sahifa', icon: Home },
  { to: '/lessons', label: 'Darslar', icon: GraduationCap },
  { to: '/library', label: 'Kutubxona', icon: Book },
  { to: '/bio-ai', label: 'EduBio AI', icon: Sparkles },
];

export const BottomMenu = () => {
  return (
    <div className="fixed bottom-3 left-0 right-0 flex justify-center z-50 px-2.5 lg:hidden pointer-events-none">
      <style>{`
        .bio-menu {
          --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
          width: 100%;
          max-width: 520px;
          backdrop-filter: blur(16px) saturate(180%) contrast(110%);
          -webkit-backdrop-filter: blur(16px) saturate(180%) contrast(110%);
          background: rgba(15, 23, 42, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.45),
            0 0 24px rgba(20, 184, 166, 0.10);
          padding: 8px;
          border-radius: 99rem;
          display: flex;
          justify-content: center;
          gap: 6px;
          z-index: 50;
          pointer-events: auto;
          position: relative;
        }

        .bio-menu::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow:
            inset 2px 2px 5px -2px rgba(255, 255, 255, 0.25),
            inset -2px -2px 5px 2px rgba(255, 255, 255, 0.12),
            inset 0 -2px 0 rgba(255, 255, 255, 0.10);
          pointer-events: none;
          z-index: -1;
        }

        .bio-menu a {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1 1 0;
          min-width: 0;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          padding: 10px 4px;
          border-radius: 999rem;
          -webkit-tap-highlight-color: transparent;
          transition:
            background 0.18s var(--ease-spring),
            color 0.18s var(--ease-spring),
            transform 0.18s var(--ease-spring),
            box-shadow 0.3s ease-in-out;
        }

        .bio-menu a:hover {
          background-color: rgba(255, 255, 255, 0.10);
          color: rgba(94, 234, 212, 0.9);
          box-shadow:
            inset 2px 2px 5px -2px rgba(255, 255, 255, 0.25),
            inset -2px -1px 5px 0 rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
        }

        .bio-menu a svg {
          width: 1.35rem;
          height: 1.35rem;
        }

        .bio-menu a span {
          font-size: 0.68rem;
          font-weight: 600;
          line-height: 1;
          margin-top: 5px;
          white-space: nowrap;
        }

        .bio-menu a.active {
          background: linear-gradient(to bottom, #14b8a6, #059669);
          color: #ffffff;
          box-shadow:
            0 0 20px rgba(20, 184, 166, 0.45),
            inset 2px 2px 5px -2px rgba(255, 255, 255, 0.35),
            inset -2px -2px 5px 2px rgba(255, 255, 255, 0.15),
            inset 0 -2px 0 rgba(255, 255, 255, 0.15);
        }

        .bio-menu a.active .bio-menu-dot {
          display: block;
        }

        .bio-menu-dot {
          display: none;
          width: 6px;
          height: 6px;
          margin-top: 4px;
          border-radius: 999rem;
          background: #ffffff;
          box-shadow: 0 0 5px #ffffff;
        }

        .bio-menu a:active {
          transform: scale(0.98);
        }
      `}</style>

      <nav className="bio-menu">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'}>
            <link.icon />
            <span>{link.label}</span>
            <div className="bio-menu-dot"></div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
