'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, ArrowDown, Menu, X, Phone, Mail,
  Landmark, Calculator, Cpu, BarChart3, Globe2, Scale,
  GraduationCap, Users, Briefcase, BookOpen,
  Award, Trophy, Target, Building2, ChevronRight, ChevronLeft,
  CalendarDays, Newspaper, Clock, Play, Pause,
  MapPin, Facebook, Youtube, Linkedin, Instagram,
  Star, School, Medal, CheckCircle2, Megaphone, ZoomIn
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import SchoolsSection from '@/app/components/SchoolsSection';
import CtaSection from '@/app/components/CtaSection';
import VideoHighlight from '@/app/components/VideoHighlight';
import ConsultationSection from '@/app/components/ConsultationSection';
import Chatbot from '@/app/components/Chatbot';

/* ─── Framer Motion ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

/* ─── Hero Slides ─── */
const heroSlides = [
  {
    image: '/images/hero-banner/1.png',
    mobileImage: '/images/hero-banner/banner-ads.jpg',
    title: 'NÂNG TẦM\nTRI THỨC',
    subtitle: 'Viện Đào tạo Sau Đại học UFM – Kiến tạo thế hệ lãnh đạo tài chính tương lai',
  }
];

/* ─── Achievements ─── */
const achievements = [
  {
    image: '/images/hero-campus.png',
    title: '9 chương trình Thạc sĩ và 3 chương trình Tiến sĩ đạt chuẩn kiểm định',
  },
  {
    image: '/images/students-library.png',
    title: 'Hệ thống số hóa toàn diện – Đào tạo kết hợp trực tiếp và trực tuyến',
  },
  {
    image: '/images/lecture-hall.png',
    title: 'Đội ngũ giảng viên 100% trình độ Tiến sĩ, Phó Giáo sư, Giáo sư',
  },
];

/* ─── Stats ─── */
const aboutStats = [
  { value: '5.000+', desc: 'học viên cao học và nghiên cứu sinh đang theo học' },
  { value: '12', desc: 'chương trình đào tạo Thạc sĩ và Tiến sĩ' },
  { value: '92%', desc: 'học viên thăng tiến trong vòng 1 năm sau tốt nghiệp' },
  { value: '150+', desc: 'đối tác doanh nghiệp và tổ chức quốc tế' },
];

/* ─── News Items (UFM Post-Graduate) ─── */
const featuredNews = {
  slug: 'tuyen-sinh-thac-si-dot-1-2026',
  tag: 'TUYỂN SINH SĐH',
  title: 'Thông báo tuyển sinh trình độ Thạc sĩ đợt 1 năm 2026 – Viện Đào tạo Sau Đại học UFM',
  image: '/images/hero-campus.png',
};

const sideNews = [
  {
    slug: 'tuyen-sinh-tien-si-2026',
    tag: 'TUYỂN SINH TIẾN SĨ',
    title: 'Thông báo về việc tuyển sinh trình độ Tiến sĩ đợt 1 năm 2026 – Chuyên ngành QTKD, TCNH, QLKT',
    image: '/images/students-library.png',
  },
  {
    slug: 'bao-ve-luan-an-tien-si-qtkd',
    tag: 'NGHIÊN CỨU KHOA HỌC',
    title: 'Hội đồng đánh giá Luận án Tiến sĩ cấp Viện – Chuyên ngành Quản trị Kinh doanh đợt 1/2026',
    image: '/images/lecture-hall.png',
  },
  {
    slug: 'hoi-thao-fintech-ai-2026',
    tag: 'HỌC THUẬT',
    title: 'Hội thảo khoa học quốc tế "Fintech, AI và Tài chính bền vững trong kỷ nguyên chuyển đổi số"',
    image: '/images/hero-campus.png',
  },
  {
    slug: 'uu-dai-hoc-phi-cuu-sv',
    tag: 'CHÍNH SÁCH ƯU ĐÃI',
    title: 'Giảm 10% học phí cho cựu sinh viên UFM – Cam kết ổn định học phí toàn khóa Thạc sĩ',
    image: '/images/students-library.png',
  },
];

const eventCards = [
  {
    slug: 'hop-tac-deloitte-2026',
    image: '/images/hero-campus.png',
    tag: 'Hội thảo Quốc tế',
    date: '16-05-26',
    title: 'Business Strategy & Sustainable Innovation – Nhịp cầu tri thức với chuyên gia toàn cầu',
  },
  {
    slug: 'bao-ve-luan-an-tien-si-qtkd',
    image: '/images/students-library.png',
    tag: 'Bảo vệ Luận án',
    date: '10-05-26',
    title: 'Hội đồng đánh giá Luận án Tiến sĩ cấp Viện đợt 1/2026 – Chuyên ngành Tài chính – Ngân hàng',
  },
  {
    slug: 'discovery-day-2026',
    image: '/images/lecture-hall.png',
    tag: 'Discovery Day',
    date: '04-05-26',
    title: 'Discovery Day 2026 – Trải nghiệm không gian học tập và giao lưu cùng Giảng viên, Cựu học viên',
  },
];

/* ─── Life at UFM photos ─── */
const lifePhotos = [
  { src: '/images/life/bg_ufm.jpg', alt: 'Khuôn viên Đại học Tài chính – Marketing' },
  { src: '/images/life/bg_ufm_2.jpg', alt: 'Hoạt động học thuật tại UFM' },
  { src: '/images/life/bg_ufm_3.jpg', alt: 'Không gian học tập hiện đại' },
  { src: '/images/life/bg_ufm_4.jpg', alt: 'Sinh hoạt học viên Sau Đại học' },
  { src: '/images/life/bg_ufm_5.jpg', alt: 'Sự kiện và hội thảo khoa học' },
  { src: '/images/life/bg_ufm_6.jpg', alt: 'Lễ tốt nghiệp Thạc sĩ UFM' },
];

/* ─── Programs ─── */
const programs = [
  { icon: <Landmark size={28} />, title: 'Tài chính – Ngân hàng', desc: 'Chuyên gia phân tích tài chính, quản trị rủi ro và đầu tư cấp cao.' },
  { icon: <BarChart3 size={28} />, title: 'Quản trị Kinh doanh', desc: 'Tư duy chiến lược, lãnh đạo đổi mới trong môi trường kinh doanh toàn cầu.' },
  { icon: <Calculator size={28} />, title: 'Kế toán', desc: 'Nghiên cứu chuyên sâu về kiểm toán, kế toán quản trị và chuẩn mực quốc tế.' },
  { icon: <Globe2 size={28} />, title: 'Kinh doanh Quốc tế', desc: 'Quản trị chuỗi cung ứng và chiến lược kinh doanh xuyên biên giới.' },
  { icon: <Scale size={28} />, title: 'Luật Kinh tế', desc: 'Chuyên gia pháp lý tài chính, chứng khoán và quản trị doanh nghiệp.' },
  { icon: <Cpu size={28} />, title: 'Marketing', desc: 'Chiến lược thương hiệu, marketing số và phân tích hành vi người tiêu dùng.' },
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const [achSlide, setAchSlide] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <>
      <Header />

      {/* ══════════════════════  HERO – Image Only Slideshow  ══════════════════════ */}
      <section className="hero-banner">
        <div className="hero-slider">
          {heroSlides.map((slide, idx) => (
            <div key={idx} className={`hero-slide ${idx === current ? 'active' : ''}`}>
              <Image src={slide.image} alt="" fill sizes="100vw" className="hero-slide-img hero-desktop-img" priority={idx === 0} />
              {slide.mobileImage && (
                <Image src={slide.mobileImage} alt="" width={1120} height={970} className="hero-slide-img hero-mobile-img" style={{ width: '100%', height: 'auto', objectFit: 'unset', transform: 'none' }} priority={idx === 0} />
              )}
            </div>
          ))}
        </div>

        {/* Prev / Next */}
        <button
          className="hero-arrow hero-arrow-prev"
          onClick={() => setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          aria-label="Previous"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          className="hero-arrow hero-arrow-next"
          onClick={() => setCurrent((prev) => (prev + 1) % heroSlides.length)}
          aria-label="Next"
        >
          <ChevronRight size={28} />
        </button>

        {/* Dots */}
        <div className="hero-dots">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === current ? 'active' : ''}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════  NEWS TICKER  ══════════════════════ */}
      <div className="news-ticker">
        <div className="news-ticker-label">
          <Megaphone size={18} fill="currentColor" />
          <span>TIN MỚI</span>
        </div>
        <div className="news-ticker-track">
          <div className="news-ticker-scroll">
            <a href="#" className="news-ticker-item">
              <span className="news-ticker-date">15/03</span>
              <span className="news-ticker-text">Thông báo tuyển sinh trình độ Thạc sĩ đợt 1 năm 2026 – Viện Đào tạo Sau Đại học UFM</span>
            </a>
            <span className="news-ticker-sep"></span>
            <a href="#" className="news-ticker-item">
              <span className="news-ticker-date">12/03</span>
              <span className="news-ticker-text">Thông báo tuyển sinh trình độ Tiến sĩ đợt 1 năm 2026 – Chuyên ngành QTKD, TCNH, QLKT</span>
            </a>
            <span className="news-ticker-sep"></span>
            <a href="#" className="news-ticker-item">
              <span className="news-ticker-date">08/03</span>
              <span className="news-ticker-text">Lịch bảo vệ Luận văn Thạc sĩ và Luận án Tiến sĩ tháng 4/2026</span>
            </a>
            <span className="news-ticker-sep"></span>
            <a href="#" className="news-ticker-item">
              <span className="news-ticker-date">05/03</span>
              <span className="news-ticker-text">Giảm 10% học phí dành cho cựu sinh viên UFM đăng ký học Thạc sĩ đợt 1/2026</span>
            </a>
            <span className="news-ticker-sep"></span>
            {/* duplicate for seamless loop */}
            <a href="#" className="news-ticker-item">
              <span className="news-ticker-date">15/03</span>
              <span className="news-ticker-text">Thông báo tuyển sinh trình độ Thạc sĩ đợt 1 năm 2026 – Viện Đào tạo Sau Đại học UFM</span>
            </a>
            <span className="news-ticker-sep"></span>
            <a href="#" className="news-ticker-item">
              <span className="news-ticker-date">12/03</span>
              <span className="news-ticker-text">Thông báo tuyển sinh trình độ Tiến sĩ đợt 1 năm 2026 – Chuyên ngành QTKD, TCNH, QLKT</span>
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════  TRA CỨU THÔNG TIN (MINIMAL)  ══════════════ */}
      {/* <section className="qsearch-section">
        <div className="vlu-news-container">
          <motion.div
            className="qsearch-inner"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <h2 className="qsearch-title">Bạn đang tìm kiếm điều gì?</h2>

            <div className="qsearch-bar">
              <Search size={18} className="qsearch-icon" />
              <input type="text" placeholder="Tìm chương trình, thông tin tuyển sinh, điểm thi..." />
              <button className="qsearch-btn" aria-label="Tìm kiếm">
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="qsearch-links">
              {[
                { icon: <GraduationCap size={15} />, text: 'Thạc sĩ' },
                { icon: <Award size={15} />, text: 'Tiến sĩ' },
                { icon: <BookOpen size={15} />, text: 'Điểm thi' },
                { icon: <Target size={15} />, text: 'Tuyển sinh' },
                { icon: <CalendarDays size={15} />, text: 'Lịch học' },
                { icon: <Briefcase size={15} />, text: 'Luận văn' },
                { icon: <Users size={15} />, text: 'Học viên' },
                { icon: <Scale size={15} />, text: 'Quy định' },
              ].map((item, idx) => (
                <a key={idx} href="#" className="qsearch-link">
                  {item.icon}
                  {item.text}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section> */}



      {/* ══════════════  UFM HIGHLIGHT (VLU STYLE CLONE)  ══════════════ */}
      <section className="ufm-highlight-section">
        <div className="ufm-highlight-wrapper vlu-news-container">
          <VideoHighlight />

          <motion.div
            className="ufm-highlight-content"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={1}
          >
            <div className="ufm-highlight-header">
              <h3 className="ufm-highlight-title">Nâng tầm tư duy, kiến tạo tương lai đột phá</h3>
            </div>
            <div className="ufm-highlight-body">
              <p className="ufm-highlight-desc">
                Viện Đào tạo Sau Đại học UFM không chỉ trang bị nền tảng kiến thức chuyên sâu cấp quản lý, mà còn khơi dậy tư duy nghiên cứu độc lập, giúp học viên nhạy bén với ý tưởng mới, làm chủ sự thay đổi và tạo bệ phóng vững chắc cho những đột phá chiến lược trong sự nghiệp.
              </p>
              <a href="#" className="ufm-highlight-link">
                <span className="ufm-highlight-link-text">Tìm hiểu thêm về chúng tôi</span>
                <span className="ufm-highlight-btn">
                  <ChevronRight size={20} strokeWidth={3} />
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════  ABOUT UFM (REFINED ORIGINAL STYLE)  ══════════════ */}
      <section className="about-ufm-section">
        <div className="about-ufm-top">
          <div className="vlu-news-container">
            <motion.div
              className="about-ufm-header"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <h2 className="about-ufm-title">Đôi nét về Viện SĐH</h2>
              <p className="about-ufm-subtitle">Những cột mốc đáng nhớ trên hành trình đào tạo nguồn nhân lực chất lượng cao của Viện Đào tạo Sau Đại học UFM.</p>
            </motion.div>
            <motion.div
              className="about-ufm-cards"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={1}
            >
              <div className="about-ufm-card">
                <div className="about-ufm-card-img">
                  <Image src="/images/hero-campus.png" alt="QS Sustainability 2026" fill sizes="400px" />
                </div>
                <div className="about-ufm-card-overlay"></div>
                <div className="about-ufm-card-text">9 chương trình Thạc sĩ và 3 chương trình Tiến sĩ đạt chuẩn kiểm định chất lượng</div>
              </div>
              <div className="about-ufm-card">
                <div className="about-ufm-card-img">
                  <Image src="/images/lecture-hall.png" alt="QS Asia Ranking 2026" fill sizes="400px" />
                </div>
                <div className="about-ufm-card-overlay"></div>
                <div className="about-ufm-card-text">Đội ngũ giảng viên 100% trình độ Tiến sĩ, Phó Giáo sư, Giáo sư</div>
              </div>
              <div className="about-ufm-card">
                <div className="about-ufm-card-img">
                  <Image src="/images/students-library.png" alt="Microsoft Showcase School 2025" fill sizes="400px" />
                </div>
                <div className="about-ufm-card-overlay"></div>
                <div className="about-ufm-card-text">Hệ thống số hóa toàn diện – Đào tạo kết hợp trực tiếp và trực tuyến</div>
              </div>
            </motion.div>
            <motion.div
              className="about-ufm-dots"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={2}
            >
              <div className="pg-dot active"></div>
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className="pg-dot"><ChevronRight size={14} strokeWidth={4} /></div>
              ))}
            </motion.div>
          </div>
        </div>
        <div className="about-ufm-bottom">
          <div className="about-bottom-bg">
            <div className="about-bottom-bg-left"></div>
            <div className="about-bottom-bg-right"></div>
          </div>
          <div className="about-ufm-container vlu-news-container">
            <motion.div
              className="about-ufm-bottom-inner"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={3}
            >
              <div className="about-bottom-left">
                <a href="#" className="about-ufm-explore">
                  Khám phá Viện SĐH
                  <span className="about-ufm-explore-btn">
                    <ChevronRight size={16} strokeWidth={3} />
                  </span>
                </a>
              </div>
              <div className="about-bottom-right">
                <div className="about-ufm-stat-item">
                  <div className="about-ufm-stat-value">5.000+</div>
                  <div className="about-ufm-stat-desc">học viên cao học và nghiên cứu sinh</div>
                </div>
                <div className="about-ufm-stat-item">
                  <div className="about-ufm-stat-value">12</div>
                  <div className="about-ufm-stat-desc">chương trình Thạc sĩ và Tiến sĩ</div>
                </div>
                <div className="about-ufm-stat-item" style={{ maxWidth: '300px' }}>
                  <div className="about-ufm-stat-value">92%</div>
                  <div className="about-ufm-stat-desc">học viên thăng tiến sau 1 năm tốt nghiệp</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════  CHƯƠNG TRÌNH ĐÀO TẠO SĐH  ══════════════ */}
      <SchoolsSection />

      {/* ══════════════  TIN TỨC & SỰ KIỆN  ══════════════ */}
      <section className="vlu-news-section" id="news">
        <div className="vlu-news-container">
          {/* Header */}
          <motion.div
            className="vlu-news-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <h2 className="vlu-news-title">Tin tức & Sự kiện nổi bật</h2>
            <a href="/news" className="vlu-news-viewall">
              Xem toàn bộ Tin tức & Sự kiện
              <span className="vlu-viewall-icon">
                <ChevronRight size={18} strokeWidth={3} />
              </span>
            </a>
          </motion.div>

          {/* Top news grid: featured + side */}
          <motion.div
            className="vlu-news-top"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={1}
          >
            {/* Featured Left */}
            <a href={`/news/${featuredNews.slug}`} className="vlu-featured-news">
              <div className="vlu-featured-img">
                <Image src={featuredNews.image} alt={featuredNews.title} fill sizes="600px" style={{ objectFit: 'cover' }} />
              </div>
              <div className="vlu-featured-body">
                <div className="vlu-featured-tag">{featuredNews.tag}</div>
                <h3>{featuredNews.title}</h3>
              </div>
            </a>

            {/* Side Right List */}
            <div className="vlu-side-news">
              {sideNews.map((item, idx) => (
                <a key={idx} href={`/news/${item.slug}`} className="vlu-side-item">
                  <div className="vlu-side-img">
                    <Image src={item.image} alt={item.title} fill sizes="200px" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="vlu-side-text">
                    {item.tag && <span className="vlu-side-tag">{item.tag}</span>}
                    <h4>{item.title}</h4>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Event Cards Grid */}
          <motion.div
            className="vlu-events-grid"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={2}
          >
            {eventCards.map((ev, idx) => (
              <a key={idx} href={`/news/${ev.slug}`} className="vlu-event-card">
                <div className="vlu-event-img">
                  <Image src={ev.image} alt={ev.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                </div>
                <div className="vlu-event-body">
                  <div className="vlu-event-meta">
                    <span className="vlu-event-tag">{ev.tag}</span>
                    <span className="vlu-event-date">{ev.date}</span>
                  </div>
                  <h4>{ev.title}</h4>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════  MẠNG LƯỚI & TRẢI NGHIỆM  ══════════════ */}
      <section className="vlu-life-section" id="life">
        <div className="vlu-news-container">
          <motion.div
            className="vlu-life-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <h2 className="vlu-life-title">Đời sống tại Viện SĐH UFM</h2>
            <a href="#" className="vlu-life-viewall">
              Khám phá đời sống tại UFM <span className="vlu-viewall-icon"><ChevronRight size={16} strokeWidth={3} /></span>
            </a>
          </motion.div>

          <motion.div
            className="vlu-life-grid"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={1}
          >
            {/* Column 1 */}
            <div className="vlu-life-col">
              <p className="vlu-life-desc">
                Đời sống học thuật tại Viện Đào tạo Sau Đại học UFM không chỉ dừng lại ở giảng đường. Từ hội thảo khoa học quốc tế, giao lưu cùng doanh nghiệp đến các chương trình kết nối cựu học viên – tất cả tạo nên một hệ sinh thái học tập và phát triển sự nghiệp toàn diện.
              </p>
              <div className="vlu-life-photo flex-grow-1" onClick={() => setLightboxIdx(0)}>
                <Image src={lifePhotos[0].src} alt={lifePhotos[0].alt} fill sizes="400px" />
                <div className="life-photo-overlay">
                  <ZoomIn size={22} />
                  <span>Phóng to</span>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="vlu-life-col">
              <div className="vlu-life-photo flex-grow-1" onClick={() => setLightboxIdx(1)}>
                <Image src={lifePhotos[1].src} alt={lifePhotos[1].alt} fill sizes="400px" />
                <div className="life-photo-overlay">
                  <ZoomIn size={22} />
                  <span>Phóng to</span>
                </div>
              </div>
              <div className="vlu-life-photo flex-grow-1" onClick={() => setLightboxIdx(2)}>
                <Image src={lifePhotos[2].src} alt={lifePhotos[2].alt} fill sizes="400px" />
                <div className="life-photo-overlay">
                  <ZoomIn size={22} />
                  <span>Phóng to</span>
                </div>
              </div>
              <div className="vlu-life-photo flex-grow-1" onClick={() => setLightboxIdx(3)}>
                <Image src={lifePhotos[3].src} alt={lifePhotos[3].alt} fill sizes="400px" />
                <div className="life-photo-overlay">
                  <ZoomIn size={22} />
                  <span>Phóng to</span>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="vlu-life-col">
              <div className="vlu-life-photo flex-grow-2" onClick={() => setLightboxIdx(4)}>
                <Image src={lifePhotos[4].src} alt={lifePhotos[4].alt} fill sizes="400px" />
                <div className="life-photo-overlay">
                  <ZoomIn size={22} />
                  <span>Phóng to</span>
                </div>
              </div>
              <div className="vlu-life-photo flex-grow-1" onClick={() => setLightboxIdx(5)}>
                <Image src={lifePhotos[5].src} alt={lifePhotos[5].alt} fill sizes="400px" />
                <div className="life-photo-overlay">
                  <ZoomIn size={22} />
                  <span>Phóng to</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════  LIÊN HỆ TƯ VẤN  ══════════════ */}
      <ConsultationSection />

      <Footer />

      {/* ══════════════  LIGHTBOX  ══════════════ */}
      {lightboxIdx !== null && (
        <div className="life-lightbox-backdrop" onClick={() => setLightboxIdx(null)}>
          <button className="life-lightbox-close" onClick={() => setLightboxIdx(null)} aria-label="Đóng">
            <X size={28} />
          </button>
          <button
            className="life-lightbox-arrow life-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + lifePhotos.length) % lifePhotos.length); }}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={32} />
          </button>
          <div className="life-lightbox-img" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lifePhotos[lightboxIdx].src}
              alt={lifePhotos[lightboxIdx].alt}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <button
            className="life-lightbox-arrow life-lightbox-next"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % lifePhotos.length); }}
            aria-label="Ảnh sau"
          >
            <ChevronRight size={32} />
          </button>
          <div className="life-lightbox-counter" onClick={(e) => e.stopPropagation()}>
            {lightboxIdx + 1} / {lifePhotos.length}
          </div>
        </div>
      )}

      {/* ══════════════  CHATBOT UI  ══════════════ */}
      <Chatbot />
    </>
  );
}
