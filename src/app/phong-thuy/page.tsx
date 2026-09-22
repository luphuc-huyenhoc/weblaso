import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ShieldCheck,
  Home,
  ArrowRight,
  BookOpen,
  Sparkles,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Wind,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function PhongThuyHubPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-white to-amber-50/40 border border-amber-200/80 rounded-2xl p-6 md:p-10 shadow-sm text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#c8860a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center space-x-1.5 text-xs uppercase font-extrabold tracking-widest px-3.5 py-1 bg-amber-100 text-[#8c451a] border border-amber-300 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#c8860a]" />
            <span>Kho Tàng Phong Thủy Dương Trạch Cổ Truyền</span>
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
            Phong Thủy Bát Trạch & Huyền Không Phi Tinh
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Hệ thống tra cứu quái mệnh, phân kim 24 sơn hướng, luận giải Cửu Cung Phi Tinh Vận 9 (2024 - 2043)
            và cẩm nang kiến thiết dương trạch vượng tài đắc khí.
          </p>
        </div>
      </div>

      {/* Primary Tool Navigation Cards */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-1">
          <Compass className="w-5 h-5 text-[#c8860a]" />
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
            Công Cụ Tra Cứu Trọng Tâm
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#c8860a] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#c8860a] transition-colors">
                Xem Hướng Nhà Bát Trạch
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tính toán Cung Phi Bát Tự theo năm sinh & giới tính, phân nhóm Đông/Tây Tứ Mệnh và bảng 8 hướng cát hung chính xác cho gia chủ.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/phong-thuy/bat-trach"
                className="w-full inline-flex items-center justify-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wide transition shadow-2xs"
              >
                <span>Tra cứu hướng nhà</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Bát Trạch Cho 8 Cung
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Khảo cứu đồ hình chi tiết cho từng trạch mệnh: Càn, Khôn, Khảm, Ly, Cấn, Đoài, Tốn, Chấn. Hướng dẫn vị trí Môn, Táo, Chủ, Thờ.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/phong-thuy/bat-trach-cho-8-cung"
                className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wide transition shadow-2xs"
              >
                <span>Xem chi tiết 8 cung</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                24 Sơn Hướng & Phi Tinh
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                La bàn 360° chuẩn xác từng độ số, kiểm tra tuyến Đại / Tiểu Không Vong và kết xuất Tinh Bàn Huyền Không Phi Tinh Vận 1 - Vận 9.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/phong-thuy/bat-trach-24-son-huong"
                className="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wide transition shadow-2xs"
              >
                <span>Phân kim & Phi tinh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Knowledge Handbook Section */}
      <div className="space-y-8 pt-4">
        <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-[#c8860a]" />
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase">
              Cẩm Nang Tri Thức Phong Thủy Thực Hành
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">
            Tài liệu tham khảo chuyên sâu
          </span>
        </div>

        {/* Section 1: Bát Trạch Minh Cảnh */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-[#8c451a] font-black text-sm flex items-center justify-center flex-shrink-0">
              01
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Bát Trạch Minh Cảnh & 8 Du Niên Cát Hung
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Nguyên lý phối cung Quái Mệnh của người với Cung Tọa Hướng của ngôi nhà
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-xs md:text-sm space-y-4">
            <p>
              Trường phái <strong>Bát Trạch Minh Cảnh</strong> phân chia con người và nhà ở thành 2 nhóm lớn:{' '}
              <strong className="text-blue-800">Đông Tứ Trạch / Đông Tứ Mệnh</strong> (gồm Khảm - Thủy, Chấn - Mộc, Tốn - Mộc, Ly - Hỏa) và{' '}
              <strong className="text-amber-800">Tây Tứ Trạch / Tây Tứ Mệnh</strong> (gồm Càn - Kim, Khôn - Thổ, Cấn - Thổ, Đoài - Kim).
              Người thuộc nhóm nào ở nhà thuộc nhóm trạch đó thì khí trường tương phối, đắc sinh khí dồi dào.
            </p>

            {/* 4 Cát Tinh Table */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-gray-900 flex items-center space-x-1.5 text-xs md:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bốn Hướng Cát (Tứ Cát Khí)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex justify-between">
                    <span>1. Sinh Khí (Tham Lang Mộc)</span>
                    <span className="text-[11px] bg-emerald-200/80 px-1.5 rounded">Đại Cát</span>
                  </div>
                  <p className="text-gray-600 leading-normal">
                    Chủ về vượng tài lộc, công danh hiển đạt, quan lộc thăng tiến, sinh sôi nảy nở. Thích hợp nhất đặt cửa chính, phòng khách, phòng làm việc.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex justify-between">
                    <span>2. Thiên Y (Cự Môn Thổ)</span>
                    <span className="text-[11px] bg-emerald-200/80 px-1.5 rounded">Thượng Cát</span>
                  </div>
                  <p className="text-gray-600 leading-normal">
                    Chủ về sức khỏe dồi dào, tiêu trừ bệnh tật, có quý nhân tương trợ, tâm tính an nhiên. Rất tốt để đặt giường ngủ gia chủ hoặc phòng người ốm.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex justify-between">
                    <span>3. Diên Niên (Vũ Khúc Kim)</span>
                    <span className="text-[11px] bg-emerald-200/80 px-1.5 rounded">Thứ Cát</span>
                  </div>
                  <p className="text-gray-600 leading-normal">
                    Chủ về gia đạo thuận hòa, tình cảm vợ chồng son sắt, các mối quan hệ xã giao bền chặt. Phù hợp cho cửa lớn, phòng sinh hoạt gia đình.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex justify-between">
                    <span>4. Phục Vị (Tả Phụ Mộc)</span>
                    <span className="text-[11px] bg-emerald-200/80 px-1.5 rounded">Tiểu Cát</span>
                  </div>
                  <p className="text-gray-600 leading-normal">
                    Chủ về sự bình ổn, thanh tịnh, củng cố sức mạnh nội tâm, thi cử đỗ đạt, học hành thông tuệ. Vị trí tuyệt vời nhất để an vị bàn thờ, thư phòng.
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Hung Tinh Table */}
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-gray-900 flex items-center space-x-1.5 text-xs md:text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Bốn Hướng Hung (Tứ Hung Khí)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg space-y-1">
                  <div className="font-bold text-red-900 flex justify-between">
                    <span>1. Tuyệt Mệnh (Phá Quân Kim)</span>
                    <span className="text-[11px] bg-red-200/80 px-1.5 rounded">Đại Hung</span>
                  </div>
                  <p className="text-gray-600 leading-normal">
                    Hung tinh hung hại nhất, chủ về tổn hao nhân đinh, bệnh tật nan y, phá sản, tai họa bất ngờ. Tuyệt đối không mở cửa chính hay đặt giường ngủ.
                  </p>
                </div>

                <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg space-y-1">
                  <div className="font-bold text-red-900 flex justify-between">
                    <span>2. Ngũ Quỷ (Liêm Trinh Hỏa)</span>
                    <span className="text-[11px] bg-red-200/80 px-1.5 rounded">Thượng Hung</span>
                  </div>
                  <p className="text-gray-600 leading-normal">
                    Chủ về thị phi tranh chấp, khẩu thiệt, hỏa hoạn, mất trộm, tiểu nhân mưu hại. Thường dùng vị trí này để đặt bếp nhằm thiêu đốt xú khí hung tinh.
                  </p>
                </div>

                <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg space-y-1">
                  <div className="font-bold text-red-900 flex justify-between">
                    <span>3. Lục Sát (Văn Khúc Thủy)</span>
                    <span className="text-[11px] bg-red-200/80 px-1.5 rounded">Thứ Hung</span>
                  </div>
                  <p className="text-gray-600 leading-normal">
                    Chủ về bất hòa, chuyện tình duyên trắc trở, kiện tụng quan tai, hao tài tốn của. Nên tránh mở cổng chính hay đặt bàn làm việc.
                  </p>
                </div>

                <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg space-y-1">
                  <div className="font-bold text-red-900 flex justify-between">
                    <span>4. Họa Hại (Lộc Tồn Thổ)</span>
                    <span className="text-[11px] bg-red-200/80 px-1.5 rounded">Tiểu Hung</span>
                  </div>
                  <p className="text-gray-600 leading-normal">
                    Chủ về việc không may, hao tài vặt vãnh, kiện tụng lặt vặt, làm nhiều hưởng ít, tinh thần dễ mỏi mệt bất an.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Huyền Không Phi Tinh Vận 9 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 font-black text-sm flex items-center justify-center flex-shrink-0">
              02
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Huyền Không Phi Tinh & Hạ Nguyên Vận 9 (2024 - 2043)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Sự dịch chuyển của Cửu Tinh theo trục thời gian Tam Nguyên Cửu Vận và địa hình Loan Đầu
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-xs md:text-sm space-y-4">
            <p>
              Khác với Bát Trạch mang tính cố định theo tuổi, <strong>Huyền Không Phi Tinh</strong> tính toán sự phối hợp giữa{' '}
              <strong>Thời Gian</strong> (Vận của vũ trụ), <strong>Không Gian</strong> (Tọa và Hướng ngôi nhà theo độ số thực) và{' '}
              <strong>Loan Đầu</strong> (Núi non, sông ngòi, đường sá, nhà cao tầng xung quanh).
            </p>

            <div className="p-4 bg-amber-50/60 border border-amber-300 rounded-lg space-y-2">
              <div className="font-bold text-[#8c451a] flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>Đặc Tính Trọng Điểm Của Vận 9 (2024 – 2043):</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1 text-xs">
                <li>
                  <strong>Sao cai quản:</strong> Sao số 9 (<strong>Cửu Tử Hữu Bật Hỏa Tinh</strong>) nhập trung cung quản lệnh 20 năm.
                </li>
                <li>
                  <strong>Vượng Khí Đương Thời:</strong> Sao 9 là Đương Vận Vượng Tinh. Nơi nào có Sơn tinh hoặc Hướng tinh 9 ngự trị là nơi vượng phát nhất.
                </li>
                <li>
                  <strong>Sinh Khí Tương Lai:</strong> Sao 1 (<strong>Nhất Bạch Tham Lang Thủy</strong> - Vận 1 tương lai) là Sinh Khí cát lợi kế tiếp.
                </li>
                <li>
                  <strong>Thoái Khí & Sát Khí:</strong> Sao 8 (Bát Bạch) đã bước sang thoái khí. Sao 2 (Nhị Hắc - Bệnh Phù) và Sao 5 (Ngũ Hoàng - Đại Sát) là hai sát tinh hung hãn nhất cần phải hóa giải triệt để bằng ngũ hành Kim (chuông gió đồng, hồ lô đồng).
                </li>
              </ul>
            </div>

            {/* 4 Architectural Layouts */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-gray-900 text-xs md:text-sm">
                Bốn Đại Cách Cục Kiến Trúc Kinh Điển Trong Huyền Không:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
                  <span className="font-bold text-emerald-800">1. Vượng Sơn Vượng Hướng</span>
                  <p className="text-gray-600">
                    Sơn tinh vượng đáo tọa (phía sau), Hướng tinh vượng đáo hướng (phía trước). Đinh tài lưỡng đắc: Người đinh mạnh khỏe, danh vọng gia tăng, kinh tế phát đạt vượt bậc.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
                  <span className="font-bold text-blue-800">2. Song Tinh Hội Hướng</span>
                  <p className="text-gray-600">
                    Cả Sơn tinh và Hướng tinh đương vận cùng đóng tại phương Hướng. Vượng tài phát lộc, kinh doanh buôn bán thuận lợi; cần có khoảng thoáng thủy trước mặt và vật cao phía xa để bảo toàn nhân đinh.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
                  <span className="font-bold text-amber-800">3. Song Tinh Hội Tọa</span>
                  <p className="text-gray-600">
                    Cả Sơn tinh và Hướng tinh đương vận cùng quy tụ về phương Tọa (sau nhà). Chủ về vượng nhân khẩu, con cháu hiếu thuận đỗ đạt, gia đạo an khang nhưng cần nỗ lực hơn về mặt tích lũy tài chính.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
                  <span className="font-bold text-red-800">4. Thượng Sơn Hạ Thủy</span>
                  <p className="text-gray-600">
                    Sơn tinh vượng lại rơi ra phía trước (xuống nước), Hướng tinh vượng lại rơi về phía sau (lên núi). Đinh tài lưỡng bại; nếu địa thế thực tế là "phía trước cao lồi, phía sau trũng thấp" thì lại chuyển hung thành đại cát.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: 24 Sơn Hướng & Tuyến Không Vong */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 font-black text-sm flex items-center justify-center flex-shrink-0">
              03
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Phân Kim 24 Sơn Hướng & Bí Quyết Tránh Tuyến Không Vong
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Đo đạc la bàn chuẩn xác từng 15 độ và loại trừ các tuyến khí hỗn tạp, xung sát
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-xs md:text-sm space-y-3">
            <p>
              Vòng tròn 360 độ được chia làm 8 cung quái, mỗi cung 45 độ gồm 3 sơn vị (mỗi sơn chiếm chính xác 15 độ), tạo thành <strong>24 Sơn Hướng</strong> gồm: 8 Thiên Can (Giáp, Ất, Bính, Đinh, Canh, Tân, Nhâm, Quý), 12 Địa Chi (Tý đến Hợi) và 4 Cung Càn, Khôn, Cấn, Tốn.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-red-50/70 border border-red-200 rounded-lg space-y-2">
                <span className="font-bold text-red-900 text-xs md:text-sm flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Tuyến Đại Không Vong (Cực Kỳ Nguy Hiểm)</span>
                </span>
                <p className="text-xs text-gray-700 leading-normal">
                  Là vạch ranh giới nằm chính giữa 2 Cung Quái lân cận (ví dụ ranh giới giữa cung Khảm và Cấn tại <strong>22.5°</strong>, giữa Cấn và Chấn tại <strong>67.5°</strong>...).
                  Khí trường tại vạch này bị cắt đứt và giao thoa hỗn loạn. Nhà xây trúng tuyến Đại Không Vong dễ khiến gia đạo lục đục, tinh thần hoang mang, sự nghiệp suy sụp không rõ nguyên do.
                </p>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
                <span className="font-bold text-amber-900 text-xs md:text-sm flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Tuyến Tiểu Không Vong (Sai Lệch Nội Bộ)</span>
                </span>
                <p className="text-xs text-gray-700 leading-normal">
                  Là vạch ranh giới giữa 2 Sơn trong cùng một Cung (ví dụ giữa sơn Nhâm và Tý tại <strong>352.5°</strong>, giữa Tý và Quý tại <strong>7.5°</strong>).
                  Tuy không nguy hại bằng Đại Không Vong nhưng âm dương tương tạp, tài lộc trồi sụt bất thường, công việc hay gặp trắc trở phút chót.
                </p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              💡 <strong>Lời khuyên thực chiến:</strong> Khi phân kim đặt hướng cổng, cửa hay tâm nhà, nên chọn độ số rơi vào khoảng giữa của mỗi sơn (từ 4.5° đến 10.5° của sơn đó) gọi là <strong>Chính Châm</strong> để nạp khí thuần nhất, tinh khôi.
            </div>
          </div>
        </div>

        {/* Section 4: Tam Yếu Dương Trạch */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center flex-shrink-0">
              04
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Bố Cục "Tam Yếu Dương Trạch": Môn – Táo – Chủ
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Các quy tắc bất biến trong sắp đặt không gian sống theo phong thủy thực chứng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#8c451a] flex items-center justify-center font-bold">
                Môn
              </div>
              <h4 className="font-bold text-gray-900">Cửa Chính (Khí Khẩu)</h4>
              <p className="text-xs text-gray-600 leading-normal">
                Là nơi đón toàn bộ sinh khí nuôi dưỡng cả ngôi nhà. Cửa chính bắt buộc phải mở ở cung vị Cát (Sinh Khí, Diên Niên) hoặc phương vị có Hướng tinh đắc lệnh (sao 9 trong Vận 9). Tránh đối xung trực diện với cửa hậu ("xuyên đường sát") hoặc cửa nhà vệ sinh.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                Táo
              </div>
              <h4 className="font-bold text-gray-900">Bếp Nấu (Hỏa Khí)</h4>
              <p className="text-xs text-gray-600 leading-normal">
                Áp dụng nghiêm ngặt nguyên lý <strong>"Tọa Hung Hướng Cát"</strong>: Đặt thân bếp đè lên cung hung (Tuyệt Mệnh, Ngũ Quỷ, Lục Sát) để hỏa thiêu đốt hung tinh, và hướng miệng bếp (núm bật bếp) quay về cung cát (Sinh Khí, Thiên Y) để hấp thu tài lộc.
              </p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                Chủ
              </div>
              <h4 className="font-bold text-gray-900">Phòng Ngủ Gia Chủ</h4>
              <p className="text-xs text-gray-600 leading-normal">
                Nơi con người nghỉ ngơi hồi phục nguyên khí suốt 1/3 cuộc đời. Giường ngủ nên đặt tại cung Thiên Y, Diên Niên, đầu giường tựa vào tường vững chãi ("tọa thực"), tránh dầm ngang ép đỉnh ("áp đao sát") và không đặt gương soi chiếu thẳng vào giường.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
