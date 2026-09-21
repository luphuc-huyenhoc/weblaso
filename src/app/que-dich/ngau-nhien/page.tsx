'use client';

import React, { useState } from 'react';
import { IchingEnvelope, IchingLineInput } from '@/domain/iching';
import { HexagramVisualizer } from '@/components/iching/HexagramVisualizer';
import { Coins, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NgauNhienPage() {
  const [title, setTitle] = useState('Chiêm đoán thời vận sắp tới');
  const [currentToss, setCurrentToss] = useState<number>(0); // 0 to 6
  const [tossedLines, setTossedLines] = useState<IchingLineInput[]>([]);
  const [lastCoins, setLastCoins] = useState<[boolean, boolean, boolean] | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IchingEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Roll 3 coins
  const rollCoins = () => {
    // true = Dương (ngửa, 3 điểm), false = Âm (sấp, 2 điểm)
    const c1 = Math.random() < 0.5;
    const c2 = Math.random() < 0.5;
    const c3 = Math.random() < 0.5;
    const sum = (c1 ? 3 : 2) + (c2 ? 3 : 2) + (c3 ? 3 : 2);

    let polarity: 'Âm' | 'Dương' = 'Dương';
    let movement: 'Tĩnh' | 'Động' = 'Tĩnh';

    if (sum === 9) {
      polarity = 'Dương';
      movement = 'Động';
    } else if (sum === 7) {
      polarity = 'Dương';
      movement = 'Tĩnh';
    } else if (sum === 8) {
      polarity = 'Âm';
      movement = 'Tĩnh';
    } else if (sum === 6) {
      polarity = 'Âm';
      movement = 'Động';
    }

    return {
      coins: [c1, c2, c3] as [boolean, boolean, boolean],
      line: {
        lineIndex: tossedLines.length,
        polarity,
        movement,
      } as IchingLineInput,
    };
  };

  const handleTossOnce = async () => {
    if (tossedLines.length >= 6) return;

    const { coins, line } = rollCoins();
    const nextLines = [...tossedLines, line];
    setLastCoins(coins);
    setTossedLines(nextLines);
    setCurrentToss(nextLines.length);

    if (nextLines.length === 6) {
      // Finished 6 tosses -> calculate
      await triggerCalculation(nextLines);
    }
  };

  const handleTossAll = async () => {
    const lines: IchingLineInput[] = [];
    for (let i = 0; i < 6; i++) {
      const { line } = rollCoins();
      lines.push({ ...line, lineIndex: i });
    }
    setTossedLines(lines);
    setCurrentToss(6);
    await triggerCalculation(lines);
  };

  const handleReset = () => {
    setCurrentToss(0);
    setTossedLines([]);
    setLastCoins(null);
    setResult(null);
    setError(null);
  };

  const triggerCalculation = async (finalLines: IchingLineInput[]) => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const res = await fetch('/api/iching/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          method: 'Ngẫu Nhiên',
          lines: finalLines,
          day: now.getDate(),
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          hour: now.getHours(),
          minute: now.getMinutes(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi gieo quẻ');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Gieo Quẻ Đồng Xu Cổ Truyền Ngẫu Nhiên
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Tung 3 đồng tiền cổ qua 6 lần gieo ứng với 6 hào từ Hào 1 (Sơ) lên Hào 6 (Thượng). Xác suất hoàn toàn ngẫu nhiên và trung thực.
        </p>
      </div>

      {/* Interactive Coin Box */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Sự việc muốn khấn nguyện & chiêm đoán
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={tossedLines.length > 0}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-[#c8860a]"
          />
        </div>

        {/* Toss Control & Visual Coins */}
        <div className="bg-gradient-to-b from-amber-50 to-amber-100/50 border border-amber-200 rounded-lg p-6 text-center space-y-4">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            Tiến độ gieo hào: {currentToss} / 6
          </div>

          {/* 3 Coins visualization */}
          <div className="flex justify-center items-center space-x-6 py-3">
            {[0, 1, 2].map((idx) => {
              const isYang = lastCoins ? lastCoins[idx] : null;
              return (
                <div
                  key={idx}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center font-serif text-xs md:text-sm font-bold shadow-md transition-all transform ${
                    isYang === null
                      ? 'bg-amber-100 border-amber-300 text-amber-700'
                      : isYang
                      ? 'bg-amber-400 border-amber-600 text-amber-950 scale-105'
                      : 'bg-yellow-200 border-yellow-500 text-yellow-900'
                  }`}
                >
                  {isYang === null ? 'TIỀN CỔ' : isYang ? 'DƯƠNG (3)' : 'ÂM (2)'}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {currentToss < 6 ? (
              <>
                <button
                  type="button"
                  onClick={handleTossOnce}
                  className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-6 py-3 rounded-md shadow uppercase tracking-wider text-xs transition transform active:scale-95"
                >
                  <Coins className="w-4 h-4" />
                  <span>Tung Đồng Xu (Lần {currentToss + 1})</span>
                </button>
                <button
                  type="button"
                  onClick={handleTossAll}
                  className="inline-flex items-center space-x-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-bold px-4 py-3 rounded-md text-xs transition"
                >
                  <span>Gieo nhanh 6 hào</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white font-bold px-6 py-2.5 rounded-md text-xs transition"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Gieo lại từ đầu</span>
              </button>
            )}
          </div>
        </div>

        {/* Stacked lines preview */}
        {tossedLines.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <span className="text-xs font-bold text-gray-700 uppercase block mb-2">
              Các hào đã gieo (xếp từ Hào 6 trên xuống Hào 1 dưới):
            </span>
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1, 0].map((idx) => {
                const line = tossedLines[idx];
                if (!line) {
                  return (
                    <div key={idx} className="h-6 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">
                      Hào {idx + 1}: Chưa gieo
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    className={`h-6 rounded flex items-center justify-between px-3 text-xs font-semibold ${
                      line.movement === 'Động' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <span>Hào {idx + 1}: {line.polarity} {line.movement === 'Động' ? '(Động)' : '(Tĩnh)'}</span>
                    <span className="font-mono">
                      {line.polarity === 'Dương' ? '━━━━━━━' : '━━━ ━━━'} {line.movement === 'Động' ? '○' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {error}
          </div>
        )}
      </div>

      {/* Result Display */}
      {result && <HexagramVisualizer envelope={result} />}
    </div>
  );
}
