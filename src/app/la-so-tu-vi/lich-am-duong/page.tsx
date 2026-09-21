'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { solarToLunar, gregorianToJdn, getCanChiDay, getSolarTerm } from '@/domain/calendar';

export default function LichAmDuongPage() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Build calendar matrix
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const daysArray: Array<{ solarDay: number; lunarDay: number; lunarMonth: number; canChiDay: string } | null> = [];
  
  // Pad preceding empty slots
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }

  // Populate days
  for (let d = 1; d <= daysInMonth; d++) {
    const lunar = solarToLunar(currentYear, currentMonth, d);
    const jdn = gregorianToJdn(currentYear, currentMonth, d);
    const canChi = getCanChiDay(jdn);
    daysArray.push({
      solarDay: d,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      canChiDay: canChi,
    });
  }

  const weekDayHeaders = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase">
            Lịch Vạn Niên & Lịch Âm Dương
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tra cứu ngày tốt xấu, hoàng đạo hắc đạo và tiết khí thiên văn Việt Nam.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-base font-extrabold text-[#c8860a] min-w-[140px] text-center">
            Tháng {currentMonth} / {currentYear}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
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
              return <div key={idx} className="border border-gray-100 p-2 min-h-[90px] bg-gray-50/40" />;
            }

            const isToday =
              item.solarDay === now.getDate() &&
              currentMonth === now.getMonth() + 1 &&
              currentYear === now.getFullYear();

            const isSunday = idx % 7 === 0;

            return (
              <div
                key={idx}
                className={`border border-gray-100 p-2 min-h-[90px] flex flex-col justify-between transition hover:bg-amber-50/30 ${
                  isToday ? 'bg-amber-50/70 ring-1 ring-[#c8860a]' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-extrabold text-sm md:text-base ${
                      isToday
                        ? 'text-[#c8860a]'
                        : isSunday
                        ? 'text-red-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {item.solarDay}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      item.lunarDay === 1 || item.lunarDay === 15
                        ? 'text-red-600 font-extrabold underline'
                        : 'text-gray-500'
                    }`}
                  >
                    {item.lunarDay === 1
                      ? `${item.lunarDay}/${item.lunarMonth}`
                      : item.lunarDay}
                  </span>
                </div>

                <div className="text-[10px] text-gray-400 truncate mt-2">
                  {item.canChiDay}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
