'use client';

import { useState, useEffect } from 'react';
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
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    programType: '',
    major: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [programs, setPrograms] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch('/api/public/training/programs')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setPrograms(json.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '', phone: '', email: '',
        programType: '', major: ''
      });
    }, 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}
          >
            <motion.div
              className="consult-text"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              style={{ marginBottom: '20px', paddingLeft: '20px' }}
            >
              <motion.h2 variants={fadeUp} custom={0}>
                Liên hệ để nhận <br /><span>tư vấn & hỗ trợ</span>
              </motion.h2>
              <motion.div className="consult-info-row" variants={fadeUp} custom={1} style={{ justifyContent: 'flex-start' }}>
                <div className="consult-info-chip">
                  <Phone size={14} /> (028) 3822 5048
                </div>
                <div className="consult-info-chip">
                  <Mail size={14} /> saudaihoc@ufm.edu.vn
                </div>
              </motion.div>
            </motion.div>

            <Image
              src="/images/form/sinhvien.png"
              alt="Sinh viên UFM"
              width={420}
              height={480}
              style={{ objectFit: 'contain', width: '100%', height: 'auto', marginTop: 'auto' }}
              priority
            />
          </motion.div>

          {/* Content area */}
          <div className="consult-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Form */}
            <motion.div
              className="consult-form-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={2}
            >
              {submitted ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Đã nhận thông tin!</h3>
                  <p className="text-slate-500">Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input type="text" name="fullName" required placeholder="Họ và tên" className="w-full bg-[#f4f7fb] border-transparent text-[15px] px-4 py-3 rounded-lg focus:bg-white focus:border-[#005496] focus:ring-1 focus:ring-[#005496] outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800" value={formData.fullName} onChange={handleChange} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 font-bold">*</span>
                    </div>
                    <div className="relative">
                      <input type="tel" name="phone" required placeholder="Số điện thoại" className="w-full bg-[#f4f7fb] border-transparent text-[15px] px-4 py-3 rounded-lg focus:bg-white focus:border-[#005496] focus:ring-1 focus:ring-[#005496] outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800" value={formData.phone} onChange={handleChange} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 font-bold">*</span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="relative">
                    <input type="email" name="email" required placeholder="Email" className="w-full bg-[#f4f7fb] border-transparent text-[15px] px-4 py-3 rounded-lg focus:bg-white focus:border-[#005496] focus:ring-1 focus:ring-[#005496] outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800" value={formData.email} onChange={handleChange} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 font-bold">*</span>
                  </div>

                  {/* Radios */}
                  <div className="space-y-4 pt-3">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800 mb-2">Chương trình đào tạo:<span className="text-rose-500 ml-1">*</span></p>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {['Thạc sĩ', 'Tiến sĩ', 'Đào tạo văn bằng 2', 'Liên kết quốc tế'].map(prog => (
                          <label key={prog} className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="programType" required value={prog} onChange={handleChange} checked={formData.programType === prog} className="w-4 h-4 text-[#005496] border-slate-300 focus:ring-[#005496]" />
                            <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900">{prog}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Major */}
                  <div className="pt-2">
                    <p className="text-[13px] font-semibold text-slate-800 mb-2">Ngành học:<span className="text-rose-500 ml-1">*</span></p>
                    <div className="relative">
                      <select name="major" required className="w-full bg-[#f4f7fb] border-transparent text-[15px] px-4 py-3 rounded-lg focus:bg-white focus:border-[#005496] focus:ring-1 focus:ring-[#005496] outline-none transition-all text-slate-500 font-medium appearance-none" value={formData.major} onChange={handleChange}>
                        <option value="">Chọn ngành quan tâm</option>
                        {programs.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button type="submit" className="w-full bg-[#b11116] hover:bg-[#8f0e12] text-white text-[15px] font-bold py-4 rounded-lg transition-colors flex items-center justify-center relative overflow-hidden group">
                      <span>Gửi thông tin tư vấn</span>
                      {/* Checkerboard/arrow detail */}
                      <div className="absolute right-0 top-0 h-full w-12 flex flex-wrap">
                        <div className="w-3 h-3 bg-white/20"></div>
                        <div className="w-3 h-3 bg-white/40"></div>
                        <div className="w-3 h-3 bg-white/20"></div>
                        <div className="w-3 h-3 bg-transparent"></div>
                        <div className="w-3 h-3 bg-white/20"></div>
                        <div className="w-3 h-3 bg-white/40"></div>
                        <div className="w-3 h-3 bg-white/20"></div>
                        <div className="w-3 h-3 bg-white/40"></div>
                        <div className="w-3 h-3 bg-transparent"></div>
                        <div className="w-3 h-3 bg-white/20"></div>
                        <div className="w-3 h-3 bg-white/40"></div>
                        <div className="w-3 h-3 bg-white/20"></div>
                      </div>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
