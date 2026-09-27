'use client';

import React, { useState } from 'react';
import { Loader2, Banknote, Calendar, Clock, User, HelpCircle } from 'lucide-react';

export interface SeriTienFormData {
  seriNumber: string;
  title: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  querentName?: string;
  isTietKhi: boolean;
}

interface SeriTienFormProps {
  onSubmit: (data: SeriTienFormData) => void;
  loading?: boolean;
  initialValues?: Partial<SeriTienFormData>;
}

function getMaxDayOfMonth(month: number, year: number): number {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 2:
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
}

export function SeriTienForm({ onSubmit, loading = false, initialValues }: SeriTienFormProps) {
  const now = new Date();

  const [seriNumber, setSeriNumber] = useState(initialValues?.seriNumber ?? '');
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [day, setDay] = useState(initialValues?.day ?? now.getDate());
  const [month, setMonth] = useState(initialValues?.month ?? now.getMonth() + 1);
  const [year, setYear] = useState(initialValues?.year ?? now.getFullYear());
  const [hour, setHour] = useState(initialValues?.hour ?? now.getHours());
  const [minute, setMinute] = useState(initialValues?.minute ?? now.getMinutes());
  const [querentName, setQuerentName] = useState(initialValues?.querentName ?? '');
  const [isTietKhi, setIsTietKhi] = useState(initialValues?.isTietKhi ?? true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    const maxDay = getMaxDayOfMonth(newMonth, year);
    if (day > maxDay) setDay(maxDay);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    const maxDay = getMaxDayOfMonth(month, newYear);
    if (day > maxDay) setDay(maxDay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const cleanSeri = seriNumber.replace(/\D/g, '');
    if (!cleanSeri) {
      newErrors.seriNumber = 'Vui lòng nhập dãy số seri trên tờ tiền (ít nhất 1 chữ số).';
    }

    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập việc cần xem (câu hỏi hoặc vấn đề cần dự đoán).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      seriNumber: seriNumber.trim(),
      title: title.trim(),
      day,
      month,
      year,
      hour,
      minute,
      querentName: querentName.trim() || undefined,
      isTietKhi,
    });
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const maxDay = getMaxDayOfMonth(month, year);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-[#c8860a]/30 rounded-xl shadow-md p-5 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-2 border-b border-gray-100 pb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-[#c8860a] mb-1">
          <Banknote className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#27303f] uppercase tracking-wide">
          Lập quẻ qua số seri tiền
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          ( Mai Hoa Dịch Số & Lục Hào Dự Trắc theo số Seri tờ tiền )
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-sm">
        {/* 1. Serial tiền */}
        <div className="space-y-1.5">
          <label htmlFor="SeriNumber" className="flex items-center space-x-1.5 font-bold text-gray-800">
            <Banknote className="w-4 h-4 text-[#c8860a]" />
            <span>Serial tiền</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            id="SeriNumber"
            name="SeriNumber"
            type="text"
            maxLength={32}
            value={seriNumber}
            onChange={(e) => {
              setSeriNumber(e.target.value);
              if (errors.seriNumber) setErrors((prev) => ({ ...prev, seriNumber: '' }));
            }}
            placeholder="Nhập dãy số seri trên tờ tiền (vd: AA12345678, 88888888)"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-medium focus:outline-hidden transition-colors ${
              errors.seriNumber
                ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                : 'border-gray-300 focus:border-[#c8860a] focus:ring-1 focus:ring-[#c8860a]'
            }`}
          />
          {errors.seriNumber ? (
            <p className="text-xs text-red-600 font-semibold">{errors.seriNumber}</p>
          ) : (
            <p className="text-xs text-gray-400">
              Có thể nhập cả chữ cái tiền tố (hệ thống sẽ tự động tách số để lập quẻ).
            </p>
          )}
        </div>

        {/* 2. Việc cần xem */}
        <div className="space-y-1.5">
          <label htmlFor="ViecCanXem" className="flex items-center space-x-1.5 font-bold text-gray-800">
            <HelpCircle className="w-4 h-4 text-[#c8860a]" />
            <span>Việc cần xem</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            id="ViecCanXem"
            name="ViecCanXem"
            type="text"
            maxLength={256}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            placeholder="Ví dụ: Công việc tháng này, đối tác làm ăn, tình duyên, v.v."
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-medium focus:outline-hidden transition-colors ${
              errors.title
                ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                : 'border-gray-300 focus:border-[#c8860a] focus:ring-1 focus:ring-[#c8860a]'
            }`}
          />
          {errors.title && <p className="text-xs text-red-600 font-semibold">{errors.title}</p>}
        </div>

        {/* 3. Ngày & Giờ lập quẻ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Ngày lập quẻ */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 font-bold text-gray-800">
              <Calendar className="w-4 h-4 text-[#c8860a]" />
              <span>Ngày lập quẻ</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <select
                id="NgayDL"
                name="NgayDL"
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value, 10))}
                className="px-2.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-hidden focus:border-[#c8860a]"
              >
                {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {pad(d)}
                  </option>
                ))}
              </select>

              <select
                id="ThangDL"
                name="ThangDL"
                value={month}
                onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
                className="px-2.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-hidden focus:border-[#c8860a]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {pad(m)}
                  </option>
                ))}
              </select>

              <select
                id="NamDL"
                name="NamDL"
                value={year}
                onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                className="px-2.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-hidden focus:border-[#c8860a]"
              >
                {Array.from({ length: 90 }, (_, i) => 1950 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Giờ lập quẻ */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 font-bold text-gray-800">
              <Clock className="w-4 h-4 text-[#c8860a]" />
              <span>Giờ lập quẻ</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                id="Gio"
                name="Gio"
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value, 10))}
                className="px-2.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-hidden focus:border-[#c8860a]"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {pad(h)} giờ
                  </option>
                ))}
              </select>

              <select
                id="Phut"
                name="Phut"
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                className="px-2.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-hidden focus:border-[#c8860a]"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {pad(m)} phút
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Người lập quẻ & Checkbox Tiết khí */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-1">
          <div className="space-y-1.5">
            <label htmlFor="NguoiLapQue" className="flex items-center space-x-1.5 font-bold text-gray-800">
              <User className="w-4 h-4 text-[#c8860a]" />
              <span>Người lập quẻ</span>
            </label>
            <input
              id="NguoiLapQue"
              name="NguoiLapQue"
              type="text"
              maxLength={40}
              value={querentName}
              onChange={(e) => setQuerentName(e.target.value)}
              placeholder="Không bắt buộc"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:border-[#c8860a]"
            />
          </div>

          <div className="flex items-center space-x-2 pt-4 md:pt-6">
            <input
              id="IsTietKhi"
              name="IsTietKhi"
              type="checkbox"
              checked={isTietKhi}
              onChange={(e) => setIsTietKhi(e.target.checked)}
              className="w-4 h-4 text-[#c8860a] border-gray-300 rounded focus:ring-[#c8860a]"
            />
            <label htmlFor="IsTietKhi" className="text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer select-none">
              Dùng lịch tiết khí để lập quẻ?
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-2/3 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#c8860a] to-[#a36806] hover:from-[#b57708] hover:to-[#8c5703] text-white font-extrabold py-3 px-6 rounded-lg text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lập quẻ...</span>
              </>
            ) : (
              <span>Lập quẻ</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
