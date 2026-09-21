'use client';

import React, { useState } from 'react';
import { IchingEnvelope, IchingLineInput } from '@/domain/iching';
import { HexagramVisualizer } from '@/components/iching/HexagramVisualizer';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';

const LINE_NAMES = [
  'Hào Sơ (Dưới cùng)',
  'Hào Nhị',
  'Hào Tam',
  'Hào Tứ',
  'Hào Ngũ',
  'Hào Thượng (Trên cùng)',
];

export default function LucHaoPage() {
  const [title, setTitle] = useState('Chiêm nghiệm công việc kinh doanh');
  const now = new Date();
  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());

  // 6 lines state: 0 is Hào sơ, 5 is Hào thượng
  const [lines, setLines] = useState<IchingLineInput[]>([
    { lineIndex: 0, polarity: 'Dương', movement: 'Tĩnh' },
    { lineIndex: 1, polarity: 'Dương', movement: 'Tĩnh' },
    { lineIndex: 2, polarity: 'Dương', movement: 'Tĩnh' },
    { lineIndex: 3, polarity: 'Dương', movement: 'Tĩnh' },
    { lineIndex: 4, polarity: 'Dương', movement: 'Tĩnh' },
    { lineIndex: 5, polarity: 'Dương', movement: 'Tĩnh' },
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IchingEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateLine = (
    index: number,
    value: '7_DUONG_TINH' | '9_DUONG_DONG' | '8_AM_TINH' | '6_AM_DONG'
  ) => {
    const nextLines = [...lines];
    if (value === '7_DUONG_TINH') {
      nextLines[index] = { lineIndex: index, polarity: 'Dương', movement: 'Tĩnh' };
    } else if (value === '9_DUONG_DONG') {
      nextLines[index] = { lineIndex: index, polarity: 'Dương', movement: 'Động' };
    } else if (value === '8_AM_TINH') {
      nextLines[index] = { lineIndex: index, polarity: 'Âm', movement: 'Tĩnh' };
    } else if (value === '6_AM_DONG') {
      nextLines[index] = { lineIndex: index, polarity: 'Âm', movement: 'Động' };
    }
    setLines(nextLines);
  };

  const getLineValue = (line: IchingLineInput) => {
    if (line.polarity === 'Dương' && line.movement === 'Tĩnh') return '7_DUONG_TINH';
    if (line.polarity === 'Dương' && line.movement === 'Động') return '9_DUONG_DONG';
    if (line.polarity === 'Âm' && line.movement === 'Tĩnh') return '8_AM_TINH';
    return '6_AM_DONG';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/iching/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          method: 'Lục Hào',
          lines,
          day,
          month,
          year,
          hour,
          minute,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi gieo quẻ');
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
          Lập Quẻ Dịch Lục Hào Cổ Truyền
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Nhập dữ liệu 6 hào theo phương pháp Dã Hạc Chuyên Khảo. Hệ thống tự động nạp giáp can chi, an thế ứng, lục thú và xác định quẻ biến.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Sự vụ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Sự việc cần chiêm đoán
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ví dụ: Xin việc mới, Đầu tư bất động sản, Hôn nhân..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded focus:border-[#c8860a] text-sm"
            />
          </div>

          {/* Thời gian */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/60">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Thời khắc gieo quẻ (Dương Lịch)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div>
                <span className="text-[11px] text-gray-500 block mb-1">Ngày</span>
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
                <span className="text-[11px] text-gray-500 block mb-1">Tháng</span>
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
                <span className="text-[11px] text-gray-500 block mb-1">Năm</span>
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
                <span className="text-[11px] text-gray-500 block mb-1">Giờ</span>
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
                <span className="text-[11px] text-gray-500 block mb-1">Phút</span>
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
          </div>

          {/* 6 Lines Selection (Rendered from top Hào 6 down to Hào 1) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-gray-700 uppercase">
                Trạng thái 6 Hào (Từ Hào 6 xuống Hào 1)
              </span>
              <span className="text-[11px] text-gray-500">
                (7 = Thiếu Dương • 8 = Thiếu Âm • 9 = Lão Dương Động • 6 = Lão Âm Động)
              </span>
            </div>

            {[5, 4, 3, 2, 1, 0].map((lineIndex) => (
              <div
                key={lineIndex}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50/40"
              >
                <div className="font-semibold text-gray-800 text-xs w-44">
                  {LINE_NAMES[lineIndex]}
                </div>
                <div className="flex-1 max-w-sm">
                  <select
                    value={getLineValue(lines[lineIndex])}
                    onChange={(e) => updateLine(lineIndex, e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded bg-white text-xs font-medium focus:border-[#c8860a]"
                  >
                    <option value="7_DUONG_TINH">7 — Thiếu Dương (Dương Tĩnh — ━━━━━━━)</option>
                    <option value="9_DUONG_DONG">9 — Lão Dương (Dương Động — ━━━━━━━ ○)</option>
                    <option value="8_AM_TINH">8 — Thiếu Âm (Âm Tĩnh — ━━━ ━━━)</option>
                    <option value="6_AM_DONG">6 — Lão Âm (Âm Động — ━━━ ━━━ ✕)</option>
                  </select>
                </div>
              </div>
            ))}
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
              className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-3 rounded shadow uppercase tracking-wider text-xs transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang an quẻ...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>AN QUẺ LỤC HÀO</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && <HexagramVisualizer envelope={result} />}
    </div>
  );
}
