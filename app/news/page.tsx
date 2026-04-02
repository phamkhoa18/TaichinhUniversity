'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Search, ChevronRight, CalendarDays, Clock,
  ArrowRight, Tag, Grid3X3, List, Newspaper
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

function NewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state from query parameters
  const activeCategory = searchParams.get('category') || 'all';
  const searchTerm = searchParams.get('search') || '';
  const viewMode = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const ITEMS_PER_PAGE = 9;

  // Helper to update URL params cleanly
  const updateParams = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v.trim() === '') params.delete(k);
      else params.set(k, v);
    });
    
    // Auto-reset to page 1 when category or search changes (unless page is explicitly updated)
    if ((newParams.category !== undefined || newParams.search !== undefined) && newParams.page === undefined) {
      params.delete('page'); // equivalent to page 1
    }
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Handle Input with delay (debounce) locally before pushing to URL? 
  // No, let's keep it simple. For text input, we will use local state and push on timeout or just push directly.
  const [localSearch, setLocalSearch] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchTerm) {
        updateParams({ search: localSearch });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [localSearch, searchTerm, updateParams]);


  useEffect(() => {
    fetch('/api/public/tin-tuc')
      .then(r => r.json())
      .then(json => {
        if (json.success) setArticles(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Extract unique categories from articles
  const categories = [
    { label: 'Tất cả', value: 'all', icon: <Newspaper size={15} /> }
  ];
  const uniqueCats = new Set<string>();
  articles.forEach(a => {
    if (a.category && a.category.name && !uniqueCats.has(a.category.name)) {
      uniqueCats.add(a.category.name);
      categories.push({ label: a.category.name, value: a.category.slug, icon: <Tag size={15} /> });
    }
  });

  const filteredArticles = articles.filter(article => {
    const matchCat = activeCategory === 'all' || article.category?.slug === activeCategory;
    const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const isFirstPage = currentPage === 1;
  const isDefaultView = activeCategory === 'all' && searchTerm === '';
  const featuredArticle = (!loading && filteredArticles.length > 0 && isFirstPage && isDefaultView) ? filteredArticles[0] : null;

  const dataForPagination = featuredArticle ? filteredArticles.slice(1) : filteredArticles;
  const totalPages = Math.ceil(dataForPagination.length / ITEMS_PER_PAGE);
  const listArticles = dataForPagination.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
      {!loading && featuredArticle && (
        <section className="news-featured-section">
          <div className="vlu-news-container">
            <motion.a
              href={`/news/${featuredArticle.slug}`}
              className="news-featured-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <div className="news-featured-img">
                <Image src={featuredArticle.thumbnail || '/images/life/bg_ufm_4.jpg'} alt={featuredArticle.title} fill sizes="800px" style={{ objectFit: 'cover' }} />
                <div className="news-featured-badge" style={{ backgroundColor: featuredArticle.category?.color || '#005496' }}>
                  <Tag size={13} /> {featuredArticle.category?.name || 'Chung'}
                </div>
              </div>
              <div className="news-featured-body">
                <div className="news-featured-meta">
                  <span><CalendarDays size={14} /> {featuredArticle.publishedAt ? format(new Date(featuredArticle.publishedAt), 'dd/MM/yyyy') : ''}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {Math.ceil((featuredArticle.content?.split(' ').length || 0) / 200)} phút đọc</span>
                </div>
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.excerpt || featuredArticle.seoDescription || 'Không có mô tả.'}</p>
                <span className="news-featured-cta">
                  Đọc tiếp <ArrowRight size={16} />
                </span>
              </div>
            </motion.a>
          </div>
        </section>
      )}

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
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            <div className="news-view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => updateParams({ view: null })}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => updateParams({ view: 'list' })}
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
                onClick={() => updateParams({ category: cat.value === 'all' ? null : cat.value })}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Articles Grid */}
          <div className={`news-grid ${viewMode === 'list' ? 'news-grid-list' : ''}`}>
            {loading ? (
               <div className="col-span-full text-center py-20 text-slate-500">Đang tải tin tức...</div>
            ) : listArticles.map((article, idx) => (
              <motion.a
                key={article.slug}
                href={`/news/${article.slug}`}
                className="news-card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={idx % 3}
              >
                <div className="news-card-img">
                  <Image src={article.thumbnail || '/images/life/bg_ufm_5.jpg'} alt={article.title} fill sizes="400px" style={{ objectFit: 'cover' }} />
                  <div className="news-card-cat" style={{ backgroundColor: article.category?.color || '#005496' }}>
                    <Tag size={11} /> {article.category?.name || 'Chung'}
                  </div>
                </div>
                <div className="news-card-body">
                  <div className="news-card-meta">
                    <span><CalendarDays size={13} /> {article.publishedAt ? format(new Date(article.publishedAt), 'dd/MM/yyyy') : ''}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {Math.ceil((article.content?.split(' ').length || 0) / 200)} phút đọc</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt || article.seoDescription || 'Không có mô tả.'}</p>
                  <span className="news-card-readmore">
                    Đọc tiếp <ChevronRight size={15} />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>

          {!loading && filteredArticles.length === 0 && (
            <div className="news-empty text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm mt-8">
              <Newspaper size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-[18px] font-semibold text-slate-800 mb-1">Chưa có bài viết nào</h3>
              <p className="text-[14px] text-slate-500">Không có tin tức nào phù hợp với bộ lọc hiện tại của bạn.</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <motion.div
              className="news-pagination"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                // Simple pagination truncation (shows first, last, current, and adjacent)
                if (
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button 
                      key={pageNumber}
                      className={`news-page-btn ${currentPage === pageNumber ? 'active' : ''}`}
                      onClick={() => {
                        updateParams({ page: pageNumber > 1 ? pageNumber.toString() : null });
                        window.scrollTo({ top: 500, behavior: 'smooth' });
                      }}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 || 
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber} className="news-page-dots">...</span>;
                }
                return null;
              })}

              {currentPage < totalPages && (
                <button 
                  className="news-page-btn news-page-next"
                  onClick={() => {
                    updateParams({ page: (currentPage + 1).toString() });
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                >
                  Tiếp <ChevronRight size={16} />
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function TinTucPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-t-[#005496] border-slate-200 rounded-full animate-spin"></div></div>}>
      <NewsContent />
    </Suspense>
  );
}
