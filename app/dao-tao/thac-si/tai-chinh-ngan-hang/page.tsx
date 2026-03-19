'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  GraduationCap, Clock, CreditCard, BookOpen,
  ChevronRight, Award, Search, Briefcase,
  FileText, Languages, BookCheck, ArrowRight,
  Building2, TrendingUp, Users, Globe,
  Microscope, FlaskConical, Target,
  BadgePercent, Heart, Phone, Download,
  CheckCircle2
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import './program.css';

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
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
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function ThacSiTaiChinhNganHang() {
  return (
    <>
      <Header />

      {/* ══════════ HERO ══════════ */}
      <section className="program-hero">
        <div className="program-hero-bg">
          <Image
            src="/images/finance-masters-hero.png"
            alt="Finance Masters Program"
            fill
            sizes="100vw"
            priority
          />
          <div className="program-hero-overlay" />
        </div>

        <motion.div
          className="program-hero-content"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Breadcrumb */}
          <motion.div className="program-breadcrumb" variants={fadeUp} custom={0}>
            <a href="/">Trang chủ</a>
            <ChevronRight size={14} className="separator" />
            <a href="#">Đào tạo</a>
            <ChevronRight size={14} className="separator" />
            <a href="#">Thạc sĩ</a>
            <ChevronRight size={14} className="separator" />
            <span style={{ color: 'var(--ufm-gold)' }}>Tài chính – Ngân hàng</span>
          </motion.div>

          <motion.div className="program-hero-badge" variants={fadeUp} custom={1}>
            <GraduationCap size={14} /> Chương trình Thạc sĩ
          </motion.div>

          <motion.h1 className="program-hero-title" variants={fadeUp} custom={2}>
            Thạc sĩ <span>Tài chính – Ngân hàng</span>
          </motion.h1>

          <motion.p className="program-hero-desc" variants={fadeUp} custom={3}>
            Chương trình đào tạo chuyên sâu, kiến tạo thế hệ lãnh đạo tài chính kế tiếp 
            với triết lý &quot;Thực chất, đổi mới sáng tạo và hội nhập&quot;.
          </motion.p>

          <motion.div className="program-hero-meta" variants={fadeUp} custom={4}>
            <div className="program-meta-item">
              <div className="program-meta-icon"><Clock size={20} /></div>
              <div className="program-meta-text">
                <span className="program-meta-label">Thời gian</span>
                <span className="program-meta-value">2 năm</span>
              </div>
            </div>
            <div className="program-meta-item">
              <div className="program-meta-icon"><BookOpen size={20} /></div>
              <div className="program-meta-text">
                <span className="program-meta-label">Tín chỉ</span>
                <span className="program-meta-value">61 tín chỉ</span>
              </div>
            </div>
            <div className="program-meta-item">
              <div className="program-meta-icon"><CreditCard size={20} /></div>
              <div className="program-meta-text">
                <span className="program-meta-label">Mã ngành</span>
                <span className="program-meta-value">8340201</span>
              </div>
            </div>
            <div className="program-meta-item">
              <div className="program-meta-icon"><Award size={20} /></div>
              <div className="program-meta-text">
                <span className="program-meta-label">Bằng cấp</span>
                <span className="program-meta-value">Thạc sĩ</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ STICKY NAV ══════════ */}
      <nav className="program-nav">
        <div className="program-nav-inner">
          <ul className="program-nav-links">
            <li><a href="#overview" className="active">Tổng quan</a></li>
            <li><a href="#orientation">Định hướng</a></li>
            <li><a href="#admission">Xét tuyển</a></li>
            <li><a href="#career">Nghề nghiệp</a></li>
            <li><a href="#benefits">Ưu đãi</a></li>
          </ul>
          <a href="#cta" className="program-nav-cta">
            <GraduationCap size={16} /> Đăng ký ngay
          </a>
        </div>
      </nav>

      {/* ══════════ OVERVIEW ══════════ */}
      <section className="program-section" id="overview">
        <div className="vlu-news-container">
          <div className="overview-grid">
            <motion.div
              className="overview-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeLeft}
            >
              <div className="section-tag" style={{ marginBottom: 16 }}>
                <BookOpen size={16} /> Giới thiệu
              </div>
              <h2>
                Giới thiệu chương trình ngành <span>Tài chính – Ngân hàng</span>
              </h2>
              <p>
                Chương trình đào tạo thạc sĩ ngành Tài chính - Ngân hàng tại Trường Đại học Tài chính – Marketing 
                được xây dựng dựa trên triết lý giáo dục <strong>&quot;Thực chất, đổi mới sáng tạo và hội nhập&quot;</strong>. 
                Chương trình được thiết kế linh hoạt theo hệ thống tín chỉ, cập nhật liên tục nhằm đáp ứng nhu cầu 
                của người học và nhà tuyển dụng trong bối cảnh kinh tế toàn cầu.
              </p>
              <p>
                Năm 2026, chương trình cung cấp hai định hướng đào tạo chuyên biệt để người học lựa chọn phù hợp 
                với mục tiêu nghề nghiệp.
              </p>
              <div className="overview-highlight">
                <p>
                  <Clock size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  Thời gian đào tạo trung bình là <strong>02 năm</strong> (tối đa 04 năm) với tổng khối lượng 
                  kiến thức toàn khóa là <strong>61 tín chỉ</strong>.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="overview-visual"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeRight}
            >
              <div className="overview-card-stack">
                <motion.div
                  className="overview-card overview-card-1"
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={scaleIn} custom={0}
                >
                  <div className="overview-card-icon blue">
                    <Microscope size={24} />
                  </div>
                  <h4>Định hướng Nghiên cứu</h4>
                  <p>Phát triển tư duy hàn lâm, năng lực nghiên cứu độc lập</p>
                </motion.div>

                <motion.div
                  className="overview-card overview-card-2"
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={scaleIn} custom={1}
                >
                  <div className="overview-card-icon gold">
                    <TrendingUp size={24} />
                  </div>
                  <h4>Định hướng Ứng dụng</h4>
                  <p>Kỹ năng thực hành, năng lực quản trị doanh nghiệp</p>
                </motion.div>

                <motion.div
                  className="overview-card overview-card-3"
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={scaleIn} custom={2}
                >
                  <div className="overview-card-icon teal">
                    <Globe size={24} />
                  </div>
                  <h4>Hội nhập quốc tế</h4>
                  <p>Chương trình đạt chuẩn quốc tế, cập nhật xu hướng toàn cầu</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ ORIENTATION / ĐỊNH HƯỚNG ══════════ */}
      <section className="program-section orientation-section" id="orientation">
        <div className="vlu-news-container">
          <motion.div
            className="section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="section-tag"><Target size={16} /> Định hướng đào tạo</div>
            <h2 className="section-title">Hai định hướng <span>chuyên biệt</span></h2>
            <p className="section-subtitle">
              Lựa chọn lộ trình phù hợp với mục tiêu nghề nghiệp của bạn
            </p>
          </motion.div>

          <div className="orientation-grid">
            {/* Research */}
            <motion.div
              className="orientation-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <div className="orientation-badge research">
                <Microscope size={14} /> Nghiên cứu
              </div>
              <div className="orientation-icon blue">
                <FlaskConical size={32} />
              </div>
              <h3>Định hướng Nghiên cứu</h3>
              <p>
                Tập trung vào phát triển tư duy hàn lâm, năng lực nghiên cứu độc lập, phát hiện và giải quyết 
                các vấn đề lý luận chuyên sâu.
              </p>
              <ul className="orientation-features">
                <li>
                  <span className="check-icon blue"><CheckCircle2 size={14} /></span>
                  Phát triển tư duy hàn lâm chuyên sâu
                </li>
                <li>
                  <span className="check-icon blue"><CheckCircle2 size={14} /></span>
                  Năng lực nghiên cứu độc lập
                </li>
                <li>
                  <span className="check-icon blue"><CheckCircle2 size={14} /></span>
                  Phù hợp giảng viên, nghiên cứu viên
                </li>
                <li>
                  <span className="check-icon blue"><CheckCircle2 size={14} /></span>
                  Nền tảng vững chắc để học lên Tiến sĩ
                </li>
              </ul>
            </motion.div>

            {/* Applied */}
            <motion.div
              className="orientation-card gold"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={1}
            >
              <div className="orientation-badge applied">
                <Briefcase size={14} /> Ứng dụng
              </div>
              <div className="orientation-icon gold">
                <TrendingUp size={32} />
              </div>
              <h3>Định hướng Ứng dụng</h3>
              <p>
                Tập trung vào kỹ năng thực hành, năng lực quản trị và giải quyết các vấn đề thực tiễn 
                tại doanh nghiệp và tổ chức.
              </p>
              <ul className="orientation-features">
                <li>
                  <span className="check-icon gold"><CheckCircle2 size={14} /></span>
                  Kỹ năng thực hành chuyên nghiệp
                </li>
                <li>
                  <span className="check-icon gold"><CheckCircle2 size={14} /></span>
                  Năng lực quản trị doanh nghiệp
                </li>
                <li>
                  <span className="check-icon gold"><CheckCircle2 size={14} /></span>
                  Phù hợp nhà quản lý, CEO, CFO
                </li>
                <li>
                  <span className="check-icon gold"><CheckCircle2 size={14} /></span>
                  Giải quyết vấn đề thực tiễn
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ ADMISSION / XÉT TUYỂN ══════════ */}
      <section className="program-section admission-section" id="admission">
        <div className="vlu-news-container">
          <motion.div
            className="admission-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="section-tag">
              <FileText size={16} /> Tuyển sinh
            </div>
            <h2>Điều kiện <span>xét tuyển</span></h2>
            <p>Đáp ứng các tiêu chuẩn sau để tham gia xét tuyển chương trình</p>
          </motion.div>

          <div className="admission-grid">
            <motion.div className="admission-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={scaleIn} custom={0}
            >
              <div className="admission-card-icon"><Award size={22} /></div>
              <h4>Văn bằng</h4>
              <p>
                Đã tốt nghiệp đại học ngành Tài chính - Ngân hàng hoặc các ngành phù hợp / ngành gần / ngành khác 
                (có bổ sung kiến thức).
              </p>
            </motion.div>

            <motion.div className="admission-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={scaleIn} custom={1}
            >
              <div className="admission-card-icon"><Search size={22} /></div>
              <h4>Phương thức tuyển sinh</h4>
              <p>
                Xét tuyển dựa trên hồ sơ văn bằng, kết quả học tập đại học và năng lực ngoại ngữ.
              </p>
            </motion.div>

            <motion.div className="admission-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={scaleIn} custom={2}
            >
              <div className="admission-card-icon"><BookCheck size={22} /></div>
              <h4>Môn xét tuyển</h4>
              <p>
                Đánh giá năng lực qua hai môn cơ sở ngành: <strong>Kinh tế học</strong> và <strong>Tài chính tiền tệ</strong>.
              </p>
            </motion.div>

            <motion.div className="admission-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={scaleIn} custom={3}
            >
              <div className="admission-card-icon"><Languages size={22} /></div>
              <h4>Trình độ ngoại ngữ</h4>
              <p>
                Đạt năng lực ngoại ngữ từ Bậc 3/6 trở lên theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam 
                hoặc sở hữu các văn bằng, chứng chỉ tương đương.
              </p>
            </motion.div>
          </div>

          {/* Supplementary knowledge */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div style={{ textAlign: 'center', marginTop: 60, position: 'relative', zIndex: 2 }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', color: 'var(--white)', marginBottom: 8, fontWeight: 700 }}>
                Bổ sung kiến thức
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto' }}>
                Dành cho ứng viên tốt nghiệp không đúng chuyên ngành
              </p>
            </div>
          </motion.div>

          <div className="supplement-cards">
            <motion.div className="supplement-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <h5><BookOpen size={16} /> Ngành gần — Bổ sung 02 môn (5 TC)</h5>
              <ul>
                <li><CheckCircle2 size={14} style={{ color: 'var(--ufm-gold)', flexShrink: 0 }} /> Kinh tế học (3 TC)</li>
                <li><CheckCircle2 size={14} style={{ color: 'var(--ufm-gold)', flexShrink: 0 }} /> Tài chính tiền tệ (2 TC)</li>
              </ul>
            </motion.div>

            <motion.div className="supplement-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={1}
            >
              <h5><BookOpen size={16} /> Ngành khác — Bổ sung 04 môn (9 TC)</h5>
              <ul>
                <li><CheckCircle2 size={14} style={{ color: 'var(--ufm-gold)', flexShrink: 0 }} /> Kinh tế học (3 TC)</li>
                <li><CheckCircle2 size={14} style={{ color: 'var(--ufm-gold)', flexShrink: 0 }} /> Tài chính tiền tệ (2 TC)</li>
                <li><CheckCircle2 size={14} style={{ color: 'var(--ufm-gold)', flexShrink: 0 }} /> Tài chính doanh nghiệp (2 TC)</li>
                <li><CheckCircle2 size={14} style={{ color: 'var(--ufm-gold)', flexShrink: 0 }} /> Nguyên lý kế toán (2 TC)</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ CAREER ══════════ */}
      <section className="program-section" id="career">
        <div className="vlu-news-container">
          <motion.div
            className="section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="section-tag"><Briefcase size={16} /> Cơ hội nghề nghiệp</div>
            <h2 className="section-title">Cơ hội nghề nghiệp <span>rộng mở</span></h2>
            <p className="section-subtitle">
              Sau khi tốt nghiệp, Thạc sĩ Tài chính - Ngân hàng có thể đảm nhiệm các vị trí
            </p>
          </motion.div>

          <div className="career-grid">
            {/* Applied group */}
            <motion.div className="career-group"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <div className="career-group-header">
                <div className="career-group-icon gold"><Briefcase size={24} /></div>
                <div>
                  <h3>Quản lý & Thực hành</h3>
                  <small>Định hướng Ứng dụng</small>
                </div>
              </div>
              <ul className="career-list">
                <li>
                  <span className="career-dot gold" />
                  Giám đốc tài chính (CFO), Giám đốc điều hành (CEO) tại các doanh nghiệp, tập đoàn đa quốc gia
                </li>
                <li>
                  <span className="career-dot gold" />
                  Lãnh đạo tại các ngân hàng thương mại, định chế tài chính, quỹ đầu tư
                </li>
                <li>
                  <span className="career-dot gold" />
                  Cán bộ quản lý tại cơ quan nhà nước: Thuế, Kho bạc, Hải quan, Sở Tài chính, Bộ Tài chính
                </li>
              </ul>
            </motion.div>

            {/* Research group */}
            <motion.div className="career-group"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={1}
            >
              <div className="career-group-header">
                <div className="career-group-icon blue"><Microscope size={24} /></div>
                <div>
                  <h3>Nghiên cứu & Giảng dạy</h3>
                  <small>Định hướng Nghiên cứu</small>
                </div>
              </div>
              <ul className="career-list">
                <li>
                  <span className="career-dot blue" />
                  Giảng viên giảng dạy tại các trường Đại học, Cao đẳng khối ngành kinh tế
                </li>
                <li>
                  <span className="career-dot blue" />
                  Nghiên cứu viên, chuyên gia hoạch định chính sách tại Viện nghiên cứu, cơ quan Chính phủ
                </li>
                <li>
                  <span className="career-dot blue" />
                  Tiếp tục nghiên cứu ở bậc học cao hơn (Tiến sĩ) trong và ngoài nước
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ BENEFITS / ƯU ĐÃI ══════════ */}
      <section className="program-section benefits-section" id="benefits">
        <div className="vlu-news-container">
          <motion.div
            className="section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="section-tag"><BadgePercent size={16} /> Chính sách ưu đãi</div>
            <h2 className="section-title">Ưu đãi <span>học phí</span></h2>
            <p className="section-subtitle">Chính sách học phí ưu đãi dành cho học viên</p>
          </motion.div>

          <div className="benefits-wrapper">
            <motion.div className="benefit-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <div className="benefit-percentage">-10%</div>
              <div className="benefit-content">
                <h4>Cựu sinh viên của Trường</h4>
                <p>Giảm 10% học phí đối với học viên là cựu sinh viên của Trường Đại học Tài chính – Marketing.</p>
              </div>
            </motion.div>

            <motion.div className="benefit-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={1}
            >
              <div className="benefit-percentage">-5%</div>
              <div className="benefit-content">
                <h4>Người thân đang học cao học</h4>
                <p>Giảm 5% học phí đối với học viên có người thân đã và đang học cao học tại Trường.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="program-cta" id="cta">
        <motion.div className="program-cta-inner"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={0}
        >
          <h2>Sẵn sàng nâng tầm <span>sự nghiệp</span>?</h2>
          <p>
            Đăng ký ngay hôm nay để nhận thông tin tuyển sinh, tư vấn chương trình 
            và các chính sách ưu đãi học phí đặc biệt.
          </p>
          <div className="program-cta-buttons">
            <a href="#" className="hero-btn hero-btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
              <GraduationCap size={20} /> Đăng ký tuyển sinh <ArrowRight size={18} />
            </a>
            <a href="#" className="hero-btn hero-btn-outline" style={{ fontSize: '1rem', padding: '16px 36px' }}>
              <Download size={18} /> Tải brochure
            </a>
            <a href="#" className="hero-btn hero-btn-outline" style={{ fontSize: '1rem', padding: '16px 36px' }}>
              <Phone size={18} /> Liên hệ tư vấn
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
