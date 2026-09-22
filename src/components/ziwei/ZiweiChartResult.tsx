'use client';

import React, { useRef } from 'react';
import { ZiweiEnvelope, PalaceDetail } from '@/domain/ziweidoushu';
import { Printer, Bookmark, Sparkles, User } from 'lucide-react';

interface ZiweiChartResultProps {
  envelope: ZiweiEnvelope;
}

export function ZiweiChartResult({ envelope }: ZiweiChartResultProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { calculation } = envelope;
  const { personal, palaces } = calculation;

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
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
        alert('Lưu lá số Tử Vi thành công!');
      } else {
        alert(data.message || 'Vui lòng đăng nhập để lưu lá số');
      }
    } catch (e) {
      alert('Lỗi khi lưu lá số');
    }
  };

  // Find palace by branch name
  const getPalaceByBranch = (branch: string): PalaceDetail | undefined => {
    return palaces.find((p) => p.branch === branch);
  };

  // Star brightness indicator
  const renderStarBrightness = (brightness?: string) => {
    if (!brightness) return null;
    const colors: Record<string, string> = {
      'Miếu': 'text-red-600 font-bold',
      'Vượng': 'text-amber-600 font-bold',
      'Đắc': 'text-blue-600 font-semibold',
      'Hãm': 'text-gray-400 font-normal italic',
    };
    return <span className={`text-[10px] ml-1 ${colors[brightness] || 'text-gray-500'}`}>({brightness})</span>;
  };

  // Render an individual Palace Cell
  const renderPalaceCell = (branch: string) => {
    const palace = getPalaceByBranch(branch);
    if (!palace) return <div className="border border-gray-300 p-2 min-h-[140px]" />;

    return (
      <div
        key={palace.index}
        className={`border border-gray-300 p-2.5 flex flex-col justify-between min-h-[160px] md:min-h-[180px] bg-white/80 transition hover:bg-amber-50/40 text-xs ${
          palace.isMenh ? 'ring-2 ring-red-500/80' : ''
        }`}
      >
        {/* Top Header of Palace */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-1">
          <div>
            <span
              className={`font-bold uppercase tracking-wider text-xs ${
                palace.isMenh ? 'text-red-700 font-black' : 'text-[#27303f]'
              }`}
            >
              {palace.cungName}
            </span>
            {palace.isThan && (
              <span className="ml-1 text-[10px] px-1 bg-red-100 text-red-700 font-bold rounded">
                [Thân]
              </span>
            )}
          </div>
          <div className="text-[11px] font-semibold text-gray-500">
            {palace.stem} {palace.branch}
          </div>
        </div>

        {/* Stars List */}
        <div className="py-1.5 space-y-1 flex-1">
          {/* Main Stars (Chính tinh) */}
          <div className="space-y-0.5">
            {palace.mainStars.map((star, sIdx) => (
              <div key={sIdx} className="font-extrabold text-red-700 text-xs flex items-center">
                <span>{star.name}</span>
                {renderStarBrightness(star.brightness)}
              </div>
            ))}
          </div>

          {/* Sub Stars (Phụ tinh) */}
          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-[11px] pt-1 text-gray-700">
            {palace.subStars.map((star, sIdx) => (
              <span
                key={sIdx}
                className={
                  star.type === 'Tứ Hóa'
                    ? 'font-bold text-purple-700'
                    : star.type === 'Cát Tinh'
                    ? 'text-blue-700'
                    : 'text-amber-800'
                }
              >
                {star.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Footer of Palace (Đại Hạn Age & Special Marks) */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-1 text-[11px] text-gray-500">
          <span className="font-mono font-bold text-gray-700">{palace.daiHanAge}t</span>
          {palace.tuanTriet && (
            <span className="font-bold text-red-600 text-[10px]">
              {palace.tuanTriet.join(' ')}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-xs no-print">
        <div className="text-xs text-gray-600 font-medium">
          Lá số Tử Vi Đẩu Số: <span className="font-bold text-gray-900">{personal.fullName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 transition"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c8860a]" />
            <span>Lưu Lá Số</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#c8860a] hover:bg-amber-700 rounded text-xs font-semibold text-white transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Lá Số</span>
          </button>
        </div>
      </div>

      {/* Traditional Square Chart: 4 Columns x 4 Rows */}
      <div
        ref={chartRef}
        className="relative bg-white border-2 border-gray-400 p-2 md:p-4 rounded shadow-sm overflow-hidden"
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

        <div className="relative z-10 grid grid-cols-4 border border-gray-400 bg-white/60 backdrop-blur-[0.5px]">
          {/* Row 1: Tỵ, Ngọ, Mùi, Thân */}
          {renderPalaceCell('Tỵ')}
          {renderPalaceCell('Ngọ')}
          {renderPalaceCell('Mùi')}
          {renderPalaceCell('Thân')}

          {/* Row 2: Thìn, Center Info (Col 2-3, Row 2-3), Dậu */}
          {renderPalaceCell('Thìn')}
          <div className="col-span-2 row-span-2 border border-gray-300 p-4 md:p-6 flex flex-col justify-center items-center text-center bg-white/85 space-y-3">
            <div className="border-b border-amber-300/80 pb-2 w-full">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#c8860a]">
                Tử Vi Đẩu Số Toàn Thư
              </span>
              <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase mt-0.5">
                {personal.fullName}
              </h2>
              <div className="text-xs text-gray-600 font-medium">
                Giới tính: <span className="font-bold text-gray-900">{personal.genderLabel}</span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-gray-700 w-full">
              <div className="flex justify-between border-b border-gray-200/60 pb-1">
                <span className="text-gray-500">Dương Lịch:</span>
                <span className="font-semibold">{personal.solarDateStr}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-1">
                <span className="text-gray-500">Âm Lịch:</span>
                <span className="font-semibold">{personal.lunarDateStr}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-1">
                <span className="text-gray-500">Bản Mệnh:</span>
                <span className="font-bold text-amber-800">{personal.menhElement}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-1">
                <span className="text-gray-500">Cục:</span>
                <span className="font-bold text-blue-800">{personal.cuc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thân cư:</span>
                <span className="font-bold text-purple-800">{personal.thanCungName}</span>
              </div>
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
      </div>
    </div>
  );
}
