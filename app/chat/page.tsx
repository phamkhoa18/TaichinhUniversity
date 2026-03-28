'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Send, Mic, Plus, Sparkles, GraduationCap,
  BookOpen, HelpCircle, Bot, User, ArrowLeft,
  MessageCircle, Lightbulb, Calendar, Clock,
  Shield, Globe, Phone, Mail, MapPin,
  ChevronRight, ExternalLink, Heart, Star,
  Brain, Cpu, Zap, Database, Network, Activity,
  Eye, Lock, RefreshCw, Layers
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

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
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
  { value: '<1s', label: 'Phản hồi tức thời', icon: Zap, color: '#f59e0b' },
  { value: '99%', label: 'Độ chính xác', icon: Shield, color: '#10b981' },
  { value: '24/7', label: 'Luôn sẵn sàng', icon: Globe, color: '#3b82f6' },
  { value: '12+', label: 'Chuyên ngành SĐH', icon: GraduationCap, color: '#8b5cf6' },
];

const FEATURES = [
  {
    icon: Brain,
    title: 'Xử lý Ngôn ngữ Tự Nhiên',
    desc: 'Mô hình AI tiên tiến hiểu ngữ cảnh, phân tích ngữ nghĩa và phản hồi chính xác bằng tiếng Việt.',
    gradient: 'from-[#005496] to-[#0ea5e9]',
    tag: 'NLP Engine',
  },
  {
    icon: Database,
    title: 'RAG — Truy xuất Thông minh',
    desc: 'Retrieval-Augmented Generation kết hợp Vector Search để trích xuất dữ liệu từ nguồn chính thức.',
    gradient: 'from-[#7c3aed] to-[#a78bfa]',
    tag: 'Vector DB',
  },
  {
    icon: Shield,
    title: 'Dữ liệu Xác thực & Bảo mật',
    desc: 'Thông tin được xác minh từ quy định chính thức của Viện Sau Đại học, cập nhật liên tục.',
    gradient: 'from-[#059669] to-[#34d399]',
    tag: 'Verified',
  },
];

const AI_PIPELINE = [
  { icon: Eye, label: 'Nhận diện ý định', desc: 'Intent Classification', color: '#3b82f6' },
  { icon: Brain, label: 'Phân tích ngữ cảnh', desc: 'Context Analysis', color: '#8b5cf6' },
  { icon: Database, label: 'Truy vấn Vector DB', desc: 'RAG Retrieval', color: '#0ea5e9' },
  { icon: Sparkles, label: 'Sinh câu trả lời', desc: 'Response Generation', color: '#10b981' },
];

const LINKS = [
  { label: 'Cổng thông tin ĐH Tài chính – Marketing', href: 'https://ufm.edu.vn', icon: Globe, desc: 'Website chính thức nhà trường' },
  { label: 'Viện Đào tạo Sau Đại học', href: '#', icon: GraduationCap, desc: 'Thông tin chương trình đào tạo' },
  { label: 'Liên hệ tư vấn trực tiếp', href: '#lien-he', icon: Phone, desc: 'Hotline & email hỗ trợ' },
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
   Neural Network SVG Background
   ═══════════════════════════════════════ */
function NeuralNetworkBg() {
  const nodes = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    cx: 5 + (i % 5) * 22 + (Math.random() * 10 - 5),
    cy: 10 + Math.floor(i / 5) * 22 + (Math.random() * 10 - 5),
    r: 1 + Math.random() * 1.5,
    delay: Math.random() * 3,
  })), []);

  const edges = useMemo(() => {
    const e: Array<{ x1: number; y1: number; x2: number; y2: number; delay: number }> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt((nodes[i].cx - nodes[j].cx) ** 2 + (nodes[i].cy - nodes[j].cy) ** 2);
        if (dist < 28 && Math.random() > 0.4) {
          e.push({ x1: nodes[i].cx, y1: nodes[i].cy, x2: nodes[j].cx, y2: nodes[j].cy, delay: Math.random() * 2 });
        }
      }
    }
    return e;
  }, [nodes]);

  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {edges.map((e, i) => (
        <motion.line
          key={`e-${i}`}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke="#005496"
          strokeWidth="0.15"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 2, delay: e.delay, repeat: Infinity, repeatType: 'reverse', repeatDelay: 3 }}
        />
      ))}
      {nodes.map((n) => (
        <motion.circle
          key={`n-${n.id}`}
          cx={n.cx} cy={n.cy} r={n.r}
          fill="#005496"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, delay: n.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════
   Floating AI Particles — Enhanced
   ═══════════════════════════════════════ */
function AIParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            background: i % 3 === 0
              ? 'rgba(0, 84, 150, 0.15)'
              : i % 3 === 1
                ? 'rgba(255, 210, 0, 0.2)'
                : 'rgba(139, 92, 246, 0.12)',
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            boxShadow: i % 3 === 0
              ? '0 0 8px rgba(0, 84, 150, 0.3)'
              : i % 3 === 1
                ? '0 0 8px rgba(255, 210, 0, 0.3)'
                : '0 0 8px rgba(139, 92, 246, 0.2)',
          }}
          animate={{
            y: [0, -(15 + Math.random() * 30), 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   AI Pipeline Animation
   ═══════════════════════════════════════ */
function AIPipelineVisualizer() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className="relative flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0"
    >
      {AI_PIPELINE.map((step, i) => (
        <motion.div key={i} variants={fadeUp} custom={i} className="flex items-center gap-0">
          <div className="group relative flex flex-col items-center">
            {/* Icon circle */}
            <div
              className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${step.color}10, ${step.color}05)`,
                border: `1.5px solid ${step.color}25`,
              }}
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: `1.5px solid ${step.color}20` }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
              />
              <step.icon size={24} style={{ color: step.color }} strokeWidth={1.5} />
            </div>
            {/* Label */}
            <div className="mt-3 text-center">
              <p className="text-[13px] font-semibold text-[#1e293b]">{step.label}</p>
              <p className="text-[10px] font-medium text-[#94a3b8] mt-0.5 uppercase tracking-wider">{step.desc}</p>
            </div>
          </div>
          {/* Connector line */}
          {i < AI_PIPELINE.length - 1 && (
            <div className="hidden md:flex items-center mx-2 md:mx-4 mb-10">
              <motion.div
                className="h-[2px] w-12 md:w-20 relative overflow-hidden rounded-full"
                style={{ background: `${AI_PIPELINE[i + 1].color}15` }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 w-1/2 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${step.color}, ${AI_PIPELINE[i + 1].color})` }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                />
              </motion.div>
              <ChevronRight size={14} className="text-[#cbd5e1] -ml-1" />
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Main Page
   ═══════════════════════════════════════ */
export default function ChatLandingPage() {
  const greeting = "Chào bạn! 😊 Mình là Trợ lý Ảo của Viện Sau Đại học UFM. Bạn cần hỗ trợ thông tin gì về tuyển sinh, học phí hay chương trình đào tạo ạ?";
  const { displayed, done } = useTypingEffect(greeting, 30);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans selection:bg-[#005496]/20 selection:text-[#005496]">
      <Header />

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative pt-[120px] pb-16 md:pt-[150px] md:pb-24 overflow-hidden">
        {/* Neural Network Background */}
        <NeuralNetworkBg />

        {/* Grid overlay */}
        <div className="absolute inset-0 ai-grid-bg pointer-events-none" />

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[600px] bg-gradient-to-b from-[#e8f4fd] via-[#f0f7ff] to-transparent rounded-[0_0_50%_50%/0_0_100px_100px] opacity-70" />
          {/* Animated glowing orbs */}
          <motion.div
            className="absolute top-20 right-[10%] w-[300px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,84,150,0.08), transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-40 left-[5%] w-[250px] h-[250px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)' }}
            animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute bottom-10 right-[20%] w-[200px] h-[200px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,210,0,0.08), transparent 70%)' }}
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        <AIParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left: Illustration + Tech badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease }}
              className="flex-1 flex justify-center order-2 lg:order-1"
            >
              <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] lg:w-[440px] lg:h-[440px]">
                {/* Rotating ring behind mascot */}
                <motion.div
                  className="absolute inset-[-20px] rounded-full border border-dashed border-[#005496]/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-[-40px] rounded-full border border-dashed border-[#8b5cf6]/8"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                />

                <Image
                  src="/images/ufm_chatbot.png"
                  alt="UFM AI Chatbot"
                  fill
                  className="object-contain drop-shadow-xl relative z-10"
                  priority
                />

                {/* Floating tech badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute top-4 -left-4 md:top-8 md:-left-8 ai-glass px-3 py-2 rounded-xl shadow-lg z-20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] flex items-center justify-center">
                      <Brain size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-medium text-[#94a3b8] uppercase tracking-wider">Engine</p>
                      <p className="text-[12px] font-bold text-[#1e293b]">LangGraph</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute top-12 -right-2 md:top-16 md:-right-6 ai-glass px-3 py-2 rounded-xl shadow-lg z-20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center">
                      <Database size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-medium text-[#94a3b8] uppercase tracking-wider">Search</p>
                      <p className="text-[12px] font-bold text-[#1e293b]">Vector DB</p>
                    </div>
                  </div>
                </motion.div>

                {/* Powered by badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-2 -right-2 md:bottom-4 md:right-0 ai-glass px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 z-20"
                >
                  <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#005496] to-[#0284c7] flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#005496]/20"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-[#64748b] uppercase tracking-wider">Powered by</p>
                    <p className="text-[14px] font-bold ai-shimmer-text">AI UFM</p>
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
                <div className="relative">
                  <Bot size={14} className="text-[#005496]" />
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-[#005496] tracking-wide uppercase">Trợ lý AI Sau Đại học</span>
              </motion.div>

              <motion.h1
                initial="hidden" animate="visible" variants={fadeUp} custom={1}
                className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.15] tracking-tight text-[#0f172a] mb-5"
              >
                Trợ lý{' '}
                <span className="relative">
                  <span className="ai-shimmer-text">tuyển sinh</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease }}
                    className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#ffd200] to-[#ffb800] rounded-full origin-left"
                  />
                </span>
                <br />
                <span className="text-[28px] md:text-[36px] lg:text-[42px] font-medium text-[#475569]">
                  thông minh
                </span>
              </motion.h1>

              <motion.p
                initial="hidden" animate="visible" variants={fadeUp} custom={2}
                className="text-[16px] md:text-[18px] font-normal text-[#64748b] leading-[1.7] max-w-lg mx-auto lg:mx-0 mb-8"
              >
                Sử dụng công nghệ <span className="font-semibold text-[#005496]">AI tiên tiến</span> và <span className="font-semibold text-[#8b5cf6]">RAG</span> để hỗ trợ tư vấn tuyển sinh Sau Đại học — chính xác, nhanh chóng, 24/7.
              </motion.p>

              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} custom={3}
                className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
              >
                <Link
                  href="/chat/create"
                  className="group relative flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#005496] to-[#0068b8] text-white rounded-full font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,84,150,0.3)] hover:-translate-y-0.5 overflow-hidden w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#0068b8] to-[#005496] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Shimmer effect on hover */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)', backgroundSize: '200% 100%', animation: 'ai-shimmer 2s linear infinite' }}
                  />
                  <MessageCircle size={17} className="relative z-10" />
                  <span className="relative z-10">Trò chuyện ngay</span>
                </Link>
                <span className="text-[13px] text-[#94a3b8] font-normal flex items-center gap-1.5">
                  <Activity size={13} className="text-emerald-400" />
                  Online — phản hồi tức thời
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS RIBBON — Glassmorphism ═══════════ */}
      <section className="relative py-8 bg-white/80 backdrop-blur-sm border-y border-[#e2e8f0]/60">
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
                className="group relative flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-500 hover:bg-[#f8fafc] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${stat.color}10`, color: stat.color }}
                >
                  <stat.icon size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[26px] md:text-[30px] font-bold text-[#0f172a] leading-none tracking-tight">{stat.value}</p>
                  <p className="text-[12px] font-medium text-[#94a3b8] mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ AI PIPELINE SECTION ═══════════ */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#f8fafc] relative overflow-hidden">
        <div className="absolute inset-0 ai-grid-bg pointer-events-none opacity-50" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b5cf6]/5 border border-[#8b5cf6]/10 mb-5"
            >
              <Cpu size={13} className="text-[#8b5cf6]" />
              <span className="text-[11px] font-semibold text-[#8b5cf6] uppercase tracking-wider">How it works</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-[28px] md:text-[36px] font-bold text-[#0f172a] tracking-tight mb-3">
              Quy trình xử lý <span className="ai-shimmer-text">AI Pipeline</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[15px] text-[#64748b] font-normal max-w-lg mx-auto">
              Mỗi câu hỏi được xử lý qua pipeline AI đa tầng, đảm bảo phản hồi chính xác và nhanh chóng.
            </motion.p>
          </motion.div>

          <AIPipelineVisualizer />
        </div>
      </section>

      {/* ═══════════ CHAT PREVIEW SECTION ═══════════ */}
      <section id="chat-area" className="py-16 md:py-24 bg-[#f8fafc] relative overflow-hidden">
        <AIParticles />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-[28px] md:text-[36px] font-bold text-[#0f172a] tracking-tight mb-3">
              Trải nghiệm <span className="text-[#005496]">ngay</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[15px] text-[#64748b] font-normal max-w-md mx-auto">
              Giao diện trò chuyện trực quan, dễ sử dụng. Đặt câu hỏi và nhận phản hồi tức thời.
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
            <div className="absolute -inset-4 bg-gradient-to-br from-[#005496]/5 via-transparent to-[#8b5cf6]/5 rounded-[36px] blur-xl" />

            <div className="relative bg-white rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,84,150,0.1),0_0_0_1px_rgba(0,84,150,0.04)] overflow-hidden">

              {/* Chat Header with gradient border */}
              <div className="h-[3px] ai-gradient-border" />
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#005496] to-[#0068b8]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-white border border-white/20 flex items-center justify-center overflow-hidden">
                    <Image src="/images/ufm_chatbot.png" alt="UFM Bot" width={40} height={40} className="w-full h-full object-cover" />
                    <motion.div
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#005496]"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                      Trợ lý UFM
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-white/15 text-white/80 uppercase tracking-wider">AI</span>
                    </h3>
                    <p className="text-[11px] text-white/70 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Trực tuyến
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Shield size={14} className="text-white/70" />
                  </div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="px-6 py-8 min-h-[320px] md:min-h-[380px] bg-[#f8fafc] relative">
                <div className="absolute inset-0 ai-grid-bg opacity-30" />

                <div className="space-y-6 relative z-10">
                  {/* User bubble */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-end"
                  >
                    <div className="flex items-end gap-2.5 max-w-[80%]">
                      <div className="bg-[#3578E5] text-white px-5 py-3.5 rounded-[16px] rounded-br-[4px] text-[14px] leading-relaxed shadow-[0_1px_4px_rgba(53,120,229,0.2)]">
                        Cho mình hỏi điều kiện thi đầu vào Thạc sĩ ạ?
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-[#64748b]" />
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
                    <div className="w-8 h-8 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm overflow-hidden">
                      <Image src="/images/ufm_chatbot.png" alt="UFM Bot" width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white border border-[#e2e8f0]/80 text-[#334155] px-5 py-4 rounded-[20px] rounded-bl-md text-[14px] leading-[1.7] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
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
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#005496] to-[#0068b8] text-white rounded-full text-[13px] font-medium whitespace-nowrap transition-all hover:shadow-md hover:-translate-y-0.5 flex-shrink-0">
                    <Plus size={14} />
                    Cuộc trò chuyện mới
                  </button>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-full text-[13px] font-medium text-[#475569] whitespace-nowrap transition-all hover:border-[#005496]/30 hover:text-[#005496] hover:bg-[#f0f7ff] hover:-translate-y-0.5 hover:shadow-sm flex-shrink-0"
                    >
                      <s.icon size={14} style={{ color: s.color }} />
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="px-6 py-5 bg-white border-t border-[#f1f5f9]">
                <div className="flex items-end gap-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-5 py-3.5 transition-all focus-within:border-[#005496]/40 focus-within:shadow-[0_0_0_3px_rgba(0,84,150,0.06)] focus-within:bg-white">
                  <textarea
                    placeholder="Bạn muốn hỏi gì?"
                    rows={1}
                    className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] text-[#1e293b] placeholder-[#94a3b8] leading-relaxed"
                  />
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#005496] hover:bg-[#f0f7ff] transition-all">
                      <Mic size={18} />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[#3578E5] flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES SECTION — Tech Cards ═══════════ */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 ai-grid-bg pointer-events-none opacity-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10b981]/5 border border-[#10b981]/10 mb-5"
            >
              <Layers size={13} className="text-[#10b981]" />
              <span className="text-[11px] font-semibold text-[#10b981] uppercase tracking-wider">Core Technology</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-[28px] md:text-[36px] font-bold text-[#0f172a] tracking-tight mb-4">
              Công nghệ <span className="ai-shimmer-text">AI tiên tiến</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[15px] md:text-[16px] font-normal text-[#64748b] max-w-lg mx-auto leading-relaxed">
              Nền tảng kết hợp LLM, RAG và Vector Search — phản hồi chính xác, đáng tin cậy.
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
                className="group relative bg-[#f8fafc] rounded-[24px] p-8 border border-[#e2e8f0]/60 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(0,84,150,0.08)] hover:border-[#005496]/10 hover:-translate-y-1 overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 20%, ${feat.gradient.includes('005496') ? 'rgba(0,84,150,0.03)' : feat.gradient.includes('7c3aed') ? 'rgba(124,58,237,0.03)' : 'rgba(5,150,105,0.03)'}, transparent 70%)` }}
                />
                
                <div className="relative z-10">
                  {/* Tag */}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f1f5f9] text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-5">
                    {feat.tag}
                  </span>

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feat.icon size={24} className="text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#0f172a] mb-3">{feat.title}</h3>
                  <p className="text-[14px] font-normal text-[#64748b] leading-[1.7]">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
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
              Khám phá thêm
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-[14px] text-[#94a3b8] font-normal">
              Kết nối với nhà trường, phòng ban và các đơn vị.
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
                className="group flex items-center justify-between p-5 bg-white border border-[#e2e8f0]/60 rounded-2xl transition-all duration-300 hover:border-[#005496]/15 hover:shadow-[0_8px_30px_-10px_rgba(0,84,150,0.08)] hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-[#005496] group-hover:bg-[#005496] group-hover:text-white transition-all duration-300">
                    <link.icon size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#1e293b] group-hover:text-[#005496] transition-colors">{link.label}</p>
                    <p className="text-[12px] text-[#94a3b8] font-normal mt-0.5">{link.desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#cbd5e1] group-hover:text-[#005496] group-hover:translate-x-1 transition-all" />
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
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]/40"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}10`, color: item.color }}
                >
                  <item.icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-[14px] font-medium text-[#334155]">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA — Tech-Enhanced ═══════════ */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#005496] to-[#003d6b]" />
        {/* Neural pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ffd200] rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#0284c7] rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#38bdf8]/10"
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
              <Sparkles size={13} className="text-[#ffd200]" />
              <span className="text-[11px] font-semibold text-[#ffd200] uppercase tracking-wider">AI-Powered</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-[28px] md:text-[40px] font-bold text-white tracking-tight mb-6 leading-tight">
              Bắt đầu cuộc trò chuyện<br className="hidden md:block" /> ngay hôm nay
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[15px] text-white/60 font-normal max-w-md mx-auto mb-10 leading-relaxed">
              Mở phiên tương tác với hệ thống AI để giải quyết nhanh chóng mọi thắc mắc về tuyển sinh sau đại học.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/chat/create"
                className="group inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-white text-[#005496] rounded-full font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 relative overflow-hidden"
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(110deg, transparent 30%, rgba(0,84,150,0.05) 50%, transparent 70%)', backgroundSize: '200% 100%', animation: 'ai-shimmer 2s linear infinite' }}
                />
                <MessageCircle size={17} className="relative z-10" />
                <span className="relative z-10">Bắt đầu</span>
              </Link>
              <a
                href="https://ufm.edu.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-medium text-[15px] transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 backdrop-blur-sm"
              >
                <ExternalLink size={15} />
                Website
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ═══════════ Custom scrollbar hide ═══════════ */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
