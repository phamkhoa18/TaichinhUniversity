'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, FileText, Maximize2 } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  fileName?: string;
}

// Lazy page component: chỉ render khi cuộn tới gần
function LazyPage({ 
  pageNumber, 
  width, 
  rootRef,
  Document: DocComponent,
  Page: PageComponent,
}: { 
  pageNumber: number; 
  width: number | undefined;
  rootRef: React.RefObject<HTMLDivElement | null>;
  Document: any;
  Page: any;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [wasLoaded, setWasLoaded] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = placeholderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setWasLoaded(true);
        } else {
          setIsVisible(false);
        }
      },
      { root: rootRef.current, rootMargin: '600px 0px' } // Preload 600px trước khi vào viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootRef]);

  // Giữ lại nếu đã load, chỉ unload nếu quá xa (> 2000px)
  const shouldRender = isVisible || wasLoaded;

  return (
    <div ref={placeholderRef} className="w-full flex justify-center">
      {shouldRender ? (
        <PageComponent
          pageNumber={pageNumber}
          width={width}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          loading={
            <div className="flex flex-col gap-3 items-center justify-center text-slate-400 text-[13px] font-medium bg-white min-h-[700px] w-full max-w-[900px] rounded-md border border-slate-100">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-[#005496] animate-spin" />
              Đang tải Trang {pageNumber}...
            </div>
          }
          className="bg-white rounded-md overflow-hidden ring-1 ring-slate-900/5 shadow-md"
        />
      ) : (
        <div className="w-full max-w-[900px] min-h-[700px] bg-white/60 flex items-center justify-center text-slate-300 text-[13px] rounded-md border border-dashed border-slate-200">
          Trang {pageNumber}
        </div>
      )}
    </div>
  );
}

export default function PdfViewerClient({ url, fileName }: PdfViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfComponents, setPdfComponents] = useState<{ Document: any; Page: any; pdfjs: any } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Chỉ mount ở client (tránh DOMMatrix SSR error)
  useEffect(() => {
    setMounted(true);
    
    // Dynamic import react-pdf chỉ ở client
    import('react-pdf').then((mod) => {
      // CSS imports
      import('react-pdf/dist/Page/AnnotationLayer.css');
      import('react-pdf/dist/Page/TextLayer.css');
      
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
      
      setPdfComponents({
        Document: mod.Document,
        Page: mod.Page,
        pdfjs: mod.pdfjs,
      });
    });
  }, []);

  // Đo container width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theo dõi trang đang hiển thị qua IntersectionObserver
  useEffect(() => {
    if (!numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.reduce((prev, curr) =>
            prev.intersectionRatio > curr.intersectionRatio ? prev : curr
          );
          const idx = Number(mostVisible.target.getAttribute('data-page'));
          if (idx) setCurrentPage(idx);
        }
      },
      { root: containerRef.current, threshold: 0.3 }
    );

    pageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [numPages]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    pageRefs.current = new Array(numPages).fill(null);
  }, []);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));

  const scrollToPage = (page: number) => {
    const ref = pageRefs.current[page - 1];
    if (ref && containerRef.current) {
      containerRef.current.scrollTo({
        top: ref.offsetTop - 72,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevPage = () => { if (currentPage > 1) scrollToPage(currentPage - 1); };
  const handleNextPage = () => { if (numPages && currentPage < numPages) scrollToPage(currentPage + 1); };

  const pageWidth = containerWidth
    ? Math.min(containerWidth - (containerWidth < 640 ? 16 : 48), 900) * scale
    : undefined;

  // SSR hoặc chưa load xong react-pdf → hiển thị placeholder
  if (!mounted || !pdfComponents) {
    return (
      <div className="flex flex-col w-full max-h-[85vh] min-h-[500px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-center">
          <span className="text-[13px] text-slate-400 font-medium animate-pulse">Đang khởi tạo trình đọc PDF...</span>
        </div>
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-slate-400">
            <div className="w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-[#005496] animate-spin" />
            <p className="text-[14px] font-semibold animate-pulse">Đang tải thư viện hiển thị...</p>
          </div>
        </div>
      </div>
    );
  }

  const { Document, Page } = pdfComponents;

  return (
    <div className="flex flex-col w-full max-h-[85vh] min-h-[500px] bg-slate-50 relative overflow-hidden rounded-xl border border-slate-200 isolate">
      {/* Toolbar */}
      <div className="sticky top-0 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-3 sm:px-5 z-20 shadow-sm shrink-0">
        {/* Left */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
            <FileText size={16} className="text-rose-600" strokeWidth={2.5} />
          </div>
          <span className="text-[14px] font-bold text-slate-800 truncate hidden sm:block max-w-[200px]">
            {fileName || 'Tài liệu PDF'}
          </span>
        </div>

        {/* Center Pagination */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/50 shadow-inner">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || !numPages}
            className="p-1.5 rounded-md hover:bg-white hover:text-[#005496] hover:shadow-sm disabled:opacity-40 transition-all text-slate-600 cursor-pointer"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="min-w-[70px] px-2 text-[13px] font-bold text-slate-700 text-center select-none">
            {currentPage} <span className="text-slate-400 font-normal mx-1">/</span> {numPages || '-'}
          </div>
          <button
            onClick={handleNextPage}
            disabled={!numPages || currentPage >= numPages}
            className="p-1.5 rounded-md hover:bg-white hover:text-[#005496] hover:shadow-sm disabled:opacity-40 transition-all text-slate-600 cursor-pointer"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={handleZoomOut} className="p-2 hidden sm:flex text-slate-400 hover:text-[#005496] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <ZoomOut size={18} strokeWidth={2.5} />
          </button>
          <span className="text-[12px] font-bold text-slate-500 w-12 text-center hidden sm:block select-none bg-slate-100 py-1.5 rounded-md">
            {Math.round(scale * 100)}%
          </span>
          <button onClick={handleZoomIn} className="p-2 hidden sm:flex text-slate-400 hover:text-[#005496] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <ZoomIn size={18} strokeWidth={2.5} />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 px-3 py-1.5 bg-[#005496]/5 text-[#005496] rounded-lg hover:bg-[#005496]/10 transition-all flex items-center gap-2 text-[13px] font-bold"
          >
            <span className="hidden sm:inline">Toàn màn hình</span>
            <Maximize2 size={15} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* PDF Viewport — Cuộn dọc bên trong khung có max-height cố định */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto px-2 sm:px-6 py-6 flex flex-col items-center gap-6 w-full z-10"
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-4 mt-20">
              <div className="w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-[#005496] animate-spin" />
              <p className="text-[14px] font-semibold tracking-wide animate-pulse">Đang nạp dữ liệu PDF...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center p-12 mt-10 bg-rose-50 rounded-2xl border border-rose-100 text-rose-500 gap-3 text-center max-w-sm">
              <FileText size={40} className="text-rose-400 mb-2" strokeWidth={1.5} />
              <p className="text-[16px] font-bold text-slate-800">Không thể tải tài liệu</p>
              <p className="text-[13px] text-slate-600">Tệp có thể bị hỏng hoặc bạn không có quyền xem.</p>
              <a href={url} target="_blank" download className="mt-4 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition drop-shadow-sm flex items-center gap-2">
                <Download size={16} /> Tải tệp gốc về máy
              </a>
            </div>
          }
          className="flex flex-col items-center gap-6 w-full"
        >
          {numPages && Array.from({ length: numPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <div
                key={`page_${pageNum}`}
                ref={(el) => { pageRefs.current[i] = el; }}
                data-page={pageNum}
                className="relative group/page"
              >
                <LazyPage
                  pageNumber={pageNum}
                  width={pageWidth}
                  rootRef={containerRef}
                  Document={Document}
                  Page={Page}
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-0.5 text-[11px] text-slate-500 font-bold shadow-sm border border-slate-200/80 z-10 opacity-40 group-hover/page:opacity-100 transition-opacity">
                  Trang {pageNum}
                </div>
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
}
