'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Phone, Mail, User, BookOpen, ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
};

const reasons = [
  'Chương trình đạt chuẩn kiểm định quốc tế FIBAA & AUN-QA',
  'Đội ngũ giảng viên là Giáo sư, Tiến sĩ đầu ngành',
  'Ứng dụng AI & chuyển đổi số toàn diện trong đào tạo',
  'Mạng lưới Alumni & đối tác doanh nghiệp hàng đầu',
];

export default function CtaSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="cta-section">
        <div className="vlu-news-container">
          <div className="cta-layout">
            <motion.div
              className="cta-left"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <span className="cta-tag">TUYỂN SINH 2026</span>
              <h2 className="cta-title">Bắt đầu hành trình<br /><span className="cta-title-gold">Thạc sĩ &amp; Tiến sĩ</span> tại UFM</h2>
              <p className="cta-desc">
                Hãy để Viện Đào tạo Sau Đại học UFM đồng hành cùng bạn trên con đường chinh phục
                tri thức chuyên sâu và kiến tạo sự nghiệp vượt trội.
              </p>
              <button className="cta-btn" onClick={() => setShowModal(true)}>
                <GraduationCap size={20} strokeWidth={2} />
                Đăng ký tư vấn ngay
              </button>
            </motion.div>

            <motion.div
              className="cta-right"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={1}
            >
              <h3 className="cta-reasons-title">Vì sao nên chọn UFM?</h3>
              <ul className="cta-reasons-list">
                {reasons.map((r, i) => (
                  <li key={i}>
                    <span className="cta-check">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="cta-contact-row">
                <a href="tel:02838225048" className="cta-contact-item">
                  <Phone size={16} /> (028) 3822 5048
                </a>
                <a href="mailto:sdh@ufm.edu.vn" className="cta-contact-item">
                  <Mail size={16} /> sdh@ufm.edu.vn
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Registration Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="cta-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="cta-modal"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="cta-modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>

              <div className="cta-modal-header">
                <GraduationCap size={36} strokeWidth={1.5} />
                <h3>Đăng ký tư vấn tuyển sinh</h3>
                <p>Điền thông tin để nhận tư vấn chi tiết từ Viện Đào tạo Sau Đại học UFM</p>
              </div>

              <form className="cta-modal-form" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                <div className="cta-form-group">
                  <label><User size={14} /> Họ và tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" required />
                </div>

                <div className="cta-form-row">
                  <div className="cta-form-group">
                    <label><Phone size={14} /> Số điện thoại</label>
                    <input type="tel" placeholder="0901 234 567" required />
                  </div>
                  <div className="cta-form-group">
                    <label><Mail size={14} /> Email</label>
                    <input type="email" placeholder="email@gmail.com" required />
                  </div>
                </div>

                <div className="cta-form-group">
                  <label><BookOpen size={14} /> Chương trình quan tâm</label>
                  <div className="cta-select-wrapper">
                    <select required>
                      <option value="">-- Chọn chương trình --</option>
                      <option>Thạc sĩ Tài chính - Ngân hàng</option>
                      <option>Thạc sĩ Quản trị kinh doanh</option>
                      <option>Thạc sĩ Kế toán</option>
                      <option>Thạc sĩ Kinh tế học</option>
                      <option>Thạc sĩ Quản lý kinh tế</option>
                      <option>Thạc sĩ Luật kinh tế</option>
                      <option>Thạc sĩ Kinh doanh quốc tế</option>
                      <option>Thạc sĩ Marketing</option>
                      <option>Thạc sĩ Toán kinh tế</option>
                      <option>Tiến sĩ Quản trị kinh doanh</option>
                      <option>Tiến sĩ Tài chính - Ngân hàng</option>
                      <option>Tiến sĩ Quản lý kinh tế</option>
                    </select>
                    <ChevronDown size={16} className="cta-select-icon" />
                  </div>
                </div>

                <button type="submit" className="cta-modal-submit">
                  Gửi đăng ký
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
