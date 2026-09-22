import React from 'react';
import { IchingCalculationResult } from '@/domain/iching';

interface IChingMetadataProps {
  calculation: IchingCalculationResult;
}

export function IChingMetadata({ calculation }: IChingMetadataProps) {
  const {
    title,
    castTime,
    solarDateStr,
    lunarDateStr,
    canChi,
    solarTerm,
    nhatThan,
    nguyetLenh,
    method,
  } = calculation;

  return (
    <div className="relative w-full p-4 sm:p-6 border-b-[1.5px] border-[#3182ce] bg-transparent text-gray-900">
      {/* Top-Right Traditional Three Coins Emblem (SVG) */}
      <div className="absolute top-3 right-5 opacity-85 block pointer-events-none">
        <svg width="90" height="60" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Coin 1 */}
          <circle cx="35" cy="45" r="28" fill="#d9aa55" stroke="#8c6214" strokeWidth="2" />
          <circle cx="35" cy="45" r="23" fill="none" stroke="#aa7a18" strokeWidth="1" />
          <rect x="27" y="37" width="16" height="16" fill="#fefdf9" stroke="#8c6214" strokeWidth="1.5" />

          {/* Coin 2 */}
          <circle cx="85" cy="45" r="28" fill="#c99742" stroke="#7a520d" strokeWidth="2" />
          <circle cx="85" cy="45" r="23" fill="none" stroke="#966912" strokeWidth="1" />
          <rect x="77" y="37" width="16" height="16" fill="#fefdf9" stroke="#7a520d" strokeWidth="1.5" />

          {/* Coin 3 (Center Top) */}
          <circle cx="60" cy="28" r="26" fill="#e2b966" stroke="#996e19" strokeWidth="2" />
          <circle cx="60" cy="28" r="21" fill="none" stroke="#b38722" strokeWidth="1" />
          <rect x="53" y="21" width="14" height="14" fill="#fefdf9" stroke="#996e19" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Metadata content */}
      <div className="space-y-1.5 text-sm max-w-2xl">
        <div>
          <span className="font-semibold text-gray-700">Thời gian lập quẻ: </span>
          <span className="font-bold text-gray-900 font-mono">{castTime}</span>
          <span className="text-gray-600 font-medium"> ({lunarDateStr} ÂD)</span>
        </div>

        <div>
          <span className="font-semibold text-gray-700">Can Chi: </span>
          <span className="font-bold text-[#034687]">
            Giờ {canChi.hour}, ngày {canChi.day}, tháng {canChi.month}, năm {canChi.year}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div>
            <span className="font-semibold text-gray-700">Tiết khí: </span>
            <strong className="text-gray-900">{solarTerm}</strong>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Nhật Thần: </span>
            <strong className="text-gray-900">{nhatThan}</strong>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Nguyệt Lệnh: </span>
            <strong className="text-gray-900">{nguyetLenh}</strong>
          </div>
        </div>

        <div>
          <span className="font-semibold text-gray-700">Phương pháp lập quẻ: </span>
          <span className="font-bold text-gray-800">
            {method === 'Lục Hào' ? 'An quẻ lục hào' : method}
          </span>
        </div>

        <div className="pt-1">
          <span className="font-semibold text-gray-700">Việc cần xem: </span>
          <strong className="text-base font-extrabold text-[#935f37]">
            {title}
          </strong>
        </div>
      </div>
    </div>
  );
}
