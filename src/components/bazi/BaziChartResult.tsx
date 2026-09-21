'use client';

import React, { useRef, useState } from 'react';
import { BaziEnvelope } from '@/domain/bazi';
import { Download, Printer, Bookmark, Check, AlertCircle, CalendarRange, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { BaziChartDocument } from './BaziChartDocument';

export function BaziChartResult({ envelope }: { envelope: BaziEnvelope }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showAllDecades, setShowAllDecades] = useState(false);

  const { calculation: calc, interpretation: interp } = envelope;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    if (!chartRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(chartRef.current, {
        pixelRatio: 2, // 2x high resolution matching ~1824x2628 px quality
        backgroundColor: '#fefdf9',
        cacheBust: true,
      });

      const cleanName = calc.personal.fullName.trim().replace(/\s+/g, '_');
      const birthDate = `${envelope.input.year}-${envelope.input.month}-${envelope.input.day}`;
      const link = document.createElement('a');
      link.download = `LaSoBatTu_${cleanName}_${birthDate}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
      alert('Không thể tạo ảnh lá số trực tiếp. Bạn có thể dùng tính năng "In lá số" để lưu PDF/ảnh.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveChart = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartType: 'BAZI',
          title: `Lá số Bát Tự - ${calc.personal.fullName}`,
          chartData: envelope,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Không thể lưu lá số');
      }

      setSaveStatus('saved');
      setSaveMessage('Lá số đã được lưu vào tài khoản thành công!');
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err.message || 'Vui lòng đăng nhập để lưu lá số.');
    }
  };

  return (
    <div className="w-full mt-6 space-y-6">
      {/* Top Action Toolbar (Outside printable chart) */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-xs border border-gray-200 gap-3 no-print">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700">
          <Sparkles className="w-4 h-4 text-[#c8860a]" />
          <span>
            Lá số Bát Tự: <strong className="text-gray-900 font-bold uppercase">{calc.personal.fullName}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle 100-Year Decades View */}
          <button
            type="button"
            onClick={() => setShowAllDecades(!showAllDecades)}
            className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold transition"
          >
            <CalendarRange className="w-3.5 h-3.5 text-[#0d5ca8]" />
            <span>{showAllDecades ? 'Xem 20 năm gần nhất' : 'Xem toàn bộ 100 năm'}</span>
          </button>

          {/* Download PNG Button */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded text-xs font-bold transition shadow-2xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Đang xuất ảnh...' : 'TẢI ẢNH LÁ SỐ'}</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>IN LÁ SỐ</span>
          </button>

          {/* Save Chart Button */}
          <button
            type="button"
            onClick={handleSaveChart}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            className="flex items-center space-x-1.5 bg-[#c8860a] hover:bg-amber-700 text-white px-3.5 py-1.5 rounded text-xs font-bold transition shadow-2xs disabled:opacity-50"
          >
            {saveStatus === 'saved' ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saveStatus === 'saved' ? 'Đã lưu' : saveStatus === 'saving' ? 'Đang lưu...' : 'Lưu lá số'}</span>
          </button>
        </div>
      </div>

      {/* Notification status for save chart */}
      {saveStatus === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center space-x-2 no-print">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {saveStatus === 'saved' && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded flex items-center space-x-2 no-print">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* MAIN DOCUMENT: Traditional Bát Tự Chart Sheet (1:1 with Reference) */}
      <div className="print-container">
        <BaziChartDocument
          ref={chartRef}
          calculation={calc}
          focusYear={envelope.input.focusYear}
          showAllDecades={showAllDecades}
        />
      </div>

      {/* Supplementary Astrological Interpretation & Remedies (Outside the printed document sheet) */}
      <div className="no-print mt-8 space-y-4 bg-white border border-gray-200 rounded-lg p-5 md:p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 className="text-base font-bold text-[#112244] flex items-center space-x-2">
            <span>Luận Giải Ngũ Hành & Phong Thủy Bổ Khuyết</span>
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            Lá Số Bát Tự — Cải Vận Bổ Khuyết
          </span>
        </div>

        {/* Five Elements Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Điểm Lực Ngũ Hành Bản Mệnh
            </h4>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                <div className="font-bold text-[#707070]">Kim</div>
                <div className="text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Kim}</div>
              </div>
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200">
                <div className="font-bold text-[#138808]">Mộc</div>
                <div className="text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Mộc}</div>
              </div>
              <div className="p-2.5 rounded bg-blue-50 border border-blue-200">
                <div className="font-bold text-[#0a1c8f]">Thủy</div>
                <div className="text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Thủy}</div>
              </div>
              <div className="p-2.5 rounded bg-red-50 border border-red-200">
                <div className="font-bold text-[#d32f2f]">Hỏa</div>
                <div className="text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Hỏa}</div>
              </div>
              <div className="p-2.5 rounded bg-amber-50 border border-amber-200">
                <div className="font-bold text-[#8c451a]">Thổ</div>
                <div className="text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Thổ}</div>
              </div>
            </div>

            <div className="text-xs text-gray-700 space-y-1.5 pt-2">
              <div>
                Đánh giá thân mệnh:{' '}
                <strong className="text-[#0d5ca8] font-bold">{calc.dayMaster.strength}</strong> (
                {calc.dayMaster.percentage}% lực bản mệnh).
              </div>
              <div>
                Dụng Thần: <strong className="text-[#138808] font-black">{interp.dungThan}</strong> | Hỷ Thần:{' '}
                <strong className="text-[#0a1c8f] font-black">{interp.hyThan}</strong> | Kỵ Thần:{' '}
                <strong className="text-[#d32f2f] font-black">{interp.kyThan}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Phong Thủy Cải Vận Gợi Ý
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">{interp.recommendations.summary}</p>
            <div className="text-xs space-y-2">
              <div>
                <span className="font-semibold text-gray-700">Màu sắc tương sinh:</span>{' '}
                <span className="text-gray-900">{interp.recommendations.favorableColors.join(', ')}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Hướng thuận lợi:</span>{' '}
                <span className="text-gray-900">{interp.recommendations.favorableDirections.join(', ')}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Vật phẩm bổ trợ:</span>{' '}
                <span className="text-[#c8860a] font-bold">
                  {interp.recommendations.favorableGemstones.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-gray-500 border-t border-gray-100 flex items-center justify-between">
          <span>Hệ thống: Bát Tự Manh Phái & Tử Bình Toàn Thư</span>
          <span className="font-semibold text-gray-700">Đại Vận & Lưu Niên Timeline</span>
        </div>
      </div>
    </div>
  );
}
