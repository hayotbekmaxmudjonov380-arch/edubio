import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { Sidebar } from '../components/Layout/Sidebar';
import { BottomMenu } from '../components/Layout/BottomMenu';

export const MainLayout = ({ user, isGuest, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Show dark background on root path '/' and chat page '/bio-ai'
  const isHomePage = location.pathname === '/';
  const isChatPage = location.pathname === '/bio-ai';
  const isLessonsPage = location.pathname === '/lessons';
  const isLibraryPage = location.pathname === '/library';
  
  // Pages that should take up 100% height without scrolling the main container
  // This allows them to manage their own background images and scrolling
  const isImmersive = isHomePage || isChatPage || isLessonsPage || isLibraryPage;

  return (
    <div className={`h-[100dvh] w-full flex flex-col relative overflow-hidden ${isImmersive ? 'bg-black' : 'bg-gray-50'}`}>
      
      {/* Navbar - Fixed at the top */}
      <div className="relative z-30 flex-none">
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isDark={isImmersive}
          user={user}
          isGuest={isGuest}
          onLogout={onLogout}
        />
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile Bottom Navigation (faqat kichik ekranlarda) */}
      <BottomMenu />
      
      {/* Main content - Scrollable Area */}
      {/* For Immersive pages, we disable main scroll and remove padding so content takes full height */}
      <main className={`flex-1 relative z-10 w-full lg:pl-64 flex flex-col ${isImmersive ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
        <Outlet />
        
        {/* Footer padding for mobile ensuring content isn't hidden behind floating elements */}
        {/* Removed for Immersive pages to prevent black bars/white space at bottom */}
        {!isImmersive && <div className="h-16 lg:h-4 flex-none"></div>}
      </main>
    </div>
  );
};
