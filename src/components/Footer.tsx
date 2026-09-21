import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#27303f] text-gray-300 border-t-4 border-[#c8860a] mt-12 text-xs">
      <div className="max-w-site mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Introduction */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-lg font-bold text-white tracking-wide">
              NGŨ HÀNH<span className="text-[#c8860a]">.NET</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Bát Tự (Tứ Trụ) là một trong những phát minh quan trọng trong mệnh lý học truyền thống,
              được đúc kết qua hàng nghìn năm lịch sử. Hệ thống lý luận Bát Tự Manh Phái & Dịch Học
              hỗ trợ phân tích điểm vượng suy, ngũ hành khuyết thiếu để ứng dụng phong thủy cải vận bổ khuyết.
            </p>
            <div className="text-gray-400">
              <strong className="text-white">Cố vấn chuyên môn:</strong> Thầy Đoàn Gia
              <br />
              <strong className="text-white">Hotline tư vấn:</strong>{' '}
              <a href="tel:0916889131" className="text-[#c8860a] font-bold hover:underline">
                091.688.9131
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Chức năng chính
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/la-so-bat-tu" className="hover:text-[#c8860a] transition">
                  Lập lá số Bát Tự
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
                  Liên hệ hợp tác
                </Link>
              </li>
              <li>
                <Link href="/tim-kiem" className="hover:text-[#c8860a] transition">
                  Tìm kiếm nội dung
                </Link>
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
          © {new Date().getFullYear()} NGUHANH.NET — Bảo lưu mọi quyền. Độc lập phát triển.
        </div>
      </div>
    </footer>
  );
}
