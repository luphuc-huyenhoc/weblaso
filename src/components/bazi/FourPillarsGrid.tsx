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
    <div className="w-full h-[450px] flex-shrink-0 text-[#112244] box-border flex flex-col">
      {/* 1. DƯƠNG LỊCH ROW */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[46px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>DƯƠNG</span>
          <span>LỊCH</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`solar-${idx}`}
            className={`h-full flex items-center justify-center font-black text-[16px] text-[#112244] py-1 ${
              idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
            }`}
          >
            {p.solarValue}
          </div>
        ))}
      </div>

      {/* 2. CHỦ TINH ROW */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[46px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>CHỦ</span>
          <span>TINH</span>
        </div>
        {pList.map((p, idx) => {
          const isDay = idx === 2;
          return (
            <div
              key={`main-god-${idx}`}
              className={`h-full flex items-center justify-center font-bold text-[14.5px] text-[#112244] py-1 ${
                idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
              }`}
            >
              {isDay ? (
                <div className="leading-tight font-black uppercase text-[#112244] text-[13px]">
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

      {/* 3. BÁT TỰ ROW — Prominent balanced typography with Ngũ Hành Colors */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[148px] items-stretch text-center bg-transparent"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12.5px] tracking-widest uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>BÁT</span>
          <span>TỰ</span>
        </div>
        {pList.map((p, idx) => {
          const stemColor = getStemColor(p.stem);
          const branchColor = getBranchColor(p.branch);
          return (
            <div
              key={`battu-cell-${idx}`}
              className={`h-full flex flex-col justify-center items-center py-2 space-y-2 ${
                idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
              }`}
            >
              <div
                className="text-[28px] font-black uppercase tracking-wider leading-none"
                style={{ color: stemColor }}
              >
                {p.stem}
              </div>
              <div
                className="text-[28px] font-black uppercase tracking-wider leading-none"
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
        className="w-full border-b-[1.5px] border-[#3182ce] h-[46px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
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
                className="font-black text-[15px] px-1"
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
        className="w-full border-b-[1.5px] border-[#3182ce] h-[46px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>PHÓ</span>
          <span>TINH</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`pho-tinh-${idx}`}
            className={`h-full flex items-center justify-around px-1 py-1 text-[13px] font-bold text-[#112244] ${
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
        className="w-full border-b-[1.5px] border-[#3182ce] h-[118px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>THẦN</span>
          <span>SÁT</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`than-sat-${idx}`}
            className={`h-full flex flex-col justify-start items-center py-2 px-1.5 space-y-1 text-[12.5px] font-bold text-[#112244] leading-snug overflow-hidden ${
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
