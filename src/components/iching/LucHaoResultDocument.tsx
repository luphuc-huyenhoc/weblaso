import React, { forwardRef } from 'react';
import { IchingEnvelope } from '@/domain/iching';
import { IChingMetadata } from './IChingMetadata';
import { HexagramPanel } from './HexagramPanel';
import { LucHaoResultTable } from './LucHaoResultTable';
import { IChingLegend } from './IChingLegend';

export interface LucHaoResultDocumentProps {
  envelope: IchingEnvelope;
  zoom?: number;
  chartImageUrl?: string | null;
}

export const LucHaoResultDocument = forwardRef<HTMLDivElement, LucHaoResultDocumentProps>(
  ({ envelope, zoom = 1, chartImageUrl }, ref) => {
    const { calculation } = envelope;
    const isScaled = zoom && zoom < 1;

    return (
      <div className={`w-full ${isScaled ? 'overflow-visible flex justify-center' : 'overflow-x-auto'} py-2`}>
        <div
          ref={ref}
          id="prtQueDich"
          className="relative mx-auto border-2 border-[#3182ce] shadow-md font-sans select-text text-gray-900 overflow-hidden transition-transform"
          style={{
            width: '720px',
            maxWidth: '720px',
            minWidth: '720px',
            minHeight: '720px',
            zoom: isScaled ? zoom : undefined,
            backgroundColor: '#ffffff',
          }}
        >
          {/* Background illustration layer */}
          <div
            className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
            aria-hidden="true"
          >
            <img
              src="/BACKGROUND.png"
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
          </div>

          <div className="relative z-10 w-full flex flex-col bg-white/75 backdrop-blur-[0.5px]">
            {/* A. Divination Metadata Header */}
            <IChingMetadata calculation={calculation} />

            {/* B. Dual Hexagrams Titles & 6-line Graphics Panel */}
            <HexagramPanel
              originalHexagram={calculation.originalHexagram}
              changedHexagram={calculation.changedHexagram}
            />

            {/* C. Master 6-line Symmetrical Divination Table & Deities Sub-table */}
            <LucHaoResultTable
              originalHexagram={calculation.originalHexagram}
              changedHexagram={calculation.changedHexagram}
              tuanKhong={calculation.tuanKhong}
              monthBranch={calculation.canChi.month.split(' ')[1] || 'Dậu'}
              spiritDeities={calculation.spiritDeities}
            />

            {/* D. Footer Attribution & Five Elements Legend */}
            <IChingLegend />
          </div>

          {/* High-res image overlay for right-click copy & mobile touch */}
          {chartImageUrl && (
            <img
              src={chartImageUrl}
              alt={`Quẻ Dịch Lục Hào - ${calculation.originalHexagram.name}`}
              data-chart-overlay="true"
              className="absolute inset-0 w-full h-full object-contain opacity-[0.001] z-30 pointer-events-auto cursor-pointer select-none no-print"
              style={{ WebkitTouchCallout: 'default' }}
              title="Nhấp chuột phải chọn 'Sao chép hình ảnh' hoặc nhấn giữ để lưu ảnh"
            />
          )}
        </div>
      </div>
    );
  }
);

LucHaoResultDocument.displayName = 'LucHaoResultDocument';
