import React from 'react';
import Link from 'next/link';
import { BookOpen, Coins, Phone, Compass, ArrowRight } from 'lucide-react';

export default function QueDichHubPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs text-center">
        <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
          Kinh Dịch & Dự Đoán Học Cổ Truyền
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase mt-4">
          Gieo Quẻ Dịch & Lục Hào Dự Trắc
        </h1>
        <p className="text-sm text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">
          Ứng dụng 64 quẻ Kinh Dịch, phương pháp Dã Hạc Lục Hào Chuyên Khảo và Mai Hoa Dịch Số giúp giải đáp nghi vấn, định hướng hành sự đúng thời điểm cát tường.
        </p>
      </div>

      {/* 3 Core Divination Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Method 1: Lục Hào */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-[#c8860a] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Gieo Quẻ Lục Hào</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Thiết lập từng hào (Âm/Dương, Tĩnh/Động), nạp giáp, xác định Thế Ứng, Thần Sát và Lục Thú dự đoán sự vụ chi tiết và chuẩn xác nhất.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/que-dich/luc-hao"
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wide transition shadow-2xs"
            >
              <span>Vào Gieo Quẻ Lục Hào</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Method 2: Ngẫu Nhiên (Tung đồng xu) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Tung Đồng Xu Ngẫu Nhiên</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Mô phỏng chân thực nghi thức gieo 3 đồng tiền cổ 6 lần liên tiếp. Thuật toán ngẫu nhiên tuân thủ chính xác xác suất Dịch học truyền thống.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/que-dich/ngau-nhien"
              className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wide transition shadow-2xs"
            >
              <span>Tung Đồng Xu Ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Method 3: Số Điện Thoại */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Bói Sim Số Điện Thoại</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Lập quẻ Thượng quái, Hạ quái và Hào động theo phương pháp Mai Hoa Dịch Số từ dãy số điện thoại cá nhân để đánh giá năng lượng cát hung.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/que-dich/so-dien-thoai"
              className="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wide transition shadow-2xs"
            >
              <span>Tra Cứu Phong Thủy Sim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
