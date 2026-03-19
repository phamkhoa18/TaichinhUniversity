'use client';

import Image from 'next/image';
import { CalendarDays, Newspaper } from 'lucide-react';

const newsItems = [
  {
    title: 'Lễ khai giảng năm học 2026 – 2027: Hành trình mới, tầm cao mới',
    date: '12 Tháng 3, 2026',
    excerpt:
      'Trường Đại học Tài chính long trọng tổ chức lễ khai giảng chào đón hơn 3,000 tân sinh viên khóa mới với nhiều hoạt động sôi nổi.',
    image: '/images/hero-campus.png',
  },
  {
    title: 'Ký kết hợp tác chiến lược với Ngân hàng BIDV',
    date: '10 Tháng 3, 2026',
    image: '/images/students-library.png',
  },
  {
    title: 'Sinh viên TF đạt giải Nhất cuộc thi Fintech Innovation 2026',
    date: '08 Tháng 3, 2026',
    image: '/images/lecture-hall.png',
  },
  {
    title: 'Hội thảo quốc tế về Digital Banking & AI trong Tài chính',
    date: '05 Tháng 3, 2026',
    image: '/images/hero-campus.png',
  },
  {
    title: 'Mở đăng ký chương trình trao đổi sinh viên với ĐH Melbourne',
    date: '01 Tháng 3, 2026',
    image: '/images/students-library.png',
  },
];

export default function NewsSection() {
  const featured = newsItems[0];
  const sidebar = newsItems.slice(1);

  return (
    <section className="section" id="news">
      <div className="vlu-news-container">
        <div className="section-header">
          <div className="section-tag">
            <Newspaper size={16} /> Tin tức & Sự kiện
          </div>
          <h2 className="section-title">
            Tin tức <span>mới nhất</span>
          </h2>
          <p className="section-subtitle">
            Cập nhật những hoạt động, sự kiện nổi bật và thông tin mới nhất của trường
          </p>
        </div>

        <div className="news-grid">
          {/* Featured */}
          <div className="news-featured">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="news-featured-image"
            />
            <div className="news-featured-overlay" />
            <div className="news-featured-content">
              <div className="news-date">
                <CalendarDays size={14} /> {featured.date}
              </div>
              <h3 className="news-featured-title">{featured.title}</h3>
              <p className="news-featured-excerpt">{featured.excerpt}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="news-sidebar">
            {sidebar.map((item, idx) => (
              <div key={idx} className="news-card">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={120}
                  height={100}
                  className="news-card-image"
                />
                <div className="news-card-content">
                  <h4 className="news-card-title">{item.title}</h4>
                  <span className="news-card-date">
                    <CalendarDays size={12} /> {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
