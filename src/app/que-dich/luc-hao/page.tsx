'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IchingEnvelope } from '@/domain/iching';
import { LucHaoForm, LucHaoFormData } from '@/components/iching/LucHaoForm';
import { LucHaoResultDocument } from '@/components/iching/LucHaoResultDocument';
import { IChingInterpretation } from '@/components/iching/IChingInterpretation';
import { captureChartImage, copyChartImage, downloadChartImage } from '@/lib/chartExport';
import { Download, Printer, Bookmark, Loader2, Copy, Check, Eye, BookOpen } from 'lucide-react';

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

  // Pre-generate image for modal
  useEffect(() => {
    let isMounted = true;
    const gen = async () => {
      if (!chartRef.current) return;
      try {
        const url = await captureChartImage(chartRef.current, { width: 720, height: 720 });
        if (isMounted) setModalImageUrl(url);
      } catch (err) {
        console.error('Auto generate iching image error:', err);
      }
    };
    const t = setTimeout(gen, 400);
    return () => {
      isMounted = false;
      clearTimeout(t);
    };
  }, [result]);

  const handleFormSubmit = async (formData: LucHaoFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/iching/luc-hao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi khi lập quẻ');
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!chartRef.current || !result) return;
    try {
      setDownloading(true);
      const hexName = result.calculation.originalHexagram.name.trim().replace(/\s+/g, '_');
      await downloadChartImage(chartRef.current, {
        fileName: `QueDich_LucHao_${hexName}`,
        width: 720,
        height: 720,
        title: `Quẻ Dịch: ${result.calculation.originalHexagram.name}`,
      });
    } catch (err) {
      console.error('Error exporting chart to PNG:', err);
      alert('Không thể xuất ảnh quẻ dịch. Bạn có thể dùng "Phóng to" để nhấn giữ lưu ảnh hoặc dùng "In quẻ".');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    if (!chartRef.current || !result) return;
    try {
      setCopying(true);
      const hexName = result.calculation.originalHexagram.name.trim().replace(/\s+/g, '_');
      const res = await copyChartImage(chartRef.current, {
        fileName: `QueDich_LucHao_${hexName}`,
        width: 720,
        height: 720,
        title: `Quẻ Dịch: ${result.calculation.originalHexagram.name}`,
      });

      if (res === 'fallback') {
        setShowImageModal(true);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Copy iching image error:', err);
        setShowImageModal(true);
      }
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

          {/* Action Toolbar Matching HocVienLySo boidich tools */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 py-2 no-print">
            {/* 1. Đọc luận giải quẻ này (Chính) */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('luan-giai');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 bg-[#c8860a] hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Đọc luận giải quẻ này</span>
            </button>

            {/* 2. Phóng to (Phụ) */}
            <button
              type="button"
              onClick={() => {
                if (modalImageUrl) setShowImageModal(true);
                else handleCopyImage();
              }}
              className="inline-flex items-center space-x-1.5 bg-[#27303f] hover:bg-[#1a222e] border border-amber-500/40 text-amber-300 px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Phóng to</span>
            </button>

            {/* 3. Sao chép (Phụ) */}
            <button
              type="button"
              onClick={handleCopyImage}
              disabled={copying}
              className="inline-flex items-center space-x-1.5 bg-[#1b3b6f] hover:bg-[#142e56] text-white px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow transition disabled:opacity-50 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Đã sao chép!</span>
                </>
              ) : copying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang chép...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép</span>
                </>
              )}
            </button>

            {/* 4. Tải ảnh (Phụ) */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={downloading}
              className="inline-flex items-center space-x-1.5 bg-[#00897b] hover:bg-[#00796b] text-white px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow transition disabled:opacity-50 cursor-pointer"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Tải ảnh</span>
            </button>

            {/* 5. In quẻ (Phụ) */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In quẻ</span>
            </button>

            {/* 6. Lưu quẻ */}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center space-x-1.5 bg-gray-700 hover:bg-gray-800 text-white px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>{saved ? 'Đã lưu!' : 'Lưu quẻ'}</span>
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
