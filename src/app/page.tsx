import React from 'react';
import { BaziForm } from '@/components/bazi/BaziForm';
import Link from 'next/link';
import { Compass, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Main Calculation Workflow */}
      <section>
        <BaziForm />
      </section>

      {/* Feature Highlights Grid matching information architecture */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs text-center space-y-2">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#c8860a]">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Bát Tự Manh Phái</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Hệ thống lý thuyết Tứ Trụ chuẩn xác, phân tích chi tiết thân vượng nhược, tàng can và thập thần.
          </p>
          <Link href="/la-so-bat-tu" className="text-xs text-[#c8860a] font-semibold hover:underline block pt-1">
            Lập lá số ngay →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Dịch Học & Lục Hào</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Gieo quẻ 6 hào, nạp giáp, thế ứng và lục thú định hướng hành động chuẩn xác trong mọi sự vụ.
          </p>
          <Link href="/que-dich/luc-hao" className="text-xs text-[#c8860a] font-semibold hover:underline block pt-1">
            Gieo quẻ dịch →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs text-center space-y-2">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Lá Số Tử Vi</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            An 12 cung mệnh, 14 chính tinh, tứ hóa và vòng tràng sinh khám phá thiên bẩm và vận hạn đời người.
          </p>
          <Link href="/la-so-tu-vi" className="text-xs text-[#c8860a] font-semibold hover:underline block pt-1">
            Xem tử vi →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs text-center space-y-2">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Phong Thủy Bát Trạch</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Xác định cung phi quái mệnh, 8 hướng cát hung và 24 sơn hướng kích hoạt sinh khí gia trạch.
          </p>
          <Link href="/phong-thuy/bat-trach" className="text-xs text-[#c8860a] font-semibold hover:underline block pt-1">
            Tra cứu hướng nhà →
          </Link>
        </div>
      </section>
    </div>
  );
}
