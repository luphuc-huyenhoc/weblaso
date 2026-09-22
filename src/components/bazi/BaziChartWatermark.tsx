import React from 'react';

export function BaziChartWatermark() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Background illustration from BACKGROUND.png */}
      <img
        src="/BACKGROUND.png"
        alt=""
        className="w-full h-full object-cover opacity-60 contrast-105"
      />
    </div>
  );
}
