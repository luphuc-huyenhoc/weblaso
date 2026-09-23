'use client';

import React, { useRef, useState, useEffect } from 'react';
import { BaziEnvelope } from '@/domain/bazi';
import { Download, Printer, Bookmark, Check, AlertCircle, Copy, Eye, BookOpen, Loader2 } from 'lucide-react';
import { captureChartImage, copyChartImage, downloadChartImage } from '@/lib/chartExport';
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

  // Auto-generate high-res PNG image for modal preview & right-click copy overlay
  useEffect(() => {
    let isMounted = true;
    const generateImage = async () => {
      if (!chartRef.current) return;
      try {
        const url = await captureChartImage(chartRef.current, { width: 750, height: 1000 });
        if (isMounted) {
          setChartImageUrl(url);
        }
      } catch (err) {
        console.error('Auto generate Bazi chart image error:', err);
      }
    };

    const timer = setTimeout(generateImage, 150);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [calc, envelope.input.focusYear, showAllDecades]);

  const handleCopyImage = async () => {
    if (!chartRef.current && !chartImageUrl) return;
    setCopyStatus('copying');
    try {
      const cleanName = calc.personal.fullName.trim().replace(/\s+/g, '_');
      const birthDate = `${envelope.input.year}-${envelope.input.month}-${envelope.input.day}`;
      const res = await copyChartImage(chartImageUrl || chartRef.current!, {
        fileName: `LaSoBatTu_${cleanName}_${birthDate}`,
        width: 750,
        height: 1000,
        title: `Lá số Bát Tự - ${calc.personal.fullName}`,
      });

      if (res.dataUrl && !chartImageUrl) {
        setChartImageUrl(res.dataUrl);
      }

      if (res.status === 'fallback') {
        setShowImageModal(true);
        setCopyStatus('idle');
      } else {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 3000);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Copy image error:', err);
        setShowImageModal(true);
      }
      setCopyStatus('idle');
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
    if (!chartRef.current && !chartImageUrl) return;
    setIsExporting(true);
    try {
      const cleanName = calc.personal.fullName.trim().replace(/\s+/g, '_');
      const birthDate = `${envelope.input.year}-${envelope.input.month}-${envelope.input.day}`;
      await downloadChartImage(chartImageUrl || chartRef.current!, {
        fileName: `LaSoBatTu_${cleanName}_${birthDate}`,
        width: 750,
        height: 1000,
        title: `Lá số Bát Tự - ${calc.personal.fullName}`,
      });
    } catch (err) {
      console.error('Failed to download image:', err);
      alert('Không thể tạo ảnh lá số trực tiếp. Bạn có thể bấm "Phóng to" để nhấn giữ lưu ảnh hoặc dùng tính năng "In lá số".');
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
      <div ref={containerRef} className="print-container w-full flex flex-col items-center">
        {/* Mobile View Toggle Bar (Only shown on screens narrower than 720px before image loads) */}
        {!chartImageUrl && scale < 1 && (
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

        {/* Mobile View: Real Visible Image for Native iOS/Android Long-Press Menu (Sao chép ảnh) */}
        {chartImageUrl && (
          <div className="w-full flex justify-center px-1 py-1 md:hidden">
            <img
              src={chartImageUrl}
              alt={`Lá số Bát Tự - ${calc.personal.fullName}`}
              className="w-full h-auto max-w-[750px] rounded-xs border-2 border-[#1c4a78] shadow-md cursor-pointer block select-auto"
              style={{ WebkitTouchCallout: 'default' }}
            />
          </div>
        )}

        {/* Desktop View & Background Rendering Host */}
        <div
          className={`w-full ${
            chartImageUrl
              ? 'hidden md:block'
              : isZoomFit && scale < 1
              ? 'overflow-visible flex justify-center'
              : 'overflow-x-auto py-1'
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

        {/* Bottom Action Buttons (Matching HocVienLySo.org tools) */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 mt-3 w-full max-w-[960px] px-2 no-print">
          <button
            type="button"
            onClick={async () => {
              if (!chartImageUrl && chartRef.current) {
                const url = await captureChartImage(chartRef.current, { width: 750, height: 1000 });
                setChartImageUrl(url);
              }
              setShowImageModal(true);
            }}
            className="flex-1 sm:flex-initial bg-[#27303f] hover:bg-[#1a222e] border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg shadow-2xs transition cursor-pointer text-center flex items-center justify-center gap-1.5"
            title="Phóng to ảnh lá số"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Phóng to</span>
          </button>

          <button
            type="button"
            onClick={handleCopyImage}
            disabled={copyStatus === 'copying'}
            className="flex-1 sm:flex-initial bg-[#1b3b6f] hover:bg-[#142e56] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg shadow-2xs transition cursor-pointer text-center flex items-center justify-center gap-1.5"
            title="Sao chép ảnh lá số vào bộ nhớ tạm hoặc chia sẻ"
          >
            {copyStatus === 'copied' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Đã sao chép!</span>
              </>
            ) : copyStatus === 'copying' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang chép...</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao chép ảnh</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex-1 sm:flex-initial bg-[#0e8c62] hover:bg-[#0a7552] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg shadow-2xs transition cursor-pointer text-center flex items-center justify-center gap-1.5"
            title="Tải ảnh lá số độ phân giải cao"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Tải ảnh</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial bg-[#c8860a] hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg shadow-2xs transition cursor-pointer text-center flex items-center justify-center gap-1.5"
            title="In lá số ra giấy hoặc lưu PDF"
          >
            <Printer className="w-4 h-4" />
            <span>In lá số</span>
          </button>

          <button
            type="button"
            onClick={handleSaveChart}
            disabled={saveStatus === 'saving'}
            className="flex-1 sm:flex-initial bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg shadow-2xs transition cursor-pointer text-center flex items-center justify-center gap-1.5"
            title="Lưu lá số vào tài khoản"
          >
            <Bookmark className="w-4 h-4 text-[#c8860a]" />
            <span>Lưu lá số</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('luan-giai');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-initial bg-[#3b2d54] hover:bg-[#2c2140] text-purple-200 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg shadow-2xs transition cursor-pointer text-center flex items-center justify-center gap-1.5"
            title="Xem phần phân tích luận giải chi tiết"
          >
            <BookOpen className="w-4 h-4 text-purple-300" />
            <span>Đọc luận giải</span>
          </button>
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
