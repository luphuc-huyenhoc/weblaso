'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const DIA_CHI_THANG = [
  'Dần (Tháng Giêng)', 'Mão (Tháng Hai)', 'Thìn (Tháng Ba)', 'Tỵ (Tháng Tư)',
  'Ngọ (Tháng Năm)', 'Mùi (Tháng Sáu)', 'Thân (Tháng Bảy)', 'Dậu (Tháng Tám)',
  'Tuất (Tháng Chín)', 'Hợi (Tháng Mười)', 'Tý (Tháng Mười Một)', 'Sửu (Tháng Chạp)'
];

interface MatchItem {
  solarDateStr: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  viewUrlMale: string;
  viewUrlFemale: string;
}

export default function TimNgaySinhTheoTuTruPage() {
  const [canNam, setCanNam] = useState<number>(7); // Canh
  const [chiNam, setChiNam] = useState<number>(7); // Ngọ
  const [chiThang, setChiThang] = useState<number>(7); // Thân (tháng 7)
  const [canNgay, setCanNgay] = useState<number>(1); // Giáp
  const [chiNgay, setChiNgay] = useState<number>(1); // Tý
  const [chiGio, setChiGio] = useState<number>(7); // Ngọ
  const [startYear, setStartYear] = useState<number>(1950);
  const [endYear, setEndYear] = useState<number>(2030);

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<MatchItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch('/api/bazi/reverse-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thienCanYear: canNam,
          diaChiYear: chiNam,
          diaChiMonth: chiThang,
          thienCanDay: canNgay,
          diaChiDay: chiNgay,
          diaChiHour: chiGio,
          startYear,
          endYear,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi tìm kiếm ngày sinh');
      }

      setResults(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Tìm Ngày Sinh Theo Tứ Trụ Bát Tự
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Tra cứu ngược ngày giờ sinh Dương lịch chính xác từ tổ hợp Can Chi của Năm, Tháng, Ngày và Giờ sinh.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trụ Năm */}
            <div className="border border-amber-200 rounded-lg p-4 bg-amber-50/40">
              <h3 className="font-bold text-amber-900 text-sm mb-3">1. Trụ Năm (Thiên Can & Địa Chi)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Thiên Can Năm</label>
                  <select
                    value={canNam}
                    onChange={(e) => setCanNam(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
                  >
                    {THIEN_CAN.map((can, idx) => (
                      <option key={can} value={idx + 1}>{can}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Địa Chi Năm</label>
                  <select
                    value={chiNam}
                    onChange={(e) => setChiNam(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
                  >
                    {DIA_CHI.map((chi, idx) => (
                      <option key={chi} value={idx + 1}>{chi}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Trụ Tháng */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/40">
              <h3 className="font-bold text-blue-900 text-sm mb-3">2. Trụ Tháng (Địa Chi Tháng)</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Địa Chi Tháng (Tiết Khí)</label>
                <select
                  value={chiThang}
                  onChange={(e) => setChiThang(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
                >
                  {DIA_CHI_THANG.map((chi, idx) => (
                    <option key={chi} value={idx + 1}>{chi}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trụ Ngày */}
            <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/40">
              <h3 className="font-bold text-emerald-900 text-sm mb-3">3. Trụ Ngày (Thiên Can & Địa Chi)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Thiên Can Ngày</label>
                  <select
                    value={canNgay}
                    onChange={(e) => setCanNgay(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
                  >
                    {THIEN_CAN.map((can, idx) => (
                      <option key={can} value={idx + 1}>{can}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Địa Chi Ngày</label>
                  <select
                    value={chiNgay}
                    onChange={(e) => setChiNgay(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
                  >
                    {DIA_CHI.map((chi, idx) => (
                      <option key={chi} value={idx + 1}>{chi}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Trụ Giờ */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/40">
              <h3 className="font-bold text-purple-900 text-sm mb-3">4. Trụ Giờ (Địa Chi Giờ)</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Địa Chi Giờ Sinh</label>
                <select
                  value={chiGio}
                  onChange={(e) => setChiGio(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
                >
                  {DIA_CHI.map((chi, idx) => (
                    <option key={chi} value={idx + 1}>Giờ {chi}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Phạm vi năm tìm kiếm */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <span className="font-semibold text-gray-700">Giới hạn khoảng năm tra cứu:</span>
            <div className="flex items-center space-x-3">
              <span className="text-gray-500">Từ năm:</span>
              <input
                type="number"
                min={1900}
                max={2050}
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded bg-white text-center font-bold"
              />
              <span className="text-gray-500">Đến năm:</span>
              <input
                type="number"
                min={1900}
                max={2100}
                value={endYear}
                onChange={(e) => setEndYear(parseInt(e.target.value, 10))}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded bg-white text-center font-bold"
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
              className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-bold px-8 py-3 rounded uppercase tracking-wider text-sm transition shadow disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tìm kiếm...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>TÌM KIẾM NGÀY SINH</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 text-base">
              Kết quả tra cứu ({results.length} ngày thỏa mãn)
            </h3>
            <span className="text-xs text-gray-500">
              Năm {THIEN_CAN[canNam - 1]} {DIA_CHI[chiNam - 1]}, Ngày {THIEN_CAN[canNgay - 1]} {DIA_CHI[chiNgay - 1]}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Không tìm thấy ngày sinh nào trong khoảng năm {startYear} - {endYear} khớp chính xác với tứ trụ trên.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
                    <th className="p-3 w-12 text-center">STT</th>
                    <th className="p-3">Ngày Giờ Dương Lịch</th>
                    <th className="p-3 text-center">Lập Lá Số Nam</th>
                    <th className="p-3 text-center">Lập Lá Số Nữ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((item, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/30 transition">
                      <td className="p-3 text-center font-medium text-gray-500">{idx + 1}</td>
                      <td className="p-3 font-semibold text-gray-900 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>{item.solarDateStr}</span>
                      </td>
                      <td className="p-3 text-center">
                        <Link
                          href={item.viewUrlMale}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-2xs"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Xem Nam</span>
                        </Link>
                      </td>
                      <td className="p-3 text-center">
                        <Link
                          href={item.viewUrlFemale}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded text-xs font-semibold shadow-2xs"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Xem Nữ</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
