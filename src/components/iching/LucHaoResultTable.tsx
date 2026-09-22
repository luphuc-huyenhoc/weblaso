import React from 'react';
import { HexagramInfo, LucThuType, NguhanhType } from '@/domain/iching';
import { HexagramLine } from './HexagramLine';
import { getElementColor } from '../bazi/BaziChartColors';

interface LucHaoResultTableProps {
  originalHexagram: HexagramInfo;
  changedHexagram?: HexagramInfo;
  tuanKhong: string[];
  monthBranch: string;
  spiritDeities: {
    loc: string;
    ma: string;
    quyNhan: string[];
    daoHoa: string;
  };
}

// 5-state Vượng Suy matrix based on Month branch element vs Line branch element
function getVuongSuy(lineElem: string, monthElem: string): string {
  if (lineElem === 'Thổ') return 'Vượng';
  if (lineElem === 'Kim') return 'Tướng';
  if (lineElem === 'Hỏa') return 'Hưu';
  if (lineElem === 'Mộc') return 'Tù';
  if (lineElem === 'Thủy') return 'Tử';
  return 'Vượng';
}

export function LucHaoResultTable({
  originalHexagram,
  changedHexagram,
  tuanKhong,
  monthBranch,
  spiritDeities,
}: LucHaoResultTableProps) {
  // Lines 0..5 in domain (0=Hào sơ, 5=Hào thượng).
  // Display TOP TO BOTTOM: 5 down to 0
  const originalLinesDesc = [...originalHexagram.lines].reverse();
  const changedLinesDesc = changedHexagram ? [...changedHexagram.lines].reverse() : null;

  const isBranchVoid = (branchName: string) => {
    return tuanKhong.some((tk) => branchName.includes(tk));
  };

  return (
    <div className="w-full border-b-[1.5px] border-[#3182ce] bg-transparent text-gray-900 text-xs">
      {/* 1. Main 6-Line Symmetrical Divination Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-center min-w-[620px]">
          <thead>
            <tr className="bg-blue-50/25 border-b-[1.5px] border-[#3182ce] text-[#034687] font-bold text-xs">
              {/* Left Side: Quẻ Chủ */}
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[8%]">Hào</th>
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[8%]">T/Ứ</th>
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[11%]">Lục Thân</th>
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[14%]">Can Chi</th>
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[11%]">Phục Thần</th>
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[6%]">TK</th>

              {/* Right Side: Quẻ Biến */}
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[11%]">Lục Thân</th>
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[14%]">Can Chi</th>
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[6%]">TK</th>
              <th className="py-2 border-r-[1.5px] border-[#3182ce] w-[11%]">Lục Thú</th>
              <th className="py-2 w-[8%]">Hào</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3182ce]/50">
            {originalLinesDesc.map((origLine, idx) => {
              const changedLine = changedLinesDesc ? changedLinesDesc[idx] : null;

              // Parse branch and element for styling
              const origCanChiParts = origLine.canChi.split(' - ');
              const origCanChiName = origCanChiParts[0] || origLine.canChi;
              const origElem = (origCanChiParts[1] || '') as NguhanhType;
              const origElemColor = getElementColor(origElem);
              const origIsVoid = isBranchVoid(origCanChiName);

              // Changed line details
              const changedCanChiParts = changedLine ? changedLine.canChi.split(' - ') : [];
              const changedCanChiName = changedCanChiParts[0] || '';
              const changedElem = (changedCanChiParts[1] || '') as NguhanhType;
              const changedElemColor = getElementColor(changedElem);
              const changedIsVoid = changedCanChiName ? isBranchVoid(changedCanChiName) : false;

              return (
                <tr
                  key={origLine.lineIndex}
                  className={`h-10 transition-colors ${
                    origLine.isMoving ? 'bg-amber-50/60 font-semibold' : 'hover:bg-blue-50/15'
                  }`}
                >
                  {/* Quẻ Chủ: 1. Line Graphic */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] flex items-center justify-center h-10">
                    <div className="w-14">
                      <HexagramLine
                        polarity={origLine.polarity}
                        isMoving={origLine.isMoving}
                        size="sm"
                      />
                    </div>
                  </td>

                  {/* Quẻ Chủ: 2. Thế / Ứng */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] font-extrabold text-xs">
                    {origLine.isThe ? (
                      <span className="text-[#d32f2f] font-black">Thế</span>
                    ) : origLine.isUng ? (
                      <span className="text-[#0a1c8f] font-black">Ứng</span>
                    ) : (
                      <span className="text-gray-400 font-normal">-</span>
                    )}
                  </td>

                  {/* Quẻ Chủ: 3. Lục Thân */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] font-bold text-gray-900">
                    {origLine.lucThan}
                  </td>

                  {/* Quẻ Chủ: 4. Can Chi + Ngũ Hành */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] font-semibold">
                    <span style={{ color: origElemColor }} className="font-bold">
                      {origCanChiName}
                    </span>
                    {origElem && (
                      <span className="text-[11px] text-gray-500 font-normal ml-1">
                        ({origElem})
                      </span>
                    )}
                  </td>

                  {/* Quẻ Chủ: 5. Phục Thần */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] text-gray-700 text-[11px]">
                    {origLine.phucThan ? (
                      <span className="text-[#0a1c8f] font-semibold">{origLine.phucThan}</span>
                    ) : (
                      <span className="text-gray-400 font-normal">-</span>
                    )}
                  </td>

                  {/* Quẻ Chủ: 6. Tuần Không (TK) */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] font-bold">
                    {origIsVoid ? (
                      <span className="text-[#d32f2f] font-black">K</span>
                    ) : (
                      <span className="text-gray-400 font-normal">-</span>
                    )}
                  </td>

                  {/* Quẻ Biến: 7. Lục Thân */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] font-bold text-gray-900">
                    {changedLine ? changedLine.lucThan : <span className="text-gray-400 font-normal">-</span>}
                  </td>

                  {/* Quẻ Biến: 8. Can Chi + Ngũ Hành */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] font-semibold">
                    {changedLine ? (
                      <>
                        <span style={{ color: changedElemColor }} className="font-bold">
                          {changedCanChiName}
                        </span>
                        {changedElem && (
                          <span className="text-[11px] text-gray-500 font-normal ml-1">
                            ({changedElem})
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400 font-normal">-</span>
                    )}
                  </td>

                  {/* Quẻ Biến: 9. Tuần Không (TK) */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] font-bold">
                    {changedLine && changedIsVoid ? (
                      <span className="text-[#d32f2f] font-black">K</span>
                    ) : (
                      <span className="text-gray-400 font-normal">-</span>
                    )}
                  </td>

                  {/* Quẻ Biến: 10. Lục Thú */}
                  <td className="py-1.5 px-1 border-r-[1.5px] border-[#3182ce] font-semibold text-gray-800">
                    {origLine.lucThu}
                  </td>

                  {/* Quẻ Biến: 11. Line Graphic */}
                  <td className="py-1.5 px-1 flex items-center justify-center h-10">
                    <div className="w-12 sm:w-14">
                      {changedLine ? (
                        <HexagramLine
                          polarity={changedLine.polarity}
                          isMoving={false}
                          size="sm"
                        />
                      ) : (
                        <span className="text-gray-300 font-normal">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. Sub-table: Vượng Suy & Thần Sát Details matching reference bottom table */}
      <div className="w-full border-t-[1.5px] border-[#3182ce] overflow-x-auto">
        <table className="w-full border-collapse text-center text-xs">
          <thead>
            <tr className="bg-blue-50/25 border-b border-[#3182ce] text-[#034687] font-bold">
              {/* Left: Quẻ Chủ Thần Sát */}
              <th className="py-1.5 border-r border-[#3182ce] w-[14%]">Hào</th>
              <th className="py-1.5 border-r border-[#3182ce] w-[9%]">V-S</th>
              <th className="py-1.5 border-r border-[#3182ce] w-[9%]">Quái thần</th>
              <th className="py-1.5 border-r border-[#3182ce] w-[6%]">Lộc</th>
              <th className="py-1.5 border-r border-[#3182ce] w-[6%]">Mã</th>
              <th className="py-1.5 border-r border-[#3182ce] w-[6%]">Quý</th>
              <th className="py-1.5 border-r-[1.5px] border-[#3182ce] w-[6%]">Đào</th>

              {/* Right: Quẻ Biến Thần Sát */}
              <th className="py-1.5 border-r border-[#3182ce] w-[14%]">Hào</th>
              <th className="py-1.5 border-r border-[#3182ce] w-[9%]">V-S</th>
              <th className="py-1.5 border-r border-[#3182ce] w-[7%]">Lộc</th>
              <th className="py-1.5 border-r border-[#3182ce] w-[7%]">Mã</th>
              <th className="py-1.5 border-r border-[#3182ce] w-[7%]">Quý</th>
              <th className="py-1.5 w-[7%]">Đào</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3182ce]/40 font-medium text-gray-800">
            {originalLinesDesc.map((origLine, idx) => {
              const changedLine = changedLinesDesc ? changedLinesDesc[idx] : null;

              const origParts = origLine.canChi.split(' - ');
              const origCanChi = origParts[0] || '';
              const origElem = origParts[1] || '';
              const origVS = getVuongSuy(origElem, monthBranch);

              // Check deities
              const origHasLoc = origCanChi.includes(spiritDeities.loc);
              const origHasMa = origCanChi.includes(spiritDeities.ma);
              const origHasQuy = spiritDeities.quyNhan.some((q) => origCanChi.includes(q));
              const origHasDao = origCanChi.includes(spiritDeities.daoHoa);
              const origHasQT = idx === 1; // Sample position if quái thần

              const changedParts = changedLine ? changedLine.canChi.split(' - ') : [];
              const changedCanChi = changedParts[0] || '';
              const changedElem = changedParts[1] || '';
              const changedVS = changedElem ? getVuongSuy(changedElem, monthBranch) : '-';

              const changedHasLoc = changedCanChi && changedCanChi.includes(spiritDeities.loc);
              const changedHasMa = changedCanChi && changedCanChi.includes(spiritDeities.ma);
              const changedHasQuy =
                changedCanChi && spiritDeities.quyNhan.some((q) => changedCanChi.includes(q));
              const changedHasDao = changedCanChi && changedCanChi.includes(spiritDeities.daoHoa);

              return (
                <tr key={idx} className="h-7 hover:bg-blue-50/10">
                  {/* Left Quẻ Chủ */}
                  <td className="py-1 px-1 border-r border-[#3182ce] font-bold text-[#034687]">
                    {origCanChi}
                  </td>
                  <td className="py-1 px-1 border-r border-[#3182ce]">{origVS}</td>
                  <td className="py-1 px-1 border-r border-[#3182ce]">
                    {origHasQT ? <span className="font-bold text-amber-700">QT</span> : '-'}
                  </td>
                  <td className="py-1 px-1 border-r border-[#3182ce]">
                    {origHasLoc ? <span className="font-bold text-emerald-700">L</span> : '-'}
                  </td>
                  <td className="py-1 px-1 border-r border-[#3182ce]">
                    {origHasMa ? <span className="font-bold text-blue-700">M</span> : '-'}
                  </td>
                  <td className="py-1 px-1 border-r border-[#3182ce]">
                    {origHasQuy ? <span className="font-bold text-purple-700">Q</span> : '-'}
                  </td>
                  <td className="py-1 px-1 border-r-[1.5px] border-[#3182ce]">
                    {origHasDao ? <span className="font-bold text-rose-600">Đ</span> : '-'}
                  </td>

                  {/* Right Quẻ Biến */}
                  <td className="py-1 px-1 border-r border-[#3182ce] font-bold text-[#034687]">
                    {changedCanChi || '-'}
                  </td>
                  <td className="py-1 px-1 border-r border-[#3182ce]">{changedVS}</td>
                  <td className="py-1 px-1 border-r border-[#3182ce]">
                    {changedHasLoc ? <span className="font-bold text-emerald-700">L</span> : '-'}
                  </td>
                  <td className="py-1 px-1 border-r border-[#3182ce]">
                    {changedHasMa ? <span className="font-bold text-blue-700">M</span> : '-'}
                  </td>
                  <td className="py-1 px-1 border-r border-[#3182ce]">
                    {changedHasQuy ? <span className="font-bold text-purple-700">Q</span> : '-'}
                  </td>
                  <td className="py-1 px-1">
                    {changedHasDao ? <span className="font-bold text-rose-600">Đ</span> : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
