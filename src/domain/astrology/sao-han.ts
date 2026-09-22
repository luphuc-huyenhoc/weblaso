import {
  solarToLunar,
  lunarToSolar,
  getCanChiYear,
  DIA_CHI,
  DiaChi,
} from '../calendar/index';

export interface SaoHanInput {
  fullName?: string;
  gender: boolean; // true = Nam, false = Nữ
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  isLunar?: boolean;
  targetYear?: number;
}

export interface SaoHanDetailedResult {
  fullName: string;
  genderLabel: 'Nam' | 'Nữ';
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  isLunar: boolean;
  solarBirthDate: string;
  lunarBirthDate: string;
  birthYearCanChi: string;
  menhNapAm: string;
  targetYear: number;
  targetYearCanChi: string;
  solarAge: number;
  lunarAge: number; // Tuổi mụ
  cuuDieu: {
    star: string;
    nature: 'Cát' | 'Hung' | 'Trung Tính';
    element: string;
    description: string;
    poem: string;
    remedy: string;
  };
  nienHan: {
    name: string;
    impact: string;
    description: string;
  };
  tamTai: {
    isTamTai: boolean;
    yearIndex: number; // 1, 2, 3 or 0
    description: string;
  };
  kimLau: {
    isKimLau: boolean;
    type?: 'Kim Lâu Thân' | 'Kim Lâu Thê' | 'Kim Lâu Tử' | 'Kim Lâu Súc';
    description: string;
  };
  hoangOc: {
    palace: 'Nhất Cát' | 'Nhì Nghi' | 'Tam Địa Sát' | 'Tứ Tấn Tài' | 'Ngũ Thọ Tử' | 'Lục Hoang Ốc';
    isGood: boolean;
    description: string;
  };
}

// 60 Hoa Giáp Nạp Âm Table
const NAP_AM_MAP: Record<string, string> = {
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

export function getNapAmFromYear(year: number): { canChi: string; napAm: string } {
  const canChi = getCanChiYear(year);
  return {
    canChi,
    napAm: NAP_AM_MAP[canChi] || '',
  };
}

// Cửu Diệu details
interface StarInfo {
  nature: 'Cát' | 'Hung' | 'Trung Tính';
  element: string;
  description: string;
  poem: string;
  remedy: string;
}

const STAR_DETAILS: Record<string, StarInfo> = {
  'Thái Dương': {
    nature: 'Cát',
    element: 'Hỏa',
    description: 'Là đệ nhất cát tinh trong Cửu Diệu. Chủ về quang minh lỗi lạc, công danh thăng tiến rực rỡ, tài lộc dồi dào, vạn sự hanh thông. Nam giới gặp sao này làm ăn phát đạt, thăng quan tiến chức.',
    poem: 'Thái Dương chiếu mệnh sáng ngời\nKinh doanh đại lợi thảnh thơi cả mùa\nCông danh tài lộc có thừa\nGia môn hòa thuận sớm trưa thái bình.',
    remedy: 'Nghênh sao vào ngày 27 âm lịch hàng tháng (từ 21h đến 23h), hướng chính Đông. Dùng 12 ngọn nến, bài vị màu vàng ghi chữ "Nhật Cung Thái Dương Thiên Tử Tinh Quân".',
  },
  'Thái Âm': {
    nature: 'Cát',
    element: 'Thủy',
    description: 'Chủ về sự thanh tĩnh, danh lợi vẹn toàn, quý nhân phù trợ, mua bán bất động sản hanh thông. Nữ giới gặp sao Thái Âm cầu tài danh hay tình duyên đều rất thuận lợi.',
    poem: 'Thái Âm chiếu mệnh năm nay\nKhởi sự như ý tiền tài hanh thông\nCầu danh đắc lợi trọn lòng\nQuý nhân giúp đỡ thỏa lòng ước mong.',
    remedy: 'Nghênh sao vào ngày 26 âm lịch hàng tháng (từ 19h đến 21h), hướng chính Tây. Dùng 7 ngọn nến, bài vị màu vàng ghi chữ "Nguyệt Cung Thái Âm Hoàng Hậu Tinh Quân".',
  },
  'Mộc Đức': {
    nature: 'Cát',
    element: 'Mộc',
    description: 'Là sao phúc tinh chủ về hòa khí, nhân duyên tốt đẹp, kết giao bạn lành, trong nhà thêm người thêm của. Khởi sự việc lớn vào tháng 10 và tháng 12 âm lịch thì đại lợi.',
    poem: 'Mộc Đức sao ấy tốt thay\nTháng mười, tháng chạp tiền tài phong lưu\nGia đạo an lạc sum vầy\nHôn nhân hòa hợp đón ngày cát tường.',
    remedy: 'Nghênh sao vào ngày 25 âm lịch hàng tháng (từ 19h đến 21h), hướng chính Đông. Dùng 20 ngọn nến, bài vị màu xanh ghi chữ "Đông Phương Giáp Ất Mộc Đức Tinh Quân".',
  },
  'Vân Hán': {
    nature: 'Trung Tính',
    element: 'Hỏa',
    description: 'Sao Vân Hán (Vân Hớn) chủ về giữ gìn lời ăn tiếng nói, phòng khẩu thiệt thị phi, kiện tụng. Việc làm ăn duy trì ở mức trung bình, phòng tháng 2 và tháng 8 âm lịch gặp điều phiền muộn.',
    poem: 'Vân Hớn chiếu mạng năm nay\nĐề phòng khẩu thiệt tháng hai, tháng mười\nLời ăn tiếng nói giữ gìn\nLàm ăn thận trọng gia đình mới yên.',
    remedy: 'Dâng sao giải hạn vào ngày 29 âm lịch hàng tháng (từ 21h đến 23h), hướng chính Nam. Dùng 15 ngọn nến, bài vị màu đỏ ghi chữ "Nam Phương Bính Đinh Vân Hớn Tinh Quân".',
  },
  'Thổ Tú': {
    nature: 'Trung Tính',
    element: 'Thổ',
    description: 'Sao Thổ Tú là sao ách tinh hạng trung, chủ về trở ngại trong công việc, tâm tính bất an, đi xa cần cẩn trọng. Kỵ nhất vào tháng 4 và tháng 8 âm lịch, dễ có kẻ tiểu nhân gièm pha.',
    poem: 'Thổ Tú sao ấy phải lo\nTháng tư, tháng tám lắng lo mọi bề\nĐi xa cẩn trọng chớ mê\nKẻo sinh điều hại lỗi thề bạn thân.',
    remedy: 'Cúng giải hạn vào ngày 19 âm lịch hàng tháng (từ 21h đến 23h), hướng chính Tây. Dùng 5 ngọn nến, bài vị màu vàng ghi chữ "Trung Ương Mậu Kỷ Thổ Tú Tinh Quân".',
  },
  'Thủy Diệu': {
    nature: 'Trung Tính',
    element: 'Thủy',
    description: 'Sao Thủy Diệu là sao tốt về tài lộc nhưng kỵ việc sông nước đường thủy và thị phi khẩu thiệt vào tháng 4 và tháng 8 âm lịch. Nữ giới cần giữ hòa khí trong gia đình.',
    poem: 'Thủy Diệu sao ấy bất tường\nTháng tư, tháng tám chớ thường đi xa\nTránh nơi sông nước bao la\nLời qua tiếng lại sinh ra oán cừu.',
    remedy: 'Cúng dâng sao vào ngày 21 âm lịch hàng tháng (từ 21h đến 23h), hướng chính Bắc. Dùng 7 ngọn nến, bài vị màu đen hoặc xanh sẫm ghi chữ "Bắc Phương Nhâm Quý Thủy Diệu Tinh Quân".',
  },
  'La Hầu': {
    nature: 'Hung',
    element: 'Kim',
    description: 'Đại hung tinh đối với nam giới (khẩu thiệt tinh). Chủ về công quyền, kiện tụng, thị phi, tai mắt bệnh tật, hao tán tiền của. Kỵ nhất tháng Giêng và tháng 7 âm lịch.',
    poem: 'La Hầu chiếu mạng năm nay\nĐầu năm giải hạn họa may mới lành\nThị phi khẩu thiệt loanh quanh\nTháng giêng, tháng bảy giữ mình bình an.',
    remedy: 'Dâng sao giải hạn vào ngày mùng 8 âm lịch hàng tháng (từ 21h đến 23h), hướng chính Bắc. Dùng 9 ngọn nến, bài vị màu vàng ghi chữ "Thiên Cung Thần Thủ La Hầu Tinh Quân".',
  },
  'Kế Đô': {
    nature: 'Hung',
    element: 'Thổ',
    description: 'Đại hung tinh đối với nữ giới (ám muội tinh). Chủ về buồn phiền, sầu muộn, ốm đau, hao tài tốnของ, gặp cảnh éo le. Tuy nhiên nếu phụ nữ có thai gặp sao Kế Đô thì lại chuyển biến lành.',
    poem: 'Kế Đô sao chiếu bất tường\nNữ nhân âu muộn sầu vương đêm ngày\nTháng ba, tháng chín đắng cay\nThành tâm khấn nguyện đón ngày bình yên.',
    remedy: 'Dâng sao giải hạn vào ngày 18 âm lịch hàng tháng (từ 21h đến 23h), hướng chính Tây. Dùng 21 ngọn nến, bài vị màu vàng ghi chữ "Địa Cung Thần Vĩ Kế Đô Tinh Quân".',
  },
  'Thái Bạch': {
    nature: 'Hung',
    element: 'Kim',
    description: 'Hung tinh nặng nhất về tiền tài ("Thái Bạch sạch bách cửa nhà"). Chủ về hao tán tài sản, dễ bị tiểu nhân hãm hại, đau ốm kéo dài. Kỵ nhất vào tháng 5 âm lịch.',
    poem: 'Thái Bạch sao ấy gian nan\nĐồng tiền kiếm được dễ bề tiêu tan\nTháng năm đề phòng việc quan\nGiữ mình ngay thẳng chớ màng lợi danh.',
    remedy: 'Dâng sao giải hạn vào ngày 15 âm lịch hàng tháng (từ 19h đến 21h), hướng chính Tây. Dùng 8 ngọn nến, bài vị màu trắng ghi chữ "Tây Phương Canh Tân Thái Bạch Tinh Quân".',
  },
};

// 8 Niên Hạn details
const NIEN_HAN_DETAILS: Record<string, { impact: string; description: string }> = {
  'Huỳnh Tuyền': {
    impact: 'Hạn bệnh nặng, kỵ đường thủy',
    description: 'Đề phòng bệnh tật bất ngờ, không nên đi đò bè hay vượt sông lớn, tránh mưu cầu danh lợi bằng con đường liều lĩnh.',
  },
  'Tam Kheo': {
    impact: 'Hạn đau mắt, tay chân',
    description: 'Chú ý các bệnh về mắt và xương khớp, tránh té ngã khi đi lại, làm việc nơi cao hoặc vận động mạnh.',
  },
  'Ngũ Mộ': {
    impact: 'Hạn hao tài, mất của',
    description: 'Tránh mua đồ không rõ nguồn gốc, chớ cho người lạ ngủ nhờ, cẩn thận kẻ trộm cắp và bảo quản tài sản kỹ lưỡng.',
  },
  'Thiên Tinh': {
    impact: 'Hạn ngộ độc, kiện tụng',
    description: 'Đề phòng ngộ độc thực phẩm, ăn uống cẩn trọng, tránh tranh chấp to tiếng dễ kéo theo kiện tụng pháp lý.',
  },
  'Tán Tận': {
    impact: 'Hạn đại hao tài, tai nạn bất ngờ',
    description: 'Không nên mang theo nhiều tiền mặt đi đường, không đầu tư mạo hiểm, chú ý khi tham gia giao thông.',
  },
  'Thiên La': {
    impact: 'Hạn tinh thần, tâm lý bất an',
    description: 'Đề phòng chứng mất ngủ, lo âu, gia đạo bất hòa, vợ chồng ghen tuông cãi vã, cần nhường nhịn lẫn nhau.',
  },
  'Địa Võng': {
    impact: 'Hạn thị phi, hiểu lầm',
    description: 'Không nên đi ra ngoài vào ban đêm, chớ xen vào chuyện người khác, cẩn trọng lời nói tránh tai bay vạ gió.',
  },
  'Diêm Vương': {
    impact: 'Hạn sản nạn, bệnh tim mạch',
    description: 'Nữ giới có thai cần hết sức chú ý sinh nở, người có bệnh tim mạch hay huyết áp cần theo dõi sức khỏe chặt chẽ.',
  },
};

export function calculateSaoHanDetailed(input: SaoHanInput): SaoHanDetailedResult {
  const currentYear = new Date().getFullYear();
  const targetYear = input.targetYear ?? currentYear;
  const fullName = input.fullName?.trim() || 'Gia Chủ';
  const gender = input.gender;
  const genderLabel = gender ? 'Nam' : 'Nữ';

  let lunarYear = input.birthYear;
  let lunarMonth = input.birthMonth;
  let lunarDay = input.birthDay;

  let solarYear = input.birthYear;
  let solarMonth = input.birthMonth;
  let solarDay = input.birthDay;

  if (input.isLunar) {
    // Input is lunar -> convert to solar
    const sol = lunarToSolar(input.birthYear, input.birthMonth, input.birthDay, false);
    solarYear = sol.year;
    solarMonth = sol.month;
    solarDay = sol.day;
  } else {
    // Input is solar -> convert to lunar
    const lun = solarToLunar(input.birthYear, input.birthMonth, input.birthDay);
    lunarYear = lun.year;
    lunarMonth = lun.month;
    lunarDay = lun.day;
  }

  const birthYearCanChi = getCanChiYear(lunarYear);
  const targetYearCanChi = getCanChiYear(targetYear);
  const menhNapAm = NAP_AM_MAP[birthYearCanChi] || 'Bình Địa Mộc';

  const solarAge = targetYear - solarYear;
  const lunarAge = targetYear - lunarYear + 1; // Tuổi mụ chuẩn truyền thống

  // 1. Cửu Diệu
  const maleStars = [
    'La Hầu', 'Thổ Tú', 'Thủy Diệu', 'Thái Bạch', 'Thái Dương',
    'Vân Hán', 'Kế Đô', 'Thái Âm', 'Mộc Đức'
  ];
  const femaleStars = [
    'Kế Đô', 'Vân Hán', 'Mộc Đức', 'Thái Âm', 'Thổ Tú',
    'La Hầu', 'Thái Dương', 'Thủy Diệu', 'Thái Bạch'
  ];

  const starIdx = (lunarAge - 10 + 900) % 9;
  const starName = gender ? maleStars[starIdx] : femaleStars[starIdx];
  const starInfo = STAR_DETAILS[starName] || STAR_DETAILS['Thái Dương'];

  // 2. Niên Hạn (8 Limits)
  const nienHanList = ['Huỳnh Tuyền', 'Tam Kheo', 'Ngũ Mộ', 'Thiên Tinh', 'Tán Tận', 'Thiên La', 'Địa Võng', 'Diêm Vương'];
  const hanIdx = (lunarAge - 10 + 800) % 8;
  const hanName = nienHanList[hanIdx];
  const hanInfo = NIEN_HAN_DETAILS[hanName] || {
    impact: 'Hạn niên vận',
    description: 'Thận trọng giữ gìn tài sản và hòa khí gia đình.',
  };

  // 3. Tam Tai
  const birthChi = DIA_CHI[(lunarYear + 8) % 12];
  const targetChi = DIA_CHI[(targetYear + 8) % 12];
  const tamTaiGroups: Record<string, DiaChi[]> = {
    Thân: ['Dần', 'Mão', 'Thìn'], Tý: ['Dần', 'Mão', 'Thìn'], Thìn: ['Dần', 'Mão', 'Thìn'],
    Dần: ['Thân', 'Dậu', 'Tuất'], Ngọ: ['Thân', 'Dậu', 'Tuất'], Tuất: ['Thân', 'Dậu', 'Tuất'],
    Tỵ: ['Hợi', 'Tý', 'Sửu'], Dậu: ['Hợi', 'Tý', 'Sửu'], Sửu: ['Hợi', 'Tý', 'Sửu'],
    Hợi: ['Tỵ', 'Ngọ', 'Mùi'], Mão: ['Tỵ', 'Ngọ', 'Mùi'], Mùi: ['Tỵ', 'Ngọ', 'Mùi'],
  };
  const ttGroup = tamTaiGroups[birthChi] || [];
  const ttIdx = ttGroup.indexOf(targetChi);
  const isTamTai = ttIdx !== -1;

  // 4. Kim Lâu
  const klRem = lunarAge % 9;
  let isKimLau = false;
  let klType: 'Kim Lâu Thân' | 'Kim Lâu Thê' | 'Kim Lâu Tử' | 'Kim Lâu Súc' | undefined = undefined;
  if (klRem === 1) { isKimLau = true; klType = 'Kim Lâu Thân'; }
  else if (klRem === 3) { isKimLau = true; klType = 'Kim Lâu Thê'; }
  else if (klRem === 6) { isKimLau = true; klType = 'Kim Lâu Tử'; }
  else if (klRem === 8) { isKimLau = true; klType = 'Kim Lâu Súc'; }

  // 5. Hoang Ốc
  const hoangOcList: Array<'Nhất Cát' | 'Nhì Nghi' | 'Tam Địa Sát' | 'Tứ Tấn Tài' | 'Ngũ Thọ Tử' | 'Lục Hoang Ốc'> = [
    'Nhất Cát', 'Nhì Nghi', 'Tam Địa Sát', 'Tứ Tấn Tài', 'Ngũ Thọ Tử', 'Lục Hoang Ốc'
  ];
  const hoIdx = (lunarAge - 10 + 600) % 6;
  const hoPalace = hoangOcList[hoIdx];
  const isGoodHo = ['Nhất Cát', 'Nhì Nghi', 'Tứ Tấn Tài'].includes(hoPalace);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return {
    fullName,
    genderLabel,
    birthDay: input.birthDay,
    birthMonth: input.birthMonth,
    birthYear: input.birthYear,
    isLunar: !!input.isLunar,
    solarBirthDate: `${pad(solarDay)}/${pad(solarMonth)}/${solarYear}`,
    lunarBirthDate: `${pad(lunarDay)}/${pad(lunarMonth)}/${lunarYear}`,
    birthYearCanChi,
    menhNapAm,
    targetYear,
    targetYearCanChi,
    solarAge,
    lunarAge,
    cuuDieu: {
      star: starName,
      nature: starInfo.nature,
      element: starInfo.element,
      description: starInfo.description,
      poem: starInfo.poem,
      remedy: starInfo.remedy,
    },
    nienHan: {
      name: hanName,
      impact: hanInfo.impact,
      description: hanInfo.description,
    },
    tamTai: {
      isTamTai,
      yearIndex: isTamTai ? ttIdx + 1 : 0,
      description: isTamTai
        ? `Năm ${targetYear} (${targetYearCanChi}) là năm Tam Tai thứ ${ttIdx + 1} của tuổi ${birthYearCanChi}. Năm này cần cẩn trọng khởi sự việc lớn, tránh bỏ dở công việc giữa chừng.`
        : `Năm ${targetYear} (${targetYearCanChi}) không phạm hạn Tam Tai. Vận trình thuận lợi, an tâm phát triển.`,
    },
    kimLau: {
      isKimLau,
      type: klType,
      description: isKimLau
        ? `Tuổi ${lunarAge} phạm ${klType}. Không nên cưới hỏi hoặc đứng tên cất nhà trong năm nay.`
        : `Tuổi ${lunarAge} không phạm Kim Lâu. Rất tốt để kết hôn hoặc khởi công xây dựng.`,
    },
    hoangOc: {
      palace: hoPalace,
      isGood: isGoodHo,
      description: isGoodHo
        ? `Cung ${hoPalace} là cung Cát trong Hoang Ốc ("Nhất Cát an cư thông vạn sự" hoặc "Nhì Nghi nhà cửa đắc hưng vinh"). Làm nhà sinh nhiều cát khí, thịnh vượng.`
        : `Cung ${hoPalace} là cung Hung trong Hoang Ốc. Làm nhà dễ hao tài, bất hòa hoặc ốm đau; nên mượn tuổi người hợp để khởi công.`,
    },
  };
}
