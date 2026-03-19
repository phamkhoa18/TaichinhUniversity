'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Landmark, Calculator, Cpu, BarChart3, Globe2, Scale,
  ArrowRight, GraduationCap
} from 'lucide-react';

const programs = [
  {
    icon: <Landmark size={22} />,
    badge: 'Hot',
    title: 'Tài chính – Ngân hàng',
    desc: 'Đào tạo chuyên gia tài chính với kiến thức chuyên sâu về quản lý tài sản, đầu tư và ngân hàng hiện đại.',
    image: '/images/hero-campus.png',
  },
  {
    icon: <Calculator size={22} />,
    badge: 'Mới',
    title: 'Kế toán – Kiểm toán',
    desc: 'Chương trình đạt chuẩn ACCA, trang bị kỹ năng kế toán quốc tế và kiểm toán chuyên nghiệp.',
    image: '/images/students-library.png',
  },
  {
    icon: <Cpu size={22} />,
    badge: 'Xu hướng',
    title: 'Công nghệ Tài chính (Fintech)',
    desc: 'Kết hợp tài chính và công nghệ, ứng dụng AI, Blockchain trong lĩnh vực tài chính – ngân hàng.',
    image: '/images/lecture-hall.png',
  },
  {
    icon: <BarChart3 size={22} />,
    badge: null,
    title: 'Quản trị Kinh doanh',
    desc: 'Phát triển tư duy lãnh đạo và kỹ năng quản trị doanh nghiệp trong môi trường kinh doanh toàn cầu.',
    image: '/images/hero-campus.png',
  },
  {
    icon: <Globe2 size={22} />,
    badge: null,
    title: 'Kinh tế Quốc tế',
    desc: 'Nghiên cứu thương mại quốc tế, chính sách kinh tế và quan hệ tài chính toàn cầu.',
    image: '/images/students-library.png',
  },
  {
    icon: <Scale size={22} />,
    badge: null,
    title: 'Luật Kinh tế',
    desc: 'Đào tạo chuyên gia pháp lý trong lĩnh vực tài chính, ngân hàng, chứng khoán và bất động sản.',
    image: '/images/lecture-hall.png',
  },
];

export default function ProgramsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.program-card').forEach((card, idx) => {
              (card as HTMLElement).style.animationDelay = `${idx * 0.12}s`;
              card.classList.add('animate-fade-in-up');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="programs" ref={sectionRef}>
      <div className="vlu-news-container">
        <div className="section-header">
          <div className="section-tag">
            <GraduationCap size={16} /> Đào tạo
          </div>
          <h2 className="section-title">
            Ngành đào tạo <span>nổi bật</span>
          </h2>
          <p className="section-subtitle">
            Các chương trình đào tạo chất lượng cao, đáp ứng nhu cầu thị trường lao động và xu hướng phát triển kinh tế
          </p>
        </div>

        <div className="programs-grid">
          {programs.map((p, idx) => (
            <div key={idx} className="program-card" style={{ opacity: 0 }}>
              <div className="program-card-image-wrapper">
                <Image
                  src={p.image}
                  alt={p.title}
                  width={400}
                  height={200}
                  className="program-card-image"
                />
                {p.badge && <span className="program-card-badge">{p.badge}</span>}
              </div>
              <div className="program-card-content">
                <div className="program-card-icon">{p.icon}</div>
                <h3 className="program-card-title">{p.title}</h3>
                <p className="program-card-desc">{p.desc}</p>
                <a href="#" className="program-card-link">
                  Xem chi tiết <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
