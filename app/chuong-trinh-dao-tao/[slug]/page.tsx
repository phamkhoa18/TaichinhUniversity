import React from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import TeamSection from '@/app/components/TeamSection';
import ConsultationSection from '@/app/components/ConsultationSection';
import { Download, Printer, ZoomIn, ZoomOut, FileText, Maximize2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db/mongodb';
import TrainingProgram from '@/models/TrainingProgram';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await connectToDatabase();
  const { slug } = await params;

  const program = await TrainingProgram.findOne({
    slug,
    status: 'PUBLISHED'
  }).lean();

  if (!program) {
    return {
      title: 'Không tìm thấy chương trình | Trường Đại học Tài chính',
      description: 'Chương trình đào tạo không tồn tại hoặc đã bị gỡ.'
    };
  }

  const title = `${program.name} | Chương trình đào tạo Đại học Tài chính`;
  const description = program.heroDescription || `Chi tiết chương trình đào tạo ${program.name} tại Trường Đại học Tài chính.`;
  const defaultImage = "https://images.unsplash.com/photo-1541888081688-deba5d2d4153?q=80&w=2500&auto=format&fit=crop";
  const image = program.thumbnail || program.heroBg || defaultImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'vi_VN',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: program.name,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}

export default async function TrainingProgramDetail({ params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();
  const { slug } = await params;

  const program = await TrainingProgram.findOne({
    slug,
    status: 'PUBLISHED'
  }).populate('level', 'name').lean() as any;

  if (!program) {
    notFound();
  }

  // Helper defaults
  const bgImgDefault = "https://images.unsplash.com/photo-1541888081688-deba5d2d4153?q=80&w=2500&auto=format&fit=crop";

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      <Header />

      {/* ──────────────────────────────────
          1. HERO BANNER — Compact & Refined
      ────────────────────────────────── */}
      <section className="relative w-full h-[60vh] min-h-[450px] flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <img
            src={program.heroBg || bgImgDefault}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001024]/90 via-[#001024]/35 to-[#001024]/10" />
          <div className="absolute inset-0 bg-[#002f54]/15 mix-blend-multiply" />
        </div>

        <div className="vlu-news-container mx-auto lg:px-0 md:max-w-[70%] z-10 pb-16 ml-0 md:ml-[10%] px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd200] animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/90">{program.level?.name || program.level || 'Chương trình đào tạo'}</span>
          </div>
          <h1 className="text-4xl md:text-[52px] font-extrabold text-white mb-4 leading-[1.1] drop-shadow-lg tracking-tight">
            {program.name}
          </h1>
          <p className="text-white/80 text-[16px] md:text-[18px] font-light leading-relaxed max-w-2xl">
            {program.heroDescription || "Khoa tự hào khi là một trong những khoa lớn, có sức hút với tính chất đặc thù trong chương trình đào tạo..."}
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none transform translate-y-px">
          <svg className="relative block w-[calc(100%+1.3px)] h-[30px] md:h-[40px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,155.67,122.2,208,103.54,231.25,95.14,277.62,64.29,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* ──────────────────────────────────
          2. GIỚI THIỆU CHUNG — Refined
      ────────────────────────────────── */}
      <section className="py-16 bg-white relative">
        <div className="absolute top-0 right-0 w-[40%] h-[75%] bg-gradient-to-bl from-slate-50/80 to-transparent -z-10 rounded-bl-[80px]"></div>

        <div className="vlu-news-container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">

            <div className="lg:w-[55%]">
              <h2 className="text-[32px] md:text-[38px] font-bold mb-4 text-slate-800 leading-[1.15]">
                Giới thiệu <span className="text-[#005496]">chung</span>
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#e9202a] to-[#005496] mb-6 rounded-full"></div>
              <p className="text-[15px] text-slate-600 leading-[1.8] mb-8 font-normal pr-4 whitespace-pre-wrap">
                {program.overviewDesc || "Đang cập nhật giới thiệu..."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Info Card 1 — Mã Ngành */}
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group border-l-[3px] border-l-[#005496]">
                  <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-[0.12em] mb-1">Mã Ngành</h3>
                  <p className="text-[#005496] font-extrabold text-lg group-hover:text-[#e9202a] transition-colors leading-tight">{program.programCode || '---'}</p>
                </div>

                {/* Info Card 2 — Văn Bằng */}
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group border-l-[3px] border-l-[#e9202a]">
                  <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-[0.12em] mb-1">Văn Bằng</h3>
                  <p className="text-slate-800 font-extrabold text-[15px] leading-tight">{program.degreeIssued || program.name}</p>
                </div>

                {/* Info Card 3 — Thời gian */}
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group border-l-[3px] border-l-[#ffd200]">
                  <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-[0.12em] mb-1">Thời gian</h3>
                  <p className="text-slate-800 font-extrabold text-lg leading-tight">{program.duration || '---'}</p>
                </div>
              </div>

              <div className="mt-3 px-4 py-2.5 bg-gradient-to-r from-[#005496]/[0.04] to-transparent rounded-lg border-l-[3px] border-l-[#005496]/30">
                <p className="text-[12px] text-slate-500 font-medium">Áp dụng hệ đào tạo <span className="text-[#005496] font-bold">{program.type}</span></p>
              </div>
            </div>

            <div className="lg:w-[45%] relative hidden md:block">
              <div className="relative h-[450px] flex items-center justify-center">
                {/* Decorative dot pattern */}
                <div className="absolute -top-3 -right-3 w-20 h-20 opacity-[0.05] z-0"
                  style={{ backgroundImage: 'radial-gradient(circle, #005496 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }}></div>

                <div className="absolute top-0 right-0 w-[82%] h-[72%] rounded-2xl overflow-hidden shadow-2xl z-10 group">
                  <img
                    src={program.overviewImgMain || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop"}
                    alt="Overview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#005496]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="absolute bottom-4 left-0 w-[52%] h-[42%] rounded-xl overflow-hidden shadow-2xl z-20 border-4 border-white group">
                  <img
                    src={program.overviewImgSub || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop"}
                    alt="Overview Sub"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>

                {/* Floating accent badge */}
                <div className="absolute bottom-0 right-4 bg-[#005496] text-white rounded-xl px-4 py-2.5 z-30 shadow-lg shadow-[#005496]/25 flex items-center gap-2">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                  <span className="text-[12px] font-bold">Chất lượng cao</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────
          3. ĐẶC ĐIỂM NỔI BẬT
      ────────────────────────────────── */}
      {program.featureCards && program.featureCards.length > 0 && (
        <section
          className="pt-20 pb-12 relative overflow-visible bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url('${program.featuresBg || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop'}')` }}
        >
          <div className="absolute inset-0 bg-[#002f54]/90 backdrop-blur-[2px]"></div>

          <div className="vlu-news-container mx-auto px-4 md:px-8 max-w-[1200px] relative z-10">
            <div className="max-w-2xl text-white mb-16 md:mb-20">
              <h2 className="text-[36px] font-bold mb-6 leading-tight drop-shadow-sm">
                Đặc điểm nổi bật của<br /> chương trình đào tạo
              </h2>
              <p className="text-[18px] opacity-90 leading-relaxed font-light whitespace-pre-wrap">
                {program.featuresDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mt-0 md:-mb-32">
              {program.featureCards.map((card: any, idx: number) => (
                <div key={idx} className={`bg-white p-6 md:p-7 shadow-xl rounded-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${idx === 1 ? 'md:mt-10' : idx === 2 ? 'md:mt-20' : ''}`}>
                  <h3 className="text-[20px] font-bold text-slate-800 leading-tight mb-4">{card.title}</h3>
                  <div className="w-10 h-0.5 bg-[#e9202a] mb-4"></div>
                  <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {program.featureCards && program.featureCards.length > 0 ? (
        <div className="h-20 md:h-24 bg-white w-full"></div>
      ) : null}

      {/* ──────────────────────────────────
          4. NĂNG LỰC ĐẦU RA 
      ────────────────────────────────── */}
      {program.outcomeSkills && program.outcomeSkills.length > 0 && (
        <section className="py-20 bg-white relative overflow-visible">
          <div className="absolute top-[10%] right-[calc(33.333%+2rem)] w-px h-[180%] bg-gradient-to-b from-transparent via-[#005496]/30 to-[#005496]/5 hidden lg:block z-0 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-1/3 h-[180%] bg-slate-50/70 skew-x-[-15deg] transform origin-top-right hidden lg:block z-0 pointer-events-none"></div>

          <div className="vlu-news-container mx-auto px-4 md:px-8 max-w-[1200px] relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

              <div className="lg:w-5/12 lg:sticky lg:top-32 relative">
                <div className="absolute -left-10 -top-16 text-[120px] font-black text-slate-100 opacity-60 leading-none select-none z-0 tracking-tighter">
                  SKILLS
                </div>
                <div className="relative z-10">
                  <h2 className="text-[40px] md:text-[46px] font-bold text-slate-800 mb-6 leading-[1.15]">
                    Năng lực đầu ra<br />
                    <span className="text-[#005496] font-light">của học viên</span>
                  </h2>
                  <div className="w-20 h-1.5 bg-[#e9202a] mb-8"></div>
                  <p className="text-[17px] text-slate-600 mb-10 leading-relaxed font-normal whitespace-pre-wrap">
                    {program.outcomesDesc}
                  </p>
                  <div className="rounded-2xl overflow-hidden shadow-2xl relative group">
                    <div className="absolute inset-0 bg-[#005496]/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img
                      src={program.outcomesImage || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop"}
                      alt="Focus & Outcome"
                      className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:w-7/12 space-y-12 mt-16 lg:mt-6">
                {program.outcomeSkills.map((sk: any, idx: number) => (
                  <React.Fragment key={idx}>
                    <div className="relative pl-0 md:pl-28 group">
                      <div className="hidden md:block absolute left-0 top-[-10px] font-black text-[70px] text-slate-200 group-hover:text-[#e9202a]/20 transition-colors duration-500 leading-none select-none italic">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-[26px] font-bold text-slate-800 group-hover:text-[#005496] transition-colors mb-4">{sk.title}</h3>
                      <p className="text-slate-600 text-[17px] leading-relaxed whitespace-pre-wrap">
                        {sk.desc}
                      </p>
                    </div>
                    {idx < program.outcomeSkills.length - 1 && <div className="w-full h-px bg-slate-200/80"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────
          5. TRIỂN VỌNG NGHỀ NGHIỆP
      ────────────────────────────────── */}
      {program.careerItems && program.careerItems.length > 0 && (
        <section className="py-20 bg-slate-50 relative">
          <div className="vlu-news-container mx-auto px-4 md:px-8 max-w-[1200px]">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-[36px] font-bold text-slate-800 mb-4">
                Triển vọng <span className="text-[#005496]">Nghề nghiệp</span>
              </h2>
              <div className="w-16 h-1 bg-[#e9202a] mx-auto mb-6"></div>
              <p className="text-[17px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                {program.careersDesc}
              </p>
            </div>

            <div className="flex flex-col md:flex-row h-[800px] md:h-[500px] w-full gap-4">
              {program.careerItems.map((career: any, idx: number) => (
                <div key={idx} className="group relative flex-1 hover:flex-[2.5] transition-all duration-700 ease-in-out cursor-pointer overflow-hidden rounded-2xl shadow-md">
                  <img src={career.image || "https://images.unsplash.com/photo-1541888081688-deba5d2d4153?q=80&w=800&auto=format&fit=crop"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={career.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002f54]/95 via-[#002f54]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="absolute bottom-0 left-0 p-6 flex flex-col justify-end w-full h-full">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 text-white transform group-hover:-translate-y-2 transition-transform duration-500">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <h3 className="text-white font-bold text-[20px] md:text-[24px] leading-tight mb-0 group-hover:mb-3 transition-all duration-500 break-words">{career.title}</h3>
                    <div className="max-h-0 opacity-0 group-hover:max-h-[120px] group-hover:opacity-100 transition-all duration-700 overflow-hidden ease-in-out">
                      <p className="text-white/90 text-[14px] leading-relaxed w-full break-words whitespace-pre-wrap">
                        {career.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────
          6. CẤU TRÚC CHƯƠNG TRÌNH HỌC 
      ────────────────────────────────── */}
      <section className="py-20 bg-[#3572b0] relative overflow-hidden">
        <div className="absolute bottom-[-50px] left-[-50px] opacity-30 select-none pointer-events-none">
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
            <circle cx="50" cy="250" r="100" stroke="white" strokeWidth="12" fill="none" />
            <circle cx="50" cy="250" r="140" stroke="white" strokeWidth="12" fill="none" />
            <circle cx="50" cy="250" r="180" stroke="white" strokeWidth="12" fill="none" />
            <circle cx="50" cy="250" r="220" stroke="white" strokeWidth="12" fill="none" />
          </svg>
        </div>

        <div className="vlu-news-container mx-auto px-4 md:px-8 max-w-[1100px] relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            <div className="lg:w-1/3 flex flex-col justify-start pt-4">
              <h2 className="text-[32px] md:text-[38px] font-bold text-white mb-5 leading-[1.2]">
                Cấu trúc chương<br /> trình học
              </h2>
              {program.curriculumDesc ? (
                <div
                  className="text-white/90 text-[15px] leading-relaxed pr-4 prose prose-invert prose-p:mb-2 prose-a:text-[#ffd200] max-w-none jodit-content-render"
                  dangerouslySetInnerHTML={{ __html: program.curriculumDesc }}
                />
              ) : (
                <p className="text-white/90 text-[15px] leading-relaxed pr-4 whitespace-pre-wrap">
                  Chương trình đào tạo thực hiện theo lộ trình chi tiết. Mời bạn xem tài liệu cung cấp bên cạnh định dạng PDF chuẩn.
                </p>
              )}
            </div>

            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-white/20 flex flex-col ring-1 ring-black/5">
                <div className="bg-[#f0f0f0] border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                  {/* Mac buttons */}
                  <div className="flex items-center gap-2 w-1/3">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                  </div>
                  <div className="w-1/3 flex justify-center text-slate-500 font-bold text-xs truncate uppercase tracking-widest hidden sm:flex">
                    Curriculum.pdf
                  </div>
                  <div className="w-1/3 flex justify-end">
                    {program.curriculumPdfUrl && (
                      <a href={program.curriculumPdfUrl} download target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white bg-slate-800 px-4 py-1.5 rounded text-[13px] font-bold hover:bg-[#e9202a] transition-all shadow-sm">
                        <Download className="w-4 h-4" /> Tải PDF
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-slate-200/80 h-[550px] overflow-hidden w-full relative flex justify-center">
                  {program.curriculumPdfUrl ? (
                    <iframe src={program.curriculumPdfUrl} className="w-full h-full border-0 absolute inset-0" title="PDF Viewer" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-10 h-full text-center">
                      <FileText className="w-12 h-12 text-slate-400 mb-4" />
                      <p className="text-slate-500 font-bold">Chưa cập nhật tài liệu học phần</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <TeamSection /> */}

      {/* ──────────────────────────────────
          7. LIÊN HỆ TƯ VẤN (FORM)
      ────────────────────────────────── */}
      <ConsultationSection />

      <Footer />
    </div>
  );
}
