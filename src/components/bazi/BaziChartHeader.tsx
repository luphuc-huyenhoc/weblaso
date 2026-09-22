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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-2.5 sm:py-3 border-b-[1.5px] border-[#3182ce] bg-transparent">
      {/* Left Area: Traditional Crest, Title & Brand */}
      <div className="flex items-center space-x-4">
        {/* Emblem Crest & Brand */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
              <defs>
                <linearGradient id="headerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f7d070" />
                  <stop offset="40%" stopColor="#d4af37" />
                  <stop offset="80%" stopColor="#aa7c11" />
                </linearGradient>
                <linearGradient id="headerNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e2c3d" />
                  <stop offset="100%" stopColor="#0f1722" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="none" stroke="url(#headerGoldGrad)" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="43" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="2, 2" />
              <circle cx="50" cy="50" r="40" fill="url(#headerNavyGrad)" stroke="url(#headerGoldGrad)" strokeWidth="1.5" />
              <path
                d="M50,22 A28,28 0 0,0 50,78 A14,14 0 0,0 50,50 A14,14 0 0,1 50,22 Z"
                fill="url(#headerGoldGrad)"
                opacity="0.2"
              />
              <circle cx="50" cy="27" r="2.5" fill="url(#headerGoldGrad)" />
              <text
                x="50"
                y="57"
                textAnchor="middle"
                fontFamily="serif"
                fontSize="24"
                fontWeight="900"
                fill="url(#headerGoldGrad)"
              >
                LP
              </text>
              <text
                x="50"
                y="69"
                textAnchor="middle"
                fontSize="7"
                fontWeight="bold"
                fill="#f7d070"
                letterSpacing="1.5"
              >
                LỮ PHÚC
              </text>
            </svg>
          </div>
          <span className="mt-0.5 font-black text-[11px] sm:text-xs tracking-wider text-[#1b3b6f] uppercase">
            LỮ PHÚC
          </span>
        </div>

        {/* Title Block */}
        <div className="leading-tight text-[#1b3b6f]">
          <div className="text-base sm:text-lg font-black tracking-wider uppercase leading-tight">
            LÁ SỐ BÁT TỰ
          </div>
          <div className="text-xs sm:text-sm font-bold tracking-widest uppercase leading-tight mt-0.5 text-[#244a85]">
            CẢI VẬN BỔ KHUYẾT
          </div>
        </div>
      </div>

      {/* Right Area: Structured Personal Metadata */}
      <div className="mt-3 sm:mt-0 font-medium text-xs sm:text-sm text-[#112244] space-y-0.5 sm:space-y-1 leading-snug sm:text-left min-w-[240px]">
        <div className="flex">
          <span className="w-20 sm:w-24 font-bold text-[#112244]">Họ và tên</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold text-[#112244] tracking-wide uppercase">
            {fullName}
          </strong>
        </div>

        <div className="flex">
          <span className="w-20 sm:w-24 font-bold text-[#112244]">Giới tính</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-bold text-[#112244]">{genderLabel}</strong>
        </div>

        <div className="flex">
          <span className="w-20 sm:w-24 font-bold text-[#112244]">Dương lịch</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold text-[#d32f2f]">{solarDateStr}</strong>
        </div>

        <div className="flex">
          <span className="w-20 sm:w-24 font-bold text-[#112244]">Âm lịch</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold text-[#138808]">{lunarDateStr}</strong>
        </div>

        <div className="flex">
          <span className="w-20 sm:w-24 font-bold text-[#112244]">Nạp âm</span>
          <span className="mr-2 font-bold text-[#112244]">:</span>
          <strong className="font-extrabold" style={{ color: naYinColor }}>
            {napAm}
          </strong>
        </div>
      </div>
    </div>
  );
}
