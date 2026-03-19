'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ChevronRight, Building2, Mail, Phone, Users,
  GraduationCap, Award, ArrowRight
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import './cocau.css';

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* ─── Data ─── */
const leaders = [
  {
    name: 'TS. Trần Văn Trí',
    role: 'Viện trưởng',
    img: '/images/nhansu/tranvantri.jpg',
    email: 'tvtri@ufm.edu.vn',
    phone: '0846.868.218',
    desc: 'Phụ trách chung công tác tuyển sinh và quản lý đào tạo của Viện.',
  },
  {
    name: 'TS. Hoàng Sĩ Nam',
    role: 'Phó Viện trưởng',
    img: '/images/nhansu/hoangsinam.jpg',
    email: 'hs.nam@ufm.edu.vn',
    phone: '0343.843.868',
    desc: 'Phụ trách chương trình đào tạo Tiến sĩ ngành Quản lý Kinh tế.',
  },
];

const staff = [
  {
    name: 'ThS. Châu Mỹ Chi',
    role: 'Chuyên viên chính',
    img: '/images/nhansu/chaumychi.jpg',
    email: 'chaumychi@ufm.edu.vn',
    phone: '0903.848.285',
    area: 'ThS ngành KDQT & Toán KT',
  },
  {
    name: 'ThS. Huỳnh Thị Mỹ Diệu',
    role: 'Chuyên viên',
    img: '/images/nhansu/huynhthimydieu.jpg',
    email: 'mydieu@ufm.edu.vn',
    phone: '0909.581.135',
    area: 'TS ngành QTKD',
  },
  {
    name: 'ThS. Đỗ Minh Hương',
    role: 'Chuyên viên',
    img: '/images/nhansu/dominhhuong.jpg',
    email: 'dmhuong@ufm.edu.vn',
    phone: '0983.637.999',
    area: 'ThS ngành QTKD & Kế toán',
  },
  {
    name: 'ThS. Nguyễn Ngọc Thảo Nguyên',
    role: 'Chuyên viên',
    img: '/images/nhansu/thaonguyen.jpg',
    email: 'nntnguyen@ufm.edu.vn',
    phone: '0988.932.803',
    area: 'Hỗ trợ đào tạo',
  },
  {
    name: 'ThS. Vũ Mạnh Thành',
    role: 'Chuyên viên chính',
    img: '/images/nhansu/vumanhthanh.jpg',
    email: 'manhthanhvn@ufm.edu.vn',
    phone: '0703.216.336',
    area: 'Hỗ trợ đào tạo',
  },
  {
    name: 'ThS. Trần Văn Tuấn',
    role: 'Chuyên viên',
    img: '/images/nhansu/tranvantuan.jpg',
    email: 'tvtuan@ufm.edu.vn',
    phone: '0967.657.532',
    area: 'Hỗ trợ đào tạo',
  },
  {
    name: 'ThS. Phạm Ngọc Trình',
    role: 'Chuyên viên chính',
    img: '/images/nhansu/trinh.jpg',
    email: 'phamtrinh@ufm.edu.vn',
    phone: '0908.258.061',
    area: 'CNTT, hành chính, báo cáo',
  },
];

export default function CoCauToChucPage() {
  return (
    <>
      <Header />

      {/* ══════════ HERO ══════════ */}
      <section className="org-hero">
        <div className="org-hero-bg">
          <Image src="/images/nhansu/tapthevien.jpg" alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
          <div className="org-hero-overlay" />
        </div>
        <motion.div
          className="org-hero-content vlu-news-container"
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div className="org-breadcrumb" variants={fadeUp} custom={0}>
            <a href="/">Trang chủ</a>
            <ChevronRight size={14} />
            <a href="/gioi-thieu">Giới thiệu</a>
            <ChevronRight size={14} />
            <span>Cơ cấu tổ chức</span>
          </motion.div>
          <motion.div className="org-hero-badge" variants={fadeUp} custom={1}>
            <Building2 size={15} /> Viện Đào tạo Sau Đại học
          </motion.div>
          <motion.h1 variants={fadeUp} custom={2}>
            Cơ cấu <span>tổ chức</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={3}>
            Đội ngũ lãnh đạo và chuyên viên tận tâm, chuyên nghiệp, luôn đồng hành cùng học viên
            trên hành trình phát triển sự nghiệp.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════ TEAM PHOTO ══════════ */}
      <section className="org-team-photo">
        <div className="vlu-news-container">
          <motion.div
            className="org-team-img"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <Image
              src="/images/nhansu/tapthevien.jpg"
              alt="Tập thể Viện Đào tạo Sau Đại học UFM"
              width={1200} height={500}
              style={{ width: '100%', height: 'auto', borderRadius: 20 }}
            />
            <div className="org-team-caption">
              <Users size={18} />
              <span>Tập thể Viện Đào tạo Sau Đại học – Trường Đại học Tài chính – Marketing</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ LEADERS ══════════ */}
      <section className="org-section org-leaders">
        <div className="vlu-news-container">
          <motion.div
            className="org-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="org-tag"><Award size={15} /> Ban lãnh đạo Viện</div>
            <h2>Lãnh đạo <span>Viện SĐH</span></h2>
          </motion.div>

          <div className="org-leaders-grid">
            {leaders.map((person, i) => (
              <motion.div
                key={i} className="org-leader-card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={scaleIn} custom={i}
              >
                <div className="org-leader-img">
                  <Image src={person.img} alt={person.name} width={280} height={340} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  <div className="org-leader-role-badge">{person.role}</div>
                </div>
                <div className="org-leader-info">
                  <h3>{person.name}</h3>
                  <p className="org-leader-role">{person.role}</p>
                  <p className="org-leader-desc">{person.desc}</p>
                  <div className="org-leader-contact">
                    <a href={`mailto:${person.email}`}><Mail size={14} /> {person.email}</a>
                    <a href={`tel:${person.phone.replace(/\./g, '')}`}><Phone size={14} /> {person.phone}</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ STAFF ══════════ */}
      <section className="org-section org-staff-section">
        <div className="org-section-bg-img">
          <Image src="/images/life/bg_ufm_3.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        </div>
        <div className="vlu-news-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="org-section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="org-tag"><Users size={15} /> Đội ngũ chuyên viên</div>
            <h2>Chuyên viên <span>tận tâm</span></h2>
            <p className="org-section-desc">
              Đội ngũ chuyên viên giàu kinh nghiệm, hỗ trợ toàn diện công tác đào tạo, tuyển sinh và quản lý học viên.
            </p>
          </motion.div>

          <div className="org-staff-grid">
            {staff.map((person, i) => (
              <motion.div
                key={i} className="org-staff-card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={scaleIn} custom={i % 4}
              >
                <div className="org-staff-avatar">
                  <Image src={person.img} alt={person.name} width={120} height={120} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </div>
                <h4>{person.name}</h4>
                <p className="org-staff-role">{person.role}</p>
                <p className="org-staff-area">{person.area}</p>
                <div className="org-staff-contact">
                  <a href={`mailto:${person.email}`} title={person.email}><Mail size={14} /></a>
                  <a href={`tel:${person.phone.replace(/\./g, '')}`} title={person.phone}><Phone size={14} /></a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="org-cta">
        <motion.div
          className="org-cta-inner vlu-news-container"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={0}
        >
          <h2>Liên hệ <span>Viện SĐH</span></h2>
          <p>Mọi thắc mắc về tuyển sinh, đào tạo, xin vui lòng liên hệ trực tiếp với chuyên viên phụ trách.</p>
          <div className="org-cta-btns">
            <a href="#" className="org-btn-primary">
              <GraduationCap size={18} /> Đăng ký tư vấn <ArrowRight size={16} />
            </a>
            <a href="/gioi-thieu" className="org-btn-outline">
              <Building2 size={18} /> Tổng quan Viện
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
