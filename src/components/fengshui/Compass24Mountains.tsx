'use client';

import React, { useRef, useState, useCallback } from 'react';
import {
  QuaiMenh,
  Direction8,
  BatTrachStar,
  MOUNTAINS_24,
  BAT_TRACH_MAP,
  STAR_DETAILS,
  evaluateMountainDegree,
} from '@/domain/fengshui';
import { Compass, RotateCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Compass24MountainsProps {
  quaiMenh: QuaiMenh;
  quaiElement: string;
  group: string;
  degree: number;
  onDegreeChange: (deg: number) => void;
}

// 8 Directions with their center angle and range
const DIRECTION_SECTORS: Array<{
  dir: Direction8;
  startDeg: number;
  endDeg: number;
  centerDeg: number;
}> = [
  { dir: 'Bắc', startDeg: 337.5, endDeg: 22.5, centerDeg: 0 },
  { dir: 'Đông Bắc', startDeg: 22.5, endDeg: 67.5, centerDeg: 45 },
  { dir: 'Đông', startDeg: 67.5, endDeg: 112.5, centerDeg: 90 },
  { dir: 'Đông Nam', startDeg: 112.5, endDeg: 157.5, centerDeg: 135 },
  { dir: 'Nam', startDeg: 157.5, endDeg: 202.5, centerDeg: 180 },
  { dir: 'Tây Nam', startDeg: 202.5, endDeg: 247.5, centerDeg: 225 },
  { dir: 'Tây', startDeg: 247.5, endDeg: 292.5, centerDeg: 270 },
  { dir: 'Tây Bắc', startDeg: 292.5, endDeg: 337.5, centerDeg: 315 },
];

/** Convert compass degree (0 is North / Top, 90 is East / Right) to SVG (x, y) */
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/** Generate an SVG arc path between two radii and two angles */
function describeDonutSegment(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number
) {
  // Normalize angles
  let diff = (endAngle - startAngle + 360) % 360;
  if (diff === 0) diff = 360;

  const startOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle + diff);
  const startInner = polarToCartesian(cx, cy, rInner, startAngle + diff);
  const endInner = polarToCartesian(cx, cy, rInner, startAngle);

  const largeArcFlag = diff > 180 ? 1 : 0;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ');
}

export function Compass24Mountains({
  quaiMenh,
  quaiElement,
  group,
  degree,
  onDegreeChange,
}: Compass24MountainsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const cx = 250;
  const cy = 250;
  const rCompass = 240;
  const r8Outer = 222;
  const r8Inner = 168;
  const r24Outer = 166;
  const r24Inner = 112;
  const rCenter = 110;

  const dirMap = BAT_TRACH_MAP[quaiMenh];
  const evalResult = evaluateMountainDegree(degree, quaiMenh);

  // Handle pointer interaction for direct angle selection
  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = clientX - (rect.left + rect.width / 2);
      const y = clientY - (rect.top + rect.height / 2);

      let deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (deg < 0) deg += 360;
      const roundedDeg = Math.round(deg * 2) / 2; // snap to 0.5°
      onDegreeChange(roundedDeg);
    },
    [onDegreeChange]
  );

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    handlePointer(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    handlePointer(e.clientX, e.clientY);
  };

  const handleMouseUp = () => setIsDragging(false);

  const needlePt = polarToCartesian(cx, cy, rCompass - 4, degree);
  const needleBackPt = polarToCartesian(cx, cy, 32, (degree + 180) % 360);
  const needleLeftPt = polarToCartesian(cx, cy, 14, (degree - 90 + 360) % 360);
  const needleRightPt = polarToCartesian(cx, cy, 14, (degree + 90) % 360);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-6">
      {/* Title & Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#c8860a]" />
            <h3 className="text-base font-extrabold text-gray-900 uppercase">
              La Bàn Phong Thủy Bát Trạch & 24 Sơn Hướng 360°
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Bấm hoặc rê chuột trực tiếp trên la bàn để xoay và định hướng nhà của bạn.
          </p>
        </div>

        {/* Current House Direction Badge */}
        <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-lg">
          <span className="text-xs font-bold text-gray-600">Hướng nhà:</span>
          <span className="text-sm font-black text-[#c8860a]">{degree}°</span>
          <span className="text-xs font-semibold text-gray-800">({evalResult.direction} - Sơn {evalResult.mountain})</span>
        </div>
      </div>

      {/* SVG Compass Container */}
      <div className="flex flex-col items-center justify-center select-none">
        <div className="w-full max-w-[480px] aspect-square relative touch-none">
          <svg
            ref={svgRef}
            viewBox="0 0 500 500"
            className="w-full h-full cursor-crosshair drop-shadow-md"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={(e) => {
              if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
            }}
          >
            <defs>
              {/* Radial gradient for central disc */}
              <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffdfa" />
                <stop offset="80%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
              </radialGradient>
              <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#dc2626" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Background Outer Circle */}
            <circle cx={cx} cy={cy} r={rCompass + 4} fill="#1e293b" />
            <circle cx={cx} cy={cy} r={rCompass} fill="#0f172a" stroke="#d97706" strokeWidth="2.5" />

            {/* 360 Degree Ticks */}
            {Array.from({ length: 72 }, (_, i) => i * 5).map((deg) => {
              const isMajor = deg % 30 === 0;
              const isCardinal = deg % 90 === 0;
              const r1 = rCompass - (isCardinal ? 12 : isMajor ? 8 : 4);
              const p1 = polarToCartesian(cx, cy, r1, deg);
              const p2 = polarToCartesian(cx, cy, rCompass, deg);
              return (
                <line
                  key={deg}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isCardinal ? '#fbbf24' : isMajor ? '#f59e0b' : '#64748b'}
                  strokeWidth={isCardinal ? 2 : 1}
                />
              );
            })}

            {/* Degree Text Labels (0°, 30°, ... 330°) */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const pt = polarToCartesian(cx, cy, rCompass - 18, deg);
              const label = deg === 0 ? '0° (Bắc)' : deg === 90 ? '90° (Đông)' : deg === 180 ? '180° (Nam)' : deg === 270 ? '270° (Tây)' : `${deg}°`;
              return (
                <text
                  key={`deg-${deg}`}
                  x={pt.x}
                  y={pt.y}
                  fill={deg % 90 === 0 ? '#fde047' : '#94a3b8'}
                  fontSize={deg % 90 === 0 ? '9' : '7.5'}
                  fontWeight={deg % 90 === 0 ? 'bold' : 'normal'}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {label}
                </text>
              );
            })}

            {/* 8 Bát Trạch Direction Sectors */}
            {DIRECTION_SECTORS.map((sec) => {
              const star = dirMap[sec.dir];
              const isGood = STAR_DETAILS[star]?.nature === 'Cát';
              const pathD = describeDonutSegment(cx, cy, r8Inner, r8Outer, sec.startDeg, sec.endDeg);
              const textPt = polarToCartesian(cx, cy, (r8Inner + r8Outer) / 2, sec.centerDeg);

              return (
                <g key={sec.dir}>
                  <path
                    d={pathD}
                    fill={isGood ? '#065f46' : '#991b1b'}
                    fillOpacity="0.82"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    className="transition hover:fill-opacity-95"
                  />
                  {/* Direction Title & Star Name */}
                  <text
                    x={textPt.x}
                    y={textPt.y - 6}
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {sec.dir}
                  </text>
                  <text
                    x={textPt.x}
                    y={textPt.y + 7}
                    fill={isGood ? '#a7f3d0' : '#fecdd3'}
                    fontSize="8"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {star}
                  </text>
                </g>
              );
            })}

            {/* 24 Sơn Hướng Sectors (15° each) */}
            {MOUNTAINS_24.map((m) => {
              const pathD = describeDonutSegment(cx, cy, r24Inner, r24Outer, m.start, m.end);
              const midDeg = (m.start + 7.5) % 360;
              const textPt = polarToCartesian(cx, cy, (r24Inner + r24Outer) / 2, midDeg);
              const star = dirMap[m.dir];
              const isGood = STAR_DETAILS[star]?.nature === 'Cát';
              const isSelectedMountain = evalResult.mountain === m.name;

              return (
                <g key={m.name}>
                  <path
                    d={pathD}
                    fill={
                      isSelectedMountain
                        ? '#d97706'
                        : isGood
                        ? '#047857'
                        : '#b91c1c'
                    }
                    fillOpacity={isSelectedMountain ? '1' : '0.55'}
                    stroke="#0f172a"
                    strokeWidth="1"
                  />
                  <text
                    x={textPt.x}
                    y={textPt.y}
                    fill={isSelectedMountain ? '#ffffff' : '#f8fafc'}
                    fontSize="8.5"
                    fontWeight={isSelectedMountain ? '900' : '600'}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {m.name}
                  </text>
                </g>
              );
            })}

            {/* Center Disk: User's Quái Mệnh */}
            <circle cx={cx} cy={cy} r={rCenter} fill="url(#centerGradient)" stroke="#b45309" strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r={rCenter - 8} fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3 3" />

            <text x={cx} y={cy - 34} fill="#92400e" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1">
              BÁT TRẠCH MINH CẢNH
            </text>
            <text x={cx} y={cy - 12} fill="#78350f" fontSize="18" fontWeight="900" textAnchor="middle">
              CUNG {quaiMenh.toUpperCase()}
            </text>
            <text x={cx} y={cy + 10} fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">
              Hành {quaiElement} • {group}
            </text>

            <rect x={cx - 50} y={cy + 22} width="100" height="20" rx="10" fill="#78350f" />
            <text x={cx} y={cy + 34} fill="#fef3c7" fontSize="9" fontWeight="bold" textAnchor="middle">
              {degree}° ({evalResult.direction})
            </text>

            {/* Pointer / Needle for Current House Direction */}
            <g filter="url(#needleGlow)">
              {/* Needle Polygon */}
              <polygon
                points={`${needlePt.x},${needlePt.y} ${needleRightPt.x},${needleRightPt.y} ${needleBackPt.x},${needleBackPt.y} ${needleLeftPt.x},${needleLeftPt.y}`}
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Needle Center Pin */}
              <circle cx={cx} cy={cy} r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />

              {/* Marker Arrow at Outer Rim */}
              <circle
                cx={needlePt.x}
                cy={needlePt.y}
                r="7"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>

        {/* Needle Label */}
        <div className="mt-2 text-center">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-black tracking-wide border border-red-200">
            <span>▲</span>
            <span>HƯỚNG NHÀ CỦA BẠN: {degree}° (Sơn {evalResult.mountain} — {evalResult.direction})</span>
          </span>
        </div>
      </div>

      {/* Evaluation Result for Current Direction */}
      <div
        className={`p-4 rounded-lg border text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
          evalResult.nature === 'Cát'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-red-50 border-red-200 text-red-950'
        }`}
      >
        <div className="space-y-1">
          <div className="text-sm font-bold flex items-center space-x-2">
            {evalResult.nature === 'Cát' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span>
              Hướng {evalResult.direction} ({degree}°) — Gặp Sao <strong className="uppercase">{evalResult.quaiMenhStar}</strong> ({evalResult.nature})
            </span>
          </div>
          <p className="text-xs opacity-90">
            Sơn <strong>{evalResult.mountain}</strong> ({MOUNTAINS_24.find((m) => m.name === evalResult.mountain)?.start}° - {MOUNTAINS_24.find((m) => m.name === evalResult.mountain)?.end}°).{' '}
            {evalResult.warning || 'Vị trí phân kim an toàn, khí trường ổn định.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded font-extrabold uppercase text-[11px] text-white ${
              evalResult.nature === 'Cát' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {evalResult.quaiMenhStar}
          </span>
          <span
            className={`px-2.5 py-1 rounded font-bold uppercase text-[10px] ${
              evalResult.status === 'An Toàn'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {evalResult.status}
          </span>
        </div>
      </div>

      {/* Quick Direction Selector Buttons */}
      <div className="space-y-2 pt-2 border-t">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
          Chọn nhanh 8 Hướng Chính:
        </label>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {DIRECTION_SECTORS.map((s) => {
            const star = dirMap[s.dir];
            const isGood = STAR_DETAILS[star]?.nature === 'Cát';
            const isSelected = Math.abs(degree - s.centerDeg) < 22.5;

            return (
              <button
                key={s.dir}
                type="button"
                onClick={() => onDegreeChange(s.centerDeg)}
                className={`p-2 rounded text-center transition border flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-[#c8860a] ring-2 ring-[#c8860a]/30 bg-amber-50'
                    : 'border-gray-200 hover:bg-gray-50 bg-white'
                }`}
              >
                <span className="text-xs font-bold text-gray-900">{s.dir}</span>
                <span className="text-[10px] font-mono text-gray-500">{s.centerDeg}°</span>
                <span
                  className={`mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {star}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
