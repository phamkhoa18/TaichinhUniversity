'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User, Settings, Bell, Search, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { SessionUser } from '@/types/auth'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface AdminHeaderProps {
  user: SessionUser
  onMenuClick?: () => void
  onToggleSidebar?: () => void
  isSidebarCollapsed?: boolean
}

export default function AdminHeader({ user, onMenuClick, onToggleSidebar, isSidebarCollapsed }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="h-[60px] bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10 transition-colors shrink-0">
      <div className="flex-1 flex items-center gap-2">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-slate-400 hover:text-[#005496] rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5 flex-shrink-0" />
        </button>
        
        {/* Desktop sidebar toggle — Shadcn Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 text-slate-400 hover:text-[#005496] rounded-lg hover:bg-[#005496]/5 transition-colors focus:outline-none"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-[18px] h-[18px]" />
              ) : (
                <PanelLeftClose className="w-[18px] h-[18px]" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          </TooltipContent>
        </Tooltip>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 focus-within:ring-1 focus-within:ring-[#005496]/50 focus-within:border-[#005496] transition-all w-72 ml-1">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh..." 
            className="bg-transparent border-none outline-none text-[14px] text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 text-slate-400 hover:text-[#005496] hover:bg-[#005496]/5 rounded-lg transition-colors relative">
              <Bell className="w-[1.1rem] h-[1.1rem]" />
              <span className="absolute top-[5px] right-[5px] w-[7px] h-[7px] bg-rose-500 rounded-full border-[1.5px] border-white"></span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Thông báo</TooltipContent>
        </Tooltip>

        <div className="w-[1px] h-5 bg-slate-200"></div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 focus:outline-none p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="text-right hidden sm:block pr-0.5">
              <p className="text-[14px] font-semibold text-slate-700 leading-tight">{user?.name || 'Nguyễn Văn A'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight">{user?.role || 'Admin'}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#005496]/10 flex items-center justify-center border border-[#005496]/20 relative overflow-hidden">
              {user?.avatar ? (
                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
              ) : (
                <span className="text-[#005496] font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isProfileOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-20"
                  onClick={() => setIsProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-100 overflow-hidden z-30 ring-1 ring-slate-900/5"
                >
                  <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
                     <div className="w-8 h-8 rounded-lg bg-[#005496]/10 text-[#005496] flex items-center justify-center font-bold text-xs">
                       {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                     </div>
                     <div className="flex flex-col min-w-0">
                       <p className="text-[14px] font-bold text-slate-800 tracking-tight truncate">{user?.name || 'User Name'}</p>
                       <p className="text-[11px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                     </div>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button className="flex w-full items-center gap-2.5 px-2.5 py-2 text-[14px] font-medium text-slate-600 hover:text-[#005496] hover:bg-slate-50 rounded-lg transition-colors">
                      <User className="w-4 h-4" /> Hồ sơ cá nhân
                    </button>
                    <button className="flex w-full items-center gap-2.5 px-2.5 py-2 text-[14px] font-medium text-slate-600 hover:text-[#005496] hover:bg-slate-50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" /> Cài đặt
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={() => signOut({ callbackUrl: '/dang-nhap' })}
                      className="flex w-full items-center gap-2.5 px-2.5 py-2 text-[14px] text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
