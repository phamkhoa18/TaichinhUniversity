'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const ROLE_OPTIONS = [
  'Học viên quan tâm Thạc sĩ',
  'Học viên quan tâm Tiến sĩ',
  'Cựu sinh viên UFM',
  'Phụ huynh',
  'Doanh nghiệp / Đối tác',
  'Khác',
];

export default function ConsultationSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="consult-section">
      {/* Background images collage */}
      <div className="consult-bg">
        <div className="consult-bg-img consult-bg-1">
          <Image src="/images/life/bg_ufm_3.jpg" alt="" fill sizes="400px" style={{ objectFit: 'cover' }} />
        </div>
        <div className="consult-bg-img consult-bg-2">
          <Image src="/images/life/bg_ufm_6.jpg" alt="" fill sizes="400px" style={{ objectFit: 'cover' }} />
        </div>
        <div className="consult-bg-overlay" />
      </div>

      <div className="consult-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="consult-wrapper">

          {/* Student image — absolute positioned */}
          <motion.div
            className="consult-student"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Image
              src="/images/form/sinhvien.png"
              alt="Sinh viên UFM"
              width={420}
              height={480}
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
              priority
            />
          </motion.div>

          {/* Content area */}
          <div className="consult-content">
            <motion.div
              className="consult-text"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.h2 variants={fadeUp} custom={0}>
                Liên hệ để nhận <br /><span>tư vấn & hỗ trợ</span>
              </motion.h2>
              <motion.div className="consult-info-row" variants={fadeUp} custom={1}>
                <div className="consult-info-chip">
                  <Phone size={14} /> (028) 3822 5048
                </div>
                <div className="consult-info-chip">
                  <Mail size={14} /> saudaihoc@ufm.edu.vn
                </div>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              className="consult-form-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={2}
            >
              {submitted ? (
                <div className="consult-success">
                  <CheckCircle2 size={48} />
                  <h3>Gửi thành công!</h3>
                  <p>Chúng tôi sẽ liên hệ bạn sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="consult-form-grid">
                    <div className="consult-field">
                      <input type="text" placeholder="Họ và tên *" required />
                    </div>
                    <div className="consult-field">
                      <select defaultValue="">
                        <option value="" disabled>Bạn là (Vui lòng lựa chọn)</option>
                        {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="consult-field">
                      <input type="tel" placeholder="Số điện thoại *" required />
                    </div>
                    <div className="consult-field">
                      <input type="email" placeholder="Email *" required />
                    </div>
                  </div>
                  <div className="consult-field consult-field-full">
                    <textarea rows={3} placeholder="Câu hỏi của bạn" />
                  </div>
                  <button type="submit" className="consult-submit-btn">
                    Gửi thông tin <ChevronRight size={18} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
