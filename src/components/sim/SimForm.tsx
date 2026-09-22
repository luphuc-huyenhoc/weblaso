'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, User, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { SimCalculationResult } from '@/domain/sim';

interface SimFormProps {
  initialValues?: {
    phoneNumber?: string;
    fullName?: string;
    gender?: boolean;
    day?: number;
    month?: number;
    year?: number;
    hour?: number;
    minute?: number;
    calendarType?: 'solar' | 'lunar';
  };
  onResultCalculated: (result: SimCalculationResult) => void;
  autoSubmit?: boolean;
}

export function SimForm({ initialValues, onResultCalculated, autoSubmit }: SimFormProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialValues?.phoneNumber || '0826226888');
  const [fullName, setFullName] = useState(initialValues?.fullName || 'NGUYỄN VĂN A');
  const [gender, setGender] = useState<boolean>(initialValues?.gender ?? true);
  const [day, setDay] = useState<number>(initialValues?.day || 1);
  const [month, setMonth] = useState<number>(initialValues?.month || 11);
  const [year, setYear] = useState<number>(initialValues?.year || 1992);
  const [hour, setHour] = useState<number>(initialValues?.hour ?? 17);
  const [minute, setMinute] = useState<number>(initialValues?.minute ?? 0);
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>(initialValues?.calendarType || 'solar');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCalculation = async (payload: {
    phoneNumber: string;
    fullName: string;
    gender: boolean;
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    calendarType: 'solar' | 'lunar';
  }) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/sim/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Lỗi khi luận giải số sim');
      }

      onResultCalculated(json.data);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra trong quá trình tính toán');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoSubmit) {
      executeCalculation({
        phoneNumber,
        fullName,
        gender,
        day,
        month,
        year,
        hour,
        minute,
        calendarType,
      });
    }
  }, [autoSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCalculation({
      phoneNumber,
      fullName,
      gender,
      day,
      month,
      year,
      hour,
      minute,
      calendarType,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-[#27303f] uppercase tracking-wide">
          Bói Sim Phong Thủy Theo Kinh Dịch
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Luận quẻ Mai Hoa, phối hợp Bát Tự Tứ Trụ, Lạc Thư Cửu Tinh & Chiêm 4 số cuối
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Số điện thoại */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Số điện thoại cần xem <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ''))}
              required
              maxLength={12}
              placeholder="Ví dụ: 0826226888"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded font-mono text-base font-bold text-gray-800 focus:border-[#c8860a] focus:ring-1 focus:ring-[#c8860a]"
            />
          </div>
        </div>

        {/* Họ tên & Giới tính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Họ và tên người dùng
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#c8860a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Giới tính
            </label>
            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === true}
                  onChange={() => setGender(true)}
                  className="text-[#c8860a] focus:ring-[#c8860a]"
                />
                <span className="font-semibold text-gray-800 text-xs">Nam (Dương/Âm Nam)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === false}
                  onChange={() => setGender(false)}
                  className="text-[#c8860a] focus:ring-[#c8860a]"
                />
                <span className="font-semibold text-gray-800 text-xs">Nữ (Dương/Âm Nữ)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Ngày sinh */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700 uppercase">
              Ngày tháng năm sinh
            </label>
            <div className="flex items-center space-x-3 text-xs">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="calendarType"
                  checked={calendarType === 'solar'}
                  onChange={() => setCalendarType('solar')}
                  className="text-[#c8860a]"
                />
                <span>Dương lịch</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="calendarType"
                  checked={calendarType === 'lunar'}
                  onChange={() => setCalendarType('lunar')}
                  className="text-[#c8860a]"
                />
                <span>Âm lịch</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value, 10))}
              className="w-full px-2 py-2 border border-gray-300 rounded bg-white text-xs"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Ngày {d < 10 ? `0${d}` : d}
                </option>
              ))}
            </select>

            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="w-full px-2 py-2 border border-gray-300 rounded bg-white text-xs"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  Tháng {m < 10 ? `0${m}` : m}
                </option>
              ))}
            </select>

            <select
              id="year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              className="w-full px-2 py-2 border border-gray-300 rounded bg-white text-xs"
            >
              {Array.from({ length: 120 }, (_, i) => 1930 + i).map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Giờ sinh */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Giờ sinh
            </label>
            <select
              id="hour"
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value, 10))}
              className="w-full px-2 py-2 border border-gray-300 rounded bg-white text-xs"
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={h}>
                  {h < 10 ? `0${h}` : h} giờ
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Phút sinh
            </label>
            <select
              id="minute"
              value={minute}
              onChange={(e) => setMinute(parseInt(e.target.value, 10))}
              className="w-full px-2 py-2 border border-gray-300 rounded bg-white text-xs"
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>
                  {m < 10 ? `0${m}` : m} phút
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        {/* Submit button */}
        <div className="pt-2 text-center">
          <button
            id="btnSubmitSim"
            type="submit"
            disabled={loading}
            className="w-full md:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold text-sm rounded shadow uppercase tracking-wider transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang phân tích quẻ sim...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>TRA CỨU PHONG THỦY SIM</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
