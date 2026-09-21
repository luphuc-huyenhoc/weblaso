import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Home, ArrowRight } from 'lucide-react';

export default function PhongThuyHubPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs text-center">
        <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
          Địa Lý & Phong Thủy Dương Trạch Cổ Truyền
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase mt-4">
          Phong Thủy Bát Trạch & 24 Sơn Hướng
        </h1>
        <p className="text-sm text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">
          Ứng dụng Bát Trạch Minh Cảnh xác định cung phi quái mệnh, phân định 8 hướng cát hung và phân kim 24 sơn hướng kích hoạt sinh khí gia trạch.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-[#c8860a] flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Xem Hướng Nhà Bát Trạch</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tính toán Quái Mệnh theo năm sinh và giới tính, phân nhóm Đông/Tây Tứ Mệnh và 8 hướng cát hung (Sinh Khí, Diên Niên, Tuyệt Mệnh...).
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/phong-thuy/bat-trach"
              className="w-full inline-flex items-center justify-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wide transition shadow-2xs"
            >
              <span>Tra cứu hướng nhà</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Bát Trạch Cho 8 Cung</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Chi tiết trạch mệnh cho từng cung: Càn, Khôn, Khảm, Ly, Cấn, Đoài, Tốn, Chấn. Hướng dẫn bố trí phòng thờ, cửa chính, bếp và giường ngủ.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/phong-thuy/bat-trach-cho-8-cung"
              className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wide transition shadow-2xs"
            >
              <span>Xem chi tiết 8 cung</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Phân Kim 24 Sơn Hướng</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Thước đo la bàn chuẩn xác từng 15 độ, kiểm tra tuyến phân kim Đại Không Vong, Tiểu Không Vong để mở cổng và đặt tâm nhà chính xác.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/phong-thuy/bat-trach-24-son-huong"
              className="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wide transition shadow-2xs"
            >
              <span>Xem 24 sơn hướng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
