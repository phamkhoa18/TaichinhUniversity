import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Viện Đào tạo Sau Đại học – Đại học Tài chính – Marketing (UFM)",
    template: "%s | Viện SĐH – UFM",
  },
  description:
    "Viện Đào tạo Sau Đại học – Đại học Tài chính – Marketing (UFM). Đào tạo Thạc sĩ, Tiến sĩ các chuyên ngành Tài chính – Ngân hàng, Quản trị Kinh doanh, Kế toán – Kiểm toán, Fintech. Chương trình đạt chuẩn quốc tế, đội ngũ giảng viên xuất sắc.",
  keywords:
    "viện sau đại học UFM, thạc sĩ tài chính, tiến sĩ quản trị kinh doanh, đại học tài chính marketing, tuyển sinh sau đại học, MBA UFM, cao học UFM, kế toán kiểm toán, fintech",
  authors: [{ name: "Viện Đào tạo Sau Đại học – UFM" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Viện Đào tạo Sau Đại học – UFM",
    title: "Viện Đào tạo Sau Đại học – Đại học Tài chính – Marketing (UFM)",
    description:
      "Đào tạo Thạc sĩ, Tiến sĩ các chuyên ngành hàng đầu. 5.000+ học viên, 12 chương trình, 150+ đối tác quốc tế.",
    images: [{ url: "/images/hero-campus.png", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://daotaosdh.ufm.edu.vn",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
