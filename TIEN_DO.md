# 📋 TIẾN ĐỘ DỰ ÁN — ADMIN PANEL SAU ĐẠI HỌC UFM
> Cập nhật lần cuối: 25/03/2026 14:15
> Người thực hiện: AI Assistant + Dev
> Website gốc: https://daotaosdh.ufm.edu.vn/

---

## 🗺️ TỔNG QUAN 3 SẢN PHẨM

| Sản phẩm | URL | Trạng thái |
|---|---|---|
| Website công khai | `/` | 🔵 Đang có UI client |
| Admin Panel | `/admin/*` | 🟡 Đang xây dựng |
| Portal Học viên | `/portal/*` | ⚪ Chưa bắt đầu |

---

## ✅ ĐÃ HOÀN THÀNH

### 📅 24/03/2026

---

#### [DONE] 🔍 Phân tích website gốc
- Khám phá toàn bộ https://daotaosdh.ufm.edu.vn/
- Xác định các module cần quản lý
- Output: `PHAN_TICH_ADMIN_SDH.txt`

---

#### [DONE] 📋 Phân tích chức năng — 10 module Admin
**File:** `PHAN_TICH_ADMIN_SDH.txt`

| # | Module | Ưu tiên |
|---|---|---|
| 1 | Dashboard | P1 |
| 2 | Thông báo & Tin tức | P1 |
| 3 | Chương trình Đào tạo | P2 |
| 4 | Tuyển sinh | P1 |
| 5 | Đào tạo ngắn hạn | P2 |
| 6 | Văn bản - Tài liệu | P2 |
| 7 | Thời khóa biểu | P3 |
| 8 | Banner & Trang chủ CMS | P3 |
| 9 | Người dùng & Phân quyền | P3 |
| 10 | Cài đặt hệ thống | P3 |

---

#### [DONE] 🔐 Thiết kế hệ thống phân quyền (RBAC)
**File:** `lib/auth/permissions.ts`, `types/auth.ts`

**3 Role (đã cập nhật 25/03/2026):**
- `ADMIN` — Toàn quyền hệ thống (wildcard `*`)
- `EDITOR` — Biên tập viên (thêm/sửa nội dung, không xóa, không quản lý user)
- `ADMISSION_OFFICER` — Cán bộ tuyển sinh (quản lý hồ sơ, đợt tuyển sinh, export)

> ℹ️ Bỏ `SUPER_ADMIN` (hợp nhất vào `ADMIN`) và `STUDENT` (để dành cho giai đoạn sau nếu cần).

~20 Permission riêng biệt, ma trận phân quyền đầy đủ.

---

#### [DONE] 📤 Thiết kế Upload Module (tách biệt)
**Files:**
- `lib/upload/uploadConfig.ts` — Config theo category
- `lib/upload/uploadHelpers.ts` — Validate, tạo tên unique
- `lib/upload/uploadService.ts` — Core service (production-safe)
- `app/api/upload/route.ts` — POST /api/upload

Tính năng:
- ✅ Dùng `process.cwd()` → đúng cả dev lẫn `build`
- ✅ 5 category: images, documents, banners, avatars, temp
- ✅ Validate file type + size
- ✅ Tên file unique (timestamp + random)
- ✅ Dễ migrate sang Cloudinary/S3 sau này

---

#### [DONE] 🗂️ Tạo cấu trúc thư mục project (90 thư mục)
**File tham chiếu:** `PROJECT_STRUCTURE.txt`

Đã tạo đầy đủ:
```
types/                ← 6 file type definitions
lib/                  ← upload/, auth/, db/, email/, utils/, validations/
hooks/                ← Custom React hooks
config/               ← App-level config
store/                ← Global state
constants/            ← adminNav.ts (menu + permission mapping)
components/           ← ui/, upload/, layout/, forms/, charts/, modals/
prisma/               ← Schema & migrations
public/uploads/       ← images/, documents/, banners/, avatars/, temp/
app/(auth)/           ← Đăng nhập, quên mật khẩu
app/(public)/         ← Website công khai (9 routes)
app/(admin)/          ← Admin Panel (21 routes)
app/(portal)/         ← Student Portal (7 routes)
app/api/              ← Upload, Admin, Portal, Public APIs
```

---

#### [DONE] 📝 TypeScript Types đầy đủ
| File | Nội dung |
|---|---|
| `types/auth.ts` | Role, Permission, SessionUser, AuthToken |
| `types/news.ts` | News, NewsStatus, NewsCategory, CreateNewsInput |
| `types/admission.ts` | Applicant, AdmissionRound, ApplicationStatus |
| `types/upload.ts` | UploadedFile, UploadResponse, UploadConfig |
| `types/index.ts` | Barrel export tất cả |

---

#### [DONE] 🧭 Hằng số Navigation Admin
**File:** `constants/adminNav.ts`
- Định nghĩa toàn bộ menu sidebar admin
- Mỗi item gắn với permission tương ứng
- Hỗ trợ submenu lồng nhau
- Tự ẩn menu khi user không có quyền

---

#### [DONE] ⚙️ Cập nhật .gitignore
- Ignore file upload thực tế (`/public/uploads/**`)
- Giữ lại `.gitkeep` để track thư mục trống
- Ignore script tạm `create_structure.ps1`

---

## 🚧 ĐANG LÀM / TIẾP THEO

### 🔴 P1 — Làm ngay (nền tảng)

| # | Việc cần làm | File mục tiêu | Trạng thái |
|---|---|---|---|
| 1 | Mongoose Schema (database models) | `models/User.ts` | ✅ Xong |
| 2 | Admin Layout (sidebar + header) | `app/(admin)/layout.tsx` | ✅ Xong |
| 3 | AdminSidebar component | `components/layout/AdminSidebar.tsx` | ✅ Xong |
| 4 | AdminHeader component | `components/layout/AdminHeader.tsx` | ✅ Xong |
| 5 | Dashboard page | `app/(admin)/admin/dashboard/page.tsx` | ✅ Xong |
| 6 | Auth — Trang đăng nhập | `app/(auth)/dang-nhap/page.tsx` | ✅ Xong |
| 7 | Middleware bảo vệ route | `middleware.ts` | ✅ Xong |

### 🟡 P2 — Sau khi có nền tảng

| # | Việc cần làm | Trạng thái |
|---|---|---|
| 1 | Module Thông báo (CRUD + rich text) | ✅ Xong |
| 2 | Module Tuyển sinh (đợt + hồ sơ) | 🟨 Đang làm đợt |
| 3 | Upload component (UploadZone, FileManager) | ⚪ Chưa |
| 4 | Module Chương trình Đào tạo | ⚪ Chưa |
| 5 | Module Văn bản - Tài liệu | ⚪ Chưa |

### 🟢 P3 — Sau khi có core modules

| # | Việc cần làm | Trạng thái |
|---|---|---|
| 1 | Module Thời khóa biểu | ⚪ Chưa |
| 2 | Banner & CMS Trang chủ | ⚪ Chưa |
| 3 | Module Người dùng & Phân quyền UI | ⚪ Chưa |
| 4 | Cài đặt hệ thống | ⚪ Chưa |
| 5 | Upload Manager (thư viện file) | ⚪ Chưa |

### ⚪ Xa hơn — Portal Học viên *(tạm hoãn)*

> 🔕 **Tạm bỏ qua giai đoạn này.** Tập trung hoàn thiện Admin Panel cho 3 role (ADMIN / EDITOR / ADMISSION_OFFICER) trước. Portal Học viên sẽ xem xét lại sau khi core system ổn định.

| # | Việc cần làm | Trạng thái |
|---|---|---|
| 1 | Portal layout + đăng nhập học viên | ⏸ Hoãn |
| 2 | Trang thông tin cá nhân | ⏸ Hoãn |
| 3 | Xem TKB, điểm, học phí | ⏸ Hoãn |
| 4 | Nộp đơn online | ⏸ Hoãn |
| 5 | Thông báo cá nhân | ⏸ Hoãn |

---

### 📅 25/03/2026 — Chiều (UX/UI Overhaul + Jodit + Category CRUD)

**🎨 Thiết kế UI/UX:**
- Xóa toàn bộ shadow khỏi Shadcn components (Input, Button, Select, Popover, Card, Calendar) → Flat Design 100%.
- Tăng font-weight base lên 450, bật antialiased rendering → chữ dày dặn, sắc nét.
- Tăng kích thước text trên toàn hệ thống: page title 22px, label 14px, meta 13px, body 15px.
- Tăng content padding (`p-6 lg:p-10`), header height 60px, sidebar text 14px/13px.
- Bỏ kiểu label `uppercase tracking-wider` → chữ bình thường dễ đọc.

**🧩 Shadcn Components:**
- Cài thêm `Tooltip` component → dùng cho sidebar toggle và bell icon.
- Thêm `TooltipProvider` bọc toàn bộ AdminShell.

**📝 Trình soạn thảo:**
- ❌ Xóa TinyMCE (lỗi license, upgrade prompt).
- ✅ Thay bằng **Jodit Editor** (MIT License, 100% free, self-hosted).
- Full toolbar: font, table, image upload (base64), video, source code, fullscreen, print.
- CSS override flat design đồng bộ.

**🗂️ Module Danh mục bài viết:**
- Model `models/Category.ts` (name, slug, color, order, isActive).
- API CRUD: `GET/POST /api/admin/categories`, `PUT/DELETE /api/admin/categories/[id]`.
- Trang quản lý `/admin/thong-bao/danh-muc` — inline CRUD, color picker, Shadcn Table.
- Sidebar thêm mục "Danh mục" (icon FolderOpen).

**📰 Module Bài viết (nâng cấp):**
- Model `News.ts` cập nhật: category → ObjectId ref Category, thêm `tags[]`, `isPinned`.
- API: `GET/POST /api/admin/news` — populate category + author, gán author từ session.
- Trang danh sách `/admin/thong-bao` — populate danh mục, icon ghim, hiện tags.
- Trang tạo mới `/admin/thong-bao/tao-moi` — **Premium Redesign**: tab Editor/SEO, SEO preview Google, danh mục radio buttons, word count, thumbnail hover overlay.

**🔧 Sidebar Toggle:**
- Nút toggle `PanelLeftClose / PanelLeftOpen` trên Header (Desktop).
- Collapse sidebar (72px icon mode), không ẩn hoàn toàn.
- Dùng Shadcn Tooltip hiện label "Thu gọn sidebar" / "Mở rộng sidebar".

### 📅 25/03/2026 — Chiều (Tuyển sinh - Phase 1)

**🏫 Module Tuyển sinh (Đợt Tuyển sinh):**
- Xây dựng model `models/AdmissionRound.ts` (ThS, TS, chỉ tiêu, url hồ sơ) và `Applicant.ts`.
- Pre-save DB hook: tự động switch state `UPCOMING`/`OPEN`/`CLOSED` theo lịch.
- Triển khai API `/api/admin/admissions/rounds` lấy/đăng đợt mới. Phân quyền `admission:read` / `admission:edit`.
- UI `/admin/tuyen-sinh/dot` (Danh sách): Hiển thị siêu đẹp báo cáo chỉ tiêu, tag ThS/TS, count active hồ sơ ảo, Shadcn Badge Table.
- UI `/admin/tuyen-sinh/dot/tao-moi` (Tạo mới): Premium form 2 cột shadowless, Calendar UI, thông minh set Datepicker. Lọc lỗi nhập logic chặt chẽ.

### 📅 25/03/2026 (Module 3: Thông báo & Tin tức với Shadcn/Framer)
- Cài đặt toàn bộ ecosystem Shadcn/UI (Button, Calendar, Popover, Select, Input, Badge...).
- Xây dựng file schema `models/News.ts`.
- Giao diện `app/(admin)/admin/thong-bao/page.tsx` (Danh sách thông báo) cực kỳ xịn mượt với bảng dữ liệu, lọc Calendar.
- Giao diện Editor `app/(admin)/admin/thong-bao/tao-moi/page.tsx` phong cách SaaS.

### 📅 25/03/2026 (Module 2: MongoDB & Đăng ký)
- Bỏ Prisma, setup `mongoose` kết nối MongoDB chuẩn theo mô hình tái sử dụng (Edge).
- Tạo model `User.ts` và API `/api/auth/register` (xử lý mã hóa BCrypt lưu thẳng DB).
- Xóa data thô `mockUsers.ts`, cập nhật trang Đăng nhập liên kết Mongoose lấy thông tin thực.
- Thêm trang Đăng ký `/dang-ky` cho Dev.

### 📅 25/03/2026 (Module 1: Auth & Next.js Foundation)
- Cài đặt `next-auth@beta`, tạo `middleware.ts` bảo vệ route `/admin`
- Code `app/(admin)/layout.tsx` kết hợp `AdminSidebar` (menu động theo Role) và `AdminHeader`
- Thiết kế UI siêu mượt cho `app/(auth)/dang-nhap/page.tsx` cùng mock user data để testing.
- Setup thẻ Dashboard basic.

## 📁 FILE ĐÃ TẠO — DANH SÁCH ĐẦY ĐỦ

```
✅ PHAN_TICH_ADMIN_SDH.txt             → Phân tích toàn bộ hệ thống
✅ PROJECT_STRUCTURE.txt               → Sơ đồ cấu trúc thư mục
✅ TIEN_DO.md                          → File này (theo dõi tiến độ)

✅ lib/auth/authConfig.ts              → Cấu hình NextAuth (Provider, Callbacks)
✅ lib/auth/permissions.ts              → ROLE_PERMISSIONS, hasPermission()
✅ lib/auth/passwordUtils.ts            → Bcrypt utility functions
✅ lib/db/mongodb.ts                    → Singleton kết nối MongoDB Database
✅ models/User.ts                       → Mô hình Mongoose User DB

✅ app/api/auth/[...nextauth]/route.ts  → Route xử lý NextAuth
✅ app/api/auth/register/route.ts       → Route Đăng ký (Post API Mongoose)
✅ middleware.ts                        → Chặn quyền truy cập Admin
✅ auth.ts                              → Wrapper NextAuth

✅ components/layout/AdminSidebar.tsx   → Sidebar Nav (collapse + toggle)
✅ components/layout/AdminHeader.tsx    → Top Header kèm Dropdown, Toggle Sidebar, Tooltip
✅ components/layout/AdminShell.tsx     → Shell layout bọc TooltipProvider
✅ app/(admin)/layout.tsx               → Layout chung bọc `/admin`
✅ app/(auth)/dang-nhap/page.tsx        → Giao diện Đăng nhập
✅ app/(auth)/dang-ky/page.tsx          → Giao diện Đăng ký (Dev)
✅ components/ui/card.tsx               → Card UI (no shadow)
✅ components/ui/tooltip.tsx            → Shadcn Tooltip
✅ components/ui/rich-text-editor.tsx   → Jodit Editor wrapper (MIT)
✅ app/(admin)/admin/dashboard/page.tsx → Dashboard chính
✅ app/(admin)/admin/thong-bao/page.tsx → Danh sách bài viết (Server Component)
✅ app/(admin)/admin/thong-bao/tao-moi/page.tsx → Tạo bài viết (Premium UI)
✅ app/(admin)/admin/thong-bao/danh-muc/page.tsx → Quản lý danh mục CRUD
✅ app/(admin)/admin/tuyen-sinh/dot/page.tsx   → Danh sách đợt tuyển sinh
✅ app/(admin)/admin/tuyen-sinh/dot/tao-moi/page.tsx → Tạo đợt tuyển sinh mới
✅ models/Category.ts                  → Mongoose Category model
✅ models/News.ts                      → Mongoose News model (updated)
✅ models/AdmissionRound.ts            → Mongoose Đợt tuyển sinh model
✅ models/Applicant.ts                 → Mongoose Hồ sơ ứng viên model
✅ types/news.ts                       → TypeScript types (updated)
✅ app/api/admin/categories/route.ts   → GET/POST danh mục
✅ app/api/admin/categories/[id]/route.ts → PUT/DELETE danh mục
✅ app/api/admin/news/route.ts         → GET/POST bài viết
✅ app/api/admin/admissions/rounds/route.ts → GET/POST đợt tuyển sinh
✅ constants/adminNav.ts               → Thêm mục Danh mục
```

---

## 📌 QUY TẮC CẬP NHẬT FILE NÀY

> Mỗi khi hoàn thành 1 task, cập nhật ngay vào đây:
> 1. Di chuyển task từ "Tiếp theo" → "Đã hoàn thành"
> 2. Ghi rõ: ngày, file đã tạo/sửa, tính năng đã làm
> 3. Cập nhật dòng "Cập nhật lần cuối" ở trên

---

## 🛠️ TECH STACK

| Thành phần | Công nghệ | Trạng thái |
|---|---|---|
| Framework | Next.js 15 (App Router) | ✅ Đã cài |
| Language | TypeScript | ✅ Đã cài |
| Styling | Tailwind CSS v4 | ✅ Đã cài |
| UI Components | Shadcn/UI (Button, Input, Select, Table, Calendar, Popover, Badge, Tooltip) | ✅ Đã cài |
| Database | MongoDB + Mongoose | ✅ Đã cài |
| Auth | NextAuth.js v5 (beta) | ✅ Đã cài |
| Rich Text | Jodit Editor (MIT) | ✅ Đã cài |
| Animation | Framer Motion | ✅ Đã cài |
| Date | date-fns | ✅ Đã cài |
| Icons | Lucide React | ✅ Đã cài |
| Charts | Recharts | ⚪ Chưa cài |
| Export | xlsx | ⚪ Chưa cài |
| Email | Nodemailer | ⚪ Chưa cài |
