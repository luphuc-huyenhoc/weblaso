import React from 'react';
import { IchingEnvelope } from '@/domain/iching';

interface IChingInterpretationProps {
  envelope: IchingEnvelope;
}

export function IChingInterpretation({ envelope }: IChingInterpretationProps) {
  const { originalHexagram, changedHexagram } = envelope.calculation;

  return (
    <div className="w-full max-w-[920px] mx-auto bg-[#faf8f2] border border-[#e2d9c8] rounded-md p-5 sm:p-7 shadow-xs space-y-6 text-gray-800 font-sans leading-relaxed text-xs sm:text-sm">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
        Luận giải
      </h2>

      {/* Quẻ Chủ Section */}
      <div className="space-y-4">
        <div className="font-bold text-base text-[#034687]">
          1. Quẻ Chủ: {originalHexagram.name.toUpperCase()}
          {originalHexagram.thoanCa && (
            <span className="ml-2 font-normal text-amber-900 text-xs sm:text-sm">
              ({originalHexagram.thoanCa})
            </span>
          )}
        </div>

        {/* Overview */}
        {originalHexagram.commentary?.overview ? (
          <p className="text-gray-700 whitespace-pre-line">
            {originalHexagram.commentary.overview}
          </p>
        ) : (
          <p className="text-gray-700">
            Quẻ <strong>{originalHexagram.name}</strong> thuộc {originalHexagram.palace}{' '}
            ({originalHexagram.palaceElement}), mang tính chất{' '}
            <strong>{originalHexagram.nature}</strong>.
          </p>
        )}

        {/* Meaning / Giải nghĩa */}
        <div className="space-y-1">
          <h4 className="font-bold text-gray-900">Giải nghĩa:</h4>
          <p className="text-gray-700">
            {originalHexagram.commentary?.meaning ||
              originalHexagram.judgment ||
              'Thuận theo thời thế, giữ vững sơ tâm, kiên định trên đường chính nghĩa.'}
          </p>
        </div>

        {/* Thoán từ */}
        <div className="space-y-1">
          <h4 className="font-bold text-gray-900">Thoán từ:</h4>
          <p className="text-gray-700 whitespace-pre-line">
            {originalHexagram.commentary?.thoanTu || originalHexagram.judgment}
          </p>
        </div>

        {/* Hào từ */}
        {originalHexagram.commentary?.haoTu && originalHexagram.commentary.haoTu.length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-gray-900">Hào từ:</h4>
            <div className="space-y-1.5 pl-2 border-l-2 border-amber-300">
              {originalHexagram.commentary.haoTu.map((ht, idx) => (
                <div key={idx} className="text-gray-700">
                  {ht}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quẻ Biến Section (if any) */}
      {changedHexagram && (
        <div className="space-y-4 pt-4 border-t border-[#e2d9c8]">
          <div className="font-bold text-base text-[#034687]">
            2. Quẻ Biến: {changedHexagram.name.toUpperCase()}
            {changedHexagram.thoanCa && (
              <span className="ml-2 font-normal text-amber-900 text-xs sm:text-sm">
                ({changedHexagram.thoanCa})
              </span>
            )}
          </div>

          {changedHexagram.commentary?.overview && (
            <p className="text-gray-700 whitespace-pre-line">
              {changedHexagram.commentary.overview}
            </p>
          )}

          <div className="space-y-1">
            <h4 className="font-bold text-gray-900">Giải nghĩa hậu vận:</h4>
            <p className="text-gray-700">
              {changedHexagram.commentary?.meaning ||
                changedHexagram.judgment ||
                'Biến động mang lại chuyển hóa mới, cần thích ứng và giữ gìn thực lực.'}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-gray-900">Thoán từ biến:</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {changedHexagram.commentary?.thoanTu || changedHexagram.judgment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
