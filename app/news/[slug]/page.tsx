import Image from 'next/image';
import { format } from 'date-fns';
import { ChevronRight, Calendar, User, Tag, Share2, Facebook, Linkedin, Clock, ArrowRight, FileText, Download, Maximize2 } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import connectToDatabase from '@/lib/db/mongodb';
import News from '@/models/News';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClientTableOfContents from '@/app/components/ClientTableOfContents';
import PdfViewerClient from '@/app/components/PdfViewerClient';
import ImageZoomWrapper from '@/app/components/ImageZoomWrapper';

export const dynamic = 'force-dynamic';

const recentEvents = [
  { title: 'Chương trình "Business Strategy & Sustainable Innovation"', date: '16 Th5, 2026', time: '08:00 - 17:00' },
  { title: 'Hội đồng đánh giá Luận án Tiến sĩ cấp Viện đợt 1 năm 2026', date: '10 Th5, 2026', time: '09:00 - 12:00' },
  { title: 'Discovery Day 2026 – Trải nghiệm không gian hệ sinh thái số', date: '04 Th5, 2026', time: '08:30 - 16:30' },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const news = await News.findOne({ slug, status: 'PUBLISHED' }).lean();
  if (!news) return { title: 'Không tìm thấy bài viết' };

  return {
    title: news.title + ' | Viện Đào tạo Sau Đại học UFM',
    description: news.seoDescription || news.excerpt || 'Tin tức Viện Đào Tạo Sau Đại Học UFM',
    openGraph: {
      title: news.title,
      description: news.seoDescription || news.excerpt || '',
      images: [news.thumbnail || '/images/life/bg_ufm_5.jpg'],
    }
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();

  const news: any = await News.findOne({ slug, status: 'PUBLISHED' })
    .populate('category', 'name slug color')
    .populate('author', 'name')
    .lean();

  if (!news) {
    notFound();
  }

  const recentNews = await News.find({ slug: { $ne: slug }, status: 'PUBLISHED' })
    .sort({ publishedAt: -1 })
    .limit(4)
    .populate('category', 'name slug color')
    .lean();

  return (
    <>
      <Header />

      <main className="news-detail-main">
        {/* ══════ HERO SECTION (full-width) ══════ */}
        <section className="news-hero">
          <div className="news-hero-inner vlu-news-container">
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-2 mb-7 text-[0.85rem] text-slate-500 min-w-0">
              <a href="/" className="whitespace-nowrap hover:text-[#005496] transition-colors">Trang chủ</a>
              <ChevronRight size={14} className="shrink-0" />
              <a href="/news" className="whitespace-nowrap hover:text-[#005496] transition-colors">Tin tức & Sự kiện</a>
              <ChevronRight size={14} className="shrink-0" />
              <span className="truncate min-w-0 flex-1 text-[#005496] font-semibold">{news.title}</span>
            </nav>

            {/* Title */}
            <h1 className="news-hero-title">
              {news.title}
            </h1>

            {/* Meta row */}
            <div className="news-hero-meta">
              <div className="news-hero-meta-left">
                <span className="news-meta-item">
                  <User size={15} />
                  <strong>TÁC GIẢ:</strong> {news.author?.name || 'Ban Truyền thông'}
                </span>
                <span className="news-meta-item">
                  <Calendar size={15} />
                  <strong>NGÀY:</strong> {news.publishedAt ? format(new Date(news.publishedAt), 'dd/MM/yyyy') : ''}
                </span>
              </div>
              <div className="news-share-row">
                <a href="#" className="news-share-btn"><Facebook size={16} /></a>
                <a href="#" className="news-share-btn"><Linkedin size={16} /></a>
                <a href="#" className="news-share-btn"><Share2 size={16} /></a>
              </div>
            </div>

            {/* Featured Image (full container width, big rounded corners) */}
            {!news.hideThumbnail && news.thumbnail && (
              <div className="news-hero-image">
                <Image
                  src={news.thumbnail}
                  alt={news.title}
                  fill
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  priority
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        </section>

        {/* ══════ CONTENT SECTION (2 columns) ══════ */}
        <section className="news-content">
          <div className="news-content-inner vlu-news-container">
            {/* Sử dụng Tailwind Grid để tránh xung đột CSS giữa các file */}
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-10 items-start">

              {/* LEFT: Article body (thêm min-w-0 overflow-hidden để chống tràn Jodit) */}
              <article className="news-article min-w-0 overflow-hidden w-full">
                {/* Meta Description / Excerpt Summary */}
                {(news.seoDescription || news.excerpt) && (
                  <div className="mb-4 p-5 border-l-4 border-[#005496] bg-[#005496]/5 rounded-r-md text-slate-700 font-medium text-[16px] leading-relaxed" style={{ lineHeight: '1.8' }}>
                    {news.seoDescription || news.excerpt}
                  </div>
                )}

                {/* Mục Lục tự động */}
                {news.tocEnabled && <ClientTableOfContents />}

                <ImageZoomWrapper>
                  <div
                    className="jodit-content-render max-w-none"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                  />
                </ImageZoomWrapper>

                {/* Tài liệu đính kèm */}
                {news.attachedFile && news.attachedFile.url && (
                  <div className="mt-10 space-y-5">

                    {/* Download Box (Nhỏ gọn, thiết kế tinh tế) */}
                    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border bg-white rounded-md transition-all duration-300 gap-3">
                      <div className="flex items-center gap-3.5 min-w-0 overflow-hidden">
                        <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <FileText size={22} className="text-rose-600" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[14px] font-bold text-slate-800 truncate group-hover:text-[#005496] transition-colors leading-tight mb-0.5" title={news.attachedFile.name}>
                            {news.attachedFile.name || 'Tài liệu đính kèm'}
                          </h4>
                          <span className="inline-block text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                            {(news.attachedFile.name?.toLowerCase().endsWith('.pdf') || news.attachedFile.url?.toLowerCase().endsWith('.pdf')) ? 'Định dạng PDF' : 'Tệp đính kèm'}
                          </span>
                        </div>
                      </div>
                      <a
                        href={news.attachedFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 hover:border-[#005496] hover:bg-[#005496] text-slate-700 hover:text-white text-[13px] font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={15} strokeWidth={2.5} /> Nhấn để tải về
                      </a>
                    </div>

                    {/* Embedded Viewer (If PDF & Not Hidden) */}
                    {!news.hidePdfPreview && (news.attachedFile.name?.toLowerCase().endsWith('.pdf') || news.attachedFile.url?.toLowerCase().endsWith('.pdf')) && (
                      <div className="w-full flex flex-col mt-4">
                        <PdfViewerClient url={news.attachedFile.url} fileName={news.attachedFile.name} />
                      </div>
                    )}
                  </div>
                )}

                {/* Credit */}
                <div className="news-article-credit mt-10">
                  <p><strong>Nguồn bài viết:</strong> {news.author?.name || 'Viện Đào tạo Sau Đại học'}</p>
                </div>

                {/* Tags */}
                {news.tags && news.tags.length > 0 && (
                  <div className="news-article-tags mt-6">
                    <span className="news-tags-label"><Tag size={16} /> Thẻ</span>
                    {news.tags.map((tag: string) => (
                      <a href={`/news?search=${tag}`} key={tag} className="news-tag">{tag}</a>
                    ))}
                  </div>
                )}
              </article>

              {/* RIGHT: Sidebar */}
              <aside className="news-sidebar w-full">
                {/* Recent News Widget */}
                <div className="news-widget">
                  <h3 className="news-widget-title">Tin tức gần đây</h3>
                  <div className="news-widget-list">
                    {recentNews.map((item: any, idx) => (
                      <a href={`/news/${item.slug}`} key={idx} className="news-widget-card">
                        {item.thumbnail && (
                          <div className="news-widget-thumb">
                            <Image src={item.thumbnail} alt={item.title} fill style={{ objectFit: 'cover' }} />
                          </div>
                        )}
                        <div className="news-widget-info">
                          <span className="news-widget-cat" style={{ color: item.category?.color || '#005496' }}>{item.category?.name || 'TIN TỨC'}</span>
                          <h4 className="news-widget-card-title line-clamp-2">{item.title}</h4>
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
