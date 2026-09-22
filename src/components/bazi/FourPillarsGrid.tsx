import React from 'react';
import { PillarData } from '@/domain/bazi';
import { getStemColor, getBranchColor, getElementColor } from './BaziChartColors';

interface FourPillarsGridProps {
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
}

export function FourPillarsGrid({ pillars }: FourPillarsGridProps) {
  const pList = [pillars.year, pillars.month, pillars.day, pillars.hour];

  return (
    <div className="w-full text-[#112244] border-b-[1.5px] border-[#3182ce]">
      {/* 1. DƯƠNG LỊCH ROW */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] min-h-[34px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '12% 22% 22% 22% 22%' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-bold text-[10px] sm:text-xs tracking-wider uppercase bg-blue-50/20 py-1">
          <span>DƯƠNG</span>
          <span>LỊCH</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`solar-${idx}`}
            className={`h-full flex items-center justify-center font-bold text-xs sm:text-sm text-[#112244] py-1 ${
              idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
            }`}
          >
            {p.solarValue}
          </div>
        ))}
      </div>

      {/* 2. CHỦ TINH ROW */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] min-h-[36px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '12% 22% 22% 22% 22%' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-bold text-[10px] sm:text-xs tracking-wider uppercase bg-blue-50/20 py-1">
          <span>CHỦ</span>
          <span>TINH</span>
        </div>
        {pList.map((p, idx) => {
          const isDay = idx === 2;
          return (
            <div
              key={`main-god-${idx}`}
              className={`h-full flex items-center justify-center font-bold text-[11px] sm:text-xs text-[#112244] py-1 ${
                idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
              }`}
            >
              {isDay ? (
                <div className="leading-tight font-black uppercase text-[#112244] text-[10px] sm:text-[11px]">
                  <div>NHẬT</div>
                  <div>CHỦ</div>
                </div>
              ) : (
                <span>{p.stemTenGod}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. BÁT TỰ ROW — Refined balanced typography with Ngũ Hành Colors */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] min-h-[80px] sm:min-h-[90px] items-stretch text-center bg-transparent"
        style={{ display: 'grid', gridTemplateColumns: '12% 22% 22% 22% 22%' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-xs sm:text-sm tracking-widest uppercase bg-blue-50/20 py-2">
          <span>BÁT</span>
          <span>TỰ</span>
        </div>
        {pList.map((p, idx) => {
          const stemColor = getStemColor(p.stem);
          const branchColor = getBranchColor(p.branch);
          return (
            <div
              key={`battu-cell-${idx}`}
              className={`h-full flex flex-col justify-center items-center py-2 space-y-1 ${
                idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
              }`}
            >
              <div
                className="text-lg sm:text-2xl font-black uppercase tracking-wider leading-none"
                style={{ color: stemColor }}
              >
                {p.stem}
              </div>
              <div
                className="text-lg sm:text-2xl font-black uppercase tracking-wider leading-none"
                style={{ color: branchColor }}
              >
                {p.branch}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. TÀNG ẨN ROW */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] min-h-[34px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '12% 22% 22% 22% 22%' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-bold text-[10px] sm:text-xs tracking-wider uppercase bg-blue-50/20 py-1">
          <span>TÀNG</span>
          <span>ẨN</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`tang-an-${idx}`}
            className={`h-full flex items-center justify-around px-1 py-1 ${
              idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
            }`}
          >
            {p.hiddenStems.map((h, hIdx) => (
              <span
                key={hIdx}
                className="font-bold text-xs sm:text-sm px-0.5"
                style={{ color: getElementColor(h.element) }}
              >
                {h.stem}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* 5. PHÓ TINH ROW */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] min-h-[34px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '12% 22% 22% 22% 22%' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-bold text-[10px] sm:text-xs tracking-wider uppercase bg-blue-50/20 py-1">
          <span>PHÓ</span>
          <span>TINH</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`pho-tinh-${idx}`}
            className={`h-full flex items-center justify-around px-1 py-1 text-[10px] sm:text-[11px] font-semibold text-[#112244] ${
              idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
            }`}
          >
            {p.hiddenStems.map((h, hIdx) => (
              <span key={hIdx} className="px-0.5">{h.tenGod}</span>
            ))}
          </div>
        ))}
      </div>

      {/* 6. THẦN SÁT ROW */}
      <div
        className="w-full min-h-[65px] sm:min-h-[80px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '12% 22% 22% 22% 22%' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-bold text-[10px] sm:text-xs tracking-wider uppercase bg-blue-50/20 py-2">
          <span>THẦN</span>
          <span>SÁT</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`than-sat-${idx}`}
            className={`h-full flex flex-col justify-start items-center py-2 px-1 space-y-0.5 text-[10px] sm:text-[11px] font-medium text-[#112244] leading-snug ${
              idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
            }`}
          >
            {p.stars && p.stars.length > 0 ? (
              p.stars.map((star, sIdx) => <div key={sIdx}>{star}</div>)
            ) : (
              <span className="text-gray-400 font-normal">—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
