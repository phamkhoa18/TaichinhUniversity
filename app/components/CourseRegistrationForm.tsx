'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function CourseRegistrationForm() {
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
    <section className="bg-[#111f3d] relative overflow-hidden py-16">
      <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
        <svg width="300" height="400" viewBox="0 0 300 400" fill="none">
           <path d="M50 -50 C 150 100, 300 150, 400 -50" stroke="#00f3b9" strokeWidth="20" strokeLinecap="round" />
           <path d="M100 -50 C 200 100, 350 150, 450 -50" stroke="#00f3b9" strokeWidth="20" strokeLinecap="round" />
           <path d="M150 -50 C 250 100, 400 150, 500 -50" stroke="#00f3b9" strokeWidth="20" strokeLinecap="round" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-8">
        
        {/* Left Side */}
        <div className="w-full lg:w-1/3 flex flex-col h-full relative">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-[40px] font-bold text-white mb-8 leading-tight">
              Liên hệ để nhận<br/>thông tin tư vấn
            </h2>
            
            <div className="space-y-4">
              {[
                'Phòng Tuyển sinh và Truyền thông',
                'Ban Phát triển CT Đào tạo Đặc biệt',
                'Viện Sau Đại học',
                'Viện Đào tạo Quốc tế (IEI)',
                'Phòng Đối ngoại'
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col group cursor-pointer">
                  <div className="flex items-center justify-between text-[#8cb0df] group-hover:text-white transition-colors py-2">
                    <span className="text-sm font-medium">{item}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  {idx < 4 && <div className="w-full h-px bg-white/10 mt-2"></div>}
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-[300px] w-full mt-auto hidden lg:block">
            {/* Yellow Blob */}
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#ffd200] rounded-tr-[100px] rounded-bl-[40px] rounded-tl-[80px] rounded-br-[60px] -z-10 transform -translate-x-10 translate-y-10"></div>
            {/* Student Image */}
            <img 
              src="https://chuyengia.iigvietnam.com/wp-content/uploads/2023/11/young-attractive-smiling-student-showing-thumb-up-outdoors-on-campus-at-the-university-1-3.png" 
              alt="Tư vấn viên" 
              className="absolute bottom-0 left-[-20px] w-[320px] h-[350px] object-cover object-top drop-shadow-2xl brightness-110 contrast-105"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-2/3">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[20px] p-6 md:p-10 shadow-2xl w-full relative"
          >
            {submitted ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Đã nhận thông tin!</h3>
                <p className="text-slate-500">Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
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
                <div className="space-y-5 pt-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-2">Chương trình đào tạo:<span className="text-rose-500 ml-1">*</span></p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      {['Thạc sĩ', 'Tiến sĩ', 'Đào tạo văn bằng 2', 'Liên kết quốc tế'].map(prog => (
                        <label key={prog} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name="programType" required value={prog} onChange={handleChange} checked={formData.programType === prog} className="w-4 h-4 text-[#005496] border-slate-300 focus:ring-[#005496]" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{prog}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dropdown Major */}
                <div className="pt-2">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Ngành học:<span className="text-rose-500 ml-1">*</span></p>
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
                    <span>Gửi</span>
                    {/* Checkerboard/arrow detail like in image */}
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
    </section>
  );
}
