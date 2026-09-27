'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { IchingEnvelope } from '@/domain/iching';
import { SeriTienForm, SeriTienFormData } from '@/components/iching/SeriTienForm';
import { LucHaoResultDocument } from '@/components/iching/LucHaoResultDocument';
import { IChingInterpretation } from '@/components/iching/IChingInterpretation';
import { captureChartImage, copyChartImage, downloadChartImage } from '@/lib/chartExport';
import {
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Banknote,
  ArrowRight,
  Eye,
  X,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

function SeriTienContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<IchingEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [scale, setScale] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Responsive scale for mobile
  useEffect(() => {
    function calculateScale() {
      if (resultRef.current) {
        const width = resultRef.current.clientWidth - 8;
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

  // Pre-generate image for modal & right click overlay
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
    const t = setTimeout(gen, 150);
    return () => {
      isMounted = false;
      clearTimeout(t);
    };
  }, [result]);

  const handleFormSubmit = async (formData: SeriTienFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/iching/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          method: 'Seri Tiền',
        }),
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
    if ((!chartRef.current && !modalImageUrl) || !result) return;
    try {
      setDownloading(true);
      const hexName = result.calculation.originalHexagram.name.trim().replace(/\s+/g, '_');
      const seri = result.calculation.seriNumber ? `_${result.calculation.seriNumber}` : '';
      await downloadChartImage(modalImageUrl || chartRef.current!, {
        fileName: `QueDich_SeriTien${seri}_${hexName}`,
        width: 720,
        height: 720,
        title: `Quẻ Dịch Seri Tiền: ${result.calculation.originalHexagram.name}`,
      });
    } catch (err) {
      console.error('Error exporting chart to PNG:', err);
      alert('Không thể xuất ảnh quẻ dịch. Bạn có thể nhấn "Xem ảnh & sao chép" để lưu ảnh trực tiếp.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    if ((!chartRef.current && !modalImageUrl) || !result) return;
    try {
      setCopying(true);
      const hexName = result.calculation.originalHexagram.name.trim().replace(/\s+/g, '_');
      const res = await copyChartImage(modalImageUrl || chartRef.current!, {
        fileName: `QueDich_SeriTien_${hexName}`,
        width: 720,
        height: 720,
        title: `Quẻ Dịch Seri Tiền: ${result.calculation.originalHexagram.name}`,
      });

      if (res.dataUrl && !modalImageUrl) {
        setModalImageUrl(res.dataUrl);
      }

      if (res.status === 'fallback') {
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

  const theDung = result?.calculation.theDung;

  return (
    <div className="min-h-screen bg-[#f9f5ec] text-[#2d2d2d] py-6 sm:py-10 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
          <Link href="/que-dich" className="hover:text-[#c8860a] transition-colors">
            Quẻ dịch
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-bold">Lập quẻ bằng series tiền</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white border border-[#c8860a]/30 rounded-xl p-6 sm:p-8 shadow-xs text-center space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest px-3.5 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full inline-block">
            Kinh Dịch Mai Hoa & Lục Hào Dự Trắc
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase">
            Lập Quẻ Dịch Bằng Seri Tiền
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Phần mềm gieo quẻ Kinh Dịch Mai Hoa Dịch Số bằng dãy số seri trên tờ tiền, phối nạp Can Chi Giờ Ngày Tháng Năm, xác định Thế Ứng, Thể Dụng, Lục Thân và Thần Sát để luận giải cát hung, sự vụ và thời vận hanh thông.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Form View (when no result or user wants to re-input) */}
        {!result && (
          <SeriTienForm
            onSubmit={handleFormSubmit}
            loading={loading}
            initialValues={{
              seriNumber: searchParams.get('seri') || searchParams.get('so') || '',
              title: searchParams.get('viec') || searchParams.get('cauhoi') || '',
            }}
          />
        )}

        {/* Result View */}
        {result && (
          <div ref={resultRef} className="space-y-8">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Lập quẻ khác</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDownloadImage}
                  disabled={downloading}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0377ee] hover:bg-[#0262c5] text-white rounded-lg text-sm font-bold shadow-xs transition cursor-pointer"
                  title="Tải ảnh quẻ dịch về máy để xin luận giải hoặc lưu trữ"
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>Tải ảnh về máy để xin luận giải</span>
                </button>

                <button
                  onClick={handleCopyImage}
                  disabled={copying}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#c8860a] hover:bg-[#b07306] text-white rounded-lg text-sm font-bold shadow-xs transition cursor-pointer"
                  title="Sao chép hình ảnh vào bộ nhớ tạm"
                >
                  {copying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : copied ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép hình ảnh'}</span>
                </button>

                <button
                  onClick={() => setShowImageModal(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition cursor-pointer"
                  title="Xem ảnh cỡ lớn để nhấp chuột phải hoặc nhấn giữ lưu ảnh"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Xem ảnh</span>
                </button>
              </div>
            </div>

            {/* Traditional High-Res Divination Document */}
            <div className="flex flex-col items-center justify-center">
              <LucHaoResultDocument
                ref={chartRef}
                envelope={result}
                zoom={scale}
                chartImageUrl={modalImageUrl}
              />
            </div>

            {/* Mai Hoa Seri Tiền Calculation & Thể - Dụng Analysis Card */}
            {theDung && (
              <div className="bg-white border border-[#c8860a]/30 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-[#27303f] flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-[#c8860a]" />
                    <span>Phân Tích Quẻ Seri Tiền (Mai Hoa Dịch Số)</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Chi tiết thuật toán tách số, xác định Thượng Quái, Hạ Quái, Hào Động và phân định Thể – Dụng
                  </p>
                </div>

                {/* 1. Phân tích dãy số */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-lg space-y-1.5">
                    <span className="text-xs font-bold text-[#c8860a] uppercase tracking-wide">
                      Thượng Quái (Nửa đầu)
                    </span>
                    <div className="text-xl font-black text-gray-900">
                      Quẻ {result.calculation.originalHexagram.lines.slice(3, 6).every(l => l.polarity === 'Dương') ? 'Càn' : ''} 
                      {theDung.isUpperThe ? `${theDung.theQuai} (Thể)` : `${theDung.dungQuai} (Dụng)`}
                    </div>
                    <p className="text-xs text-gray-600">
                      Tổng nửa đầu: <strong>{theDung.upperSum}</strong> ÷ 8 dư <strong>{((theDung.upperSum ?? 0) % 8) || 8}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-lg space-y-1.5">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                      Hạ Quái (Nửa sau)
                    </span>
                    <div className="text-xl font-black text-gray-900">
                      {theDung.isUpperThe ? `${theDung.dungQuai} (Dụng)` : `${theDung.theQuai} (Thể)`}
                    </div>
                    <p className="text-xs text-gray-600">
                      Tổng nửa sau: <strong>{theDung.lowerSum}</strong> ÷ 8 dư <strong>{((theDung.lowerSum ?? 0) % 8) || 8}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-red-50/60 border border-red-200/60 rounded-lg space-y-1.5">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                      Hào Động
                    </span>
                    <div className="text-xl font-black text-red-600">
                      Hào {theDung.movingLineIndex} Động
                    </div>
                    <p className="text-xs text-gray-600">
                      Tổng tất cả: <strong>{theDung.totalSum}</strong> ÷ 6 dư <strong>{theDung.movingLineIndex}</strong>
                    </p>
                  </div>
                </div>

                {/* 2. Thể - Dụng Phân Minh */}
                <div className="p-5 bg-gradient-to-r from-amber-50/40 via-white to-amber-50/40 border border-[#c8860a]/20 rounded-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 bg-[#c8860a] text-white rounded">
                        Thể Dụng
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        Thể: <strong className="text-[#034687]">{theDung.theQuai} ({theDung.theElement})</strong> — Dụng: <strong className="text-red-700">{theDung.dungQuai} ({theDung.dungElement})</strong>
                      </span>
                    </div>

                    <div className="inline-flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500">Quan hệ:</span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-800">
                        {theDung.relation}
                      </span>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded ${
                          theDung.evaluation === 'Đại Cát'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : theDung.evaluation === 'Hanh Thông' || theDung.evaluation === 'Tiểu Cát'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {theDung.evaluation}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed pt-1">
                    {theDung.description}
                  </p>
                </div>
              </div>
            )}

            {/* Classical Interpretation (Thoán từ, Hào từ) */}
            <IChingInterpretation envelope={result} />

            {/* Bottom Actions */}
            <div className="text-center pt-4">
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#c8860a] hover:bg-[#b07306] text-white rounded-lg text-sm font-bold shadow-md transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Gieo quẻ Seri tiền khác</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal for right-click copy & mobile touch */}
        {showImageModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6"
            onClick={() => setShowImageModal(false)}
          >
            <div
              className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-bold text-gray-900 text-base">
                  Ảnh Quẻ Dịch (Nhấp chuột phải hoặc nhấn giữ để sao chép)
                </h4>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalImageUrl ? (
                <div className="flex justify-center overflow-auto max-h-[70vh]">
                  <img
                    src={modalImageUrl}
                    alt="Quẻ Dịch"
                    className="max-w-full h-auto object-contain rounded border border-gray-200 select-all cursor-pointer"
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">Đang chuẩn bị ảnh...</div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  onClick={handleDownloadImage}
                  className="px-4 py-2 bg-[#0377ee] text-white text-xs font-bold rounded hover:bg-blue-700"
                >
                  Tải ảnh về máy
                </button>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SeriTienPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 text-sm">Đang tải công cụ lập quẻ...</div>}>
      <SeriTienContent />
    </Suspense>
  );
}
