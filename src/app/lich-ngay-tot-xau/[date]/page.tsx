import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  calculateAlmanacDay,
  AlmanacDaySummary,
  TRUC_NAMES,
} from '@/domain/almanac';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  Users,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ date: string }>;
}

export default async function NgayDetailRoute({ params }: PageProps) {
  const { date } = await params;

  // Validate date format YYYY-MM-DD
  const parts = date.split('-').map(Number);
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    notFound();
  }

  const [year, month, day] = parts;
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    notFound();
  }

  let dayInfo: AlmanacDaySummary;
  try {
    dayInfo = calculateAlmanacDay(year, month, day);
  } catch (e) {
    notFound();
  }

  // Calculate prev and next dates
  const curDate = new Date(year, month - 1, day);
  const prevDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
  const nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const prevDateStr = `${prevDate.getFullYear()}-${pad(prevDate.getMonth() + 1)}-${pad(prevDate.getDate())}`;
  const nextDateStr = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/lich-ngay-tot-xau"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-[#c8860a] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI LỊCH VẠN SỰ</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link
            href={`/lich-ngay-tot-xau/${prevDateStr}`}
            className="inline-flex items-center space-x-1 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded text-xs font-semibold text-gray-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ngày trước</span>
          </Link>
          <Link
            href={`/lich-ngay-tot-xau/${nextDateStr}`}
            className="inline-flex items-center space-x-1 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded text-xs font-semibold text-gray-700 transition"
          >
            <span>Ngày sau</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* SECTION 1: MAIN HERO BANNER - THÔNG TIN NGÀY */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 text-white rounded-lg p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full">
                {dayInfo.dayOfWeek}
              </span>
              <span
                className={`text-xs uppercase font-black px-3 py-1 rounded-full ${
                  dayInfo.dayQuality === 'TỐT'
                    ? 'bg-emerald-500 text-white'
                    : dayInfo.dayQuality === 'XẤU'
                    ? 'bg-red-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                NGÀY {dayInfo.dayQuality}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black">
              Ngày {pad(dayInfo.day)} Tháng {pad(dayInfo.month)} Năm {dayInfo.year}
            </h1>

            <p className="text-sm opacity-90">
              Âm lịch: Ngày <strong>{dayInfo.lunarDay}</strong> tháng <strong>{dayInfo.lunarMonth}</strong>
              {dayInfo.isLeapMonth ? ' (nhuận)' : ''} năm <strong>{dayInfo.lunarYear}</strong> ({dayInfo.canChiYear})
            </p>
          </div>

          {/* Quick Can Chi Pillar Display */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-lg text-center min-w-[200px]">
            <div className="text-xs opacity-80 uppercase tracking-wide">Can Chi Ngày</div>
            <div className="text-2xl font-black text-amber-200 mt-1">{dayInfo.canChiDay}</div>
            <div className="text-xs font-semibold mt-1 opacity-90">Tiết: {dayInfo.solarTerm}</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ĐÁNH GIÁ NGÀY & TRỰC */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-gray-900 uppercase flex items-center space-x-2 border-b pb-3">
          <Sparkles className="w-5 h-5 text-[#c8860a]" />
          <span>Đánh Giá Tổng Quan Ngày & Trực Thần</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-1.5">
            <span className="text-gray-500 block uppercase font-bold text-[11px]">Hoàng Đạo / Hắc Đạo:</span>
            <div className="flex items-center space-x-2">
              <span
                className={`font-black text-sm ${
                  dayInfo.isHoangDao ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {dayInfo.hoangDaoType}
              </span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                Thần {dayInfo.hoangDaoDeity}
              </span>
            </div>
            <p className="text-gray-600 text-[11px] pt-1">
              {dayInfo.isHoangDao
                ? 'Thần thiện hộ mệnh, trường khí tốt cho nhiều việc trọng đại.'
                : 'Thần sát canh giữ, nên thận trọng với các việc mạo hiểm.'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-1.5">
            <span className="text-gray-500 block uppercase font-bold text-[11px]">Thập Nhị Kiến Trừ:</span>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm text-gray-900">Trực {dayInfo.truc}</span>
              <span
                className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  dayInfo.trucQuality === 'Cát'
                    ? 'bg-emerald-100 text-emerald-800'
                    : dayInfo.trucQuality === 'Hung'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                Trực {dayInfo.trucQuality}
              </span>
            </div>
            <p className="text-gray-600 text-[11px] pt-1">
              Hệ thống 12 Trực phân định khí vận nhật can theo chu kỳ tháng âm lịch.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-1.5">
            <span className="text-gray-500 block uppercase font-bold text-[11px]">Ngày Kiêng Kỵ Dân Gian:</span>
            {dayInfo.specialDays.length > 0 ? (
              <div className="space-y-1">
                {dayInfo.specialDays.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2.5 py-0.5 bg-red-100 text-red-800 rounded font-bold text-xs"
                  >
                    Phạm {s}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-emerald-700 font-bold text-xs flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Không phạm ngày Tam Nương, Nguyệt Kỵ</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: GIỜ TỐT 12 THỜI THẦN */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base font-extrabold text-gray-900 uppercase flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#c8860a]" />
            <span>Bảng Giờ Hoàng Đạo / Hắc Đạo (12 Thời Thần)</span>
          </h2>
          <span className="text-xs font-bold text-gray-500">
            {dayInfo.goodHourBranches.length} Giờ Hoàng Đạo
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {dayInfo.zodiacHours.map((h) => (
            <div
              key={h.branch}
              className={`p-3 rounded-lg border text-xs space-y-1 transition ${
                h.isZodiac
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-gray-50/70 border-gray-200 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-gray-900">
                  Giờ {h.branch} ({h.canChi})
                </span>
                <span
                  className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                    h.isZodiac
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {h.isZodiac ? 'Hoàng Đạo' : 'Hắc Đạo'}
                </span>
              </div>

              <div className="text-gray-500 font-mono text-[11px]">{h.timeRange}</div>
              <div className="text-gray-700 font-medium">
                Thần: <strong className="text-gray-900">{h.deityName}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 & 5: VIỆC NÊN LÀM VÀ VIỆC NÊN TRÁNH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Việc nên làm */}
        <div className="bg-white border border-emerald-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h2 className="text-base font-extrabold text-emerald-900 uppercase flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Việc Nên Làm Trong Ngày</span>
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Khởi sự cát lợi
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {dayInfo.favorableActivities.map((act, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Việc nên tránh */}
        <div className="bg-white border border-red-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-red-100 pb-3">
            <h2 className="text-base font-extrabold text-red-900 uppercase flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Việc Nên Tránh / Kiêng Kỵ</span>
            </h2>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
              Hạn chế thực hiện
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {dayInfo.unfavorableActivities.map((act, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-red-950">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6 & 7: TUỔI HỢP / XUNG VÀ HƯỚNG XUẤT HÀNH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tuổi hợp / xung */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-gray-900 uppercase flex items-center space-x-2 border-b pb-3">
            <Users className="w-5 h-5 text-[#c8860a]" />
            <span>Xung Hợp Tuổi Trong Ngày</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="bg-emerald-50/60 p-3 rounded border border-emerald-100">
              <span className="font-bold text-emerald-900 block text-[11px] uppercase mb-1">
                Tuổi Hợp Với Ngày ({dayInfo.canChiDay}):
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-950 font-medium">
                {dayInfo.harmoniousAges.map((age, idx) => (
                  <li key={idx}>{age}</li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/60 p-3 rounded border border-red-100">
              <span className="font-bold text-red-900 block text-[11px] uppercase mb-1">
                Tuổi Xung Khắc (Nên đề phòng):
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-red-950 font-medium">
                {dayInfo.clashingAges.map((age, idx) => (
                  <li key={idx}>{age}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Hướng xuất hành */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-gray-900 uppercase flex items-center space-x-2 border-b pb-3">
            <Compass className="w-5 h-5 text-[#c8860a]" />
            <span>Hướng Xuất Hành Cát Lợi</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="bg-amber-50/60 p-3.5 rounded border border-amber-200/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 text-sm">Hỷ Thần (Cầu duyên, may mắn):</span>
                <span className="px-2.5 py-0.5 bg-[#c8860a] text-white rounded font-bold text-xs">
                  {dayInfo.departureDirections.hyThan}
                </span>
              </div>
              <p className="text-amber-900/80 text-[11px]">
                Xuất hành hướng này đón khí trường hoan hỷ, gắn kết nhân duyên và gặp gỡ quý nhân.
              </p>
            </div>

            <div className="bg-emerald-50/60 p-3.5 rounded border border-emerald-200/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 text-sm">Tài Thần (Cầu tài, làm ăn):</span>
                <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded font-bold text-xs">
                  {dayInfo.departureDirections.taiThan}
                </span>
              </div>
              <p className="text-emerald-900/80 text-[11px]">
                Xuất hành hướng này nạp vượng khí tài lộc, ký kết hợp đồng đại lợi, hanh thông thương mại.
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded border text-gray-600 text-[11px]">
              <span>Hạc Thần (Hướng hung cần tránh): </span>
              <strong className="text-gray-900">{dayInfo.departureDirections.hacThan}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Disclaimer */}
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-4 text-center text-xs text-amber-900/80 space-y-1">
        <p className="font-semibold">LƯU Ý TRUYỀN THỐNG</p>
        <p className="text-[11px] leading-relaxed">
          Thông tin cát hung và trực nhật được trích từ Hiệp Kỷ Biện Phương Thư và Ngọc Hạp Thông Thư. Gia chủ nên kết hợp chọn giờ hoàng đạo và hướng xuất hành phù hợp với bản mệnh để gia tăng cát khí.
        </p>
      </div>
    </div>
  );
}
