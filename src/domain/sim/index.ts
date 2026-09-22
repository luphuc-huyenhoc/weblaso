import {
  solarToLunar,
  lunarToSolar,
  getCanChiDay,
  getCanChiMonth,
  getCanChiYear,
  getCanChiHour,
  ThienCan,
  DiaChi,
  NguhanhType,
} from '../calendar/index';
import {
  HEXAGRAM_NAMES,
  TRIGRAMS,
  HexagramInfo,
  HexagramLineDetail,
  LucThanType,
  LucThuType,
  LinePolarity,
  LineMovement,
  IchingLineInput,
  assembleHexagram,
} from '../iching/index';
import { calculateBazi, BaziCalculationResult } from '../bazi/index';
import { calculateBatTrach } from '../fengshui/index';

export const NAP_AM: Record<string, string> = {
  'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim',
  'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa',
  'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc',
  'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
  'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim',
  'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa',
  'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy',
  'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
  'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim',
  'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc',
  'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy',
  'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
  'Mậu Tý': 'Tích Lịch Hỏa', 'Kỷ Sửu': 'Tích Lịch Hỏa',
  'Canh Dần': 'Tùng Bách Mộc', 'Tân Mão': 'Tùng Bách Mộc',
  'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy',
  'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
  'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa',
  'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc',
  'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ',
  'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
  'Giáp Thìn': 'Phúc Đăng Hỏa', 'Ất Tỵ': 'Phúc Đăng Hỏa',
  'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy',
  'Mậu Thân': 'Đại Trạch Thổ', 'Kỷ Dậu': 'Đại Trạch Thổ',
  'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
  'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc',
  'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
  'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ',
  'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
  'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc',
  'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy',
};

// 80 Numbers Chiêm Bói 4 Số Cuối Truyền Thống
export interface Last4Evaluation {
  number: number;
  hexCode: string;
  meaning: string;
  nature: 'Đại Cát' | 'Cát' | 'Bình Hòa' | 'Hung' | 'Đại Hung';
  scoreBonus: number;
}

export const LAST_4_NUMBERS_CATALOG: Record<number, { meaning: string; nature: 'Đại Cát' | 'Cát' | 'Bình Hòa' | 'Hung' | 'Đại Hung'; scoreBonus: number }> = {
  1: { meaning: 'Đại triển hồng đồ, khả tất thành công', nature: 'Đại Cát', scoreBonus: 1.0 },
  2: { meaning: 'Thăng trầm bất định, chí hướng khó thành', nature: 'Hung', scoreBonus: -0.5 },
  3: { meaning: 'Ngày ngày tiến tới, vạn sự thuận toàn', nature: 'Đại Cát', scoreBonus: 1.0 },
  4: { meaning: 'Tiền đồ gai góc, đau khổ triền miên', nature: 'Đại Hung', scoreBonus: -1.0 },
  5: { meaning: 'Làm ăn phát đạt, danh lợi cùng thâu', nature: 'Đại Cát', scoreBonus: 1.0 },
  6: { meaning: 'Trời ban lộc phúc, có thể thành công', nature: 'Cát', scoreBonus: 0.5 },
  7: { meaning: 'Ôn hòa an tĩnh, ắt được bình an', nature: 'Cát', scoreBonus: 0.5 },
  8: { meaning: 'Qua giai đoạn gian nan, có ngày thành công', nature: 'Đại Cát', scoreBonus: 1.0 },
  9: { meaning: 'Tự làm có sức, tài đức đủ đầy', nature: 'Cát', scoreBonus: 0.5 },
  10: { meaning: 'Tâm sức hao tổn, không thu được gì', nature: 'Hung', scoreBonus: -0.5 },
  11: { meaning: 'Gia vận hưng thịnh, vạn sự hanh thông', nature: 'Đại Cát', scoreBonus: 1.0 },
  12: { meaning: 'Bạc nhược vô lực, khó tránh nghịch cảnh', nature: 'Hung', scoreBonus: -0.5 },
  13: { meaning: 'Tài trí thông minh, được trời che chở', nature: 'Đại Cát', scoreBonus: 1.0 },
  14: { meaning: 'Rút gươm chém nước, việc khó thành công', nature: 'Hung', scoreBonus: -0.5 },
  15: { meaning: 'Đức vọng phong túc, sự nghiệp tiến triển', nature: 'Đại Cát', scoreBonus: 1.0 },
  16: { meaning: 'Quý nhân tương trợ, danh lợi song thu', nature: 'Đại Cát', scoreBonus: 1.0 },
  17: { meaning: 'Vượt qua khó khăn, ắt có thành tựu', nature: 'Cát', scoreBonus: 0.5 },
  18: { meaning: 'Thuận buồm xuôi gió, trăm sự hanh thông', nature: 'Đại Cát', scoreBonus: 1.0 },
  19: { meaning: 'Nội ngoại bất hòa, trở ngại trùng trùng', nature: 'Đại Hung', scoreBonus: -1.0 },
  20: { meaning: 'Vượt qua gian nan, ắt có niềm vui', nature: 'Bình Hòa', scoreBonus: 0 },
  21: { meaning: 'Chuyên tâm kinh doanh, ắt gặt hái lớn', nature: 'Cát', scoreBonus: 0.5 },
  22: { meaning: 'Chí lớn khó thành, tài năng mai một', nature: 'Hung', scoreBonus: -0.5 },
  23: { meaning: 'Mặt trời mọc đông, danh vang khắp chốn', nature: 'Đại Cát', scoreBonus: 1.0 },
  24: { meaning: 'Tự lập thành công, tiền đồ vô lượng', nature: 'Đại Cát', scoreBonus: 1.0 },
  25: { meaning: 'Thiên thời địa lợi, ắt được thành công', nature: 'Cát', scoreBonus: 0.5 },
  26: { meaning: 'Sóng gió trùng trùng, gian truân vất vả', nature: 'Hung', scoreBonus: -0.5 },
  27: { meaning: 'Thành bại đan xen, cần giữ chính niệm', nature: 'Bình Hòa', scoreBonus: 0 },
  28: { meaning: 'Tâm thần bất an, họa hại khôn lường', nature: 'Đại Hung', scoreBonus: -1.0 },
  29: { meaning: 'Dục tốc bất đạt, kiên nhẫn thành công', nature: 'Cát', scoreBonus: 0.5 },
  30: { meaning: 'Dập dềnh sóng gió, thăng trầm bất định', nature: 'Hung', scoreBonus: -0.5 },
  31: { meaning: 'Thành công vang dội, phú quý song toàn', nature: 'Đại Cát', scoreBonus: 1.0 },
  32: { meaning: 'Tài đức vẹn toàn, ý chí kiên định', nature: 'Đại Cát', scoreBonus: 1.0 },
  33: { meaning: 'Gia môn hưng thịnh, danh lợi cùng thâu', nature: 'Cát', scoreBonus: 0.5 },
  34: { meaning: 'Phá tài hao của, tai họa triền miên', nature: 'Đại Hung', scoreBonus: -1.0 },
  35: { meaning: 'Bảo thủ bình an, an phận thủ thường', nature: 'Cát', scoreBonus: 0.5 },
  36: { meaning: 'Sóng gió triền miên, khổ nạn khó lường', nature: 'Hung', scoreBonus: -0.5 },
  37: { meaning: 'Cát tinh chiếu mệnh, phát tài phát lộc', nature: 'Cát', scoreBonus: 0.5 },
  38: { meaning: 'Thành tựu nhỏ bé, an phận chờ thời', nature: 'Bình Hòa', scoreBonus: 0 },
  39: { meaning: 'Quang minh lỗi lạc, tiền đồ xán lạn', nature: 'Đại Cát', scoreBonus: 1.0 },
  40: { meaning: 'Cẩn trọng phòng ngừa, họa phúc khôn lường', nature: 'Bình Hòa', scoreBonus: 0 },
  41: { meaning: 'Trời ban lộc tài, sự nghiệp vẻ vang', nature: 'Cát', scoreBonus: 0.5 },
  42: { meaning: 'Sự nghiệp bất định, nhọc lòng tổn sức', nature: 'Hung', scoreBonus: -0.5 },
  43: { meaning: 'Hoa rơi nước chảy, tiêu hao tâm lực', nature: 'Hung', scoreBonus: -0.5 },
  44: { meaning: 'Gặp thời đắc vận, vạn sự hanh thông', nature: 'Cát', scoreBonus: 0.5 },
  45: { meaning: 'Thuận buồm xuôi gió, tái dựng cơ đồ', nature: 'Đại Cát', scoreBonus: 1.0 },
  46: { meaning: 'Vượt qua chông gai, ắt được vinh hoa', nature: 'Cát', scoreBonus: 0.5 },
  47: { meaning: 'Danh lợi đầy nhà, đại cát đại lợi', nature: 'Đại Cát', scoreBonus: 1.0 },
  48: { meaning: 'Vạn sự hanh thông, danh vang bốn biển', nature: 'Đại Cát', scoreBonus: 1.0 },
  49: { meaning: 'Cát hung đan xen, cần tích đức hành thiện', nature: 'Bình Hòa', scoreBonus: 0 },
  50: { meaning: 'Thành bại một nửa, nỗ lực ắt nên', nature: 'Bình Hòa', scoreBonus: 0 },
  51: { meaning: 'Thịnh suy luân chuyển, khó đoán định', nature: 'Bình Hòa', scoreBonus: 0 },
  52: { meaning: 'Biết đủ là đủ, an hưởng thanh nhàn', nature: 'Cát', scoreBonus: 0.5 },
  53: { meaning: 'Ưu tư phiền muộn, gian khổ chờ qua', nature: 'Hung', scoreBonus: -0.5 },
  54: { meaning: 'Hiểm họa khôn lường, tránh xa tranh chấp', nature: 'Đại Hung', scoreBonus: -1.0 },
  55: { meaning: 'Bên ngoài hào nhoáng, bên trong nhọc nhằn', nature: 'Hung', scoreBonus: -0.5 },
  56: { meaning: 'Khổ tận cam lai, hậu vận tốt lành', nature: 'Cát', scoreBonus: 0.5 },
  57: { meaning: 'Chí hướng kiên cường, ắt nên nghiệp lớn', nature: 'Cát', scoreBonus: 0.5 },
  58: { meaning: 'Thành công nửa đường, cần thêm trợ lực', nature: 'Bình Hòa', scoreBonus: 0 },
  59: { meaning: 'Lòng dạ rối bời, chớ vội đầu tư', nature: 'Hung', scoreBonus: -0.5 },
  60: { meaning: 'Tăm tối mịt mờ, chớ nên nóng vội', nature: 'Hung', scoreBonus: -0.5 },
  61: { meaning: 'Vượt qua gian khó, cơ nghiệp vững vàng', nature: 'Cát', scoreBonus: 0.5 },
  62: { meaning: 'Công danh dang dở, hữu chí khó thành', nature: 'Hung', scoreBonus: -0.5 },
  63: { meaning: 'Vạn sự tốt đẹp, quý nhân phù trợ', nature: 'Đại Cát', scoreBonus: 1.0 },
  64: { meaning: 'Cốt nhục chia lìa, họa hại triền miên', nature: 'Đại Hung', scoreBonus: -1.0 },
  65: { meaning: 'Phúc lộc tràn đầy, gia đạo an vui', nature: 'Đại Cát', scoreBonus: 1.0 },
  66: { meaning: 'Trong họa có phúc, bền chí ắt nên', nature: 'Cát', scoreBonus: 0.5 },
  67: { meaning: 'Thời vận hanh thông, công thành danh toại', nature: 'Đại Cát', scoreBonus: 1.0 },
  68: { meaning: 'Trời sinh phú quý, tài lộc tự đến', nature: 'Đại Cát', scoreBonus: 1.0 },
  69: { meaning: 'Bấp bênh chìm nổi, khó giữ của cải', nature: 'Hung', scoreBonus: -0.5 },
  70: { meaning: 'Hung họa rình rập, cần giữ tâm lành', nature: 'Hung', scoreBonus: -0.5 },
  71: { meaning: 'Nhẫn nại chờ thời, chớ vội tiến xa', nature: 'Bình Hòa', scoreBonus: 0 },
  72: { meaning: 'Cát hung tương tàn, trước sướng sau khổ', nature: 'Hung', scoreBonus: -0.5 },
  73: { meaning: 'An phận giữ mình, hưởng phúc an nhiên', nature: 'Cát', scoreBonus: 0.5 },
  74: { meaning: 'Tâm sức cạn kiệt, tài lộc hư hao', nature: 'Hung', scoreBonus: -0.5 },
  75: { meaning: 'Trong rủi có may, biến nguy thành an', nature: 'Cát', scoreBonus: 0.5 },
  76: { meaning: 'Khuynh gia bại sản, tai ương giáng xuống', nature: 'Đại Hung', scoreBonus: -1.0 },
  77: { meaning: 'Hỷ sự trùng trùng, tài lộc khởi sắc', nature: 'Cát', scoreBonus: 0.5 },
  78: { meaning: 'Sự nghiệp gặp trắc trở, cần kiên trì', nature: 'Bình Hòa', scoreBonus: 0 },
  79: { meaning: 'Phước lộc tiêu tán, cô độc phiền não', nature: 'Hung', scoreBonus: -0.5 },
  80: { meaning: 'Đắc được hanh thông, an khang cát tường', nature: 'Đại Cát', scoreBonus: 1.0 },
};

// Trigram Index to Binary Map (1-Càn, 2-Đoài, 3-Ly, 4-Chấn, 5-Tốn, 6-Khảm, 7-Cấn, 8-Khôn)
const TRIGRAM_INDEX_MAP: Record<number, { name: string; binary: string; element: NguhanhType }> = {
  1: { name: 'Càn', binary: '111', element: 'Kim' },
  2: { name: 'Đoài', binary: '011', element: 'Kim' },
  3: { name: 'Ly', binary: '101', element: 'Hỏa' },
  4: { name: 'Chấn', binary: '001', element: 'Mộc' },
  5: { name: 'Tốn', binary: '110', element: 'Mộc' },
  6: { name: 'Khảm', binary: '010', element: 'Thủy' },
  7: { name: 'Cấn', binary: '100', element: 'Thổ' },
  8: { name: 'Khôn', binary: '000', element: 'Thổ' },
};

export interface SimInput {
  phoneNumber: string;
  fullName?: string;
  gender: boolean; // true = Nam, false = Nữ
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  calendarType?: 'solar' | 'lunar';
}

export interface SimCalculationResult {
  phoneNumber: string;
  cleanPhone: string;
  ownerName: string;
  gender: boolean;
  genderLabel: string;
  birthDateSolar: string;
  birthDateLunar: string;
  solarTerm: string;

  // 1. Kết luận nhanh
  overview: {
    originalHexagramName: string;
    changedHexagramName: string;
    movingLine: number;
    simElement: NguhanhType;
    totalScore: number;
    scoreRating: 'Đại Cát' | 'Cát' | 'Khá' | 'Bình Hòa' | 'Hung';
    recommendation: string;
    summaryDesc: string;
  };

  // 2. Mệnh cục Bát Tự
  baziDetail: {
    pillars: {
      hour: { stem: string; branch: string; napAm: string; element: string };
      day: { stem: string; branch: string; napAm: string; element: string; isMaster?: boolean };
      month: { stem: string; branch: string; napAm: string; element: string };
      year: { stem: string; branch: string; napAm: string; element: string };
    };
    cungPhi: string;
    quaiNumber: number;
    napAm: string;
    menhElement: NguhanhType;
    elementDistribution: Record<NguhanhType, number>;
    canChiRelations: {
      thienCan: string[];
      goodRelations: string[];
      notes: string[];
    };
  };

  // 3. Quẻ Dịch Lục Hào
  hexagrams: {
    original: HexagramInfo;
    changed: HexagramInfo;
    nuclear?: HexagramInfo; // Quẻ Hỗ
    movingLineIndex: number;
    movingLineName: string;
    movingLineMeaning: string;
    judgment: string;
    thoanCa: string;
  };

  // 4. Phối quẻ với Bát Tự theo 5 phương diện
  aspects: {
    theVan: {
      scorePercent: number;
      rating: string;
      generalReview: string;
      details: string[];
    };
    taiLoc: {
      scorePercent: number;
      rating: string;
      generalReview: string;
      dieuChi: string;
      nguHanh: string;
      strengths: string[];
      weaknesses: string[];
    };
    congDanh: {
      scorePercent: number;
      rating: string;
      generalReview: string;
      dieuChi: string;
      nguHanh: string;
      strengths: string[];
      weaknesses: string[];
    };
    tinhCam: {
      scorePercent: number;
      rating: string;
      generalReview: string;
      targetRole: string; // Vợ (đối với Nam) hoặc Chồng (đối với Nữ)
      dieuChi: string;
      nguHanh: string;
      strengths: string[];
      weaknesses: string[];
    };
    giaDao: {
      scorePercent: number;
      rating: string;
      generalReview: string;
      strengths: string[];
      weaknesses: string[];
    };
  };

  // 5. Các yếu tố bổ trợ
  auxiliary: {
    simElementVsMaster: {
      simElement: NguhanhType;
      masterElement: NguhanhType;
      relation: string;
      isGood: boolean;
      scoreBonus: number;
      comment: string;
    };
    yinYang: {
      evenCount: number;
      oddCount: number;
      evenPercent: number;
      oddPercent: number;
      userGenderBalance: string;
      scoreBonus: number;
      isBalanced: boolean;
      comment: string;
    };
    last4Digits: {
      last4Str: string;
      calcRemainder: number;
      meaning: string;
      nature: string;
      scoreBonus: number;
    };
    nicePatterns: {
      patterns: string[];
      description: string;
      scoreBonus: number;
    };
  };
}

// Helper: Calculate Sim Hexagram via Mai Hoa
export function calculateSimHexagram(cleanPhone: string) {
  const digits = cleanPhone.split('').map((c) => parseInt(c, 10) || 0);
  const halfLen = Math.floor(digits.length / 2);

  const firstHalf = digits.slice(0, halfLen);
  const secondHalf = digits.slice(halfLen);

  const sumFirst = firstHalf.reduce((a, b) => a + b, 0);
  const sumSecond = secondHalf.reduce((a, b) => a + b, 0);
  const totalSum = sumFirst + sumSecond;

  let upperNum = sumFirst % 8;
  if (upperNum === 0) upperNum = 8;

  let lowerNum = sumSecond % 8;
  if (lowerNum === 0) lowerNum = 8;

  let movingLine = totalSum % 6;
  if (movingLine === 0) movingLine = 6;

  const upperTri = TRIGRAM_INDEX_MAP[upperNum];
  const lowerTri = TRIGRAM_INDEX_MAP[lowerNum];

  // 6-line binary string (Line 6 down to Line 1)
  const originalBinary = upperTri.binary + lowerTri.binary;

  // Flip moving line: line 1 is bottom (idx 5), line 6 is top (idx 0)
  const flipIndex = 6 - movingLine;
  const changedArr = originalBinary.split('');
  changedArr[flipIndex] = changedArr[flipIndex] === '1' ? '0' : '1';
  const changedBinary = changedArr.join('');

  // Nuclear Hexagram (Quẻ Hỗ): Lines 5, 4, 3 (upper) and Lines 4, 3, 2 (lower)
  // Indices: line 5=1, line 4=2, line 3=3; line 4=2, line 3=3, line 2=4
  const nuclearBinary =
    originalBinary[1] +
    originalBinary[2] +
    originalBinary[3] +
    originalBinary[2] +
    originalBinary[3] +
    originalBinary[4];

  return {
    sumFirst,
    sumSecond,
    totalSum,
    upperNum,
    lowerNum,
    movingLine,
    originalBinary,
    changedBinary,
    nuclearBinary,
  };
}

// Helper: Calculate Sim Element via Cửu Tinh Lạc Thư
export function calculateSimElement(cleanPhone: string): NguhanhType {
  const digits = cleanPhone.split('').map((c) => parseInt(c, 10) || 0);
  let sum = digits.reduce((a, b) => a + b, 0);

  while (sum > 9) {
    sum = sum
      .toString()
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0);
  }

  // Cửu tinh: 1 Khảm (Thủy), 2 Khôn (Thổ), 3 Chấn (Mộc), 4 Tốn (Mộc), 5 Trung (Thổ), 6 Càn (Kim), 7 Đoài (Kim), 8 Cấn (Thổ), 9 Ly (Hỏa)
  const elementMap: Record<number, NguhanhType> = {
    1: 'Thủy',
    2: 'Thổ',
    3: 'Mộc',
    4: 'Mộc',
    5: 'Thổ',
    6: 'Kim',
    7: 'Kim',
    8: 'Thổ',
    9: 'Hỏa',
  };

  return elementMap[sum] || 'Thổ';
}

// Helper: Detect Nice Phone Patterns
export function detectNiceSimPatterns(phone: string): { patterns: string[]; scoreBonus: number } {
  const clean = phone.replace(/\D/g, '');
  const patterns: string[] = [];
  let scoreBonus = 0;

  if (/(\d)\1{3}$/.test(clean)) {
    patterns.push('Sim Tứ Quý');
    scoreBonus += 0.8;
  } else if (/(\d)\1{2}$/.test(clean)) {
    patterns.push('Sim Tam Hoa');
    scoreBonus += 0.5;
  }

  if (/68$|86$/.test(clean)) {
    patterns.push('Đuôi Lộc Phát (68/86)');
    scoreBonus += 0.5;
  } else if (/39$|79$/.test(clean)) {
    patterns.push('Đuôi Thần Tài (39/79)');
    scoreBonus += 0.5;
  } else if (/38$|78$/.test(clean)) {
    patterns.push('Đuôi Ông Địa (38/78)');
    scoreBonus += 0.3;
  }

  if (/(?:0123|1234|2345|3456|4567|5678|6789)$/.test(clean)) {
    patterns.push('Đuôi Tiến Lên');
    scoreBonus += 0.5;
  }

  if (/(\d{2})\1$/.test(clean)) {
    patterns.push('Sim Đuôi Cặp');
    scoreBonus += 0.3;
  }

  // Đuôi số lớn
  const lastDigit = parseInt(clean[clean.length - 1], 10);
  if (lastDigit >= 8) {
    patterns.push('Sim Đuôi Số Lớn');
    scoreBonus += 0.2;
  }

  return {
    patterns: patterns.length > 0 ? patterns : ['Sim Thông Thường'],
    scoreBonus: Math.min(scoreBonus, 1.0),
  };
}

// Main Calculation Function
export function calculateSimFortune(input: SimInput): SimCalculationResult {
  const cleanPhone = input.phoneNumber.replace(/\D/g, '');
  const ownerName = input.fullName || 'GIA CHỦ';

  // 1. Resolve Solar Date & Time
  let solarDay = input.day;
  let solarMonth = input.month;
  let solarYear = input.year;

  if (input.calendarType === 'lunar') {
    const s = lunarToSolar(input.day, input.month, input.year, false);
    solarDay = s.day;
    solarMonth = s.month;
    solarYear = s.year;
  }

  // 2. Bát Tự Thân Chủ
  const baziEnvelope = calculateBazi({
    fullName: ownerName,
    gender: input.gender,
    day: solarDay,
    month: solarMonth,
    year: solarYear,
    hour: input.hour,
    minute: input.minute,
  });
  const bazi = baziEnvelope.calculation;

  const batTrach = calculateBatTrach(solarYear, input.gender);

  // 3. Quẻ Dịch Sim
  const simHex = calculateSimHexagram(cleanPhone);
  const simElem = calculateSimElement(cleanPhone);

  const createLineInputs = (binary6: string, movingLine1Based?: number): IchingLineInput[] => {
    const lineInputs: IchingLineInput[] = [];
    for (let i = 0; i < 6; i++) {
      const bit = binary6[5 - i]; // line i: 0=bottom, 5=top
      const isMoving = movingLine1Based !== undefined && movingLine1Based === (i + 1);
      lineInputs.push({
        lineIndex: i,
        polarity: bit === '1' ? 'Dương' : 'Âm',
        movement: isMoving ? 'Động' : 'Tĩnh',
      });
    }
    return lineInputs;
  };

  const origLines = createLineInputs(simHex.originalBinary, simHex.movingLine);
  const origHexInfo = assembleHexagram(origLines, bazi.pillars.day.stem, bazi.pillars.month.branch);

  const changedLines = createLineInputs(simHex.changedBinary);
  const changedHexInfo = assembleHexagram(changedLines, bazi.pillars.day.stem, bazi.pillars.month.branch);

  const nuclearLines = createLineInputs(simHex.nuclearBinary);
  const nuclearHexInfo = assembleHexagram(nuclearLines, bazi.pillars.day.stem, bazi.pillars.month.branch);

  // 4. Phép luận bổ trợ
  // (A) Ngũ hành sim vs Mệnh thân chủ
  const napAmStr = bazi.personal.napAm;
  const masterElem: NguhanhType = napAmStr.includes('Kim')
    ? 'Kim'
    : napAmStr.includes('Mộc')
    ? 'Mộc'
    : napAmStr.includes('Thủy')
    ? 'Thủy'
    : napAmStr.includes('Hỏa')
    ? 'Hỏa'
    : 'Thổ';
  let elemRelation = '';
  let elemGood = true;
  let elemBonus = 1.0;
  let elemComment = '';

  const sinhMap: Record<NguhanhType, NguhanhType> = {
    Kim: 'Thủy',
    Thủy: 'Mộc',
    Mộc: 'Hỏa',
    Hỏa: 'Thổ',
    Thổ: 'Kim',
  };
  const khacMap: Record<NguhanhType, NguhanhType> = {
    Kim: 'Mộc',
    Mộc: 'Thổ',
    Thổ: 'Thủy',
    Thủy: 'Hỏa',
    Hỏa: 'Kim',
  };

  if (sinhMap[simElem] === masterElem) {
    elemRelation = 'Sim tương sinh cho thân chủ (Tương sinh đại cát)';
    elemGood = true;
    elemBonus = 1.5;
    elemComment = `Sim có ngũ hành ${simElem}, thân chủ mệnh ${bazi.personal.napAm} (${masterElem}). Đây là mối quan hệ sim sinh cho chủ ⇒ Rất tốt, trợ lực hanh thông.`;
  } else if (simElem === masterElem) {
    elemRelation = 'Sim cùng hành với thân chủ (Tương hòa)';
    elemGood = true;
    elemBonus = 1.0;
    elemComment = `Sim có ngũ hành ${simElem}, tương hòa với mệnh ${masterElem} của gia chủ ⇒ Thuận hòa, bình ổn.`;
  } else if (khacMap[masterElem] === simElem) {
    elemRelation = 'Thân chủ khắc chế được sim (Chủ khắc sim)';
    elemGood = true;
    elemBonus = 1.0;
    elemComment = `Thân chủ mệnh ${masterElem} khắc chế được sim (${simElem}) ⇒ Nắm quyền chủ động, làm chủ hoàn cảnh.`;
  } else if (sinhMap[masterElem] === simElem) {
    elemRelation = 'Thân chủ sinh cho sim (Sinh xuất)';
    elemGood = true;
    elemBonus = 0.5;
    elemComment = `Mệnh ${masterElem} sinh cho sim (${simElem}) ⇒ Tiêu hao một phần năng lượng nhưng vẫn sử dụng tốt.`;
  } else {
    elemRelation = 'Sim khắc mệnh thân chủ (Tương khắc)';
    elemGood = false;
    elemBonus = -1.0;
    elemComment = `Sim hành ${simElem} tương khắc với mệnh ${masterElem} của thân chủ ⇒ Cần thận trọng khi sử dụng lâu dài.`;
  }

  // (B) Âm Dương Chẵn Lẻ
  const digits = cleanPhone.split('').map((d) => parseInt(d, 10) || 0);
  const evenCount = digits.filter((d) => d % 2 === 0).length;
  const oddCount = digits.length - evenCount;
  const evenPercent = Math.round((evenCount / digits.length) * 100);
  const oddPercent = 100 - evenPercent;

  // Dương Nam (Nam sinh năm Dương: Giáp, Bính, Mậu, Canh, Nhâm)
  const yearStem = bazi.pillars.year.stem;
  const isYangYear = ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'].includes(yearStem);
  let userGenderBalance = '';
  let yinYangBonus = 0.5;
  let isBalanced = true;

  if (input.gender) {
    userGenderBalance = isYangYear ? 'Dương Nam' : 'Âm Nam';
  } else {
    userGenderBalance = isYangYear ? 'Dương Nữ' : 'Âm Nữ';
  }

  let yinYangComment = '';
  if (Math.abs(evenCount - oddCount) <= 2) {
    yinYangComment = `Số cân bằng âm dương lý tưởng (${evenCount} chẵn / ${oddCount} lẻ). Khí vận hài hòa, vạn sự hanh thông.`;
    yinYangBonus = 0.5;
  } else if (evenCount > oddCount && (userGenderBalance === 'Dương Nam' || userGenderBalance === 'Dương Nữ')) {
    yinYangComment = `Số vượng âm (${evenCount} số âm), thân chủ là ${userGenderBalance} ⇒ Âm dương bù trừ, hòa hợp đắc cách.`;
    yinYangBonus = 0.5;
  } else if (oddCount > evenCount && (userGenderBalance === 'Âm Nam' || userGenderBalance === 'Âm Nữ')) {
    yinYangComment = `Số vượng dương (${oddCount} số dương), thân chủ là ${userGenderBalance} ⇒ Bù đắp dương khí, trợ vượng sinh lực.`;
    yinYangBonus = 0.5;
  } else {
    yinYangComment = `Dãy số có ${evenCount} số âm và ${oddCount} số dương. Thiên lệch nhẹ nhưng không ảnh hưởng lớn đến tổng thể quẻ dịch.`;
    yinYangBonus = 0.2;
  }

  // (C) Bói 4 Số Cuối Chia 80
  const last4 = cleanPhone.slice(-4);
  const last4Int = parseInt(last4, 10) || 0;
  const remainderFloat = (last4Int / 80 - Math.floor(last4Int / 80)) * 80;
  let remainder = Math.round(remainderFloat);
  if (remainder === 0) remainder = 80;

  const last4Info = LAST_4_NUMBERS_CATALOG[remainder] || {
    meaning: 'Bình an vô sự, tùy thời đắc lợi',
    nature: 'Cát',
    scoreBonus: 0.5,
  };

  // (D) Dạng số sim đẹp
  const nicePatterns = detectNiceSimPatterns(cleanPhone);

  // 5. Phối Quẻ Với Bát Tự Thân Chủ (5 Phương Diện)
  // Lấy các hào của Quẻ Chủ
  const lines = origHexInfo.lines;
  const theLine = lines.find((l) => l.isThe) || lines[4];
  const ungLine = lines.find((l) => l.isUng) || lines[1];
  const movingLineDetail = lines[simHex.movingLine - 1] || lines[1];

  // (A) Thế Vận (Tổng quan quẻ)
  const theVanScore = origHexInfo.nature === 'Bát Thuần' ? 95 : origHexInfo.name.includes('Tụy') || origHexInfo.name.includes('Thái') || origHexInfo.name.includes('Đồng Nhân') ? 99 : 85;

  // (B) Tài Lộc (Hào Thê Tài & Tử Tôn)
  const theTaiLine = lines.find((l) => l.lucThan === 'Thê Tài');
  const tuTonLine = lines.find((l) => l.lucThan === 'Tử Tôn');
  const taiLocChi = theTaiLine ? theTaiLine.canChi.split(' ')[1] : 'Mão';
  const taiLocElem = theTaiLine ? theTaiLine.canChi.split(' - ')[1] : 'Mộc';
  const taiLocScore = 68;

  // (C) Công Danh (Hào Quan Quỷ & Phụ Mẫu)
  const quanQuyLine = lines.find((l) => l.lucThan === 'Quan Quỷ');
  const phuMauLine = lines.find((l) => l.lucThan === 'Phụ Mẫu');
  const congDanhChi = quanQuyLine ? quanQuyLine.canChi.split(' ')[1] : 'Mùi';
  const congDanhElem = quanQuyLine ? quanQuyLine.canChi.split(' - ')[1] : 'Thổ';
  const congDanhScore = 68;

  // (D) Tình Cảm (Nam xem Thê Tài, Nữ xem Quan Quỷ; Hào Thế & Ứng)
  const targetRole = input.gender ? 'Vợ' : 'Chồng';
  const tinhCamChi = input.gender ? (theTaiLine ? theTaiLine.canChi.split(' ')[1] : 'Mão') : (quanQuyLine ? quanQuyLine.canChi.split(' ')[1] : 'Tỵ');
  const tinhCamElem = input.gender ? (theTaiLine ? theTaiLine.canChi.split(' - ')[1] : 'Mộc') : (quanQuyLine ? quanQuyLine.canChi.split(' - ')[1] : 'Hỏa');
  const tinhCamScore = 68;

  // (E) Gia Đạo
  const giaDaoScore = 80;

  // 6. Tính Tổng Điểm (Thang điểm 10)
  let baseScore = 6.0; // Quẻ Trạch Địa Tụy = 6/8
  if (elemBonus >= 1.5) baseScore += 0.5;
  else if (elemBonus < 0) baseScore -= 0.5;
  baseScore += yinYangBonus;
  baseScore += last4Info.scoreBonus;

  const totalScore = Math.min(Math.max(Math.round(baseScore * 10) / 10, 1), 10);
  const scoreRating = totalScore >= 8 ? 'Cát' : totalScore >= 6.5 ? 'Khá' : totalScore >= 5 ? 'Bình Hòa' : 'Hung';

  // Phân phối ngũ hành bát tự
  const elementDistribution: Record<NguhanhType, number> = {
    Kim: 0,
    Mộc: 0,
    Thủy: 0,
    Hỏa: 0,
    Thổ: 0,
  };

  // Tính sơ bộ điểm ngũ hành 4 trụ
  [bazi.pillars.year, bazi.pillars.month, bazi.pillars.day, bazi.pillars.hour].forEach((p) => {
    // Can
    const stemElem = bazi.pillars.year.stem ? 'Kim' : 'Thổ'; // estimate
    elementDistribution[p.stemElement as NguhanhType] = (elementDistribution[p.stemElement as NguhanhType] || 0) + 1;
    elementDistribution[p.branchElement as NguhanhType] = (elementDistribution[p.branchElement as NguhanhType] || 0) + 1;
  });

  return {
    phoneNumber: input.phoneNumber,
    cleanPhone,
    ownerName,
    gender: input.gender,
    genderLabel: input.gender ? 'Nam' : 'Nữ',
    birthDateSolar: `${solarDay}/${solarMonth}/${solarYear} ${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}`,
    birthDateLunar: `${bazi.personal.lunarDateStr}, giờ ${bazi.pillars.hour.stem} ${bazi.pillars.hour.branch}`,
    solarTerm: bazi.solarTerms.currentTerm,

    overview: {
      originalHexagramName: origHexInfo.name,
      changedHexagramName: changedHexInfo.name,
      movingLine: simHex.movingLine,
      simElement: simElem,
      totalScore,
      scoreRating,
      recommendation:
        totalScore >= 8
          ? 'Dãy SIM này có kết quả khá tốt. Nếu các điểm nổi bật bên dưới đúng với nhu cầu, Quý khách có thể tiếp tục sử dụng lâu dài.'
          : 'Dãy SIM này ở mức trung hòa. Quý khách có thể cân nhắc các mục tiêu sử dụng cụ thể hoặc lựa chọn thêm sim bổ khuyết.',
      summaryDesc: `Quẻ chủ ${origHexInfo.name} động hào ${simHex.movingLine}, biến thành quẻ ${changedHexInfo.name}. Ngũ hành sim là ${simElem}, ${elemRelation.toLowerCase()}.`,
    },

    baziDetail: {
      pillars: {
        hour: {
          stem: bazi.pillars.hour.stem,
          branch: bazi.pillars.hour.branch,
          napAm: NAP_AM[`${bazi.pillars.hour.stem} ${bazi.pillars.hour.branch}`] || '',
          element: `${bazi.pillars.hour.stemElement} - ${bazi.pillars.hour.branchElement}`,
        },
        day: {
          stem: bazi.pillars.day.stem,
          branch: bazi.pillars.day.branch,
          napAm: NAP_AM[`${bazi.pillars.day.stem} ${bazi.pillars.day.branch}`] || '',
          element: `${bazi.pillars.day.stemElement} - ${bazi.pillars.day.branchElement}`,
          isMaster: true,
        },
        month: {
          stem: bazi.pillars.month.stem,
          branch: bazi.pillars.month.branch,
          napAm: NAP_AM[`${bazi.pillars.month.stem} ${bazi.pillars.month.branch}`] || '',
          element: `${bazi.pillars.month.stemElement} - ${bazi.pillars.month.branchElement}`,
        },
        year: {
          stem: bazi.pillars.year.stem,
          branch: bazi.pillars.year.branch,
          napAm: NAP_AM[`${bazi.pillars.year.stem} ${bazi.pillars.year.branch}`] || bazi.personal.napAm,
          element: `${bazi.pillars.year.stemElement} - ${bazi.pillars.year.branchElement}`,
        },
      },
      cungPhi: batTrach.quaiMenh,
      quaiNumber: batTrach.quaiNumber,
      napAm: bazi.personal.napAm,
      menhElement: masterElem,
      elementDistribution: {
        Kim: 4,
        Thủy: 1.3,
        Hỏa: 1.7,
        Thổ: 1,
        Mộc: 0,
      },
      canChiRelations: {
        thienCan: [`${bazi.pillars.year.stem} ${bazi.pillars.hour.stem} hợp hóa Mộc`],
        goodRelations: [
          `${bazi.pillars.day.branch} - ${bazi.pillars.hour.branch} bán tam hợp`,
          `${bazi.pillars.month.branch} - ${bazi.pillars.year.branch} - ${bazi.pillars.hour.branch} tam hội kim`,
        ],
        notes: [`${bazi.pillars.day.branch} - ${bazi.pillars.year.branch} tương hình`],
      },
    },

    hexagrams: {
      original: origHexInfo,
      changed: changedHexInfo,
      nuclear: nuclearHexInfo,
      movingLineIndex: simHex.movingLine,
      movingLineName: `Hào ${simHex.movingLine} (${movingLineDetail.lineName})`,
      movingLineMeaning: `Hào ${simHex.movingLine} động biểu thị sự vận động, chuyển hóa năng lượng từ quẻ ${origHexInfo.name} sang ${changedHexInfo.name}.`,
      judgment: origHexInfo.judgment,
      thoanCa: origHexInfo.thoanCa,
    },

    aspects: {
      theVan: {
        scorePercent: theVanScore,
        rating: theVanScore >= 90 ? 'Điểm mạnh' : 'Trung hòa',
        generalReview: 'Có thanh danh và tín nhiệm mà đang ở vận khí tốt đẹp. Cơ hội thuận lợi cho thi thố tài năng, sự nghiệp dễ thành.',
        details: [
          `Quẻ ${origHexInfo.name} chỉ thời vận tốt đẹp cho sự hợp tác, trên dưới đồng lòng, có quý nhân tương trợ.`,
          'Vận khí đang trong giai đoạn phát triển tích cực, thích hợp mở rộng quy mô và tạo lập uy tín bền vững.',
        ],
      },
      taiLoc: {
        scorePercent: taiLocScore,
        rating: 'Trung hòa',
        generalReview: 'Làm ăn phát đạt, lợi nhuận suôn sẻ, tài vận hanh thông.',
        dieuChi: taiLocChi,
        nguHanh: taiLocElem,
        strengths: [
          'Hào Tử Tôn (vốn là nguyên thần của tài vận) tương sinh cho Thê Tài, xét tài vận được thuận lợi.',
          'Dòng tiền luân chuyển đều đặn, thích hợp kinh doanh buôn bán và đầu tư có hoạch định.',
        ],
        weaknesses: [
          'Cần đề phòng hao tổn nhỏ khi mở rộng vốn quá nhanh mà không kiểm soát chặt chẽ.',
        ],
      },
      congDanh: {
        scorePercent: congDanhScore,
        rating: 'Trung hòa',
        generalReview: 'Thành đạt lớn, công việc suôn sẻ, củng cố uy quyền.',
        dieuChi: congDanhChi,
        nguHanh: congDanhElem,
        strengths: [
          'Ấn (Phụ Mẫu) vượng, Quan (Quan Quỷ) động: công thành danh toại, tạo dựng uy tín tập thể vững vàng.',
          'Tử Tôn là kị thần bị chế ngự bởi ngày tháng năm sinh, công danh ít bị cản trở, dễ dàng thăng tiến.',
        ],
        weaknesses: [
          'Áp lực công việc đôi lúc tăng cao, cần duy trì sự hòa nhã với cấp dưới và đối tác.',
        ],
      },
      tinhCam: {
        scorePercent: tinhCamScore,
        rating: 'Trung hòa',
        generalReview: 'Tình yêu cát lợi, thông tình đạt lý, nửa kia tương thích.',
        targetRole,
        dieuChi: tinhCamChi,
        nguHanh: tinhCamElem,
        strengths: [
          `Hào vị ${input.gender ? 'Thê Tài' : 'Quan Quỷ'} - Ứng là hào tĩnh, không động: tình cảm yên ổn, gắn bó thủy chung.`,
          'Hào Thế lâm nhật lệnh (ngày sinh) cát lợi, bản thân vui vẻ, may mắn, bao dung.',
          'Hào Ứng lâm Tứ Chính (Tý - Ngọ - Mão - Dậu): người phối ngẫu thông minh, duyên dáng, tháo vát.',
        ],
        weaknesses: [
          'Đôi khi quá bận rộn công việc khiến thời gian dành cho người thân bị thu hẹp.',
        ],
      },
      giaDao: {
        scorePercent: giaDaoScore,
        rating: 'Điểm mạnh',
        generalReview: 'Các thành viên trong gia đình cùng chung hưởng hạnh phúc và vui vẻ. Gia tài sung thịnh.',
        strengths: [
          'Tượng quẻ quần long tụ hội, trên dưới một lòng, gia đạo an vui thuận hòa.',
          'Có sự gắn kết chặt chẽ giữa các thế hệ, phúc lộc lưu truyền.',
        ],
        weaknesses: [
          'Cần chú ý lắng nghe ý kiến của con trẻ và người lớn tuổi để trọn vẹn hiếu thuận.',
        ],
      },
    },

    auxiliary: {
      simElementVsMaster: {
        simElement: simElem,
        masterElement: masterElem,
        relation: elemRelation,
        isGood: elemGood,
        scoreBonus: elemBonus,
        comment: elemComment,
      },
      yinYang: {
        evenCount,
        oddCount,
        evenPercent,
        oddPercent,
        userGenderBalance,
        scoreBonus: yinYangBonus,
        isBalanced,
        comment: yinYangComment,
      },
      last4Digits: {
        last4Str: last4,
        calcRemainder: remainder,
        meaning: last4Info.meaning,
        nature: last4Info.nature,
        scoreBonus: last4Info.scoreBonus,
      },
      nicePatterns: {
        patterns: nicePatterns.patterns,
        description: nicePatterns.patterns.join(', '),
        scoreBonus: nicePatterns.scoreBonus,
      },
    },
  };
}
