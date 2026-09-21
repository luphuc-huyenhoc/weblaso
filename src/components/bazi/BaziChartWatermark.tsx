import React from 'react';

export function BaziChartWatermark() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <svg
        className="w-[500px] h-[500px] text-blue-900 opacity-[0.045]"
        viewBox="0 0 400 400"
        fill="currentColor"
      >
        {/* Outer Decorative Ring */}
        <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />

        {/* 8-Direction Rays */}
        <g stroke="currentColor" strokeWidth="1.5">
          <line x1="200" y1="20" x2="200" y2="380" />
          <line x1="20" y1="200" x2="380" y2="200" />
          <line x1="73" y1="73" x2="327" y2="327" />
          <line x1="73" y1="327" x2="327" y2="73" />
        </g>

        {/* Traditional Petals / Medallion Motif */}
        <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="200" cy="200" r="85" fill="none" stroke="currentColor" strokeWidth="1.5" />

        {/* Center Taiji / Yin Yang Symbol */}
        <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M 200,140 A 30,30 0 0,1 200,200 A 30,30 0 0,0 200,260 A 60,60 0 0,1 200,140 Z" />
        <circle cx="200" cy="170" r="7" />
        <circle cx="200" cy="230" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}
