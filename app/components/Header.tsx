'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Phone, Mail, Globe, BookOpen, Monitor,
  Search, ChevronDown, ChevronRight, Menu, X,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import SearchOverlay from './SearchOverlay';
import { useSiteSettings } from '@/store/SiteSettingsProvider';

/* ── Types ── */
interface SubLink {
  label: string;
  href: string;
  order?: number;
}

interface SubGroup {
  title: string;
  links: SubLink[];
  order?: number;
}

interface NavItem {
  _id?: string;
  label: string;
  href?: string;
  type: 'link' | 'mega';
  target?: '_self' | '_blank';
  enabled?: boolean;
  order?: number;
  groups?: SubGroup[];
  overview?: { label: string; href: string };
  promo?: {
    title: string;
    desc: string;
    cta: string;
    href: string;
  };
}

/* ── Fallback hardcoded data — dùng khi DB chưa có ── */
const FALLBACK_NAV: NavItem[] = [
  {
    label: 'Giới thiệu', type: 'mega',
    overview: { label: 'Tổng quan', href: '/gioi-thieu' },
    groups: [
      {
        title: 'Về UFM',
        links: [
          { label: 'Tổng quan', href: '/gioi-thieu' },
          { label: 'Cơ cấu tổ chức', href: '/gioi-thieu/co-cau-to-chuc' },
          { label: 'Thành tựu nổi bật', href: '#' },
          { label: 'Cơ sở vật chất', href: '#' },
        ],
      },
      { title: 'Hợp tác', links: [{ label: 'Đối tác trong nước', href: '#' }, { label: 'Đối tác quốc tế', href: '#' }, { label: 'Doanh nghiệp', href: '#' }] },
    ],
    promo: { title: 'Trường Đại học Tài chính – Marketing', desc: '50 năm xây dựng và phát triển, đào tạo nguồn nhân lực chất lượng cao.', cta: 'Tìm hiểu thêm về UFM', href: '#' },
  },
  {
    label: 'Đào tạo', type: 'mega',
    overview: { label: 'Tổng quan', href: '#' },
    groups: [
      { title: 'Chương trình đào tạo', links: [{ label: 'Đại học chính quy', href: '#' }, { label: 'Sau đại học', href: '#' }, { label: 'Chương trình quốc tế', href: '#' }, { label: 'Đào tạo ngắn hạn', href: '#' }] },
      { title: 'Tuyển sinh', links: [{ label: 'Thông tin tuyển sinh', href: '#' }, { label: 'Điều kiện xét tuyển', href: '#' }, { label: 'Đăng ký trực tuyến', href: '#' }] },
    ],
    promo: { title: 'Các Trường & Khối đào tạo', desc: 'Trường ĐH Tài chính – Marketing đào tạo đa ngành với chương trình đạt chuẩn quốc tế.', cta: 'Xem toàn bộ ngành đào tạo', href: '#' },
  },
  {
    label: 'Sinh viên', type: 'mega',
    overview: { label: 'Tổng quan', href: '#' },
    groups: [
      { title: 'Học tập', links: [{ label: 'Lịch học & Thi', href: '#' }, { label: 'Hoạt động NCKH', href: '#' }, { label: 'Thư viện & Tài liệu', href: '#' }] },
      { title: 'Đời sống', links: [{ label: 'CLB & Đoàn thể', href: '#' }, { label: 'Ký túc xá', href: '#' }, { label: 'Học bổng', href: '#' }] },
    ],
    promo: { title: 'Đời sống Sinh viên UFM', desc: 'Trải nghiệm môi trường học tập năng động, sáng tạo.', cta: 'Khám phá đời sống sinh viên', href: '#' },
  },
  {
    label: 'Nghiên cứu khoa học', type: 'mega',
    overview: { label: 'Tổng quan', href: '#' },
    groups: [
      { title: 'Nghiên cứu khoa học tại UFM', links: [{ label: 'Lĩnh vực nghiên cứu tập trung', href: '#' }, { label: 'Công bố khoa học', href: '#' }] },
      { title: 'Các thông tin khác', links: [{ label: 'Cơ sở vật chất & Phòng thí nghiệm', href: '#' }, { label: 'Dự án nghiên cứu', href: '#' }, { label: 'Hội đồng Đạo đức', href: '#' }, { label: 'Đơn vị nghiên cứu', href: '#' }] },
    ],
    promo: { title: 'Nghiên cứu tại UFM', desc: 'Phòng thí nghiệm hiện đại và đội ngũ giảng viên nghiên cứu hàng đầu.', cta: 'Tìm hiểu thêm', href: '#' },
  },
  { label: 'Tin tức', href: '/news', type: 'link' },
  { label: 'Liên hệ', href: '/lien-he', type: 'link' },
];

const EXPLORE_LINKS = [
  { label: 'Tuyển sinh', href: '#' },
  { label: 'Tin tức', href: '/news' },
  { label: 'Sự kiện', href: '/news' },
  { label: 'Liên hệ', href: '/lien-he' },
];

const POPULAR_LINKS = [
  { label: 'Đăng ký xét tuyển', href: '#' },
  { label: 'Lịch thi', href: '#' },
  { label: 'Học bổng', href: '#' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drillIdx, setDrillIdx] = useState<number | null>(null);
  const [activeMega, setActiveMega] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<NavItem[]>(FALLBACK_NAV);
  const { settings } = useSiteSettings();

  // ── Fetch menu từ DB ──
  useEffect(() => {
    let mounted = true;
    async function fetchMenu() {
      try {
        const res = await fetch('/api/public/menu');
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0 && mounted) {
          setMenuItems(json.data);
        }
        // Nếu DB trống → giữ FALLBACK_NAV
      } catch {
        // silently fail, giữ fallback
      }
    }
    fetchMenu();
    return () => { mounted = false };
  }, []);

  // Tách mega items vs link items cho desktop nav
  const MAIN_NAV = menuItems.filter(item => item.type === 'mega');
  const DESKTOP_NAV = menuItems.map(item => ({
    label: item.label,
    href: item.type === 'link' ? (item.href || '#') : undefined,
    hasChildren: item.type === 'mega',
    target: item.target || '_self',
  }));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setDrillIdx(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  useEffect(() => {
    if (activeMega !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeMega]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeMega !== null) setActiveMega(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeMega]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const goBack = useCallback(() => setDrillIdx(null), []);

  const drillItem = drillIdx !== null ? menuItems[drillIdx] : null;

  const toggleMega = useCallback((idx: number) => {
    // idx ở đây là index trong MAIN_NAV (chỉ mega items)
    setActiveMega(prev => prev === idx ? null : idx);
  }, []);

  const closeMega = useCallback(() => setActiveMega(null), []);

  const activeData = activeMega !== null ? MAIN_NAV[activeMega] : null;

  // Thông tin liên hệ từ settings
  const phone = settings?.contact?.phone || '(028) 3822 5048';
  const email = settings?.contact?.email || 'info@taichinh.edu.vn';
  const logo = settings?.general?.logo || '/images/logo_ufm_50nam_no_bg.png';
  const orgName = settings?.general?.parentOrg || 'Trường Đại học Tài chính - Marketing';
  const unitName = settings?.general?.nameVi || 'Viện Đào tạo Sau Đại học';

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      {/* ── Top Bar ── */}
      <div className="header-top-bar">
        <div className="header-top-inner vlu-news-container">
          <div className="header-top-left">
            <a href={`tel:${phone.replace(/\s/g, '')}`}><Phone size={13} /> {phone}</a>
            <a href={`mailto:${email}`}><Mail size={13} /> {email}</a>
          </div>
          <div className="header-top-right">
            <a href="#"><BookOpen size={13} /> Thư viện</a>
            <span className="header-top-sep">|</span>
            <a href="#"><Monitor size={13} /> Cổng TTĐT</a>
            <span className="header-top-sep">|</span>
            <a href="#"><Globe size={13} /> VI / EN</a>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className="header-main">
        <div className="vlu-news-container header-main-inner">
          <a href="/" className="logo-area">
            <div className="logo-icon">
              <Image
                src={logo}
                alt={orgName}
                width={56} height={56}
                style={{ width: 'auto', height: '56px' }}
                priority
              />
            </div>
            <div className="logo-divider" />
            <div className="logo-text">
              <span className="logo-text-main">{orgName}</span>
              <span className="logo-text-sub">{unitName}</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <ul className="nav-menu">
              {DESKTOP_NAV.map((item, i) => (
                <li
                  className={`nav-item ${activeMega !== null && MAIN_NAV[activeMega]?.label === item.label ? 'nav-item-active' : ''}`}
                  key={i}
                >
                  <a
                    className="nav-link"
                    href={item.href || '#'}
                    target={item.target}
                    onClick={(e) => {
                      if (item.hasChildren) {
                        e.preventDefault();
                        const mainIdx = MAIN_NAV.findIndex(n => n.label === item.label);
                        if (mainIdx >= 0) toggleMega(mainIdx);
                      }
                    }}
                  >
                    {item.label}
                    {item.hasChildren && (
                      <ChevronDown
                        size={14}
                        className={`nav-chevron ${activeMega !== null && MAIN_NAV[activeMega]?.label === item.label ? 'nav-chevron-active' : ''}`}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button onClick={() => { setSearchOpen(true); closeMega(); }} className="header-btn btn-outline"><Search size={16} /> Tìm kiếm</button>
            <a href="#" className="header-btn btn-primary">Đăng ký</a>
          </div>

          {/* Mobile Search + Toggle */}
          <div className="mobile-controls">
            <button
              className="mobile-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm"
            >
              <Search size={20} />
            </button>
            <button
              className={`mobile-toggle ${mobileOpen ? 'mobile-toggle-active' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
         DESKTOP MEGA MENU — Full-screen overlay
         ══════════════════════════════════════════ */}
      <div className={`mega-fullscreen ${activeMega !== null ? 'mega-fullscreen-open' : ''}`}>
        {activeData && activeData.groups && (
          <>
            {/* Left: Promo panel */}
            <div className="mega-fs-left">
              <div className="mega-fs-left-content">
                <a href="/" className="mega-fs-logo" onClick={closeMega}>
                  <Image
                    src={logo}
                    alt="UFM"
                    width={48} height={48}
                    style={{ width: 'auto', height: '48px' }}
                  />
                  <div className="mega-fs-logo-text">
                    <span>UFM</span>
                  </div>
                </a>

                {activeData.promo && activeData.promo.title && (
                  <div className="mega-fs-promo">
                    <h2 className="mega-fs-promo-title">{activeData.promo.title}</h2>
                    <p className="mega-fs-promo-desc">{activeData.promo.desc}</p>
                    <a href={activeData.promo.href} className="mega-fs-promo-cta" onClick={closeMega}>
                      {activeData.promo.cta}
                      <span className="mega-fs-promo-cta-icon"><ArrowRight size={16} /></span>
                    </a>
                  </div>
                )}
              </div>
              <div className="mega-fs-left-bar" />
            </div>

            {/* Right: Menu content */}
            <div className="mega-fs-right">
              <button className="mega-fs-close" onClick={closeMega} aria-label="Đóng menu">
                <X size={20} />
              </button>

              <div className="mega-fs-right-content">
                <h2 className="mega-fs-title">{activeData.label}</h2>

                {activeData.overview && activeData.overview.label && (
                  <a href={activeData.overview.href} className="mega-fs-overview" onClick={closeMega}>
                    {activeData.overview.label}
                    <span className="mega-fs-overview-arrow"><ArrowRight size={16} /></span>
                  </a>
                )}

                <div className="mega-fs-groups">
                  {activeData.groups.map((group, gi) => (
                    <div className="mega-fs-group" key={gi}>
                      <h3 className="mega-fs-group-title">{group.title}</h3>
                      <div className="mega-fs-group-links">
                        {group.links.map((link, li) => (
                          <a key={li} className="mega-fs-link" href={link.href} onClick={closeMega}>
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Mobile Full-Screen Menu ── */}
      <div className={`mega-overlay ${mobileOpen ? 'mega-overlay-open' : ''}`}>
        <div className="mega-top">
          <a href="/" className="mega-logo" onClick={closeMobile}>
            <Image
              src={logo}
              alt="UFM" width={40} height={40}
              style={{ width: 'auto', height: '40px' }}
            />
          </a>
          <div className="mega-top-actions">
            <button className="mega-close" onClick={closeMobile} aria-label="Đóng">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="mega-drill">
          {/* ── Level 1 ── */}
          <div className={`mega-level mega-level-1 ${drillIdx !== null ? 'mega-level-out' : ''}`}>
            <div className="mega-level-scroll">
              <ul className="mega-list">
                {menuItems.map((item, i) => (
                  <li key={i} className="mega-list-item">
                    {item.type === 'mega' && item.groups && item.groups.length > 0 ? (
                      <button className="mega-list-btn" onClick={() => setDrillIdx(i)}>
                        <span>{item.label}</span>
                        <ChevronRight size={16} className="mega-list-chevron" />
                      </button>
                    ) : (
                      <a className="mega-list-btn" href={item.href || '#'} onClick={closeMobile}>
                        <span>{item.label}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mega-explore">
                <span className="mega-explore-label">Khám phá</span>
                {EXPLORE_LINKS.map((link, i) => (
                  <a key={i} className="mega-explore-link" href={link.href} onClick={closeMobile}>
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mega-popular">
                <span className="mega-popular-label">Truy cập nhanh</span>
                {POPULAR_LINKS.map((link, i) => (
                  <a key={i} className="mega-popular-link" href={link.href} onClick={closeMobile}>
                    <span>{link.label}</span>
                    <ChevronRight size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Level 2 ── */}
          <div className={`mega-level mega-level-2 ${drillIdx !== null ? 'mega-level-in' : ''}`}>
            <div className="mega-level-scroll">
              <button className="mega-back" onClick={goBack}>
                <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
                <span>Menu</span>
              </button>

              {drillItem && (
                <>
                  <h3 className="mega-sub-title">{drillItem.label}</h3>
                  {drillItem.groups && drillItem.groups.map((group, gi) => (
                    <div className="mega-sub-group" key={gi}>
                      <h4 className="mega-sub-group-title">{group.title}</h4>
                      {group.links.map((link, li) => (
                        <a key={li} className="mega-sub-link" href={link.href} onClick={closeMobile}>
                          <span>{link.label}</span>
                          <ChevronRight size={14} className="mega-sub-link-arrow" />
                        </a>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mega-cta-bar">
            <a href="#" className="mega-cta-btn mega-cta-primary" onClick={closeMobile}>Đăng ký</a>
            <button className="mega-cta-btn mega-cta-outline" onClick={() => { closeMobile(); setSearchOpen(true); }}>
              <Search size={15} /> Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* ── Search Overlay ── */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
