import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#27303f] text-gray-300 border-t-4 border-[#c8860a] mt-12 text-xs">
      <div className="max-w-site mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Introduction */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Lữ Phúc" className="w-10 h-10 object-contain" />
              <div className="text-lg font-bold text-white tracking-wide flex items-center space-x-2">
                <span>LỮ PHÚC</span>
                <span className="text-xs text-[#c8860a] font-normal border border-[#c8860a]/50 px-2 py-0.5 rounded">
                  Gieo Phúc - Gặt Phước
                </span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              Bát Tự (Tứ Trụ) là một trong những phát minh quan trọng trong mệnh lý học truyền thống,
              được đúc kết qua hàng nghìn năm lịch sử. Hệ thống lý luận Bát Tự Lữ Phúc & Dịch Học
              hỗ trợ phân tích điểm vượng suy, ngũ hành khuyết thiếu để ứng dụng phong thủy cải vận bổ khuyết.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Chức năng chính
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/la-so-bat-tu" className="hover:text-[#c8860a] transition">
                  Lập lá số Bát Tự Lữ Phúc
                </Link>
              </li>
              <li>
                <Link href="/la-so-bat-tu/tim-ngay-sinh-theo-tu-tru" className="hover:text-[#c8860a] transition">
                  Tìm ngày sinh theo Tứ Trụ
                </Link>
              </li>
              <li>
                <Link href="/la-so-tu-vi" className="hover:text-[#c8860a] transition">
                  Lập lá số Tử Vi
                </Link>
              </li>
              <li>
                <Link href="/que-dich/luc-hao" className="hover:text-[#c8860a] transition">
                  Gieo quẻ Lục Hào
                </Link>
              </li>
              <li>
                <Link href="/phong-thuy/bat-trach" className="hover:text-[#c8860a] transition">
                  Phong thủy Bát Trạch
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Cultural disclaimer */}
          <div>
            <div className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Thông tin & Quy định
            </div>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/tai-khoan-premium" className="hover:text-[#c8860a] transition">
                  Gói dịch vụ Premium
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-[#c8860a] transition">
                  Liên hệ tư vấn
                </Link>
              </li>
              <li>
                <Link href="/tim-kiem" className="hover:text-[#c8860a] transition">
                  Tìm kiếm nội dung
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <div className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Kênh Liên Hệ
            </div>
            <ul className="space-y-2.5 text-gray-400 text-[11px]">
              {/* Zalo / Hotline */}
              <li className="flex flex-col">
                <span className="text-gray-500 uppercase text-[10px] font-bold">Zalo / Hotline:</span>
                <a href="https://zalo.me/0374436921" target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold hover:underline">
                  0374436921
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-gray-500 uppercase text-[10px] font-bold">TikTok:</span>
                <span className="text-amber-400 font-semibold">
                  Huyền Học Lữ Phúc
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Cultural Disclaimer per Directive 34 */}
        <div className="mt-8 pt-6 border-t border-gray-700/60 text-gray-400 text-[11px] leading-relaxed">
          <p className="font-semibold text-gray-300 mb-1">Tuyên bố miễn trừ trách nhiệm pháp lý & y tế:</p>
          <p>
            Mọi luận giải mệnh lý Bát Tự, Tử Vi, Quẻ Dịch và Phong Thủy trên website được biên soạn
            cho mục đích nghiên cứu văn hóa, giáo dục và tham khảo tinh thần. Không áp dụng thay thế
            cho các quyết định y tế, pháp luật, đầu tư tài chính chuyên nghiệp hoặc quyết định an toàn tính mạng.
          </p>
        </div>

        <div className="mt-4 pt-4 text-center text-gray-500 text-[11px]">
          © {new Date().getFullYear()} LỮ PHÚC — Bảo lưu mọi quyền. Độc lập phát triển.
        </div>
      </div>
    </footer>
  );
}
