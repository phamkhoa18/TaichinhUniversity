'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ChevronRight, GraduationCap, Users, BookOpen, Award,
  Target, Eye, Lightbulb, Building2, Globe, TrendingUp,
  Clock, BadgePercent, Briefcase, ArrowRight, CheckCircle2,
  Star, Heart, Cpu, Shield
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import './overview.css';

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* ─── Data ─── */
const stats = [
  { value: '5.000+', label: 'Học viên đang theo học', icon: <Users size={24} /> },
  { value: '12', label: 'Chương trình Thạc sĩ & Tiến sĩ', icon: <BookOpen size={24} /> },
  { value: '92%', label: 'Học viên thăng tiến sau tốt nghiệp', icon: <TrendingUp size={24} /> },
  { value: '150+', label: 'Đối tác doanh nghiệp & quốc tế', icon: <Globe size={24} /> },
];

const programs = [
  { name: 'Tài chính – Ngân hàng', level: 'Thạc sĩ', code: '8340201' },
  { name: 'Quản trị Kinh doanh', level: 'Thạc sĩ & Tiến sĩ', code: '8340101' },
  { name: 'Kế toán', level: 'Thạc sĩ', code: '8340301' },
  { name: 'Kinh tế học', level: 'Thạc sĩ', code: '8310101' },
  { name: 'Quản lý Kinh tế', level: 'Thạc sĩ & Tiến sĩ', code: '8310110' },
  { name: 'Luật Kinh tế', level: 'Thạc sĩ', code: '8380107' },
  { name: 'Kinh doanh Quốc tế', level: 'Thạc sĩ', code: '8340120' },
  { name: 'Marketing', level: 'Thạc sĩ', code: '8340115' },
  { name: 'Toán Kinh tế', level: 'Thạc sĩ', code: '8310114' },
  { name: 'Tài chính – Ngân hàng', level: 'Tiến sĩ', code: '9340201' },
  { name: 'Quản lý Kinh tế', level: 'Tiến sĩ', code: '9310110' },
];

const advantages = [
  {
    icon: <Clock size={28} />,
    title: 'Tiết kiệm thời gian',
    desc: 'Sinh viên được đăng ký học trước các học phần thạc sĩ, rút ngắn thời gian nhận bằng.',
  },
  {
    icon: <BadgePercent size={28} />,
    title: 'Học phí ưu đãi',
    desc: 'Giảm 10% cho cựu sinh viên UFM. Cam kết ổn định học phí toàn khóa.',
  },
  {
    icon: <Cpu size={28} />,
    title: 'Linh hoạt & Hiện đại',
    desc: 'Quy trình số hóa toàn diện. Đào tạo kết hợp trực tiếp và trực tuyến.',
  },
  {
    icon: <Shield size={28} />,
    title: 'Hỗ trợ chuyên sâu',
    desc: 'Giảng viên đầu ngành hướng dẫn. Quy trình bảo vệ tinh gọn, hiệu quả.',
  },
];

const milestones = [
  { year: '1976', text: 'Thành lập Trường Đại học Tài chính – Marketing tiền thân.' },
  { year: '2004', text: 'Viện Đào tạo Sau Đại học chính thức đi vào hoạt động.' },
  { year: '2010', text: 'Mở rộng lên 6 chương trình Thạc sĩ đạt kiểm định chất lượng.' },
  { year: '2018', text: 'Ra mắt chương trình Tiến sĩ Quản trị Kinh doanh & Tài chính – Ngân hàng.' },
  { year: '2022', text: 'Số hóa toàn diện – triển khai đào tạo kết hợp trực tuyến.' },
  { year: '2026', text: '12 chương trình đào tạo, hơn 5.000 học viên đang theo học.' },
];

export default function GioiThieuPage() {
  return (
    <>
      <Header />

      {/* ══════════ HERO ══════════ */}
      <section className="overview-hero">
        <div className="overview-hero-bg">
          <Image src="/images/life/bg_ufm_4.jpg" alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
          <div className="overview-hero-overlay" />
        </div>
        <motion.div
          className="overview-hero-content vlu-news-container"
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div className="overview-breadcrumb" variants={fadeUp} custom={0}>
            <a href="/">Trang chủ</a>
            <ChevronRight size={14} />
            <a href="/gioi-thieu">Giới thiệu</a>
            <ChevronRight size={14} />
            <span>Tổng quan</span>
          </motion.div>
          <motion.div className="overview-hero-badge" variants={fadeUp} custom={1}>
            <Building2 size={15} /> Viện Đào tạo Sau Đại học
          </motion.div>
          <motion.h1 variants={fadeUp} custom={2}>
            Nơi kiến tạo <span>thế hệ lãnh đạo</span> tài chính tương lai
          </motion.h1>
          <motion.p variants={fadeUp} custom={3}>
            Viện Đào tạo Sau Đại học – Trường Đại học Tài chính – Marketing (UFM) là đơn vị đào tạo trọng điểm,
            cung cấp nguồn nhân lực chất lượng cao cho ngành tài chính, kinh tế và quản trị tại Việt Nam.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section className="overview-stats">
        <div className="vlu-news-container">
          <div className="overview-stats-grid">
            {stats.map((stat, i) => (
              <motion.div
                key={i} className="overview-stat-card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={scaleIn} custom={i}
              >
                <div className="overview-stat-icon">{stat.icon}</div>
                <div className="overview-stat-value">{stat.value}</div>
                <div className="overview-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ VISION & MISSION ══════════ */}
      <section className="overview-section overview-vm">
        <div className="overview-section-bg">
          <Image src="/images/life/bg_ufm.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        </div>
        <div className="vlu-news-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="overview-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="overview-tag"><Star size={15} /> Sứ mệnh & Tầm nhìn</div>
            <h2>Triết lý <span>giáo dục</span></h2>
          </motion.div>

          <div className="overview-vm-grid">
            <motion.div
              className="overview-vm-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeLeft}
            >
              <div className="vm-card-icon mission"><Target size={32} /></div>
              <h3>Sứ mệnh</h3>
              <p>
                Đào tạo nguồn nhân lực chất lượng cao trình độ sau đại học, có năng lực nghiên cứu độc lập,
                tư duy sáng tạo và khả năng ứng dụng kiến thức vào thực tiễn, đáp ứng nhu cầu phát triển
                kinh tế – xã hội của đất nước trong bối cảnh hội nhập quốc tế.
              </p>
            </motion.div>

            <motion.div
              className="overview-vm-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeRight}
            >
              <div className="vm-card-icon vision"><Eye size={32} /></div>
              <h3>Tầm nhìn</h3>
              <p>
                Trở thành đơn vị đào tạo sau đại học hàng đầu khu vực phía Nam trong lĩnh vực tài chính,
                kinh tế, quản trị kinh doanh; được công nhận về chất lượng đào tạo và nghiên cứu khoa học
                ở tầm quốc gia và quốc tế.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="overview-philosophy"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <Lightbulb size={24} />
            <div>
              <h4>Triết lý giáo dục</h4>
              <p>"Thực chất, đổi mới sáng tạo và hội nhập" – Mọi chương trình đào tạo đều hướng đến giá trị thực tiễn, khuyến khích sáng tạo và đáp ứng chuẩn quốc tế.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ TIMELINE ══════════ */}
      <section className="overview-section overview-timeline-section">
        <div className="overview-section-bg">
          <Image src="/images/life/bg_ufm_3.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        </div>
        <div className="vlu-news-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="overview-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="overview-tag"><Clock size={15} /> Hành trình phát triển</div>
            <h2>Những <span>cột mốc</span> quan trọng</h2>
          </motion.div>

          <div className="overview-timeline">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
              >
                <div className="timeline-dot" />
                <div className="timeline-year">{m.year}</div>
                <div className="timeline-text">{m.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PROGRAMS ══════════ */}
      <section className="overview-section overview-programs-section">
        <div className="overview-section-bg">
          <Image src="/images/life/bg_ufm_2.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        </div>
        <div className="vlu-news-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="overview-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="overview-tag"><GraduationCap size={15} /> Chương trình đào tạo</div>
            <h2>12 chương trình <span>Thạc sĩ & Tiến sĩ</span></h2>
            <p className="overview-section-desc">
              Đa dạng ngành đào tạo, đáp ứng nhu cầu phát triển sự nghiệp của người học trong nhiều lĩnh vực.
            </p>
          </motion.div>

          <div className="overview-programs-grid">
            {programs.map((prog, i) => (
              <motion.a
                key={i} href="#"
                className="overview-program-card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={scaleIn} custom={i % 4}
              >
                <div className="program-card-top">
                  <span className={`program-level ${prog.level.includes('Tiến') ? 'phd' : ''}`}>
                    {prog.level}
                  </span>
                  <span className="program-code">{prog.code}</span>
                </div>
                <h4>{prog.name}</h4>
                <span className="program-card-cta">
                  Tìm hiểu <ChevronRight size={14} />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHY CHOOSE US ══════════ */}
      <section className="overview-section overview-advantages">
        <div className="overview-section-bg">
          <Image src="/images/life/bg_ufm_5.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        </div>
        <div className="vlu-news-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="overview-adv-layout">
            <motion.div
              className="overview-adv-left"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeLeft}
            >
              <div className="overview-tag"><Heart size={15} /> Tại sao chọn chúng tôi</div>
              <h2>Đồng hành cùng <span>người học</span> đến thành công</h2>
              <p>
                Viện SĐH UFM luôn đặt lợi ích người học làm trọng tâm, với những chính sách ưu đãi vượt trội
                và phương pháp đào tạo hiện đại, linh hoạt.
              </p>
              <a href="#" className="overview-adv-cta">
                Đăng ký tư vấn ngay <ArrowRight size={16} />
              </a>
            </motion.div>

            <div className="overview-adv-right">
              {advantages.map((adv, i) => (
                <motion.div
                  key={i} className="overview-adv-card"
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={i}
                >
                  <div className="adv-card-icon">{adv.icon}</div>
                  <div>
                    <h4>{adv.title}</h4>
                    <p>{adv.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ GALLERY ══════════ */}
      <section className="overview-section overview-gallery">
        <div className="vlu-news-container">
          <motion.div
            className="overview-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="overview-tag"><Award size={15} /> Hình ảnh hoạt động</div>
            <h2>Không gian <span>học thuật</span></h2>
          </motion.div>
          <div className="overview-gallery-grid">
            {['bg_ufm.jpg', 'bg_ufm_2.jpg', 'bg_ufm_3.jpg', 'bg_ufm_5.jpg', 'bg_ufm_6.jpg', 'bg_ufm_4.jpg'].map((img, i) => (
              <motion.div
                key={i}
                className={`overview-gallery-item ${i === 0 ? 'large' : ''}`}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={scaleIn} custom={i % 3}
              >
                <Image src={`/images/life/${img}`} alt="UFM Campus" fill sizes="400px" style={{ objectFit: 'cover' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="overview-cta">
        <motion.div
          className="overview-cta-inner vlu-news-container"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={0}
        >
          <h2>Sẵn sàng nâng tầm <span>sự nghiệp</span>?</h2>
          <p>Liên hệ ngay để được tư vấn chi tiết về chương trình đào tạo và chính sách ưu đãi.</p>
          <div className="overview-cta-btns">
            <a href="#" className="overview-btn-primary">
              <GraduationCap size={18} /> Đăng ký tuyển sinh <ArrowRight size={16} />
            </a>
            <a href="/news" className="overview-btn-outline">
              <Briefcase size={18} /> Xem tin tức
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
