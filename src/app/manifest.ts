import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bát Tự Lữ Phúc — Huyền Học & Mệnh Lý',
    short_name: 'Bát Tự Lữ Phúc',
    description: 'Ứng dụng lập lá số Bát Tự Tứ Trụ, Tử Vi Đẩu Số, Gieo Quẻ Kinh Dịch và Phong Thủy Bát Trạch Lữ Phúc.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f9f5ec',
    theme_color: '#27303f',
    categories: ['lifestyle', 'utilities', 'productivity'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/logo.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
  };
}
