'use client';

import React, { useState } from 'react';
import { SaoHanResult } from '@/domain/ziweidoushu';
import { Sparkles, Shield, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

export default function XemSaoHanPage() {
  const currentYear = new Date().getFullYear();
  const [birthYear, setBirthYear] = useState<number>(1990);
  const [gender, setGender] = useState<boolean>(true); // true = Nam, false = Nữ
  const [targetYear, setTargetYear] = useState<number>(currentYear);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SaoHanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/tuvi/saohan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthYear,
          gender,
          targetYear,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi tính toán sao hạn');
      }

      setResult(data.data);
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
          Tra Cứu Sao Chiếu Mệnh, Niên Hạn, Tam Tai & Kim Lâu
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Hệ thống tính toán chuẩn xác Cửu Diệu Niên Hạn, hạn Tam Tai, Kim Lâu và Hoang Ốc cho từng tuổi theo năm cần tra cứu.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs max-w-2xl mx-auto">
        <form onSubmit={handleCalculate} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Năm sinh (Dương lịch)</label>
              <input
                type="number"
                min={1920}
                max={2040}
                value={birthYear}
                onChange={(e) => setBirthYear(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-center text-sm focus:border-[#c8860a]"
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
                  <span className="text-xs font-medium">Nam</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={!gender}
                    onChange={() => setGender(false)}
                    className="text-[#c8860a]"
                  />
                  <span className="text-xs font-medium">Nữ</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Năm cần xem hạn</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white font-bold text-[#c8860a] text-sm"
              >
                {Array.from({ length: 30 }, (_, i) => 2020 + i).map((y) => (
                  <option key={y} value={y}>Năm {y}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          <div className="text-center pt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-2.5 rounded shadow uppercase tracking-wide text-xs transition disabled:opacity-50"
            >
              {loading ? 'Đang tra cứu...' : 'TRA CỨU SAO HẠN'}
            </button>
          </div>
        </form>
      </div>

      {/* Result Cards */}
      {result && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  Kết Quả Sao Hạn Năm {result.targetYear} ({result.targetYearCanChi})
                </span>
                <h2 className="text-xl md:text-2xl font-black mt-2">
                  Sinh năm {result.birthYear} • Tuổi mụ: {result.lunarAge} tuổi
                </h2>
              </div>
              <div className="text-left md:text-right">
                <div className="text-xs opacity-90">Sao chiếu mệnh:</div>
                <div className="text-2xl font-black text-amber-200">{result.cuuDieu.star}</div>
                <div className="text-xs font-semibold">({result.cuuDieu.nature})</div>
              </div>
            </div>
          </div>

          {/* Grid of 4 Major Hạn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Cửu Diệu */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#c8860a]" />
                  <span>Sao Chiếu Mệnh (Cửu Diệu)</span>
                </h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    result.cuuDieu.nature === 'Cát'
                      ? 'bg-emerald-100 text-emerald-800'
                      : result.cuuDieu.nature === 'Hung'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {result.cuuDieu.nature} Tinh
                </span>
              </div>
              <div className="text-base font-extrabold text-[#c8860a]">
                Sao {result.cuuDieu.star}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {result.cuuDieu.description}
              </p>
              <div className="bg-amber-50 p-3 rounded text-xs text-amber-900 border border-amber-200">
                <strong>Cách hóa giải/nghênh sao:</strong> {result.cuuDieu.remedy}
              </div>
            </div>

            {/* 2. Niên Hạn */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Niên Hạn Bản Mệnh</span>
                </h3>
              </div>
              <div className="text-base font-extrabold text-blue-800">
                Hạn {result.nienHan.name}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {result.nienHan.description}
              </p>
              <p className="text-xs text-gray-500 italic">
                Trong năm gặp hạn này, cần chú trọng sức khỏe, làm việc thiện tích phúc và giữ gìn an toàn khi đi xa.
              </p>
            </div>

            {/* 3. Tam Tai */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Hạn Tam Tai</span>
                </h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    result.tamTai.isTamTai ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {result.tamTai.isTamTai ? 'Phạm Tam Tai' : 'Không Phạm'}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                {result.tamTai.description}
              </p>
            </div>

            {/* 4. Kim Lâu & Hoang Ốc */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span>Kim Lâu & Hoang Ốc (Khởi Sự / Làm Nhà)</span>
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <strong>Kim Lâu: </strong>
                  <span className={result.kimLau.isKimLau ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {result.kimLau.description}
                  </span>
                </div>
                <div>
                  <strong>Hoang Ốc: </strong>
                  <span className={result.hoangOc.isGood ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                    Cung {result.hoangOc.palace} — {result.hoangOc.description}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
