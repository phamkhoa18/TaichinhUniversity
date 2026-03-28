'use client'

import React, { useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import để tránh SSR error
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  minHeight?: number
}

export function RichTextEditor({ content, onChange, minHeight = 400 }: RichTextEditorProps) {
  const editor = useRef(null)

  const config = useMemo(() => ({
    readonly: false,
    minHeight,
    placeholder: 'Bắt đầu soạn nội dung tại đây...',
    
    // Giao diện
    theme: 'default',
    language: 'vi',
    toolbarAdaptive: false,
    toolbarSticky: true,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,

    // Các nút toolbar
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'ul', 'ol', 'indent', 'outdent', '|',
      'left', 'center', 'right', 'justify', '|',
      'link', 'image', 'video', 'table', '|',
      'hr', 'symbol', 'eraser', '|',
      'copyformat', 'selectall', '|',
      'source', 'fullsize', 'preview', 'print', '|',
      'undo', 'redo',
    ],

    // Upload ảnh
    uploader: {
      insertImageAsBase64URI: true,  // Tạm dùng base64, sau này chuyển sang API upload
    },

    // Cho phép paste ảnh
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,

    // Style nội dung bên trong editor
    style: {
      font: '14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b',
    },

    // CSS override cho editor container
    editorCssClass: 'jodit-custom-editor',

  }), [minHeight])

  return (
    <div className="w-full h-full flex flex-col relative jodit-wrapper">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent: string) => onChange(newContent)}
      />
      
      {/* CSS Override - Flat Design đồng bộ */}
      <style dangerouslySetInnerHTML={{__html: `
        .jodit-wrapper .jodit-container {
          border: none !important;
          border-radius: 0 !important;
        }
        .jodit-wrapper .jodit-toolbar__box {
          background: #fafbfc !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .jodit-wrapper .jodit-toolbar-button__button {
          border-radius: 4px !important;
        }
        .jodit-wrapper .jodit-toolbar-button__button:hover {
          background: #f1f5f9 !important;
        }
        .jodit-wrapper .jodit-toolbar-button__button[aria-pressed="true"] {
          background: #005496 !important;
          color: white !important;
        }
        .jodit-wrapper .jodit-toolbar-button__button[aria-pressed="true"] svg {
          fill: white !important;
        }
        .jodit-wrapper .jodit-status-bar {
          border-top: 1px solid #f1f5f9 !important;
          background: transparent !important;
        }
        .jodit-wrapper .jodit-workplace {
          font-family: 'Inter', -apple-system, sans-serif !important;
        }
        .jodit-wrapper .jodit-wysiwyg {
          padding: 16px 20px !important;
          font-size: 14px !important;
          line-height: 1.7 !important;
          color: #1e293b !important;
        }
        .jodit-wrapper .jodit-wysiwyg h1 { font-size: 1.75rem; font-weight: 800; color: #0f172a; }
        .jodit-wrapper .jodit-wysiwyg h2 { font-size: 1.35rem; font-weight: 700; color: #0f172a; }
        .jodit-wrapper .jodit-wysiwyg h3 { font-size: 1.1rem; font-weight: 600; color: #0f172a; }
        .jodit-wrapper .jodit-wysiwyg a { color: #005496; }
        .jodit-wrapper .jodit-wysiwyg img { max-width: 100%; border-radius: 6px; }
        .jodit-wrapper .jodit-wysiwyg blockquote { border-left: 3px solid #005496; padding-left: 16px; color: #475569; font-style: italic; }
        .jodit-wrapper .jodit-wysiwyg table td, 
        .jodit-wrapper .jodit-wysiwyg table th { border: 1px solid #e2e8f0; padding: 8px 12px; }
        .jodit-wrapper .jodit-wysiwyg table th { background: #f8fafc; font-weight: 600; }
      `}} />
    </div>
  )
}
