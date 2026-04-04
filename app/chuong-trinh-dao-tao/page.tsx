'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GraduationCap, Building2, BookOpen, ArrowRight, LibraryBig } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TrainingProgramsClientPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    level: 'Tất cả',
    type: 'Tất cả',
    faculty: 'Tất cả'
  });

  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/public/training/programs')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPrograms(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleFilterChange = (categoryId: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const dynamicFilterConfig = useMemo(() => {
    return [
      {
        id: 'level',
        title: 'Bậc đào tạo',
        icon: GraduationCap,
        options: ['Tất cả', ...Array.from(new Set(programs.map(p => p.level))).filter(Boolean)]
      },
      {
        id: 'type',
        title: 'Loại hình',
        icon: BookOpen,
        options: ['Tất cả', ...Array.from(new Set(programs.map(p => p.type))).filter(Boolean)]
      },
      {
        id: 'faculty',
        title: 'Khoa / Viện',
        icon: Building2,
        options: ['Tất cả', ...Array.from(new Set(programs.map(p => p.faculty))).filter(Boolean)]
      }
    ];
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    return programs.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLevel = filters.level === 'Tất cả' || p.level === filters.level;
      const matchType = filters.type === 'Tất cả' || p.type === filters.type;
      const matchFaculty = filters.faculty === 'Tất cả' || p.faculty === filters.faculty;
      
      return matchSearch && matchLevel && matchType && matchFaculty;
    });
  }, [filters, searchQuery, programs]);

  return (
    <div className="bg-[#f8f9fb] min-h-screen selection:bg-[#005496]/20 selection:text-[#005496]">
      <Header />

      {/* ──────────────────────────────────
          HERO BANNER - CINEMATIC ACADEMIC
      ────────────────────────────────── */}
      <div className="relative pt-24 pb-24 lg:pt-28 lg:pb-32 overflow-hidden flex items-center justify-center">
        {/* Full Image Background with parallax effect via CSS */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2500&auto=format&fit=crop')" }}
        />
        
        {/* Complex Gradient Overlays for Depth */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#001024]/90 via-[#002f54]/70 to-[#005496]/95"></div>
        <div className="absolute inset-0 z-0 bg-[#005496]/40 mix-blend-multiply"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10 flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 shadow-[0_0_20px_rgba(0,0,0,0.2)]"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#ffd200] animate-pulse"></span>
            <span className="text-[12px] font-bold tracking-[0.1em] text-white uppercase">Sự nghiệp & Tương lai</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-[46px] font-black text-white text-center leading-[1.2] tracking-tight mb-4 drop-shadow-2xl"
          >
            Chương Trình Đào Tạo <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffd200] to-white relative inline-block mt-1">
              Chất Lượng Cao
              <svg className="absolute w-full h-2.5 -bottom-0.5 left-0 text-[#ffd200] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 15 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-50/90 max-w-xl text-center text-sm md:text-base font-light leading-relaxed mb-2 shadow-black/50"
          >
            Khám phá lộ trình học tập đa dạng, tích hợp thực tiễn, định hình năng lực cốt lõi giúp bạn tự tin làm chủ sự nghiệp toàn cầu.
          </motion.p>

        </div>

        {/* Bottom wave/shape divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none transform translate-y-px">
          <svg className="relative block w-[calc(100%+1.3px)] h-[35px] md:h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,155.67,122.2,208,103.54,231.25,95.14,277.62,64.29,321.39,56.44Z" className="fill-[#f8f9fb]"></path>
          </svg>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 max-w-7xl -mt-16 relative z-20 pb-24">
        
        {/* Floating Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 md:p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative w-full lg:flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-2 focus:ring-[#005496] focus:border-[#005496] block pl-11 pr-4 py-3.5 transition-all outline-none"
                placeholder="Tìm kiếm ngành học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="hidden lg:block w-px h-10 bg-slate-200 mx-2"></div>

            {/* Dynamic Filters */}
            <div className="w-full lg:w-auto grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
              {dynamicFilterConfig.map((filter) => {
                const Icon = filter.icon;
                return (
                  <div key={filter.id} className="relative w-full">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                      <Icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <Select
                      value={filters[filter.id as keyof typeof filters]}
                      onValueChange={(val) => handleFilterChange(filter.id, val)}
                    >
                      <SelectTrigger className="w-full lg:w-44 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-[#005496] focus:border-[#005496] pl-9 pr-4 h-[50px] hover:bg-slate-50 transition-colors font-medium outline-none">
                        <SelectValue placeholder={filter.title} />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((opt: any) => (
                          <SelectItem key={opt} value={opt} className="text-slate-900 font-medium cursor-pointer">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>

          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Danh sách chương trình
          </h2>
          <span className="bg-[#005496]/10 text-[#005496] px-4 py-1.5 rounded-full text-base font-bold">
            {loading ? 'Đang tải...' : `${filteredPrograms.length} kết quả`}
          </span>
        </div>

        {loading ? (
             <div className="py-24 flex justify-center items-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005496]"></div>
             </div>
        ) : (
          <>
            {/* Cinematic Grid Courses - Netflix Style Tiles */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              <AnimatePresence mode='popLayout'>
                {filteredPrograms.map((prog, idx) => (
                  <motion.div
                    key={prog.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Link href={`/chuong-trinh-dao-tao/${prog.slug}`} className="block h-full group/card focus:outline-none">
                      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden flex flex-col justify-end shadow hover:shadow-xl transition-all duration-500 transform group-hover/card:-translate-y-1">
                        
                        {/* Full Background Image */}
                        <img
                          src={prog.thumbnail}
                          alt={prog.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover/card:scale-[1.08]"
                        />
                        
                        {/* Cinematic Overlay Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001024]/95 via-[#001024]/40 to-[#001024]/0 opacity-90 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-[#005496]/40 mix-blend-multiply opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                        {/* Content Top: Faculty Badge */}
                        <div className="absolute top-4 left-4 z-10 w-full pr-8">
                           <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-widest text-white/95 bg-black/30 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                             {prog.faculty}
                           </span>
                        </div>

                        {/* Content Bottom */}
                        <div className="relative z-10 p-5 pt-12 w-full transform transition-transform duration-500 translate-y-2 group-hover/card:translate-y-0">
                          
                          {/* Title */}
                          <h3 className="text-[17px] sm:text-lg font-bold text-white leading-[1.3] mb-4 tracking-tight drop-shadow-md line-clamp-3">
                            {prog.name}
                          </h3>

                          {/* Tags */}
                          <div className="flex flex-col gap-2 mb-5 opacity-80 group-hover/card:opacity-100 transition-opacity duration-500">
                            <span className="w-fit px-2.5 py-1 bg-white/10 backdrop-blur-md text-white/90 border border-white/10 rounded-md text-[11px] font-medium flex items-center gap-1.5">
                              <GraduationCap className="w-3.5 h-3.5"/>
                              {prog.degree}
                            </span>
                            <span className="w-fit px-2.5 py-1 bg-[#ffd200]/20 backdrop-blur-md text-[#ffd200] border border-[#ffd200]/20 rounded-md text-[11px] font-medium flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5"/>
                              {prog.type}
                            </span>
                          </div>

                          {/* Footer CTA */}
                          <div className="flex items-center justify-between text-white/70 group-hover/card:text-white transition-colors duration-400">
                            <span className="text-[11px] font-bold tracking-[0.15em] uppercase relative overflow-hidden group/text">
                               Chi tiết
                               <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#ffd200] transform -translate-x-full group-hover/card:translate-x-0 transition-transform duration-500 ease-out"></span>
                            </span>
                            <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-500 group-hover/card:bg-[#ffd200] group-hover/card:text-[#001024] group-hover/card:border-transparent">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>

                        </div>

                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredPrograms.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 border-dashed"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-slate-500 max-w-sm">Dọn bộ lọc hoặc thử từ khóa khác để xem danh sách đầy đủ nhé.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ level: 'Tất cả', type: 'Tất cả', faculty: 'Tất cả' });
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#005496] text-white font-semibold rounded-xl hover:bg-[#00437a] transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </motion.div>
            )}
          </>
        )}

      </main>

      <Footer />
    </div>
  );
}