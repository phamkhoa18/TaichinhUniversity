'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, X, ArrowRight, Clock, TrendingUp,
  GraduationCap, BookOpen, Briefcase, FileText,
  ChevronRight
} from 'lucide-react';

/* ── Suggested searches ── */
const TRENDING = [
  'Tuyển sinh Thạc sĩ 2026',
  'Học phí Sau Đại học',
  'Chương trình Tiến sĩ',
  'Lịch bảo vệ luận văn',
  'Ưu đãi cựu sinh viên',
];

const QUICK_LINKS = [
  { icon: <GraduationCap size={16} />, label: 'Tuyển sinh Thạc sĩ', href: '/news' },
  { icon: <BookOpen size={16} />, label: 'Chương trình đào tạo', href: '/dao-tao/thac-si/tai-chinh-ngan-hang' },
  { icon: <Briefcase size={16} />, label: 'Cơ hội nghề nghiệp', href: '/news' },
  { icon: <FileText size={16} />, label: 'Quy chế đào tạo', href: '/news' },
];

/* ── Mock search results ── */
const ALL_RESULTS = [
  {
    title: 'Thông báo tuyển sinh trình độ Thạc sĩ đợt 1 năm 2026',
    category: 'Tuyển sinh',
    href: '/news/tuyen-sinh-thac-si-dot-1-2026',
  },
  {
    title: 'Thông báo tuyển sinh trình độ Tiến sĩ đợt 1 năm 2026',
    category: 'Tuyển sinh',
    href: '/news/tuyen-sinh-tien-si-2026',
  },
  {
    title: 'Chương trình Thạc sĩ Tài chính – Ngân hàng',
    category: 'Đào tạo',
    href: '/dao-tao/thac-si/tai-chinh-ngan-hang',
  },
  {
    title: 'Chương trình Thạc sĩ Quản trị Kinh doanh',
    category: 'Đào tạo',
    href: '/news',
  },
  {
    title: 'Giảm 10% học phí cho cựu sinh viên UFM',
    category: 'Chính sách',
    href: '/news/uu-dai-hoc-phi-cuu-sv',
  },
  {
    title: 'Hội thảo khoa học quốc tế Fintech, AI và Tài chính bền vững',
    category: 'Sự kiện',
    href: '/news/hoi-thao-fintech-ai-2026',
  },
  {
    title: 'Lịch bảo vệ Luận văn Thạc sĩ và Luận án Tiến sĩ tháng 4/2026',
    category: 'Học thuật',
    href: '/news',
  },
  {
    title: 'Discovery Day 2026 – Trải nghiệm không gian học tập',
    category: 'Sự kiện',
    href: '/news/discovery-day-2026',
  },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const results = query.trim().length > 0
    ? ALL_RESULTS.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className={`search-overlay ${isOpen ? 'search-overlay-open' : ''}`}>
      {/* Backdrop */}
      <div className="search-overlay-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="search-panel">
        {/* Search Input */}
        <div className="search-panel-header">
          <div className="search-input-wrapper">
            <Search size={22} className="search-input-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Tìm kiếm chương trình, tin tức, sự kiện..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-clear-btn" onClick={() => setQuery('')} aria-label="Xóa">
                <X size={18} />
              </button>
            )}
          </div>
          <button className="search-close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>

        {/* Content */}
        <div className="search-panel-body">
          {query.trim().length === 0 ? (
            /* Default state: show trending + quick links */
            <>
              <div className="search-section">
                <h3 className="search-section-title">
                  <TrendingUp size={16} /> Tìm kiếm phổ biến
                </h3>
                <div className="search-trends">
                  {TRENDING.map((term, i) => (
                    <button
                      key={i}
                      className="search-trend-btn"
                      onClick={() => setQuery(term)}
                    >
                      <Clock size={13} /> {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="search-section">
                <h3 className="search-section-title">
                  <ArrowRight size={16} /> Truy cập nhanh
                </h3>
                <div className="search-quick-links">
                  {QUICK_LINKS.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      className="search-quick-link"
                      onClick={handleSelect}
                    >
                      <span className="search-quick-icon">{link.icon}</span>
                      <span>{link.label}</span>
                      <ChevronRight size={14} className="search-quick-arrow" />
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : results.length > 0 ? (
            /* Results */
            <div className="search-section">
              <h3 className="search-section-title">
                <Search size={16} /> {results.length} kết quả
              </h3>
              <div className="search-results">
                {results.map((result, i) => (
                  <a
                    key={i}
                    href={result.href}
                    className="search-result-item"
                    onClick={handleSelect}
                  >
                    <div className="search-result-content">
                      <span className="search-result-cat">{result.category}</span>
                      <h4>{result.title}</h4>
                    </div>
                    <ArrowRight size={16} className="search-result-arrow" />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            /* No results */
            <div className="search-no-results">
              <Search size={48} />
              <h3>Không tìm thấy kết quả</h3>
              <p>Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
