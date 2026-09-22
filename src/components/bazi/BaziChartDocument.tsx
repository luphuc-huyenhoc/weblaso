import React, { forwardRef } from 'react';
import { BaziCalculationResult } from '@/domain/bazi';
import { BaziChartWatermark } from './BaziChartWatermark';
import { BaziChartHeader } from './BaziChartHeader';
import { FourPillarsGrid } from './FourPillarsGrid';
import { MajorLuckSection } from './MajorLuckSection';
import { AnnualLuckSection } from './AnnualLuckSection';
import { FiveElementsLegend } from './FiveElementsLegend';

export interface BaziChartDocumentProps {
  calculation: BaziCalculationResult;
  focusYear?: number;
  showAllDecades?: boolean;
}

export const BaziChartDocument = forwardRef<HTMLDivElement, BaziChartDocumentProps>(
  ({ calculation, focusYear, showAllDecades = false }, ref) => {
    const { personal, pillars, majorLuck, solarTerms } = calculation;

    return (
      <div className="w-full overflow-x-auto py-2">
        <div
          ref={ref}
          id="bazi-printable-chart"
          className="relative mx-auto border-2 border-[#1c4a78] shadow-md font-sans select-text text-gray-900 overflow-hidden"
          style={{
            width: '100%',
            maxWidth: '860px',
            minWidth: '680px',
            backgroundImage: "url('/BACKGROUND.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#fefdf9',
          }}
        >
          {/* Traditional Background Image Layer from BACKGROUND.png */}
          <BaziChartWatermark />

          {/* Foreground Structured Layout (Z-Index 10 with semi-translucent backdrop for legibility) */}
          <div className="relative z-10 w-full flex flex-col bg-white/85 backdrop-blur-[0.5px]">
            {/* [A] Header / Personal Metadata */}
            <BaziChartHeader
              fullName={personal.fullName}
              genderLabel={personal.genderLabel}
              solarDateStr={personal.solarDateStr}
              lunarDateStr={personal.lunarDateStr}
              napAm={personal.napAm}
            />

            {/* [B] Four Pillars 5-Column Grid */}
            <FourPillarsGrid pillars={pillars} />

            {/* [C] Major Luck (Đại Vận) Section */}
            <MajorLuckSection
              calcValue={majorLuck.calcValue}
              startAgeYears={majorLuck.startAgeYears}
              startAgeMonths={majorLuck.startAgeMonths}
              solarTerms={solarTerms}
              pillars={majorLuck.pillars}
              focusYear={focusYear}
            />

            {/* [D] Annual Luck (Lưu Niên) Section */}
            <AnnualLuckSection
              pillars={majorLuck.pillars}
              focusYear={focusYear}
              showAllDecades={showAllDecades}
            />

            {/* [E] Footer & Five Elements Legend */}
            <FiveElementsLegend />
          </div>
        </div>
      </div>
    );
  }
);

BaziChartDocument.displayName = 'BaziChartDocument';
