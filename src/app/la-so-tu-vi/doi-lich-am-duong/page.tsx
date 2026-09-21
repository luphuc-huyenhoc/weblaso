'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, Calendar, Sparkles } from 'lucide-react';

export default function DoiLichAmDuongPage() {
  const now = new Date();
  const [mode, setMode] = useState<'solar-to-lunar' | 'lunar-to-solar'>('solar-to-lunar');
  const [day, setDay] = useState<number>(now.getDate());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [isLeapMonth, setIsLeapMonth] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [converted, setConverted] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/calendar/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mode,
          day,
          month,
          year,
          isLeapMonth,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi chuyển đổi lịch');
      }

      setConverted(data.data);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Chuyển Đổi Lịch Âm Dương Chuẩn Xác
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Thuật toán thiên văn Hồ Ngọc Đức tính toán chính xác chu kỳ trăng tròn và 24 tiết khí theo múi giờ Việt Nam (UTC+7).
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
              setConverted(null);
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
              setConverted(null);
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
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d < 10 ? `0${d}` : d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tháng</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>Tháng {m < 10 ? `0${m}` : m}</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm text-center font-bold focus:border-[#c8860a]"
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
                className="text-[#c8860a] focus:ring-[#c8860a] rounded cursor-pointer"
              />
              <label htmlFor="isLeapMonth" className="text-xs text-gray-700 cursor-pointer">
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
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-2.5 rounded shadow uppercase tracking-wider text-xs transition disabled:opacity-50"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{loading ? 'Đang chuyển đổi...' : 'CHUYỂN ĐỔI NGÀY'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {converted && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="border-b pb-3 text-center">
            <span className="text-xs font-bold text-gray-500 uppercase">Kết Quả Chuyển Đổi</span>
            <div className="text-2xl font-extrabold text-[#c8860a] mt-1">
              {mode === 'solar-to-lunar' ? (
                <>Ngày {converted.converted.lunarDay} Tháng {converted.converted.lunarMonth} Năm {converted.converted.lunarYear} (Âm Lịch)</>
              ) : (
                <>Ngày {converted.converted.solarDay} Tháng {converted.converted.solarMonth} Năm {converted.converted.solarYear} (Dương Lịch)</>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 block">Can Chi Ngày:</span>
              <strong className="text-gray-900 text-sm">{converted.converted.canChiDay}</strong>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 block">Can Chi Tháng:</span>
              <strong className="text-gray-900 text-sm">{converted.converted.canChiMonth}</strong>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 block">Can Chi Năm:</span>
              <strong className="text-gray-900 text-sm">{converted.converted.canChiYear}</strong>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-gray-500 block">Tiết Khí:</span>
              <strong className="text-[#c8860a] text-sm">{converted.converted.solarTerm}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
