import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFastApiToken, FASTAPI_URL } from '../route'

export const maxDuration = 60

/**
 * POST /api/admin/ai-documents/compose
 * Proxy to FastAPI: Compose HTML → Gemini → Markdown → Ingest
 *
 * FastAPI trả 202 gần như tức thì (chỉ queue background task).
 * Nếu Nginx/proxy cắt kết nối trước → response là HTML, ta catch an toàn.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const body = await req.json()
    const { title, html_content, file_name, program_level, program_name, academic_year, reference_url } = body

    if (!title || !html_content) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề và nội dung không được để trống' },
        { status: 400 }
      )
    }

    const token = await getFastApiToken()
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Không thể kết nối đến AI Backend' },
        { status: 502 }
      )
    }

    // Timeout 30s — FastAPI compose trả 202 gần như tức thì,
    // nếu quá 30s thì chắc chắn là proxy/network issue.
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30_000)

    let response: Response
    try {
      response = await fetch(`${FASTAPI_URL}/api/v1/admin/compose`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          html_content,
          file_name: file_name || '',
          program_level: program_level || '',
          program_name: program_name || '',
          academic_year: academic_year || '',
          reference_url: reference_url || '',
        }),
        signal: controller.signal,
      })
    } catch (fetchErr: any) {
      clearTimeout(timeoutId)
      // AbortError = timeout, hoặc network error
      const isTimeout = fetchErr.name === 'AbortError'
      return NextResponse.json(
        {
          success: false,
          error: isTimeout
            ? 'Kết nối tới AI Backend bị timeout. Task có thể đã được queue — hãy kiểm tra tab Tasks.'
            : `Không thể kết nối AI Backend: ${fetchErr.message}`,
        },
        { status: 504 }
      )
    } finally {
      clearTimeout(timeoutId)
    }

    // ── Đọc body an toàn — Nginx/proxy có thể trả HTML thay vì JSON ──
    const rawText = await response.text()
    let data: any
    try {
      data = JSON.parse(rawText)
    } catch {
      // Response không phải JSON (HTML error page từ Nginx 502/504)
      console.error('Compose proxy: non-JSON response from FastAPI:', rawText.substring(0, 300))
      return NextResponse.json(
        {
          success: false,
          error: `AI Backend trả về lỗi (HTTP ${response.status}). Task có thể đã được queue — hãy kiểm tra tab Tasks.`,
        },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.detail || 'Lỗi từ AI Backend' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Compose API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi server' },
      { status: 500 }
    )
  }
}
