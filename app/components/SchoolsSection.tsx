'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, ChevronRight } from 'lucide-react';

interface Program {
  id: string;
  slug: string;
  name: string;
  level: string;
}

const fallbackMaster = [
  'Tài chính - Ngân hàng',
  'Quản trị kinh doanh',
  'Kế toán',
  'Kinh tế học',
  'Quản lý kinh tế',
  'Luật kinh tế',
  'Kinh doanh quốc tế',
  'Marketing',
  'Toán kinh tế',
].map((p, i) => ({ id: `m${i}`, slug: '#', name: p, level: 'Thạc sĩ' }));

const fallbackPhD = [
  'Tiến sĩ Quản trị kinh doanh',
  'Tiến sĩ Tài chính - Ngân hàng',
  'Tiến sĩ Quản lý kinh tế',
].map((p, i) => ({ id: `p${i}`, slug: '#', name: p, level: 'Tiến sĩ' }));

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
};

export default function SchoolsSection() {
  const [data, setData] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/training/programs')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data.length > 0) {
          setData(res.data);
        } else {
          // If empty, we can fallback to the hardcoded list
          setData([...fallbackMaster, ...fallbackPhD]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch training programs', err);
        setData([...fallbackMaster, ...fallbackPhD]);
        setLoading(false);
      });
  }, []);

  const grouped = data.reduce((acc, curr) => {
    if (!acc[curr.level]) acc[curr.level] = [];
    acc[curr.level].push(curr);
    return acc;
  }, {} as Record<string, Program[]>);

  const levels = Object.keys(grouped); // E.g. ["Thạc sĩ", "Tiến sĩ"]

  // Chunker for columns
  const chunkArray = (arr: Program[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const getLevelIcon = (level: string) => {
    if (level.toLowerCase().includes('tiến sĩ')) {
      return <Award size={32} strokeWidth={1.5} />;
    }
    return <GraduationCap size={32} strokeWidth={1.5} />;
  };

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
            
            <a href="/chuong-trinh-dao-tao" className="vlu-faculties-link">
              <span className="vlu-faculties-link-text">Xem toàn bộ ngành đào tạo</span>
              <span className="vlu-faculties-link-icon">
                <ChevronRight size={14} strokeWidth={3} fill="currentColor" />
              </span>
            </a>
          </motion.div>

          {/* CỘT PHẢI */}
          <div className="vlu-faculties-right">
            {!loading && levels.map((level, rowIdx) => {
              const items = grouped[level];
              // Chia tối đa 3 items một cột (như giao diện cũ)
              const columns = chunkArray(items, 3);
              return (
                <motion.div 
                  key={level}
                  className="vlu-faculties-row"
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp} custom={rowIdx + 1}
                >
                  <div className="vlu-faculties-module">
                    <div className="vlu-faculties-module-header">
                      <div className="vlu-faculties-module-icon">
                        {getLevelIcon(level)}
                      </div>
                      <h3 className="vlu-faculties-module-title">{level}</h3>
                    </div>
                    {/* Grid columns */}
                    <div className={`vlu-faculties-grid-col-${Math.min(columns.length, 3)}`}>
                      {columns.map((col, colIdx) => (
                        <ul key={colIdx} className="vlu-faculties-list">
                          {col.map((item) => (
                            <li key={item.id}>
                              <a href={item.slug !== '#' ? `/chuong-trinh-dao-tao/${item.slug}` : '#'}>{item.name}</a>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
