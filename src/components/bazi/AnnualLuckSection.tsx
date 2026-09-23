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
    <div className="w-full h-[220px] flex-shrink-0 text-[#112244] box-border flex flex-col">
      {displayedPillars.map((pillar, pIdx) => (
        <div
          key={pillar.index || pIdx}
          className="w-full border-b-[1.5px] border-[#3182ce] h-[110px] flex-shrink-0 items-stretch text-center box-border"
          style={{ display: 'grid', gridTemplateColumns: '86px 1fr' }}
        >
          {/* Left Vertical Label: LƯU NIÊN */}
          <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f] py-1">
            <span>LƯU</span>
            <span>NIÊN</span>
          </div>

          {/* 10 Annual Years in this Decade */}
          <div className="grid grid-cols-10 h-full items-stretch">
            {pillar.annualYears.map((ay, yIdx) => {
              const isFocus = focusYear ? ay.year === focusYear : ay.isFocusYear;
              const stemColor = getStemColor(ay.stem);
              const branchColor = getBranchColor(ay.branch);

              return (
                <div
                  key={ay.year}
                  className={`flex-1 flex flex-col justify-between py-2 px-0 transition-colors ${
                    yIdx < 9 ? 'border-r-[1.5px] border-[#3182ce]' : ''
                  } ${isFocus ? 'bg-[#fff2d4] font-bold' : 'hover:bg-amber-50/30'}`}
                >
                  {/* Stem & Branch */}
                  <div className="text-[14.5px] font-black leading-tight">
                    <div style={{ color: stemColor }}>{ay.stem}</div>
                    <div className="mt-0.5" style={{ color: branchColor }}>
                      {ay.branch}
                    </div>
                  </div>

                  {/* Year & Age */}
                  <div className="text-[12px] leading-tight mt-1">
                    <div className="font-mono text-gray-900 font-bold">
                      {ay.year}
                    </div>
                    <div className="text-[#138808] font-black mt-0.5">
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
