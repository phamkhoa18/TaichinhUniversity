'use client'

import React, { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import { TrendingUp, FileText } from 'lucide-react'

// Shadcn style custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg ring-1 ring-black/5">
        <p className="text-[13px] font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-[12px] font-medium py-0.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="text-slate-800 font-bold ml-auto pl-4">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function DashboardAdmissionsChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center group">
        <div className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-3">
          <TrendingUp className="w-5 h-5 text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-slate-600">Dữ liệu hiện đang trống</p>
        <p className="text-xs text-slate-400 max-w-xs mt-1">Chưa có ứng viên nào đăng ký trong năm nay.</p>
      </div>
    )
  }

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#005496" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#005496" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAdmitted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} iconType="circle" />
          <Area 
            type="monotone" 
            dataKey="applicants" 
            name="Tổng hồ sơ" 
            stroke="#005496" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorApplicants)" 
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Area 
            type="monotone" 
            dataKey="admitted" 
            name="Trúng tuyển" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAdmitted)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DashboardDistributionChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
       <div className="h-64 bg-slate-50/50 rounded-lg flex flex-col items-center justify-center p-6 text-center">
          <FileText className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">Chưa có dữ liệu phân bổ</p>
       </div>
    )
  }

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            dy={10}
            interval={0}
            tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Số lượng" fill="#ffd200" radius={[4, 4, 0, 0] as any} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
