'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, ChevronRight } from 'lucide-react';

const masterPrograms = [
  'Tài chính - Ngân hàng',
  'Quản trị kinh doanh',
  'Kế toán',
  'Kinh tế học',
  'Quản lý kinh tế',
  'Luật kinh tế',
  'Kinh doanh quốc tế',
  'Marketing',
  'Toán kinh tế',
];

const phDPrograms = [
  'Tiến sĩ Quản trị kinh doanh',
  'Tiến sĩ Tài chính - Ngân hàng',
  'Tiến sĩ Quản lý kinh tế',
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
};

export default function SchoolsSection() {
  return (
    <section className="vlu-faculties-section">
      <div className="vlu-news-container">
        
        <div className="vlu-faculties-layout">
          {/* CỘT TRÁI */}
          <motion.div 
            className="vlu-faculties-left"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp} custom={0}
          >
            <h2 className="vlu-faculties-title">Các Trường &amp; Khối đào tạo</h2>
            <p className="vlu-faculties-desc">
              Trường Đại học Tài chính - Marketing hiện quản lý và đa dạng hóa đào tạo chuyên sâu các khối ngành Kinh tế, Quản trị, và Luật. Các chương trình được thiết kế chuẩn mực, mang lại hệ thống tư duy hoàn thiện nhất về quản lý chuyên sâu lẫn nhạy bén xu hướng phát triển toàn cầu.
            </p>
            
            <a href="#" className="vlu-faculties-link">
              <span className="vlu-faculties-link-text">Xem toàn bộ ngành đào tạo</span>
              <span className="vlu-faculties-link-icon">
                <ChevronRight size={14} strokeWidth={3} fill="currentColor" />
              </span>
            </a>
          </motion.div>

          {/* CỘT PHẢI */}
          <div className="vlu-faculties-right">
            
            {/* Thạc sĩ Row */}
            <motion.div 
              className="vlu-faculties-row"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={1}
            >
              <div className="vlu-faculties-module">
                <div className="vlu-faculties-module-header">
                  <div className="vlu-faculties-module-icon">
                    <GraduationCap size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="vlu-faculties-module-title">Thạc sĩ</h3>
                </div>
                {/* Grid 3 columns */}
                <div className="vlu-faculties-grid-col-3">
                  <ul className="vlu-faculties-list">
                    {masterPrograms.slice(0, 3).map((item, i) => (
                      <li key={i}><a href="#">{item}</a></li>
                    ))}
                  </ul>
                  <ul className="vlu-faculties-list">
                    {masterPrograms.slice(3, 6).map((item, i) => (
                      <li key={i}><a href="#">{item}</a></li>
                    ))}
                  </ul>
                  <ul className="vlu-faculties-list">
                    {masterPrograms.slice(6, 9).map((item, i) => (
                      <li key={i}><a href="#">{item}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Tiến sĩ Row */}
            <motion.div 
              className="vlu-faculties-row"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={2}
            >
              <div className="vlu-faculties-module">
                <div className="vlu-faculties-module-header">
                  <div className="vlu-faculties-module-icon">
                    <Award size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="vlu-faculties-module-title">Tiến sĩ</h3>
                </div>
                <div className="vlu-faculties-grid-col-3">
                  <ul className="vlu-faculties-list">
                    {phDPrograms.slice(0, 3).map((item, i) => (
                      <li key={i}><a href="#">{item}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
