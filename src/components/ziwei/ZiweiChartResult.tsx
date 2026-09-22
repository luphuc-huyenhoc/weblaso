'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ZiweiEnvelope, PalaceDetail, StarDetail } from '@/domain/ziweidoushu';
import {
  Printer,
  Bookmark,
  Sparkles,
  Copy,
  Check,
  Download,
  Loader2,
  Eye,
  X,
  AlertCircle,
} from 'lucide-react';
import { toPng } from 'html-to-image';

interface ZiweiChartResultProps {
  envelope: ZiweiEnvelope;
}

export function ZiweiChartResult({ envelope }: ZiweiChartResultProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied'>('idle');
  const [downloading, setDownloading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  // Responsive zoom
  const [scale, setScale] = useState(1);
  const [isZoomFit, setIsZoomFit] = useState(true);

  const { calculation } = envelope;
  const { personal, palaces } = calculation;

  // Responsive scale update
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      if (isZoomFit && containerWidth < 760) {
        const newScale = Math.max(0.35, Math.min(1, (containerWidth - 8) / 760));
        setScale(newScale);
      } else {
        setScale(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isZoomFit]);

  // Pre-generate high-res PNG for fast right-click / touch copy
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
        if (isMounted) setChartImageUrl(url);
      } catch (err) {
        console.error('Auto generate Ziwei chart image error:', err);
      }
    };
    const timer = setTimeout(generateImage, 350);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [calculation]);

  const handleCopyImage = async () => {
    if (!chartRef.current) return;
    try {
      setCopyStatus('copying');
      let dataUrl = chartImageUrl;
      if (!dataUrl) {
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
      const cleanName = personal.fullName.trim().replace(/\s+/g, '_');
      const file = new File([blob], `LaSoTuVi_${cleanName}.png`, { type: 'image/png' });

      // Mobile Web Share API support (iOS Safari, Android Chrome)
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Lá số Tử Vi - ${personal.fullName}`,
          text: `Lá số Tử Vi Đẩu Số Lữ Phúc - ${personal.fullName}`,
        });
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 3000);
        return;
      }

      // Desktop clipboard write
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
      console.error('Copy ziwei image error:', err);
      setCopyStatus('idle');
      setShowImageModal(true);
    }
  };

  const handleDownloadImage = async () => {
    if (!chartRef.current) return;
    try {
      setDownloading(true);
      const prevZoom = chartRef.current.style.zoom;
      chartRef.current.style.zoom = '1';
      const dataUrl = await toPng(chartRef.current, {
        pixelRatio: 2,
        backgroundColor: '#fefdf9',
        cacheBust: true,
      });
      chartRef.current.style.zoom = prevZoom;

      const link = document.createElement('a');
      link.download = `LaSoTuVi_${personal.fullName.trim().replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download ziwei image error:', err);
      alert('Không thể tải ảnh trực tiếp. Vui lòng thử nút "Sao chép ảnh" hoặc "In Lá Số".');
    } finally {
      setDownloading(false);
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

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartType: 'ZIWEI',
          title: `Lá số Tử Vi - ${personal.fullName}`,
          chartData: envelope,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus('saved');
        setSaveMessage('Lưu lá số Tử Vi thành công!');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setSaveMessage(data.message || 'Vui lòng đăng nhập để lưu lá số');
        setTimeout(() => setSaveStatus('idle'), 4000);
      }
    } catch {
      setSaveStatus('error');
      setSaveMessage('Lỗi khi lưu lá số');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  const getPalaceByBranch = (branch: string): PalaceDetail | undefined => {
    return palaces.find((p) => p.branch === branch);
  };

  const renderStarBrightness = (brightness?: string) => {
    if (!brightness) return null;
    const colors: Record<string, string> = {
      Miếu: 'text-red-600 font-black',
      Vượng: 'text-amber-600 font-bold',
      Đắc: 'text-blue-600 font-bold',
      Hãm: 'text-gray-400 font-medium italic',
    };
    const abbrev: Record<string, string> = {
      Miếu: 'M',
      Vượng: 'V',
      Đắc: 'Đ',
      Hãm: 'H',
    };
    return (
      <span className={`text-[9.5px] ml-1 ${colors[brightness] || 'text-gray-500'}`}>
        ({abbrev[brightness] || brightness})
      </span>
    );
  };

  // Render individual star with Tứ Hóa pill if applicable
  const renderStarWithTuHoa = (star: StarDetail, className: string) => {
    const match = star.name.match(/^(.*?)\s*\((Hóa [A-ZÀ-Ỹa-zà-ỹ]+)\)$/);
    if (match) {
      const baseName = match[1];
      const hoaName = match[2];
      return (
        <span className="inline-flex items-center gap-0.5">
          <span className={className}>{baseName}</span>
          <span className="text-[8.5px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-1 py-0.2 rounded leading-none">
            {hoaName}
          </span>
          {renderStarBrightness(star.brightness)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center">
        <span className={className}>{star.name}</span>
        {renderStarBrightness(star.brightness)}
      </span>
    );
  };

  // Render an individual Palace Cell
  const renderPalaceCell = (branch: string) => {
    const palace = getPalaceByBranch(branch);
    if (!palace) return <div className="border border-gray-300 p-2 min-h-[175px]" />;

    // Group subStars
    const tuHoaStars: StarDetail[] = [];
    const catStars: StarDetail[] = [];
    const satStars: StarDetail[] = [];
    const vongStars: StarDetail[] = [];

    palace.subStars.forEach((s) => {
      if (s.type === 'Tứ Hóa' || s.name.includes('(Hóa ')) {
        tuHoaStars.push(s);
      } else if (s.type === 'Cát Tinh') {
        catStars.push(s);
      } else if (s.type === 'Sát Tinh') {
        satStars.push(s);
      } else {
        vongStars.push(s);
      }
    });

    return (
      <div
        key={palace.index}
        className={`border border-amber-900/20 p-2 flex flex-col justify-between min-h-[185px] bg-[#fdfbf7]/90 transition hover:bg-amber-50/50 text-xs relative ${
          palace.isMenh ? 'ring-2 ring-red-500/80 bg-red-50/20' : ''
        }`}
      >
        {/* Top Header of Palace */}
        <div className="flex items-center justify-between border-b border-amber-800/15 pb-1">
          <div className="flex items-center space-x-1">
            <span
              className={`font-black uppercase tracking-wider text-[11px] ${
                palace.isMenh ? 'text-red-700 underline decoration-red-400 underline-offset-2' : 'text-[#1c2434]'
              }`}
            >
              {palace.cungName}
            </span>
            {palace.isThan && (
              <span className="text-[9px] px-1 py-0.2 bg-red-100 text-red-700 font-extrabold rounded border border-red-300">
                THÂN
              </span>
            )}
          </div>
          <div className="text-[10px] font-bold text-gray-500">
            {palace.stem} {palace.branch}
          </div>
        </div>

        {/* Palace Center Content: Stars */}
        <div className="py-1 flex-1 flex flex-col justify-between space-y-1">
          {/* Main Stars (Chính tinh) */}
          <div className="space-y-0.5 border-b border-dashed border-gray-200/80 pb-1">
            {palace.mainStars.length === 0 ? (
              <span className="text-[10px] italic text-gray-400 font-medium">Vô chính diệu</span>
            ) : (
              palace.mainStars.map((star, sIdx) => (
                <div key={sIdx} className="leading-tight">
                  {renderStarWithTuHoa(star, 'font-black text-red-700 text-[11px]')}
                </div>
              ))
            )}
          </div>

          {/* Sub Stars & Special categories */}
          <div className="grid grid-cols-2 gap-1 text-[9.5px] leading-tight flex-1 pt-0.5">
            {/* Left Column: Cát tinh & Tứ hóa */}
            <div className="space-y-0.5 pr-0.5 border-r border-gray-100">
              {tuHoaStars.map((star, idx) => (
                <div key={`th-${idx}`}>
                  {renderStarWithTuHoa(star, 'font-bold text-purple-700')}
                </div>
              ))}
              {catStars.map((star, idx) => (
                <div key={`cat-${idx}`} className="text-blue-700 font-semibold">
                  {renderStarWithTuHoa(star, 'text-blue-700 font-semibold')}
                </div>
              ))}
            </div>

            {/* Right Column: Sát tinh & Hung tinh */}
            <div className="space-y-0.5 pl-0.5">
              {satStars.map((star, idx) => (
                <div key={`sat-${idx}`} className="text-[#8c1d1d] font-semibold">
                  {renderStarWithTuHoa(star, 'text-[#8c1d1d] font-semibold')}
                </div>
              ))}
            </div>
          </div>

          {/* Vòng Sao: Thai Tue / Bac Si / Trang Sinh */}
          {vongStars.length > 0 && (
            <div className="pt-0.5 border-t border-gray-100 flex flex-wrap gap-x-1 gap-y-0 text-[8.5px] text-gray-500 font-normal">
              {vongStars.slice(0, 4).map((star, idx) => (
                <span key={`vong-${idx}`}>
                  {star.name}
                  {idx < Math.min(vongStars.length, 4) - 1 ? ' •' : ''}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Footer of Palace (Đại Hạn Age & Tuần / Triệt) */}
        <div className="flex items-center justify-between border-t border-amber-800/15 pt-1 text-[10px] text-gray-600">
          <span className="font-mono font-bold text-gray-800 bg-amber-100/60 px-1 rounded">
            {palace.daiHanAge}t
          </span>

          {palace.tuanTriet && palace.tuanTriet.length > 0 && (
            <span className="font-black text-white text-[8.5px] bg-red-600 px-1 py-0.2 rounded shadow-2xs">
              {palace.tuanTriet.join(' - ')}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Save Notification */}
      {saveStatus === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2 no-print">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}
      {saveStatus === 'saved' && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg flex items-center space-x-2 no-print">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200 p-3 rounded-lg shadow-xs no-print">
        <div className="text-xs text-gray-700 font-medium">
          Lá số Tử Vi Đẩu Số: <span className="font-bold text-gray-900">{personal.fullName}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Preview Modal Trigger */}
          <button
            type="button"
            onClick={() => {
              if (!chartImageUrl && chartRef.current) {
                handleCopyImage();
              } else {
                setShowImageModal(true);
              }
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#27303f] hover:bg-[#1a222e] border border-amber-500/40 rounded text-xs font-semibold text-amber-300 transition shadow-2xs cursor-pointer"
            title="Mở ảnh lá số để nhấn giữ sao chép trên điện thoại"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>📱 Xem ảnh lá số</span>
          </button>

          <button
            type="button"
            onClick={handleCopyImage}
            disabled={copyStatus === 'copying'}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142e56] rounded text-xs font-semibold text-white transition shadow-2xs cursor-pointer"
          >
            {copyStatus === 'copied' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đã sao chép ảnh!</span>
              </>
            ) : copyStatus === 'copying' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang sao chép...</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép ảnh</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={downloading}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#0e8c62] hover:bg-[#0a7552] rounded text-xs font-semibold text-white transition shadow-2xs cursor-pointer"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Tải lá số</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#c8860a] hover:bg-amber-700 rounded text-xs font-semibold text-white transition shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Lá Số</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 transition cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c8860a]" />
            <span>Lưu Lá Số</span>
          </button>
        </div>
      </div>

      {/* Main Chart Sheet Container */}
      <div ref={containerRef} className="print-container w-full flex flex-col items-center">
        {/* Mobile View Toggle Bar (Shown on screens narrower than 760px) */}
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
          <div
            style={{
              width: isZoomFit && scale < 1 ? `${760 * scale}px` : 'auto',
              overflow: 'hidden',
            }}
          >
            {/* Traditional Square Chart: 4 Columns x 4 Rows */}
            <div
              ref={chartRef}
              className="relative bg-[#fefdf9] border-2 border-amber-900/40 p-2 md:p-3 rounded-lg shadow-sm overflow-hidden select-none"
              style={{
                width: '760px',
                minWidth: '760px',
                zoom: isZoomFit && scale < 1 ? scale : undefined,
                backgroundImage: "url('/BACKGROUND.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#fefdf9',
              }}
            >
              {/* Background watermark overlay */}
              <div
                className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
                aria-hidden="true"
              >
                <img
                  src="/BACKGROUND.png"
                  alt=""
                  className="w-full h-full object-cover opacity-15"
                />
              </div>

              <div className="relative z-10 grid grid-cols-4 border border-amber-900/30 bg-white/70 backdrop-blur-[0.5px]">
                {/* Row 1: Tỵ, Ngọ, Mùi, Thân */}
                {renderPalaceCell('Tỵ')}
                {renderPalaceCell('Ngọ')}
                {renderPalaceCell('Mùi')}
                {renderPalaceCell('Thân')}

                {/* Row 2: Thìn, Center Info (Col 2-3, Row 2-3), Dậu */}
                {renderPalaceCell('Thìn')}
                <div className="col-span-2 row-span-2 border border-amber-900/20 p-4 flex flex-col justify-between items-center text-center bg-white/90 relative overflow-hidden">
                  {/* Subtle seal watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <span className="text-7xl font-serif font-black tracking-widest text-[#c8860a]">
                      LỮ PHÚC
                    </span>
                  </div>

                  {/* Header of Center Box */}
                  <div className="border-b border-amber-300/80 pb-2 w-full relative z-10">
                    <div className="flex items-center justify-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#c8860a]">
                      <Sparkles className="w-3 h-3 text-[#c8860a]" />
                      <span>Bát Tự Lữ Phúc • Tử Vi Đẩu Số</span>
                      <Sparkles className="w-3 h-3 text-[#c8860a]" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 uppercase mt-1 tracking-wide">
                      {personal.fullName}
                    </h2>
                    <div className="text-[11px] text-gray-600 font-semibold mt-0.5">
                      Giới tính: <span className="font-bold text-[#8c1d1d]">{personal.genderLabel}</span>
                    </div>
                  </div>

                  {/* Body Info Grid */}
                  <div className="text-xs space-y-1.5 text-gray-700 w-full py-2 px-3 relative z-10">
                    <div className="flex justify-between border-b border-gray-200/60 pb-1">
                      <span className="text-gray-500 font-medium">Dương Lịch:</span>
                      <span className="font-semibold text-gray-900">{personal.solarDateStr}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/60 pb-1">
                      <span className="text-gray-500 font-medium">Âm Lịch:</span>
                      <span className="font-semibold text-gray-900">{personal.lunarDateStr}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/60 pb-1">
                      <span className="text-gray-500 font-medium">Bản Mệnh:</span>
                      <span className="font-bold text-[#8c1d1d]">{personal.menhElement}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/60 pb-1">
                      <span className="text-gray-500 font-medium">Cục:</span>
                      <span className="font-bold text-blue-900">{personal.cuc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Thân cư:</span>
                      <span className="font-bold text-purple-900">{personal.thanCungName}</span>
                    </div>
                  </div>

                  {/* Footer note */}
                  <div className="border-t border-amber-200/60 pt-1.5 w-full text-[10px] text-[#c8860a] font-bold uppercase tracking-wider relative z-10">
                    Khảo cứu chuẩn Nam Phái & Bắc Phái
                  </div>
                </div>
                {renderPalaceCell('Dậu')}

                {/* Row 3: Mão, (Center Info continued), Tuất */}
                {renderPalaceCell('Mão')}
                {renderPalaceCell('Tuất')}

                {/* Row 4: Dần, Sửu, Tý, Hợi */}
                {renderPalaceCell('Dần')}
                {renderPalaceCell('Sửu')}
                {renderPalaceCell('Tý')}
                {renderPalaceCell('Hợi')}
              </div>

              {/* Transparent high-res image overlay for right-click 'Sao chép hình ảnh' & mobile long-press */}
              {chartImageUrl && (
                <img
                  src={chartImageUrl}
                  alt={`Lá số Tử Vi - ${personal.fullName}`}
                  className="absolute inset-0 w-full h-full object-contain opacity-[0.001] z-20 pointer-events-auto cursor-pointer select-none"
                  style={{ WebkitTouchCallout: 'default' }}
                  title="Nhấp chuột phải chọn 'Sao chép hình ảnh' hoặc nhấn giữ để lưu ảnh"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Tip */}
      <div className="text-[11px] sm:text-xs text-gray-500 text-center px-2 no-print">
        💡 Mẹo: Bạn có thể <strong>nhấp chuột phải</strong> (hoặc bấm nút <strong>"📱 Xem ảnh lá số"</strong> trên điện thoại) để chọn <strong>"Sao chép hình ảnh"</strong> gửi qua Zalo, Facebook Messenger.
      </div>

      {/* Mobile Image Preview Modal */}
      {showImageModal && chartImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-3 sm:p-6 no-print"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-amber-50/50">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#c8860a]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Ảnh Lá Số Tử Vi ({personal.fullName})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/60 border-b border-amber-200/60 text-xs text-amber-900 flex items-center space-x-2">
              <span className="text-base">👆</span>
              <span>
                <strong>Hướng dẫn điện thoại:</strong> Nhấn và <strong>giữ ngón tay vào hình ảnh</strong> trong 1-2 giây rồi chọn <strong>"Sao chép ảnh"</strong> hoặc <strong>"Lưu vào ảnh"</strong>.
              </span>
            </div>

            <div className="overflow-auto p-4 flex justify-center bg-gray-100 flex-1">
              <img
                src={chartImageUrl}
                alt={`Lá số Tử Vi - ${personal.fullName}`}
                className="max-w-full h-auto object-contain rounded border border-gray-300 shadow-md select-all"
                style={{ WebkitTouchCallout: 'default' }}
              />
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Độ phân giải sắc nét 2x</span>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-1.5 bg-[#27303f] hover:bg-[#1a222e] text-white text-xs font-semibold rounded transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
