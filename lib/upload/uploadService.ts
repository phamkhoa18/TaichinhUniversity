// ============================================================
// LIB/UPLOAD — Upload Service (Core)
// ✅ Hoạt động đúng cả dev lẫn production build (Next.js)
//
// STRATEGY:
// - Dev: lưu vào public/uploads (serve trực tiếp bởi Next.js)
// - Production: lưu vào UPLOAD_DIR (ngoài project)
//   → serve qua API route /api/files/[...path]
//   → file không bị mất khi rebuild
// ============================================================

import { writeFile, unlink, readdir, mkdir, stat } from 'fs/promises'
import { existsSync } from 'fs'
import { join, extname } from 'path'
import { UploadCategory, UploadedFile } from '@/types/upload'
import { UPLOAD_CONFIG } from './uploadConfig'
import { generateUniqueFilename, validateFile } from './uploadHelpers'

/**
 * Lấy thư mục gốc để lưu file
 * - Production: UPLOAD_DIR env hoặc {cwd}/data/uploads
 * - Dev: {cwd}/public/uploads (serve trực tiếp)
 */
function getUploadRoot(): string {
  if (process.env.UPLOAD_DIR) {
    return process.env.UPLOAD_DIR
  }
  // Mặc định: lưu trong data/uploads (ngoài public, không bị xóa khi build)
  return join(process.cwd(), 'data', 'uploads')
}

/**
 * Tạo URL trả về cho client
 * - Dev (public): /uploads/images/xxx.jpg
 * - Production (data): /api/files/images/xxx.jpg
 */
function getFileUrl(category: UploadCategory, fileName: string): string {
  const config = UPLOAD_CONFIG[category]
  const subPath = config.path.replace('uploads/', '')
  
  // Nếu đang dùng public/uploads thì serve trực tiếp
  const root = getUploadRoot()
  if (root.includes(join('public', 'uploads')) || root.includes('public/uploads')) {
    return `/${config.path}/${fileName}`
  }
  
  // Nếu lưu ngoài public → serve qua API
  return `/api/files/${subPath}/${fileName}`
}

/**
 * Upload 1 file lên storage local
 */
export async function uploadFile(
  file: File,
  category: UploadCategory,
  userId?: string
): Promise<UploadedFile> {
  const config = UPLOAD_CONFIG[category]

  // Validate
  const validation = validateFile(file, config.allowedTypes, config.maxSizeMB)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Tạo thư mục
  const subPath = config.path.replace('uploads/', '')
  const uploadDir = join(getUploadRoot(), subPath)
  await mkdir(uploadDir, { recursive: true })

  // Tạo tên file unique
  let uniqueName = generateUniqueFilename(file.name)
  let finalMimeType = file.type
  let finalSize = file.size

  // Lấy dữ liệu file
  const bytes = await file.arrayBuffer()
  let buffer = Buffer.from(bytes)

  // ⚡ TỐI ƯU HÓA HÌNH ẢNH NẾU LÀ ẢNH (Bỏ qua SVG/GIF)
  if (file.type.startsWith('image/') && !file.type.includes('svg') && !file.type.includes('gif')) {
    try {
      const sharp = (await import('sharp')).default
      
      // Xử lý nén: Resize tối đa 1920px chiều rộng, tự động điều chỉnh chiều cao, nén thành WebP để tối ưu dung lượng nhất
      buffer = (await sharp(buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 75, effort: 4 })
        .toBuffer()) as any

      // Đổi đuôi file thành .webp
      uniqueName = uniqueName.replace(/\.[^/.]+$/, "") + ".webp"
      finalMimeType = 'image/webp'
      finalSize = buffer.length
      console.log(`[Upload] Đã nén thành công: ${file.name} giảm còn ${(finalSize/1024).toFixed(2)} KB`)
    } catch (e) {
      console.warn("[Upload] Lỗi nén ảnh, sẽ lưu ảnh gốc:", e)
    }
  }

  // Write file
  const filePath = join(uploadDir, uniqueName)
  await writeFile(filePath, buffer)

  const url = getFileUrl(category, uniqueName)

  return {
    url,
    originalName: file.name,
    fileName: uniqueName,
    size: finalSize,
    mimeType: finalMimeType,
    category,
    uploadedAt: new Date(),
    uploadedBy: userId,
  }
}

/**
 * Xóa file khỏi storage
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  let fullPath: string

  if (fileUrl.startsWith('/api/files/')) {
    // /api/files/images/xxx.jpg → data/uploads/images/xxx.jpg
    const relativePath = fileUrl.replace('/api/files/', '')
    fullPath = join(getUploadRoot(), relativePath)
  } else {
    // /uploads/images/xxx.jpg → public/uploads/images/xxx.jpg
    const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl
    fullPath = join(process.cwd(), 'public', relativePath)
  }

  if (existsSync(fullPath)) {
    await unlink(fullPath)
  }
}

/**
 * Lấy danh sách file trong 1 category
 */
export async function listFiles(category: UploadCategory): Promise<string[]> {
  const config = UPLOAD_CONFIG[category]
  const subPath = config.path.replace('uploads/', '')
  const dirPath = join(getUploadRoot(), subPath)
  
  try {
    const files = await readdir(dirPath)
    return files.map((f) => getFileUrl(category, f))
  } catch {
    return []
  }
}

/**
 * Lấy đường dẫn vật lý của file (dùng cho serve API)
 */
export function getPhysicalPath(relativePath: string): string {
  return join(getUploadRoot(), relativePath)
}

/**
 * Kiểm tra file có tồn tại không
 */
export async function fileExists(fileUrl: string): Promise<boolean> {
  let fullPath: string
  if (fileUrl.startsWith('/api/files/')) {
    const relativePath = fileUrl.replace('/api/files/', '')
    fullPath = join(getUploadRoot(), relativePath)
  } else {
    const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl
    fullPath = join(process.cwd(), 'public', relativePath)
  }
  return existsSync(fullPath)
}
