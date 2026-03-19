'use client';

import { useEffect, useRef } from 'react';
import {
  Medal, GraduationCap, Briefcase, Globe, Building, Target, Star
} from 'lucide-react';

const reasons = [
  {
    icon: <Medal size={26} />,
    title: 'Chương trình đạt chuẩn quốc tế',
    desc: 'Được công nhận bởi các tổ chức kiểm định quốc tế AACSB, FIBAA và đối tác toàn cầu.',
  },
  {
    icon: <GraduationCap size={26} />,
    title: 'Giảng viên hàng đầu',
    desc: 'Đội ngũ giáo sư, tiến sĩ đến từ các trường đại học danh tiếng trong nước và quốc tế.',
  },
  {
    icon: <Briefcase size={26} />,
    title: 'Kết nối doanh nghiệp',
    desc: 'Hợp tác chặt chẽ với 200+ doanh nghiệp hàng đầu, đảm bảo cơ hội thực tập và việc làm.',
  },
  {
    icon: <Globe size={26} />,
    title: 'Trao đổi quốc tế',
    desc: 'Chương trình trao đổi sinh viên với hơn 50 trường đại học tại 20 quốc gia trên thế giới.',
  },
  {
    icon: <Building size={26} />,
    title: 'Cơ sở vật chất hiện đại',
    desc: 'Hệ thống phòng học, thư viện, lab mô phỏng tài chính đạt tiêu chuẩn 5 sao.',
  },
  {
    icon: <Target size={26} />,
    title: 'Tỷ lệ việc làm cao',
    desc: '95% sinh viên có việc làm trong 6 tháng sau tốt nghiệp, 80% đúng chuyên ngành.',
  },
];

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.why-card').forEach((card, idx) => {
              (card as HTMLElement).style.animationDelay = `${idx * 0.1}s`;
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
    <section className="section why-section" id="why-us" ref={sectionRef}>
      <div className="vlu-news-container">
        <div className="section-header">
          <div className="section-tag">
            <Star size={16} /> Tại sao chọn chúng tôi
          </div>
          <h2 className="section-title">
            Vì sao chọn <span>Đại học Tài chính</span>?
          </h2>
          <p className="section-subtitle">
            Nơi kiến tạo nền tảng vững chắc cho sự nghiệp tài chính – kinh doanh của bạn
          </p>
        </div>

        <div className="why-grid">
          {reasons.map((r, idx) => (
            <div key={idx} className="why-card" style={{ opacity: 0 }}>
              <div className="why-icon">{r.icon}</div>
              <h3 className="why-title">{r.title}</h3>
              <p className="why-desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
