import React from 'react';
import { ELEMENT_COLORS } from './BaziChartColors';

export function FiveElementsLegend() {
  return (
    <div className="w-full h-[50px] flex-shrink-0 flex flex-row justify-between items-center px-5 py-2 text-[12px] font-medium text-gray-800 bg-transparent box-border">
      {/* Bottom Left: Brand Source Attribution */}
      <div>
        <span>Lá số lập tại: </span>
        <strong className="text-[#0d5ca8] font-black text-[12.5px]">LỮ PHÚC (luphuc.vn)</strong>
      </div>

      {/* Bottom Right: Five Elements Swatches */}
      <div className="flex items-center space-x-3.5 text-[12px] font-bold text-gray-800">
        <div className="flex items-center space-x-1.5">
          <span
            className="w-3.5 h-3.5 rounded-2xs inline-block shadow-xs"
            style={{ backgroundColor: ELEMENT_COLORS.Kim }}
          />
          <span>Kim</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span
            className="w-3.5 h-3.5 rounded-2xs inline-block shadow-xs"
            style={{ backgroundColor: ELEMENT_COLORS.Mộc }}
          />
          <span>Mộc</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span
            className="w-3.5 h-3.5 rounded-2xs inline-block shadow-xs"
            style={{ backgroundColor: ELEMENT_COLORS.Thủy }}
          />
          <span>Thủy</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span
            className="w-3.5 h-3.5 rounded-2xs inline-block shadow-xs"
            style={{ backgroundColor: ELEMENT_COLORS.Hỏa }}
          />
          <span>Hỏa</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span
            className="w-3.5 h-3.5 rounded-2xs inline-block shadow-xs"
            style={{ backgroundColor: ELEMENT_COLORS.Thổ }}
          />
          <span>Thổ</span>
        </div>
      </div>
    </div>
  );
}
