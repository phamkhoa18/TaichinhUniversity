'use client';

import Image from 'next/image';
import { ChevronRight, Calendar, User, Tag, Share2, Facebook, Linkedin, Clock, ArrowRight } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const recentNews = [
  { category: 'HỢP TÁC DOANH NGHIỆP', title: 'Tọa đàm "Xu hướng chuyển đổi số trong lĩnh vực Tài chính - Ngân hàng 2026"', img: '/images/life/bg_ufm.jpg' },
  { category: 'TUYỂN SINH', title: 'Trường Đại học Tài chính chính thức công bố đề án tuyển sinh Thạc sĩ, Tiến sĩ năm 2026', img: '/images/life/bg_ufm_2.jpg' },
  { category: 'CHUYỂN ĐỔI SỐ', title: 'Hệ sinh thái số UFM triển khai mô hình AI Chatbot RAG hỗ trợ tư vấn học viên 24/7', img: '/images/life/bg_ufm_3.jpg' },
  { category: 'HỌC THUẬT', title: 'Giao thoa giữa tối giản & hiện đại: Khai trương không gian nghiên cứu chuẩn quốc tế', img: '/images/life/bg_ufm_4.jpg' },
];

const recentEvents = [
  { title: 'Chương trình "Business Strategy & Sustainable Innovation"', date: '16 Th5, 2026', time: '08:00 - 17:00' },
  { title: 'Hội đồng đánh giá Luận án Tiến sĩ cấp Viện đợt 1 năm 2026', date: '10 Th5, 2026', time: '09:00 - 12:00' },
  { title: 'Discovery Day 2026 – Trải nghiệm không gian hệ sinh thái số', date: '04 Th5, 2026', time: '08:30 - 16:30' },
];

export default function NewsDetailPage() {
  return (
    <>
      <Header />

      <main className="news-detail-main">
        {/* ══════ HERO SECTION (full-width) ══════ */}
        <section className="news-hero">
          <div className="news-hero-inner vlu-news-container">
            {/* Breadcrumb */}
            <nav className="news-breadcrumb">
              <a href="/">Trang chủ</a>
              <ChevronRight size={14} />
              <a href="/news">Tin tức & Sự kiện</a>
              <ChevronRight size={14} />
              <a href="#">Tin Tức</a>
              <ChevronRight size={14} />
              <span className="news-breadcrumb-current">Sinh viên Khoa Tài chính...</span>
            </nav>

            {/* Title */}
            <h1 className="news-hero-title">
              Sinh viên Khoa Tài chính - Ngân hàng &ldquo;giải mã&rdquo; phân tích kỹ thuật cùng chuyên gia: Góc nhìn đầu tư trên thị trường chứng khoán - Vàng - Forex
            </h1>

            {/* Meta row */}
            <div className="news-hero-meta">
              <div className="news-hero-meta-left">
                <span className="news-meta-item">
                  <User size={15} />
                  <strong>TÁC GIẢ:</strong> Ban Truyền thông
                </span>
                <span className="news-meta-item">
                  <Calendar size={15} />
                  <strong>NGÀY:</strong> 12 Tháng 3, 2026
                </span>
              </div>
              <div className="news-share-row">
                <a href="#" className="news-share-btn"><Facebook size={16} /></a>
                <a href="#" className="news-share-btn"><Linkedin size={16} /></a>
                <a href="#" className="news-share-btn"><Share2 size={16} /></a>
              </div>
            </div>

            {/* Featured Image (full container width, big rounded corners) */}
            <div className="news-hero-image">
              <Image
                src="/images/life/bg_ufm_5.jpg"
                alt="Sinh viên tham gia chuyên đề phân tích kỹ thuật"
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                priority
              />
            </div>
          </div>
        </section>

        {/* ══════ CONTENT SECTION (2 columns) ══════ */}
        <section className="news-content">
          <div className="news-content-inner vlu-news-container">
            <div className="news-grid">

              {/* LEFT: Article body */}
              <article className="news-article">
                <p className="news-article-intro">
                  Sáng ngày 12/3/2026, tại Trung tâm Mô phỏng Ngân hàng & Chứng khoán của Khoa Tài chính - Ngân hàng, các sinh viên đang tham gia học phần Phân tích Đầu tư chứng khoán đã được chia sẻ chuyên đề với sự tham gia của khách mời là ThS. Bùi Việt Cường – Giám đốc Phát triển Kinh doanh tại Public Bank Vietnam Securities Company Limited.
                </p>

                <p>
                  Chương trình được tổ chức dành cho các sinh viên chuyên ngành Đầu tư tài chính của Khoa Tài chính – Ngân hàng nhằm giúp sinh viên tiếp cận những góc nhìn thực tiễn từ thị trường tài chính thông qua kinh nghiệm của chuyên gia trong ngành.
                </p>

                <figure className="news-article-figure">
                  <div className="news-article-img-wrap">
                    <Image src="/images/life/bg_ufm_6.jpg" alt="Chuyên gia chia sẻ tại hội thảo" fill sizes="(max-width: 900px) 100vw, 800px" />
                  </div>
                  <figcaption>ThS. Bùi Việt Cường chia sẻ kinh nghiệm thực tế về phân tích kỹ thuật tại buổi chuyên đề</figcaption>
                </figure>

                <p>Trong buổi chia sẻ, ThS. Bùi Việt Cường đã giới thiệu nhiều nội dung thiết thực như:</p>

                <ul className="news-article-list">
                  <li>Tổng quan về phân tích kỹ thuật trong đầu tư chứng khoán;</li>
                  <li>Các công cụ và phương pháp nhận diện xu hướng thị trường;</li>
                  <li>Kinh nghiệm thực tế trong xây dựng chiến lược đầu tư;</li>
                  <li>Góc nhìn về cơ hội và rủi ro trên các thị trường tài chính như chứng khoán, vàng và Forex.</li>
                </ul>

                <p>
                  Thông qua những ví dụ thực tế và các tình huống phân tích trên thị trường, sinh viên đã có cơ hội hiểu rõ hơn cách vận dụng kiến thức học thuật vào thực tiễn đầu tư, đồng thời tiếp cận tư duy phân tích thị trường một cách có hệ thống và kỷ luật.
                </p>

                <figure className="news-article-figure">
                  <div className="news-article-img-wrap">
                    <Image src="/images/life/bg_ufm_2.jpg" alt="Sinh viên trao đổi với chuyên gia" fill sizes="(max-width: 900px) 100vw, 800px" />
                  </div>
                  <figcaption>Sinh viên sôi nổi trao đổi với chuyên gia về chiến lược đầu tư và tâm lý thị trường</figcaption>
                </figure>

                <p>
                  Buổi chia sẻ diễn ra trong không khí sôi nổi với nhiều câu hỏi trao đổi giữa sinh viên và chuyên gia xoay quanh chiến lược đầu tư, tâm lý thị trường và xu hướng tài chính hiện nay.
                </p>

                <p>
                  Việc mời chuyên gia tham gia giảng dạy và chia sẻ trong lớp học là một trong những hoạt động được Khoa Tài chính – Ngân hàng đẩy mạnh nhằm tăng cường kết nối giữa đào tạo học thuật và thực tiễn nghề nghiệp, giúp sinh viên có thêm trải nghiệm thực tế ngay trong quá trình học tập.
                </p>

                <p>
                  Khoa Tài chính - Ngân hàng trân trọng cảm ơn ThS. Bùi Việt Cường đã dành thời gian tham gia chương trình và mang đến những chia sẻ giá trị cho sinh viên.
                </p>

                {/* Credit */}
                <div className="news-article-credit">
                  <p><strong>Tin:</strong> Minh Lan</p>
                  <p><strong>Hình:</strong> Minh Lan</p>
                </div>

                {/* Tags */}
                <div className="news-article-tags">
                  <span className="news-tags-label"><Tag size={16} /> Thẻ</span>
                  <a href="#" className="news-tag">Hoạt Động Sinh Viên</a>
                  <a href="#" className="news-tag">Khoa Tài Chính - Ngân Hàng</a>
                  <a href="#" className="news-tag">Hợp Tác Doanh Nghiệp</a>
                </div>
              </article>

              {/* RIGHT: Sidebar */}
              <aside className="news-sidebar">
                {/* Recent News Widget */}
                <div className="news-widget">
                  <h3 className="news-widget-title">Tin tức gần đây</h3>
                  <div className="news-widget-list">
                    {recentNews.map((item, idx) => (
                      <a href="#" key={idx} className="news-widget-card">
                        <div className="news-widget-thumb">
                          <Image src={item.img} alt={item.title} fill />
                        </div>
                        <div className="news-widget-info">
                          <span className="news-widget-cat">{item.category}</span>
                          <h4 className="news-widget-card-title">{item.title}</h4>
                        </div>
                      </a>
                    ))}
                  </div>
                  <a href="/news" className="news-widget-more">
                    Khám phá tất cả các tin tức <ArrowRight size={16} />
                  </a>
                </div>

                {/* Recent Events Widget */}
                <div className="news-widget">
                  <h3 className="news-widget-title">Sự kiện gần đây</h3>
                  <div className="news-widget-list">
                    {recentEvents.map((ev, idx) => (
                      <a href="#" key={idx} className="news-event-item">
                        <h4 className="news-event-title">{ev.title}</h4>
                        <div className="news-event-meta">
                          <span><Calendar size={13} /> {ev.date}</span>
                          <span><Clock size={13} /> {ev.time}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <a href="/news" className="news-widget-more">
                    Khám phá tất cả các sự kiện <ArrowRight size={16} />
                  </a>
                </div>
              </aside>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
