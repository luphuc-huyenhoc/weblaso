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
import { captureChartImage, copyChartImage, downloadChartImage } from '@/lib/chartExport';

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

  // Responsive scale update (base width 720px matching reference)
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      if (isZoomFit && containerWidth < 720) {
        const newScale = Math.max(0.35, Math.min(1, (containerWidth - 8) / 720));
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
        const url = await captureChartImage(chartRef.current, { width: 720, height: 1000 });
        if (isMounted) setChartImageUrl(url);
      } catch (err) {
        console.error('Auto generate Ziwei chart image error:', err);
      }
    };
    const timer = setTimeout(generateImage, 400);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [calculation]);

  const handleCopyImage = async () => {
    if (!chartRef.current) return;
    setCopyStatus('copying');
    try {
      const cleanName = personal.fullName.trim().replace(/\s+/g, '_');
      const res = await copyChartImage(chartRef.current, {
        fileName: `LaSoTuVi_${cleanName}`,
        width: 720,
        height: 1000,
        title: `Lá số Tử Vi - ${personal.fullName}`,
      });

      if (res.dataUrl) {
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
        console.error('Copy ziwei image error:', err);
        setShowImageModal(true);
      }
      setCopyStatus('idle');
    }
  };

  const handleDownloadImage = async () => {
    if (!chartRef.current) return;
    setDownloading(true);
    try {
      const cleanName = personal.fullName.trim().replace(/\s+/g, '_');
      await downloadChartImage(chartRef.current, {
        fileName: `LaSoTuVi_${cleanName}`,
        width: 720,
        height: 1000,
        title: `Lá số Tử Vi - ${personal.fullName}`,
      });
    } catch (err) {
      console.error('Download ziwei image error:', err);
      alert('Không thể tải ảnh trực tiếp. Vui lòng bấm "Phóng to" để nhấn giữ lưu ảnh hoặc dùng "In lá số".');
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
      <span className={`text-[9px] ml-0.5 ${colors[brightness] || 'text-gray-500'}`}>
        ({abbrev[brightness] || brightness})
      </span>
    );
  };

  const getMainStarColor = (star: StarDetail) => {
    const el = star.element;
    switch (el) {
      case 'Kim': return 'text-[#475569]'; // Slate / Grey
      case 'Mộc': return 'text-[#16a34a]'; // Green
      case 'Thủy': return 'text-[#0284c7]'; // Blue
      case 'Hỏa': return 'text-[#dc2626]'; // Red
      case 'Thổ': return 'text-[#d97706]'; // Amber
      default: return 'text-red-700';
    }
  };

  // Render individual star with Tứ Hóa badge if applicable
  const renderStarWithTuHoa = (star: StarDetail, defaultClass: string) => {
    const match = star.name.match(/^(.*?)\s*\((Hóa [A-ZÀ-Ỹa-zà-ỹ]+)\)$/);
    if (match) {
      const baseName = match[1];
      const hoaName = match[2];
      return (
        <span className="inline-flex items-center gap-0.5 flex-wrap">
          <span className={defaultClass}>{baseName}</span>
          <span className="text-[8px] font-black text-white bg-purple-700 px-1 py-0.2 rounded leading-none shadow-2xs">
            {hoaName}
          </span>
          {renderStarBrightness(star.brightness)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center">
        <span className={defaultClass}>{star.name}</span>
        {renderStarBrightness(star.brightness)}
      </span>
    );
  };

  // Render an individual Palace Cell
  const renderPalaceCell = (branch: string) => {
    const palace = getPalaceByBranch(branch);
    if (!palace) return <div className="border border-gray-300 p-1.5 min-h-[180px]" />;

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
        className={`border border-[#1c4a78]/30 p-1.5 flex flex-col justify-between min-h-[195px] bg-[#ffffff] transition hover:bg-amber-50/30 text-xs relative ${
          palace.isMenh ? 'bg-red-50/20' : ''
        }`}
      >
        {/* Top Header of Palace: Can Chi (left) | Cung Name (center) | Dai Han (right) */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-0.5 text-[#1c2434]">
          <span className="text-[10px] font-bold text-gray-500">
            {palace.stem}.{palace.branch}
          </span>
          <div className="flex items-center space-x-1">
            <span
              className={`font-black uppercase tracking-wider text-[11px] ${
                palace.isMenh ? 'text-red-700 underline decoration-red-400 underline-offset-2' : 'text-[#112244]'
              }`}
            >
              {palace.cungName}
            </span>
            {palace.isThan && (
              <span className="text-[8.5px] px-1 py-0.2 bg-red-600 text-white font-extrabold rounded">
                THÂN
              </span>
            )}
          </div>
          <span className="text-[10.5px] font-black text-gray-800">
            {palace.daiHanAge}
          </span>
        </div>

        {/* Main Stars (Chính tinh) */}
        <div className="py-0.5 border-b border-dashed border-gray-200 text-center">
          {palace.mainStars.length === 0 ? (
            <span className="text-[10px] italic text-gray-400 font-medium">Vô chính diệu</span>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-x-1.5">
              {palace.mainStars.map((star, sIdx) => (
                <div key={sIdx} className="leading-tight">
                  {renderStarWithTuHoa(star, `font-black text-[11px] ${getMainStarColor(star)}`)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sub Stars: 2 Columns (Left: Cát Tinh / Tứ Hóa - Right: Sát Tinh / Hung Tinh) */}
        <div className="grid grid-cols-2 gap-1 text-[9.5px] leading-tight flex-1 py-1">
          {/* Left Column: Cát tinh & Tứ hóa */}
          <div className="space-y-0.5 pr-0.5 border-r border-gray-100">
            {tuHoaStars.map((star, idx) => (
              <div key={`th-${idx}`}>
                {renderStarWithTuHoa(star, 'font-bold text-purple-700')}
              </div>
            ))}
            {catStars.map((star, idx) => (
              <div key={`cat-${idx}`} className="text-[#15803d] font-semibold">
                {renderStarWithTuHoa(star, 'text-[#15803d] font-semibold')}
              </div>
            ))}
          </div>

          {/* Right Column: Sát tinh & Hung tinh */}
          <div className="space-y-0.5 pl-0.5">
            {satStars.map((star, idx) => (
              <div key={`sat-${idx}`} className="text-[#dc2626] font-semibold">
                {renderStarWithTuHoa(star, 'text-[#dc2626] font-semibold')}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer of Palace (Chi, Vòng Tràng Sinh, Tiểu hạn) */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-0.5 text-[9.5px] text-gray-600">
          <span className="font-bold text-gray-700">{palace.branch}</span>
          <span className="font-bold text-blue-700">
            {vongStars.find((s) => s.type === 'Vòng Sao' && s.element === 'Thủy')?.name || ''}
          </span>
          <span className="font-mono text-gray-500 font-medium">
            Th{(palace.index % 12) + 1}
          </span>
        </div>

        {/* Tuần / Triệt Tag Badge Overlay */}
        {palace.tuanTriet && palace.tuanTriet.length > 0 && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-0.5 pointer-events-none">
            {palace.tuanTriet.map((mark, mIdx) => (
              <span
                key={mIdx}
                className={`text-[8px] font-black text-white px-1.5 py-0.2 rounded shadow-xs uppercase tracking-wider ${
                  mark === 'Triệt' ? 'bg-[#1b3b6f]' : 'bg-[#0e8c62]'
                }`}
              >
                {mark}
              </span>
            ))}
          </div>
        )}
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

      {/* Action Toolbar (Matching hocvienlyso.org tools) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200 p-3 rounded-lg shadow-xs no-print">
        <div className="text-xs text-gray-700 font-medium">
          Lá số Tử Vi Đẩu Số: <span className="font-bold text-gray-900">{personal.fullName}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Phóng to */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#27303f] hover:bg-[#1a222e] border border-amber-500/40 rounded text-xs font-semibold text-amber-300 transition shadow-2xs cursor-pointer"
            title="Mở ảnh lá số để xem và nhấn giữ sao chép trên điện thoại"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Phóng to</span>
          </button>

          {/* Sao chép ảnh */}
          <button
            type="button"
            onClick={handleCopyImage}
            disabled={copyStatus === 'copying'}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142e56] rounded text-xs font-semibold text-white transition shadow-2xs cursor-pointer"
            title="Sao chép ảnh lá số hoặc chia sẻ"
          >
            {copyStatus === 'copied' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đã sao chép!</span>
              </>
            ) : copyStatus === 'copying' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang chép...</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép ảnh</span>
              </>
            )}
          </button>

          {/* Tải ảnh */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={downloading}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#0e8c62] hover:bg-[#0a7552] rounded text-xs font-semibold text-white transition shadow-2xs cursor-pointer"
            title="Tải ảnh lá số chuẩn 1440x2000 px"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Tải ảnh</span>
          </button>

          {/* In lá số */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#c8860a] hover:bg-amber-700 rounded text-xs font-semibold text-white transition shadow-2xs cursor-pointer"
            title="In lá số ra giấy"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In lá số</span>
          </button>

          {/* Lưu lá số */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 transition cursor-pointer"
            title="Lưu lá số vào tài khoản"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c8860a]" />
            <span>Lưu lá số</span>
          </button>
        </div>
      </div>

      {/* Main Chart Sheet Container */}
      <div ref={containerRef} className="print-container w-full flex flex-col items-center">
        {/* Mobile View Toggle Bar */}
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
              width: isZoomFit && scale < 1 ? `${720 * scale}px` : 'auto',
              overflow: 'hidden',
            }}
          >
            {/* Traditional 720 x 1000 Chart (Outputs to exact 1440 x 2000 px) */}
            <div
              ref={chartRef}
              id="ziwei-printable-chart"
              className="relative bg-[#ffffff] border-2 border-[#1c4a78] p-2 shadow-md overflow-hidden select-none"
              style={{
                width: '720px',
                minWidth: '720px',
                maxWidth: '720px',
                minHeight: '1000px',
                zoom: isZoomFit && scale < 1 ? scale : undefined,
                backgroundColor: '#ffffff',
              }}
            >
              {/* 4x4 Grid of 12 Palaces with Central Thiên Bàn */}
              <div className="relative z-10 grid grid-cols-4 border border-[#1c4a78]/40 bg-white">
                {/* Row 1: Tỵ, Ngọ, Mùi, Thân */}
                {renderPalaceCell('Tỵ')}
                {renderPalaceCell('Ngọ')}
                {renderPalaceCell('Mùi')}
                {renderPalaceCell('Thân')}

                {/* Row 2: Thìn, Central Thiên Bàn (Col 2-3, Row 2-3), Dậu */}
                {renderPalaceCell('Thìn')}
                <div className="col-span-2 row-span-2 border border-[#1c4a78]/40 p-3 flex flex-col justify-between items-center text-center bg-white relative">
                  {/* Thiên Bàn Header: Official Logo Lữ Phúc */}
                  <div className="w-full flex flex-col items-center border-b border-gray-200 pb-2">
                    <div className="flex items-center space-x-2">
                      <img src="/logo.png" alt="Lữ Phúc" className="w-8 h-8 object-contain" />
                      <div className="text-left">
                        <div className="text-sm font-black text-[#1b3b6f] uppercase tracking-wider">
                          BÁT TỰ LỮ PHÚC
                        </div>
                        <div className="text-[9px] font-bold text-[#c8860a] tracking-widest uppercase">
                          TỬ VI ĐẨU SỐ TOÀN THƯ
                        </div>
                      </div>
                    </div>

                    <h2 className="text-lg font-black text-gray-900 uppercase mt-1 tracking-wide">
                      {personal.fullName}
                    </h2>
                    <div className="text-[10.5px] text-gray-700 font-semibold mt-0.5">
                      <span className="font-bold text-[#8c1d1d]">{personal.genderLabel}</span> - {personal.lunarAge || 37} tuổi (năm {personal.currentYearCanChi || 'Bính Ngọ'})
                    </div>
                  </div>

                  {/* Core Academic Metadata matching hocvienlyso.org */}
                  <div className="w-full py-1 text-[11px] leading-snug space-y-0.5 text-gray-800">
                    <div className="font-black text-blue-900 text-xs">
                      {personal.menhMainStar || 'Mệnh Vô Chính Diệu'}
                    </div>
                    <div>
                      Bản mệnh: <span className="font-bold text-[#8c1d1d]">{personal.menhElement}</span> - <span className="font-bold text-blue-900">{personal.cuc}</span>
                    </div>
                    <div>
                      Mệnh quái: <span className="font-bold text-gray-900">{personal.menhQuai || 'Khảm'}</span> | Thân cư <span className="font-bold text-purple-900">{personal.thanCungName}</span>
                    </div>
                    <div>
                      Chủ mệnh: <span className="font-bold text-[#112244]">{personal.menhChu || 'Tham Lang'}</span> - Chủ thân: <span className="font-bold text-[#112244]">{personal.thanChu || 'Hỏa Tinh'}</span>
                    </div>
                    {personal.hanCuuCung && (
                      <div className="text-[10px] text-amber-800 font-semibold">
                        Hạn Cửu Cung năm {personal.currentYearCanChi || 'Bính Ngọ'}: <span className="font-bold text-red-700">{personal.hanCuuCung}</span>
                      </div>
                    )}
                  </div>

                  {/* Mini 4 Pillars Table */}
                  <div className="w-full border border-gray-200 rounded text-[9px] overflow-hidden my-1">
                    <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-600 py-0.5">
                      <div>NĂM</div>
                      <div>THÁNG</div>
                      <div>NGÀY</div>
                      <div>GIỜ</div>
                    </div>
                    <div className="grid grid-cols-4 font-black text-gray-900 py-0.5 border-b border-gray-100">
                      <div>{personal.miniBazi?.year.can} {personal.miniBazi?.year.chi}</div>
                      <div>{personal.miniBazi?.month.can} {personal.miniBazi?.month.chi}</div>
                      <div>{personal.miniBazi?.day.can} {personal.miniBazi?.day.chi}</div>
                      <div>{personal.miniBazi?.hour.can} {personal.miniBazi?.hour.chi}</div>
                    </div>
                    <div className="grid grid-cols-4 text-gray-500 py-0.5 text-[8.5px]">
                      <div>Dương Lịch</div>
                      <div className="col-span-3 text-right pr-2 font-mono">{personal.solarDateStr}</div>
                    </div>
                    <div className="grid grid-cols-4 text-gray-500 py-0.5 text-[8.5px] bg-gray-50/50">
                      <div>Âm Lịch</div>
                      <div className="col-span-3 text-right pr-2 font-mono">{personal.lunarDateStr}</div>
                    </div>
                  </div>

                  {/* Footer Brand Link */}
                  <div className="border-t border-gray-200 pt-1 w-full text-[9px] text-gray-500">
                    Lập tại <strong className="text-[#1b3b6f]">https://weblaso-five.vercel.app</strong>
                  </div>
                </div>
                {renderPalaceCell('Dậu')}

                {/* Row 3: Mão, (Central continued), Tuất */}
                {renderPalaceCell('Mão')}
                {renderPalaceCell('Tuất')}

                {/* Row 4: Dần, Sửu, Tý, Hợi */}
                {renderPalaceCell('Dần')}
                {renderPalaceCell('Sửu')}
                {renderPalaceCell('Tý')}
                {renderPalaceCell('Hợi')}
              </div>

              {/* Bottom 5 Elements & Brightness Legend matching hocvienlyso.org */}
              <div className="mt-1 flex flex-wrap items-center justify-between text-[9px] text-gray-600 px-1 border-t border-gray-200 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Độ sáng:</span>
                  <span>M: Miếu</span>
                  <span>V: Vượng</span>
                  <span>Đ: Đắc</span>
                  <span>B: Bình</span>
                  <span>H: Hãm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Ngũ hành:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#475569]">
                    <span className="w-2 h-2 rounded-full bg-[#475569]"></span>Kim
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#16a34a]">
                    <span className="w-2 h-2 rounded-full bg-[#16a34a]"></span>Mộc
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#0284c7]">
                    <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>Thủy
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#dc2626]">
                    <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>Hỏa
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#d97706]">
                    <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>Thổ
                  </span>
                </div>
              </div>

              {/* Transparent high-res overlay for right-click copy & mobile touch */}
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
        💡 Mẹo: Bạn có thể <strong>nhấp chuột phải</strong> (hoặc bấm nút <strong>&ldquo;Phóng to&rdquo;</strong> trên điện thoại) để chọn <strong>&ldquo;Sao chép hình ảnh&rdquo;</strong> gửi qua Zalo, Facebook Messenger.
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
              <span>👉</span>
              <span>
                <strong>Nhấn giữ vào ảnh 1 giây</strong> để chọn <em>&ldquo;Lưu vào Ảnh&rdquo;</em> hoặc <em>&ldquo;Sao chép hình ảnh&rdquo;</em>.
              </span>
            </div>

            <div className="p-4 overflow-y-auto flex items-center justify-center bg-gray-50">
              <img
                src={chartImageUrl}
                alt={`Lá số Tử Vi - ${personal.fullName}`}
                className="max-w-full h-auto rounded shadow-sm border border-gray-200 select-auto"
                style={{ WebkitTouchCallout: 'default' }}
              />
            </div>

            <div className="p-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              <button
                type="button"
                onClick={handleDownloadImage}
                className="px-3 py-1.5 bg-[#0e8c62] hover:bg-[#0a7552] text-white text-xs font-semibold rounded shadow-xs"
              >
                Tải ảnh (PNG)
              </button>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded"
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
