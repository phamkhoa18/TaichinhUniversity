'use client';

import React, { useEffect, useState } from 'react';
import { useSiteSettings } from '@/store/SiteSettingsProvider';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function GlobalPopup() {
  const { settings, loading } = useSiteSettings();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (settings?.appearance?.showPopupNotice) {
      const config = settings.appearance.popupConfig;
      if (!config) return;

      // Delay briefly so it feels natural
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [loading, settings]);

  // Prevent scroll when popup is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  if (!open || !settings?.appearance?.popupConfig) return null;

  const config = settings.appearance.popupConfig;

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = () => {
    setOpen(false);
  };

  const LayoutContent = () => {
    if (config.layout === 'image-only') {
      return (
        <div className="relative w-full bg-transparent">
          {config.actionUrl ? (
            <Link href={config.actionUrl} onClick={handleAction} className="block group rounded-[1.5rem] overflow-hidden shadow-2xl">
              <Img src={config.imageUrl} alt="Popup Image" className="w-full h-auto object-contain max-h-[80vh] group-hover:scale-[1.02] transition-transform duration-700 ease-out" />
            </Link>
          ) : (
            <Img src={config.imageUrl} alt="Popup Image" className="w-full h-auto object-contain max-h-[85vh] rounded-[1.5rem] shadow-2xl transition-transform duration-700 ease-out" />
          )}
        </div>
      );
    }

    if (config.layout === 'image-top') {
      return (
        <div className="flex flex-col">
          {config.imageUrl && (
             <div className="relative w-full bg-slate-50 border-b border-slate-100">
               <Img src={config.imageUrl} alt="Banner" className="w-full h-auto max-h-[45vh] object-contain" />
             </div>
          )}
          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
              {config.title}
            </h3>
            {config.description && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {config.description}
              </p>
            )}
            {config.actionUrl && (
              <div className="pt-2">
                <Link href={config.actionUrl} onClick={handleAction} className="inline-flex items-center gap-2 bg-[#005496] hover:bg-[#00437a] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors">
                  {config.actionText || 'Xem chi tiết'}
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (config.layout === 'image-left') {
      return (
        <div className="flex flex-col sm:flex-row h-full sm:h-auto sm:max-h-[80vh]">
          {config.imageUrl && (
             <div className="w-full sm:w-2/5 shrink-0 relative bg-slate-50 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-slate-100">
               <Img src={config.imageUrl} alt="Banner" className="w-full h-auto max-h-[30vh] sm:max-h-[80vh] object-contain drop-shadow-sm" />
             </div>
          )}
          <div className="p-6 sm:p-8 space-y-4 flex flex-col justify-center overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
              {config.title}
            </h3>
            {config.description && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {config.description}
              </p>
            )}
            {config.actionUrl && (
              <div className="pt-3">
                <Link href={config.actionUrl} onClick={handleAction} className="inline-flex items-center gap-2 bg-[#005496] hover:bg-[#00437a] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors">
                  {config.actionText || 'Xem chi tiết'}
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default text-only
    return (
      <div className="p-6 sm:p-10 space-y-5 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-[#005496] leading-tight">
          {config.title}
        </h3>
        {config.description && (
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
            {config.description}
          </p>
        )}
        {config.actionUrl && (
          <div className="pt-4">
            <Link href={config.actionUrl} onClick={handleAction} className="inline-flex items-center gap-2 bg-[#005496] hover:bg-[#00437a] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              {config.actionText || 'Xem chi tiết'}
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm transition-opacity duration-500 flex items-center justify-center p-4",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      >
        <div 
          className={cn(
            "relative mx-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] opacity-0",
            config.layout === 'image-only' 
              ? "bg-transparent shadow-none max-w-4xl w-auto scale-90" 
              : "bg-white shadow-2xl max-w-3xl w-full scale-95 rounded-2xl sm:rounded-[24px] overflow-hidden",
            open && "scale-100 opacity-100"
          )}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* Nút tắt X */}
          <button
            onClick={handleClose}
            className={cn(
              "absolute z-10 p-2 rounded-full transition-all shadow-sm",
              config.layout === 'image-only'
                ? "-top-4 -right-4 sm:-top-5 sm:-right-5 bg-white text-slate-800 hover:text-rose-600 hover:scale-110"
                : "top-3 right-3 sm:top-4 sm:right-4 bg-white/50 hover:bg-white backdrop-blur text-slate-800 hover:text-rose-600"
            )}
            style={config.layout === 'image-only' ? { top: '8px', right: '8px' } : undefined}
          >
            <X size={20} strokeWidth={3} />
          </button>

          <LayoutContent />
        </div>
      </div>
    </>
  );
}

// Giúp load ảnh mượt mà fallback error
function Img({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [error, setError] = useState(false);
  return (
    <img 
      src={error || !src ? '/images/placeholder.png' : src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
    />
  );
}
