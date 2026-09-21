import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCurrentUser } from '@/server/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lữ Phúc | Bát Tự Manh Phái & Dịch Học Cổ Truyền',
  description:
    'Lập lá số Bát Tự, Tứ Trụ phong thủy cải vận bổ khuyết, luận giải hiện tại tương lai quá khứ, lá số tử vi, quẻ dịch lục hào và phong thủy bát trạch.',
  keywords: ['bát tự', 'tứ trụ', 'ngũ hành', 'tử vi', 'lục hào', 'quẻ dịch', 'bát trạch', 'manh phái', 'lữ phúc'],
  authors: [{ name: 'Lữ Phúc' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col justify-between bg-[#f4f6f9]">
        <div>
          <Header user={user ? { fullName: user.fullName, role: user.role } : null} />
          <Navbar />
          <main className="max-w-site mx-auto px-4 py-6 w-full">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
