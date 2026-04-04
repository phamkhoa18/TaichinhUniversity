'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, FolderTree, BookOpen, Layers, Search, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function TrainingProgramsPage() {
  const [activeTab, setActiveTab] = useState<'programs' | 'levels'>('programs');
  const [levels, setLevels] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<any>(null);
  const [levelForm, setLevelForm] = useState({ name: '', description: '', order: 0, active: true });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resLevel, resProg] = await Promise.all([
        fetch('/api/admin/training/levels').then(r => r.json()),
        fetch('/api/admin/training/programs').then(r => r.json()),
      ]);
      if (resLevel.success) setLevels(resLevel.data);
      if (resProg.success) setPrograms(resProg.data);
    } catch (e) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const saveLevel = async () => {
    if (!levelForm.name) return toast.error('Vui lòng nhập tên cấp bậc');
    
    const url = editingLevel ? `/api/admin/training/levels/${editingLevel._id}` : `/api/admin/training/levels`;
    const method = editingLevel ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(levelForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingLevel ? 'Cập nhật cấp bậc thành công' : 'Đã thêm cấp bậc mới');
        setIsLevelModalOpen(false);
        fetchData();
      } else {
        toast.error(data.error || 'Lỗi lưu cấp bậc');
      }
    } catch (e) {
      toast.error('Có lỗi xảy ra khi gọi API');
    }
  };

  const deleteLevel = async (id: string) => {
    if (!confirm('Hủy bỏ: Nếu có chương trình thuộc cấp bậc này có thể bị mất liên kết. Bạn vẫn muốn xóa?')) return;
    try {
      const res = await fetch(`/api/admin/training/levels/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Xóa cấp bậc thành công');
        fetchData();
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.error('Lỗi thao tác xóa');
    }
  };

  const deleteProgram = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hệ thống ngành này vĩnh viễn?')) return;
    try {
      const res = await fetch(`/api/admin/training/programs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Đã xóa chương trình/ngành học');
        fetchData();
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.error('Lỗi thao tác xóa');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800">Quản lý Đào tạo</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Hệ thống khung chương trình, ngành học linh hoạt.</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'levels' ? (
            <Button onClick={() => { setEditingLevel(null); setLevelForm({ name: '', description: '', order: parseInt(levels.length as any) || 0, active: true }); setIsLevelModalOpen(true); }} size="sm" className="h-9 px-4 text-xs font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
              <Plus className="w-4 h-4 mr-1.5" /> Thêm Cấp Bậc
            </Button>
          ) : (
            <Link href="/admin/chuong-trinh-dao-tao/tao-moi">
              <Button size="sm" className="h-9 px-4 text-[13px] font-bold rounded-lg bg-[#005496] hover:bg-[#004882] text-white">
                <Plus className="w-4 h-4 mr-1.5" /> Soạn Khung Mới
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filter / Tabs */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="bg-white p-1 border border-slate-200 rounded-xl inline-flex shadow-sm">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex items-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-lg transition-all ${activeTab === 'programs' ? 'bg-slate-100 text-[#005496]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <BookOpen className="w-4 h-4" /> Danh sách Ngành học
            <span className="ml-1 bg-slate-200/50 text-slate-500 px-1.5 py-0.5 rounded text-[10px] tabular-nums">{programs.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('levels')}
            className={`flex items-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-lg transition-all ${activeTab === 'levels' ? 'bg-slate-100 text-[#005496]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Layers className="w-4 h-4" /> Cấu hình Cấp bậc
            <span className="ml-1 bg-slate-200/50 text-slate-500 px-1.5 py-0.5 rounded text-[10px] tabular-nums">{levels.length}</span>
          </button>
        </div>

        {activeTab === 'programs' && (
          <div className="flex-1 w-full lg:max-w-sm relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#005496] transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm bảng khung chương trình..." 
              className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005496]/10 focus:border-[#005496] transition-all shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Data Table Area */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">Đang nạp dữ liệu...</div>
        ) : (
          activeTab === 'programs' ? (
            /* PROGRAMS TABLE */
            programs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">Hệ thống Đào tạo Đang Trống</h3>
                <p className="text-slate-500 max-w-sm mt-1 text-[13px] font-medium">Bấm "Soạn Khung Mới" ở góc phải để bắt đầu lắp ráp ngành đầu tiên.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[60px] text-center font-bold text-slate-500">STT</TableHead>
                    <TableHead className="font-bold text-slate-500">Chuyên ngành / Nhóm ngành</TableHead>
                    <TableHead className="font-bold text-slate-500 w-[20%]">Trực thuộc Cấp</TableHead>
                    <TableHead className="w-[140px] text-center font-bold text-slate-500">Trạng thái hiển thị</TableHead>
                    <TableHead className="w-[100px] text-right font-bold text-slate-500 pr-4">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((prog, idx) => (
                    <TableRow key={prog._id} className="group hover:bg-slate-50/50 transition-colors">
                      <TableCell className="text-center font-medium text-slate-500">{idx + 1}</TableCell>
                      <TableCell>
                        <span className="font-bold text-[#005496] whitespace-nowrap overflow-hidden text-ellipsis block max-w-[300px]">{prog.name}</span>
                        {prog.slug && <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">/chuong-trinh-dao-tao/{prog.slug}</span>}
                      </TableCell>
                      <TableCell>
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold border border-slate-200">
                          {prog.level?.name || 'Vô danh'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${prog.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}
                        `}>
                          {prog.status === 'PUBLISHED' ? 'Hiển thị' : 'Lưu Nháp'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/chuong-trinh-dao-tao/${prog._id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#005496] hover:bg-slate-100">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => deleteProgram(prog._id)} className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          ) : (
            /* LEVELS TABLE */
            levels.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-16 text-center">
                <FolderTree className="w-12 h-12 text-slate-200 mb-3" />
                <h3 className="text-[15px] font-bold text-slate-800">Chưa thiết lập Cấp Bậc</h3>
                <p className="text-slate-500 mt-1 text-[13px]">Bấm Thêm Cấp Bậc để tạo các danh mục (Vd: Thạc sĩ, Tiến sĩ).</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[60px] text-center font-bold text-slate-500">STT</TableHead>
                    <TableHead className="font-bold text-slate-500">Tên phân cấp</TableHead>
                    <TableHead className="font-bold text-slate-500">Mô tả đặc tính</TableHead>
                    <TableHead className="w-[100px] text-center font-bold text-slate-500">Hiển thị</TableHead>
                    <TableHead className="w-[100px] text-right font-bold text-slate-500 pr-4">Công cụ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levels.map((lvl, idx) => (
                    <TableRow key={lvl._id} className="group hover:bg-slate-50/50">
                      <TableCell className="text-center font-medium text-slate-500">{idx + 1}</TableCell>
                      <TableCell className="font-bold text-slate-800">{lvl.name}</TableCell>
                      <TableCell className="text-[13px] text-slate-500">{lvl.description || <span className="italic opacity-50">Không mô tả</span>}</TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-block w-2.5 h-2.5 rounded-full ${lvl.active ? 'bg-emerald-500' : 'bg-slate-300'}`} title={lvl.active ? 'Đang bật' : 'Bị ẩn'} />
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#005496] hover:bg-slate-100" onClick={() => { setEditingLevel(lvl); setLevelForm({ name: lvl.name, description: lvl.description || '', order: lvl.order, active: lvl.active }); setIsLevelModalOpen(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteLevel(lvl._id)} className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          )
        )}
      </div>

      {/* Level Modal Edit/Create */}
      <Dialog open={isLevelModalOpen} onOpenChange={setIsLevelModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-lg text-slate-800">{editingLevel ? 'Cập nhật Nhóm Phân cấp' : 'Thêm Cấp Bậc Đầu Ra'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div>
              <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Tên hiển thị <span className="text-rose-500">*</span></label>
              <Input 
                value={levelForm.name} 
                onChange={e => setLevelForm({...levelForm, name: e.target.value})} 
                placeholder="Vd: Thạc sĩ Quản trị, Sau Đại học..." 
                className="h-10 text-[14px]"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">Mô tả phụ</label>
              <textarea 
                value={levelForm.description} 
                onChange={e => setLevelForm({...levelForm, description: e.target.value})} 
                placeholder="Thông tin mở rộng về cấp học..." 
                className="w-full min-h-[80px] p-3 text-[13px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#005496]/10 focus:border-[#005496] resize-none"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="text-[13px] font-bold text-slate-800">Trạng thái Public</p>
                <p className="text-[11px] text-slate-500">Cho phép người dùng nhìn thấy nhóm tab này</p>
              </div>
              <Switch checked={levelForm.active} onCheckedChange={c => setLevelForm({...levelForm, active: c})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsLevelModalOpen(false)}>Quay lại</Button>
            <Button size="sm" onClick={saveLevel} className="bg-[#005496] hover:bg-[#004882] text-white">Lưu cấu hình</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
