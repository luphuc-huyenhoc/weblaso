'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IchingEnvelope } from '@/domain/iching';
import { LucHaoForm, LucHaoFormData } from '@/components/iching/LucHaoForm';
import { LucHaoResultDocument } from '@/components/iching/LucHaoResultDocument';
import { IChingInterpretation } from '@/components/iching/IChingInterpretation';
import { toPng } from 'html-to-image';
import { Download, Printer, Bookmark, Loader2, Copy, Check } from 'lucide-react';

export default function LucHaoPage() {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<IchingEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [scale, setScale] = useState(1);
  const [isZoomFit, setIsZoomFit] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function calculateScale() {
      if (resultRef.current) {
        const width = resultRef.current.clientWidth - 4;
        const targetBaseWidth = 720;
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
  }, [result]);

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
      const prevZoom = chartRef.current.style.zoom;
      chartRef.current.style.zoom = '1';
      const dataUrl = await toPng(chartRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#fefdf9',
      });
      chartRef.current.style.zoom = prevZoom;
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

  const handleCopyImage = async () => {
    if (!chartRef.current) return;
    try {
      setCopying(true);
      const prevZoom = chartRef.current.style.zoom;
      chartRef.current.style.zoom = '1';
      const dataUrl = await toPng(chartRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#fefdf9',
      });
      chartRef.current.style.zoom = prevZoom;
      setModalImageUrl(dataUrl);

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const hexName = result?.calculation.originalHexagram.name || 'que_dich';
      const file = new File([blob], `QueDich_${hexName}.png`, { type: 'image/png' });

      // If mobile supports Web Share API
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Quẻ Dịch Lục Hào - ${result?.calculation.originalHexagram.name}`,
          text: `Quẻ Dịch Lữ Phúc: ${result?.calculation.originalHexagram.name}`,
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        return;
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('Copy iching image error:', err);
      setShowImageModal(true);
    } finally {
      setCopying(false);
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
        <div ref={resultRef} className="space-y-4 pt-2">
          {/* Mobile View Mode Switcher */}
          {scale < 1 && (
            <div className="flex items-center justify-between bg-amber-100/80 border border-amber-300 rounded-lg px-3 py-2 text-xs no-print">
              <button
                type="button"
                onClick={() => setIsZoomFit(!isZoomFit)}
                className="inline-flex items-center space-x-1 font-bold text-white bg-amber-800 hover:bg-amber-900 px-3 py-1.5 rounded shadow-xs transition"
              >
                <span>{isZoomFit ? '🔍' : '📱'}</span>
                <span>
                  {isZoomFit ? 'Phóng to 100% (Vuốt ngang)' : 'Thu nhỏ vừa màn hình'}
                </span>
              </button>
              <span className="text-[11px] text-[#8c451a] font-semibold bg-white/80 border border-amber-200 px-2.5 py-1 rounded-full">
                {isZoomFit ? '✓ Đã căn vừa màn hình' : '👈 Vuốt ngang để xem 👉'}
              </span>
            </div>
          )}

          {/* Master Divination Document Sheet */}
          <LucHaoResultDocument
            ref={chartRef}
            envelope={result}
            zoom={isZoomFit && scale < 1 ? scale : 1}
          />

          {/* Action Toolbar Matching Reference Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2 no-print">
            <button
              type="button"
              onClick={handleCopyImage}
              disabled={copying}
              className="inline-flex items-center space-x-2 bg-[#1b3b6f] hover:bg-[#142e56] text-white px-4 sm:px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow transition disabled:opacity-50 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Đã sao chép ảnh!</span>
                </>
              ) : copying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang sao chép...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép ảnh quẻ</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={downloading}
              className="inline-flex items-center space-x-2 bg-[#00897b] hover:bg-[#00796b] text-white px-4 sm:px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow transition disabled:opacity-50 cursor-pointer"
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
              className="inline-flex items-center space-x-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-4 sm:px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In quẻ dịch</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (modalImageUrl) setShowImageModal(true);
                else handleCopyImage();
              }}
              className="inline-flex items-center space-x-1.5 bg-[#8c451a] hover:bg-[#6e3513] text-white px-4 sm:px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
            >
              <span>📱 Xem ảnh quẻ</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white px-4 sm:px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>{saved ? 'Đã lưu quẻ!' : 'Lưu quẻ'}</span>
            </button>
          </div>

          <div className="text-[11px] sm:text-xs text-gray-500 text-center -mt-1 px-2 no-print">
            💡 Mẹo: Bạn có thể <strong>nhấp chuột phải</strong> (hoặc <strong>nhấn giữ trên điện thoại</strong>) trực tiếp vào quẻ để chọn <strong>"Sao chép hình ảnh"</strong> gửi qua Zalo, Messenger.
          </div>

          {/* Mobile Image Preview Modal */}
          {showImageModal && modalImageUrl && (
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
                    <h4 className="font-extrabold text-sm text-gray-900">
                      Ảnh Quẻ Dịch {result.calculation.originalHexagram.name}
                    </h4>
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
                    src={modalImageUrl}
                    alt="Quẻ dịch"
                    className="w-full h-auto object-contain select-auto rounded"
                    style={{ WebkitTouchCallout: 'default' }}
                  />
                </div>

                <div className="flex gap-2 justify-center pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    className="bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold px-4 py-2 rounded-lg"
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

          {/* 3. Detailed Commentary (Luận giải) */}
          <IChingInterpretation envelope={result} />
        </div>
      )}
    </div>
  );
}
