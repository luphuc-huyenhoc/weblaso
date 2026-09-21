'use client';

import React, { useState } from 'react';
import { BaziEnvelope } from '@/domain/bazi';
import { Sparkles, Calendar, ArrowRight, Shield, AlertCircle } from 'lucide-react';

export default function XemThoiVanPage() {
  const [fullName, setFullName] = useState('NGUYỄN VĂN A');
  const [gender, setGender] = useState<boolean>(true);
  const [day, setDay] = useState<number>(15);
  const [month, setMonth] = useState<number>(8);
  const [year, setYear] = useState<number>(1990);
  const [hour, setHour] = useState<number>(10);
  const [minute, setMinute] = useState<number>(30);
  const [focusYear, setFocusYear] = useState<number>(new Date().getFullYear());

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BaziEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bazi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          gender,
          day,
          month,
          year,
          hour,
          minute,
          focusYear,
          oneHundredYears: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi tính toán thời vận');
      }
      setResult(data);
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
          Xem Thời Vận & Lưu Niên Bát Tự
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Phân tích chi tiết Đại Vận 10 năm và Lưu Niên từng năm. Dự báo cơ hội thăng tiến, tài lộc, sức khỏe và các biến động cần phòng ngừa.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Họ tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#c8860a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Giới tính</label>
              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender}
                    onChange={() => setGender(true)}
                    className="text-[#c8860a]"
                  />
                  <span>Nam</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={!gender}
                    onChange={() => setGender(false)}
                    className="text-[#c8860a]"
                  />
                  <span>Nữ</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Năm cần xem thời vận</label>
              <select
                value={focusYear}
                onChange={(e) => setFocusYear(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white font-bold text-[#c8860a]"
              >
                {Array.from({ length: 30 }, (_, i) => 2020 + i).map((y) => (
                  <option key={y} value={y}>Năm {y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Ngày sinh</label>
              <select
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value, 10))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-xs"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tháng sinh</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-xs"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Năm sinh</label>
              <input
                type="number"
                min={1920}
                max={2040}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-xs text-center"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Giờ sinh</label>
              <select
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value, 10))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-xs"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>{h} giờ</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Phút sinh</label>
              <select
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-xs"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>{m} phút</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c8860a] hover:bg-amber-700 text-white font-bold px-8 py-2.5 rounded shadow uppercase tracking-wide text-xs transition disabled:opacity-50"
            >
              {loading ? 'Đang tính toán thời vận...' : 'XEM VẬN HẠN CHI TIẾT'}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-6">
          {/* Overview Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded">
                  Tổng Quan Thời Vận Năm {focusYear}
                </span>
                <h2 className="text-2xl font-bold mt-2">
                  {result.calculation.personal.fullName} — {result.calculation.pillars.day.stem} {result.calculation.pillars.day.branch}
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  Mệnh chủ: <strong className="underline">{result.calculation.dayMaster.element}</strong> ({result.calculation.dayMaster.strength}) • Dụng Thần: <strong>{result.interpretation.dungThan}</strong> • Hỷ Thần: <strong>{result.interpretation.hyThan}</strong>
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">Khởi Vận:</div>
                <div className="text-xl font-extrabold">{result.calculation.majorLuck.startAgeYears} tuổi {result.calculation.majorLuck.startAgeMonths} tháng</div>
                <div className="text-xs opacity-80">Hướng hành: {result.calculation.majorLuck.direction}</div>
              </div>
            </div>
          </div>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Lưu Niên Năm {focusYear}</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Năm {focusYear} mang năng lượng tương tác trực tiếp với Nhật Chủ ({result.calculation.dayMaster.stem}). Phối hợp với Dụng Thần <strong>{result.interpretation.dungThan}</strong> để nắm bắt thời cơ thuận lợi.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2 mb-3">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Phương Pháp Bổ Trợ</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tăng cường năng lượng hành <strong>{result.interpretation.dungThan}</strong> bằng vật phẩm phong thủy, màu sắc y phục và phương vị cát lành để hóa giải xung sát trong năm.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>Lưu Ý Cẩn Trọng</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tránh xa các hành Kỵ Thần <strong>{result.interpretation.kyThan}</strong>. Cẩn trọng giấy tờ, quan hệ hợp tác và bảo vệ sức khỏe vào các tháng xung khắc chi mệnh.
              </p>
            </div>
          </div>

          {/* 10-Year Major Luck Timeline Table */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
            <h3 className="font-bold text-gray-900 text-sm uppercase mb-4">
              Bảng Tiến Trình Đại Vận Suốt Đời
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 font-bold text-gray-700">
                    <th className="p-2 border">Đại Vận</th>
                    <th className="p-2 border">Can Chi</th>
                    <th className="p-2 border">Độ Tuổi</th>
                    <th className="p-2 border">Thập Thần</th>
                  </tr>
                </thead>
                <tbody>
                  {result.calculation.majorLuck.pillars.map((pillar, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 border">{idx + 1}</td>
                      <td className="p-2 border font-bold">{pillar.stem} {pillar.branch}</td>
                      <td className="p-2 border">{pillar.startAge} - {pillar.endAge} tuổi</td>
                      <td className="p-2 border">{pillar.tenGod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
