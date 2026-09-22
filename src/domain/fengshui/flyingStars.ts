/**
 * Huyền Không Phi Tinh (Flying Stars Feng Shui) Engine
 * Chuẩn xác Tam Nguyên Cửu Vận, Lạc Thư Cửu Cung, Vòng Lượng Thiên Xích,
 * 24 Sơn Hướng, Tam Nguyên Long và phân tích Cách Cục Kiến Trúc.
 */

export type TrachVan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type NguyenLong = 'Địa' | 'Thiên' | 'Nhân';

export interface Mountain24HK {
  index: number;
  name: string;
  palaceNum: number; // 1..9 (Lạc thư)
  palaceName: string;
  nguyenLong: NguyenLong;
  polarity: 1 | -1; // 1 = Dương (bay thuận), -1 = Âm (bay nghịch)
  startDeg: number;
  endDeg: number;
  centerDeg: number;
}

/** 24 Sơn Hướng chi tiết cho Huyền Không Phi Tinh */
export const HK_MOUNTAINS: Mountain24HK[] = [
  // Bắc (Khảm - 1)
  { index: 0, name: 'Nhâm', palaceNum: 1, palaceName: 'Khảm', nguyenLong: 'Địa', polarity: 1, startDeg: 337.5, endDeg: 352.5, centerDeg: 345 },
  { index: 1, name: 'Tý', palaceNum: 1, palaceName: 'Khảm', nguyenLong: 'Thiên', polarity: -1, startDeg: 352.5, endDeg: 7.5, centerDeg: 0 },
  { index: 2, name: 'Quý', palaceNum: 1, palaceName: 'Khảm', nguyenLong: 'Nhân', polarity: -1, startDeg: 7.5, endDeg: 22.5, centerDeg: 15 },

  // Đông Bắc (Cấn - 8)
  { index: 3, name: 'Sửu', palaceNum: 8, palaceName: 'Cấn', nguyenLong: 'Địa', polarity: -1, startDeg: 22.5, endDeg: 37.5, centerDeg: 30 },
  { index: 4, name: 'Cấn', palaceNum: 8, palaceName: 'Cấn', nguyenLong: 'Thiên', polarity: 1, startDeg: 37.5, endDeg: 52.5, centerDeg: 45 },
  { index: 5, name: 'Dần', palaceNum: 8, palaceName: 'Cấn', nguyenLong: 'Nhân', polarity: 1, startDeg: 52.5, endDeg: 67.5, centerDeg: 60 },

  // Đông (Chấn - 3)
  { index: 6, name: 'Giáp', palaceNum: 3, palaceName: 'Chấn', nguyenLong: 'Địa', polarity: 1, startDeg: 67.5, endDeg: 82.5, centerDeg: 75 },
  { index: 7, name: 'Mão', palaceNum: 3, palaceName: 'Chấn', nguyenLong: 'Thiên', polarity: -1, startDeg: 82.5, endDeg: 97.5, centerDeg: 90 },
  { index: 8, name: 'Ất', palaceNum: 3, palaceName: 'Chấn', nguyenLong: 'Nhân', polarity: -1, startDeg: 97.5, endDeg: 112.5, centerDeg: 105 },

  // Đông Nam (Tốn - 4)
  { index: 9, name: 'Thìn', palaceNum: 4, palaceName: 'Tốn', nguyenLong: 'Địa', polarity: -1, startDeg: 112.5, endDeg: 127.5, centerDeg: 120 },
  { index: 10, name: 'Tốn', palaceNum: 4, palaceName: 'Tốn', nguyenLong: 'Thiên', polarity: 1, startDeg: 127.5, endDeg: 142.5, centerDeg: 135 },
  { index: 11, name: 'Tị', palaceNum: 4, palaceName: 'Tốn', nguyenLong: 'Nhân', polarity: 1, startDeg: 142.5, endDeg: 157.5, centerDeg: 150 },

  // Nam (Ly - 9)
  { index: 12, name: 'Bính', palaceNum: 9, palaceName: 'Ly', nguyenLong: 'Địa', polarity: 1, startDeg: 157.5, endDeg: 172.5, centerDeg: 165 },
  { index: 13, name: 'Ngọ', palaceNum: 9, palaceName: 'Ly', nguyenLong: 'Thiên', polarity: -1, startDeg: 172.5, endDeg: 187.5, centerDeg: 180 },
  { index: 14, name: 'Đinh', palaceNum: 9, palaceName: 'Ly', nguyenLong: 'Nhân', polarity: -1, startDeg: 187.5, endDeg: 202.5, centerDeg: 195 },

  // Tây Nam (Khôn - 2)
  { index: 15, name: 'Mùi', palaceNum: 2, palaceName: 'Khôn', nguyenLong: 'Địa', polarity: -1, startDeg: 202.5, endDeg: 217.5, centerDeg: 210 },
  { index: 16, name: 'Khôn', palaceNum: 2, palaceName: 'Khôn', nguyenLong: 'Thiên', polarity: 1, startDeg: 217.5, endDeg: 232.5, centerDeg: 225 },
  { index: 17, name: 'Thân', palaceNum: 2, palaceName: 'Khôn', nguyenLong: 'Nhân', polarity: 1, startDeg: 232.5, endDeg: 247.5, centerDeg: 240 },

  // Tây (Đoài - 7)
  { index: 18, name: 'Canh', palaceNum: 7, palaceName: 'Đoài', nguyenLong: 'Địa', polarity: 1, startDeg: 247.5, endDeg: 262.5, centerDeg: 255 },
  { index: 19, name: 'Dậu', palaceNum: 7, palaceName: 'Đoài', nguyenLong: 'Thiên', polarity: -1, startDeg: 262.5, endDeg: 277.5, centerDeg: 270 },
  { index: 20, name: 'Tân', palaceNum: 7, palaceName: 'Đoài', nguyenLong: 'Nhân', polarity: -1, startDeg: 277.5, endDeg: 292.5, centerDeg: 285 },

  // Tây Bắc (Càn - 6)
  { index: 21, name: 'Tuất', palaceNum: 6, palaceName: 'Càn', nguyenLong: 'Địa', polarity: -1, startDeg: 292.5, endDeg: 307.5, centerDeg: 300 },
  { index: 22, name: 'Càn', palaceNum: 6, palaceName: 'Càn', nguyenLong: 'Thiên', polarity: 1, startDeg: 307.5, endDeg: 322.5, centerDeg: 315 },
  { index: 23, name: 'Hợi', palaceNum: 6, palaceName: 'Càn', nguyenLong: 'Nhân', polarity: 1, startDeg: 322.5, endDeg: 337.5, centerDeg: 330 },
];

/** Thứ tự các cung trên vòng Lượng Thiên Xích (Bay Cửu Cung) */
const LUONG_THIEN_XICH_ORDER = [5, 6, 7, 8, 9, 1, 2, 3, 4];

/** Ma trận Lạc Thư 3x3 chuẩn phương vị (hàng trên: Tốn - Ly - Khôn) */
export const LUO_SHU_GRID: number[][] = [
  [4, 9, 2], // Tốn (Đông Nam) - Ly (Chính Nam) - Khôn (Tây Nam)
  [3, 5, 7], // Chấn (Chính Đông) - Trung Cung - Đoài (Chính Tây)
  [8, 1, 6], // Cấn (Đông Bắc) - Khảm (Chính Bắc) - Càn (Tây Bắc)
];

export const PALACE_INFO: Record<number, { name: string; direction: string; element: string }> = {
  1: { name: 'Khảm', direction: 'Bắc', element: 'Thủy' },
  2: { name: 'Khôn', direction: 'Tây Nam', element: 'Thổ' },
  3: { name: 'Chấn', direction: 'Đông', element: 'Mộc' },
  4: { name: 'Tốn', direction: 'Đông Nam', element: 'Mộc' },
  5: { name: 'Trung', direction: 'Trung Cung', element: 'Thổ' },
  6: { name: 'Càn', direction: 'Tây Bắc', element: 'Kim' },
  7: { name: 'Đoài', direction: 'Tây', element: 'Kim' },
  8: { name: 'Cấn', direction: 'Đông Bắc', element: 'Thổ' },
  9: { name: 'Ly', direction: 'Nam', element: 'Hỏa' },
};

export interface PalaceStars {
  palaceNum: number;
  palaceName: string;
  direction: string;
  vanTinh: number; // Vận tinh (ở giữa)
  sonTinh: number; // Sơn tinh / Tọa tinh (góc trên bên trái)
  huongTinh: number; // Hướng tinh (góc trên bên phải)
  nienTinh: number; // Niên tinh (bên trái giữa)
  nguyetTinh?: number; // Nguyệt tinh (bên phải giữa)
  isToa: boolean;
  isHuong: boolean;
}

export interface FlyingStarResult {
  van: TrachVan;
  vanYears: string;
  degree: number;
  huongMountain: Mountain24HK;
  toaMountain: Mountain24HK;
  grid: PalaceStars[][];
  flatPalaces: Record<number, PalaceStars>;
  cachCuc: {
    name: 'Vượng Sơn Vượng Hướng' | 'Song Tinh Hội Hướng' | 'Song Tinh Hội Tọa' | 'Thượng Sơn Hạ Thủy';
    summary: string;
    description: string;
    hopThap?: string;
    tamBanQuai?: string;
  };
  detailsByPalace: Array<{
    palaceNum: number;
    title: string;
    stars: string;
    assessment: string;
    advice: string;
  }>;
}

/** Tìm sơn theo độ góc (0 - 360) */
export function getMountainByDegree(degree: number): Mountain24HK {
  const normDeg = ((degree % 360) + 360) % 360;
  // Nhâm đặc biệt vắt qua 0 độ (352.5 - 7.5 là Tý)
  for (const m of HK_MOUNTAINS) {
    if (m.name === 'Tý') {
      if (normDeg >= 352.5 || normDeg < 7.5) return m;
    } else if (normDeg >= m.startDeg && normDeg < m.endDeg) {
      return m;
    }
  }
  return HK_MOUNTAINS[0];
}

/** Bay cửu cung theo vòng Lượng Thiên Xích */
function flyStars(centerStar: number, polarity: 1 | -1): Record<number, number> {
  const result: Record<number, number> = {};
  const startIndex = centerStar;

  LUONG_THIEN_XICH_ORDER.forEach((palace, step) => {
    let currentStar: number;
    if (polarity === 1) {
      // Bay thuận: N, N+1, N+2...
      currentStar = ((startIndex - 1 + step) % 9) + 1;
    } else {
      // Bay nghịch: N, N-1, N-2...
      currentStar = ((startIndex - 1 - step) % 9 + 9) % 9 + 1;
    }
    result[palace] = currentStar;
  });

  return result;
}

/** Xác định cực tính Âm Dương của sao dựa trên Tam Nguyên Long */
function getStarPolarity(star: number, nguyenLong: NguyenLong): 1 | -1 {
  // Nếu là sao 5 (Ngũ Hoàng), quy ước theo nguyên long:
  if (star === 5) {
    if (nguyenLong === 'Địa') return -1; // Theo Khảm/Cấn Âm
    return 1; // Thiên và Nhân là Dương
  }

  // Tìm sơn cùng Nguyên Long trong cung Lạc Thư của sao đó
  const targetMountain = HK_MOUNTAINS.find(
    (m) => m.palaceNum === star && m.nguyenLong === nguyenLong
  );
  if (targetMountain) {
    return targetMountain.polarity;
  }
  return 1;
}

/** Tính sao Lưu Niên cho một năm dương lịch */
export function calculateAnnualStar(year: number): number {
  // Chu kỳ niên tinh: 2024 = 3, 2025 = 2, 2026 = 1, 2027 = 9...
  const refYear = 2024;
  const refStar = 3;
  const diff = year - refYear;
  return ((refStar - 1 - diff) % 9 + 90) % 9 + 1;
}

/** Tính toàn bộ Tinh Bàn Huyền Không Phi Tinh */
export function calculateFlyingStars(
  van: TrachVan,
  degree: number,
  year: number = new Date().getFullYear(),
  month?: number
): FlyingStarResult {
  const huongMountain = getMountainByDegree(degree);
  const toaDegree = (degree + 180) % 360;
  const toaMountain = getMountainByDegree(toaDegree);

  // 1. Vận bàn (Thiên bàn): Vận tinh bay thuận
  const vanStars = flyStars(van, 1);

  // 2. Sơn tinh: Lấy sao vận tại cung Tọa
  const sonStarAtCenter = vanStars[toaMountain.palaceNum];
  const sonPolarity = getStarPolarity(sonStarAtCenter, toaMountain.nguyenLong);
  const sonStars = flyStars(sonStarAtCenter, sonPolarity);

  // 3. Hướng tinh: Lấy sao vận tại cung Hướng
  const huongStarAtCenter = vanStars[huongMountain.palaceNum];
  const huongPolarity = getStarPolarity(huongStarAtCenter, huongMountain.nguyenLong);
  const huongStars = flyStars(huongStarAtCenter, huongPolarity);

  // 4. Niên tinh (Lưu niên)
  const annualCenterStar = calculateAnnualStar(year);
  const nienStars = flyStars(annualCenterStar, 1);

  // 5. Nguyệt tinh (nếu có)
  const curMonth = month || new Date().getMonth() + 1;
  const monthCenterStar = ((year % 3) * 3 + curMonth) % 9 + 1;
  const nguyetStars = flyStars(monthCenterStar, 1);

  // 6. Tổ hợp phẳng theo cung 1..9
  const flatPalaces: Record<number, PalaceStars> = {};
  for (let p = 1; p <= 9; p++) {
    flatPalaces[p] = {
      palaceNum: p,
      palaceName: PALACE_INFO[p].name,
      direction: PALACE_INFO[p].direction,
      vanTinh: vanStars[p],
      sonTinh: sonStars[p],
      huongTinh: huongStars[p],
      nienTinh: nienStars[p],
      nguyetTinh: nguyetStars[p],
      isToa: p === toaMountain.palaceNum,
      isHuong: p === huongMountain.palaceNum,
    };
  }

  // 7. Tạo ma trận 3x3 Lạc Thư
  const grid: PalaceStars[][] = LUO_SHU_GRID.map((row) =>
    row.map((pNum) => flatPalaces[pNum])
  );

  // 8. Nhận diện Cách Cục Kiến Trúc Kinh Điển
  const toaPalace = flatPalaces[toaMountain.palaceNum];
  const huongPalace = flatPalaces[huongMountain.palaceNum];

  let cachCucName: 'Vượng Sơn Vượng Hướng' | 'Song Tinh Hội Hướng' | 'Song Tinh Hội Tọa' | 'Thượng Sơn Hạ Thủy';
  let cachCucSummary: string;
  let cachCucDesc: string;

  if (toaPalace.sonTinh === van && huongPalace.huongTinh === van) {
    cachCucName = 'Vượng Sơn Vượng Hướng';
    cachCucSummary = 'Đinh tài lưỡng đắc (Rất tốt cho cả con người và tiền tài)';
    cachCucDesc =
      'Đương lệnh vượng tinh của Sơn bay về Tọa, đương lệnh vượng tinh của Hướng bay về Hướng. Đây là cách cục đại cát trong phong thủy Huyền Không, chủ về gia đạo êm ấm, con người khỏe mạnh, nhân đinh hưng vượng đồng thời công danh tài lộc tấn tới.';
  } else if (huongPalace.sonTinh === van && huongPalace.huongTinh === van) {
    cachCucName = 'Song Tinh Hội Hướng';
    cachCucSummary = 'Vượng tài tổn đinh (Phát tài lớn, cần bổ trợ nhân đinh)';
    cachCucDesc =
      'Cả sao đương lệnh của Sơn và Hướng cùng quy tụ tại cung Hướng. Cách cục này đặc biệt lợi về kinh doanh, buôn bán phát tài nhanh chóng. Phía trước nhà nên có khoảng khoáng đãng (thủy) rồi xa xa có cây cối hoặc nhà cao (sơn) để vẹn toàn cả đinh lẫn tài.';
  } else if (toaPalace.sonTinh === van && toaPalace.huongTinh === van) {
    cachCucName = 'Song Tinh Hội Tọa';
    cachCucSummary = 'Vượng đinh tổn tài (Con cháu đông đúc hiển vinh, tài vận bình ổn)';
    cachCucDesc =
      'Cả sao đương lệnh của Sơn và Hướng cùng bay về cung Tọa (phía sau nhà). Cách cục chủ về nhân đinh phát triển, gia đạo hiền hòa, quý nhân giúp đỡ, con cháu học hành đỗ đạt nhưng tài lộc tụ chậm, cần bố trí hồ nước hoặc phong thủy luân phía sau để kích hoạt tài khí.';
  } else {
    cachCucName = 'Thượng Sơn Hạ Thủy';
    cachCucSummary = 'Tổn đinh phá tài (Cách cục hung, cần hóa giải hình thế)';
    cachCucDesc =
      'Sao vượng Sơn lại rơi xuống Hướng, sao vượng Hướng lại leo lên Tọa. Đây là thế nghịch đảo hình thế. Cần áp dụng phép phong thủy "Tọa không hướng mãn" hoặc đặt các pháp bảo phong thủy như hồ cá, non bộ, thạch anh để chuyển hung thành cát.';
  }

  // Kiểm tra Âm Dương Hợp Thập (Tổng = 10)
  let hopThap: string | undefined = undefined;
  const isSonHopThap = Object.values(flatPalaces).every((p) => p.sonTinh + p.vanTinh === 10);
  const isHuongHopThap = Object.values(flatPalaces).every((p) => p.huongTinh + p.vanTinh === 10);
  if (isSonHopThap || isHuongHopThap) {
    hopThap =
      'Tinh bàn đắc cách "Âm Dương Hợp Thập" (Phu Phụ Hợp Thập): Khí vận thông suốt cửu cung, hóa giải được nhiều hung sát, giúp gia đạo bền vững trường cửu.';
  }

  // Luận giải chi tiết các phương vị quan trọng
  const detailsByPalace = [
    {
      palaceNum: huongMountain.palaceNum,
      title: `Cung Hướng (${huongMountain.palaceName} - ${huongMountain.name}) [Minh Đường / Cửa Chính]`,
      stars: `Sơn ${huongPalace.sonTinh} - Hướng ${huongPalace.huongTinh} - Vận ${huongPalace.vanTinh} (Niên ${huongPalace.nienTinh})`,
      assessment:
        huongPalace.huongTinh === van
          ? 'Cát khí ngút ngàn, vượng tinh lâm môn khai mở tài lộc hanh thông.'
          : huongPalace.huongTinh === 1 || huongPalace.huongTinh === 8
          ? 'Tiến khí sinh vượng, có lộc lâu dài, quý nhân tương trợ.'
          : 'Cần giữ không gian sạch sẽ, sáng sủa để nạp khí thuần khiết vào trạch.',
      advice: 'Nên mở cửa chính rộng rãi, giữ lối vào thoáng đãng, có thể đặt thảm đỏ hoặc cây phong thủy chiêu tài.',
    },
    {
      palaceNum: toaMountain.palaceNum,
      title: `Cung Tọa (${toaMountain.palaceName} - ${toaMountain.name}) [Hậu Chẩm / Lưng Nhà]`,
      stars: `Sơn ${toaPalace.sonTinh} - Hướng ${toaPalace.huongTinh} - Vận ${toaPalace.vanTinh} (Niên ${toaPalace.nienTinh})`,
      assessment:
        toaPalace.sonTinh === van
          ? 'Sơn tinh đắc vị vượng địa, sức khỏe dồi dào, hậu tự vững chãi.'
          : 'Lưng nhà cần vững chắc, tránh xáo trộn để bảo vệ nhân đinh bình an.',
      advice: 'Thích hợp đặt phòng ngủ chính, bàn thờ hoặc phòng làm việc tĩnh lặng.',
    },
    {
      palaceNum: 5,
      title: 'Trung Cung (Trọng Tâm Nhà)',
      stars: `Sơn ${flatPalaces[5].sonTinh} - Hướng ${flatPalaces[5].huongTinh} - Vận ${flatPalaces[5].vanTinh} (Niên ${flatPalaces[5].nienTinh})`,
      assessment: 'Trung tâm phát tiết năng lượng của toàn bộ trạch nhà.',
      advice: 'Kỵ đặt nhà vệ sinh, cầu thang xoắn ốc hoặc phòng bếp tại vị trí chính giữa nhà.',
    },
  ];

  const vanYearMap: Record<TrachVan, string> = {
    1: '1864 - 1883',
    2: '1884 - 1903',
    3: '1904 - 1923',
    4: '1924 - 1943',
    5: '1944 - 1963',
    6: '1964 - 1983',
    7: '1984 - 2003',
    8: '2004 - 2023',
    9: '2024 - 2043 (Đương Vận)',
  };

  return {
    van,
    vanYears: vanYearMap[van],
    degree,
    huongMountain,
    toaMountain,
    grid,
    flatPalaces,
    cachCuc: {
      name: cachCucName,
      summary: cachCucSummary,
      description: cachCucDesc,
      hopThap,
    },
    detailsByPalace,
  };
}
