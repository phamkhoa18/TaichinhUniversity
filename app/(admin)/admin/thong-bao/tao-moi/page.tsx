'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  CalendarIcon, ChevronLeft, Save, Loader2, Image as ImageIcon, 
  Send, X, Plus, Tag, Eye, Globe, Archive, FileText,
  Clock, Hash, Sparkles, ExternalLink, AlertCircle, CheckCircle2,
  ListTree, ToggleLeft, ToggleRight, ChevronDown, GripVertical
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════
   Helpers
   ═══════════════════════════════════════ */
interface CategoryOption { _id: string; name: string; slug: string; color: string }

function slugify(text: string) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function countWords(html: string) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text ? text.split(' ').length : 0
}

/* ═══════════════════════════════════════
   SECTION CARD — reusable wrapper 
   ═══════════════════════════════════════ */
function SideSection({ 
  icon: Icon, title, badge, action, children, collapsible = false, defaultOpen = true 
}: { 
  icon: any; title: string; badge?: React.ReactNode; action?: React.ReactNode;
  children: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean 
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={collapsible ? () => setOpen(!open) : undefined}
        className={cn(
          "w-full px-4 py-3 border-b border-slate-100 flex items-center gap-2 text-left",
          collapsible && "cursor-pointer hover:bg-slate-50/80 transition-colors"
        )}
      >
        <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="font-semibold text-[13px] text-slate-800 flex-1">{title}</span>
        {badge}
        {action && <span onClick={e => e.stopPropagation()}>{action}</span>}
        {collapsible && (
          <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", open && "rotate-180")} />
        )}
      </button>
      {open && children}
    </div>
  )
}

/* ═══════════════════════════════════════
   STATUS CONFIG
   ═══════════════════════════════════════ */
const STATUS_CFG = [
  { value: 'PUBLISHED', label: 'Công khai', dot: 'bg-emerald-500' },
  { value: 'DRAFT', label: 'Bản nháp', dot: 'bg-slate-300' },
  { value: 'ARCHIVED', label: 'Lưu trữ', dot: 'bg-amber-400' },
]

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function CreateNewsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [tagInput, setTagInput] = useState('')
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [activeTab, setActiveTab] = useState<'editor' | 'seo'>('editor')

  // Table of Contents
  const [tocEnabled, setTocEnabled] = useState(false)
  const [tocItems, setTocItems] = useState<{ level: number; text: string; id: string }[]>([])

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    status: 'DRAFT',
    excerpt: '',
    content: '',
    tags: [] as string[],
    isPinned: false,
  })

  // Fetch categories
  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.length > 0) {
          setCategories(json.data)
          setFormData(prev => ({ ...prev, category: json.data[0]._id }))
        }
      })
      .catch(() => {})
  }, [])

  // Extract TOC from content
  useEffect(() => {
    if (!tocEnabled) { setTocItems([]); return }
    const headingRegex = /<(h[2-4])[^>]*>(.*?)<\/\1>/gi
    const items: typeof tocItems = []
    let match
    while ((match = headingRegex.exec(formData.content)) !== null) {
      const level = parseInt(match[1][1])
      const text = match[2].replace(/<[^>]*>/g, '').trim()
      if (text) items.push({ level, text, id: slugify(text) })
    }
    setTocItems(items)
  }, [formData.content, tocEnabled])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { slug: slugify(value) } : {})
    }))
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag() }
  }

  const handleThumbnailUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) setThumbnail(URL.createObjectURL(file))
    }
    input.click()
  }

  const handleSubmit = async (status: string) => {
    if (!formData.title.trim()) return setError('Vui lòng nhập tiêu đề bài viết')
    if (!formData.category) return setError('Vui lòng chọn danh mục')
    
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status,
          tocEnabled,
          slug: formData.slug || slugify(formData.title),
          publishedAt: status === 'PUBLISHED' ? date : undefined,
        }),
      })
      const json = await res.json()

      if (!json.success) {
        setError(json.error)
        setIsSubmitting(false)
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/admin/thong-bao'), 1500)
      }
    } catch {
      setError('Lỗi kết nối server')
      setIsSubmitting(false)
    }
  }

  const wordCount = countWords(formData.content)
  const readTime = Math.max(1, Math.ceil(wordCount / 200))
  const currentStatus = STATUS_CFG.find(s => s.value === formData.status)
  const excerptLen = formData.excerpt.length

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
      
      {/* ══════════════════════════════════════
         TOP BAR — Header + Actions
         ══════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/thong-bao">
            <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:text-[#005496] hover:border-[#005496]/20 transition-all shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-[20px] font-bold tracking-tight text-slate-800 truncate">Tạo bài viết mới</h1>
            <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
              <span className="text-[11px] text-slate-600 flex items-center gap-1 tabular-nums">
                <FileText className="w-3 h-3" />{wordCount} từ
              </span>
              <span className="text-[11px] text-slate-600 flex items-center gap-1 tabular-nums">
                <Clock className="w-3 h-3" />~{readTime} phút
              </span>
              {currentStatus && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                  {currentStatus.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="h-9 px-3 text-[12px] font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg">
            <Eye className="w-3.5 h-3.5 mr-1.5" />Xem trước
          </Button>
          <Button 
            onClick={() => handleSubmit('DRAFT')} 
            disabled={isSubmitting || success}
            variant="outline" size="sm"
            className="h-9 px-3 text-[12px] font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />Lưu nháp
          </Button>
          <Button 
            onClick={() => handleSubmit('PUBLISHED')} 
            disabled={isSubmitting || success || !formData.title}
            size="sm"
            className="h-9 px-4 text-[12px] font-bold rounded-lg bg-[#005496] hover:bg-[#004377] text-white active:scale-[0.97] transition-all"
          >
            {success ? (
              <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Đã lưu!</>
            ) : isSubmitting ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Đang lưu...</>
            ) : (
              <><Send className="w-3.5 h-3.5 mr-1.5" />Xuất bản</>
            )}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 bg-rose-50 text-rose-600 text-[13px] font-medium px-4 py-2.5 rounded-lg border border-rose-200 mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" /><span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="hover:text-rose-800"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[13px] font-semibold px-4 py-2.5 rounded-lg border border-emerald-200 mb-5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />Bài viết đã được lưu thành công!
        </div>
      )}

      {/* ══════════════════════════════════════
         GRID LAYOUT
         ══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ────── CỘT CHÍNH (8/12) ────── */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Card: Tiêu đề + Slug */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Tiêu đề <span className="text-rose-400 normal-case text-[10px]">• bắt buộc</span>
              </label>
              <input
                name="title"
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full h-12 px-4 text-[17px] font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-normal bg-white border border-slate-200 rounded-xl outline-none focus:border-[#005496] focus:ring-2 focus:ring-[#005496]/10 transition-all"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Đường dẫn</label>
              <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#005496] focus-within:ring-2 focus-within:ring-[#005496]/10 transition-all">
                <span className="text-[11px] text-slate-500 font-mono px-3 h-9 flex items-center bg-slate-100 border-r border-slate-200 select-none shrink-0">sdh.ufm.edu.vn/thong-bao/</span>
                <input
                  name="slug"
                  placeholder="duong-dan-tu-dong"
                  className="flex-1 h-9 px-3 bg-transparent text-[12px] font-mono text-slate-800 placeholder:text-slate-400 outline-none"
                  value={formData.slug}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Card: Editor Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-0 border-b border-slate-100 px-1 bg-white">
              {[
                { key: 'editor', label: 'Nội dung', icon: FileText },
                { key: 'seo', label: 'SEO & Tóm tắt', icon: Sparkles },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-3 text-[12px] font-semibold transition-all relative",
                    activeTab === tab.key
                      ? 'text-[#005496]'
                      : 'text-slate-600 hover:text-slate-800'
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#005496] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Editor */}
            {activeTab === 'editor' ? (
              <div className="min-h-[520px]">
                <RichTextEditor
                  content={formData.content}
                  onChange={(html: string) => setFormData(prev => ({ ...prev, content: html }))}
                  minHeight={520}
                />
              </div>
            ) : (
              <div className="p-5 space-y-5">
                {/* Excerpt */}
                <div>
                  <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Tóm tắt (Meta Description)</label>
                  <textarea
                    name="excerpt"
                    placeholder="Viết 1-2 câu mô tả cho Google và mạng xã hội..."
                    className="w-full h-24 p-3.5 text-[13px] text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#005496]/10 focus:border-[#005496] transition-all resize-none placeholder:text-slate-300 leading-relaxed"
                    value={formData.excerpt}
                    onChange={handleChange}
                    maxLength={300}
                  />
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          excerptLen > 240 ? "bg-emerald-500" : excerptLen > 120 ? "bg-blue-400" : "bg-slate-300"
                        )}
                        style={{ width: `${Math.min(100, (excerptLen / 300) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">{excerptLen}/300</span>
                  </div>
                </div>

                {/* Google preview */}
                <div>
                  <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Xem trước Google</label>
                  <div className="border border-slate-200 rounded-lg p-4 bg-white">
                    <p className="text-[#1a0dab] text-[15px] font-medium leading-snug truncate">{formData.title || 'Tiêu đề bài viết'}</p>
                    <p className="text-[#006621] text-[11px] mt-1 truncate">sdh.ufm.edu.vn › thong-bao › {formData.slug || '...'}</p>
                    <p className="text-slate-500 text-[12px] mt-1 line-clamp-2 leading-relaxed">{formData.excerpt || 'Mô tả tóm tắt sẽ hiển thị ở đây...'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ────── SIDEBAR (4/12) ────── */}
        <div className="lg:col-span-4 space-y-4">

          {/* ─── Xuất bản ─── */}
          <SideSection icon={Globe} title="Xuất bản">
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Trạng thái</label>
                <Select value={formData.status} onValueChange={(val) => setFormData(prev => ({...prev, status: val}))}>
                  <SelectTrigger className="w-full h-9 border-slate-200 rounded-lg text-[12px] font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {STATUS_CFG.map(s => (
                      <SelectItem key={s.value} value={s.value}>
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${s.dot}`} />{s.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1 block">Ngày xuất bản</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-medium border-slate-200 h-9 px-3 rounded-lg text-[12px]">
                      <CalendarIcon className="mr-2 h-3 w-3 text-slate-400" />
                      {date ? format(date, 'dd/MM/yyyy') : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 rounded-xl" align="start">
                    <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} className="rounded-xl" />
                  </PopoverContent>
                </Popover>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors -mx-1">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-[#005496] accent-[#005496]"
                />
                <span className="text-[12px] font-medium text-slate-800">Ghim lên đầu trang</span>
              </label>
            </div>
          </SideSection>

          {/* ─── Table of Contents ─── */}
          <SideSection icon={ListTree} title="Mục lục (TOC)" collapsible defaultOpen={tocEnabled}>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-800">Tự động tạo mục lục</span>
                <button
                  onClick={() => setTocEnabled(!tocEnabled)}
                  className="text-slate-400 hover:text-[#005496] transition-colors"
                  title={tocEnabled ? 'Tắt TOC' : 'Bật TOC'}
                >
                  {tocEnabled ? (
                    <ToggleRight size={22} className="text-[#005496]" />
                  ) : (
                    <ToggleLeft size={22} />
                  )}
                </button>
              </div>

              {tocEnabled && (
                <>
                  {tocItems.length > 0 ? (
                    <div className="space-y-0.5 border-l-2 border-slate-200 ml-1">
                      {tocItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-[11px] text-slate-700 hover:text-[#005496] py-1 transition-colors cursor-default"
                          style={{ paddingLeft: `${(item.level - 2) * 12 + 10}px` }}
                        >
                          <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                          <span className="truncate">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 text-center py-2">
                      Thêm heading (H2, H3, H4) trong nội dung để tạo mục lục tự động.
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    TOC sẽ hiện trên bài viết khi công khai
                  </p>
                </>
              )}
            </div>
          </SideSection>

          {/* ─── Danh mục ─── */}
          <SideSection
            icon={Hash}
            title="Danh mục"
            action={
              <Link href="/admin/thong-bao/danh-muc" className="text-[10px] font-bold text-[#005496] hover:underline uppercase tracking-wider">
                Quản lý
              </Link>
            }
          >
            <div className="p-3">
              {categories.length > 0 ? (
                <div className="space-y-0.5">
                  {categories.map(cat => (
                    <button
                      key={cat._id}
                      onClick={() => setFormData(prev => ({...prev, category: cat._id}))}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all text-left",
                        formData.category === cat._id
                          ? "bg-[#005496]/5 text-[#005496] font-semibold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border-2 transition-all"
                        style={{
                          backgroundColor: formData.category === cat._id ? cat.color : 'transparent',
                          borderColor: cat.color,
                        }}
                      />
                      <span className="flex-1 truncate">{cat.name}</span>
                      {formData.category === cat._id && <CheckCircle2 className="w-3 h-3 text-[#005496] shrink-0" />}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 text-center py-5">
                  Chưa có danh mục. <Link href="/admin/thong-bao/danh-muc" className="text-[#005496] font-semibold hover:underline">Tạo ngay</Link>
                </p>
              )}
            </div>
          </SideSection>

          {/* ─── Tags ─── */}
          <SideSection
            icon={Tag}
            title="Từ khóa"
            badge={formData.tags.length > 0 ? (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{formData.tags.length}</span>
            ) : undefined}
            collapsible
            defaultOpen
          >
            <div className="p-4 space-y-2.5">
              <div className="flex gap-1.5">
                <input
                  placeholder="Nhập tag rồi Enter..."
                  className="flex-1 h-8 px-3 text-[12px] bg-white border border-slate-200 rounded-lg outline-none focus:border-[#005496] focus:ring-1 focus:ring-[#005496]/10 transition-all"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <button onClick={addTag} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#005496] hover:border-[#005496]/20 hover:bg-[#005496]/5 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {formData.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-800 group">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-rose-500 transition-colors">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 text-center">Giúp phân loại và tìm kiếm bài viết</p>
              )}
            </div>
          </SideSection>

          {/* ─── Ảnh đại diện ─── */}
          <SideSection icon={ImageIcon} title="Ảnh đại diện" collapsible defaultOpen>
            <div className="p-4">
              {thumbnail ? (
                <div className="relative group rounded-lg overflow-hidden border border-slate-200">
                  <img src={thumbnail} alt="Thumbnail" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                    <button onClick={handleThumbnailUpload} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110" title="Đổi ảnh">
                      <ImageIcon className="w-3 h-3 text-slate-700" />
                    </button>
                    <button onClick={() => setThumbnail(null)} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110" title="Xóa">
                      <X className="w-3 h-3 text-rose-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleThumbnailUpload}
                  className="w-full h-24 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 hover:bg-[#005496]/[0.02] hover:border-[#005496]/30 flex flex-col items-center justify-center transition-all group"
                >
                  <ImageIcon className="w-5 h-5 text-slate-300 group-hover:text-[#005496] mb-1.5 transition-colors" />
                  <span className="text-[11px] font-semibold text-slate-500 group-hover:text-[#005496]">Tải ảnh lên</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">16:9 · PNG, JPG, WebP</span>
                </button>
              )}
            </div>
          </SideSection>

        </div>
      </div>
    </div>
  )
}
