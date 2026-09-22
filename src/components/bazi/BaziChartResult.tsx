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
        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-100/90 border border-amber-300 text-[#8c451a] text-xs font-semibold rounded-xl mb-2.5 shadow-2xs no-print">
          <span>👈 Vuốt sang ngang để xem đủ 4 Trụ & Đại Vận 👉</span>
        </div>

        <BaziChartDocument
          ref={chartRef}
          calculation={calc}
          focusYear={envelope.input.focusYear}
          showAllDecades={showAllDecades}
        />

        {/* Bottom Action Buttons */}
        <div className="flex flex-row justify-center sm:justify-end items-center gap-2 sm:space-x-2 mt-3 max-w-[960px] mx-auto px-2 no-print">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex-1 sm:flex-initial bg-[#0e8c62] hover:bg-[#0a7552] text-white text-xs sm:text-sm font-bold px-4 py-2 sm:py-1.5 rounded-lg shadow-2xs transition cursor-pointer text-center"
          >
            {isExporting ? 'Đang tải...' : 'Tải lá số (PNG)'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial bg-[#0e8c62] hover:bg-[#0a7552] text-white text-xs sm:text-sm font-bold px-4 py-2 sm:py-1.5 rounded-lg shadow-2xs transition cursor-pointer text-center"
          >
            In lá số
          </button>
        </div>
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
          <span>Hệ thống: Bát Tự Phúc Sơn & Tử Bình Toàn Thư</span>
          <span className="font-semibold text-gray-700">Đại Vận & Lưu Niên Timeline</span>
        </div>
      </div>
    </div>
  );
}
