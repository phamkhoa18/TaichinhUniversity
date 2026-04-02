'use client';

import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function slugify(text: string) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim() || 'section';
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function ClientTableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 1. Tìm khu vực chứa nội dung bài viết
    const contentContainer = document.querySelector('.jodit-content-render');
    if (!contentContainer) return;

    // 2. Tìm tất cả thẻ H2, H3, H4
    const headings = contentContainer.querySelectorAll('h2, h3, h4');
    if (headings.length === 0) return;

    // 3. Gắn ID nếu chưa có & Thu thập list TOC
    const tocItems: TocItem[] = [];
    headings.forEach((heading, index) => {
      const el = heading as HTMLElement;
      let text = el.innerText.trim();
      if (!text) text = `Section ${index + 1}`; // Fallback

      let id = el.id;
      if (!id) {
        id = slugify(text) + '-' + index;
        el.id = id;
      }

      const level = parseInt(el.tagName.substring(1));
      tocItems.push({ id, text, level });
    });

    setItems(tocItems);

    // 4. Lắng nghe cuộn để highlight mục đang đọc
    const handleScroll = () => {
      let currentId = '';
      const scy = window.scrollY;

      // Tìm thẻ heading gần nhất phía trên thanh cuộn
      for (const item of tocItems) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top + scy - 120 <= scy) {
          currentId = item.id;
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger lần đầu
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mb-4 rounded-[8px] bg-[#f4f6f8] px-6 py-3 transition-all duration-300">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-[17px] mb-0">Mục lục</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 font-medium text-[#005496] text-[14px] hover:underline transition-colors"
        >
          {expanded ? 'Ẩn' : 'Hiện'}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Body */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          expanded ? "max-h-[1200px] opacity-100 mt-5" : "max-h-0 opacity-0 mt-0"
        )}
      >
        <ul className="space-y-3.5">
          {items.map((item, index) => {
            const isActive = activeId === item.id;
            const minLevel = Math.min(...items.map(i => i.level));
            const indent = Math.max(0, item.level - minLevel);

            return (
              <li
                key={index}
                className="transition-all duration-200"
                style={{ paddingLeft: `${indent * 1.25}rem` }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(item.id);
                    if (element) {
                      const top = element.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top, behavior: 'smooth' });
                      setActiveId(item.id);
                    }
                  }}
                  className={cn(
                    "inline-block text-[15px] leading-relaxed transition-colors tracking-wide text-[#005496] hover:text-[#005496] hover:underline",
                    isActive ? "font-bold" : "font-normal"
                  )}
                >
                  <span className="mr-1.5">{index + 1}.</span>
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
