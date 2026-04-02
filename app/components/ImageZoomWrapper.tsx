'use client';

import { useEffect, useRef } from 'react';
import mediumZoom from 'medium-zoom';

export default function ImageZoomWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Chọn tất cả ảnh bên trong vùng render nội dung
      const images = containerRef.current.querySelectorAll('.jodit-content-render img, .news-article img');
      
      const zoom = mediumZoom(Array.from(images) as HTMLElement[], {
        margin: 24,
        background: 'rgba(0, 0, 0, 0.85)',
      });

      // Fix stacking context: Hide header's high z-index when zooming
      const header = document.querySelector('.header') as HTMLElement;
      
      zoom.on('open', () => {
        if (header) header.style.zIndex = '0';
      });
      
      zoom.on('close', () => {
        if (header) header.style.zIndex = '1000'; // Khôi phục z-index gốc của header
      });

      return () => {
        zoom.detach();
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}
