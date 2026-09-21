import React from 'react';
import { MajorLuckPillar } from '@/domain/bazi';
import { getStemColor, getBranchColor } from './BaziChartColors';

interface AnnualLuckSectionProps {
  pillars: MajorLuckPillar[];
  focusYear?: number;
  showAllDecades?: boolean;
}

export function AnnualLuckSection({
  pillars,
  focusYear,
  showAllDecades = false,
}: AnnualLuckSectionProps) {
  // Find which pillar contains focusYear
  let activePillarIdx = pillars.findIndex((p) => {
    if (!focusYear || !p.annualYears || p.annualYears.length === 0) return false;
    const firstY = p.annualYears[0].year;
    const lastY = p.annualYears[p.annualYears.length - 1].year;
    return focusYear >= firstY && focusYear <= lastY;
  });

  if (activePillarIdx === -1) activePillarIdx = 0;

  // By default, display 2 decade rows matching the reference layout
  // (the active decade + the next decade). If showAllDecades is true, show all.
  let displayedPillars = pillars;
  if (!showAllDecades) {
    const startIdx = Math.min(activePillarIdx, Math.max(0, pillars.length - 2));
    displayedPillars = pillars.slice(startIdx, startIdx + 2);
  }

  return (
    <div className="w-full text-[#112244]">
      {displayedPillars.map((pillar, pIdx) => (
        <div
          key={pillar.index || pIdx}
          className="w-full border-b-[1.5px] border-[#3182ce] min-h-[92px] items-stretch text-center"
          style={{ display: 'grid', gridTemplateColumns: '12% 88%' }}
        >
          {/* Left Vertical Label: LƯU NIÊN */}
          <div className="border-r-[1.5px] border-[#3182ce] flex flex-col justify-center items-center font-black text-sm sm:text-base tracking-widest uppercase bg-blue-50/20 py-2">
            <span>LƯU</span>
            <span>NIÊN</span>
          </div>

          {/* 10 Annual Years in this Decade */}
          <div className="grid grid-cols-10 items-stretch">
            {pillar.annualYears.map((ay, yIdx) => {
              const isFocus = focusYear ? ay.year === focusYear : ay.isFocusYear;
              const stemColor = getStemColor(ay.stem);
              const branchColor = getBranchColor(ay.branch);

              return (
                <div
                  key={ay.year}
                  className={`flex-1 flex flex-col justify-between py-2 px-0.5 transition-colors ${
                    yIdx < 9 ? 'border-r-[1.5px] border-[#3182ce]' : ''
                  } ${isFocus ? 'bg-[#fff2d4] font-bold' : 'hover:bg-amber-50/30'}`}
                >
                  {/* Stem & Branch */}
                  <div className="text-xs sm:text-sm font-black leading-tight">
                    <div style={{ color: stemColor }}>{ay.stem}</div>
                    <div className="mt-0.5" style={{ color: branchColor }}>
                      {ay.branch}
                    </div>
                  </div>

                  {/* Year & Age */}
                  <div className="text-[11px] sm:text-xs font-bold leading-tight mt-1">
                    <div className="font-mono text-gray-900 font-extrabold">
                      {ay.year}
                    </div>
                    <div className="text-[#138808] font-bold mt-0.5">
                      {ay.age}t
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
