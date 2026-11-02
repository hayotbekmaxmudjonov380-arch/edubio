import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { LibraryPage } from './pages/LibraryPage';
import { BioAiPage } from './pages/BioAiPage';
import { LessonsPage } from './pages/LessonsPage';
import { LoginPage } from './pages/LoginPage';
import { SubjectPicker } from './pages/SubjectPicker';
import { FizLabLab } from './modules/fizlab/FizLabLab';
import { FizLabTeacher } from './modules/fizlab/FizLabTeacher';
import { SystemProvider, SubjectProvider } from './context/SystemContext';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  // 'school' — Maktab tizimi, 'institute' — Institut tizimi
  const [system, setSystem] = useState(() => localStorage.getItem('eduSystem') || 'school');
  // Institut tizimida tanlangan fan (Fizika, Matematika...)
  const [subject, setSubject] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('eduSubject')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // 1. Mehmon rejimini tekshirish
    const guestStored = localStorage.getItem('isGuest');
    if (guestStored === 'true') {
      setIsGuest(true);
    }

    // 2. Firebase (Google) orqali kirganligini tekshirish
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Kirish sahifasidagi kartochka tanlandi: Maktab yoki Institut tizimi
  const handleSystemSelect = (selectedSystem) => {
    setSystem(selectedSystem);
    localStorage.setItem('eduSystem', selectedSystem);
    setIsGuest(true);
    localStorage.setItem('isGuest', 'true');
    // Institut tizimini tanlasa, fan avvaldan tanlangan bo'lmasin
    if (selectedSystem === 'institute') {
      setSubject(null);
      localStorage.removeItem('eduSubject');
    }
  };

  // Institut tizimi: fan tanlandi
  const handleSubjectSelect = (selectedSubject) => {
    setSubject(selectedSubject);
    localStorage.setItem('eduSubject', JSON.stringify(selectedSubject));
  };

  // "Boshqa tizimni tanlash" tugmasi: kirish sahifasiga qaytish
  const handleBackToLogin = () => {
    setIsGuest(false);
    setSystem('school');
    setSubject(null);
    localStorage.removeItem('isGuest');
    localStorage.removeItem('eduSystem');
    localStorage.removeItem('eduSubject');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Chiqishda xatolik:", error);
    }
    setIsGuest(false);
    setSystem('school');
    setSubject(null);
    localStorage.removeItem('isGuest');
    localStorage.removeItem('eduSystem');
    localStorage.removeItem('eduSubject');
  };

  // FizLab AI lab tugaganda diagnostika natijasini qabul qilish
  const handleLabFinish = (diagnostic) => {
    if (!diagnostic) {
      // Orqaga qaytildi
      return;
    }
    console.log("FizLab diagnostika:", diagnostic);
    alert(
      `Diagnostika yakunlandi!\n\nIsm: ${diagnostic.name}\nRang: ${diagnostic.overallColor}\nXatolar: ${diagnostic.totalErrors}\n\n${diagnostic.aiText}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Agar foydalanuvchi tizimga kirmagan bo'lsa va mehmon ham bo'lmasa -> LOGIN SAHIFASI (2 ta kartochka)
  if (!user && !isGuest) {
    return <LoginPage onSystemSelect={handleSystemSelect} />;
  }

  // INSTITUT TIZIMI: fan hali tanlanmagan bo'lsa -> FANLAR TANLASH SAHIFASI
  if (system === 'institute' && !subject) {
    return <SubjectPicker onSelect={handleSubjectSelect} onBack={handleBackToLogin} />;
  }

  // Agar kirgan bo'lsa -> ASOSIY DASTUR (tanlangan tizim bilan)
  return (
    <SystemProvider value={system}>
      <SubjectProvider value={subject}>
        <Routes>
          <Route 
            path="/" 
            element={
              <MainLayout 
                user={user} 
                isGuest={isGuest} 
                onLogout={handleLogout} 
              />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="lessons" element={<LessonsPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="bio-ai" element={<BioAiPage />} />
            {/* FizLab AI — faqat Institut → Fizika bo'limida */}
            {system === 'institute' && subject?.id === 'fizika' && (
              <>
                <Route
                  path="fizlab-lab"
                  element={
                    <FizLabLab
                      studentName={user?.displayName || "O'quvchi"}
                      studentSid={user?.uid || 'guest-student'}
                      onFinish={handleLabFinish}
                    />
                  }
                />
                <Route
                  path="fizlab-teacher"
                  element={<FizLabTeacher onBack={handleBackToLogin} />}
                />
              </>
            )}
          </Route>
          {/* Noto'g'ri manzillar uchun qayta yo'naltirish */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SubjectProvider>
    </SystemProvider>
  );
}
