import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bắt buộc khai báo sharp để không lỗi khi build deployment
  serverExternalPackages: ['sharp'],
  
  // Nâng giới hạn formData nói chung lên 50MB (App Router)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
