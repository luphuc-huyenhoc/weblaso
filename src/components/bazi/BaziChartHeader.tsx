import React from 'react';
import { getNaYinColor } from './BaziChartColors';

interface BaziChartHeaderProps {
  fullName: string;
  genderLabel: string;
  solarDateStr: string;
  lunarDateStr: string;
  napAm: string;
}

export function BaziChartHeader({
  fullName,
  genderLabel,
  solarDateStr,
  lunarDateStr,
  napAm,
}: BaziChartHeaderProps) {
  const naYinColor = getNaYinColor(napAm);

  return (
    <div className="flex flex-row justify-between items-center px-5 py-2.5 border-b-[1.5px] border-[#3182ce] bg-transparent">
      {/* Left Area: Traditional Crest, Title, Slogan & Contact Phone */}
      <div className="flex items-center space-x-3.5">
        {/* Emblem Crest & Brand */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <img src="/logo.png" alt="Lữ Phúc" className="w-full h-full object-contain" />
          </div>
          <span className="mt-0.5 font-extrabold text-[9.5px] tracking-wider text-[#1b3b6f] uppercase">
            LỮ PHÚC
          </span>
        </div>

        {/* Title Block */}
        <div className="leading-tight text-[#1b3b6f]">
          <div className="text-[17px] font-black tracking-wider uppercase leading-tight">
            LÁ SỐ BÁT TỰ
          </div>
          <div className="text-[11.5px] font-bold tracking-widest uppercase leading-tight mt-0.5 text-[#244a85]">
            CẢI VẬN BỔ KHUYẾT
          </div>
          <div className="text-[11.5px] font-extrabold text-[#c8860a] mt-0.5 tracking-wide">
            SĐT: 0374436921
          </div>
        </div>
      </div>

      {/* Right Area: Structured Personal Metadata */}
      <div className="font-medium text-xs text-[#112244] space-y-0.5 leading-snug min-w-[240px]">
        <div className="flex">
          <span className="w-24 font-bold text-[#112244]">Họ và tên</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold text-[#112244] tracking-wide uppercase">
            {fullName}
          </strong>
        </div>

        <div className="flex">
          <span className="w-24 font-bold text-[#112244]">Giới tính</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-bold text-[#112244]">{genderLabel}</strong>
        </div>

        <div className="flex">
          <span className="w-24 font-bold text-[#112244]">Dương lịch</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold text-[#d32f2f]">{solarDateStr}</strong>
        </div>

        <div className="flex">
          <span className="w-24 font-bold text-[#112244]">Âm lịch</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold text-[#138808]">{lunarDateStr}</strong>
        </div>

        <div className="flex">
          <span className="w-24 font-bold text-[#112244]">Nạp âm</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold" style={{ color: naYinColor }}>
            {napAm}
          </strong>
        </div>
      </div>
    </div>
  );
}
