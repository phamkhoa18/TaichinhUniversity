'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Trophy, BookOpen, Earth, ArrowRight, Play, Clock, Users, Award, BriefcaseBusiness } from 'lucide-react';

const slides = [
  {
    image: '/images/hero-banner/1.png',
    tagIcon: <Trophy size={14} />,
    tagText: 'Top University',
    title: (
      <>
        Kiến tạo <span>Tương lai</span> cùng Đại học Tài chính
      </>
    ),
    description:
      'Đào tạo thế hệ lãnh đạo tài chính kế tiếp với chương trình đạt chuẩn quốc tế, đội ngũ giảng viên hàng đầu và mạng lưới doanh nghiệp toàn cầu.',
  },
  {
    image: '/images/hero-banner/1.png',
    tagIcon: <BookOpen size={14} />,
    tagText: 'Học bổng hấp dẫn',
    title: (
      <>
        Chương trình <span>Học bổng</span> 2026
      </>
    ),
    description:
      'Hàng trăm suất học bổng giá trị lên đến 100% học phí dành cho tân sinh viên xuất sắc. Cơ hội vàng cho bạn trẻ đam mê tài chính.',
  },
  {
    image: '/images/hero-banner/1.png',
    tagIcon: <Earth size={14} />,
    tagText: 'Hợp tác quốc tế',
    title: (
      <>
        Học tập <span>Toàn cầu</span> với đối tác quốc tế
      </>
    ),
    description:
      'Chương trình trao đổi sinh viên và liên kết đào tạo với hơn 50 trường đại học danh tiếng trên thế giới.',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="hero" id="hero">
      <div className="hero-slider">
        {slides.map((slide, idx) => (
          <div key={idx} className={`hero-slide ${idx === current ? 'active' : ''}`}>
            <Image
              src={slide.image}
              alt="Campus"
              fill
              sizes="100vw"
              className="hero-slide-image"
              priority={idx === 0}
            />
            <div className="hero-slide-overlay" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-tag">
          {slides[current].tagIcon} {slides[current].tagText}
        </div>
        <h1 className="hero-title">{slides[current].title}</h1>
        <p className="hero-description">{slides[current].description}</p>
        <div className="hero-buttons">
          <a href="#" className="hero-btn hero-btn-primary">
            Tìm hiểu ngay <ArrowRight size={18} />
          </a>
          <a href="#" className="hero-btn hero-btn-outline">
            <Play size={16} /> Video giới thiệu
          </a>
        </div>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Stats Bar */}
      <div className="hero-stats">
        <div className="hero-stats-inner">
          <div className="stat-item">
            <div className="stat-icon"><Clock size={20} /></div>
            <div className="stat-number">25+</div>
            <div className="stat-label">Năm kinh nghiệm</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><Users size={20} /></div>
            <div className="stat-number">15,000+</div>
            <div className="stat-label">Sinh viên</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><Award size={20} /></div>
            <div className="stat-number">500+</div>
            <div className="stat-label">Giảng viên & Chuyên gia</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><BriefcaseBusiness size={20} /></div>
            <div className="stat-number">95%</div>
            <div className="stat-label">SV có việc làm</div>
          </div>
        </div>
      </div>
    </section>
  );
}
