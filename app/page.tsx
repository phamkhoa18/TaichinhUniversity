'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
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
import GlobalPopup from '@/app/components/GlobalPopup';
import { useSiteSettings } from '@/store/SiteSettingsProvider';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

/* ─── Framer Motion ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

/* ─── Hero Slides ─── */
const heroSlides: any[] = [];

/* ─── Achievements ─── */
const achievements: any[] = [];

/* ─── Stats ─── */
const aboutStats: any[] = [];


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
  const { settings } = useSiteSettings();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/public/home')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setConfig(res.data);
        }
      })
      .catch(err => console.error("Error loading home page config", err));
  }, []);

  const activeHeroSlides = config?.heroSlides?.length > 0 ? config.heroSlides : heroSlides;
  const activeStats = config?.aboutStats?.length > 0 ? config.aboutStats : aboutStats;
  const activeAboutNews = config?.featuredNewsIds?.length > 0 ?
    config.featuredNewsIds.filter(Boolean).map((n: any) => ({
      slug: n.slug,
      title: n.title,
      image: n.thumbnail || '/images/default.jpg'
    }))
    : (config?.achievements?.length > 0 ? config.achievements : achievements);

  const activeFeaturedNews = (config?.latestNews && config.latestNews[0]) ? {
    slug: config.latestNews[0].slug,
    tag: config.latestNews[0].category?.name || 'TIN TỨC',
    title: config.latestNews[0].title,
    image: config.latestNews[0].thumbnail || '/images/default.jpg'
  } : null;
  const activeSideNews = (config?.latestNews && config.latestNews.length > 1) ?
    config.latestNews.slice(1, 5).map((n: any) => ({
      slug: n.slug,
      tag: n.category?.name || 'TIN TỨC',
      title: n.title,
      image: n.thumbnail || '/images/default.jpg'
    }))
    : [];

  const activeEventCards = (config?.latestNews && config.latestNews.length > 5) ?
    config.latestNews.slice(5, 8).map((n: any) => ({
      slug: n.slug,
      tag: n.category?.name || 'SỰ KIỆN',
      date: n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, ' - ') : '',
      title: n.title,
      image: n.thumbnail || '/images/default.jpg'
    }))
    : [];

  const activeVideo = config?.videoHighlight || null;

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
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          slidesPerView={1}
          navigation={{
            nextEl: '.hero-arrow-next',
            prevEl: '.hero-arrow-prev',
          }}
          pagination={{
            clickable: true,
            el: '.hero-dots',
            bulletClass: 'hero-dot',
            bulletActiveClass: 'active'
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={activeHeroSlides.length > 1}
          autoHeight={true}
          className="w-full h-full"
        >
          {activeHeroSlides.map((slide: any, idx: number) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <Image src={slide.image || '/images/hero-banner/1.png'} alt="" width={3809} height={1181} className="hero-slide-img hero-desktop-img hidden md:block" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} priority={idx === 0} />
                {slide.mobileImage && (
                  <Image src={slide.mobileImage} alt="" width={1120} height={970} className="hero-slide-img hero-mobile-img block md:hidden" style={{ width: '100%', height: 'auto', objectFit: 'unset' }} priority={idx === 0} />
                )}
                {slide.title && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 text-white text-shadow-md">
                    <h1 className="text-4xl md:text-6xl font-bold whitespace-pre-line tracking-tight mb-4 max-w-4xl">{slide.title}</h1>
                    {slide.subtitle && <p className="text-lg md:text-2xl font-medium max-w-2xl text-shadow">{slide.subtitle}</p>}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}

          <button className="hero-arrow hero-arrow-prev" aria-label="Previous">
            <ChevronLeft size={28} />
          </button>
          <button className="hero-arrow hero-arrow-next" aria-label="Next">
            <ChevronRight size={28} />
          </button>
          <div className="hero-dots"></div>
        </Swiper>
      </section>

      {/* ══════════════════════  NEWS TICKER  ══════════════════════ */}
      {config?.latestNews?.length > 0 && (
        <div className="news-ticker">
          <div className="news-ticker-label">
            <Megaphone size={18} fill="currentColor" />
            <span>TIN MỚI</span>
          </div>
          <div className="news-ticker-track">
            <div className="news-ticker-scroll">
              {config.latestNews.map((news: any, idx: number) => (
                <div key={idx} style={{ display: 'contents' }}>
                  <a href={`/news/${news.slug}`} className="news-ticker-item">
                    <span className="news-ticker-date">
                      {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : ''}
                    </span>
                    <span className="news-ticker-text">{news.title}</span>
                  </a>
                  <span className="news-ticker-sep"></span>
                </div>
              ))}
              {/* duplicate for seamless loop */}
              {config.latestNews.map((news: any, idx: number) => (
                <div key={`dup-${idx}`} style={{ display: 'contents' }}>
                  <a href={`/news/${news.slug}`} className="news-ticker-item">
                    <span className="news-ticker-date">
                      {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : ''}
                    </span>
                    <span className="news-ticker-text">{news.title}</span>
                  </a>
                  <span className="news-ticker-sep"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════  UFM HIGHLIGHT (VLU STYLE CLONE)  ══════════════ */}
      {activeVideo && (
        <section className="ufm-highlight-section">
          <div className="ufm-highlight-wrapper vlu-news-container">
            <VideoHighlight videoId={activeVideo.videoId} videoUrl={activeVideo.url} />

            <motion.div
              className="ufm-highlight-content"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={1}
            >
              <div className="ufm-highlight-header">
                <h3 className="ufm-highlight-title">{activeVideo.title}</h3>
              </div>
              <div className="ufm-highlight-body">
                <p className="ufm-highlight-desc">
                  {activeVideo.desc}
                </p>
                <a href={activeVideo.linkUrl || '#'} className="ufm-highlight-link">
                  <span className="ufm-highlight-link-text">{activeVideo.linkText}</span>
                  <span className="ufm-highlight-btn">
                    <ChevronRight size={20} strokeWidth={3} />
                  </span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      )}

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
            <div className="about-ufm-swiper-wrap" style={{ position: 'relative' }}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={activeAboutNews.length > 3}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="about-ufm-swiper"
              >
                {activeAboutNews.map((ach: any, idx: number) => {
                  const CardWrapper = ach.slug ? Link : 'div';
                  return (
                    <SwiperSlide key={idx}>
                      <CardWrapper href={ach.slug ? `/news/${ach.slug}` : '#'} className="about-ufm-card" style={{ display: 'block' }}>
                        <div className="about-ufm-card-img">
                          <Image src={ach.image || '/images/default.jpg'} alt={ach.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="about-ufm-card-overlay"></div>
                        <div className="about-ufm-card-text lg:text-lg absolute bottom-0">{ach.title}</div>
                      </CardWrapper>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
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
                {activeStats.map((stat: any, idx: number) => (
                  <div key={idx} className="about-ufm-stat-item px-2" style={{ maxWidth: '300px' }}>
                    <div className="about-ufm-stat-value">{stat.value}</div>
                    <div className="about-ufm-stat-desc">{stat.desc}</div>
                  </div>
                ))}
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
          {activeFeaturedNews && (
            <motion.div
              className="vlu-news-top"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={1}
            >
              {/* Featured Left */}
              <Link href={`/news/${activeFeaturedNews.slug}`} className="vlu-featured-news">
                <div className="vlu-featured-img">
                  <Image src={activeFeaturedNews.image} alt={activeFeaturedNews.title} fill sizes="600px" style={{ objectFit: 'cover' }} />
                </div>
                <div className="vlu-featured-body">
                  <div className="vlu-featured-tag">{activeFeaturedNews.tag}</div>
                  <h3>{activeFeaturedNews.title}</h3>
                </div>
              </Link>

              {/* Side Right List */}
              <div className="vlu-side-news">
                {activeSideNews.map((item: any, idx: number) => (
                  <Link key={idx} href={`/news/${item.slug}`} className="vlu-side-item">
                    <div className="vlu-side-img">
                      <Image src={item.image} alt={item.title} fill sizes="200px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="vlu-side-text">
                      {item.tag && <span className="vlu-side-tag">{item.tag}</span>}
                      <h4>{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Event Cards Grid */}
          <motion.div
            className="vlu-events-grid"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={2}
          >
            {activeEventCards.map((ev: any, idx: number) => (
              <Link key={idx} href={`/news/${ev.slug}`} className="vlu-event-card">
                <div className="vlu-event-img">
                  <Image src={ev.image} alt={ev.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                </div>
                <div className="vlu-event-body">
                  <div className="vlu-event-meta">
                    <span className="vlu-event-tag">{ev.tag}</span>
                    <span className="vlu-event-date"><CalendarDays size={13} /> {ev.date}</span>
                  </div>
                  <h4>{ev.title}</h4>
                </div>
              </Link>
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

      {/* ══════════════  GLOBAL POPUP  ══════════════ */}
      <GlobalPopup />
    </>
  );
}
