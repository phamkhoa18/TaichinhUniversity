'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ── Markdown components for compact chatbot widget ── */
const chatMarkdown: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-[1.65]">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic opacity-80">{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#3578E5] underline underline-offset-2 decoration-[#3578E5]/30 hover:decoration-[#3578E5]/60 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-1.5 ml-0.5 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1.5 ml-0.5 space-y-1 list-decimal list-inside marker:text-[#888] marker:font-semibold">{children}</ol>
  ),
  li: ({ children, ...props }) => {
    const isOrdered = (props as any).ordered;
    return (
      <li className={`leading-[1.65] ${!isOrdered ? 'flex items-start gap-1.5' : ''}`}>
        {!isOrdered && (
          <span className="mt-[7px] w-[4px] h-[4px] rounded-full bg-[#3578E5]/60 flex-shrink-0" />
        )}
        <span className="flex-1">{children}</span>
      </li>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="my-1.5 pl-3 border-l-[2px] border-[#3578E5]/30 text-[#555] italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className="block my-1.5 p-2.5 bg-[#1e293b] text-[#e2e8f0] text-[11.5px] rounded-lg font-mono leading-[1.6] overflow-x-auto whitespace-pre-wrap break-words">
          {children}
        </code>
      );
    }
    return (
      <code className="px-1 py-0.5 bg-white/60 text-[#e11d48] text-[12px] rounded font-mono border border-black/[0.06]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-1.5 rounded-lg overflow-hidden">{children}</pre>
  ),
  h1: ({ children }) => (
    <h1 className="text-[14px] font-bold mt-3 mb-1 pb-1 border-b border-black/[0.06]">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-[13.5px] font-bold mt-2.5 mb-1">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[13px] font-semibold mt-2 mb-0.5">{children}</h3>
  ),
  table: ({ children }) => (
    <div className="my-1.5 overflow-x-auto rounded-lg border border-black/[0.06]">
      <table className="w-full text-[11.5px] border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#f5f5f5]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-2 py-1.5 text-left font-semibold text-[#555] border-b border-black/[0.08] whitespace-nowrap">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-2 py-1.5 border-b border-black/[0.04] text-[#333]">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-[#fafafa] transition-colors">{children}</tr>
  ),
  hr: () => (
    <hr className="my-2 border-0 h-px bg-black/[0.06]" />
  ),
};

/* ── Strip [Nguồn: ...] references from bot text ── */
function cleanSources(raw: string): string {
  // Remove [Nguồn: xxx](url) and [Nguồn: xxx] (with or without number, dash, colon)
  return raw
    .replace(/\[Nguồn(?:\s*\d*)?(?:\s*[—:–]\s*)?[^\]]*\](?:\([^)]*\))?/g, '')
    .replace(/\n{3,}/g, '\n\n') // collapse excess newlines left behind
    .trim();
}

/* ── Render bot message with markdown ── */
function BotBubbleContent({ text }: { text: string }) {
  const cleaned = cleanSources(text);
  return (
    <div className="cb-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={chatMarkdown}>
        {cleaned}
      </ReactMarkdown>
    </div>
  );
}

const WELCOME_MSG = {
  id: 1,
  text: 'Xin chào Quý khách! Trợ lý rất vui được hỗ trợ Quý khách. Quý khách cần tư vấn về tuyển sinh Sau Đại học hay thông tin nào khác ạ? 😊',
  sender: 'bot' as const,
};

const STORAGE_KEY = 'ufm_chatbot_messages';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: 'bot' | 'user' }[]
  >([WELCOME_MSG]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasRestoredRef = useRef(false);

  /* ── Restore messages from localStorage on mount ── */
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 1) {
          setMessages(parsed);
        }
      }
    } catch { /* ignore */ }
  }, []);

  /* ── Save messages to localStorage on change ── */
  useEffect(() => {
    if (messages.length > 1) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch { /* ignore */ }
    }
  }, [messages]);

  /* ── Auto-scroll ── */
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);

  useEffect(() => {
    if (!showResumePrompt) scrollToBottom();
  }, [messages, isTyping, scrollToBottom, showResumePrompt]);

  /* ── Handle open — show resume prompt if there's history ── */
  const handleOpen = useCallback(() => {
    if (messages.length > 1) {
      setShowResumePrompt(true);
    }
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 350);
  }, [messages]);

  const handleResume = useCallback(() => {
    setShowResumePrompt(false);
    setTimeout(() => {
      scrollToBottom(false);
      inputRef.current?.focus();
    }, 100);
  }, [scrollToBottom]);

  const handleNewChat = useCallback(() => {
    setMessages([WELCOME_MSG]);
    setShowResumePrompt(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /* ── Scroll detection ── */
  const handleScroll = useCallback(() => {
    if (!chatBodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  }, []);

  /* ── Send message ── */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg = { id: Date.now(), text: userText, sender: 'user' as const };

    const chatHistory = messages
      .filter((m) => m.id !== 1)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_FASTAPI_URL || 'https://chatbot-ufm-api.vincode.xyz';
      const res = await fetch(`${apiBase}/api/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          query: userText,
          chat_history: chatHistory,
          session_id: 'guest_web_session',
        }),
      });
      if (!res.ok) throw new Error('err');
      const data = await res.json();
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: data.response, sender: 'bot' },
      ]);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Rất tiếc, đã có lỗi kết nối đến máy chủ tư vấn. Vui lòng thử lại sau!',
          sender: 'bot',
        },
      ]);
    }
  };

  return (
    <>
      {/* ═══ FLOATING BUTTON ═══ */}
      <div className="fixed bottom-5 right-5 z-[9999]">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={handleOpen}
              className="group relative w-[62px] h-[62px] rounded-full cursor-pointer"
              aria-label="Mở khung chat tư vấn"
            >
              {/* Shadow ring */}
              <div className="absolute inset-0 rounded-full bg-white shadow-[0_2px_20px_rgba(0,0,0,0.12)]" />
              {/* Mascot */}
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/ufm_chatbot.png"
                  alt="Chat"
                  width={52}
                  height={52}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-0.5 right-0.5 z-20 w-[14px] h-[14px] rounded-full bg-[#22c55e] border-[2.5px] border-white" />
              {/* Pulse */}
              <span className="absolute inset-[-3px] rounded-full border-2 border-[#22c55e]/40 animate-[chatPulse_2.5s_ease-out_infinite]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ CHAT WIDGET ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="
              fixed z-[9999] flex flex-col
              bg-white overflow-hidden
              shadow-[0_5px_40px_rgba(0,0,0,0.12)]
              border border-black/[0.06]

              bottom-0 left-0 right-0 h-[100dvh]
              rounded-none

              sm:bottom-5 sm:right-5 sm:left-auto
              sm:w-[380px] sm:h-[540px] sm:max-h-[80vh]
              sm:rounded-2xl
            "
          >
            {/* ─── HEADER ─── */}
            <div className="flex items-center justify-between h-[56px] px-4 bg-white border-b border-black/[0.06] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-[34px] h-[34px] rounded-full overflow-hidden flex-shrink-0 ring-1 ring-black/[0.06]">
                  <Image
                    src="/images/ufm_chatbot.png"
                    alt="UFM"
                    width={34}
                    height={34}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[15px] font-bold text-[#1a1a1a] tracking-[-0.01em]">
                  UFM Tư vấn
                </span>
              </div>
              {/* Minimize — dash icon giống VinFast */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-lg hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors cursor-pointer"
                aria-label="Thu nhỏ"
              >
                <svg width="16" height="2" viewBox="0 0 16 2" fill="none">
                  <rect width="16" height="2" rx="1" fill="#1a1a1a" />
                </svg>
              </button>
            </div>

            {/* ─── RESUME PROMPT OVERLAY ─── */}
            <AnimatePresence>
              {showResumePrompt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-30 bg-white flex flex-col items-center justify-center px-8 text-center"
                >
                  {/* Mascot */}
                  <div className="w-[56px] h-[56px] rounded-2xl overflow-hidden ring-1 ring-black/[0.06] mb-5 shadow-sm">
                    <Image src="/images/ufm_chatbot.png" alt="UFM" width={56} height={56} className="w-full h-full object-cover" />
                  </div>

                  <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-1.5">
                    Chào mừng trở lại! 👋
                  </h3>
                  <p className="text-[13px] text-[#888] leading-[1.5] mb-6">
                    Bạn có đoạn trò chuyện trước đó.
                    <br />
                    Bạn muốn tiếp tục hay bắt đầu mới?
                  </p>

                  <div className="flex flex-col gap-2.5 w-full max-w-[240px]">
                    <button
                      onClick={handleResume}
                      className="w-full h-[42px] rounded-xl bg-[#3578E5] text-white text-[13.5px] font-semibold hover:bg-[#2b69d1] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                    >
                      Tiếp tục đoạn chat
                    </button>
                    <button
                      onClick={handleNewChat}
                      className="w-full h-[42px] rounded-xl bg-[#F0F0F0] text-[#333] text-[13.5px] font-medium hover:bg-[#e5e5e5] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Bắt đầu cuộc trò chuyện mới
                    </button>
                  </div>

                  <p className="text-[11px] text-[#bbb] mt-5">
                    {messages.length - 1} tin nhắn trước đó
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── MESSAGES ─── */}
            <div
              ref={chatBodyRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 pt-5 pb-3 bg-white cb-scroll"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-4 ${msg.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                  {/* Label + avatar */}
                  {msg.sender === 'bot' ? (
                    <div className="flex items-center gap-[6px] mb-[6px]">
                      <div className="w-[18px] h-[18px] rounded-full overflow-hidden flex-shrink-0 ring-1 ring-black/[0.04]">
                        <Image src="/images/ufm_chatbot.png" alt="" width={18} height={18} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11.5px] font-semibold text-[#666]">UFM</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium text-[#999] mb-[6px] mr-[2px] block">
                      Bạn
                    </span>
                  )}

                  {/* Bubble */}
                  <div
                    className={`
                      inline-block max-w-[85%] text-[13.5px] leading-[1.6]
                      ${msg.sender === 'user'
                        ? 'bg-[#3578E5] text-white px-[14px] py-[10px] rounded-[16px] rounded-br-[4px]'
                        : 'bg-[#F0F0F0] text-[#1a1a1a] px-[14px] py-[10px] rounded-[16px] rounded-bl-[4px]'
                      }
                    `}
                  >
                    {msg.sender === 'bot' ? (
                      <BotBubbleContent text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {/* Typing */}
              {isTyping && (
                <div className="mb-4">
                  <div className="flex items-center gap-[6px] mb-[6px]">
                    <div className="w-[18px] h-[18px] rounded-full overflow-hidden flex-shrink-0 ring-1 ring-black/[0.04]">
                      <Image src="/images/ufm_chatbot.png" alt="" width={18} height={18} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-[#666]">UFM</span>
                  </div>
                  <div className="inline-flex items-center gap-[5px] bg-[#F0F0F0] rounded-[16px] rounded-bl-[4px] px-[16px] py-[12px]">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#3578E5] animate-[cbDot_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
                    <span className="w-[6px] h-[6px] rounded-full bg-[#5E9BF0] animate-[cbDot_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                    <span className="w-[6px] h-[6px] rounded-full bg-[#8BB8F8] animate-[cbDot_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll-to-bottom */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-[110px] right-4 z-20 w-[30px] h-[30px] rounded-full bg-white shadow-[0_1px_8px_rgba(0,0,0,0.12)] border border-black/[0.06] flex items-center justify-center text-[#3578E5] cursor-pointer hover:bg-[#fafafa] transition-colors"
                  aria-label="Cuộn xuống"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 4L7 8L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 7.5L7 11.5L11 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>

            {/* ─── INPUT AREA ─── */}
            <div className="flex-shrink-0 bg-white border-t border-black/[0.06]">
              <form onSubmit={handleSend} className="flex items-center h-[50px] px-4 gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 text-[14px] text-[#1a1a1a] placeholder:text-[#b0b0b0] bg-transparent outline-none border-none"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex-shrink-0 w-[32px] h-[32px] flex items-center justify-center text-[#3578E5] disabled:text-[#ccc] transition-colors cursor-pointer disabled:cursor-default"
                  aria-label="Gửi"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </form>

              {/* Footer */}
              <div className="h-[32px] flex items-center justify-center border-t border-black/[0.04]">
                <p className="text-[11px] text-[#aaa]">
                  Phát triển bởi{' '}
                  <span className="text-[#3578E5] font-semibold cursor-pointer hover:underline">
                    VinCode
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
