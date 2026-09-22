'use client';

import React, { useState } from 'react';
import { calculateSaoHanDetailed, SaoHanDetailedResult } from '@/domain/astrology/sao-han';
import { getCanChiYear } from '@/domain/calendar';
import { Sparkles, Shield, AlertTriangle, CheckCircle2, Star, Flame, Home, HeartHandshake, Loader2, Calendar } from 'lucide-react';

export default function XemSaoHanPage() {
  const currentYear = new Date().getFullYear();
  const [fullName, setFullName] = useState<string>('');
  const [gender, setGender] = useState<boolean>(true); // true = Nam, false = Nữ
  const [birthDay, setBirthDay] = useState<number>(15);
  const [birthMonth, setBirthMonth] = useState<number>(8);
  const [birthYear, setBirthYear] = useState<number>(1990);
  const [isLunar, setIsLunar] = useState<boolean>(false); // false = Dương lịch, true = Âm lịch
  const [targetYear, setTargetYear] = useState<number>(currentYear);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SaoHanDetailedResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = calculateSaoHanDetailed({
        fullName: fullName.trim() || undefined,
        gender,
        birthDay,
        birthMonth,
        birthYear,
        isLunar,
        targetYear,
      });
      setResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-3 sm:px-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-wide">
          Tra Cứu Sao Chiếu Mệnh & Niên Hạn
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Tính toán chuẩn xác Cửu Diệu Niên Hạn, Hạn Bát Kế, Tam Tai, Kim Lâu và Hoang Ốc theo tuổi mụ và giới tính từng năm.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-7 shadow-xs">
        <form onSubmit={handleCalculate} className="space-y-4 text-xs sm:text-sm max-w-2xl mx-auto">
          {/* Họ tên (optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Họ và tên (Tùy chọn)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên gia chủ..."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-[#c8860a]"
            />
          </div>

          {/* Giới tính & Lịch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Giới tính
              </label>
              <div className="flex items-center space-x-6 pt-1">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender}
                    onChange={() => setGender(true)}
                    className="text-[#c8860a] focus:ring-[#c8860a]"
                  />
                  <span className="font-semibold text-gray-800">Nam mệnh</span>
                </label>
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={!gender}
                    onChange={() => setGender(false)}
                    className="text-[#c8860a] focus:ring-[#c8860a]"
                  />
                  <span className="font-semibold text-gray-800">Nữ mệnh</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Loại lịch ngày sinh
              </label>
              <div className="flex items-center space-x-6 pt-1">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calendarType"
                    checked={!isLunar}
                    onChange={() => setIsLunar(false)}
                    className="text-[#c8860a] focus:ring-[#c8860a]"
                  />
                  <span className="font-semibold text-gray-800">Dương lịch</span>
                </label>
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="calendarType"
                    checked={isLunar}
                    onChange={() => setIsLunar(true)}
                    className="text-[#c8860a] focus:ring-[#c8860a]"
                  />
                  <span className="font-semibold text-gray-800">Âm lịch</span>
                </label>
              </div>
            </div>
          </div>

          {/* Ngày / Tháng / Năm sinh */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Ngày sinh ({isLunar ? 'Âm lịch' : 'Dương lịch'})
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(parseInt(e.target.value, 10))}
                className="w-full px-2.5 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-[#c8860a]"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Ngày {d < 10 ? `0${d}` : d}
                  </option>
                ))}
              </select>

              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(parseInt(e.target.value, 10))}
                className="w-full px-2.5 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-[#c8860a]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m < 10 ? `0${m}` : m}
                  </option>
                ))}
              </select>

              <select
                value={birthYear}
                onChange={(e) => setBirthYear(parseInt(e.target.value, 10))}
                className="w-full px-2.5 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-[#c8860a]"
              >
                {Array.from({ length: 121 }, (_, i) => 1920 + i).map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Năm xem sao hạn */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Năm muốn xem sao hạn
            </label>
            <select
              value={targetYear}
              onChange={(e) => setTargetYear(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white font-bold text-gray-900 focus:outline-none focus:border-[#c8860a]"
            >
              {Array.from({ length: 25 }, (_, i) => currentYear - 5 + i).map((y) => (
                <option key={y} value={y}>
                  Năm {y} ({getCanChiYear(y)})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-w-[200px] px-8 py-3 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm rounded shadow transition duration-150 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tính sao hạn...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>XEM SAO HẠN</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Card 1: Tổng quan bản mệnh */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-4">
            <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin bản mệnh</span>
                <h3 className="text-lg sm:text-xl font-black text-[#034687] uppercase">
                  {result.fullName} — {result.genderLabel} MỆNH
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">Năm xem:</span>{' '}
                <strong className="text-amber-800 text-sm font-black">
                  {result.targetYear} ({result.targetYearCanChi})
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-amber-50/50 border border-amber-200/60 p-3 rounded">
                <span className="text-gray-500 block">Năm sinh:</span>
                <strong className="text-sm text-gray-900">{result.birthYearCanChi} ({result.birthYear})</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200/60 p-3 rounded">
                <span className="text-gray-500 block">Mệnh nạp âm:</span>
                <strong className="text-sm text-amber-900">{result.menhNapAm}</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200/60 p-3 rounded">
                <span className="text-gray-500 block">Tuổi thực (Dương):</span>
                <strong className="text-sm text-gray-900">{result.solarAge} tuổi</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-200/60 p-3 rounded">
                <span className="text-gray-500 block">Tuổi âm (Tuổi mụ):</span>
                <strong className="text-sm text-red-600 font-black">{result.lunarAge} tuổi</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Sao Chiếu Mệnh (Cửu Diệu) */}
          <div className="bg-white border-2 border-amber-400 rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-[#c8860a]" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 uppercase">
                  Sao Chiếu Mệnh Năm {result.targetYear}:{' '}
                  <span className="text-[#034687] text-xl font-black">{result.cuuDieu.star}</span>
                </h3>
              </div>
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                  result.cuuDieu.nature === 'Cát'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : result.cuuDieu.nature === 'Hung'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {result.cuuDieu.nature} Tinh ({result.cuuDieu.element})
              </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {result.cuuDieu.description}
            </p>

            {/* Bài thơ Cửu Diệu */}
            <div className="bg-amber-50/60 border-l-4 border-amber-500 p-3.5 rounded-r text-xs text-amber-950 font-serif whitespace-pre-line leading-relaxed italic">
              {result.cuuDieu.poem}
            </div>

            {/* Phương pháp cúng sao giải hạn */}
            <div className="bg-blue-50/40 border border-blue-200 p-4 rounded text-xs space-y-1">
              <div className="font-bold text-[#034687] uppercase">Phương thức nghênh / dâng sao:</div>
              <div className="text-gray-700 leading-relaxed">{result.cuuDieu.remedy}</div>
            </div>
          </div>

          {/* Card 3: Niên Hạn & Đại Hạn (Tam Tai, Kim Lâu, Hoang Ốc) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Niên Hạn */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 border-b pb-2">
                <Flame className="w-4 h-4 text-orange-600" />
                <h4 className="font-bold text-gray-900 uppercase text-sm">
                  Hạn Trong Năm: <span className="text-red-700 font-black">{result.nienHan.name}</span>
                </h4>
              </div>
              <div className="text-xs text-red-600 font-semibold">{result.nienHan.impact}</div>
              <p className="text-xs text-gray-600 leading-relaxed">{result.nienHan.description}</p>
            </div>

            {/* Tam Tai */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-gray-900 uppercase text-sm">Hạn Tam Tai</h4>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  result.tamTai.isTamTai ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {result.tamTai.isTamTai ? `Phạm Tam Tai (Năm ${result.tamTai.yearIndex})` : 'Không phạm'}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{result.tamTai.description}</p>
            </div>

            {/* Kim Lâu */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-2">
                  <HeartHandshake className="w-4 h-4 text-purple-600" />
                  <h4 className="font-bold text-gray-900 uppercase text-sm">Hạn Kim Lâu (Cưới gả)</h4>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  result.kimLau.isKimLau ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {result.kimLau.isKimLau ? `Phạm (${result.kimLau.type})` : 'Không phạm'}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{result.kimLau.description}</p>
            </div>

            {/* Hoang Ốc */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-gray-900 uppercase text-sm">Hạn Hoang Ốc (Làm nhà)</h4>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  result.hoangOc.isGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  Cung {result.hoangOc.palace} ({result.hoangOc.isGood ? 'Cát' : 'Hung'})
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{result.hoangOc.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center pt-4">
        <p className="text-[11px] text-gray-500 italic max-w-xl mx-auto leading-relaxed">
          Thông tin được cung cấp với mục đích tham khảo theo hệ thống lịch pháp và phong thủy truyền thống.
          Các trường phái khác nhau có thể có cách luận giải khác nhau.
        </p>
      </div>
    </div>
  );
}
