'use client';

import React, { useRef } from 'react';
import { SimCalculationResult } from '@/domain/sim';
import { HexagramLine } from '@/components/iching/HexagramLine';
import { getElementColor } from '@/components/bazi/BaziChartColors';
import {
  Printer,
  Bookmark,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  ShieldCheck,
  Heart,
  Briefcase,
  Coins,
  Home,
  Compass,
} from 'lucide-react';

interface SimResultViewProps {
  result: SimCalculationResult;
  onReset?: () => void;
}

export function SimResultView({ result, onReset }: SimResultViewProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { overview, baziDetail, hexagrams, aspects, auxiliary } = result;

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartType: 'ICHING',
          title: `Phong thủy Sim ${result.phoneNumber} - ${overview.originalHexagramName}`,
          chartData: result,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Lưu kết quả phân tích sim thành công!');
      } else {
        alert(data.message || 'Vui lòng đăng nhập để lưu kết quả');
      }
    } catch (e) {
      alert('Lỗi khi lưu kết quả sim');
    }
  };

  // Reverse lines for top-to-bottom display
  const originalLinesDesc = [...hexagrams.original.lines].reverse();
  const changedLinesDesc = [...hexagrams.changed.lines].reverse();

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-xs gap-3 no-print">
        <div className="text-xs text-gray-700 font-semibold">
          Luận giải Sim: <strong className="text-blue-800 text-sm font-bold">{result.phoneNumber}</strong> •{' '}
          Quẻ: <strong className="text-[#c8860a]">{overview.originalHexagramName}</strong> (Hào {overview.movingLine} động)
        </div>
        <div className="flex items-center space-x-2">
          {onReset && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-semibold text-gray-700 transition"
            >
              Luận số khác
            </button>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 transition"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c8860a]" />
            <span>Lưu kết quả</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#c8860a] hover:bg-amber-700 rounded text-xs font-semibold text-white transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In kết quả</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Container with BACKGROUND.png */}
      <div
        ref={chartRef}
        id="sim-printable-document"
        className="relative bg-white border-2 border-[#2b78c5] rounded shadow-md overflow-hidden"
        style={{
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
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        {/* Foreground Content Container with semi-translucent backdrop */}
        <div className="relative z-10 w-full p-4 md:p-8 space-y-8 bg-white/75 backdrop-blur-[0.5px]">
          {/* HEADER: Brand & Document Title */}
          <div className="border-b-[1.5px] border-[#3182ce] pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
                  <polygon
                    points="50,2 62,38 98,50 62,62 50,98 38,62 2,50 38,38"
                    fill="#1e293b"
                    stroke="#c8860a"
                    strokeWidth="2.5"
                  />
                  <polygon
                    points="50,14 75,25 86,50 75,75 50,86 25,75 14,50 25,25"
                    fill="#2b3b55"
                    stroke="#e2b144"
                    strokeWidth="1.5"
                  />
                  <circle cx="50" cy="50" r="22" fill="#0f172a" stroke="#c8860a" strokeWidth="2" />
                  <text x="50" y="57" textAnchor="middle" fill="#fef08a" fontSize="20" fontWeight="900">
                    LP
                  </text>
                </svg>
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d5ca8]">
                  PHONG THỦY KINH DỊCH LỮ PHÚC
                </span>
                <h1 className="text-xl md:text-2xl font-black text-[#112244] uppercase tracking-wide">
                  XEM PHONG THỦY SIM: {result.phoneNumber}
                </h1>
              </div>
            </div>

            <div className="text-xs text-right font-medium text-gray-700">
              <div>Thân chủ: <strong className="text-gray-900 uppercase font-bold">{result.ownerName}</strong> ({result.genderLabel})</div>
              <div>Ngày sinh: <span className="text-red-700 font-bold">{result.birthDateSolar}</span></div>
              <div>Âm lịch: <span className="text-emerald-800 font-bold">{result.birthDateLunar}</span></div>
            </div>
          </div>

          {/* 1. HERO SUMMARY CARD (Kết luận nhanh theo Kinh Dịch) */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border-2 border-amber-300 rounded-lg p-5 shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <span className="inline-block px-3 py-0.5 bg-amber-200/80 text-amber-900 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                  Kết luận nhanh theo Kinh Dịch
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Sim <span className="text-[#034687]">{result.phoneNumber}</span>
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm font-semibold text-gray-800">
                  <div>
                    Quẻ chủ: <strong className="text-red-700 text-sm font-extrabold">{overview.originalHexagramName}</strong>
                  </div>
                  <div>•</div>
                  <div>
                    Hào động: <strong className="text-blue-800 font-bold">{overview.movingLine}</strong>
                  </div>
                  <div>•</div>
                  <div>
                    Ngũ hành sim: <strong className="text-amber-800 font-bold">{overview.simElement}</strong>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed pt-1">
                  {overview.recommendation}
                </p>
              </div>

              {/* Score Badge */}
              <div className="flex flex-col items-center justify-center p-4 bg-white/90 border border-amber-300 rounded-lg shadow-2xs min-w-[140px] text-center">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Điểm tổng hợp</div>
                <div className="text-3xl md:text-4xl font-black text-[#c8860a] my-0.5">
                  {overview.totalScore}
                  <span className="text-sm font-medium text-gray-400">/10</span>
                </div>
                <div className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded uppercase">
                  {overview.scoreRating}
                </div>
              </div>
            </div>
          </div>

          {/* 2. KHÁI QUÁT MỆNH CỤC CÁ NHÂN (BÁT TỰ TỨ TRỤ) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-300 pb-2">
              <span className="w-2 h-5 bg-[#034687] rounded-xs" />
              <h3 className="text-base font-extrabold text-[#034687] uppercase tracking-wide">
                Khái Quát Mệnh Cục Thân Chủ
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 01: Thông tin bản mệnh */}
              <div className="bg-white/85 border border-gray-200 rounded p-3.5 space-y-2 text-xs">
                <div className="font-extrabold text-[#c8860a] uppercase border-b border-gray-100 pb-1 flex justify-between">
                  <span>01. Bản Mệnh & Cung Phi</span>
                  <span className="font-bold text-gray-400">#Cơ bản</span>
                </div>
                <div className="space-y-1 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bản mệnh (Nạp âm):</span>
                    <strong className="text-amber-800">{baziDetail.napAm}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ngũ hành bản mệnh:</span>
                    <strong className="text-blue-800">{baziDetail.menhElement}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cung phi Bát Trạch:</span>
                    <strong className="text-gray-900">{baziDetail.cungPhi} (Số {baziDetail.quaiNumber})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tiết khí sinh:</span>
                    <span className="font-semibold text-gray-800">{result.solarTerm}</span>
                  </div>
                </div>
              </div>

              {/* 02: Tứ Trụ Bát Tự */}
              <div className="bg-white/85 border border-gray-200 rounded p-3.5 space-y-2 text-xs md:col-span-2">
                <div className="font-extrabold text-[#c8860a] uppercase border-b border-gray-100 pb-1 flex justify-between">
                  <span>02. Bát Tự Tứ Trụ Thân Chủ</span>
                  <span className="font-bold text-gray-400">#Tứ Trụ</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <div className="bg-gray-50/80 p-2 rounded border border-gray-200">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Trụ Giờ</div>
                    <div className="font-black text-xs text-gray-900 mt-1">
                      {baziDetail.pillars.hour.stem} {baziDetail.pillars.hour.branch}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{baziDetail.pillars.hour.napAm}</div>
                  </div>
                  <div className="bg-amber-50/80 p-2 rounded border border-amber-300 ring-1 ring-amber-400/40">
                    <div className="text-[10px] text-amber-800 font-black uppercase">Trụ Ngày (Nhật Chủ)</div>
                    <div className="font-black text-xs text-red-700 mt-1">
                      {baziDetail.pillars.day.stem} {baziDetail.pillars.day.branch}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{baziDetail.pillars.day.napAm}</div>
                  </div>
                  <div className="bg-gray-50/80 p-2 rounded border border-gray-200">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Trụ Tháng</div>
                    <div className="font-black text-xs text-gray-900 mt-1">
                      {baziDetail.pillars.month.stem} {baziDetail.pillars.month.branch}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{baziDetail.pillars.month.napAm}</div>
                  </div>
                  <div className="bg-gray-50/80 p-2 rounded border border-gray-200">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Trụ Năm</div>
                    <div className="font-black text-xs text-gray-900 mt-1">
                      {baziDetail.pillars.year.stem} {baziDetail.pillars.year.branch}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{baziDetail.pillars.year.napAm}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. QUẺ DỊCH CHI TIẾT (QUẺ CHỦ & QUẺ BIẾN) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-300 pb-2">
              <span className="w-2 h-5 bg-[#034687] rounded-xs" />
              <h3 className="text-base font-extrabold text-[#034687] uppercase tracking-wide">
                Kinh Dịch Luận Sim: Quẻ Chủ & Quẻ Biến
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/85 border border-[#3182ce]/40 rounded-lg p-5">
              {/* Cột Trái: Quẻ Chủ */}
              <div className="flex flex-col items-center text-center space-y-3 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
                <span className="text-xs font-extrabold px-3 py-0.5 bg-blue-50 text-blue-800 rounded uppercase">
                  Quẻ Chủ (Gốc Rễ Khí Số)
                </span>
                <h4 className="text-lg md:text-xl font-black text-[#034687] uppercase">
                  {hexagrams.original.name}
                </h4>
                <div className="text-xs font-bold text-gray-600">
                  {hexagrams.original.palace} • Cung {hexagrams.original.palaceElement}
                </div>

                {/* 6 Hào Graphic */}
                <div className="w-28 space-y-1 py-2">
                  {originalLinesDesc.map((line) => (
                    <HexagramLine
                      key={line.lineIndex}
                      polarity={line.polarity}
                      isMoving={line.isMoving}
                      size="md"
                    />
                  ))}
                </div>

                <div className="bg-gray-50 p-2.5 rounded text-xs text-gray-700 w-full text-left">
                  <div className="font-bold text-amber-800 uppercase text-[10px]">Thoán Ca:</div>
                  <div className="font-bold text-gray-900">{hexagrams.thoanCa}</div>
                  <div className="font-bold text-amber-800 uppercase text-[10px] mt-1.5">Phán Từ:</div>
                  <div className="text-gray-700">{hexagrams.judgment}</div>
                </div>
              </div>

              {/* Cột Phải: Quẻ Biến */}
              <div className="flex flex-col items-center text-center space-y-3 md:pl-2">
                <span className="text-xs font-extrabold px-3 py-0.5 bg-emerald-50 text-emerald-800 rounded uppercase">
                  Quẻ Biến (Hậu Vận & Chuyển Hóa)
                </span>
                <h4 className="text-lg md:text-xl font-black text-emerald-900 uppercase">
                  {hexagrams.changed.name}
                </h4>
                <div className="text-xs font-bold text-gray-600">
                  {hexagrams.changed.palace} • Cung {hexagrams.changed.palaceElement}
                </div>

                {/* 6 Hào Graphic */}
                <div className="w-28 space-y-1 py-2">
                  {changedLinesDesc.map((line) => (
                    <HexagramLine
                      key={line.lineIndex}
                      polarity={line.polarity}
                      isMoving={false}
                      size="md"
                    />
                  ))}
                </div>

                <div className="bg-gray-50 p-2.5 rounded text-xs text-gray-700 w-full text-left">
                  <div className="font-bold text-emerald-800 uppercase text-[10px]">Biến Hào ({hexagrams.movingLineName}):</div>
                  <div className="text-gray-700">{hexagrams.movingLineMeaning}</div>
                  <div className="font-bold text-emerald-800 uppercase text-[10px] mt-1.5">Ý Nghĩa Quẻ Biến:</div>
                  <div className="text-gray-700">{hexagrams.changed.commentary?.meaning || hexagrams.changed.judgment}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. PHỐI QUẺ VỚI BÁT TỰ: 5 PHƯƠNG DIỆN THEN CHỐT */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-300 pb-2">
              <span className="w-2 h-5 bg-[#034687] rounded-xs" />
              <h3 className="text-base font-extrabold text-[#034687] uppercase tracking-wide">
                Đánh Giá 5 Phương Diện Của Sim Theo Bát Tự
              </h3>
            </div>

            <div className="space-y-4">
              {/* A. Thế vận */}
              <div className="bg-white/85 border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-purple-700" />
                    <span className="font-black text-sm text-gray-900 uppercase">1. Thế Vận</span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                      {aspects.theVan.rating}
                    </span>
                  </div>
                  <div className="font-mono font-black text-base text-purple-700">
                    {aspects.theVan.scorePercent}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${aspects.theVan.scorePercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-700 pt-1">
                  <strong>Nhận xét:</strong> {aspects.theVan.generalReview}
                </p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  {aspects.theVan.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* B. Tài lộc */}
              <div className="bg-white/85 border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span className="font-black text-sm text-gray-900 uppercase">2. Tài Lộc (Thê Tài)</span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                      {aspects.taiLoc.rating}
                    </span>
                  </div>
                  <div className="font-mono font-black text-base text-amber-600">
                    {aspects.taiLoc.scorePercent}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${aspects.taiLoc.scorePercent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 flex space-x-4">
                  <span>Địa chi Tài: <strong>{aspects.taiLoc.dieuChi}</strong></span>
                  <span>Ngũ hành Tài: <strong>{aspects.taiLoc.nguHanh}</strong></span>
                </div>
                <p className="text-xs text-gray-700">
                  <strong>Nhận xét:</strong> {aspects.taiLoc.generalReview}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-emerald-50/70 p-2 rounded border border-emerald-200">
                    <span className="font-bold text-emerald-800">Điểm mạnh:</span>
                    <ul className="list-disc pl-4 text-gray-700 mt-0.5 space-y-0.5">
                      {aspects.taiLoc.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-50/70 p-2 rounded border border-rose-200">
                    <span className="font-bold text-rose-800">Lưu ý:</span>
                    <ul className="list-disc pl-4 text-gray-700 mt-0.5 space-y-0.5">
                      {aspects.taiLoc.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* C. Công danh */}
              <div className="bg-white/85 border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="font-black text-sm text-gray-900 uppercase">3. Công Danh (Quan Quỷ)</span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                      {aspects.congDanh.rating}
                    </span>
                  </div>
                  <div className="font-mono font-black text-base text-blue-600">
                    {aspects.congDanh.scorePercent}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${aspects.congDanh.scorePercent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 flex space-x-4">
                  <span>Địa chi Quan: <strong>{aspects.congDanh.dieuChi}</strong></span>
                  <span>Ngũ hành Quan: <strong>{aspects.congDanh.nguHanh}</strong></span>
                </div>
                <p className="text-xs text-gray-700">
                  <strong>Nhận xét:</strong> {aspects.congDanh.generalReview}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-emerald-50/70 p-2 rounded border border-emerald-200">
                    <span className="font-bold text-emerald-800">Điểm mạnh:</span>
                    <ul className="list-disc pl-4 text-gray-700 mt-0.5 space-y-0.5">
                      {aspects.congDanh.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-50/70 p-2 rounded border border-rose-200">
                    <span className="font-bold text-rose-800">Lưu ý:</span>
                    <ul className="list-disc pl-4 text-gray-700 mt-0.5 space-y-0.5">
                      {aspects.congDanh.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* D. Tình cảm */}
              <div className="bg-white/85 border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span className="font-black text-sm text-gray-900 uppercase">
                      4. Tình Cảm & Hôn Nhân ({aspects.tinhCam.targetRole})
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                      {aspects.tinhCam.rating}
                    </span>
                  </div>
                  <div className="font-mono font-black text-base text-rose-600">
                    {aspects.tinhCam.scorePercent}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all"
                    style={{ width: `${aspects.tinhCam.scorePercent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 flex space-x-4">
                  <span>Hào vị đối tượng: <strong>{aspects.tinhCam.targetRole}</strong></span>
                  <span>Địa chi: <strong>{aspects.tinhCam.dieuChi}</strong> ({aspects.tinhCam.nguHanh})</span>
                </div>
                <p className="text-xs text-gray-700">
                  <strong>Nhận xét:</strong> {aspects.tinhCam.generalReview}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-emerald-50/70 p-2 rounded border border-emerald-200">
                    <span className="font-bold text-emerald-800">Điểm mạnh:</span>
                    <ul className="list-disc pl-4 text-gray-700 mt-0.5 space-y-0.5">
                      {aspects.tinhCam.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-50/70 p-2 rounded border border-rose-200">
                    <span className="font-bold text-rose-800">Lưu ý:</span>
                    <ul className="list-disc pl-4 text-gray-700 mt-0.5 space-y-0.5">
                      {aspects.tinhCam.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* E. Gia đạo */}
              <div className="bg-white/85 border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-emerald-600" />
                    <span className="font-black text-sm text-gray-900 uppercase">5. Gia Đạo</span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      {aspects.giaDao.rating}
                    </span>
                  </div>
                  <div className="font-mono font-black text-base text-emerald-600">
                    {aspects.giaDao.scorePercent}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${aspects.giaDao.scorePercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-700 pt-1">
                  <strong>Nhận xét:</strong> {aspects.giaDao.generalReview}
                </p>
                <div className="bg-emerald-50/70 p-2 rounded border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-800">Điểm thuận:</span>
                  <ul className="list-disc pl-4 text-gray-700 mt-0.5 space-y-0.5">
                    {aspects.giaDao.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 5. PHÉP LUẬN BỔ TRỢ (4 TIÊU CHÍ PHỔ BIẾN) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-300 pb-2">
              <span className="w-2 h-5 bg-[#034687] rounded-xs" />
              <h3 className="text-base font-extrabold text-[#034687] uppercase tracking-wide">
                Phép Luận Bổ Trợ Theo Phong Thủy Dân Gian
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* 1. Ngũ hành sim vs Mệnh chủ */}
              <div className="bg-white/85 border border-gray-200 rounded p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-900">1. Ngũ Hành Sim vs Mệnh Chủ</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${auxiliary.simElementVsMaster.isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {auxiliary.simElementVsMaster.scoreBonus >= 1 ? '+1.5đ' : '+0.5đ'}
                  </span>
                </div>
                <div className="text-gray-700">
                  {auxiliary.simElementVsMaster.comment}
                </div>
              </div>

              {/* 2. Âm Dương chẵn lẻ */}
              <div className="bg-white/85 border border-gray-200 rounded p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-900">2. Cân Bằng Âm Dương (Chẵn/Lẻ)</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px]">
                    +{auxiliary.yinYang.scoreBonus}đ
                  </span>
                </div>
                <div className="text-gray-700">
                  {auxiliary.yinYang.evenCount} số âm ({auxiliary.yinYang.evenPercent}%) • {auxiliary.yinYang.oddCount} số dương ({auxiliary.yinYang.oddPercent}%).
                  <br />
                  {auxiliary.yinYang.comment}
                </div>
              </div>

              {/* 3. Bói 4 số đuôi chia 80 */}
              <div className="bg-white/85 border border-gray-200 rounded p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-900">3. Chiêm Bói 4 Số Cuối (Chia 80)</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px]">
                    {auxiliary.last4Digits.nature} (+{auxiliary.last4Digits.scoreBonus}đ)
                  </span>
                </div>
                <div className="text-gray-700">
                  Đuôi <strong>{auxiliary.last4Digits.last4Str}</strong> (Số linh ứng: <strong>{auxiliary.last4Digits.calcRemainder}</strong>):
                  <br />
                  <em>"{auxiliary.last4Digits.meaning}"</em>
                </div>
              </div>

              {/* 4. Dạng sim số đẹp */}
              <div className="bg-white/85 border border-gray-200 rounded p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-900">4. Thẩm Mỹ Sim Số Đẹp</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[11px]">
                    +{auxiliary.nicePatterns.scoreBonus}đ
                  </span>
                </div>
                <div className="text-gray-700">
                  Dạng số: <strong>{auxiliary.nicePatterns.description}</strong>.
                  <br />
                  Thế số hài hòa, dễ nhớ, tạo ấn tượng tốt khi giao dịch và liên lạc.
                </div>
              </div>
            </div>
          </div>

          {/* 6. GỢI Ý SỬ DỤNG & KẾT LUẬN QUYẾT ĐỊNH */}
          <div className="bg-amber-50/60 border border-amber-300 rounded-lg p-5 space-y-3">
            <h4 className="font-extrabold text-[#034687] text-base uppercase">
              Kết Luận & Khuyến Nghị Sử Dụng
            </h4>
            <div className="text-xs md:text-sm text-gray-800 leading-relaxed space-y-2">
              <p>
                Số sim <strong>{result.phoneNumber}</strong> đạt <strong>{overview.totalScore}/10 điểm</strong> ({overview.scoreRating}). Sim hội tụ được thế quẻ tốt từ Kinh Dịch và tương hợp với mệnh cục Bát Tự ngày giờ sinh của thân chủ.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Thế vận: {aspects.theVan.scorePercent}% (Cát lợi)</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sim tương sinh bản mệnh (+1.5đ)</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đuôi {auxiliary.last4Digits.last4Str} ({auxiliary.last4Digits.nature})</span>
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER: Attribution & Brand */}
          <div className="border-t-[1.5px] border-[#3182ce] pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-700 font-medium">
            <div>
              Kết quả lập tại: <strong className="text-[#034687] font-bold">LỮ PHÚC (luphuc.vn)</strong>
            </div>
            <div className="text-gray-500 mt-1 sm:mt-0">
              Kinh Dịch Lục Hào • Bát Tự Tử Bình • Phong Thủy Lạc Thư
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
