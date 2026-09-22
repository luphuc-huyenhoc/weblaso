'use client';

import React, { useState, useRef } from 'react';
import { IchingEnvelope } from '@/domain/iching';
import { LucHaoResultDocument } from '@/components/iching/LucHaoResultDocument';
import { IChingInterpretation } from '@/components/iching/IChingInterpretation';
import { toPng } from 'html-to-image';
import { Download, Printer, Bookmark, Loader2, Sparkles } from 'lucide-react';

export default function NgauNhienPage() {
  const now = new Date();
  const [title, setTitle] = useState('');
  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<IchingEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/iching/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Xem tài lộc thời vận',
          method: 'Ngẫu Nhiên',
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
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi gieo quẻ');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!chartRef.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(chartRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#fefdf9',
      });
      const link = document.createElement('a');
      link.download = `que-dich-ngau-nhien-${result?.calculation.originalHexagram.name || 'la-so'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting chart to PNG:', err);
      alert('Không thể xuất ảnh quẻ dịch. Vui lòng dùng tính năng In quẻ để lưu PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      {/* 1. Form Section Matching Nguhanh.net Reference Layout */}
      <div id="quedich" className="form-quedich bg-white border border-gray-200 rounded-lg p-5 sm:p-7 shadow-xs">
        <form onSubmit={handleSubmit} data-selector="anqueluchao-form">
          <div className="tracuu text-center space-y-1 mb-6">
            <h2 className="centertitle text-lg sm:text-2xl font-bold uppercase tracking-wider text-gray-900 flex items-center justify-center space-x-2">
              <span className="leftarrow text-amber-600">❖</span>
              <span>Quẻ dịch</span>
              <span className="rightarrow text-amber-600">❖</span>
            </h2>
            <p className="centertitle2 text-xs sm:text-sm text-gray-500 font-medium">
              ( Gieo quẻ ngẫu nhiên )
            </p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Việc cần xem */}
            <div className="laso-form">
              <label htmlFor="Title" className="label-form block text-xs font-bold text-gray-700 uppercase mb-1">
                Việc cần xem
              </label>
              <div className="form-item">
                <input
                  id="Title"
                  name="Title"
                  type="text"
                  maxLength={256}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Việc cần xem (Ví dụ: Chiêm đoán công danh, tài lộc, gia đạo...)"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-hidden focus:border-[#c8860a] focus:ring-1 focus:ring-[#c8860a]"
                />
              </div>
            </div>

            {/* Ngày Dương Lịch */}
            <div className="laso-form">
              <label htmlFor="SolarDay" className="label-form block text-xs font-bold text-gray-700 uppercase mb-1">
                Ngày
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  id="SolarDay"
                  name="SolarDay"
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:outline-hidden focus:border-[#c8860a]"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>

                <select
                  id="SolarMonth"
                  name="SolarMonth"
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:outline-hidden focus:border-[#c8860a]"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      Tháng {m.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>

                <select
                  id="SolarYear"
                  name="SolarYear"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:outline-hidden focus:border-[#c8860a]"
                >
                  {Array.from({ length: 157 }, (_, i) => 1900 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Giờ Dương Lịch */}
            <div className="laso-form">
              <label htmlFor="Hour" className="label-form block text-xs font-bold text-gray-700 uppercase mb-1">
                Giờ
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  id="Hour"
                  name="Hour"
                  value={hour}
                  onChange={(e) => setHour(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:outline-hidden focus:border-[#c8860a]"
                >
                  {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, '0')} giờ
                    </option>
                  ))}
                </select>

                <select
                  id="Minutes"
                  name="Minutes"
                  value={minute}
                  onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:outline-hidden focus:border-[#c8860a]"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, '0')} phút
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button matching #btnCreateNgauNhien */}
            <div className="laso-form pt-3">
              <button
                type="submit"
                id="btnCreateNgauNhien"
                disabled={loading}
                className="w-full py-3 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold text-sm uppercase tracking-wider rounded shadow transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang an quẻ ngẫu nhiên...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Lập quẻ</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded text-center">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* 2. Result Section with Action Toolbar */}
      {result && (
        <div ref={resultRef} className="space-y-6 pt-2">
          {/* Master Divination Document Sheet */}
          <LucHaoResultDocument ref={chartRef} envelope={result} />

          {/* Action Toolbar Matching Reference Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={downloading}
              className="inline-flex items-center space-x-2 bg-[#00897b] hover:bg-[#00796b] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow transition disabled:opacity-50 cursor-pointer"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Tải quẻ dịch</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In quẻ dịch</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>{saved ? 'Đã lưu quẻ!' : 'Lưu quẻ'}</span>
            </button>
          </div>

          {/* 3. Detailed Commentary (Luận giải) */}
          <IChingInterpretation envelope={result} />
        </div>
      )}
    </div>
  );
}
