'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
  title?: string;
}

export function BaziForm({
  initialValues,
  autoSubmit,
  title = 'Lập lá số Bát Tự',
}: BaziFormProps) {
  const [fullName, setFullName] = useState(initialValues?.fullName || 'NGUYỄN VĂN A');
  const [gender, setGender] = useState<boolean>(initialValues?.gender ?? true);
  const [day, setDay] = useState<number>(initialValues?.day || 15);
  const [month, setMonth] = useState<number>(initialValues?.month || 8);
  const [year, setYear] = useState<number>(initialValues?.year || 1990);
  const [hour, setHour] = useState<number>(initialValues?.hour || 10);
  const [minute, setMinute] = useState<number>(initialValues?.minute || 30);
  const [focusYear, setFocusYear] = useState<number>(initialValues?.focusYear || 2026);
  const [oneHundredYears, setOneHundredYears] = useState<boolean>(
    initialValues?.oneHundredYears ?? true
  );

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
      {/* Target Design Card matching ChatGPT Image Sep 22, 2026, 08_19_14 AM.png */}
      <div className="w-full max-w-[760px] mx-auto my-4 sm:my-6 px-2 sm:px-0">
        <div className="bg-[#3e2c1f] text-[#ede3d5] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(30,18,10,0.35)] border border-[#523c2d]/50 select-none">
          {/* Form Header / Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#fdf7f0] font-medium tracking-normal font-['Lora','Playfair_Display',Georgia,serif]">
              {title}
            </h2>
            <div className="w-16 h-[2.5px] bg-[#9e7d58] mx-auto mt-2.5 sm:mt-3 rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Row 1: Họ tên */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
              <label
                htmlFor="fullName"
                className="w-20 sm:w-28 text-left font-medium text-[#ede3d5] text-sm sm:text-base flex-shrink-0"
              >
                Họ tên
              </label>
              <div className="flex-1">
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={128}
                  placeholder="NGUYỄN VĂN A"
                  className="w-full h-11 sm:h-12 px-4 bg-[#f8f3ea] text-[#2c1b12] text-sm sm:text-base font-normal rounded-xl border border-[#ded3c2]/60 focus:outline-none focus:ring-2 focus:ring-[#d8a268] focus:bg-white transition placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Row 2: Ngày sinh */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
              <label
                htmlFor="day"
                className="w-20 sm:w-28 text-left font-medium text-[#ede3d5] text-sm sm:text-base flex-shrink-0"
              >
                Ngày sinh
              </label>
              <div className="flex-1 grid grid-cols-3 gap-2.5 sm:gap-3.5">
                {/* Day */}
                <div className="relative">
                  <select
                    id="day"
                    value={day}
                    onChange={(e) => setDay(parseInt(e.target.value, 10))}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-8 bg-[#f8f3ea] text-[#2c1b12] text-sm sm:text-base font-normal rounded-xl border border-[#ded3c2]/60 appearance-none focus:outline-none focus:ring-2 focus:ring-[#d8a268] focus:bg-white transition cursor-pointer"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d < 10 ? `0${d}` : d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#2c1b12] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                </div>

                {/* Month */}
                <div className="relative">
                  <select
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-8 bg-[#f8f3ea] text-[#2c1b12] text-sm sm:text-base font-normal rounded-xl border border-[#ded3c2]/60 appearance-none focus:outline-none focus:ring-2 focus:ring-[#d8a268] focus:bg-white transition cursor-pointer"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m < 10 ? `0${m}` : m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#2c1b12] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                </div>

                {/* Year */}
                <div className="relative">
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-8 bg-[#f8f3ea] text-[#2c1b12] text-sm sm:text-base font-normal rounded-xl border border-[#ded3c2]/60 appearance-none focus:outline-none focus:ring-2 focus:ring-[#d8a268] focus:bg-white transition cursor-pointer"
                  >
                    {yearsRange.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#2c1b12] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Row 3: Giờ sinh */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
              <label
                htmlFor="hour"
                className="w-20 sm:w-28 text-left font-medium text-[#ede3d5] text-sm sm:text-base flex-shrink-0"
              >
                Giờ sinh
              </label>
              <div className="flex-1 grid grid-cols-3 gap-2.5 sm:gap-3.5">
                {/* Hour */}
                <div className="relative">
                  <select
                    id="hour"
                    value={hour}
                    onChange={(e) => setHour(parseInt(e.target.value, 10))}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-8 bg-[#f8f3ea] text-[#2c1b12] text-sm sm:text-base font-normal rounded-xl border border-[#ded3c2]/60 appearance-none focus:outline-none focus:ring-2 focus:ring-[#d8a268] focus:bg-white transition cursor-pointer"
                  >
                    {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                      <option key={h} value={h}>
                        {h < 10 ? `0${h}` : h}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#2c1b12] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                </div>

                {/* Minute */}
                <div className="relative">
                  <select
                    id="minute"
                    value={minute}
                    onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-8 bg-[#f8f3ea] text-[#2c1b12] text-sm sm:text-base font-normal rounded-xl border border-[#ded3c2]/60 appearance-none focus:outline-none focus:ring-2 focus:ring-[#d8a268] focus:bg-white transition cursor-pointer"
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((min) => (
                      <option key={min} value={min}>
                        {min < 10 ? `0${min}` : min}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#2c1b12] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                </div>

                {/* 3rd Column Placeholder for alignment */}
                <div className="hidden sm:block" />
              </div>
            </div>

            {/* Row 4: Năm tính & Giới tính */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
              <label
                htmlFor="focusYear"
                className="w-20 sm:w-28 text-left font-medium text-[#ede3d5] text-sm sm:text-base flex-shrink-0"
              >
                Năm tính
              </label>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 items-center">
                {/* Column 1: Year select */}
                <div className="relative">
                  <select
                    id="focusYear"
                    value={focusYear}
                    onChange={(e) => setFocusYear(parseInt(e.target.value, 10))}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-8 bg-[#f8f3ea] text-[#2c1b12] text-sm sm:text-base font-normal rounded-xl border border-[#ded3c2]/60 appearance-none focus:outline-none focus:ring-2 focus:ring-[#d8a268] focus:bg-white transition cursor-pointer"
                  >
                    {focusYearsRange.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#2c1b12] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
                </div>

                {/* Columns 2 & 3: Giới tính & Styled Radio Buttons */}
                <div className="sm:col-span-2 flex items-center justify-start sm:justify-center sm:pl-4 space-x-5 sm:space-x-7 pt-1 sm:pt-0">
                  <span className="font-medium text-[#ede3d5] text-sm sm:text-base select-none">
                    Giới tính
                  </span>

                  {/* Radio Nam */}
                  <button
                    type="button"
                    onClick={() => setGender(true)}
                    className="flex items-center space-x-2 cursor-pointer group select-none focus:outline-none"
                  >
                    <span
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        gender === true
                          ? 'border-[#d8a268] bg-[#3e2c1f]'
                          : 'border-[#d8a268]/70 group-hover:border-[#d8a268]'
                      }`}
                    >
                      {gender === true && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d8a268]" />
                      )}
                    </span>
                    <span className="text-[#ede3d5] font-medium text-sm sm:text-base">
                      Nam
                    </span>
                  </button>

                  {/* Radio Nữ */}
                  <button
                    type="button"
                    onClick={() => setGender(false)}
                    className="flex items-center space-x-2 cursor-pointer group select-none focus:outline-none"
                  >
                    <span
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        gender === false
                          ? 'border-[#d8a268] bg-[#3e2c1f]'
                          : 'border-[#d8a268]/70 group-hover:border-[#d8a268]'
                      }`}
                    >
                      {gender === false && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d8a268]" />
                      )}
                    </span>
                    <span className="text-[#ede3d5] font-medium text-sm sm:text-base">
                      Nữ
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox option: 100 năm Đại Vận */}
            <div className="flex items-center justify-end pt-1">
              <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="oneHundredYears"
                  checked={oneHundredYears}
                  onChange={(e) => setOneHundredYears(e.target.checked)}
                  className="w-4 h-4 rounded border-[#ded3c2] text-[#d8a268] accent-[#d8a268] focus:ring-[#d8a268] cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-[#ede3d5]/85 hover:text-[#ede3d5] transition">
                  Hiển thị 100 năm Đại Vận
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/60 border border-red-500/50 text-red-200 text-xs sm:text-sm rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Submit Button "MỞ LÁ SỐ" */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-14 mt-6 sm:mt-7 bg-[#d8a268] hover:bg-[#e0ae76] active:bg-[#cf995e] text-[#342013] font-bold text-base sm:text-lg tracking-wider uppercase rounded-xl sm:rounded-2xl transition-all shadow-md active:scale-[0.995] flex items-center justify-center cursor-pointer select-none disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-[#342013] border-t-transparent rounded-full animate-spin" />
                  <span>ĐANG LẬP LÁ SỐ...</span>
                </div>
              ) : (
                'MỞ LÁ SỐ'
              )}
            </button>
          </form>

          {/* Progress Bar when loading */}
          {loading && (
            <div className="w-full bg-[#271a12] rounded-full h-2 overflow-hidden mt-4">
              <div
                className="bg-[#d8a268] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Helper Note under Button */}
          <p className="text-center text-[#c5b39e] italic text-xs sm:text-sm font-serif mt-3.5 sm:mt-4">
            Không nhớ phút sinh? Từ 01–30 chọn 30; từ 31–59 chọn 59.
          </p>
        </div>
      </div>

      {/* Render Chart Result */}
      {result && <BaziChartResult envelope={result} />}
    </div>
  );
}
