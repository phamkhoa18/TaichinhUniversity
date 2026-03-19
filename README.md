# 🎓 Viện Đào tạo Sau Đại học – UFM (UX/UI Redesign)

> **Đồ án Thực tập Tốt nghiệp** – Thiết kế lại giao diện website Viện Đào tạo Sau Đại học, Trường Đại học Tài chính – Marketing (UFM).

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer)

---

## 📸 Tổng quan

Website giới thiệu Viện Đào tạo Sau Đại học – UFM với thiết kế hiện đại, chuyên nghiệp, tối ưu trải nghiệm người dùng trên mọi thiết bị.

### ✨ Tính năng chính

| Tính năng | Mô tả |
|---|---|
| 🏠 **Trang chủ** | Hero banner, video highlight (YouTube autoplay), tra cứu nhanh, giới thiệu chương trình đào tạo |
| 📰 **Tin tức & Sự kiện** | Danh sách bài viết, bộ lọc theo danh mục, chế độ xem Grid/List, tìm kiếm |
| 📰 **Chi tiết tin tức** | Trang bài viết chi tiết (`/news/[slug]`), sidebar liên quan |
| 📋 **Tổng quan Viện** | Sứ mệnh, tầm nhìn, timeline phát triển, chương trình đào tạo, gallery |
| 🏛️ **Cơ cấu tổ chức** | Ban lãnh đạo, đội ngũ chuyên viên với ảnh thật, thông tin liên hệ |
| 📝 **Form tư vấn** | Section liên hệ + form đăng ký tư vấn tuyển sinh |
| 🔍 **Tìm kiếm** | Overlay tìm kiếm toàn trang từ header |
| 📱 **Responsive** | Tối ưu cho Desktop, Tablet, Mobile |

---

## 🛠️ Công nghệ sử dụng

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Animation:** [Framer Motion 12](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Font:** SF Compact Display (Apple) — local font files
- **Styling:** Vanilla CSS (CSS Custom Properties)
- **Video:** YouTube IFrame API (autoplay + controls tùy chỉnh)

---

## 📁 Cấu trúc thư mục

```
uxui-taichinh/
├── app/
│   ├── components/          # Các component dùng chung
│   │   ├── Header.tsx       # Header + Mega Menu
│   │   ├── Footer.tsx       # Footer
│   │   ├── HeroSection.tsx  # Hero banner trang chủ
│   │   ├── VideoHighlight.tsx # YouTube video player
│   │   ├── SchoolsSection.tsx # Chương trình đào tạo
│   │   ├── ConsultationSection.tsx # Form liên hệ tư vấn
│   │   ├── CtaSection.tsx   # Call-to-action đăng ký
│   │   ├── SearchOverlay.tsx # Overlay tìm kiếm
│   │   └── CampusSection.tsx
│   ├── gioi-thieu/          # Trang giới thiệu
│   │   ├── page.tsx         # Tổng quan Viện SĐH
│   │   ├── overview.css
│   │   └── co-cau-to-chuc/  # Cơ cấu tổ chức
│   │       ├── page.tsx
│   │       └── cocau.css
│   ├── news/                # Tin tức
│   │   ├── page.tsx         # Danh sách tin tức
│   │   ├── news.css
│   │   └── [slug]/          # Chi tiết bài viết
│   │       └── page.tsx
│   ├── dao-tao/             # Chương trình đào tạo
│   │   └── thac-si/
│   ├── globals.css          # Styles toàn cục + Design system
│   ├── layout.tsx           # Root layout + SEO metadata
│   └── page.tsx             # Trang chủ
├── public/
│   ├── fonts/               # SF Compact Display (Apple font)
│   ├── images/              # Hình ảnh
│   │   ├── life/            # Ảnh campus, hoạt động
│   │   ├── nhansu/          # Ảnh nhân sự
│   │   └── form/            # Ảnh sinh viên
│   └── favicon.ico
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu

- **Node.js** >= 18.x
- **npm** >= 9.x

### Cài đặt

```bash
# Clone repository
git clone <repo-url>
cd uxui-taichinh

# Cài đặt dependencies
npm install
```

### Chạy Development

```bash
npm run dev
```

Mở trình duyệt tại **[http://localhost:3000](http://localhost:3000)**

### Build Production

```bash
npm run build
npm start
```

---

## 📄 Các trang

| Route | Trang |
|---|---|
| `/` | Trang chủ |
| `/gioi-thieu` | Tổng quan Viện SĐH |
| `/gioi-thieu/co-cau-to-chuc` | Cơ cấu tổ chức |
| `/news` | Danh sách Tin tức & Sự kiện |
| `/news/[slug]` | Chi tiết bài viết |
| `/dao-tao/thac-si/tai-chinh-ngan-hang` | Chương trình Thạc sĩ TCNH |

---

## 🎨 Design System

### Color Palette

| Token | Giá trị | Mô tả |
|---|---|---|
| `--primary-navy` | `#003d6b` | Navy chính |
| `--primary-blue` | `#005496` | Xanh UFM |
| `--accent-gold` | `#ffd200` | Vàng UFM |
| `--off-white` | `#F0F2F5` | Nền sáng |
| `--text-dark` | `#171414` | Text chính |

### Typography

- **Font:** SF Compact Display (Light 300, Regular 400, Medium 500, Semibold 600)
- **Heading:** `var(--font-heading)` – SF Compact Display
- **Body:** `var(--font-body)` – SF Compact Display
- **Fallback:** -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif

---

## 🔍 SEO

- ✅ Title tag template với tên trường
- ✅ Meta description chi tiết
- ✅ Keywords tiếng Việt
- ✅ Open Graph (Facebook/Zalo sharing)
- ✅ Robots index + follow
- ✅ Canonical URL
- ✅ Semantic HTML (header, main, section, article, nav)
- ✅ Heading hierarchy (h1 → h2 → h3)
- ✅ Alt text cho hình ảnh
- ✅ `lang="vi"` trên thẻ html

---

## 📱 Responsive Breakpoints

| Breakpoint | Thiết bị |
|---|---|
| `> 1024px` | Desktop |
| `768px – 1024px` | Tablet |
| `480px – 768px` | Mobile lớn |
| `< 480px` | Mobile nhỏ |

---

## 👤 Tác giả

- **Sinh viên:** [Tên sinh viên]
- **MSSV:** [Mã số sinh viên]
- **Lớp:** [Tên lớp]
- **Trường:** Đại học Tài chính – Marketing (UFM)
- **Đồ án:** Thực tập Tốt nghiệp – HK2 2022-2023

---

## 📜 License

Đồ án phục vụ mục đích học tập. © 2026 Viện Đào tạo Sau Đại học – UFM.
