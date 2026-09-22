import React from 'react';
import { MajorLuckPillar } from '@/domain/bazi';
import { getStemColor, getBranchColor } from './BaziChartColors';

interface MajorLuckSectionProps {
  calcValue: number;
  startAgeYears: number;
  startAgeMonths: number;
  solarTerms: {
    currentTerm: string;
    currentStart: string;
    nextTerm: string;
    nextStart: string;
  };
  pillars: MajorLuckPillar[];
  focusYear?: number;
}

export function MajorLuckSection({
  calcValue,
  startAgeYears,
  startAgeMonths,
  solarTerms,
  pillars,
  focusYear,
}: MajorLuckSectionProps) {
  // Determine which pillar is active based on focusYear
  const activePillarIndex = pillars.findIndex((p) => {
    if (!focusYear || !p.annualYears || p.annualYears.length === 0) return false;
    const firstY = p.annualYears[0].year;
    const lastY = p.annualYears[p.annualYears.length - 1].year;
    return focusYear >= firstY && focusYear <= lastY;
  });

  return (
    <div
      className="w-full border-b-[1.5px] border-[#3182ce] text-[#112244]"
      style={{ display: 'grid', gridTemplateColumns: '12% 88%' }}
    >
      {/* Left Vertical Label Cell */}
      <div className="border-r-[1.5px] border-[#3182ce] flex flex-col justify-center items-center font-black text-sm sm:text-base tracking-widest uppercase bg-blue-50/20 py-4">
        <span>ĐẠI</span>
        <span>VẬN</span>
      </div>

      {/* Right Content Area: Metadata & 10-Column Grid */}
      <div className="flex flex-col justify-between">
        {/* Top Metadata Header */}
        <div className="px-3 sm:px-5 py-2.5 space-y-1 text-xs sm:text-sm">
          <div className="font-extrabold text-sm sm:text-base text-[#112244]">
            Đại vận lưu niên
          </div>
          <div className="text-xs sm:text-sm text-gray-800">
            Số tính đại vận ={' '}
            <strong className="text-[#003399] font-extrabold font-mono">
              {Number(calcValue.toFixed(12))}
            </strong>
            ; Nhập đại vận lúc{' '}
            <strong className="text-[#112244] font-bold">
              {startAgeYears} tuổi {startAgeMonths} tháng
            </strong>
            .
          </div>
          <div className="text-xs sm:text-sm text-gray-800">
            Tiết{' '}
            <strong className="text-[#112244] font-bold">
              {solarTerms.currentTerm}
            </strong>{' '}
            bắt đầu{' '}
            <span className="font-mono text-gray-900 font-semibold">
              {solarTerms.currentStart}
            </span>{' '}
            và kết thúc{' '}
            <span className="font-mono text-gray-900 font-semibold">
              {solarTerms.nextStart}
            </span>
          </div>
        </div>

        {/* 10 Major Luck Columns */}
        <div className="grid grid-cols-10 border-t-[1.5px] border-[#3182ce] text-center min-h-[95px] items-stretch">
          {pillars.slice(0, 10).map((p, idx) => {
            const isActive = idx === activePillarIndex;
            const stemColor = getStemColor(p.stem);
            const branchColor = getBranchColor(p.branch);
            const startYear =
              p.annualYears && p.annualYears.length > 0 ? p.annualYears[0].year : '';

            return (
              <div
                key={p.index || idx}
                className={`flex-1 flex flex-col justify-between py-2 px-0.5 text-xs sm:text-sm transition-colors ${
                  idx < 9 ? 'border-r-[1.5px] border-[#3182ce]' : ''
                } ${isActive ? 'bg-[#fff2d4] font-bold' : 'hover:bg-amber-50/40'}`}
              >
                {/* Stem & Branch */}
                <div className="leading-tight">
                  <div
                    className="text-sm sm:text-lg font-black uppercase"
                    style={{ color: stemColor }}
                  >
                    {p.stem}
                  </div>
                  <div
                    className="text-sm sm:text-lg font-black uppercase mt-0.5"
                    style={{ color: branchColor }}
                  >
                    {p.branch}
                  </div>
                </div>

                {/* Age Interval & Start Year */}
                <div className="text-[11px] sm:text-xs text-[#0a1c8f] font-bold leading-tight mt-1">
                  <div>
                    {p.startAge}-{p.endAge}t
                  </div>
                  <div className="text-gray-900 font-extrabold font-mono mt-0.5">
                    {startYear}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
