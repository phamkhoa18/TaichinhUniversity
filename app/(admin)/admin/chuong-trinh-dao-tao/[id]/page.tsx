'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Save, Loader2, Image as ImageIcon,
  Send, X, Plus, Clock, Sparkles, CheckCircle2,
  Globe, LayoutTemplate, Briefcase, FileText,
  GripVertical, Trash2, ChevronDown, BookOpen, AlertCircle,
  Settings, MonitorPlay, Award, Target, BookMarked, Users, ImagePlus, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/* =====================================================================
   TABS CONFIGURATION
   ===================================================================== */
const TABS = [
  { id: 'basic', label: 'Thông tin cơ bản', icon: Settings },
  { id: 'hero', label: 'Banner chính', icon: MonitorPlay },
  { id: 'overview', label: 'Giới thiệu chung', icon: BookMarked },
  { id: 'features', label: 'Đặc điểm nổi bật', icon: Sparkles },
  { id: 'outcomes', label: 'Năng lực đầu ra', icon: Target },
  { id: 'careers', label: 'Triển vọng nghề', icon: Award },
  { id: 'curriculum', label: 'Cấu trúc học phần', icon: LayoutTemplate },
];

export default function TrainingProgramEditorPage() {
  const router = useRouter();
  const params = useParams();
  const idFromUrl = params.id as string;
  const isNew = idFromUrl === 'tao-moi';

  const [activeTab, setActiveTab] = useState('basic');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewPdfUrl, setPreviewPdfUrl] = useState('');

  const [levels, setLevels] = useState<any[]>([]);

  // MAIN FORM DATA
  const [form, setForm] = useState<any>({
    // Basic
    name: '',
    level: '',
    type: 'Tiêu chuẩn',
    faculty: 'Viện Sau đại học',
    thumbnail: '',
    status: 'DRAFT',

    // Hero
    heroBg: '',
    heroDescription: '',

    // Overview
    overviewDesc: '',
    overviewImgMain: '',
    overviewImgSub: '',
    programCode: '',
    degreeIssued: '',
    duration: '',
    extraRequirements: [],

    // Features
    featuresBg: '',
    featuresDesc: '',
    featureCards: [],

    // Outcomes
    outcomesDesc: '',
    outcomesImage: '',
    outcomeSkills: [],

    // Careers
    careersDesc: '',
    careerItems: [],

    // Curriculum
    curriculumDesc: '',
    curriculumPdfUrl: '',
    semesters: []
  });

  useEffect(() => {
    fetchLevels();
    if (!isNew) {
      fetchProgramInfo();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchLevels = async () => {
    try {
      const res = await fetch('/api/admin/training/levels').then(r => r.json());
      if (res.success) {
        setLevels(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProgramInfo = async () => {
    try {
      const res = await fetch(`/api/admin/training/programs/${idFromUrl}`).then(r => r.json());
      if (res.success) {
        const d = res.data;
        setForm({
          ...d,
          level: d.level?._id || d.level || '',
          extraRequirements: d.extraRequirements || [],
          featureCards: d.featureCards || [],
          outcomeSkills: d.outcomeSkills || [],
          careerItems: d.careerItems || [],
          semesters: d.semesters || []
        });
      } else {
        toast.error('Không tìm thấy chương trình');
        router.push('/admin/chuong-trinh-dao-tao');
      }
    } catch (e) {
      toast.error('Lỗi khi tải');
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================================
     HANDLERS
     ===================================================================== */
  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName: string, index: number, field: string, value: any) => {
    setForm((prev: any) => {
      const arr = [...prev[arrayName]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayName]: arr };
    });
  };

  const addArrayItem = (arrayName: string, newItem: any) => {
    setForm((prev: any) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem]
    }));
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setForm((prev: any) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleImageUpload = (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'images');

      toast.promise(
        fetch('/api/upload', { method: 'POST', body: fd }).then(async (res) => {
          const data = await res.json();
          if (!data.success) throw new Error(data.error || 'Upload thất bại');
          handleChange(field, data.url);
        }),
        { loading: 'Đang tải ảnh...', success: 'Tải thành công!', error: 'Lỗi tải ảnh' }
      );
    };
    input.click();
  };

  const handlePdfUpload = (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'documents');

      toast.promise(
        fetch('/api/upload', { method: 'POST', body: fd }).then(async (res) => {
          const data = await res.json();
          if (!data.success) throw new Error(data.error || 'Upload thất bại');
          handleChange(field, data.url);
        }),
        { loading: 'Đang tải file PDF...', success: 'Tải PDF thành công!', error: 'Lỗi tải PDF' }
      );
    };
    input.click();
  };

  const handleSave = async () => {
    if (!form.name.trim()) return setError('Vui lòng nhập Tên chương trình');
    if (!form.level) return setError('Vui lòng chọn Bậc đào tạo');

    setIsSubmitting(true);
    setError('');

    try {
      const url = isNew ? '/api/admin/training/programs' : `/api/admin/training/programs/${idFromUrl}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error);
        toast.error('Lỗi khi lưu: ' + data.error);
        setIsSubmitting(false);
      } else {
        setSuccess(true);
        toast.success(isNew ? 'Đã tạo chương trình!' : 'Đã cập nhật chương trình!');
        setTimeout(() => router.push('/admin/chuong-trinh-dao-tao'), 1200);
      }
    } catch {
      setError('Lỗi kết nối máy chủ');
      toast.error('Lỗi kết nối');
      setIsSubmitting(false);
    }
  };

  /* =====================================================================
     UI RENDERERS
     ===================================================================== */
  if (loading) return <div className="p-10 text-center animate-pulse text-slate-400">Đang tải cấu trúc dữ liệu...</div>;

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* ────── TOP BAR ────── */}
      <div className="flex items-center justify-between gap-3 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <Link href="/admin/chuong-trinh-dao-tao">
            <button className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 flex items-center justify-center hover:text-[#005496] hover:border-[#005496]/30 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              {isNew ? 'Tạo chương trình đào tạo mói' : form.name}
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Xây dựng giao diện đồng bộ chuẩn UFM</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={form.status} onValueChange={(val) => handleChange('status', val)}>
            <SelectTrigger className="w-[140px] h-10 border-slate-200 bg-slate-50 font-bold focus:ring-[#005496]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLISHED"><span className="text-emerald-600 font-bold">● Công khai</span></SelectItem>
              <SelectItem value="DRAFT"><span className="text-slate-500 font-bold">● Bản nháp</span></SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleSave}
            disabled={isSubmitting || success}
            className="h-10 px-6 font-bold bg-[#005496] hover:bg-[#004377] text-white shadow-md active:scale-95 transition-all"
          >
            {success ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Đã lưu</>
             : isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</>
             : <><Save className="w-4 h-4 mr-2" /> Lưu Lại</>}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-3 rounded-lg border border-rose-200 mb-6">
          <AlertCircle className="w-5 h-5" /><span className="flex-1 font-medium">{error}</span>
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ────── MAIN LAYOUT (TABS LEFT, CONTENT RIGHT) ────── */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR TABS */}
        <div className="w-full lg:w-[260px] shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm sticky top-24">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all mb-1 font-semibold text-[14px]",
                    isActive 
                      ? "bg-[#005496]/5 text-[#005496] shadow-sm ring-1 ring-[#005496]/20" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-[#005496]" : "text-slate-400")} />
                  {tab.label}
                  {isActive && <ChevronLeft className="w-4 h-4 ml-auto rotate-180 text-[#005496]/50" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          
          {/* TAB 1: BASIC INFO */}
          <div className={cn("space-y-6", activeTab === 'basic' ? "block" : "hidden animate-out fade-out hidden")}>
             <div>
                <h2 className="text-[20px] font-bold text-slate-800 mb-1">Thông tin cơ bản</h2>
                <p className="text-sm text-slate-500 mb-6">Thông tin dùng để hiển thị ngoài danh sách tìm kiếm.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="col-span-2">
                 <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Tên chương trình / Ngành học *</label>
                 <Input className="h-11 font-semibold text-slate-800 bg-slate-50" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Vd: Thạc sĩ Kỹ thuật Xây dựng" />
               </div>

               <div>
                 <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Bậc đào tạo *</label>
                 <Select value={form.level} onValueChange={(val) => handleChange('level', val)}>
                   <SelectTrigger className="h-11 bg-slate-50"><SelectValue placeholder="Chọn cấp bậc" /></SelectTrigger>
                   <SelectContent>
                     {levels.map(l => <SelectItem key={l._id} value={l._id}>{l.name}</SelectItem>)}
                   </SelectContent>
                 </Select>
               </div>

               <div>
                 <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Khoa / Viện quản lý</label>
                 <Input className="h-11 bg-slate-50" value={form.faculty} onChange={e => handleChange('faculty', e.target.value)} placeholder="Vd: Viện Sau đại học" />
               </div>

               <div>
                 <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Loại hình hệ đào tạo</label>
                 <Input className="h-11 bg-slate-50" value={form.type} onChange={e => handleChange('type', e.target.value)} placeholder="Vd: Ứng dụng, Định hướng nghiên cứu..." />
               </div>

               <div className="col-span-2 mt-4">
                 <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Ảnh Thumbnail (Hiển thị list thẻ Netflix)</label>
                 {form.thumbnail ? (
                    <div className="relative w-40 h-52 group rounded-xl overflow-hidden shadow-md">
                      <img src={form.thumbnail} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleChange('thumbnail', '')} className="bg-rose-500 text-white p-2 rounded-full"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                 ) : (
                   <button onClick={() => handleImageUpload('thumbnail')} className="w-40 h-52 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                     <ImagePlus className="w-8 h-8 mb-2 text-slate-400" />
                     <span className="text-sm font-semibold">Tải ảnh lên</span>
                   </button>
                 )}
               </div>
             </div>
          </div>

          {/* TAB 2: HERO */}
          <div className={cn("space-y-6", activeTab === 'hero' ? "block" : "hidden")}>
             <div>
                <h2 className="text-[20px] font-bold text-slate-800 mb-1">Banner màn hình chính</h2>
                <p className="text-sm text-slate-500 mb-6">Khu vực hiển thị tiêu đề và ảnh nền full screen.</p>
             </div>

             <div>
                 <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Ảnh nền Cover (Độ phân giải cao)</label>
                 {form.heroBg ? (
                    <div className="relative w-full h-64 group rounded-xl overflow-hidden shadow-md">
                      <img src={form.heroBg} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button onClick={() => handleChange('heroBg', '')} className="bg-rose-500 text-white p-3 rounded-full hover:scale-110 transition-transform"><Trash2 className="w-5 h-5"/></button>
                      </div>
                    </div>
                 ) : (
                   <button onClick={() => handleImageUpload('heroBg')} className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                     <ImagePlus className="w-8 h-8 mb-2 text-slate-400" />
                     <span className="text-sm font-semibold">Click tải ảnh Banner</span>
                   </button>
                 )}
             </div>

             <div className="pt-4">
               <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Mô tả trên Banner</label>
               <textarea 
                 value={form.heroDescription} 
                 onChange={e => handleChange('heroDescription', e.target.value)}
                 className="w-full h-32 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#005496]"
                 placeholder="Vd: Khoa Xây dựng tự hào khi là một trong những khoa lớn..."
               />
             </div>
          </div>

          {/* TAB 3: OVERVIEW */}
          <div className={cn("space-y-6", activeTab === 'overview' ? "block" : "hidden")}>
             <div>
                <h2 className="text-[20px] font-bold text-slate-800 mb-1">Giới thiệu chung</h2>
                <p className="text-sm text-slate-500 mb-6">Đoạn mô tả, ảnh chéo và thông số nhanh (mã ngành, thời gian...).</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Text Giới thiệu</label>
                  <textarea 
                    value={form.overviewDesc} 
                    onChange={e => handleChange('overviewDesc', e.target.value)}
                    className="w-full h-32 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2 grid grid-cols-3 gap-4">
                   <div className="col-span-3 mb-2"><h3 className="font-bold text-slate-700">Thông số nhanh (Quick Facts)</h3></div>
                   <div>
                     <label className="text-[11px] font-bold text-slate-500 mb-1 block">Mã Ngành</label>
                     <Input className="bg-white" value={form.programCode} onChange={e => handleChange('programCode', e.target.value)} />
                   </div>
                   <div>
                     <label className="text-[11px] font-bold text-slate-500 mb-1 block">Văn Bằng</label>
                     <Input className="bg-white" value={form.degreeIssued} onChange={e => handleChange('degreeIssued', e.target.value)} />
                   </div>
                   <div>
                     <label className="text-[11px] font-bold text-slate-500 mb-1 block">Thời gian đào tạo</label>
                     <Input className="bg-white" value={form.duration} onChange={e => handleChange('duration', e.target.value)} />
                   </div>
                </div>

                <div className="col-span-2">
                  <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Cụm ảnh minh họa (Photocollage)</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-2">Ảnh chính (Lớn)</p>
                      {form.overviewImgMain ? (
                        <div className="relative w-full h-40 group rounded-xl overflow-hidden shadow-sm">
                          <img src={form.overviewImgMain} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                            <button onClick={() => handleChange('overviewImgMain', '')} className="text-white"><Trash2 className="w-5 h-5"/></button>
                          </div>
                        </div>
                      ) : <button onClick={() => handleImageUpload('overviewImgMain')} className="w-full h-40 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400"><ImagePlus/></button>}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-2">Ảnh phụ đè lên (Cỡ vuông)</p>
                      {form.overviewImgSub ? (
                        <div className="relative w-full h-40 group rounded-xl overflow-hidden shadow-sm">
                          <img src={form.overviewImgSub} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                            <button onClick={() => handleChange('overviewImgSub', '')} className="text-white"><Trash2 className="w-5 h-5"/></button>
                          </div>
                        </div>
                      ) : <button onClick={() => handleImageUpload('overviewImgSub')} className="w-full h-40 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400"><ImagePlus/></button>}
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* TAB 4: FEATURES */}
          <div className={cn("space-y-6", activeTab === 'features' ? "block" : "hidden")}>
             <div>
                <h2 className="text-[20px] font-bold text-slate-800 mb-1">Đặc điểm nổi bật</h2>
                <p className="text-sm text-slate-500 mb-6">3 thẻ tính năng tự động giãn bố cục trên khung nền xanh cover.</p>
             </div>
             
             <div>
               <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Mô tả phần đặc điểm</label>
               <Input value={form.featuresDesc} onChange={e => handleChange('featuresDesc', e.target.value)} />
             </div>

             <div className="space-y-3 mt-6">
               <div className="flex items-center justify-between">
                 <label className="text-[12px] font-bold text-slate-600 uppercase block">Thẻ Tính Năng (Nên có 3)</label>
                 <Button onClick={() => addArrayItem('featureCards', { title: '', desc: '' })} size="sm" variant="outline" className="h-8"><Plus className="w-4 h-4 mr-1"/> Thêm tính năng</Button>
               </div>
               
               {form.featureCards.map((card: any, idx: number) => (
                 <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                   <button onClick={() => removeArrayItem('featureCards', idx)} className="absolute top-2 right-2 text-rose-400 opacity-0 group-hover:opacity-100"><X className="w-4 h-4"/></button>
                   <Input placeholder="Tiêu đề (Vd: Trang bị kiến thức chuẩn)" className="mb-2 bg-white font-bold" value={card.title} onChange={e => handleArrayChange('featureCards', idx, 'title', e.target.value)} />
                   <textarea placeholder="Mô tả..." className="w-full p-2 text-sm border rounded outline-none h-20" value={card.desc} onChange={e => handleArrayChange('featureCards', idx, 'desc', e.target.value)} />
                 </div>
               ))}
               {form.featureCards.length === 0 && <p className="text-center text-slate-400 py-4 italic text-sm">Chưa có ô tính năng. Bấm thêm tính năng.</p>}
             </div>
          </div>

          {/* TAB 5: LEARNING OUTCOMES */}
          <div className={cn("space-y-6", activeTab === 'outcomes' ? "block" : "hidden")}>
             <div>
                <h2 className="text-[20px] font-bold text-slate-800 mb-1">Năng lực đầu ra (Skills)</h2>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Mô tả năng lực</label>
                  <textarea className="w-full h-32 p-3 border rounded-xl outline-none" value={form.outcomesDesc} onChange={e => handleChange('outcomesDesc', e.target.value)} />
                  
                  <label className="text-[12px] font-bold text-slate-600 uppercase mt-4 mb-2 block">Ảnh minh họa dọc</label>
                  {form.outcomesImage ? (
                    <div className="relative w-40 h-64 group rounded-xl overflow-hidden shadow-sm">
                      <img src={form.outcomesImage} className="w-full h-full object-cover" />
                      <button onClick={() => handleChange('outcomesImage', '')} className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ) : <button onClick={() => handleImageUpload('outcomesImage')} className="w-40 h-64 border-2 border-dashed rounded-xl flex items-center justify-center"><ImagePlus className="text-slate-400" /></button>}
                </div>

                <div className="col-span-2 md:col-span-1 border-l pl-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-bold text-slate-600 uppercase block">Danh sách kỹ năng</label>
                    <Button onClick={() => addArrayItem('outcomeSkills', { title: '', desc: '' })} size="sm" variant="outline" className="h-8 shadow-sm">Thêm kỹ năng</Button>
                  </div>
                  {form.outcomeSkills.map((sk: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 shadow-sm rounded-xl relative group">
                      <button onClick={() => removeArrayItem('outcomeSkills', idx)} className="absolute top-2 right-2 text-rose-400 opacity-0 group-hover:opacity-100"><X className="w-4 h-4"/></button>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-black text-slate-200">0{idx+1}</span>
                        <Input placeholder="Tiêu đề kỹ năng..." className="h-8 font-bold text-sm" value={sk.title} onChange={e => handleArrayChange('outcomeSkills', idx, 'title', e.target.value)} />
                      </div>
                      <textarea placeholder="Giải thích chi tiết..." className="w-full text-sm border rounded outline-none p-2" value={sk.desc} onChange={e => handleArrayChange('outcomeSkills', idx, 'desc', e.target.value)} />
                    </div>
                  ))}
                  {form.outcomeSkills.length === 0 && <p className="text-sm text-slate-400 italic">Chưa có kỹ năng.</p>}
                </div>
             </div>
          </div>

          {/* TAB 6: CAREERS */}
          <div className={cn("space-y-6", activeTab === 'careers' ? "block" : "hidden")}>
             <div>
                <h2 className="text-[20px] font-bold text-slate-800 mb-1">Triển vọng nghề nghiệp</h2>
                <p className="text-sm text-slate-500 mb-6">Gallery trượt ngang các nghề nghiệp có cài ảnh riêng.</p>
             </div>
             
             <div>
               <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Mô tả triển vọng nghề</label>
               <Input value={form.careersDesc} onChange={e => handleChange('careersDesc', e.target.value)} />
             </div>

             <div className="mt-8 border-t pt-8">
               <div className="flex items-center justify-between mb-4">
                 <label className="text-[12px] font-bold text-slate-600 uppercase block">Danh sách Nghề nghiệp (Nên từ 3-5 thẻ)</label>
                 <Button onClick={() => addArrayItem('careerItems', { title: '', desc: '', image: '' })}><Plus className="w-4 h-4 mr-2"/>Thêm Nghề Mới</Button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {form.careerItems.map((cb: any, idx: number) => (
                   <div key={idx} className="flex gap-4 p-4 border border-slate-200 rounded-xl shadow-sm relative group bg-slate-50">
                     <button onClick={() => removeArrayItem('careerItems', idx)} className="absolute top-2 right-2 z-10 text-rose-400 opacity-0 group-hover:opacity-100 bg-white shadow-sm rounded-full p-1"><X className="w-4 h-4"/></button>
                     
                     <div className="w-24 shrink-0">
                       {cb.image ? (
                          <div className="w-24 h-32 rounded-lg overflow-hidden relative cursor-pointer" onClick={() => {
                            const input = document.createElement('input'); input.type = 'file';
                            input.onchange = async () => {
                              const fd = new FormData(); fd.append('file', input.files![0]); fd.append('category', 'temp');
                              const res = await fetch('/api/upload', {method: 'POST', body: fd}).then(r=>r.json());
                              if(res.success) handleArrayChange('careerItems', idx, 'image', res.url);
                            }; input.click();
                          }}>
                            <img src={cb.image} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center"><p className="text-[10px] text-white">Đổi ảnh</p></div>
                          </div>
                       ) : (
                         <button onClick={() => {
                            const input = document.createElement('input'); input.type = 'file';
                            input.onchange = async () => {
                              const fd = new FormData(); fd.append('file', input.files![0]); fd.append('category', 'temp');
                              const res = await fetch('/api/upload', {method: 'POST', body: fd}).then(r=>r.json());
                              if(res.success) handleArrayChange('careerItems', idx, 'image', res.url);
                            }; input.click();
                         }} className="w-24 h-32 border border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 bg-white">
                           <ImageIcon className="mb-1 w-5 h-5"/> <span className="text-[10px]">Tải ảnh</span>
                         </button>
                       )}
                     </div>

                     <div className="flex-1 space-y-2">
                        <Input placeholder="Tên chức danh (Vd: Quản lý dự án)" value={cb.title} onChange={e => handleArrayChange('careerItems', idx, 'title', e.target.value)} className="font-bold" />
                        <textarea placeholder="Mô tả công việc" className="w-full text-[13px] border rounded p-2 h-20 outline-none resize-none" value={cb.desc} onChange={e => handleArrayChange('careerItems', idx, 'desc', e.target.value)} />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>

          {/* TAB 7: CURRICULUM */}
          <div className={cn("space-y-6", activeTab === 'curriculum' ? "block" : "hidden")}>
             <div>
                <h2 className="text-[20px] font-bold text-slate-800 mb-1">Cấu trúc học phần (Curriculum)</h2>
                <p className="text-sm text-slate-500 mb-6">Hiển thị trong khung cửa sổ MacOS siêu xịn.</p>
             </div>
             
             <div>
               <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Lời mở đầu</label>
               <RichTextEditor 
                 content={form.curriculumDesc} 
                 onChange={(html: string) => handleChange('curriculumDesc', html)} 
                 minHeight={300} 
               />
             </div>

             <div className="mt-6">
               <label className="text-[12px] font-bold text-slate-600 uppercase mb-2 block">Upload File Học Phần (Định dạng PDF)</label>
               
               {form.curriculumPdfUrl ? (
                 <div className="flex flex-col sm:flex-row gap-3 items-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                   <div className="w-12 h-12 bg-white rounded-lg border border-emerald-200 flex flex-col items-center justify-center text-emerald-600 shadow-sm shrink-0">
                     <FileText className="w-6 h-6" />
                   </div>
                   <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start text-center sm:text-left">
                     <p className="text-sm font-bold text-emerald-800 truncate w-full">Đã upload tài liệu giảng dạy</p>
                     <p className="text-xs text-emerald-600 mt-0.5 truncate w-full block">
                       {form.curriculumPdfUrl.split('/').pop()}
                     </p>
                   </div>
                   <div className="flex flex-row gap-2 w-full sm:w-auto">
                     <Button variant="outline" size="sm" onClick={() => setPreviewPdfUrl(form.curriculumPdfUrl)} className="flex-1 sm:flex-none border-blue-300 text-blue-700 bg-white hover:bg-blue-50">
                       <Eye className="w-4 h-4 mr-1.5" /> Xem
                     </Button>
                     <Button variant="outline" size="sm" onClick={() => handlePdfUpload('curriculumPdfUrl')} className="flex-1 sm:flex-none border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-100">Đổi File Khác</Button>
                     <Button variant="outline" size="sm" onClick={() => handleChange('curriculumPdfUrl', '')} className="flex-1 sm:flex-none border-rose-200 text-rose-600 bg-white hover:bg-rose-50 hover:border-rose-300">Xóa</Button>
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl hover:bg-[#005496]/5 hover:border-[#005496]/30 transition-colors group cursor-pointer" onClick={() => handlePdfUpload('curriculumPdfUrl')}>
                   <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-sm mb-4 border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                     <FileText className="w-8 h-8 text-slate-400 group-hover:text-[#005496]" />
                   </div>
                   <p className="font-bold text-slate-700 text-sm mb-1 group-hover:text-[#005496]">Click để chọn file PDF Curriculum</p>
                   <p className="text-xs text-slate-500">Hỗ trợ định dạng .pdf (Tối đa 50MB)</p>
                 </div>
               )}

               <div className="mt-4 flex items-center gap-4">
                 <div className="h-px bg-slate-200 flex-1"></div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hoặc dán Link trực tiếp</span>
                 <div className="h-px bg-slate-200 flex-1"></div>
               </div>

               <Input className="mt-4" placeholder="VD: Link Google Drive hoặc Dropbox..." value={form.curriculumPdfUrl || ''} onChange={e => handleChange('curriculumPdfUrl', e.target.value)} />
             </div>

             <div className="mt-8 p-8 border-2 border-slate-100 bg-white shadow-sm rounded-2xl flex flex-col justify-center items-center text-center">
                <LayoutTemplate className="w-16 h-16 text-sky-400 mb-4" />
                <h3 className="text-lg font-bold text-sky-800">Trình tạo bảng tự động (Table Builder)</h3>
                <p className="text-sm text-sky-600 max-w-sm mt-2 mb-6">Tính năng parse danh sách môn học xịn ra giao diện bảng giấy tự động đang được bảo trì tích hợp. Vui lòng sử dụng tính năng nhúng file PDF trước tạm thời.</p>
                <Button variant="outline" className="border-sky-300 text-sky-700 hover:bg-sky-100" disabled>Sắp ra mắt</Button>
             </div>
          </div>

        </div>
      </div>
      
      {/* ────── CUSTOM PDF VIEWER MODAL ────── */}
      <AnimatePresence>
        {previewPdfUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Toolbar */}
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[15px]">Xem trước Khung đào tạo</h3>
                    <p className="text-xs text-slate-500 truncate max-w-sm">{previewPdfUrl.split('/').pop()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={previewPdfUrl} target="_blank" rel="noreferrer" className="text-[13px] font-bold text-[#005496] hover:underline px-3">
                    Mở tab mới
                  </a>
                  <button onClick={() => setPreviewPdfUrl('')} className="w-9 h-9 rounded-full bg-slate-200/50 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Viewer iframe */}
              <div className="flex-1 bg-slate-200/50 relative">
                <iframe src={previewPdfUrl} className="w-full h-full border-0 absolute inset-0" title="PDF Preview" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
