import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { IchingEnvelope } from '@/domain/iching';
import { toPng } from 'html-to-image';
import { IChingMetadata } from './IChingMetadata';
import { HexagramPanel } from './HexagramPanel';
import { LucHaoResultTable } from './LucHaoResultTable';
import { IChingLegend } from './IChingLegend';

export interface LucHaoResultDocumentProps {
  envelope: IchingEnvelope;
}

export const LucHaoResultDocument = forwardRef<HTMLDivElement, LucHaoResultDocumentProps>(
  ({ envelope }, ref) => {
    const { calculation } = envelope;
    const internalRef = useRef<HTMLDivElement>(null);
    const [chartImageUrl, setChartImageUrl] = useState<string | null>(null);

    useEffect(() => {
      let isMounted = true;
      const generateImage = async () => {
        const node = internalRef.current;
        if (!node) return;
        try {
          const url = await toPng(node, {
            pixelRatio: 2,
            backgroundColor: '#fefdf9',
            cacheBust: true,
          });
          if (isMounted) {
            setChartImageUrl(url);
          }
        } catch (err) {
          console.error('Auto generate IChing image error:', err);
        }
      };

      const timer = setTimeout(generateImage, 350);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }, [calculation]);

    return (
      <div className="w-full overflow-x-auto py-2">
        <div
          ref={(node) => {
            (internalRef as any).current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as any).current = node;
            }
          }}
          id="prtQueDich"
          className="relative mx-auto border-2 border-[#3182ce] shadow-md font-sans select-text text-gray-900 overflow-hidden"
          style={{
            width: '100%',
            maxWidth: '920px',
            minWidth: '640px',
            backgroundImage: "url('/BACKGROUND.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#fefdf9',
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

          {/* Transparent high-res image overlay for right-click 'Sao chép hình ảnh' & mobile long-press */}
          {chartImageUrl && (
            <img
              src={chartImageUrl}
              alt={`Quẻ Dịch ${calculation.originalHexagram.name}`}
              className="absolute inset-0 w-full h-full object-contain opacity-0 z-20 pointer-events-auto cursor-pointer select-none"
              title="Nhấp chuột phải chọn 'Sao chép hình ảnh' hoặc nhấn giữ để lưu ảnh"
            />
          )}
        </div>
      </div>
    );
  }
);

LucHaoResultDocument.displayName = 'LucHaoResultDocument';
