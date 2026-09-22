import React from 'react';

interface HexagramLineProps {
  polarity: 'Âm' | 'Dương';
  isMoving?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showMarker?: boolean;
}

export function HexagramLine({
  polarity,
  isMoving = false,
  size = 'md',
  className = '',
  showMarker = false,
}: HexagramLineProps) {
  // Height and dimensions depending on size
  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3';
  const colorClass = isMoving ? 'bg-[#d32f2f]' : 'bg-[#034687]';

  if (polarity === 'Dương') {
    return (
      <div className={`flex items-center justify-center relative w-full ${className}`}>
        <div className={`w-full ${heightClass} ${colorClass} rounded-2xs transition-colors`} />
        {showMarker && isMoving && (
          <span className="absolute -right-5 text-[#d32f2f] font-black text-xs">○</span>
        )}
      </div>
    );
  }

  // Âm (Broken Line: 46% line - 8% gap - 46% line)
  return (
    <div className={`flex items-center justify-between w-full relative ${className}`}>
      <div className={`w-[45%] ${heightClass} ${colorClass} rounded-2xs transition-colors`} />
      <div className="w-[10%]" />
      <div className={`w-[45%] ${heightClass} ${colorClass} rounded-2xs transition-colors`} />
      {showMarker && isMoving && (
        <span className="absolute -right-5 text-[#d32f2f] font-black text-xs">✕</span>
      )}
    </div>
  );
}

/** Small text-like SVG/CSS preview for form dropdowns */
export function HexagramLinePreview({ polarity }: { polarity: 'Âm' | 'Dương' }) {
  if (polarity === 'Dương') {
    return (
      <span className="inline-block w-8 h-1.5 bg-[#034687] align-middle rounded-2xs" />
    );
  }
  return (
    <span className="inline-flex items-center justify-between w-8 h-1.5 align-middle">
      <span className="w-3.5 h-1.5 bg-[#034687] inline-block rounded-2xs" />
      <span className="w-3.5 h-1.5 bg-[#034687] inline-block rounded-2xs" />
    </span>
  );
}
