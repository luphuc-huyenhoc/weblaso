'use client';

import React, { useRef, useState, useEffect } from 'react';
import { BaziEnvelope } from '@/domain/bazi';
import { Download, Printer, Bookmark, Check, AlertCircle, CalendarRange, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { BaziChartDocument } from './BaziChartDocument';

export function BaziChartResult({ envelope }: { envelope: BaziEnvelope }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [isZoomFit, setIsZoomFit] = useState<boolean>(true);
  const [showAllDecades, setShowAllDecades] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');

  const [showImageModal, setShowImageModal] = useState(false);

  const { calculation: calc, interpretation: interp } = envelope;

  useEffect(() => {
    function calculateScale() {
      if (containerRef.current) {
        // Measure the container's available clientWidth
        const width = containerRef.current.clientWidth - 4;
        const targetBaseWidth = 750;
        if (width > 0 && width < targetBaseWidth) {
          setScale(width / targetBaseWidth);
        } else {
          setScale(1);
        }
      }
    }

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Auto-generate high-res PNG image for right-click copy & mobile long-press
  useEffect(() => {
    let isMounted = true;
    const generateImage = async () => {
      if (!chartRef.current) return;
      try {
        const prevZoom = chartRef.current.style.zoom;
        chartRef.current.style.zoom = '1';
        const url = await toPng(chartRef.current, {
          pixelRatio: 2,
          backgroundColor: '#fefdf9',
          cacheBust: true,
        });
        chartRef.current.style.zoom = prevZoom;
        if (isMounted) {
          setChartImageUrl(url);
        }
      } catch (err) {
        console.error('Auto generate Bazi chart image error:', err);
      }
    };

    const timer = setTimeout(generateImage, 350);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [calc]);

  const handleCopyImage = async () => {
    setCopyStatus('copying');
    try {
      let dataUrl = chartImageUrl;
      if (!dataUrl && chartRef.current) {
        const prevZoom = chartRef.current.style.zoom;
        chartRef.current.style.zoom = '1';
        dataUrl = await toPng(chartRef.current, {
          pixelRatio: 2,
          backgroundColor: '#fefdf9',
          cacheBust: true,
        });
        chartRef.current.style.zoom = prevZoom;
        setChartImageUrl(dataUrl);
      }

      if (!dataUrl) throw new Error('Chưa thể kết xuất hình ảnh');

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const cleanName = calc.personal.fullName.trim().replace(/\s+/g, '_');
      const file = new File([blob], `LaSoBatTu_${cleanName}.png`, { type: 'image/png' });

      // If mobile supports Web Share API with files (iOS Safari, Android Chrome)
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Lá số Bát Tự - ${calc.personal.fullName}`,
          text: `Lá số Bát Tự Lữ Phúc - ${calc.personal.fullName}`,
        });
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 3000);
        return;
      }

      // Standard desktop clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 3000);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setCopyStatus('idle');
        return;
      }
      console.error('Copy image error:', err);
      setCopyStatus('idle');
      // On mobile or when clipboard write is blocked, open the image modal directly
      setShowImageModal(true);
    }
  };

  const handlePrint = () => {
    if (chartRef.current) {
      const prevZoom = chartRef.current.style.zoom;
      chartRef.current.style.zoom = '1';
      window.print();
      setTimeout(() => {
        if (chartRef.current) chartRef.current.style.zoom = prevZoom;
      }, 500);
    } else {
      window.print();
    }
  };

  const handleDownloadPng = async () => {
    if (!chartRef.current) return;
    setIsExporting(true);
    const prevZoom = chartRef.current.style.zoom;
    chartRef.current.style.zoom = '1';
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
      if (chartRef.current) {
        chartRef.current.style.zoom = prevZoom;
      }
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
      <div ref={containerRef} className="print-container w-full flex flex-col items-center">
        {/* Mobile View Toggle Bar (Only shown on screens narrower than 720px) */}
        {scale < 1 && (
          <div className="w-full flex items-center justify-between px-1 mb-2.5 no-print">
            <button
              type="button"
              onClick={() => setIsZoomFit(!isZoomFit)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#27303f] hover:bg-[#1a222e] text-[#c8860a] text-xs font-bold rounded-lg border border-[#c8860a]/40 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <span>{isZoomFit ? '🔍' : '📱'}</span>
              <span className="text-white">
                {isZoomFit ? 'Phóng to 100% (Vuốt ngang)' : 'Thu nhỏ vừa màn hình'}
              </span>
            </button>
            <span className="text-[11px] text-[#8c451a] font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              {isZoomFit ? '✓ Đã căn vừa màn hình' : '👈 Vuốt ngang để xem 👉'}
            </span>
          </div>
        )}

        <div
          className={`w-full ${
            isZoomFit && scale < 1 ? 'overflow-visible flex justify-center' : 'overflow-x-auto py-1'
          }`}
        >
          <BaziChartDocument
            ref={chartRef}
            calculation={calc}
            focusYear={envelope.input.focusYear}
            showAllDecades={showAllDecades}
            zoom={isZoomFit && scale < 1 ? scale : 1}
            chartImageUrl={chartImageUrl}
          />
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:space-x-2 mt-3 w-full max-w-[960px] px-2 no-print">
          <button
            type="button"
            onClick={handleCopyImage}
            disabled={copyStatus === 'copying'}
            className="flex-1 sm:flex-initial bg-[#1b3b6f] hover:bg-[#142e56] text-white text-xs sm:text-sm font-bold px-4 py-2.5 sm:py-1.5 rounded-lg shadow-2xs transition cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            {copyStatus === 'copied' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã sao chép ảnh!</span>
              </>
            ) : copyStatus === 'copying' ? (
              <span>Đang sao chép...</span>
            ) : (
              <>
                <span>📋</span>
                <span>Sao chép ảnh</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex-1 sm:flex-initial bg-[#0e8c62] hover:bg-[#0a7552] text-white text-xs sm:text-sm font-bold px-4 py-2.5 sm:py-1.5 rounded-lg shadow-2xs transition cursor-pointer text-center"
          >
            {isExporting ? 'Đang tải...' : 'Tải lá số (PNG)'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial bg-[#0e8c62] hover:bg-[#0a7552] text-white text-xs sm:text-sm font-bold px-4 py-2.5 sm:py-1.5 rounded-lg shadow-2xs transition cursor-pointer text-center"
          >
            In lá số
          </button>
          {chartImageUrl && (
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="flex-1 sm:flex-initial bg-[#8c451a] hover:bg-[#6e3513] text-white text-xs sm:text-sm font-bold px-4 py-2.5 sm:py-1.5 rounded-lg shadow-2xs transition cursor-pointer text-center"
            >
              📱 Xem ảnh lá số
            </button>
          )}
        </div>

        {/* Helpful Tip */}
        <div className="text-[11px] sm:text-xs text-gray-500 text-center mt-1.5 px-2 no-print">
          💡 Mẹo: Bạn có thể <strong>nhấp chuột phải</strong> (hoặc <strong>nhấn giữ trên điện thoại</strong>) trực tiếp vào lá số để chọn <strong>"Sao chép hình ảnh"</strong> gửi qua Zalo, Messenger.
        </div>

        {/* Mobile Image Preview & Long-press Modal */}
        {showImageModal && chartImageUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-3 sm:p-6 no-print overflow-y-auto"
            onClick={() => setShowImageModal(false)}
          >
            <div
              className="bg-white rounded-xl max-w-lg w-full p-4 space-y-3 shadow-2xl relative my-auto text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="text-left">
                  <h4 className="font-extrabold text-sm text-gray-900">Ảnh Lá Số Bát Tự Lữ Phúc</h4>
                  <p className="text-[11px] text-amber-700 font-semibold">
                    👉 Nhấn giữ ngón tay vào ảnh bên dưới để chọn &ldquo;Sao chép&rdquo; hoặc &ldquo;Lưu vào Ảnh&rdquo;
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold"
                >
                  ✕ Đóng
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-1">
                <img
                  src={chartImageUrl}
                  alt={`Lá số ${calc.personal.fullName}`}
                  className="w-full h-auto object-contain select-auto rounded"
                  style={{ WebkitTouchCallout: 'default' }}
                />
              </div>

              <div className="flex gap-2 justify-center pt-1">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="bg-[#0e8c62] hover:bg-[#0a7552] text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Tải về máy (PNG)
                </button>
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Supplementary Astrological Interpretation & Remedies (Outside the printed document sheet) */}
      <div className="no-print mt-8 space-y-4 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 gap-1">
          <h3 className="text-sm sm:text-base font-bold text-[#112244] flex items-center space-x-2">
            <span>Luận Giải Ngũ Hành & Phong Thủy Bổ Khuyết</span>
          </h3>
          <span className="text-[11px] sm:text-xs text-gray-500 font-medium">
            Lá Số Bát Tự — Cải Vận Bổ Khuyết
          </span>
        </div>

        {/* Five Elements Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Điểm Lực Ngũ Hành Bản Mệnh
            </h4>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-xs">
              <div className="p-1.5 sm:p-2.5 rounded bg-gray-50 border border-gray-200">
                <div className="font-bold text-[#707070] text-[11px] sm:text-xs">Kim</div>
                <div className="text-xs sm:text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Kim}</div>
              </div>
              <div className="p-1.5 sm:p-2.5 rounded bg-emerald-50 border border-emerald-200">
                <div className="font-bold text-[#138808] text-[11px] sm:text-xs">Mộc</div>
                <div className="text-xs sm:text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Mộc}</div>
              </div>
              <div className="p-1.5 sm:p-2.5 rounded bg-blue-50 border border-blue-200">
                <div className="font-bold text-[#0a1c8f] text-[11px] sm:text-xs">Thủy</div>
                <div className="text-xs sm:text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Thủy}</div>
              </div>
              <div className="p-1.5 sm:p-2.5 rounded bg-red-50 border border-red-200">
                <div className="font-bold text-[#d32f2f] text-[11px] sm:text-xs">Hỏa</div>
                <div className="text-xs sm:text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Hỏa}</div>
              </div>
              <div className="p-1.5 sm:p-2.5 rounded bg-amber-50 border border-amber-200">
                <div className="font-bold text-[#8c451a] text-[11px] sm:text-xs">Thổ</div>
                <div className="text-xs sm:text-sm font-black text-gray-900 mt-1">{interp.elementsScore.Thổ}</div>
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

        <div className="pt-2 text-xs text-gray-500 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>Hệ thống: Bát Tự Lữ Phúc & Tử Bình Toàn Thư</span>
          <span className="font-semibold text-gray-700">Đại Vận & Lưu Niên Timeline</span>
        </div>
      </div>
    </div>
  );
}
