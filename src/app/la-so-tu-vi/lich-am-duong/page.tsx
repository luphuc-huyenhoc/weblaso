'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Clock,
  Compass,
  X,
} from 'lucide-react';
import { calculateAlmanacDay, AlmanacDaySummary } from '@/domain/almanac';

export default function LichAmDuongPage() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [selectedDaySummary, setSelectedDaySummary] = useState<AlmanacDaySummary | null>(null);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDaySummary(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDaySummary(null);
  };

  const handleGoToday = () => {
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    const todaySummary = calculateAlmanacDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
    setSelectedDaySummary(todaySummary);
  };

  // Build calendar matrix
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Chủ Nhật, 1 = Thứ Hai...
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const daysArray: Array<AlmanacDaySummary | null> = [];

  // Pad preceding empty slots
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }

  // Populate days
  for (let d = 1; d <= daysInMonth; d++) {
    const summary = calculateAlmanacDay(currentYear, currentMonth, d);
    daysArray.push(summary);
  }

  const weekDayHeaders = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-3 sm:px-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-wide">
            Lịch Âm Dương & Vạn Niên
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tra cứu đối chiếu dương lịch - âm lịch, can chi năm/tháng/ngày và giờ hoàng đạo Việt Nam.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGoToday}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded border border-gray-300 transition flex items-center space-x-1 cursor-pointer"
            title="Về ngày hôm nay"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#c8860a]" />
            <span>Hôm nay</span>
          </button>

          <button
            onClick={handlePrevMonth}
            className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer"
            title="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>

          {/* Quick Month & Year Select */}
          <div className="flex items-center space-x-1 font-bold text-sm text-[#034687]">
            <select
              value={currentMonth}
              onChange={(e) => {
                setCurrentMonth(parseInt(e.target.value, 10));
                setSelectedDaySummary(null);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm bg-white font-bold text-amber-900 focus:outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  Tháng {m < 10 ? `0${m}` : m}
                </option>
              ))}
            </select>

            <select
              value={currentYear}
              onChange={(e) => {
                setCurrentYear(parseInt(e.target.value, 10));
                setSelectedDaySummary(null);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm bg-white font-bold text-amber-900 focus:outline-none"
            >
              {Array.from({ length: 151 }, (_, i) => 1920 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer"
            title="Tháng sau"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-amber-50/70 border-b border-amber-200 text-center py-2.5 text-xs font-bold text-gray-700">
          {weekDayHeaders.map((w, idx) => (
            <div key={w} className={idx === 0 ? 'text-red-600' : ''}>
              {w}
            </div>
          ))}
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 border-collapse">
          {daysArray.map((item, idx) => {
            if (!item) {
              return <div key={idx} className="border border-gray-100 p-1.5 min-h-[85px] bg-gray-50/40" />;
            }

            const isToday =
              item.day === now.getDate() &&
              currentMonth === now.getMonth() + 1 &&
              currentYear === now.getFullYear();

            const isSunday = idx % 7 === 0;
            const isSelected = selectedDaySummary?.solarDateStr === item.solarDateStr;

            return (
              <div
                key={idx}
                onClick={() => setSelectedDaySummary(item)}
                className={`border border-gray-100 p-2 min-h-[85px] flex flex-col justify-between transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-amber-100/70 ring-2 ring-[#c8860a] z-10'
                    : isToday
                    ? 'bg-amber-50/70 ring-1 ring-amber-400'
                    : 'bg-white hover:bg-amber-50/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-black text-sm md:text-base ${
                      isToday
                        ? 'text-[#c8860a]'
                        : isSunday
                        ? 'text-red-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {item.day}
                  </span>

                  <span
                    className={`text-[11px] font-bold ${
                      item.lunarDay === 1 || item.lunarDay === 15
                        ? 'text-red-600 font-black underline'
                        : 'text-gray-500'
                    }`}
                  >
                    {item.lunarDay === 1
                      ? `${item.lunarDay}/${item.lunarMonth}`
                      : item.lunarDay}
                  </span>
                </div>

                <div className="mt-1 flex flex-col space-y-0.5">
                  <span className="text-[10px] text-gray-500 truncate">{item.canChiDay}</span>
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-[9px] font-semibold px-1 rounded ${
                        item.isHoangDao ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.hoangDaoType}
                    </span>
                    <span className="text-[9px] text-gray-400">Trực {item.truc}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail Panel */}
      {selectedDaySummary && (
        <div className="bg-[#fefdf9] border-2 border-amber-300 rounded-lg p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-start justify-between border-b border-amber-200/80 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Chi tiết ngày
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#034687]">
                {selectedDaySummary.dayOfWeek}, Ngày {selectedDaySummary.day} Tháng {selectedDaySummary.month} Năm {selectedDaySummary.year}
              </h3>
            </div>

            <button
              onClick={() => setSelectedDaySummary(null)}
              className="p-1 text-gray-400 hover:text-gray-700 transition"
              title="Đóng chi tiết"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white border border-gray-200 p-3 rounded">
              <span className="text-gray-500 block">Âm lịch:</span>
              <strong className="text-sm text-red-600">
                Ngày {selectedDaySummary.lunarDay} Tháng {selectedDaySummary.lunarMonth} Năm {selectedDaySummary.lunarYear}
              </strong>
            </div>

            <div className="bg-white border border-gray-200 p-3 rounded">
              <span className="text-gray-500 block">Can Chi Ngày:</span>
              <strong className="text-sm text-gray-900">{selectedDaySummary.canChiDay}</strong>
            </div>

            <div className="bg-white border border-gray-200 p-3 rounded">
              <span className="text-gray-500 block">Can Chi Tháng / Năm:</span>
              <strong className="text-sm text-gray-900">
                {selectedDaySummary.canChiMonth} · {selectedDaySummary.canChiYear}
              </strong>
            </div>

            <div className="bg-white border border-gray-200 p-3 rounded">
              <span className="text-gray-500 block">Đánh giá ngày:</span>
              <strong className={`text-sm ${
                selectedDaySummary.dayQuality === 'TỐT'
                  ? 'text-green-700'
                  : selectedDaySummary.dayQuality === 'XẤU'
                  ? 'text-red-700'
                  : 'text-amber-700'
              }`}>
                {selectedDaySummary.hoangDaoType} ({selectedDaySummary.hoangDaoDeity})
              </strong>
            </div>
          </div>

          {/* Giờ Hoàng Đạo & Hắc Đạo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-50/50 border border-emerald-200 p-3.5 rounded space-y-1.5">
              <div className="font-bold text-emerald-900 uppercase flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Giờ Hoàng Đạo (Giờ tốt)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedDaySummary.zodiacHours
                  .filter((h) => h.isZodiac)
                  .map((h) => (
                    <span
                      key={h.branch}
                      className="px-2 py-1 bg-white border border-emerald-300 rounded font-semibold text-emerald-950"
                    >
                      {h.branch} ({h.timeRange})
                    </span>
                  ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3.5 rounded space-y-1.5">
              <div className="font-bold text-gray-700 uppercase flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Giờ Hắc Đạo</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedDaySummary.zodiacHours
                  .filter((h) => !h.isZodiac)
                  .map((h) => (
                    <span
                      key={h.branch}
                      className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600"
                    >
                      {h.branch} ({h.timeRange})
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Hướng xuất hành & Link to detailed analysis */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-gray-600 flex items-center space-x-3">
              <Compass className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Hỷ Thần: <strong>{selectedDaySummary.departureDirections.hyThan}</strong> · Tài Thần:{' '}
                <strong>{selectedDaySummary.departureDirections.taiThan}</strong>
              </span>
            </div>

            <Link
              href={`/lich-ngay-tot-xau/${selectedDaySummary.solarDateStr}`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#034687] hover:bg-[#023363] text-white text-xs font-bold rounded shadow transition"
            >
              <span>Xem chi tiết ngày tốt xấu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-gray-500 italic max-w-xl mx-auto leading-relaxed">
          Thông tin được cung cấp với mục đích tham khảo theo hệ thống lịch pháp và phong thủy truyền thống.
          Các trường phái khác nhau có thể có cách luận giải khác nhau.
        </p>
      </div>
    </div>
  );
}
