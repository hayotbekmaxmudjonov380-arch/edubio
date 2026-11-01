import React, { useState } from 'react';
import { Book, Download, Search, Filter, CheckCircle, FileText, Star } from 'lucide-react';
import { PlaceholderPage } from '../components/PlaceholderPage';
import { useSystem, useSubject } from '../context/SystemContext';

// --- Mock Data: Biology Textbooks ---
const LIBRARY_BOOKS = [
  {
    id: 'bio-5',
    title: 'Biologiya',
    subtitle: 'Botanika asoslari',
    grade: 5,
    author: 'A. Zikiryayev, A. Toxtayev',
    coverColor: 'bg-emerald-600',
    year: 2020,
    size: '12.4 MB',
    isDownloaded: false
  },
  {
    id: 'bio-6',
    title: 'Biologiya',
    subtitle: 'Botanika',
    grade: 6,
    author: 'O. Pratov, T. Shoyqulov',
    coverColor: 'bg-green-700',
    year: 2021,
    size: '14.2 MB',
    isDownloaded: true
  },
  {
    id: 'bio-7',
    title: 'Biologiya',
    subtitle: 'Zoologiya',
    grade: 7,
    author: 'A. Gafurov, K. Nishonboyev',
    coverColor: 'bg-orange-600',
    year: 2022,
    size: '18.5 MB',
    isDownloaded: false
  },
  {
    id: 'bio-8',
    title: 'Biologiya',
    subtitle: 'Odam va uning salomatligi',
    grade: 8,
    author: 'B. Aminov, T. Tilovov',
    coverColor: 'bg-red-600',
    year: 2019,
    size: '22.1 MB',
    isDownloaded: false
  },
  {
    id: 'bio-9',
    title: 'Biologiya',
    subtitle: 'Hujayra va organizm',
    grade: 9,
    author: 'A. Zikiryayev',
    coverColor: 'bg-indigo-600',
    year: 2020,
    size: '15.8 MB',
    isDownloaded: false
  },
  {
    id: 'bio-10',
    title: 'Biologiya',
    subtitle: 'Umumiy biologiya',
    grade: 10,
    author: 'A. Gafurov, A. Abdukarimov',
    coverColor: 'bg-blue-700',
    year: 2022,
    size: '25.4 MB',
    isDownloaded: true
  },
  {
    id: 'bio-11',
    title: 'Biologiya',
    subtitle: 'Umumiy biologiya',
    grade: 11,
    author: 'E. Xolmatov, N. Taylaqov',
    coverColor: 'bg-slate-700',
    year: 2023,
    size: '28.0 MB',
    isDownloaded: false
  },
  // Extra practice books
  {
    id: 'test-1',
    title: 'DTM Testlar',
    subtitle: "Biologiya fanidan to'plam",
    grade: 11,
    author: 'Davlat Test Markazi',
    coverColor: 'bg-purple-600',
    year: 2024,
    size: '5.2 MB',
    isDownloaded: false
  },
  {
    id: 'lab-1',
    title: 'Laboratoriya',
    subtitle: "Amaliy mashg'ulotlar daftari",
    grade: 7,
    author: 'EduBio Team',
    coverColor: 'bg-teal-600',
    year: 2023,
    size: '3.1 MB',
    isDownloaded: false
  },
  {
    id: 'bio-extra',
    title: 'Biologiya',
    subtitle: 'Genetika Masalalari',
    grade: 10,
    author: 'M. M. Musayev',
    coverColor: 'bg-rose-600',
    year: 2023,
    size: '8.5 MB',
    isDownloaded: false
  }
];

export const LibraryPage = () => {
  const system = useSystem();
  const subject = useSubject();

  // INSTITUT TIZIMI — hozircha bo'sh bo'lim (dizayn maktab tizimi bilan bir xil)
  if (system === 'institute') {
    return (
      <PlaceholderPage
        title={`${subject?.title || 'Fan'} kutubxonasi`}
        description={`Institut tizimi uchun ${subject?.title?.toLowerCase() || 'fan'} kutubxonasi hozir to'ldirilmoqda. Tez orada darsliklar va adabiyotlar shu yerda bo'ladi.`}
      />
    );
  }

  return <SchoolLibraryPage />;
};

// MAKTAB TIZIMI — avvalgi barcha kontent saqlangan (hech narsa o'chmagan)
const SchoolLibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  // Filter logic
  const filteredBooks = LIBRARY_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || book.grade === selectedGrade;
    
    return matchesSearch && matchesGrade;
  });

  const handleDownload = (id) => {
    setDownloadingIds(prev => new Set(prev).add(id));
    
    // Simulate download
    setTimeout(() => {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      alert("Kitob muvaffaqiyatli yuklab olindi (Simulyatsiya)");
    }, 1500);
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2670&auto=format&fit=crop" 
          alt="Library Background" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay for readability - Removed blur and reduced opacity */}
        <div className="absolute inset-0 bg-slate-900/30"></div>
      </div>

      {/* Main Scrollable Content */}
      <div className="relative z-10 w-full h-full overflow-y-auto p-4 md:p-8 pb-24">
        
        {/* Header Section */}
        <div className="max-w-[1400px] mx-auto mb-8 flex flex-col items-center text-center">
          <div className="bg-black/45 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 md:px-8 md:py-5">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3 drop-shadow-md">
              <Book className="w-8 h-8 md:w-10 md:h-10 text-teal-400" />
              Kutubxona
            </h1>
            <p className="text-gray-200 text-sm md:text-lg font-medium drop-shadow-sm max-w-2xl">
              Maktab darsliklari, qo'llanmalar va testlar to'plami.
            </p>
          </div>
        </div>

        {/* Controls: Search & Filter */}
        <div className="max-w-[1400px] mx-auto mb-8 space-y-4 flex flex-col items-center">
          
          {/* Search Bar - Glassmorphism */}
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Kitob nomi, muallif yoki mavzu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/20 shadow-lg focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-all text-gray-800"
            />
          </div>

          {/* Grade Filters */}
          <div className="w-full max-w-lg grid grid-cols-4 sm:flex sm:flex-wrap sm:justify-center gap-2">
            <button
               onClick={() => setSelectedGrade('all')}
               className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-xs backdrop-blur-md col-span-4 sm:col-auto ${
                 selectedGrade === 'all' 
                   ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-105' 
                   : 'bg-white/20 text-white border border-white/20 hover:bg-white/30'
               }`}
            >
              <Filter size={16} /> Barchasi
            </button>
            
            {[5, 6, 7, 8, 9, 10, 11].map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-2.5 rounded-full font-bold transition-all whitespace-nowrap text-xs backdrop-blur-md flex items-center justify-center ${
                  selectedGrade === grade 
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-105' 
                    : 'bg-white/20 text-white border border-white/20 hover:bg-white/30'
                }`}
              >
                {grade}-sinf
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:bg-white transition-all duration-300 group flex flex-col">
                
                {/* Book Cover Design */}
                <div className={`relative w-full aspect-[3/4] ${book.coverColor} rounded-lg shadow-inner mb-3 flex flex-col justify-between p-3 overflow-hidden group-hover:shadow-lg transition-shadow`}>
                  {/* Decorative Elements on Cover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl -ml-8 -mb-8"></div>
                  
                  <div className="relative z-10">
                    <span className="inline-block px-1.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded border border-white/10">
                      {book.grade}-SINF
                    </span>
                  </div>

                  <div className="relative z-10 text-center">
                    <h3 className="text-lg md:text-xl font-black text-white tracking-tight uppercase drop-shadow-md leading-tight">{book.title}</h3>
                    <p className="text-white/90 text-[10px] md:text-xs font-medium mt-1 line-clamp-2">{book.subtitle}</p>
                  </div>

                  <div className="relative z-10 flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/10">
                      <FileText size={16} />
                    </div>
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex-1 flex flex-col">
                  <div className="mb-2">
                    <h4 className="font-bold text-gray-800 text-xs md:text-sm line-clamp-1" title={book.subtitle}>{book.subtitle}</h4>
                    <p className="text-gray-500 text-[10px] md:text-xs mt-0.5 line-clamp-1">{book.author}</p>
                  </div>

                  <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                     <div className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                       {book.size}
                     </div>
                     
                     <button
                      onClick={() => handleDownload(book.id)}
                      disabled={downloadingIds.has(book.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md font-medium text-[10px] md:text-xs transition-all ${
                        book.isDownloaded 
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          : downloadingIds.has(book.id)
                            ? 'bg-gray-100 text-gray-400 cursor-wait'
                            : 'bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white border border-teal-200'
                      }`}
                     >
                       {downloadingIds.has(book.id) ? (
                         'Yuklanmoqda...'
                       ) : book.isDownloaded ? (
                         <>
                           <CheckCircle size={12} /> O'qish
                         </>
                       ) : (
                         <>
                           <Download size={12} /> Yuklash
                         </>
                       )}
                     </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-white/50" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Hech narsa topilmadi</h3>
              <p className="text-white/60 text-sm">Qidiruv so'zini o'zgartirib ko'ring yoki boshqa sinfni tanlang.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
