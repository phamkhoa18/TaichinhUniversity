'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Send, Mic, Plus, GraduationCap,
  BookOpen, HelpCircle, Bot, User,
  MessageCircle, Calendar,
  Shield, Globe, Phone, Mail, MapPin,
  ChevronRight, ExternalLink, Star,
  Award, Clock, Building
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

/* ═══════════════════════════════════════
   Animation variants
   ═══════════════════════════════════════ */
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease, delay: i * 0.1 }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } }
};

const slideRight = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease, delay: i * 0.08 }
  })
};

/* ═══════════════════════════════════════
   Data
   ═══════════════════════════════════════ */
const SUGGESTIONS = [
  { icon: GraduationCap, text: 'Điều kiện xét tuyển Thạc sĩ 2026', color: '#005496' },
  { icon: BookOpen, text: 'Học phí chương trình MBA', color: '#0284c7' },
  { icon: Calendar, text: 'Lịch thi đầu vào đợt gần nhất', color: '#7c3aed' },
  { icon: HelpCircle, text: 'Hồ sơ cần chuẩn bị những gì?', color: '#059669' },
];

const STATS = [
  { value: '24/7', label: 'Luôn sẵn sàng', icon: Clock, color: '#f59e0b' },
  { value: '100%', label: 'Tin cậy & Chính xác', icon: Shield, color: '#10b981' },
  { value: '15+', label: 'Chuyên ngành Đào tạo', icon: BookOpen, color: '#3b82f6' },
  { value: 'Top', label: 'Chất lượng Giáo dục', icon: Award, color: '#8b5cf6' },
];

const FEATURES = [
  {
    icon: Clock,
    title: 'Tư vấn Liên tục 24/7',
    desc: 'Luôn sẵn sàng đồng hành và giải đáp mọi thắc mắc của bạn về quy chế, điều kiện xét tuyển bất kể thời gian.',
    gradient: 'from-[#005496] to-[#0ea5e9]',
    tag: 'Tức thời',
  },
  {
    icon: GraduationCap,
    title: 'Đào tạo Đa Cấp Đồ',
    desc: 'Thông tin chi tiết về các chương trình đào tạo trình độ Thạc sĩ, Tiến sĩ tại Đại học Tài chính - Marketing.',
    gradient: 'from-[#7c3aed] to-[#a78bfa]',
    tag: 'Đa dạng',
  },
  {
    icon: Shield,
    title: 'Dữ liệu Thẩm định',
    desc: 'Toàn bộ thông tin tư vấn được cập nhật và kiểm duyệt trực tiếp từ Viện Đào tạo Sau đại học UFM.',
    gradient: 'from-[#059669] to-[#34d399]',
    tag: 'Chính xác cao',
  },
];

const LINKS = [
  { label: 'Cổng thông tin ĐH Tài chính – Marketing', href: 'https://ufm.edu.vn', icon: Globe, desc: 'Website chính thức nhà trường' },
  { label: 'Viện Đào tạo Sau Đại học', href: '#', icon: Building, desc: 'Thông tin chương trình đào tạo' },
  { label: 'Chuyên trang Tuyển sinh', href: '#', icon: GraduationCap, desc: 'Quy chế & thông báo tuyển sinh' },
];

/* ═══════════════════════════════════════
   Typing effect hook
   ═══════════════════════════════════════ */
function useTypingEffect(text: string, speed = 35) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return { displayed, done };
}

/* ═══════════════════════════════════════
   Floating Decorations (replaces tech particles)
   ═══════════════════════════════════════ */
function FloatingDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 10 + Math.random() * 20,
            height: 10 + Math.random() * 20,
            background: i % 2 === 0
              ? 'rgba(0, 84, 150, 0.05)'
              : 'rgba(255, 210, 0, 0.1)',
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            filter: 'blur(4px)'
          }}
          animate={{
            y: [0, -(20 + Math.random() * 30), 0],
            x: [0, (Math.random() - 0.5) * 40, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   Main Page
   ═══════════════════════════════════════ */
export default function ChatLandingPage() {
  const greeting = "Chào bạn! 😊 Mình là Chatbot UFM - Trợ lý Ảo của Viện Sau Đại học UFM. Bạn cần hỗ trợ thông tin gì về tuyển sinh, học phí hay chương trình đào tạo ạ?";
  const { displayed, done } = useTypingEffect(greeting, 30);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans selection:bg-[#005496]/20 selection:text-[#005496]">
      <Header />

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative pt-[120px] pb-16 md:pt-[150px] md:pb-24 overflow-hidden">
        {/* Soft background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#f0f7ff] to-[#e6f2fc] -z-10" />

        <FloatingDecorations />

        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <motion.div
            className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,84,150,0.06), transparent 70%)', filter: 'blur(40px)' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-40 left-[5%] w-[350px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,210,0,0.08), transparent 70%)', filter: 'blur(50px)' }}
            animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left: Illustration + Educational badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease }}
              className="flex-1 flex justify-center order-2 lg:order-1"
            >
              <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] lg:w-[440px] lg:h-[440px]">
                {/* Visual rings */}
                <div className="absolute inset-[-10px] rounded-full border border-[#005496]/10" />
                <div className="absolute inset-[-30px] rounded-full border border-dashed border-[#0284c7]/15" />

                <Image
                  src="/images/ufm_chatbot.png"
                  alt="Trợ lý Tuyển sinh UFM"
                  fill
                  className="object-contain drop-shadow-2xl relative z-10"
                  priority
                />

                {/* Educational floating badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute top-4 -left-4 md:top-8 md:-left-8 bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-2xl shadow-xl border border-[#e2e8f0]/80 z-20"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center shadow-inner">
                      <GraduationCap size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">Đào tạo</p>
                      <p className="text-[13px] font-bold text-[#0f172a]">Sau Đại học</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute top-16 -right-2 md:top-24 md:-right-6 bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-2xl shadow-xl border border-[#e2e8f0]/80 z-20"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#eab308] to-[#ca8a04] flex items-center justify-center shadow-inner">
                      <Star size={16} className="text-white" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">Chất lượng</p>
                      <p className="text-[13px] font-bold text-[#0f172a]">Hàng đầu</p>
                    </div>
                  </div>
                </motion.div>

                {/* Assistant badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute -bottom-2 -right-2 md:bottom-2 md:right-4 bg-white px-4 py-3 rounded-full shadow-[0_10px_40px_-10px_rgba(0,84,150,0.3)] border border-[#005496]/10 flex items-center gap-3 z-20"
                >
                  <div className="relative w-10 h-10 rounded-full bg-[#005496] flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#64748b]">Tư vấn viên</p>
                    <p className="text-[15px] font-bold text-[#005496]">Chatbot UFM</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005496]/5 border border-[#005496]/10 mb-6"
              >
                <Award size={14} className="text-[#005496]" />
                <span className="text-[12px] font-semibold text-[#005496] tracking-wide uppercase">Cổng Tư Vấn Tuyển Sinh</span>
              </motion.div>

              <motion.h1
                initial="hidden" animate="visible" variants={fadeUp} custom={1}
                className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.15] tracking-tight text-[#0f172a] mb-5"
              >
                Khởi tạo tương lai với{' '}
                <span className="relative inline-block mt-2">
                  <span className="text-[#005496]">Sau Đại học UFM</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease }}
                    className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#ffd200] rounded-full origin-left"
                  />
                </span>
              </motion.h1>

              <motion.p
                initial="hidden" animate="visible" variants={fadeUp} custom={2}
                className="text-[16px] md:text-[18px] font-normal text-[#64748b] leading-[1.7] max-w-lg mx-auto lg:mx-0 mb-8"
              >
                Tìm hiểu nhanh chóng và chính xác về các chương trình Thạc sĩ, Tiến sĩ tại Trường Đại học Tài chính - Marketing cùng trợ lý tư vấn trực tuyến.
              </motion.p>

              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} custom={3}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/chat/create"
                  className="group relative flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#005496] to-[#0068b8] text-white rounded-full font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,84,150,0.3)] hover:-translate-y-0.5 overflow-hidden w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#0068b8] to-[#005496] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <MessageCircle size={18} className="relative z-10" />
                  <span className="relative z-10">Bắt đầu tư vấn ngay</span>
                </Link>
                
                <a
                  href="#thong-tin"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-[#e2e8f0] text-[#475569] rounded-full font-semibold text-[15px] transition-all duration-300 hover:bg-[#f8fafc] hover:text-[#005496] hover:border-[#005496]/30 w-full sm:w-auto"
                >
                  <BookOpen size={18} />
                  <span>Tìm hiểu thêm</span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS RIBBON ═══════════ */}
      <section className="relative py-8 bg-white border-y border-[#e2e8f0]/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="group relative flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-500 hover:bg-[#f8fafc] hover:shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[24px] md:text-[28px] font-bold text-[#0f172a] leading-none tracking-tight">{stat.value}</p>
                  <p className="text-[12px] font-medium text-[#64748b] mt-1.5">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <section id="thong-tin" className="py-20 md:py-24 bg-[#f8fafc] relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 mb-5"
            >
              <Award size={14} className="text-[#059669]" />
              <span className="text-[12px] font-semibold text-[#059669] uppercase tracking-wider">Đồng hành cùng bạn</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-[28px] md:text-[36px] font-bold text-[#0f172a] tracking-tight mb-4">
              Tại sao chọn tư vấn cùng <span className="text-[#005496]">Chatbot UFM?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[15px] md:text-[16px] font-normal text-[#64748b] max-w-xl mx-auto leading-relaxed">
              Trợ lý tư vấn sẵn sàng hướng dẫn chi tiết các bước chuẩn bị hồ sơ, cập nhật quy chế và định hướng ngành học phù hợp cho bạn.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="group relative bg-white rounded-[24px] p-8 border border-[#e2e8f0] transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,84,150,0.1)] hover:border-[#005496]/20 hover:-translate-y-1"
              >
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feat.icon size={26} className="text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[19px] font-bold text-[#0f172a] mb-3">{feat.title}</h3>
                  <p className="text-[15px] font-normal text-[#64748b] leading-[1.7]">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CHAT PREVIEW SECTION ═══════════ */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-[28px] md:text-[36px] font-bold text-[#0f172a] tracking-tight mb-4">
              Giao diện <span className="text-[#005496]">Thân thiện</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[15px] text-[#64748b] font-normal max-w-md mx-auto">
              Nhắn tin tự nhiên như đang trò chuyện với chuyên viên tư vấn của phòng tuyển sinh.
            </motion.p>
          </motion.div>

          {/* Chat Interface Mockup */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={scaleIn}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#005496]/5 via-transparent to-[#eab308]/5 rounded-[36px] blur-xl" />

            <div className="relative bg-white rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,84,150,0.1),0_0_0_1px_rgba(0,84,150,0.04)] overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#005496] border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-white border-2 border-white/20 flex items-center justify-center overflow-hidden">
                    <Image src="/images/ufm_chatbot.png" alt="Chatbot UFM" width={36} height={36} className="w-full h-full object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#005496]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                      Chatbot UFM - Tư vấn SĐH
                    </h3>
                    <p className="text-[12px] text-white/80 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Trực tuyến
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <HeaderLogoMini />
                </div>
              </div>

              {/* Chat Body */}
              <div className="px-6 py-8 min-h-[320px] bg-[#f8fafc]">
                <div className="space-y-6">
                  {/* User bubble */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-end"
                  >
                    <div className="flex items-end gap-2.5 max-w-[80%]">
                      <div className="bg-[#005496] text-white px-5 py-3.5 rounded-[20px] rounded-br-[6px] text-[15px] leading-relaxed shadow-sm">
                        Cho mình hỏi điều kiện dự thi Thạc sĩ ngành Quản trị kinh doanh ạ?
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#cbd5e1] flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-[#64748b]" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Bot bubble */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-2.5 max-w-[85%]"
                  >
                    <div className="w-9 h-9 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden mt-1">
                      <Image src="/images/ufm_chatbot.png" alt="UFM Bot" width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white border border-[#e2e8f0] text-[#334155] px-5 py-4 rounded-[20px] rounded-bl-[6px] text-[15px] leading-[1.7] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                      {displayed}
                      {!done && (
                        <span className="inline-block w-[2px] h-4 mx-1 bg-[#005496] rounded-full align-middle" style={{ animation: 'ai-typing-cursor 0.8s ease infinite' }} />
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Suggestion Chips */}
              <div className="px-6 py-4 bg-white border-t border-[#f1f5f9]">
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e8f0] rounded-full text-[13px] font-medium text-[#475569] whitespace-nowrap hover:border-[#005496]/40 hover:text-[#005496] hover:bg-[#f8fafc] transition-colors"
                    >
                      <s.icon size={15} className="text-[#005496]" />
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="px-6 py-5 bg-white border-t border-[#f1f5f9]">
                <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-full px-5 py-2.5">
                  <Plus size={20} className="text-[#94a3b8]" />
                  <input
                    type="text"
                    disabled
                    placeholder="Nhập câu hỏi của bạn..."
                    className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#1e293b]"
                  />
                  <Mic size={20} className="text-[#94a3b8] mr-2" />
                  <div className="w-10 h-10 rounded-full bg-[#005496] flex items-center justify-center text-white shadow-md">
                    <Send size={16} className="-ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ LINKS SECTION ═══════════ */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-[24px] md:text-[30px] font-bold text-[#0f172a] tracking-tight mb-3">
              Thông tin Hữu ích
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[15px] text-[#64748b] font-normal">
              Các liên kết nhanh đến hệ thống đào tạo của trường.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
            className="flex flex-col gap-3"
          >
            {LINKS.map((link, i) => (
              <motion.a
                key={i}
                variants={slideRight}
                custom={i}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center justify-between p-5 bg-white border border-[#e2e8f0] rounded-2xl transition-all duration-300 hover:border-[#005496] hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-[#005496] group-hover:bg-[#005496] group-hover:text-white transition-all duration-300">
                    <link.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-[#1e293b] group-hover:text-[#005496] transition-colors">{link.label}</p>
                    <p className="text-[13px] text-[#64748b] font-normal mt-0.5">{link.desc}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#cbd5e1] group-hover:text-[#005496] group-hover:translate-x-1 transition-all" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CONTACT SECTION ═══════════ */}
      <section id="lien-he" className="py-20 bg-white border-t border-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: MapPin, label: 'Địa chỉ', value: '2/4 Trần Xuân Soạn, P. Tân Thuận Tây, Q.7, TP.HCM', color: '#005496' },
              { icon: Phone, label: 'Điện thoại', value: '(028) 3822 5048', color: '#059669' },
              { icon: Mail, label: 'Email', value: 'sdh@ufm.edu.vn', color: '#7c3aed' },
              { icon: Globe, label: 'Website', value: 'ufm.edu.vn', color: '#0284c7' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]/60"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-[14px] font-medium text-[#1e293b]">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-[#005496]">
        {/* Abstract background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ffd200] rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-[30px] md:text-[40px] font-bold text-white tracking-tight mb-6 leading-tight">
              Sẵn sàng bắt đầu hành trình<br className="hidden md:block" /> học vị mới cùng UFM?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[16px] text-white/80 font-normal max-w-md mx-auto mb-10 leading-relaxed">
              Trợ lý Chatbot UFM luôn sẵn sàng giải đáp mọi thắc mắc của bạn về thông tin tuyển sinh 24/7.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/chat/create"
                className="group inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-[#ffd200] text-[#005496] rounded-full font-bold text-[16px] transition-all hover:bg-yellow-400 hover:shadow-lg hover:-translate-y-1"
              >
                <MessageCircle size={20} />
                <span>Trò chuyện ngay</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ═══════════ Utilities ═══════════ */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes ai-typing-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Simple Logo component for the chat header
function HeaderLogoMini() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
