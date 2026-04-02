// ============================================================
// API — POST /api/admin/cai-dat/test-email
// Gửi email test để kiểm tra cấu hình SMTP
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import { getSettings } from '@/models/SiteSetting'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const user = session.user as any
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Không có quyền' }, { status: 403 })
    }

    await connectToDatabase()
    const body = await req.json()
    const { toEmail } = body

    if (!toEmail) {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập email nhận' }, { status: 400 })
    }

    const settings = await getSettings()
    const { smtpHost, smtpPort, smtpSecure, fromEmail, fromName, smtpUsername, smtpPassword } = settings.email

    if (!smtpHost || !fromEmail || !smtpUsername) {
      return NextResponse.json({ 
        success: false, 
        error: 'Chưa cấu hình SMTP. Vui lòng điền thông tin SMTP trước.' 
      }, { status: 400 })
    }

    // Dynamically import nodemailer (only if installed)
    try {
      const nodemailer = require('nodemailer')
      
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure === 'SSL',
        auth: {
          user: smtpUsername,
          pass: smtpPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      })

      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: toEmail,
        subject: '[UFM Test] Kiểm tra cấu hình Email SMTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #005496; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">✅ Email Test Thành Công!</h1>
            </div>
            <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="color: #334155; line-height: 1.6;">Cấu hình SMTP đã hoạt động chính xác.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">SMTP Host</td><td style="padding: 8px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${smtpHost}</td></tr>
                <tr><td style="padding: 8px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Port</td><td style="padding: 8px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${smtpPort}</td></tr>
                <tr><td style="padding: 8px; color: #64748b;">Gửi từ</td><td style="padding: 8px; font-weight: 600;">${fromName} &lt;${fromEmail}&gt;</td></tr>
              </table>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
            </div>
          </div>
        `,
      })

      return NextResponse.json({ success: true, message: `Email test đã gửi thành công đến ${toEmail}` })
    } catch (emailError: any) {
      // Nodemailer not installed or SMTP error
      if (emailError.code === 'MODULE_NOT_FOUND') {
        return NextResponse.json({ 
          success: false, 
          error: 'Chưa cài đặt nodemailer. Chạy: npm install nodemailer' 
        }, { status: 500 })
      }
      return NextResponse.json({ 
        success: false, 
        error: `Gửi email thất bại: ${emailError.message}` 
      }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
