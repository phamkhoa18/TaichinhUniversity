'use client';

import Image from 'next/image';
import {
  Facebook, Youtube, Linkedin, Instagram,
  MapPin, Phone, Mail, Globe,
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Brand Column */}
        <div className="footer-brand">
          <a href="/" className="footer-logo-area">
            <div className="footer-logo-icon">
              <Image
                src="/images/logo_ufm_50nam_no_bg.png"
                alt="UFM - Trường Đại học Tài chính - Marketing"
                width={52}
                height={52}
                style={{ width: 'auto', height: '52px' }}
              />
            </div>
            <div className="footer-logo-divider" />
            <div className="footer-logo-text">
              <span className="footer-logo-main">Trường Đại học Tài chính - Marketing</span>
              <span className="footer-logo-sub">Viện Đào tạo Sau Đại học</span>
            </div>
          </a>
          <p className="footer-description">
            Trường Đại học Tài chính – Marketing – nơi kiến tạo những chuyên gia tài chính hàng đầu,
            đóng góp vào sự phát triển kinh tế bền vững của đất nước.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <Youtube size={18} />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-col-title">Liên kết nhanh</h4>
          <ul className="footer-links">
            <li><a href="#"><ArrowRight size={14} /> Trang chủ</a></li>
            <li><a href="#"><ArrowRight size={14} /> Giới thiệu</a></li>
            <li><a href="#"><ArrowRight size={14} /> Tuyển sinh</a></li>
            <li><a href="#"><ArrowRight size={14} /> Nghiên cứu</a></li>
            <li><a href="#"><ArrowRight size={14} /> Tin tức</a></li>
            <li><a href="#"><ArrowRight size={14} /> Liên hệ</a></li>
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h4 className="footer-col-title">Ngành đào tạo</h4>
          <ul className="footer-links">
            <li><a href="#"><ArrowRight size={14} /> Tài chính – Ngân hàng</a></li>
            <li><a href="#"><ArrowRight size={14} /> Kế toán – Kiểm toán</a></li>
            <li><a href="#"><ArrowRight size={14} /> Fintech</a></li>
            <li><a href="#"><ArrowRight size={14} /> Quản trị Kinh doanh</a></li>
            <li><a href="#"><ArrowRight size={14} /> Kinh tế Quốc tế</a></li>
            <li><a href="#"><ArrowRight size={14} /> Luật Kinh tế</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="footer-col-title">Liên hệ</h4>
          <ul className="footer-links">
            <li><a href="#"><MapPin size={14} /> 778 Nguyễn Kiệm, P.4, Q. Phú Nhuận, TP.HCM</a></li>
            <li><a href="tel:02838225048"><Phone size={14} /> (028) 3822 5048</a></li>
            <li><a href="mailto:info@ufm.edu.vn"><Mail size={14} /> info@ufm.edu.vn</a></li>
            <li><a href="https://ufm.edu.vn"><Globe size={14} /> www.ufm.edu.vn</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Trường Đại học Tài chính - Marketing (UFM). Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}
