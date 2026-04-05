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
    <section className="relative w-full py-10 lg:py-14 overflow-hidden">
      {/* Background images collage */}
      <div className="absolute inset-0 z-0 flex">
        <div className="relative w-full lg:w-1/2 h-full">
          <Image src="/images/life/bg_ufm_3.jpg" alt="" fill sizes="50vw" className="object-cover" />
        </div>
        <div className="relative w-1/2 h-full hidden lg:block">
          <Image src="/images/life/bg_ufm_6.jpg" alt="" fill sizes="50vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[#002f5a]/90 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-12 lg:gap-8">

          {/* Text & Student Image */}
          <motion.div
            className="w-full lg:w-5/12 flex flex-col justify-center lg:justify-between pt-4"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.div
              className="text-white text-center lg:text-left mb-6 lg:mb-0"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.h2 
                variants={fadeUp} custom={0} 
                className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight mb-4"
              >
                Liên hệ để nhận <br className="hidden md:block" />
                <span className="text-[#f5c71a]">tư vấn &amp; hỗ trợ</span>
              </motion.h2>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-4" 
                variants={fadeUp} custom={1}
              >
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-fit">
                  <div className="bg-[#f5c71a] p-1.5 rounded-full text-[#002f5a]">
                    <Phone size={13} strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold text-[13px] sm:text-sm tracking-wide">(028) 3822 5048</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-fit">
                  <div className="bg-[#f5c71a] p-1.5 rounded-full text-[#002f5a]">
                    <Mail size={13} strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold text-[13px] sm:text-sm tracking-wide">saudaihoc@ufm.edu.vn</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Màn hình nhỏ (mobile) ẩn phần hình ảnh sinh viên, chỉ hiện ở md trở lên */}
            <div className="hidden lg:block mt-auto -mb-14 lg:-ml-6 pointer-events-none">
              <Image
                src="/images/form/sinhvien.png"
                alt="Sinh viên UFM"
                width={700}
                height={700}
                className="object-contain w-[400px] max-w-none translate-y-8 drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          {/* Form area */}
          <div className="w-full lg:w-[55%] flex items-center justify-center">
            <motion.div
              className="w-full bg-white rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 border border-slate-100 relative overflow-hidden"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={2}
            >
              {/* Trang trí góc form */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10 opacity-70"></div>
              
              {submitted ? (
                <div className="py-20 text-center flex flex-col items-center justify-center z-10 relative">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner"
                  >
                    <CheckCircle2 size={40} strokeWidth={2} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Đã nhận thông tin!</h3>
                  <p className="text-slate-500 font-medium">Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất qua số điện thoại hoặc email đã cung cấp.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5 text-left relative z-10 flex flex-col">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input type="text" name="fullName" required placeholder="Họ và tên" className="w-full bg-[#f8fafc] border border-slate-200 text-sm px-4 py-3 rounded-xl focus:bg-white focus:border-[#005496] focus:ring-1 focus:ring-[#005496] focus:shadow-md outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800" value={formData.fullName} onChange={handleChange} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 font-bold">*</span>
                    </div>
                    <div className="relative group">
                      <input type="tel" name="phone" required placeholder="Số điện thoại" className="w-full bg-[#f8fafc] border border-slate-200 text-sm px-4 py-3 rounded-xl focus:bg-white focus:border-[#005496] focus:ring-1 focus:ring-[#005496] focus:shadow-md outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800" value={formData.phone} onChange={handleChange} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 font-bold">*</span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="relative group">
                    <input type="email" name="email" required placeholder="Email" className="w-full bg-[#f8fafc] border border-slate-200 text-sm px-4 py-3 rounded-xl focus:bg-white focus:border-[#005496] focus:ring-1 focus:ring-[#005496] focus:shadow-md outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800" value={formData.email} onChange={handleChange} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 font-bold">*</span>
                  </div>

                  {/* Radios */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <p className="text-[13px] font-bold text-slate-800 mb-2">Chương trình quan tâm:<span className="text-rose-500 ml-1">*</span></p>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                        {['Thạc sĩ', 'Tiến sĩ', 'Đào tạo văn bằng 2', 'Liên kết quốc tế'].map(prog => (
                          <label key={prog} className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="programType" required value={prog} onChange={handleChange} checked={formData.programType === prog} className="w-4 h-4 text-[#005496] border-slate-300 focus:ring-[#005496] transition-all" />
                            <span className="text-[13px] font-semibold text-slate-600 group-hover:text-[#005496] transition-colors">{prog}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Major */}
                  <div className="pt-1">
                    <p className="text-[13px] font-bold text-slate-800 mb-2">Ngành học dự kiến:<span className="text-rose-500 ml-1">*</span></p>
                    <div className="relative group">
                      <select name="major" required className="w-full bg-[#f8fafc] border border-slate-200 text-sm px-4 py-3 rounded-xl focus:bg-white focus:border-[#005496] focus:ring-1 focus:ring-[#005496] focus:shadow-md outline-none transition-all text-slate-600 font-medium appearance-none cursor-pointer" value={formData.major} onChange={handleChange}>
                        <option value="">Chọn ngành quan tâm</option>
                        {programs.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none group-focus-within:text-[#005496] transition-colors" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button type="submit" className="w-full bg-[#b11116] hover:bg-[#8f0e12] text-white text-sm font-bold py-[14px] rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative overflow-hidden group">
                      <span className="relative z-10 flex items-center gap-2">
                        Gửi thông tin nhận tư vấn <Send size={18} />
                      </span>
                      {/* Checkerboard/arrow detail */}
                      <div className="absolute right-0 top-0 h-full w-12 flex flex-wrap opacity-30 group-hover:translate-x-full transition-transform duration-500">
                        <div className="w-3 h-3 bg-white/20"></div>
                        <div className="w-3 h-3 bg-white/40"></div>
                        <div className="w-3 h-3 bg-transparent"></div>
                        <div className="w-3 h-3 bg-white/20"></div>
                        <div className="w-3 h-3 bg-white/40"></div>
                        <div className="w-3 h-3 bg-white/60"></div>
                      </div>
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4 font-medium">Bằng việc gửi thông tin, bạn đồng ý với chính sách bảo mật của Viện SĐH UFM.</p>
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
