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
    <div className="h-[100px] flex-shrink-0 flex flex-row justify-between items-center px-5 py-2 border-b-[1.5px] border-[#3182ce] bg-transparent box-border">
      {/* Left Area: Traditional Crest, Title, Slogan & Contact Phone */}
      <div className="flex items-center space-x-3.5">
        {/* Emblem Crest & Brand */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <img src="/logo.png" alt="Lữ Phúc" className="w-full h-full object-contain" />
          </div>
          <span className="mt-0.5 font-black text-[10px] tracking-wider text-[#1b3b6f] uppercase">
            LỮ PHÚC
          </span>
        </div>

        {/* Title Block */}
        <div className="leading-tight text-[#1b3b6f]">
          <div className="text-[20px] font-black tracking-wider uppercase leading-tight">
            LÁ SỐ BÁT TỰ
          </div>
          <div className="text-[12.5px] font-bold tracking-widest uppercase leading-tight mt-0.5 text-[#244a85]">
            CẢI VẬN BỔ KHUYẾT
          </div>
          <div className="text-[13px] font-black text-[#c8860a] mt-0.5 tracking-wide">
            SĐT: 0374436921
          </div>
        </div>
      </div>

      {/* Right Area: Structured Personal Metadata */}
      <div className="text-[13px] text-[#112244] space-y-0.5 leading-snug min-w-[260px]">
        <div className="flex items-center">
          <span className="w-24 font-bold text-[#112244]">Họ và tên</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-black text-[15px] text-[#112244] tracking-wide uppercase">
            {fullName}
          </strong>
        </div>

        <div className="flex items-center">
          <span className="w-24 font-bold text-[#112244]">Giới tính</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-black text-[13.5px] text-[#112244]">{genderLabel}</strong>
        </div>

        <div className="flex items-center">
          <span className="w-24 font-bold text-[#112244]">Dương lịch</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-black text-[13.5px] text-[#d32f2f]">{solarDateStr}</strong>
        </div>

        <div className="flex items-center">
          <span className="w-24 font-bold text-[#112244]">Âm lịch</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-black text-[13.5px] text-[#138808]">{lunarDateStr}</strong>
        </div>

        <div className="flex items-center">
          <span className="w-24 font-bold text-[#112244]">Nạp âm</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-black text-[13.5px]" style={{ color: naYinColor }}>
            {napAm}
          </strong>
        </div>
      </div>
    </div>
  );
}
