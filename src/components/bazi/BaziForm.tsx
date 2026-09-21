'use client';

import React, { useState } from 'react';
import { BaziEnvelope } from '@/domain/bazi';
import { BaziChartResult } from './BaziChartResult';

interface BaziFormProps {
  initialValues?: {
    fullName?: string;
    gender?: boolean;
    day?: number;
    month?: number;
    year?: number;
    hour?: number;
    minute?: number;
    focusYear?: number;
    oneHundredYears?: boolean;
  };
  autoSubmit?: boolean;
}

export function BaziForm({ initialValues, autoSubmit }: BaziFormProps) {
  const [fullName, setFullName] = useState(initialValues?.fullName || 'NGUYỄN VĂN A');
  const [gender, setGender] = useState<boolean>(initialValues?.gender ?? true);
  const [day, setDay] = useState<number>(initialValues?.day || 15);
  const [month, setMonth] = useState<number>(initialValues?.month || 8);
  const [year, setYear] = useState<number>(initialValues?.year || 1990);
  const [hour, setHour] = useState<number>(initialValues?.hour || 10);
  const [minute, setMinute] = useState<number>(initialValues?.minute || 30);
  const [focusYear, setFocusYear] = useState<number>(initialValues?.focusYear || 2026);
  const [oneHundredYears, setOneHundredYears] = useState<boolean>(initialValues?.oneHundredYears ?? true);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BaziEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeCalculation = async (payload: {
    fullName: string;
    gender: boolean;
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    focusYear: number;
    oneHundredYears: boolean;
  }) => {
    setError(null);
    setLoading(true);
    setProgress(15);

    const timer = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + 25));
    }, 120);

    try {
      const res = await fetch('/api/bazi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearInterval(timer);
      setProgress(100);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi tính toán lá số');
      }

      setResult(data);
    } catch (err: any) {
      clearInterval(timer);
      setError(err.message || 'Có lỗi xảy ra trong quá trình tính toán');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (autoSubmit) {
      executeCalculation({
        fullName,
        gender,
        day,
        month,
        year,
        hour,
        minute,
        focusYear,
        oneHundredYears,
      });
    }
  }, [autoSubmit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeCalculation({
      fullName,
      gender,
      day,
      month,
      year,
      hour,
      minute,
      focusYear,
      oneHundredYears,
    });
  };

  const yearsRange = Array.from({ length: 157 }, (_, i) => 1900 + i);
  const focusYearsRange = Array.from({ length: 100 }, (_, i) => 1980 + i);

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#27303f] tracking-wide uppercase">
            Phong Thủy Cải Vận Bổ Khuyết Qua Bát Tự
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1 italic">
            ( Luận giải Hiện Tại — Tương Lai — Quá Khứ )
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* 100 Years Checkbox */}
          <div className="flex justify-center items-center space-x-2 py-1 bg-amber-50/60 rounded border border-amber-200/60">
            <input
              type="checkbox"
              id="oneHundredYears"
              checked={oneHundredYears}
              onChange={(e) => setOneHundredYears(e.target.checked)}
              className="w-4 h-4 text-[#c8860a] focus:ring-[#c8860a] rounded cursor-pointer"
            />
            <label htmlFor="oneHundredYears" className="font-bold text-gray-800 cursor-pointer text-xs select-none">
              Hiển thị 100 năm Đại Vận
            </label>
          </div>

          {/* Họ tên */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label className="font-semibold text-gray-700 md:text-right pr-2">Họ tên</label>
            <div className="md:col-span-3">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={128}
                placeholder="Nhập họ và tên..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#c8860a] focus:border-[#c8860a] text-sm"
              />
            </div>
          </div>

          {/* Giới tính */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label className="font-semibold text-gray-700 md:text-right pr-2">Giới tính</label>
            <div className="md:col-span-3 flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === true}
                  onChange={() => setGender(true)}
                  className="text-[#c8860a] focus:ring-[#c8860a]"
                />
                <span className="font-semibold text-gray-800">Nam</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === false}
                  onChange={() => setGender(false)}
                  className="text-[#c8860a] focus:ring-[#c8860a]"
                />
                <span className="font-semibold text-gray-800">Nữ</span>
              </label>
            </div>
          </div>

          {/* Ngày sinh */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label className="font-semibold text-gray-700 md:text-right pr-2">Ngày sinh</label>
            <div className="md:col-span-3 grid grid-cols-3 gap-2">
              <select
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-[#c8860a]"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d < 10 ? `0${d}` : d}
                  </option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-[#c8860a]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m < 10 ? `0${m}` : m}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-[#c8860a]"
              >
                {yearsRange.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Giờ sinh */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label className="font-semibold text-gray-700 md:text-right pr-2">Giờ sinh</label>
            <div className="md:col-span-3 grid grid-cols-3 gap-2">
              <select
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-[#c8860a]"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {h < 10 ? `0${h}` : h} giờ
                  </option>
                ))}
              </select>
              <select
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-[#c8860a]"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {m < 10 ? `0${m}` : m} phút
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-gray-500 flex items-center pl-1">
                Giờ Tý bắt đầu từ 23:00
              </div>
            </div>
          </div>

          {/* Năm tính (FocusYear) */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label className="font-semibold text-gray-700 md:text-right pr-2">Năm tính</label>
            <div className="md:col-span-3">
              <select
                value={focusYear}
                onChange={(e) => setFocusYear(parseInt(e.target.value, 10))}
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded bg-white focus:border-[#c8860a]"
              >
                {focusYearsRange.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress bar animation */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden my-3">
              <div
                className="bg-[#c8860a] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-3 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-2.5 rounded shadow uppercase tracking-wider text-sm transition transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Đang lập lá số...' : 'MỞ LÁ SỐ'}
            </button>
          </div>
        </form>
      </div>

      {/* Render Chart Result */}
      {result && <BaziChartResult envelope={result} />}
    </div>
  );
}
