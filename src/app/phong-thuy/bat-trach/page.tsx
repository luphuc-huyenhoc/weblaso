'use client';

import React, { useState } from 'react';
import { BatTrachVisualizer } from '@/components/fengshui/BatTrachVisualizer';
import { Compass, Loader2 } from 'lucide-react';

export default function BatTrachPage() {
  const [birthYear, setBirthYear] = useState<number>(1990);
  const [gender, setGender] = useState<boolean>(true); // true = Nam, false = Nữ
  const [degree, setDegree] = useState<number>(180);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/fengshui/battrach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthYear,
          gender,
          degree,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi tính Bát Trạch');
      }

      setResult(data.data);
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
          Tra Cứu Hướng Nhà Phong Thủy Bát Trạch
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Xác định chính xác Cung Phi, Quái Mệnh theo năm sinh và giới tính. Đánh giá chi tiết 8 hướng cát hung và phân kim 24 sơn hướng.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs max-w-2xl mx-auto">
        <form onSubmit={handleCalculate} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Năm sinh</label>
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hướng nhà (Số độ)</label>
              <input
                type="number"
                min={0}
                max={360}
                step={0.5}
                value={degree}
                onChange={(e) => setDegree(parseFloat(e.target.value) || 0)}
                placeholder="Ví dụ: 180"
                className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-center text-sm focus:border-[#c8860a]"
              />
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
              className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-2.5 rounded shadow uppercase tracking-wider text-xs transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tính toán...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>TRA CỨU BÁT TRẠCH</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && <BatTrachVisualizer result={result} />}
    </div>
  );
}
