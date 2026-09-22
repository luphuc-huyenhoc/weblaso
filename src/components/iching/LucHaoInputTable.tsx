import React from 'react';
import { IchingLineInput } from '@/domain/iching';

export interface FormLineRow {
  lineNumber: number; // 6, 5, 4, 3, 2, 1
  castName: string;   // Lần 6 .. Lần 1
  haoName: string;    // Hào thượng .. Hào sơ
  domainIndex: number; // 5 .. 0
}

export const FORM_LINE_ROWS: FormLineRow[] = [
  { lineNumber: 6, castName: 'Lần 6', haoName: 'Hào thượng', domainIndex: 5 },
  { lineNumber: 5, castName: 'Lần 5', haoName: 'Hào ngũ', domainIndex: 4 },
  { lineNumber: 4, castName: 'Lần 4', haoName: 'Hào tứ', domainIndex: 3 },
  { lineNumber: 3, castName: 'Lần 3', haoName: 'Hào tam', domainIndex: 2 },
  { lineNumber: 2, castName: 'Lần 2', haoName: 'Hào nhị', domainIndex: 1 },
  { lineNumber: 1, castName: 'Lần 1', haoName: 'Hào sơ', domainIndex: 0 },
];

interface LucHaoInputTableProps {
  lines: IchingLineInput[];
  onChange: (domainIndex: number, polarity: 'Âm' | 'Dương', movement: 'Tĩnh' | 'Động') => void;
}

export function LucHaoInputTable({ lines, onChange }: LucHaoInputTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-xs sm:text-sm text-gray-800">
        <thead>
          <tr className="bg-blue-50/40 border-b border-gray-300 text-gray-700">
            <th className="py-2 px-3 text-left font-bold w-[20%]">Gieo</th>
            <th className="py-2 px-3 text-left font-bold w-[25%]">Hào</th>
            <th className="py-2 px-3 text-left font-bold w-[37%]">Âm / Dương</th>
            <th className="py-2 px-3 text-center font-bold w-[18%]">Động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {FORM_LINE_ROWS.map((row) => {
            const line = lines[row.domainIndex] || {
              lineIndex: row.domainIndex,
              polarity: 'Dương',
              movement: 'Tĩnh',
            };
            const isYang = line.polarity === 'Dương';
            const isMoving = line.movement === 'Động';

            return (
              <tr
                key={row.lineNumber}
                className={`transition-colors ${
                  isMoving ? 'bg-amber-50/50' : 'hover:bg-gray-50/80'
                }`}
              >
                {/* 1. Gieo: Lần 6 .. Lần 1 */}
                <td className="py-2 px-3 font-semibold text-gray-700">
                  <span>{row.castName}</span>
                </td>

                {/* 2. Hào: Hào thượng .. Hào sơ */}
                <td className="py-2 px-3 font-medium text-gray-900">
                  <span>{row.haoName}</span>
                </td>

                {/* 3. Âm / Dương Selector */}
                <td className="py-1.5 px-3">
                  <select
                    id={`hao-amduong-${row.lineNumber}`}
                    value={isYang ? 'true' : 'false'}
                    onChange={(e) => {
                      const newPolarity = e.target.value === 'true' ? 'Dương' : 'Âm';
                      onChange(row.domainIndex, newPolarity, line.movement);
                    }}
                    className="w-full max-w-[160px] px-2.5 py-1.5 border border-gray-300 rounded bg-white text-xs font-mono font-bold text-gray-800 focus:border-[#3182ce] focus:outline-hidden"
                  >
                    <option value="false">—　— (Âm)</option>
                    <option value="true">——— (Dương)</option>
                  </select>
                </td>

                {/* 4. Động Checkbox */}
                <td className="py-1.5 px-3 text-center">
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id={`hao-dong-${row.lineNumber}`}
                      checked={isMoving}
                      onChange={(e) => {
                        const newMovement = e.target.checked ? 'Động' : 'Tĩnh';
                        onChange(row.domainIndex, line.polarity, newMovement);
                      }}
                      className="w-4 h-4 text-[#3182ce] rounded border-gray-300 focus:ring-[#3182ce] cursor-pointer"
                    />
                    {isMoving && (
                      <span className="text-[11px] font-bold text-[#d32f2f] uppercase tracking-wider ml-1">
                        Động
                      </span>
                    )}
                  </label>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
