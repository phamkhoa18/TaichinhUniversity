'use client';

import Image from 'next/image';
import {
  Facebook, Youtube, Linkedin, Instagram, Twitter,
  MapPin, Phone, Mail, Globe,
  ArrowRight, MessageCircle, Music2,
  Send, Heart,
  ChevronUp,
} from 'lucide-react';
import { useSiteSettings } from '@/store/SiteSettingsProvider';
import { useState, useEffect } from 'react';

const PLATFORM_ICONS: Record<string, any> = {
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  zalo: MessageCircle,
  tiktok: Music2,
};

const LINK_ICONS: Record<string, any> = {
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
  globe: Globe,
};

export default function Footer() {
  const { settings } = useSiteSettings();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Lấy thông tin từ settings, fallback về giá trị mặc định
  const contact = settings?.contact;
  const general = settings?.general;
  const socialLinks = settings?.socialLinks || [];
  const footerData = settings?.footer;
  const copyright = general?.copyright || '© 2026 Trường Đại học Tài chính - Marketing (UFM). Tất cả quyền được bảo lưu.';
  const footerDescription = footerData?.description ||
    'Trường Đại học Tài chính – Marketing – nơi kiến tạo những chuyên gia tài chính hàng đầu, đóng góp vào sự phát triển kinh tế bền vững của đất nước.';
  const bottomText = footerData?.bottomText || copyright;
  const columns = footerData?.columns || [];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Default columns khi chưa có settings
  const defaultColumns = [
    {
      title: 'Liên kết nhanh',
      links: [
        { label: 'Trang chủ', href: '/', icon: '' },
        { label: 'Giới thiệu', href: '/gioi-thieu', icon: '' },
        { label: 'Tuyển sinh', href: '/tuyen-sinh', icon: '' },
        { label: 'Đào tạo', href: '/dao-tao', icon: '' },
        { label: 'Tin tức', href: '/news', icon: '' },
        { label: 'Liên hệ', href: '/lien-he', icon: '' },
      ],
    },
    {
      title: 'Ngành đào tạo',
      links: [
        { label: 'Tài chính – Ngân hàng', href: '#', icon: '' },
        { label: 'Kế toán – Kiểm toán', href: '#', icon: '' },
        { label: 'Fintech', href: '#', icon: '' },
        { label: 'Quản trị Kinh doanh', href: '#', icon: '' },
        { label: 'Kinh tế Quốc tế', href: '#', icon: '' },
        { label: 'Luật Kinh tế', href: '#', icon: '' },
      ],
    },
    {
      title: 'Liên hệ',
      links: [
        { label: contact?.address || '778 Nguyễn Kiệm, P.4, Q. Phú Nhuận, TP.HCM', href: '#', icon: 'map-pin' },
        { label: contact?.phone || '(028) 3822 5048', href: `tel:${(contact?.phone || '(028) 3822 5048').replace(/\s/g, '')}`, icon: 'phone' },
        { label: contact?.email || 'info@ufm.edu.vn', href: `mailto:${contact?.email || 'info@ufm.edu.vn'}`, icon: 'mail' },
        { label: settings?.seo?.canonicalUrl?.replace('https://', '') || 'www.ufm.edu.vn', href: settings?.seo?.canonicalUrl || 'https://ufm.edu.vn', icon: 'globe' },
      ],
    },
  ];

  const displayColumns = columns.length > 0 ? columns : defaultColumns;

  return (
    <footer className="footer" id="site-footer">
      {/* ── Main footer content ── */}
      <div className="footer-main vlu-news-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <a href="/" className="footer-logo-area">
            <div className="footer-logo-icon">
              <Image
                src={general?.logo || '/images/logo_ufm_50nam_no_bg.png'}
                alt={general?.nameVi || 'UFM - Trường Đại học Tài chính - Marketing'}
                width={52}
                height={52}
                style={{ width: 'auto', height: '52px' }}
              />
            </div>
            <div className="footer-logo-divider" />
            <div className="footer-logo-text">
              <span className="footer-logo-main">{general?.parentOrg || 'Trường Đại học Tài chính - Marketing'}</span>
              <span className="footer-logo-sub">{general?.nameVi || 'Viện Đào tạo Sau Đại học'}</span>
            </div>
          </a>
          <p className="footer-description">{footerDescription}</p>

          {/* Social links — đọc từ settings */}
          <div className="footer-social">
            {socialLinks.length > 0 ? (
              socialLinks.map((social) => {
                const Icon = PLATFORM_ICONS[social.platform] || Globe;
                if (!social.url) return null;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="social-link"
                    aria-label={social.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={18} />
                  </a>
                );
              })
            ) : (
              <>
                <a href="#" className="social-link" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#" className="social-link" aria-label="YouTube"><Youtube size={18} /></a>
                <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin size={18} /></a>
                <a href="#" className="social-link" aria-label="Instagram"><Instagram size={18} /></a>
              </>
            )}
          </div>

          {/* Newsletter — compact inline */}
          {footerData?.showNewsletter && (
            <div className="footer-newsletter">
              <p className="footer-newsletter-label">
                <Send size={13} />
                {footerData.newsletterTitle || 'Đăng ký nhận bản tin'}
              </p>
              <form className="footer-newsletter-form" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder={footerData.newsletterPlaceholder || 'Nhập email của bạn...'}
                  className="footer-newsletter-input"
                />
                <button type="submit" className="footer-newsletter-btn" aria-label="Đăng ký">
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Dynamic Columns */}
        {displayColumns.map((col, idx) => (
          <div key={idx} className="footer-column">
            <h4 className="footer-col-title">{col.title}</h4>
            <ul className="footer-links">
              {col.links.map((link, li) => {
                const LinkIcon = link.icon ? LINK_ICONS[link.icon] : null;
                return (
                  <li key={li}>
                    <a
                      href={link.href || '#'}
                      target={link.href?.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {LinkIcon ? <LinkIcon size={14} /> : <ArrowRight size={14} />}
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Google Maps embed ── */}
      {footerData?.showMap && footerData.mapEmbedUrl && footerData.mapEmbedUrl.startsWith('https://') && (
        <div className="footer-map vlu-news-container">
          <iframe
            src={footerData.mapEmbedUrl}
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ trường"
          />
        </div>
      )}

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner vlu-news-container">
          <p>{bottomText}</p>
          <p className="footer-bottom-credit">
            Thiết kế với <Heart size={12} className="footer-heart" /> bởi Sinh viên UFM
          </p>
        </div>
      </div>

      {/* ── Scroll to top ── */}
      <button
        className={`footer-scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
      >
        <ChevronUp size={20} />
      </button>
    </footer>
  );
}
