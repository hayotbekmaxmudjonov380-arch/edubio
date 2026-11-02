import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = ({ onMenuClick, isDark = true, user, isGuest, onLogout }) => {
  return (
    <nav className="h-20 flex items-center justify-between px-4 sticky top-0 z-30 border-b border-white/10 bg-[#0f172a] text-white transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-lg lg:hidden transition-colors hover:bg-white/10 text-gray-300"
        >
          <Menu size={24} />
        </button>
        
        <Link to="/" className="flex items-center gap-4 group py-1">
          {/* Logo Section */}
          <div className="relative h-14 w-14 flex-shrink-0">
             {/* Background glow behind logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full blur-xl opacity-50 transition duration-500 bg-cyan-500"></div>
            
            {/* Circular Image Logo */}
            <img 
              src="/edubio%20logosi.png" 
              alt="EduBio Logo" 
              className="h-full w-full object-cover rounded-full border-2 border-white/10 shadow-lg relative z-10" 
            />
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Foydalanuvchi ma'lumotlari */}
        {user ? (
          <div className="flex items-center gap-2 mr-2">
             <img 
               src={user.photoURL} 
               alt={user.displayName} 
               className="w-9 h-9 rounded-full border border-white/20"
               title={user.displayName}
             />
             <span className="text-sm font-medium hidden md:block text-white">
                {user.displayName?.split(' ')[0]}
             </span>
          </div>
        ) : isGuest ? (
           <div className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-white/10 text-white">
              <User size={16} />
              <span className="text-sm font-medium">Mehmon</span>
           </div>
        ) : null}

        {/* Chiqish tugmasi */}
        {(user || isGuest) && (
          <button 
            onClick={onLogout}
            title="Chiqish"
            className="p-2 rounded-full transition-colors hover:bg-red-500/20 text-gray-300 hover:text-red-400"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </nav>
  );
};
