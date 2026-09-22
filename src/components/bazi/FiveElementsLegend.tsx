import React from 'react';
import { ELEMENT_COLORS } from './BaziChartColors';

export function FiveElementsLegend() {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-2 text-[10px] sm:text-xs font-medium text-gray-700 bg-transparent">
      {/* Bottom Left: Brand Source Attribution */}
      <div className="mb-1 sm:mb-0">
        <span>Lá số lập tại: </span>
        <strong className="text-[#0d5ca8] font-bold">LỮ PHÚC (luphuc.vn)</strong>
      </div>

      {/* Bottom Right: Five Elements Swatches */}
      <div className="flex items-center space-x-2 sm:space-x-4 text-[10px] sm:text-xs font-bold text-gray-800">
        <div className="flex items-center space-x-1">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-2xs inline-block"
            style={{ backgroundColor: ELEMENT_COLORS.Kim }}
          />
          <span>Kim</span>
        </div>

        <div className="flex items-center space-x-1">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-2xs inline-block"
            style={{ backgroundColor: ELEMENT_COLORS.Mộc }}
          />
          <span>Mộc</span>
        </div>

        <div className="flex items-center space-x-1">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-2xs inline-block"
            style={{ backgroundColor: ELEMENT_COLORS.Thủy }}
          />
          <span>Thủy</span>
        </div>

        <div className="flex items-center space-x-1">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-2xs inline-block"
            style={{ backgroundColor: ELEMENT_COLORS.Hỏa }}
          />
          <span>Hỏa</span>
        </div>

        <div className="flex items-center space-x-1">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-2xs inline-block"
            style={{ backgroundColor: ELEMENT_COLORS.Thổ }}
          />
          <span>Thổ</span>
        </div>
      </div>
    </div>
  );
}
