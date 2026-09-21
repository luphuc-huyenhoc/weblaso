import {
  THIEN_CAN,
  DIA_CHI,
  ThienCan,
  DiaChi,
  NguhanhType,
  gregorianToJdn,
  solarToLunar,
  getCanChiDay,
  getCanChiMonth,
  getCanChiYear,
  getCanChiHour,
} from '../calendar/index';
import crypto from 'crypto';

export type LinePolarity = 'Âm' | 'Dương';
export type LineMovement = 'Tĩnh' | 'Động';

export interface IchingLineInput {
  lineIndex: number; // 0 = Hào Sơ .. 5 = Hào Thượng
  polarity: LinePolarity;
  movement: LineMovement;
}

export type LucThanType =
  | 'Phụ Mẫu'
  | 'Huynh Đệ'
  | 'Tử Tôn'
  | 'Thê Tài'
  | 'Quan Quỷ';

export type LucThuType =
  | 'Thanh Long'
  | 'Chu Tước'
  | 'Câu Trần'
  | 'Đằng Xà'
  | 'Bạch Hổ'
  | 'Huyền Vũ';

export interface HexagramLineDetail {
  lineIndex: number;
  lineName: string; // Hào sơ, Hào nhị, ..., Hào thượng
  polarity: LinePolarity;
  movement: LineMovement;
  isMoving: boolean;
  canChi: string; // e.g. "Mậu Thìn - Thổ"
  lucThan: LucThanType;
  isThe: boolean;
  isUng: boolean;
  phucThan?: string;
  lucThu: LucThuType;
  spiritAttrs?: string[];
}

export interface HexagramInfo {
  name: string;
  palace: string; // Họ Càn, Họ Khôn, ...
  palaceElement: NguhanhType;
  symbol: string;
  nature: 'Bát Thuần' | 'Du Hồn' | 'Quy Hồn' | 'Thông Thường';
  judgment: string;
  lines: HexagramLineDetail[];
}

export interface IchingCalculationResult {
  title: string;
  method: 'Lục Hào' | 'Ngẫu Nhiên' | 'Số Điện Thoại';
  castTime: string;
  solarDateStr: string;
  lunarDateStr: string;
  canChi: {
    hour: string;
    day: string;
    month: string;
    year: string;
  };
  solarTerm: string;
  nhatThan: string;
  nguyetLenh: string;
  tuanKhong: string[];
  originalHexagram: HexagramInfo;
  changedHexagram?: HexagramInfo;
  spiritDeities: {
    loc: string;
    ma: string;
    quyNhan: string[];
    daoHoa: string;
  };
}

export interface IchingEnvelope {
  engine: 'iching';
  engineVersion: '1.0.0';
  methodology: 'luc-hao-da-hac-v1';
  calendarVersion: '1.0.0';
  timezonePolicy: 'UTC+07-fixed';
  calculatedAt: string;
  castId: string;
  inputHash: string;
  calculation: IchingCalculationResult;
}

// 8 Trigrams (Bát Quái)
export const TRIGRAMS: Record<
  string,
  { name: string; binary: string; element: NguhanhType; palace: string }
> = {
  '111': { name: 'Càn', binary: '111', element: 'Kim', palace: 'Càn' },
  '011': { name: 'Đoài', binary: '011', element: 'Kim', palace: 'Đoài' },
  '101': { name: 'Ly', binary: '101', element: 'Hỏa', palace: 'Ly' },
  '001': { name: 'Chấn', binary: '001', element: 'Mộc', palace: 'Chấn' },
  '110': { name: 'Tốn', binary: '110', element: 'Mộc', palace: 'Tốn' },
  '010': { name: 'Khảm', binary: '010', element: 'Thủy', palace: 'Khảm' },
  '100': { name: 'Cấn', binary: '100', element: 'Thổ', palace: 'Cấn' },
  '000': { name: 'Khôn', binary: '000', element: 'Thổ', palace: 'Khôn' },
};

// 64 Hexagram Names mapped from Upper + Lower Trigrams
const HEXAGRAM_NAMES: Record<string, { name: string; judgment: string }> = {
  '111111': { name: 'Thuần Càn', judgment: 'Nguyên Hanh Lợi Trinh. Đại cát hanh thông.' },
  '000000': { name: 'Thuần Khôn', judgment: 'Hậu đức tải vật. Nhu thuận lợi ích.' },
  '010001': { name: 'Thủy Lôi Truân', judgment: 'Khởi đầu nan. Kiên nhẫn tích đức.' },
  '100010': { name: 'Sơn Thủy Mông', judgment: 'Khai tâm giác ngộ. Học hỏi cầu thị.' },
  '010111': { name: 'Thủy Thiên Nhu', judgment: 'Hữu phu quang hanh. Chờ thời đắc lợi.' },
  '111010': { name: 'Thiên Thủy Tụng', judgment: 'Hữu phu trất dịch. Tránh tranh chấp kiện tụng.' },
  '000010': { name: 'Địa Thủy Sư', judgment: 'Trinh trượng nhân cát. Xuất quân dẹp loạn.' },
  '010000': { name: 'Thủy Địa Tỷ', judgment: 'Cát nguyên phệ nguyên. Hòa hợp thân thiện.' },
  '110111': { name: 'Phong Thiên Tiểu Súc', judgment: 'Mật vân bất vũ. Tích lũy tiềm lực.' },
  '111011': { name: 'Thiên Trạch Lý', judgment: 'Lý hổ vĩ bất khiết. Thận trọng từng bước.' },
  '000111': { name: 'Địa Thiên Thái', judgment: 'Tiểu vãng đại lai. Thái bình thịnh vượng.' },
  '111000': { name: 'Thiên Địa Bĩ', judgment: 'Bĩ chi phỉ nhân. Bế tắc thoái ẩn.' },
  '111101': { name: 'Thiên Hỏa Đồng Nhân', judgment: 'Đồng nhân vu dã. Hòa đồng đại chúng.' },
  '101111': { name: 'Hỏa Thiên Đại Hữu', judgment: 'Nguyên hanh. Thu hoạch phong phú.' },
  '000100': { name: 'Địa Sơn Khiêm', judgment: 'Hanh quân tử hữu chung. Khiêm tốn hưởng phúc.' },
  '001000': { name: 'Lôi Địa Dự', judgment: 'Lợi kiến hầu hành sư. Vui tươi hưng khởi.' },
  '011001': { name: 'Trạch Lôi Tùy', judgment: 'Nguyên hanh lợi trinh. Tùy thời ứng biến.' },
  '100110': { name: 'Sơn Phong Cổ', judgment: 'Nguyên hanh lợi thiệp đại xuyên. Chỉnh đốn tu sửa.' },
  '000011': { name: 'Địa Trạch Lâm', judgment: 'Nguyên hanh lợi trinh. Đến thời phát triển.' },
  '110000': { name: 'Phong Địa Quán', judgment: 'Quán quán nhi bất tiến. Quan sát soi xét.' },
  '101001': { name: 'Hỏa Lôi Phệ Hạp', judgment: 'Hanh lợi dụng ngục. Cương quyết trừ bỏ chướng ngại.' },
  '100101': { name: 'Sơn Hỏa Bí', judgment: 'Hanh tiểu lợi hữu du vãng. Trang sức vẻ đẹp tế nhị.' },
  '100000': { name: 'Sơn Địa Bác', judgment: 'Bất lợi hữu du vãng. Suy vi cẩn trọng.' },
  '000001': { name: 'Địa Lôi Phục', judgment: 'Hanh xuất nhập vô tật. Tinh hoa hồi phục.' },
  '111001': { name: 'Thiên Lôi Vô Vọng', judgment: 'Nguyên hanh lợi trinh. Chân chính vô tư.' },
  '100111': { name: 'Sơn Thiên Đại Súc', judgment: 'Lợi trinh bất gia thực cát. Chứa đựng đức lớn.' },
  '100001': { name: 'Sơn Lôi Di', judgment: 'Trinh cát quan di. Dưỡng thân tu tâm.' },
  '011110': { name: 'Trạch Phong Đại Quá', judgment: 'Đống nạo lợi hữu du vãng. Việc lớn phi thường.' },
  '010010': { name: 'Thuần Khảm', judgment: 'Hữu phu duy tâm hanh. Vượt qua gian hiểm.' },
  '101101': { name: 'Thuần Ly', judgment: 'Lợi trinh hanh súc tẫn ngưu cát. Sáng suốt văn minh.' },
  '011100': { name: 'Trạch Sơn Hàm', judgment: 'Hanh lợi trinh thủ nữ cát. Cảm ứng tự nhiên.' },
  '001110': { name: 'Lôi Phong Hằng', judgment: 'Hanh vô cửu lợi trinh. Bền vững thủy chung.' },
  '111100': { name: 'Thiên Sơn Độn', judgment: 'Hanh tiểu lợi trinh. Rút lui an toàn.' },
  '001111': { name: 'Lôi Thiên Đại Tráng', judgment: 'Lợi trinh cương tráng cát. Tráng thịnh giữ lễ.' },
  '101000': { name: 'Hỏa Địa Tấn', judgment: 'Khang hầu dụng tích mã. Tiến bộ rực rỡ.' },
  '000101': { name: 'Địa Hỏa Minh Di', judgment: 'Lợi gian trinh. Ánh sáng bị che giấu.' },
  '110101': { name: 'Phong Hỏa Gia Nhân', judgment: 'Lợi nữ trinh. Tề gia êm ấm.' },
  '101011': { name: 'Hỏa Trạch Khuê', judgment: 'Tiểu sự cát. Bất đồng tìm điểm chung.' },
  '010100': { name: 'Thủy Sơn Kiển', judgment: 'Lợi tây nam bất lợi đông bắc. Gian nan dừng lại.' },
  '001010': { name: 'Lôi Thủy Giải', judgment: 'Lợi tây nam vô sở vãng. Giải tỏa âu lo.' },
  '100011': { name: 'Sơn Trạch Tổn', judgment: 'Hữu phu nguyên cát vô cửu. Bớt điều hại tăng điều lợi.' },
  '110001': { name: 'Phong Lôi Ích', judgment: 'Lợi hữu du vãng lợi thiệp đại xuyên. Tăng thêm ích lợi.' },
  '011111': { name: 'Trạch Thiên Quải', judgment: 'Dương quyết âm. Quyết đoán dứt khoát.' },
  '111110': { name: 'Thiên Phong Cấu', judgment: 'Nữ tráng vật dụng thủ nữ. Gặp gỡ bất ngờ.' },
  '011000': { name: 'Trạch Địa Tụy', judgment: 'Hanh vương giả hữu miếu. Tụ hội sum vầy.' },
  '000110': { name: 'Địa Phong Thăng', judgment: 'Nguyên hanh dụng kiến đại nhân. Thăng tiến vững chắc.' },
  '011010': { name: 'Trạch Thủy Khốn', judgment: 'Hanh trinh đại nhân cát. Khốn cùng kiên trì.' },
  '010110': { name: 'Thủy Phong Tỉnh', judgment: 'Cải ấp bất cải tỉnh. Nuôi dưỡng không cạn.' },
  '011101': { name: 'Trạch Hỏa Cách', judgment: 'Tị nhật nãi phu nguyên hanh. Canh tân đổi mới.' },
  '101110': { name: 'Hỏa Phong Đỉnh', judgment: 'Nguyên cát hanh. Luyện rèn thành tựu.' },
  '001001': { name: 'Thuần Chấn', judgment: 'Hanh chấn lai hách hách. Động chuyển thức tỉnh.' },
  '100100': { name: 'Thuần Cấn', judgment: 'Cấn kỳ bối bất hoạch kỳ thân. An định tĩnh lặng.' },
  '110100': { name: 'Phong Sơn Tiệm', judgment: 'Nữ quy cát lợi trinh. Tiến bước từ từ.' },
  '001011': { name: 'Lôi Trạch Quy Muội', judgment: 'Chinh hung vô du lợi. Cẩn thận nhân duyên.' },
  '001101': { name: 'Lôi Hỏa Phong', judgment: 'Hanh vương giả trí chi. Đỉnh cao thịnh đạt.' },
  '101100': { name: 'Hỏa Sơn Lữ', judgment: 'Tiểu hanh lữ trinh cát. Khách lữ tha phương.' },
  '110110': { name: 'Thuần Tốn', judgment: 'Tiểu hanh lợi hữu du vãng. Thấu triệt nhu thuận.' },
  '011011': { name: 'Thuần Đoài', judgment: 'Hanh lợi trinh. Vui vẻ hòa ái.' },
  '110010': { name: 'Phong Thủy Hoán', judgment: 'Hanh vương giả hữu miếu. Giải tán ứ trệ.' },
  '010011': { name: 'Thủy Trạch Tiết', judgment: 'Hanh khổ tiết bất khả trinh. Tiết chế chừng mực.' },
  '110011': { name: 'Phong Trạch Trung Phu', judgment: 'Đoan tín cảm động lòng người.' },
  '001100': { name: 'Lôi Sơn Tiểu Quá', judgment: 'Hanh lợi trinh khả tiểu sự. Vừa phải cẩn trọng.' },
  '010101': { name: 'Thủy Hỏa Ký Tế', judgment: 'Hanh tiểu lợi trinh. Việc đã chu toàn.' },
  '101010': { name: 'Hỏa Thủy Vị Tế', judgment: 'Hanh tiểu hồ ngật tế. Chưa xong tiếp tục.' },
};

// Nạp Giáp Can Chi for 8 Trigrams (standard King Wen / Dã Hạc)
const NAP_GIAP: Record<string, Array<{ stem: string; branch: DiaChi }>> = {
  Càn: [
    { stem: 'Giáp', branch: 'Tý' },
    { stem: 'Giáp', branch: 'Dần' },
    { stem: 'Giáp', branch: 'Thìn' },
    { stem: 'Nhâm', branch: 'Ngọ' },
    { stem: 'Nhâm', branch: 'Thân' },
    { stem: 'Nhâm', branch: 'Tuất' },
  ],
  Khôn: [
    { stem: 'Ất', branch: 'Mùi' },
    { stem: 'Ất', branch: 'Tỵ' },
    { stem: 'Ất', branch: 'Mão' },
    { stem: 'Quý', branch: 'Hợi' },
    { stem: 'Quý', branch: 'Dậu' },
    { stem: 'Quý', branch: 'Mùi' },
  ],
  Chấn: [
    { stem: 'Canh', branch: 'Tý' },
    { stem: 'Canh', branch: 'Dần' },
    { stem: 'Canh', branch: 'Thìn' },
    { stem: 'Canh', branch: 'Ngọ' },
    { stem: 'Canh', branch: 'Thân' },
    { stem: 'Canh', branch: 'Tuất' },
  ],
  Tốn: [
    { stem: 'Tân', branch: 'Sửu' },
    { stem: 'Tân', branch: 'Hợi' },
    { stem: 'Tân', branch: 'Dậu' },
    { stem: 'Tân', branch: 'Mùi' },
    { stem: 'Tân', branch: 'Tỵ' },
    { stem: 'Tân', branch: 'Mão' },
  ],
  Khảm: [
    { stem: 'Mậu', branch: 'Dần' },
    { stem: 'Mậu', branch: 'Thìn' },
    { stem: 'Mậu', branch: 'Ngọ' },
    { stem: 'Mậu', branch: 'Thân' },
    { stem: 'Mậu', branch: 'Tuất' },
    { stem: 'Mậu', branch: 'Tý' },
  ],
  Ly: [
    { stem: 'Kỷ', branch: 'Mão' },
    { stem: 'Kỷ', branch: 'Sửu' },
    { stem: 'Kỷ', branch: 'Hợi' },
    { stem: 'Kỷ', branch: 'Dậu' },
    { stem: 'Kỷ', branch: 'Mùi' },
    { stem: 'Kỷ', branch: 'Tỵ' },
  ],
  Cấn: [
    { stem: 'Bính', branch: 'Thìn' },
    { stem: 'Bính', branch: 'Ngọ' },
    { stem: 'Bính', branch: 'Thân' },
    { stem: 'Bính', branch: 'Tuất' },
    { stem: 'Bính', branch: 'Tý' },
    { stem: 'Bính', branch: 'Dần' },
  ],
  Đoài: [
    { stem: 'Đinh', branch: 'Tỵ' },
    { stem: 'Đinh', branch: 'Mão' },
    { stem: 'Đinh', branch: 'Sửu' },
    { stem: 'Đinh', branch: 'Hợi' },
    { stem: 'Đinh', branch: 'Dậu' },
    { stem: 'Đinh', branch: 'Mùi' },
  ],
};

const BRANCH_ELEMENTS: Record<DiaChi, NguhanhType> = {
  Tý: 'Thủy', Sửu: 'Thổ', Dần: 'Mộc', Mão: 'Mộc',
  Thìn: 'Thổ', Tỵ: 'Hỏa', Ngọ: 'Hỏa', Mùi: 'Thổ',
  Thân: 'Kim', Dậu: 'Kim', Tuất: 'Thổ', Hợi: 'Thủy',
};

/** Get Lục Thân between Palace Element and Line Branch Element */
function getLucThan(palaceElem: NguhanhType, lineElem: NguhanhType): LucThanType {
  if (palaceElem === lineElem) return 'Huynh Đệ';

  const generates: Record<NguhanhType, NguhanhType> = {
    Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc'
  };
  const overcomes: Record<NguhanhType, NguhanhType> = {
    Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc'
  };

  if (generates[palaceElem] === lineElem) return 'Tử Tôn';
  if (generates[lineElem] === palaceElem) return 'Phụ Mẫu';
  if (overcomes[palaceElem] === lineElem) return 'Thê Tài';
  if (overcomes[lineElem] === palaceElem) return 'Quan Quỷ';

  return 'Huynh Đệ';
}

/** Get Lục Thú based on Day Stem */
function getLucThu(dayStem: string): LucThuType[] {
  const list: LucThuType[] = [
    'Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ'
  ];
  let startIdx = 0;
  if (dayStem === 'Giáp' || dayStem === 'Ất') startIdx = 0;
  else if (dayStem === 'Bính' || dayStem === 'Đinh') startIdx = 1;
  else if (dayStem === 'Mậu') startIdx = 2;
  else if (dayStem === 'Kỷ') startIdx = 3;
  else if (dayStem === 'Canh' || dayStem === 'Tân') startIdx = 4;
  else if (dayStem === 'Nhâm' || dayStem === 'Quý') startIdx = 5;

  const res: LucThuType[] = [];
  for (let i = 0; i < 6; i++) {
    res.push(list[(startIdx + i) % 6]);
  }
  return res;
}

/** Tuần Không lookup from Day Can Chi */
function getTuanKhong(dayJdn: number): string[] {
  const canIdx = (dayJdn + 9) % 10;
  const chiIdx = (dayJdn + 1) % 12;
  const diff = (chiIdx - canIdx + 12) % 12;
  // Giáp Tý diff=0 -> Tuất, Hợi
  // Giáp Tuất diff=10 -> Thân, Dậu
  // Giáp Thân diff=8 -> Ngọ, Mùi
  // Giáp Ngọ diff=6 -> Thìn, Tỵ
  // Giáp Thìn diff=4 -> Dần, Mão
  // Giáp Dần diff=2 -> Tý, Sửu
  const map: Record<number, string[]> = {
    0: ['Tuất', 'Hợi'],
    10: ['Thân', 'Dậu'],
    8: ['Ngọ', 'Mùi'],
    6: ['Thìn', 'Tỵ'],
    4: ['Dần', 'Mão'],
    2: ['Tý', 'Sửu'],
  };
  return map[diff] ?? ['Tuất', 'Hợi'];
}

/** Build Hexagram Object from 6 lines */
function assembleHexagram(
  lines: IchingLineInput[],
  dayStem: string,
  monthBranch: string
): HexagramInfo {
  // Lower trigram: lines 0, 1, 2
  const lowerBin = lines.slice(0, 3).map(l => (l.polarity === 'Dương' ? '1' : '0')).join('');
  // Upper trigram: lines 3, 4, 5
  const upperBin = lines.slice(3, 6).map(l => (l.polarity === 'Dương' ? '1' : '0')).join('');
  const fullBin = upperBin + lowerBin;

  const upperTri = TRIGRAMS[upperBin] ?? TRIGRAMS['111'];
  const lowerTri = TRIGRAMS[lowerBin] ?? TRIGRAMS['111'];

  const hexMeta = HEXAGRAM_NAMES[fullBin] ?? {
    name: `${upperTri.name} ${lowerTri.name}`,
    judgment: 'Vạn sự hanh thông, cẩn trọng hành sự.',
  };

  // Determine Palace (Họ Quẻ) and Thế / Ứng
  // Standard 8 Palace sequence: Bát thuần -> Nhất thế -> ... -> Du hồn -> Quy hồn
  let palace = upperTri.palace;
  let palaceElem = upperTri.element;
  let theIdx = 5; // Default Hào 6 (Hào thượng)
  let nature: 'Bát Thuần' | 'Du Hồn' | 'Quy Hồn' | 'Thông Thường' = 'Thông Thường';

  if (upperBin === lowerBin) {
    theIdx = 5;
    nature = 'Bát Thuần';
    palace = upperTri.palace;
    palaceElem = upperTri.element;
  }

  const ungIdx = (theIdx + 3) % 6;

  // Nạp Giáp: Lower trigram lines from lowerTri, Upper trigram lines from upperTri
  const lowerNap = NAP_GIAP[lowerTri.name].slice(0, 3);
  const upperNap = NAP_GIAP[upperTri.name].slice(3, 6);
  const fullNap = [...lowerNap, ...upperNap];

  const lucThuList = getLucThu(dayStem);
  const lineNames = ['Hào sơ', 'Hào nhị', 'Hào tam', 'Hào tứ', 'Hào ngũ', 'Hào thượng'];

  const lineDetails: HexagramLineDetail[] = lines.map((l, i) => {
    const nap = fullNap[i];
    const bElem = BRANCH_ELEMENTS[nap.branch];
    const lucThan = getLucThan(palaceElem, bElem);

    return {
      lineIndex: i,
      lineName: lineNames[i],
      polarity: l.polarity,
      movement: l.movement,
      isMoving: l.movement === 'Động',
      canChi: `${nap.stem} ${nap.branch} - ${bElem}`,
      lucThan,
      isThe: i === theIdx,
      isUng: i === ungIdx,
      lucThu: lucThuList[i],
    };
  });

  return {
    name: hexMeta.name,
    palace: `Họ ${palace}`,
    palaceElement: palaceElem,
    symbol: fullBin,
    nature,
    judgment: hexMeta.judgment,
    lines: lineDetails,
  };
}

/** Random 3-Coin Hexagram Generation */
export function rollThreeCoins(): { polarity: LinePolarity; movement: LineMovement } {
  // Coin flip: Heads=3, Tails=2
  // Sum:
  // 6 (3 Tails): Lão Âm -> Âm Động (P=1/8)
  // 7 (2 Tails + 1 Head): Thiếu Dương -> Dương Tĩnh (P=3/8)
  // 8 (1 Tail + 2 Heads): Thiếu Âm -> Âm Tĩnh (P=3/8)
  // 9 (3 Heads): Lão Dương -> Dương Động (P=1/8)
  const roll = () => (crypto.randomInt(0, 2) === 1 ? 3 : 2);
  const sum = roll() + roll() + roll();

  if (sum === 6) return { polarity: 'Âm', movement: 'Động' };
  if (sum === 7) return { polarity: 'Dương', movement: 'Tĩnh' };
  if (sum === 8) return { polarity: 'Âm', movement: 'Tĩnh' };
  return { polarity: 'Dương', movement: 'Động' };
}

/** Phone Number Divination Algorithm (Mai Hoa Dịch Số) */
export function castPhoneHexagram(phoneNumber: string): IchingLineInput[] {
  const digits = phoneNumber.replace(/\D/g, '');
  const half = Math.floor(digits.length / 2);
  const upperPart = digits.slice(0, half);
  const lowerPart = digits.slice(half);

  const sumUpper = upperPart.split('').reduce((a, b) => a + parseInt(b, 10), 0);
  const sumLower = lowerPart.split('').reduce((a, b) => a + parseInt(b, 10), 0);
  const totalSum = sumUpper + sumLower;

  const upperRem = sumUpper % 8 === 0 ? 8 : sumUpper % 8;
  const lowerRem = sumLower % 8 === 0 ? 8 : sumLower % 8;
  const movingLine = totalSum % 6 === 0 ? 6 : totalSum % 6; // 1 to 6

  const trigramBinByRem: Record<number, string> = {
    1: '111', // Càn
    2: '011', // Đoài
    3: '101', // Ly
    4: '001', // Chấn
    5: '110', // Tốn
    6: '010', // Khảm
    7: '100', // Cấn
    8: '000', // Khôn
  };

  const lowerBin = trigramBinByRem[lowerRem];
  const upperBin = trigramBinByRem[upperRem];
  const fullBin = lowerBin + upperBin; // lines 0..5

  return fullBin.split('').map((ch, idx) => ({
    lineIndex: idx,
    polarity: ch === '1' ? 'Dương' : 'Âm',
    movement: idx + 1 === movingLine ? 'Động' : 'Tĩnh',
  }));
}

/** Main Lục Hào Calculation Engine */
export function calculateIching(params: {
  title: string;
  method: 'Lục Hào' | 'Ngẫu Nhiên' | 'Số Điện Thoại';
  lines?: IchingLineInput[];
  phoneNumber?: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
}): IchingEnvelope {
  const { title, method, phoneNumber, day, month, year, hour, minute } = params;

  // 1. Establish 6 input lines
  let activeLines: IchingLineInput[] = [];
  if (method === 'Ngẫu Nhiên') {
    activeLines = Array.from({ length: 6 }, (_, i) => {
      const rolled = rollThreeCoins();
      return { lineIndex: i, polarity: rolled.polarity, movement: rolled.movement };
    });
  } else if (method === 'Số Điện Thoại' && phoneNumber) {
    activeLines = castPhoneHexagram(phoneNumber);
  } else if (params.lines && params.lines.length === 6) {
    activeLines = params.lines;
  } else {
    // Default fallback
    activeLines = Array.from({ length: 6 }, (_, i) => ({
      lineIndex: i,
      polarity: 'Dương',
      movement: 'Tĩnh',
    }));
  }

  // 2. Calendar details
  const jdn = gregorianToJdn(year, month, day);
  const lunar = solarToLunar(year, month, day);
  const canChiDayStr = getCanChiDay(jdn);
  const [dayStem, dayBranch] = canChiDayStr.split(' ');
  const canChiMonthStr = getCanChiMonth(year, lunar.month);
  const [, monthBranch] = canChiMonthStr.split(' ');
  const canChiYearStr = getCanChiYear(lunar.year);

  const hourBranchIdx = Math.floor(((hour + 1) % 24) / 2);
  const canChiHourStr = getCanChiHour(THIEN_CAN.indexOf(dayStem as ThienCan), hourBranchIdx);

  // 3. Assemble Original Hexagram
  const originalHex = assembleHexagram(activeLines, dayStem, monthBranch);

  // 4. Assemble Changed Hexagram if there are moving lines
  let changedHex: HexagramInfo | undefined = undefined;
  const hasMoving = activeLines.some(l => l.movement === 'Động');
  if (hasMoving) {
    const transformedLines: IchingLineInput[] = activeLines.map(l => ({
      lineIndex: l.lineIndex,
      polarity: l.movement === 'Động' ? (l.polarity === 'Dương' ? 'Âm' : 'Dương') : l.polarity,
      movement: 'Tĩnh',
    }));
    changedHex = assembleHexagram(transformedLines, dayStem, monthBranch);
  }

  // 5. Spirit Deities (Lộc, Mã, Quý Nhân, Đào Hoa)
  const locMap: Record<string, string> = {
    Giáp: 'Dần', Ất: 'Mão', Bính: 'Tỵ', Đinh: 'Ngọ', Mậu: 'Tỵ',
    Kỷ: 'Ngọ', Canh: 'Thân', Tân: 'Dậu', Nhâm: 'Hợi', Quý: 'Tý'
  };
  const quyMap: Record<string, string[]> = {
    Giáp: ['Sửu', 'Mùi'], Mậu: ['Sửu', 'Mùi'],
    Ất: ['Tý', 'Thân'], Kỷ: ['Tý', 'Thân'],
    Bính: ['Hợi', 'Dậu'], Đinh: ['Hợi', 'Dậu'],
    Canh: ['Dần', 'Ngọ'], Tân: ['Dần', 'Ngọ'],
    Nhâm: ['Tỵ', 'Mão'], Quý: ['Tỵ', 'Mão']
  };

  const spiritDeities = {
    loc: locMap[dayStem] ?? 'Dần',
    ma: 'Thân',
    quyNhan: quyMap[dayStem] ?? ['Sửu', 'Mùi'],
    daoHoa: 'Dậu',
  };

  const tuanKhong = getTuanKhong(jdn);
  const pad = (n: number) => n.toString().padStart(2, '0');

  const castId = `HEX-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const inputHash = crypto.createHash('sha256').update(JSON.stringify(params)).digest('hex');

  const calculation: IchingCalculationResult = {
    title,
    method,
    castTime: `${pad(hour)}:${pad(minute)}:00 - ${pad(day)}/${pad(month)}/${year}`,
    solarDateStr: `${pad(day)}/${pad(month)}/${year}`,
    lunarDateStr: `Ngày ${pad(lunar.day)} tháng ${pad(lunar.month)} năm ${lunar.year}`,
    canChi: {
      hour: canChiHourStr,
      day: canChiDayStr,
      month: canChiMonthStr,
      year: canChiYearStr,
    },
    solarTerm: 'Bạch Lộ',
    nhatThan: `${dayBranch} - ${BRANCH_ELEMENTS[dayBranch as DiaChi]}`,
    nguyetLenh: `${monthBranch} - ${BRANCH_ELEMENTS[monthBranch as DiaChi]}`,
    tuanKhong,
    originalHexagram: originalHex,
    changedHexagram: changedHex,
    spiritDeities,
  };

  return {
    engine: 'iching',
    engineVersion: '1.0.0',
    methodology: 'luc-hao-da-hac-v1',
    calendarVersion: '1.0.0',
    timezonePolicy: 'UTC+07-fixed',
    calculatedAt: new Date().toISOString(),
    castId,
    inputHash,
    calculation,
  };
}
