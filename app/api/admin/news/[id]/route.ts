import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db/mongodb'
import News from '@/models/News'
import '@/models/Category'
import '@/models/User'
import { auth } from '@/auth'
import { deleteFile } from '@/lib/upload/uploadService'

// Hàm lấy tất cả URL ảnh/file từ nội dung HTML
function extractUrls(html: string = ''): string[] {
  const urls: string[] = []
  const regex = /<img[^>]+src=["']([^"']+)["']/g
  let match
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1])
  }
  return urls
}

// Hàm kiểm tra xem URL có thuộc máy chủ cục bộ hay không
function isLocalFile(url: string) {
  return url && (url.startsWith('/api/files/') || url.startsWith('/uploads/'))
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params
    const news = await News.findById(id).populate('author', 'name').populate('category', 'name color slug').lean()
    if (!news) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true, data: news })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })
    }

    await connectToDatabase()
    const { id } = await params
    const body = await req.json()

    if (!body.title || !body.slug) {
      return NextResponse.json({ success: false, error: 'Tiêu đề và slug là bắt buộc' }, { status: 400 })
    }

    // 1. Lấy thông tin bài viết cũ CỦA server (để dò các file bị bỏ đi đi)
    const oldNews = await News.findById(id)
    if (!oldNews) return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 })

    const updateData: any = {
      ...body,
      publishedAt: body.status === 'PUBLISHED' && !body.publishedAt ? new Date() : body.publishedAt,
    }

    delete updateData._id;

    let query: any = { $set: updateData }
    
    if (body.attachedFile === null) {
      delete updateData.attachedFile;
      query.$unset = { attachedFile: 1 };
    }

    // 2. Chạy dọn dẹp ổ đĩa (Garbage Collection)
    // Các file có trong oldNews nhưng KHÔNG có trong cái mới thì xóa!
    try {
      const urlsToDelete: string[] = []

      // Dò Thumbnail
      if (oldNews.thumbnail && oldNews.thumbnail !== body.thumbnail && isLocalFile(oldNews.thumbnail)) {
        urlsToDelete.push(oldNews.thumbnail)
      }
      // Dò Attached File (PDF)
      if (oldNews.attachedFile?.url && oldNews.attachedFile.url !== body.attachedFile?.url && isLocalFile(oldNews.attachedFile.url)) {
        urlsToDelete.push(oldNews.attachedFile.url)
      }
      // Dò Băng Html content (ảnh trong editor)
      const oldImages = extractUrls(oldNews.content)
      const newImages = extractUrls(body.content)
      for (const imgUrl of oldImages) {
        if (!newImages.includes(imgUrl) && isLocalFile(imgUrl)) {
          urlsToDelete.push(imgUrl)
        }
      }

      // Xóa tất cả ngầm không block process
      urlsToDelete.forEach(url => deleteFile(url).catch(() => {}))
    } catch (e) {
      console.error('Lỗi dọn rác ổ đĩa:', e)
    }

    const news = await News.findByIdAndUpdate(id, query, { new: true })

    return NextResponse.json({ success: true, data: news }, { status: 200 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Slug đã tồn tại, vui lòng chọn slug khác' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 })

    await connectToDatabase()
    const { id } = await params
    
    // Tìm trước khi xóa để lấy thông tin dọn rác
    const oldNews = await News.findById(id)
    if (!oldNews) return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 })

    const news = await News.findByIdAndDelete(id)
    
    // Dọn dẹp ổ đĩa (Garbage Collection) khi xóa bài viết
    if (news) {
      try {
        const urlsToDelete: string[] = []

        if (oldNews.thumbnail && isLocalFile(oldNews.thumbnail)) {
          urlsToDelete.push(oldNews.thumbnail)
        }
        if (oldNews.attachedFile?.url && isLocalFile(oldNews.attachedFile.url)) {
          urlsToDelete.push(oldNews.attachedFile.url)
        }
        const oldImages = extractUrls(oldNews.content)
        for (const imgUrl of oldImages) {
          if (isLocalFile(imgUrl)) {
            urlsToDelete.push(imgUrl)
          }
        }

        urlsToDelete.forEach(url => deleteFile(url).catch(() => {}))
      } catch (e) {
        console.error('Lỗi dọn rác ở DELETE news:', e)
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
