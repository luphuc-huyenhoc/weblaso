'use client';

import React, { useState } from 'react';
import { ZiweiEnvelope } from '@/domain/ziweidoushu';
import { ZiweiChartResult } from '@/components/ziwei/ZiweiChartResult';
import { Sparkles, Loader2 } from 'lucide-react';

export default function TuViPage() {
  const [fullName, setFullName] = useState('NGUYỄN VĂN A');
  const [gender, setGender] = useState(true); // Nam = true, Nữ = false
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(8);
  const [year, setYear] = useState(1990);
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(30);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZiweiEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/tuvi/calculate', {
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
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi an sao lá số');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Lập Lá Số Tử Vi Đẩu Số Toàn Thư
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          An 12 cung, 14 chính tinh và hệ thống phụ tinh cát hung theo phương pháp cổ truyền. Phân tích Mệnh Thân và Cục chính xác.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-[#c8860a]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Giới tính</label>
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender}
                    onChange={() => setGender(true)}
                    className="text-[#c8860a]"
                  />
                  <span className="font-semibold text-gray-800 text-xs">Nam (Dương/Âm Nam)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={!gender}
                    onChange={() => setGender(false)}
                    className="text-[#c8860a]"
                  />
                  <span className="font-semibold text-gray-800 text-xs">Nữ (Dương/Âm Nữ)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Ngày sinh (DL)</label>
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
              <label className="block text-xs text-gray-600 mb-1">Tháng sinh (DL)</label>
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
                max={2050}
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

          <div className="text-center pt-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-bold px-8 py-2.5 rounded shadow uppercase tracking-wider text-xs transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang an sao lá số...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>LẬP LÁ SỐ TỬ VI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && <ZiweiChartResult envelope={result} />}
    </div>
  );
}
