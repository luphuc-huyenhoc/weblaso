'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IchingEnvelope } from '@/domain/iching';
import { LucHaoResultDocument } from '@/components/iching/LucHaoResultDocument';
import { IChingInterpretation } from '@/components/iching/IChingInterpretation';
import { captureChartImage, copyChartImage, downloadChartImage } from '@/lib/chartExport';
import { Download, Printer, Bookmark, Loader2, Sparkles, Copy, Check, Eye } from 'lucide-react';

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

  // Auto-generate high-res PNG image for right-click copy & modal preview
  useEffect(() => {
    if (!result) return;
    let isMounted = true;
    const gen = async () => {
      if (!chartRef.current) return;
      try {
        const url = await captureChartImage(chartRef.current, { width: 720, height: 720 });
        if (isMounted) setModalImageUrl(url);
      } catch (err) {
        console.error('Auto generate random iching image error:', err);
      }
    };
    const t = setTimeout(gen, 150);
    return () => {
      isMounted = false;
      clearTimeout(t);
    };
  }, [result]);

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
    if ((!chartRef.current && !modalImageUrl) || !result) return;
    try {
      setDownloading(true);
      const hexName = result?.calculation.originalHexagram.name.trim().replace(/\s+/g, '_') || 'que_dich';
      await downloadChartImage(modalImageUrl || chartRef.current!, {
        fileName: `QueDich_NgauNhien_${hexName}`,
        width: 720,
        height: 720,
        title: `Quẻ Dịch: ${result?.calculation.originalHexagram.name}`,
      });
    } catch (err) {
      console.error('Error exporting chart to PNG:', err);
      alert('Không thể xuất ảnh quẻ dịch. Vui lòng dùng tính năng In quẻ để lưu PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    if ((!chartRef.current && !modalImageUrl) || !result) return;
    try {
      setCopying(true);
      const hexName = result?.calculation.originalHexagram.name.trim().replace(/\s+/g, '_') || 'que_dich';
      const res = await copyChartImage(modalImageUrl || chartRef.current!, {
        fileName: `QueDich_NgauNhien_${hexName}`,
        width: 720,
        height: 720,
        title: `Quẻ Dịch: ${result?.calculation.originalHexagram.name}`,
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
        <div ref={resultRef} className="space-y-4 pt-2">
          {/* Mobile View Mode Switcher (Only shown before image loads) */}
          {!modalImageUrl && scale < 1 && (
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

          {/* Mobile View: Real Visible Image for Native iOS/Android Long-Press Menu (Sao chép ảnh) */}
          {modalImageUrl && (
            <div className="w-full flex justify-center px-1 py-1 md:hidden">
              <img
                src={modalImageUrl}
                alt={`Quẻ Dịch Ngẫu Nhiên - ${result.calculation.originalHexagram.name}`}
                className="w-full h-auto max-w-[720px] rounded-xs border-2 border-[#3182ce] shadow-md cursor-pointer block select-auto"
                style={{ WebkitTouchCallout: 'default' }}
              />
            </div>
          )}

          {/* Master Divination Document Sheet */}
          <div className={modalImageUrl ? 'hidden md:block' : ''}>
            <LucHaoResultDocument
              ref={chartRef}
              envelope={result}
              zoom={isZoomFit && scale < 1 ? scale : 1}
              chartImageUrl={modalImageUrl}
            />
          </div>

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
