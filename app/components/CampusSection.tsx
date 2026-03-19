'use client';

import Image from 'next/image';
import { School } from 'lucide-react';

const galleryItems = [
  { image: '/images/hero-campus.png', label: 'Khuôn viên xanh mát & hiện đại' },
  { image: '/images/students-library.png', label: 'Thư viện & Không gian học tập' },
  { image: '/images/lecture-hall.png', label: 'Phòng học thông minh' },
  { image: '/images/hero-campus.png', label: 'Hoạt động ngoại khóa sôi nổi' },
  { image: '/images/students-library.png', label: 'Hội thảo & Seminar' },
];

export default function CampusSection() {
  return (
    <section className="section campus-section" id="campus">
      <div className="vlu-news-container">
        <div className="section-header">
          <div className="section-tag">
            <School size={16} /> Đời sống sinh viên
          </div>
          <h2 className="section-title">
            Cuộc sống tại <span>campus</span>
          </h2>
          <p className="section-subtitle">
            Khám phá không gian học tập hiện đại, hoạt động ngoại khóa phong phú và đời sống sinh viên đầy màu sắc
          </p>
        </div>

        <div className="campus-gallery">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="campus-item">
              <Image
                src={item.image}
                alt={item.label}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="campus-item-image"
              />
              <div className="campus-item-overlay" />
              <div className="campus-item-text">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
