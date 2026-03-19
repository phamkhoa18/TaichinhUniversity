'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search, ChevronRight, CalendarDays, Clock,
  ArrowRight, Tag, Filter, Grid3X3, List,
  Newspaper, GraduationCap, BookOpen, Users,
  Briefcase, Award
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import './news.css';

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

/* ─── Categories ─── */
const categories = [
  { label: 'Tất cả', value: 'all', icon: <Newspaper size={15} /> },
  { label: 'Tuyển sinh', value: 'tuyen-sinh', icon: <GraduationCap size={15} /> },
  { label: 'Học thuật', value: 'hoc-thuat', icon: <BookOpen size={15} /> },
  { label: 'Sự kiện', value: 'su-kien', icon: <Users size={15} /> },
  { label: 'Hợp tác', value: 'hop-tac', icon: <Briefcase size={15} /> },
  { label: 'Thành tựu', value: 'thanh-tuu', icon: <Award size={15} /> },
];

/* ─── Featured ─── */
const featuredArticle = {
  slug: 'tuyen-sinh-thac-si-dot-1-2026',
  image: '/images/life/bg_ufm_4.jpg',
  category: 'Tuyển sinh',
  date: '15/03/2026',
  readTime: '5 phút đọc',
  title: 'Thông báo tuyển sinh trình độ Thạc sĩ đợt 1 năm 2026 – Viện Đào tạo Sau Đại học UFM',
  excerpt: 'Viện Đào tạo Sau Đại học UFM chính thức mở đơn xét tuyển chương trình Thạc sĩ đợt 1/2026 với 9 ngành đào tạo. Ưu đãi giảm 10% học phí dành cho cựu sinh viên UFM.',
};

/* ─── Articles ─── */
const articles = [
  {
    slug: 'tuyen-sinh-tien-si-2026',
    image: '/images/life/bg_ufm_5.jpg',
    category: 'Tuyển sinh',
    date: '12/03/2026',
    readTime: '4 phút đọc',
    title: 'Thông báo tuyển sinh trình độ Tiến sĩ đợt 1 năm 2026 – Chuyên ngành QTKD, TCNH, QLKT',
    excerpt: 'Ba chuyên ngành Tiến sĩ mở đăng ký xét tuyển đợt đầu tiên trong năm 2026 với nhiều chính sách hỗ trợ nghiên cứu sinh.',
  },
  {
    slug: 'hoi-thao-fintech-ai-2026',
    image: '/images/life/bg_ufm_6.jpg',
    category: 'Học thuật',
    date: '08/03/2026',
    readTime: '3 phút đọc',
    title: 'Hội thảo khoa học quốc tế "Fintech, AI và Tài chính bền vững trong kỷ nguyên chuyển đổi số"',
    excerpt: 'Sự kiện quy tụ hơn 200 nhà khoa học, chuyên gia trong và ngoài nước, chia sẻ nghiên cứu về ứng dụng AI trong tài chính.',
  },
  {
    slug: 'bao-ve-luan-an-tien-si-qtkd',
    image: '/images/life/bg_ufm_2.jpg',
    category: 'Học thuật',
    date: '05/03/2026',
    readTime: '2 phút đọc',
    title: 'Hội đồng đánh giá Luận án Tiến sĩ cấp Viện – Chuyên ngành Quản trị Kinh doanh đợt 1/2026',
    excerpt: 'NCS Nguyễn Văn A đã bảo vệ thành công luận án với đề tài nghiên cứu về chiến lược quản trị trong bối cảnh hậu đại dịch.',
  },
  {
    slug: 'uu-dai-hoc-phi-cuu-sv',
    image: '/images/life/bg_ufm_3.jpg',
    category: 'Tuyển sinh',
    date: '01/03/2026',
    readTime: '2 phút đọc',
    title: 'Giảm 10% học phí cho cựu sinh viên UFM – Cam kết ổn định học phí toàn khóa Thạc sĩ',
    excerpt: 'Chính sách ưu đãi đặc biệt dành cho cựu sinh viên UFM đăng ký chương trình Thạc sĩ, áp dụng từ đợt 1/2026.',
  },
  {
    slug: 'discovery-day-2026',
    image: '/images/life/bg_ufm.jpg',
    category: 'Sự kiện',
    date: '25/02/2026',
    readTime: '3 phút đọc',
    title: 'Discovery Day 2026 – Trải nghiệm không gian học tập và giao lưu cùng Giảng viên, Cựu học viên',
    excerpt: 'Ngày hội mở cửa dành cho các ứng viên tiềm năng, trải nghiệm thực tế môi trường học tập tại Viện SĐH UFM.',
  },
  {
    slug: 'hop-tac-deloitte-2026',
    image: '/images/life/bg_ufm_4.jpg',
    category: 'Hợp tác',
    date: '20/02/2026',
    readTime: '4 phút đọc',
    title: 'UFM ký kết hợp tác chiến lược cùng Deloitte Vietnam – Nâng tầm nghiên cứu ứng dụng',
    excerpt: 'Thỏa thuận hợp tác tạo cơ hội thực tập, nghiên cứu thực tiễn cho học viên cao học tại một trong Big4 kiểm toán.',
  },
  {
    slug: 'xuat-sac-nghien-cuu-2025',
    image: '/images/life/bg_ufm_5.jpg',
    category: 'Thành tựu',
    date: '15/02/2026',
    readTime: '3 phút đọc',
    title: 'Học viên Viện SĐH UFM đạt giải Xuất sắc tại Hội nghị Nghiên cứu Khoa học Trẻ toàn quốc',
    excerpt: 'Công trình nghiên cứu về mô hình tài chính xanh được đánh giá cao bởi Hội đồng khoa học cấp quốc gia.',
  },
  {
    slug: 'tot-nghiep-thac-si-k23',
    image: '/images/life/bg_ufm_6.jpg',
    category: 'Sự kiện',
    date: '10/02/2026',
    readTime: '2 phút đọc',
    title: 'Lễ tốt nghiệp và trao bằng Thạc sĩ Khóa 23 – Hơn 350 tân Thạc sĩ nhận bằng',
    excerpt: 'Buổi lễ trang trọng đánh dấu cột mốc quan trọng của hơn 350 học viên đã hoàn thành chương trình Thạc sĩ.',
  },
  {
    slug: 'chuong-trinh-marketing-2026',
    image: '/images/life/bg_ufm_2.jpg',
    category: 'Tuyển sinh',
    date: '05/02/2026',
    readTime: '3 phút đọc',
    title: 'Ra mắt chương trình Thạc sĩ Marketing – Chiến lược thương hiệu trong kỷ nguyên số',
    excerpt: 'Chương trình mới nhất của Viện SĐH, đáp ứng nhu cầu nhân lực gấp về marketing số và phân tích dữ liệu.',
  },
];

export default function TinTucPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredArticles = articles.filter(article => {
    const matchCat = activeCategory === 'all' || article.category === categories.find(c => c.value === activeCategory)?.label;
    const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Header />

      {/* ══════════ HERO ══════════ */}
      <section className="news-hero">
        <div className="news-hero-bg">
          <Image src="/images/life/bg_ufm_4.jpg" alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
          <div className="news-hero-overlay" />
        </div>
        <motion.div
          className="news-hero-content vlu-news-container"
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div className="news-breadcrumb" variants={fadeUp} custom={0}>
            <a href="/">Trang chủ</a>
            <ChevronRight size={14} />
            <span>Tin tức & Sự kiện</span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1}>
            Tin tức & <span>Sự kiện</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2}>
            Cập nhật những thông tin mới nhất từ Viện Đào tạo Sau Đại học – Đại học Tài chính – Marketing
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════ FEATURED ══════════ */}
      <section className="news-featured-section">
        <div className="vlu-news-container">
          <motion.a
            href={`/news/${featuredArticle.slug}`}
            className="news-featured-card"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="news-featured-img">
              <Image src={featuredArticle.image} alt={featuredArticle.title} fill sizes="800px" style={{ objectFit: 'cover' }} />
              <div className="news-featured-badge">
                <Tag size={13} /> {featuredArticle.category}
              </div>
            </div>
            <div className="news-featured-body">
              <div className="news-featured-meta">
                <span><CalendarDays size={14} /> {featuredArticle.date}</span>
                <span><Clock size={14} /> {featuredArticle.readTime}</span>
              </div>
              <h2>{featuredArticle.title}</h2>
              <p>{featuredArticle.excerpt}</p>
              <span className="news-featured-cta">
                Đọc tiếp <ArrowRight size={16} />
              </span>
            </div>
          </motion.a>
        </div>
      </section>

      {/* ══════════ FILTER + LISTING ══════════ */}
      <section className="news-listing-section">
        <div className="vlu-news-container">
          {/* Toolbar */}
          <motion.div
            className="news-toolbar"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <div className="news-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="news-view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            className="news-categories"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={1}
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`news-cat-btn ${activeCategory === cat.value ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Articles Grid */}
          <div className={`news-grid ${viewMode === 'list' ? 'news-grid-list' : ''}`}>
            {filteredArticles.map((article, idx) => (
              <motion.a
                key={article.slug}
                href={`/news/${article.slug}`}
                className="news-card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={idx % 3}
              >
                <div className="news-card-img">
                  <Image src={article.image} alt={article.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                  <div className="news-card-cat">
                    <Tag size={11} /> {article.category}
                  </div>
                </div>
                <div className="news-card-body">
                  <div className="news-card-meta">
                    <span><CalendarDays size={13} /> {article.date}</span>
                    <span><Clock size={13} /> {article.readTime}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <span className="news-card-readmore">
                    Đọc tiếp <ChevronRight size={15} />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="news-empty">
              <Search size={48} />
              <h3>Không tìm thấy bài viết</h3>
              <p>Thử thay đổi từ khóa hoặc danh mục tìm kiếm</p>
            </div>
          )}

          {/* Pagination */}
          <motion.div
            className="news-pagination"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
          >
            <button className="news-page-btn active">1</button>
            <button className="news-page-btn">2</button>
            <button className="news-page-btn">3</button>
            <span className="news-page-dots">...</span>
            <button className="news-page-btn">12</button>
            <button className="news-page-btn news-page-next">
              Tiếp <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
