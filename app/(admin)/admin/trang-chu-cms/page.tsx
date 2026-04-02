'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Save, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/upload/ImageUpload';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CMSHomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newsOptions, setNewsOptions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/trang-chu-cms')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData({
            ...res.data,
            featuredNewsIds: res.data.featuredNewsIds && res.data.featuredNewsIds.length > 0 
              ? [...res.data.featuredNewsIds, ...Array(10)].slice(0, 10) 
              : Array(10).fill('') // Đảm bảo luôn có 10 slot
          });
        }
      })
      .finally(() => setLoading(false));

    fetch('/api/admin/news')
      .then(res => res.json())
      .then(res => {
        if (res.success) setNewsOptions(res.data);
      });
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/trang-chu-cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Lỗi khi lưu');
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateSubField = (parentKey: string, key: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [parentKey]: { ...prev[parentKey], [key]: value }
    }));
  };

  const updateArrayItem = (arrayKey: string, index: number, key: string, value: any) => {
    setData((prev: any) => {
      const newArray = [...prev[arrayKey]];
      newArray[index] = { ...newArray[index], [key]: value };
      return { ...prev, [arrayKey]: newArray };
    });
  };

  const removeArrayItem = (arrayKey: string, index: number) => {
    setData((prev: any) => {
      const newArray = [...prev[arrayKey]];
      newArray.splice(index, 1);
      return { ...prev, [arrayKey]: newArray };
    });
  };

  const addArrayItem = (arrayKey: string, emptyItem: any) => {
    setData((prev: any) => ({
      ...prev,
      [arrayKey]: [...prev[arrayKey], emptyItem]
    }));
  };

  const [activeTab, setActiveTab] = useState('hero');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#005496]" />
      </div>
    );
  }

  if (!data) return <div>Lỗi tải dữ liệu</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cấu hình Trang chủ (CMS)</h1>
          <p className="text-sm text-slate-500 mt-1">Tùy biến nội dung, hình ảnh banner và thống kê trên trang chủ</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#005496] hover:bg-[#004882] px-6"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu thay đổi
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg w-max">
          <button onClick={() => setActiveTab('hero')} className={cn("px-4 py-1.5 text-sm font-semibold rounded-md transition-colors", activeTab === 'hero' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}>Hero Banners</button>
          <button onClick={() => setActiveTab('video')} className={cn("px-4 py-1.5 text-sm font-semibold rounded-md transition-colors", activeTab === 'video' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}>Video Highlight</button>
          <button onClick={() => setActiveTab('stats')} className={cn("px-4 py-1.5 text-sm font-semibold rounded-md transition-colors", activeTab === 'stats' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}>Thông số (Stats)</button>
          <button onClick={() => setActiveTab('achievements')} className={cn("px-4 py-1.5 text-sm font-semibold rounded-md transition-colors", activeTab === 'achievements' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}>Thành tựu (Dự phòng)</button>
          <button onClick={() => setActiveTab('news')} className={cn("px-4 py-1.5 text-sm font-semibold rounded-md transition-colors", activeTab === 'news' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}>Bài viết "Đôi nét SĐH" (10 thẻ)</button>
        </div>

        {/* 1. Hero Banners */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">Danh sách Desktop & Mobile Banner trượt</p>
              <Button 
                variant="outline" size="sm" 
                onClick={() => addArrayItem('heroSlides', { image: '', mobileImage: '', title: '', subtitle: '', order: 0 })}
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm Banner
              </Button>
            </div>
            {data.heroSlides.map((slide: any, idx: number) => (
              <div key={idx} className="p-5 border border-slate-200 rounded-xl space-y-4 relative bg-slate-50/50 group">
                <button 
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  onClick={() => removeArrayItem('heroSlides', idx)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex gap-2 items-center mb-2 text-slate-500">
                  <GripVertical className="w-4 h-4" /> <span className="font-bold text-sm">Banner #{idx + 1}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Ảnh Desktop (1920x1080)</label>
                    <ImageUpload value={slide.image} onChange={(url) => updateArrayItem('heroSlides', idx, 'image', url)} category="images" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Ảnh Mobile (dọc - 768x1024)</label>
                    <ImageUpload value={slide.mobileImage} onChange={(url) => updateArrayItem('heroSlides', idx, 'mobileImage', url)} category="images" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Tiêu đề (Xuất hiện mờ mờ đằng sau)</label>
                    <Input value={slide.title} onChange={(e: any) => updateArrayItem('heroSlides', idx, 'title', e.target.value)} placeholder="NÂNG TẦM TRI THỨC" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Mô tả phụ</label>
                    <Input value={slide.subtitle} onChange={(e: any) => updateArrayItem('heroSlides', idx, 'subtitle', e.target.value)} placeholder="Mô tả..." />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Video Highlight */}
        {activeTab === 'video' && (
          <div className="space-y-6">
             <div className="p-6 border border-slate-200 rounded-xl space-y-5 bg-slate-50/50">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-700">URL Nút Video (Ví dụ Vimeo / Youtube)</label>
                   <Input value={data.videoHighlight.url} onChange={(e: any) => updateSubField('videoHighlight', 'url', e.target.value)} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-700">Video ID chạy nền (Vimeo ID - Không bắt buộc)</label>
                   <Input value={data.videoHighlight.videoId} onChange={(e: any) => updateSubField('videoHighlight', 'videoId', e.target.value)} placeholder="VD: 832386996" />
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700">Tiêu đề khu vực (Giới thiệu)</label>
                 <Input value={data.videoHighlight.title} onChange={(e: any) => updateSubField('videoHighlight', 'title', e.target.value)} />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700">Mô tả chi tiết</label>
                 <textarea 
                   value={data.videoHighlight.desc} 
                   onChange={(e: any) => updateSubField('videoHighlight', 'desc', e.target.value)} 
                   rows={4} 
                   className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-700">Chữ ở Nút bấm</label>
                   <Input value={data.videoHighlight.linkText} onChange={(e: any) => updateSubField('videoHighlight', 'linkText', e.target.value)} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-700">Đường dẫn nút bấm</label>
                   <Input value={data.videoHighlight.linkUrl} onChange={(e: any) => updateSubField('videoHighlight', 'linkUrl', e.target.value)} />
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* 3. Stats */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">Các thông số thành tựu nổi bật (vd: 5000+ học viên)</p>
              <Button 
                variant="outline" size="sm" 
                onClick={() => addArrayItem('aboutStats', { value: '', desc: '', order: 0 })}
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm chỉ số
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.aboutStats.map((stat: any, idx: number) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-xl space-y-3 relative group bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button 
                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => removeArrayItem('aboutStats', idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Con số (Value)</label>
                    <Input value={stat.value} onChange={(e: any) => updateArrayItem('aboutStats', idx, 'value', e.target.value)} placeholder="VD: 5.000+" className="font-bold text-[#005496]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Mô tả (Description)</label>
                    <Input value={stat.desc} onChange={(e: any) => updateArrayItem('aboutStats', idx, 'desc', e.target.value)} placeholder="VD: học viên cao học..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Achievements (Images cards) */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">Hình ảnh và Thành tựu (Các Card ở khu vực "Đôi nét về Viện SĐH")</p>
              <Button 
                variant="outline" size="sm" 
                onClick={() => addArrayItem('achievements', { image: '', title: '', order: 0 })}
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm thẻ hình ảnh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.achievements.map((ach: any, idx: number) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-xl space-y-3 relative group bg-white flex flex-col">
                  <button 
                    className="absolute z-10 top-2 right-2 p-1.5 text-slate-400 bg-white hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                    onClick={() => removeArrayItem('achievements', idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-full">
                    <ImageUpload value={ach.image} onChange={(url) => updateArrayItem('achievements', idx, 'image', url)} category="images" />
                  </div>
                  <div className="space-y-1 mt-2">
                    <label className="text-xs font-semibold text-slate-500">Nội dung text trên thẻ</label>
                    <textarea 
                      value={ach.title} 
                      onChange={(e: any) => updateArrayItem('achievements', idx, 'title', e.target.value)} 
                      placeholder="VD: 9 chương trình đạt chuẩn..."
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Featured News List */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex flex-col bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">Chọn 10 bài viết xuất hiện ở mục "Đôi nét về Viện SĐH"</p>
              <p className="text-xs text-slate-500 mt-1">Các bài viết sẽ được tự động hiển thị dưới dạng thẻ kéo ngang (Swiper Slider).</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 10 }).map((_, idx) => {
                const currentVal = data.featuredNewsIds?.[idx]?._id || data.featuredNewsIds?.[idx] || '';
                
                return (
                  <div key={idx} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white">
                    <label className="text-xs font-semibold text-slate-700">
                      Bài viết thẻ ngang #{idx + 1}
                    </label>
                    <Select 
                      value={currentVal} 
                      onValueChange={(val) => {
                        setData((prev: any) => {
                          const arr = [...(prev.featuredNewsIds || Array(10).fill(''))];
                          arr[idx] = val;
                          return { ...prev, featuredNewsIds: arr };
                        });
                      }}
                    >
                      <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200">
                        <SelectValue placeholder="--- Chọn bài viết ---" />
                      </SelectTrigger>
                      <SelectContent>
                        {newsOptions.map(n => (
                          <SelectItem key={n._id} value={n._id}>
                            [{n.tag || n.category?.name || 'TIN TỨC'}] {n.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
