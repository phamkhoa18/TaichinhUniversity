'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, X, ArrowRight, Clock, TrendingUp,
  GraduationCap, BookOpen, Briefcase, FileText,
  ChevronRight, Loader2
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



interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{title: string, category: string, href: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/public/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search fetch error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
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
          ) : isLoading ? (
            /* Loading state */
            <div className="search-no-results">
              <Loader2 className="animate-spin" size={48} />
              <h3>Đang tìm kiếm...</h3>
            </div>
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
