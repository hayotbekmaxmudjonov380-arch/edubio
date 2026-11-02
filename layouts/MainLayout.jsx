import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { Sidebar } from '../components/Layout/Sidebar';
import { BottomMenu } from '../components/Layout/BottomMenu';

export const MainLayout = ({ user, isGuest, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isChatPage = location.pathname === '/bio-ai';

  return (
    <div className="h-[100dvh] w-full flex flex-col relative overflow-hidden bg-slate-950">
      
      {/* Navbar - Fixed at the top */}
      <div className="relative z-30 flex-none">
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isDark={true}
          user={user}
          isGuest={isGuest}
          onLogout={onLogout}
        />
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile Bottom Navigation (faqat kichik ekranlarda) */}
      <BottomMenu />
      
      {/* Main content - Scrollable Area */}
      <main className={`flex-1 min-h-0 relative z-10 w-full lg:pl-64 flex flex-col ${isChatPage ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
        <Outlet />
      </main>
    </div>
  );
};
