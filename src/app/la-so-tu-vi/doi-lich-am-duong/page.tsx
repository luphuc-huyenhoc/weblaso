'use client';

import React, { useState, useTransition } from 'react';
import { ArrowLeftRight, Calendar, Sparkles, CheckCircle2, Clock, Compass, ShieldAlert } from 'lucide-react';
import { solarToLunar, lunarToSolar, gregorianToJdn, jdnToGregorian } from '@/domain/calendar';
import { calculateAlmanacDay } from '@/domain/almanac';
import { getNapAmFromYear } from '@/domain/astrology/sao-han';

export default function DoiLichAmDuongPage() {
  const now = new Date();
  const [mode, setMode] = useState<'solar-to-lunar' | 'lunar-to-solar'>('solar-to-lunar');
  const [day, setDay] = useState<number>(now.getDate());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [isLeapMonth, setIsLeapMonth] = useState<boolean>(false);

  const [convertedResult, setConvertedResult] = useState<any>(() => {
    // Initial calculation for today
    const almanac = calculateAlmanacDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const napAm = getNapAmFromYear(almanac.lunarYear);
    return {
      inputMode: 'solar-to-lunar',
      solar: { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() },
      lunar: {
        day: almanac.lunarDay,
        month: almanac.lunarMonth,
        year: almanac.lunarYear,
        isLeap: almanac.isLeapMonth,
      },
      almanac,
      napAm,
    };
  });

  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(() => {
      try {
        if (mode === 'solar-to-lunar') {
          // Validate solar date
          const dateObj = new Date(year, month - 1, day);
          if (
            dateObj.getFullYear() !== year ||
            dateObj.getMonth() !== month - 1 ||
            dateObj.getDate() !== day
          ) {
            setError('Ngày dương lịch không hợp lệ.');
            return;
          }

          const almanac = calculateAlmanacDay(year, month, day);
          const napAm = getNapAmFromYear(almanac.lunarYear);

          setConvertedResult({
            inputMode: 'solar-to-lunar',
            solar: { day, month, year },
            lunar: {
              day: almanac.lunarDay,
              month: almanac.lunarMonth,
              year: almanac.lunarYear,
              isLeap: almanac.isLeapMonth,
            },
            almanac,
            napAm,
          });
        } else {
          // Lunar to solar
          const solar = lunarToSolar(year, month, day, isLeapMonth);
          const almanac = calculateAlmanacDay(solar.year, solar.month, solar.day);
          const napAm = getNapAmFromYear(year);

          setConvertedResult({
            inputMode: 'lunar-to-solar',
            solar,
            lunar: {
              day,
              month,
              year,
              isLeap: isLeapMonth,
            },
            almanac,
            napAm,
          });
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi khi chuyển đổi lịch. Vui lòng kiểm tra lại ngày tháng.');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <span className="text-[11px] uppercase font-bold tracking-widest px-3 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
          Thiên Văn & Lịch Pháp Việt Nam
        </span>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-wide mt-3">
          Chuyển Đổi Lịch Âm Dương Chuẩn Xác
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-2xl mx-auto">
          Thuật toán thiên văn Hồ Ngọc Đức tính toán chu kỳ tuần trăng và 24 tiết khí theo múi giờ chuẩn Việt Nam (UTC+7), hỗ trợ chính xác các năm nhuận âm lịch.
        </p>
      </div>

      {/* Mode Switch & Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
        {/* Toggle Mode */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden p-1 bg-gray-50">
          <button
            type="button"
            onClick={() => {
              setMode('solar-to-lunar');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition ${
              mode === 'solar-to-lunar'
                ? 'bg-[#c8860a] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dương Lịch → Âm Lịch
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('lunar-to-solar');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition ${
              mode === 'lunar-to-solar'
                ? 'bg-[#c8860a] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Âm Lịch → Dương Lịch
          </button>
        </div>

        <form onSubmit={handleConvert} className="space-y-4 text-sm">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ngày</label>
              <select
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a] focus:ring-1 focus:ring-[#c8860a]"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d < 10 ? `0${d}` : d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tháng</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a] focus:ring-1 focus:ring-[#c8860a]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m < 10 ? `0${m}` : m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Năm</label>
              <input
                type="number"
                min={1900}
                max={2100}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm text-center font-bold focus:border-[#c8860a] focus:ring-1 focus:ring-[#c8860a]"
              />
            </div>
          </div>

          {mode === 'lunar-to-solar' && (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="isLeapMonth"
                checked={isLeapMonth}
                onChange={(e) => setIsLeapMonth(e.target.checked)}
                className="text-[#c8860a] focus:ring-[#c8860a] rounded cursor-pointer h-4 w-4"
              />
              <label htmlFor="isLeapMonth" className="text-xs text-gray-700 cursor-pointer font-medium">
                Đây là tháng nhuận âm lịch
              </label>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-2.5 rounded shadow uppercase tracking-wider text-xs transition active:scale-98"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>CHUYỂN ĐỔI NGÀY</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {convertedResult && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Main Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs space-y-6">
            <div className="border-b border-gray-200 pb-4 text-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Kết Quả Chuyển Đổi {convertedResult.inputMode === 'solar-to-lunar' ? 'Dương sang Âm' : 'Âm sang Dương'}
              </span>
              <div className="mt-3 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                <div className="text-sm font-semibold text-gray-600">
                  Dương Lịch:{' '}
                  <strong className="text-gray-900 text-base">
                    {convertedResult.solar.day < 10 ? `0${convertedResult.solar.day}` : convertedResult.solar.day}/
                    {convertedResult.solar.month < 10 ? `0${convertedResult.solar.month}` : convertedResult.solar.month}/
                    {convertedResult.solar.year}
                  </strong>
                </div>
                <span className="text-amber-500 font-bold hidden md:inline">⇄</span>
                <div className="text-sm font-semibold text-gray-600">
                  Âm Lịch:{' '}
                  <strong className="text-[#c8860a] text-lg">
                    Ngày {convertedResult.lunar.day} tháng {convertedResult.lunar.month}
                    {convertedResult.lunar.isLeap ? ' (nhuận)' : ''} năm {convertedResult.lunar.year}
                  </strong>
                </div>
              </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-gray-50 border border-gray-100 p-3 rounded">
                <span className="text-gray-500 block text-[11px]">Can Chi Ngày</span>
                <strong className="text-gray-900 text-sm">{convertedResult.almanac.canChiDay}</strong>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded">
                <span className="text-gray-500 block text-[11px]">Can Chi Tháng</span>
                <strong className="text-gray-900 text-sm">{convertedResult.almanac.canChiMonth}</strong>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3 rounded">
                <span className="text-gray-500 block text-[11px]">Can Chi Năm</span>
                <strong className="text-gray-900 text-sm">{convertedResult.almanac.canChiYear}</strong>
              </div>
              <div className="bg-amber-50/60 border border-amber-200/60 p-3 rounded">
                <span className="text-amber-800 block text-[11px]">Nạp Âm Bản Mệnh</span>
                <strong className="text-[#c8860a] text-sm">{convertedResult.napAm?.napAm || '---'}</strong>
              </div>
            </div>

            {/* Almanac Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t text-xs">
              <div className="space-y-1">
                <span className="text-gray-500 block">Tiết Khí:</span>
                <strong className="text-[#c8860a] text-sm">{convertedResult.almanac.solarTerm}</strong>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Trực & Hoàng/Hắc Đạo:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900 text-sm">Trực {convertedResult.almanac.truc}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      convertedResult.almanac.isHoangDao
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {convertedResult.almanac.hoangDaoType} ({convertedResult.almanac.hoangDaoDeity})
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Hướng Xuất Hành Cát Lợi:</span>
                <div className="text-gray-800 text-xs space-y-0.5">
                  <div>Hỷ Thần: <strong>{convertedResult.almanac.departureDirections.hyThan}</strong></div>
                  <div>Tài Thần: <strong>{convertedResult.almanac.departureDirections.taiThan}</strong></div>
                </div>
              </div>
            </div>

            {/* Zodiac Hours */}
            <div className="border-t pt-4">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                Giờ Hoàng Đạo trong ngày:
              </span>
              <div className="flex flex-wrap gap-2">
                {convertedResult.almanac.zodiacHours
                  .filter((h: any) => h.isZodiac)
                  .map((h: any) => (
                    <span
                      key={h.branch}
                      className="px-2.5 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded text-xs font-semibold"
                    >
                      {h.canChi} ({h.timeRange}) - {h.deityName}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Traditional Disclaimer */}
          <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-4 text-center text-xs text-amber-900/80 space-y-1">
            <p className="font-semibold">LƯU Ý TRUYỀN THỐNG</p>
            <p className="text-[11px] leading-relaxed">
              Thông tin lịch âm dương và phân định trực giờ được trích xuất dựa trên thuật toán thiên văn cổ truyền Việt Nam. Quý độc giả sử dụng cho việc tham khảo khởi tạo công việc, xuất hành và tế lễ.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
