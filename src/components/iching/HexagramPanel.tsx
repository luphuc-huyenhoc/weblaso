import React from 'react';
import { HexagramInfo } from '@/domain/iching';
import { HexagramLine } from './HexagramLine';

interface HexagramPanelProps {
  originalHexagram: HexagramInfo;
  changedHexagram?: HexagramInfo;
}

export function HexagramPanel({
  originalHexagram,
  changedHexagram,
}: HexagramPanelProps) {
  // Lines are stored 0=Hào sơ .. 5=Hào thượng.
  // We render from TOP TO BOTTOM: linesDescending = [5, 4, 3, 2, 1, 0]
  const originalLinesDesc = [...originalHexagram.lines].reverse();
  const changedLinesDesc = changedHexagram
    ? [...changedHexagram.lines].reverse()
    : null;

  return (
    <div className="w-full border-b-[1.5px] border-[#3182ce] bg-transparent text-[#034687]">
      {/* 1. Dual Hexagrams: Names, 6-line bars, Palace */}
      <div className="w-full grid grid-cols-2">
        {/* Left: Quẻ Chủ */}
        <div className="flex flex-col items-center justify-between p-3 sm:p-4 border-r-[1.5px] border-[#3182ce] text-center space-y-2">
          {/* Hexagram Name */}
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-[#034687]">
              {originalHexagram.name}
            </h3>
          </div>

          {/* 6 Lines Graphic (Top to Bottom) - Red / Burgundy tone for Quẻ Chủ */}
          <div className="w-32 space-y-1 py-1">
            {originalLinesDesc.map((line) => (
              <HexagramLine
                key={line.lineIndex}
                polarity={line.polarity}
                isMoving={line.isMoving}
                size="md"
              />
            ))}
          </div>

          {/* Palace & Nature */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              {originalHexagram.palace}{' '}
              {originalHexagram.nature !== 'Thông Thường'
                ? `(${originalHexagram.nature.toUpperCase()})`
                : ''}
            </span>
          </div>
        </div>

        {/* Right: Quẻ Biến */}
        <div className="flex flex-col items-center justify-between p-3.5 text-center space-y-2">
          {changedHexagram && changedLinesDesc ? (
            <>
              {/* Transformed Hexagram Name */}
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-[#034687]">
                  {changedHexagram.name}
                </h3>
              </div>

              {/* 6 Lines Graphic of Quẻ Biến - Blue / Indigo tone */}
              <div className="w-32 space-y-1 py-1">
                {changedLinesDesc.map((line) => (
                  <HexagramLine
                    key={line.lineIndex}
                    polarity={line.polarity}
                    isMoving={false}
                    size="md"
                  />
                ))}
              </div>

              {/* Palace */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {changedHexagram.palace}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-6 space-y-1">
              <span className="text-sm font-bold uppercase text-gray-700">
                Quẻ Thuần Tĩnh
              </span>
              <p className="text-xs text-gray-500 max-w-[180px]">
                Không có hào động, sự việc giữ nguyên theo quẻ chủ.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Banner strip: Thoán Ca / Bí Tự across both hexagrams matching reference */}
      <div className="w-full grid grid-cols-2 border-t-[1.5px] border-[#3182ce] bg-blue-50/20 text-[#034687] font-black text-xs sm:text-sm text-center py-1.5 uppercase tracking-wider">
        <div className="border-r-[1.5px] border-[#3182ce] px-2 truncate">
          {originalHexagram.thoanCa || originalHexagram.judgment}
        </div>
        <div className="px-2 truncate">
          {changedHexagram?.thoanCa || (changedHexagram ? changedHexagram.judgment : '—')}
        </div>
      </div>
    </div>
  );
}
