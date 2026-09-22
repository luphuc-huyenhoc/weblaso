'use client';

import React, { useState } from 'react';
import {
  TrachVan,
  calculateFlyingStars,
  FlyingStarResult,
  PalaceStars,
} from '@/domain/fengshui';
import { Compass, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Home } from 'lucide-react';

interface FlyingStarsTableProps {
  degree: number;
  onDegreeChange?: (deg: number) => void;
}

export function FlyingStarsTable({ degree, onDegreeChange }: FlyingStarsTableProps) {
  const [van, setVan] = useState<TrachVan>(9); // Mặc định Vận 9 (2024 - 2043)
  const currentYear = new Date().getFullYear();

  const result: FlyingStarResult = calculateFlyingStars(van, degree, currentYear);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header & Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c8860a]" />
            <h3 className="font-extrabold text-base sm:text-lg text-[#1e293b] uppercase tracking-wide">
              Tinh Bàn Huyền Không Phi Tinh
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            Dựa trên Tam Nguyên Cửu Vận & Đồ hình Lạc Thư Lượng Thiên Xích
          </p>
        </div>

        {/* Trạch Vận Selector */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-gray-700 whitespace-nowrap">
            Trạch Vận:
          </label>
          <select
            value={van}
            onChange={(e) => setVan(parseInt(e.target.value, 10) as TrachVan)}
            className="bg-amber-50/70 border border-amber-300 rounded-lg px-3 py-1.5 text-xs font-bold text-[#8c451a] focus:outline-none focus:border-[#c8860a]"
          >
            <option value={9}>Vận 9 (2024 - 2043) [Đương Lệnh]</option>
            <option value={8}>Vận 8 (2004 - 2023)</option>
            <option value={7}>Vận 7 (1984 - 2003)</option>
            <option value={6}>Vận 6 (1964 - 1983)</option>
            <option value={5}>Vận 5 (1944 - 1963)</option>
            <option value={4}>Vận 4 (1924 - 1943)</option>
            <option value={3}>Vận 3 (1904 - 1923)</option>
            <option value={2}>Vận 2 (1884 - 1903)</option>
            <option value={1}>Vận 1 (1864 - 1883)</option>
          </select>
        </div>
      </div>

      {/* House Orientation Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs">
        <div>
          <span className="text-gray-500">Hướng nhà (Minh Đường):</span>
          <div className="font-extrabold text-[#8c451a] text-sm mt-0.5">
            Sơn {result.huongMountain.name} ({result.degree}°) - {result.huongMountain.palaceName}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Tọa nhà (Hậu Chẩm):</span>
          <div className="font-extrabold text-blue-900 text-sm mt-0.5">
            Sơn {result.toaMountain.name} ({(result.degree + 180) % 360}°) - {result.toaMountain.palaceName}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Thời gian tra cứu:</span>
          <div className="font-bold text-gray-800 text-sm mt-0.5">
            Năm {currentYear} (Vận {result.van})
          </div>
        </div>
      </div>

      {/* 3x3 Luo Shu Nine Palaces Flying Stars Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span className="font-bold text-gray-700">Ma trận Cửu Cung Lạc Thư:</span>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-red-100 border border-red-400 rounded-xs"></span>
              <span>Sơn Tinh (Trái)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-blue-100 border border-blue-400 rounded-xs"></span>
              <span>Hướng Tinh (Phải)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-amber-100 border border-amber-400 rounded-xs"></span>
              <span>Vận Tinh (Giữa)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mx-auto bg-stone-100 p-2 sm:p-3 rounded-xl border border-stone-300 shadow-inner">
          {result.grid.map((row, rIdx) =>
            row.map((palace, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`relative flex flex-col justify-between p-2.5 sm:p-3 min-h-[105px] sm:min-h-[120px] rounded-lg border transition-shadow ${
                  palace.isHuong
                    ? 'bg-amber-50/90 border-amber-400 shadow-md ring-2 ring-[#c8860a]'
                    : palace.isToa
                    ? 'bg-blue-50/90 border-blue-400 shadow-md ring-2 ring-blue-600'
                    : 'bg-white border-stone-300 shadow-xs hover:shadow'
                }`}
              >
                {/* Direction badge & special roles */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    {palace.direction} ({palace.palaceName})
                  </span>
                  {palace.isHuong && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-[#c8860a] text-white rounded uppercase">
                      HƯỚNG
                    </span>
                  )}
                  {palace.isToa && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-blue-700 text-white rounded uppercase">
                      TỌA
                    </span>
                  )}
                </div>

                {/* Stars layout within Palace Cell */}
                <div className="my-auto py-1">
                  {/* Top Pair: Sơn Tinh (Left) vs Hướng Tinh (Right) */}
                  <div className="flex items-center justify-between font-mono font-black text-sm sm:text-base px-1">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        palace.sonTinh === van
                          ? 'bg-red-600 text-white font-extrabold ring-1 ring-red-400'
                          : 'text-red-700 bg-red-50'
                      }`}
                      title={`Sơn tinh: ${palace.sonTinh}`}
                    >
                      {palace.sonTinh}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        palace.huongTinh === van
                          ? 'bg-blue-600 text-white font-extrabold ring-1 ring-blue-400'
                          : 'text-blue-700 bg-blue-50'
                      }`}
                      title={`Hướng tinh: ${palace.huongTinh}`}
                    >
                      {palace.huongTinh}
                    </span>
                  </div>

                  {/* Center: Vận Tinh */}
                  <div className="text-center mt-1">
                    <span
                      className={`inline-block font-mono font-black text-lg sm:text-xl ${
                        palace.vanTinh === van
                          ? 'text-[#8c451a] font-extrabold drop-shadow-xs'
                          : 'text-gray-700'
                      }`}
                      title={`Vận tinh: ${palace.vanTinh}`}
                    >
                      {palace.vanTinh}
                    </span>
                  </div>
                </div>

                {/* Bottom Footer: Niên Tinh (Lưu Niên) */}
                <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-gray-100 pt-1">
                  <span>Niên: <strong className="text-purple-800 font-bold">{palace.nienTinh}</strong></span>
                  <span className="text-[9px] text-gray-400">Cung {palace.palaceNum}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Architectural Pattern Analysis (Cách Cục Kiến Trúc) */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
          <div className="flex items-center space-x-2">
            {result.cachCuc.name === 'Vượng Sơn Vượng Hướng' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : result.cachCuc.name === 'Thượng Sơn Hạ Thủy' ? (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
            )}
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Cách Cục Kiến Trúc
              </span>
              <h4 className="font-extrabold text-base sm:text-lg text-gray-900">
                {result.cachCuc.name}
              </h4>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
              result.cachCuc.name === 'Vượng Sơn Vượng Hướng'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : result.cachCuc.name === 'Thượng Sơn Hạ Thủy'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {result.cachCuc.summary}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          {result.cachCuc.description}
        </p>

        {result.cachCuc.hopThap && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{result.cachCuc.hopThap}</span>
          </div>
        )}
      </div>

      {/* Detailed Recommendations By Crucial Palaces */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 uppercase tracking-wide flex items-center space-x-1.5">
          <Home className="w-4 h-4 text-[#c8860a]" />
          <span>Luận Giải & Bố Trí Phong Thủy Từng Phương Vị</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {result.detailsByPalace.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-3.5 space-y-1.5 shadow-2xs hover:border-amber-300 transition"
            >
              <div className="font-bold text-gray-900 border-b border-gray-100 pb-1 flex items-center justify-between">
                <span>{item.title}</span>
              </div>
              <div className="text-[11px] font-mono text-[#c8860a] font-semibold">
                {item.stars}
              </div>
              <p className="text-gray-600 leading-relaxed">{item.assessment}</p>
              <div className="pt-1 text-[11px] text-gray-500 border-t border-gray-100">
                <strong className="text-gray-700">Lời khuyên:</strong> {item.advice}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
