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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-8 py-5 border-b-[1.5px] border-[#3182ce] bg-transparent">
      {/* Left Area: Traditional Crest, Title & Brand */}
      <div className="flex items-center space-x-5">
        {/* Emblem Crest & Brand */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
              {/* Outer 8-pointed star */}
              <polygon
                points="50,2 62,38 98,50 62,62 50,98 38,62 2,50 38,38"
                fill="#1b3b6f"
                stroke="#d4af37"
                strokeWidth="1.5"
              />
              {/* Inner 8-pointed star */}
              <polygon
                points="50,14 75,25 86,50 75,75 50,86 25,75 14,50 25,25"
                fill="#244a85"
                stroke="#f5d77f"
                strokeWidth="1"
              />
              <circle cx="50" cy="50" r="20" fill="#152e59" />
              {/* Center Traditional Symbol */}
              <circle cx="50" cy="50" r="13" fill="none" stroke="#fef08a" strokeWidth="1.5" />
              <path d="M50,37 L50,63 M37,50 L63,50" stroke="#fef08a" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="4" fill="#fef08a" />
            </svg>
          </div>
          <span className="mt-1 font-black text-sm sm:text-base tracking-wider text-[#1b3b6f] uppercase">
            LỮ PHÚC
          </span>
        </div>

        {/* Title Block */}
        <div className="leading-tight text-[#1b3b6f]">
          <div className="text-xl sm:text-2xl font-black tracking-wider uppercase leading-none">
            LÁ SỐ
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-wider uppercase leading-none mt-1">
            BÁT TỰ
          </div>
          <div className="text-base sm:text-lg font-black tracking-widest uppercase leading-none mt-2.5">
            CẢI VẬN
          </div>
          <div className="text-base sm:text-lg font-black tracking-widest uppercase leading-none mt-1">
            BỔ KHUYẾT
          </div>
        </div>
      </div>

      {/* Right Area: Structured Personal Metadata */}
      <div className="mt-4 sm:mt-0 font-medium text-xs sm:text-sm text-[#112244] space-y-1 sm:space-y-1.5 leading-snug sm:text-left min-w-[280px]">
        <div className="flex">
          <span className="w-24 sm:w-28 font-bold text-[#112244]">Họ và tên</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold text-[#112244] tracking-wide uppercase">
            {fullName}
          </strong>
        </div>

        <div className="flex">
          <span className="w-24 sm:w-28 font-bold text-[#112244]">Giới tính</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-bold text-[#112244]">{genderLabel}</strong>
        </div>

        <div className="flex">
          <span className="w-24 sm:w-28 font-bold text-[#112244]">Dương lịch</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold text-[#d32f2f]">{solarDateStr}</strong>
        </div>

        <div className="flex">
          <span className="w-24 sm:w-28 font-bold text-[#112244]">Âm lịch</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold text-[#138808]">{lunarDateStr}</strong>
        </div>

        <div className="flex">
          <span className="w-24 sm:w-28 font-bold text-[#112244]">Nạp âm</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold" style={{ color: naYinColor }}>
            {napAm}
          </strong>
        </div>
      </div>
    </div>
  );
}
