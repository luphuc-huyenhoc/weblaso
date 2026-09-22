'use client';

import React, { useState, useRef } from 'react';
import { IchingEnvelope } from '@/domain/iching';
import { LucHaoForm, LucHaoFormData } from '@/components/iching/LucHaoForm';
import { LucHaoResultDocument } from '@/components/iching/LucHaoResultDocument';
import { IChingInterpretation } from '@/components/iching/IChingInterpretation';
import { toPng } from 'html-to-image';
import { Download, Printer, Bookmark, Loader2 } from 'lucide-react';

export default function LucHaoPage() {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<IchingEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (formData: LucHaoFormData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/iching/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          method: 'Lục Hào',
          lines: formData.lines,
          day: formData.day,
          month: formData.month,
          year: formData.year,
          hour: formData.hour,
          minute: formData.minute,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi an quẻ lục hào');
      }

      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi an quẻ');
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
      link.download = `que-dich-luc-hao-${result?.calculation.originalHexagram.name || 'la-so'}.png`;
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
      {/* 1. Form Section */}
      <LucHaoForm onSubmit={handleFormSubmit} loading={loading} />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded text-center">
          {error}
        </div>
      )}

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
