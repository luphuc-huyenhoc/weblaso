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
export type { NguhanhType } from '../calendar/index';
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
  vuongSuy?: string;
  spiritAttrs?: string[];
}

export interface HexagramInfo {
  name: string;
  palace: string; // Họ Càn, Họ Khôn, ...
  palaceElement: NguhanhType;
  symbol: string;
  nature: 'Bát Thuần' | 'Du Hồn' | 'Quy Hồn' | 'Thông Thường';
  thoanCa: string;
  judgment: string;
  commentary?: {
    overview?: string;
    meaning?: string;
    thoanTu?: string;
    haoTu?: string[];
  };
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

// 8 Trigrams (Bát Quái) - Binary top to bottom (Line 3, Line 2, Line 1)
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

// 64 Hexagram Names mapped from Upper + Lower Trigrams (Binary 6-chars, top-to-bottom: Line 6 down to Line 1)
export const HEXAGRAM_NAMES: Record<
  string,
  {
    name: string;
    thoanCa: string;
    judgment: string;
    meaning?: string;
    overview?: string;
    thoanTu?: string;
    haoTu?: string[];
  }
> = {
  '111111': {
    name: 'Thuần Càn',
    thoanCa: 'KHỐN LONG ĐẮC THỦY',
    judgment: 'Nguyên Hanh Lợi Trinh. Đại cát hanh thông.',
    meaning: 'Cương kiện, phát triển cực thịnh, vững vàng tiến tới.',
  },
  '000000': {
    name: 'Thuần Khôn',
    thoanCa: 'SINH ĐẮC ĐA TÀI',
    judgment: 'Hậu đức tải vật. Nhu thuận lợi ích.',
    meaning: 'Nhu thuận, bao dung, thuận theo tự nhiên thì hanh thông.',
  },
  '010001': {
    name: 'Thủy Lôi Truân',
    thoanCa: 'KHỞI TỬ HỒI SINH',
    judgment: 'Khởi đầu nan. Kiên nhẫn tích đức.',
    meaning: 'Gian nan lúc đầu, cần kiên trì bền bỉ, tích lũy nội lực.',
  },
  '100010': {
    name: 'Sơn Thủy Mông',
    thoanCa: 'KHAI TÂM KIẾN TRÍ',
    judgment: 'Khai tâm giác ngộ. Học hỏi cầu thị.',
    meaning: 'Thời kỳ khai mở trí tuệ, cần cầu thầy học đạo, khiêm tốn học hỏi.',
  },
  '010111': {
    name: 'Thủy Thiên Nhu',
    thoanCa: 'MINH CHÂU XUẤT THỔ',
    judgment: 'Hữu phu quang hanh. Chờ thời đắc lợi.',
    meaning: 'Chờ đợi thời cơ chín muồi, tích dưỡng tinh thần, chớ nóng vội.',
  },
  '111010': {
    name: 'Thiên Thủy Tụng',
    thoanCa: 'BẬC CỔ ĐẮC ĐAO',
    judgment: 'Hữu phu trất dịch. Tránh tranh chấp kiện tụng.',
    meaning: 'Tranh chấp bất hòa, nên dĩ hòa vi quý, tránh kiện tụng tranh đoạt.',
  },
  '000010': {
    name: 'Địa Thủy Sư',
    thoanCa: 'XUẤT CỜ ĐẮC THẮNG',
    judgment: 'Trinh trượng nhân cát. Xuất quân dẹp loạn.',
    meaning: 'Huy động lực lượng, kỷ luật nghiêm minh, lãnh đạo bằng nhân nghĩa.',
  },
  '010000': {
    name: 'Thủy Địa Tỷ',
    thoanCa: 'THUYỀN ĐẮC THUẬN PHONG',
    judgment: 'Cát nguyên phệ nguyên. Hòa hợp thân thiện.',
    meaning: 'Thân thiện liên kết, tìm người đồng chí hướng, cùng nhau tương trợ.',
  },
  '110111': {
    name: 'Phong Thiên Tiểu Súc',
    thoanCa: 'MẬT VÂN BẤT VŨ',
    judgment: 'Mật vân bất vũ. Tích lũy tiềm lực.',
    meaning: 'Mây dày chưa mưa, tích lũy tài năng, việc nhỏ thành, việc lớn chưa tới.',
  },
  '111011': {
    name: 'Thiên Trạch Lý',
    thoanCa: 'PHƯỢNG HOÀNG SINH SÀO',
    judgment: 'Lý hổ vĩ bất khiết. Thận trọng từng bước.',
    meaning: 'Bước trên đuôi cọp mà không bị cắn, giữ lễ nghĩa, cẩn trọng xử thế.',
  },
  '000111': {
    name: 'Địa Thiên Thái',
    thoanCa: 'HỶ BÁO TAM NGUYÊN',
    judgment: 'Tiểu vãng đại lai. Thái bình thịnh vượng.',
    meaning: 'Âm dương giao hòa, thái bình an lạc, vận thế cực kỳ hanh thông.',
  },
  '111000': {
    name: 'Thiên Địa Bĩ',
    thoanCa: 'HỔ LẠC HÃM KHẢNG',
    judgment: 'Bĩ chi phỉ nhân. Bế tắc thoái ẩn.',
    meaning: 'Thời thế bế tắc, tiểu nhân đắc chí, quân tử nên ẩn nhẫn giữ mình.',
  },
  '111101': {
    name: 'Thiên Hỏa Đồng Nhân',
    thoanCa: 'TIÊN NHÂN CHỈ LỘ',
    judgment: 'Đồng nhân vu dã. Hòa đồng đại chúng.',
    meaning: 'Đồng tâm hiệp lực, kết giao rộng rãi, hợp tác mang lại thắng lợi.',
  },
  '101111': {
    name: 'Hỏa Thiên Đại Hữu',
    thoanCa: 'KIM NGỌC MÃN ĐƯỜNG',
    judgment: 'Nguyên hanh. Thu hoạch phong phú.',
    meaning: 'Trời sáng chiếu soi, sở hữu rộng lớn, mùa màng bội thu, đức tài trọn vẹn.',
  },
  '000100': {
    name: 'Địa Sơn Khiêm',
    thoanCa: 'THIÊN KHÔI TÙY THẾ',
    judgment: 'Hanh quân tử hữu chung. Khiêm tốn hưởng phúc.',
    meaning: 'Khiêm nhường từ tốn, núi ẩn trong đất, đức khiêm đem lại cát tường trọn vẹn.',
  },
  '001000': {
    name: 'Lôi Địa Dự',
    thoanCa: 'THANH LONG ĐẮC VỊ',
    judgment: 'Lợi kiến hầu hành sư. Vui tươi hưng khởi.',
    meaning: 'Vui vẻ hân hoan, sấm động đất trời thức tỉnh, chuẩn bị hành động lớn.',
  },
  '011001': {
    name: 'Trạch Lôi Tùy',
    thoanCa: 'TÙY THỜI ĐẮC LỢI',
    judgment: 'Nguyên hanh lợi trinh. Tùy thời ứng biến.',
    meaning: 'Thuận theo thời thế, tùy cảnh thích ứng, lòng người quy phục.',
  },
  '100110': {
    name: 'Sơn Phong Cổ',
    thoanCa: 'CHỈNH ĐỐN CẢI TÂN',
    judgment: 'Nguyên hanh lợi thiệp đại xuyên. Chỉnh đốn tu sửa.',
    meaning: 'Trùng tu cải biến, khắc phục tàn dư cũ, canh tân đem lại sức sống mới.',
  },
  '000011': {
    name: 'Địa Trạch Lâm',
    thoanCa: 'PHÁT ĐẠT TRÌNH TƯỜNG',
    judgment: 'Nguyên hanh lợi trinh. Đến thời phát triển.',
    meaning: 'Tiến tới lớn mạnh, bao dung dân chúng, mùa xuân sinh trưởng.',
  },
  '110000': {
    name: 'Phong Địa Quán',
    thoanCa: 'QUAN SÁT TƯỜNG MINH',
    judgment: 'Quán quán nhi bất tiến. Quan sát soi xét.',
    meaning: 'Chiêm ngưỡng soi xét, tĩnh tâm nhìn nhận thời cuộc, làm gương cho người.',
  },
  '101001': {
    name: 'Hỏa Lôi Phệ Hạp',
    thoanCa: 'TRỪ BỎ CHƯỚNG NGHỊCH',
    judgment: 'Hanh lợi dụng ngục. Cương quyết trừ bỏ chướng ngại.',
    meaning: 'Cắn xé chướng ngại, dùng pháp luật nghiêm minh, phân định thị phi.',
  },
  '100101': {
    name: 'Sơn Hỏa Bí',
    thoanCa: 'HỶ KHÍ AN KHANG',
    judgment: 'Hanh tiểu lợi hữu du vãng. Trang sức vẻ đẹp tế nhị.',
    meaning: 'Trang sức vẻ ngoài, văn hóa lễ tiết, cốt cách bên trong làm trọng.',
  },
  '100000': {
    name: 'Sơn Địa Bác',
    thoanCa: 'ỨNG THỰC ĐỒNG LÂM',
    judgment: 'Bất lợi hữu du vãng. Suy vi cẩn trọng.',
    meaning: 'Bào mòn sụp đổ, thời vận suy vi, cần phòng bị và giữ vững nền tảng.',
  },
  '000001': {
    name: 'Địa Lôi Phục',
    thoanCa: 'TINH HOA HỒI PHỤC',
    judgment: 'Hanh xuất nhập vô tật. Tinh hoa hồi phục.',
    meaning: 'Một dương trở lại, sinh cơ bừng dậy, thời vận hồi phục dần dần.',
  },
  '111001': {
    name: 'Thiên Lôi Vô Vọng',
    thoanCa: 'ĐỒI QUẢ ĐẮC TÀI',
    judgment: 'Nguyên hanh lợi trinh. Chân chính vô tư.',
    meaning: 'Chân thật không vọng niệm, hành sự chính đại, thuận theo thiên lý.',
  },
  '100111': {
    name: 'Sơn Thiên Đại Súc',
    thoanCa: 'TRÌNH THỜI TÍCH ĐỨC',
    judgment: 'Lợi trinh bất gia thực cát. Chứa đựng đức lớn.',
    meaning: 'Chứa đựng lớn lao, tích lũy tài đức, chuẩn bị sự nghiệp phi thường.',
  },
  '100001': {
    name: 'Sơn Lôi Di',
    thoanCa: 'QUAN DI DƯỠNG THÂN',
    judgment: 'Trinh cát quan di. Dưỡng thân tu tâm.',
    meaning: 'Nuôi dưỡng thân tâm, cẩn trọng lời nói và việc ăn uống.',
  },
  '011110': {
    name: 'Trạch Phong Đại Quá',
    thoanCa: 'NGỌC ẨN TRONG ĐÁ',
    judgment: 'Đống nạo lợi hữu du vãng. Việc lớn phi thường.',
    meaning: 'Quá mức bình thường, gánh vác việc trọng đại, cần quyết đoán quả cảm.',
  },
  '010010': {
    name: 'Thuần Khảm',
    thoanCa: 'HẢI ĐỂ LẠC CHÂU',
    judgment: 'Hữu phu duy tâm hanh. Vượt qua gian hiểm.',
    meaning: 'Nước chảy hiểm trở, lòng giữ niềm tin, vượt qua sóng gió thử thách.',
  },
  '101101': {
    name: 'Thuần Ly',
    thoanCa: 'DẠ THỰC MINH CHÂU',
    judgment: 'Lợi trinh hanh súc tẫn ngưu cát. Sáng suốt văn minh.',
    meaning: 'Lửa sáng văn minh, bám vào chính đạo, tỏa sáng trí tuệ.',
  },
  '011100': {
    name: 'Trạch Sơn Hàm',
    thoanCa: 'CẢM ỨNG GIAO HÒA',
    judgment: 'Hanh lợi trinh thủ nữ cát. Cảm ứng tự nhiên.',
    meaning: 'Cảm ứng tâm linh, nam nữ giao hòa, lòng chân thành tạo nên gắn kết.',
  },
  '001110': {
    name: 'Lôi Phong Hằng',
    thoanCa: 'THỦY CHUNG BỀN VỮNG',
    judgment: 'Hanh vô cửu lợi trinh. Bền vững thủy chung.',
    meaning: 'Bền vững dài lâu, giữ vững sơ tâm, kiên định trên đường dài.',
  },
  '111100': {
    name: 'Thiên Sơn Độn',
    thoanCa: 'NÙNG VÂN TẾ NHẬT',
    judgment: 'Hanh tiểu lợi trinh. Rút lui an toàn.',
    meaning: 'Thoái lui giữ mình, thời cơ bất lợi thì tạm lui để bảo toàn thực lực.',
  },
  '001111': {
    name: 'Lôi Thiên Đại Tráng',
    thoanCa: 'CƯƠNG CƯỜNG CHÁNH ĐẠI',
    judgment: 'Lợi trinh cương tráng cát. Tráng thịnh giữ lễ.',
    meaning: 'Lớn mạnh khí thế, không cậy sức làm càn, giữ đúng khuôn phép lễ nghĩa.',
  },
  '101000': {
    name: 'Hỏa Địa Tấn',
    thoanCa: 'QUAN MINH THĂNG TIẾN',
    judgment: 'Khang hầu dụng tích mã. Tiến bộ rực rỡ.',
    meaning: 'Mặt trời lên cao, thăng tiến rực rỡ, được cấp trên tín nhiệm trọng dụng.',
  },
  '000101': {
    name: 'Địa Hỏa Minh Di',
    thoanCa: 'THỦ PHẬN AN THÂN',
    judgment: 'Lợi gian trinh. Ánh sáng bị che giấu.',
    meaning: 'Ánh sáng vào trong đất, gặp thời gian nan nên giấu tài, nhẫn nại qua ngày.',
  },
  '110101': {
    name: 'Phong Hỏa Gia Nhân',
    thoanCa: 'GIA ĐẠO TỀ CHỈNH',
    judgment: 'Lợi nữ trinh. Tề gia êm ấm.',
    meaning: 'Gia đạo hòa thuận, đạo lý tề gia, trong ngoài phân minh trật tự.',
  },
  '101011': {
    name: 'Hỏa Trạch Khuê',
    thoanCa: 'ĐỒNG DỊ TƯƠNG TẦM',
    judgment: 'Tiểu sự cát. Bất đồng tìm điểm chung.',
    meaning: 'Chống đối trái ngược, tìm điểm tương đồng giữa dị biệt, việc nhỏ thành.',
  },
  '010100': {
    name: 'Thủy Sơn Kiển',
    thoanCa: 'VƯỢT KHÓ TIẾN LÊN',
    judgment: 'Lợi tây nam bất lợi đông bắc. Gian nan dừng lại.',
    meaning: 'Gian khó cản trở, thấy hiểm biết dừng, quay về tu dưỡng bản thân.',
  },
  '001010': {
    name: 'Lôi Thủy Giải',
    thoanCa: 'GIẢI TỎA NGUY NAN',
    judgment: 'Lợi tây nam vô sở vãng. Giải tỏa âu lo.',
    meaning: 'Mưa tan sấm dứt, giải tỏa nguy nan, tha thứ lỗi lầm, phục hồi yên ổn.',
  },
  '100011': {
    name: 'Sơn Trạch Tổn',
    thoanCa: 'TỔN KỶ LỢI NHÂN',
    judgment: 'Hữu phu nguyên cát vô cửu. Bớt điều hại tăng điều lợi.',
    meaning: 'Bớt mình giúp người, hi sinh lợi nhỏ vì nghiệp lớn, chân thành đắc cát.',
  },
  '110001': {
    name: 'Phong Lôi Ích',
    thoanCa: 'LỢI ÍCH HƯNG THỊNH',
    judgment: 'Lợi hữu du vãng lợi thiệp đại xuyên. Tăng thêm ích lợi.',
    meaning: 'Tăng ích giúp dân, thấy thiện thì theo, thấy lỗi thì sửa, vận thế đang lên.',
  },
  '011111': {
    name: 'Trạch Thiên Quải',
    thoanCa: 'QUYẾT ĐOÁN MINH BẠCH',
    judgment: 'Dương quyết âm. Quyết đoán dứt khoát.',
    meaning: 'Dứt khoát trừ gian, công khai minh bạch, chớ dùng bạo lực mà dùng đức.',
  },
  '111110': {
    name: 'Thiên Phong Cấu',
    thoanCa: 'KỲ NGỘ TƯƠNG PHÙNG',
    judgment: 'Nữ tráng vật dụng thủ nữ. Gặp gỡ bất ngờ.',
    meaning: 'Gặp gỡ tình cờ, âm bắt đầu sinh, đề phòng cám dỗ và ảnh hưởng tiêu cực.',
  },
  '011000': {
    name: 'Trạch Địa Tụy',
    thoanCa: 'QUẦN LONG TỤ HỘI',
    judgment: 'Hanh vương giả hữu miếu. Tụ hội sum vầy.',
    meaning: 'Tụ họp đông đảo, đồng tâm hướng về điều thiện, gắn kết cộng đồng.',
  },
  '000110': {
    name: 'Địa Phong Thăng',
    thoanCa: 'BƯỚC BƯỚC THĂNG CAO',
    judgment: 'Nguyên hanh dụng kiến đại nhân. Thăng tiến vững chắc.',
    meaning: 'Cây mọc từ đất, từng bước vươn lên, tìm đến bậc hiền đức giúp đỡ.',
  },
  '011010': {
    name: 'Trạch Thủy Khốn',
    thoanCa: 'KIÊN TÂM BẤT DIỆT',
    judgment: 'Hanh trinh đại nhân cát. Khốn cùng kiên trì.',
    meaning: 'Đầm cạn kiệt nước, gặp cảnh bế tắc, giữ vững khí tiết người quân tử.',
  },
  '010110': {
    name: 'Thủy Phong Tỉnh',
    thoanCa: 'VÔ TẬN SINH PHÁT',
    judgment: 'Cải ấp bất cải tỉnh. Nuôi dưỡng không cạn.',
    meaning: 'Giếng nước trong lành, nguồn sống vô tận, dưỡng đức không bao giờ vơi.',
  },
  '011101': {
    name: 'Trạch Hỏa Cách',
    thoanCa: 'ĐỔI MỚI TOÀN TÂM',
    judgment: 'Tị nhật nãi phu nguyên hanh. Canh tân đổi mới.',
    meaning: 'Đổi mới cách mạng, bỏ cái cũ theo cái mới, đúng thời hợp lòng người.',
  },
  '101110': {
    name: 'Hỏa Phong Đỉnh',
    thoanCa: 'ĐỈNH LỰC THÀNH CÔNG',
    judgment: 'Nguyên cát hanh. Luyện rèn thành tựu.',
    meaning: 'Đúc vạc lập nghiệp, luyện rèn nhân tài, ổn định cơ nghiệp vững bền.',
  },
  '001001': {
    name: 'Thuần Chấn',
    thoanCa: 'KHỞI ĐỘNG KINH THIÊN',
    judgment: 'Hanh chấn lai hách hách. Động chuyển thức tỉnh.',
    meaning: 'Sấm vang chấn động, làm người thức tỉnh, kinh sợ rồi trở nên thận trọng.',
  },
  '100100': {
    name: 'Thuần Cấn',
    thoanCa: 'AN ĐỊNH TĨNH LẶNG',
    judgment: 'Cấn kỳ bối bất hoạch kỳ thân. An định tĩnh lặng.',
    meaning: 'Núi đứng sừng sững, biết dừng đúng lúc, tâm an định không dao động.',
  },
  '110100': {
    name: 'Phong Sơn Tiệm',
    thoanCa: 'TUẤN MÃ XUẤT LUNG',
    judgment: 'Nữ quy cát lợi trinh. Tiến bước từ từ.',
    meaning: 'Tiến dã. Tuần tự. Từ từ, thong thả đến, bò tới, chậm chạp. Phúc lộc đồng lâm chi tượng: phúc lộc cùng đến.',
    overview: 'Quẻ Phong Sơn Tiệm, đồ hình ::|:|| còn gọi là quẻ Tiệm (漸 jian4), là quẻ thứ 53 trong Kinh Dịch. Nội quái là ☶ (::| 艮 gen4) Cấn hay Núi (山). Ngoại quái là ☴ (:|| 巽 xun4) Tốn hay Gió (風).',
    thoanTu: '漸: 女歸, 吉, 利貞.\nTiệm: Nữ quy, cát, lợi trinh.\nDịch: tiến dần dần; Như con gái về nhà chồng, tốt; giữ vững đạo chính thì lợi.',
    haoTu: [
      'Hào 1: Sơ lục: Hồng tiệm vu can, tiểu nhân ngôn, vô cửu. Tiến đến bờ nước, giữ mình khỏi thị phi.',
      'Hào 2: Lục nhị: Hồng tiệm vu bàn, ẩm thực khản khản, cát. Tiến lên tảng đá, ăn uống thảnh thơi, tốt.',
      'Hào 3: Cửu tam: Hồng tiệm vu lục, phu chinh bất phục, phụ dựng bất dục, hung. Tiến lên đồng bằng, cẩn trọng nghịch cảnh.',
      'Hào 4: Lục tứ: Hồng tiệm vu mộc, hoặc đắc kỳ liộc, vô cửu. Tiến lên cành cây, tìm được chỗ nương tựa vững vàng.',
      'Hào 5: Cửu ngũ: Hồng tiệm vu lăng, phụ tam tuế bất dựng, chung mạc chi thắng, cát. Tiến lên gò cao, kiên trì ắt thành tựu.',
      'Hào 6: Thượng cửu: Hồng tiệm vu quy, kỳ vũ khả dụng vi nghi, cát. Tiến lên mây cao, để lại đức sáng cho đời.',
    ],
  },
  '001011': {
    name: 'Lôi Trạch Quy Muội',
    thoanCa: 'THẬN TRỌNG TỰ CƠ',
    judgment: 'Chinh hung vô du lợi. Cẩn thận nhân duyên.',
    meaning: 'Gả em gái, hành sự thiếu chính đáng, chớ làm ẩu kẻo mang họa.',
  },
  '001101': {
    name: 'Lôi Hỏa Phong',
    thoanCa: 'CỰC THỊNH QUANG MINH',
    judgment: 'Hanh vương giả trí chi. Đỉnh cao thịnh đạt.',
    meaning: 'Thịnh đại dồi dào, giữa trưa mặt trời chói lọi, biết giữ gìn lúc tàn.',
  },
  '101100': {
    name: 'Hỏa Sơn Lữ',
    thoanCa: 'LỮ KHÁCH THA HƯƠNG',
    judgment: 'Tiểu hanh lữ trinh cát. Khách lữ tha phương.',
    meaning: 'Lữ khách xa quê, cẩn trọng giữ mình, nhu thuận thích nghi với nơi đất khách.',
  },
  '110110': {
    name: 'Thuần Tốn',
    thoanCa: 'DIỆU HÓA NHU THUẬN',
    judgment: 'Tiểu hanh lợi hữu du vãng. Thấu triệt nhu thuận.',
    meaning: 'Gió thổi vô hình, thuận nhập lòng người, khiêm tốn thấm sâu bền bỉ.',
  },
  '011011': {
    name: 'Thuần Đoài',
    thoanCa: 'HÒA DUYỆT TƯƠNG HOÀN',
    judgment: 'Hanh lợi trinh. Vui vẻ hòa ái.',
    meaning: 'Đầm nước mát mẻ, bạn bè đàm đạo, hòa duyệt khuyên răn lẫn nhau.',
  },
  '110010': {
    name: 'Phong Thủy Hoán',
    thoanCa: 'HÓA NGUY THÀNH AN',
    judgment: 'Hanh vương giả hữu miếu. Giải tán ứ trệ.',
    meaning: 'Gió lướt trên nước, giải tỏa bế tắc chia rẽ, cứu nguy giúp đời.',
  },
  '010011': {
    name: 'Thủy Trạch Tiết',
    thoanCa: 'TIẾT ĐỘ VỪA VẶN',
    judgment: 'Hanh khổ tiết bất khả trinh. Tiết chế chừng mực.',
    meaning: 'Tiết chế chừng mực, đầm giữ nước ngọt, điều hòa không thái quá.',
  },
  '110011': {
    name: 'Phong Trạch Trung Phu',
    thoanCa: 'ĐOAN TÍN THÀNH THẬT',
    judgment: 'Hanh lợi thiệp đại xuyên. Đoan tín cảm động lòng người.',
    meaning: 'Lòng thành tín sâu sắc, cảm động muôn loài, tin cậy cùng nhau vượt khó.',
  },
  '001100': {
    name: 'Lôi Sơn Tiểu Quá',
    thoanCa: 'HÀNH SỰ CẨN MẬT',
    judgment: 'Hanh lợi trinh khả tiểu sự. Vừa phải cẩn trọng.',
    meaning: 'Vượt qua một chút, việc nhỏ nên làm, việc lớn chưa nên, khiêm tốn hạ mình.',
  },
  '010101': {
    name: 'Thủy Hỏa Ký Tế',
    thoanCa: 'VIỆC ĐÃ CHU TOÀN',
    judgment: 'Hanh tiểu lợi trinh. Việc đã chu toàn.',
    meaning: 'Việc đã xong xuôi, âm dương đắc vị, giữ gìn thành quả đề phòng suy vi.',
  },
  '101010': {
    name: 'Hỏa Thủy Vị Tế',
    thoanCa: 'CỐ GẮNG BẤT KHẢ',
    judgment: 'Hanh tiểu hồ ngật tế. Chưa xong tiếp tục.',
    meaning: 'Chưa xong việc, lửa trên nước dưới, tiếp tục nỗ lực tiến bước không ngừng.',
  },
};

// Canonical 8 Palaces & derivation of 64 hexagrams (Kinh Phòng Bát Cung)
const PALACE_DEFS: Array<{ name: string; elem: NguhanhType; tri: [number, number, number] }> = [
  { name: 'Càn', elem: 'Kim', tri: [1, 1, 1] },
  { name: 'Khảm', elem: 'Thủy', tri: [0, 1, 0] },
  { name: 'Cấn', elem: 'Thổ', tri: [0, 0, 1] },
  { name: 'Chấn', elem: 'Mộc', tri: [1, 0, 0] },
  { name: 'Tốn', elem: 'Mộc', tri: [0, 1, 1] },
  { name: 'Ly', elem: 'Hỏa', tri: [1, 0, 1] },
  { name: 'Khôn', elem: 'Thổ', tri: [0, 0, 0] },
  { name: 'Đoài', elem: 'Kim', tri: [1, 1, 0] },
];

export interface PalaceHexMeta {
  palace: string;
  palaceElement: NguhanhType;
  theIdx: number; // 0..5 (0 = Hào 1, 5 = Hào 6)
  ungIdx: number; // 0..5
  nature: 'Bát Thuần' | 'Du Hồn' | 'Quy Hồn' | 'Thông Thường';
}

export const HEXAGRAM_PALACE_MAP: Record<string, PalaceHexMeta> = (() => {
  const map: Record<string, PalaceHexMeta> = {};
  for (const p of PALACE_DEFS) {
    let cur = [...p.tri, ...p.tri];
    const steps: Array<{ lines: number[]; the: number; ung: number; nature: PalaceHexMeta['nature'] }> = [];

    // 0: Bát Thuần
    steps.push({ lines: [...cur], the: 5, ung: 2, nature: 'Bát Thuần' });
    // 1: Nhất Thế (flip line 0)
    cur[0] = 1 - cur[0];
    steps.push({ lines: [...cur], the: 0, ung: 3, nature: 'Thông Thường' });
    // 2: Nhị Thế (flip line 1)
    cur[1] = 1 - cur[1];
    steps.push({ lines: [...cur], the: 1, ung: 4, nature: 'Thông Thường' });
    // 3: Tam Thế (flip line 2)
    cur[2] = 1 - cur[2];
    steps.push({ lines: [...cur], the: 2, ung: 5, nature: 'Thông Thường' });
    // 4: Tứ Thế (flip line 3)
    cur[3] = 1 - cur[3];
    steps.push({ lines: [...cur], the: 3, ung: 0, nature: 'Thông Thường' });
    // 5: Ngũ Thế (flip line 4)
    cur[4] = 1 - cur[4];
    steps.push({ lines: [...cur], the: 4, ung: 1, nature: 'Thông Thường' });
    // 6: Du Hồn (flip line 3)
    cur[3] = 1 - cur[3];
    steps.push({ lines: [...cur], the: 3, ung: 0, nature: 'Du Hồn' });
    // 7: Quy Hồn (lower returns to original tri)
    cur[0] = p.tri[0];
    cur[1] = p.tri[1];
    cur[2] = p.tri[2];
    steps.push({ lines: [...cur], the: 2, ung: 5, nature: 'Quy Hồn' });

    for (const s of steps) {
      const upperBin = '' + s.lines[5] + s.lines[4] + s.lines[3];
      const lowerBin = '' + s.lines[2] + s.lines[1] + s.lines[0];
      map[upperBin + lowerBin] = {
        palace: p.name,
        palaceElement: p.elem,
        theIdx: s.the,
        ungIdx: s.ung,
        nature: s.nature,
      };
    }
  }
  return map;
})();

// Nạp Giáp Can Chi for 8 Trigrams (standard King Wen / Dã Hạc)
export const NAP_GIAP: Record<string, Array<{ stem: string; branch: DiaChi }>> = {
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

export const BRANCH_ELEMENTS: Record<DiaChi, NguhanhType> = {
  Tý: 'Thủy', Sửu: 'Thổ', Dần: 'Mộc', Mão: 'Mộc',
  Thìn: 'Thổ', Tỵ: 'Hỏa', Ngọ: 'Hỏa', Mùi: 'Thổ',
  Thân: 'Kim', Dậu: 'Kim', Tuất: 'Thổ', Hợi: 'Thủy',
};

/** Get Lục Thân between Palace Element and Line Branch Element */
export function getLucThan(palaceElem: NguhanhType, lineElem: NguhanhType): LucThanType {
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
export function getLucThu(dayStem: string): LucThuType[] {
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

/** Tuần Không lookup from Day JDN */
export function getTuanKhong(dayJdn: number): string[] {
  const canIdx = (dayJdn + 9) % 10;
  const chiIdx = (dayJdn + 1) % 12;
  const diff = (chiIdx - canIdx + 12) % 12;
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

/** Compute Vượng Suy based on Line Element vs Month Branch Element */
export function computeVuongSuy(lineElem: NguhanhType, monthElem: NguhanhType): string {
  if (lineElem === monthElem) return 'Vượng';

  const generates: Record<NguhanhType, NguhanhType> = {
    Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc'
  };
  const overcomes: Record<NguhanhType, NguhanhType> = {
    Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc'
  };

  // Sinh xuất (line sinh month): Hưu
  if (generates[lineElem] === monthElem) return 'Hưu';
  // Sinh nhập (month sinh line): Tướng
  if (generates[monthElem] === lineElem) return 'Tướng';
  // Khắc xuất (line khắc month): Tù
  if (overcomes[lineElem] === monthElem) return 'Tù';
  // Khắc nhập (month khắc line): Tử
  if (overcomes[monthElem] === lineElem) return 'Tử';

  return 'Vượng';
}

/** Build Hexagram Object from 6 lines */
export function assembleHexagram(
  lines: IchingLineInput[],
  dayStem: string,
  monthBranch: string
): HexagramInfo {
  // Lines 0..5: 0=Hào sơ, 1=Hào nhị, 2=Hào tam, 3=Hào tứ, 4=Hào ngũ, 5=Hào thượng
  // Lower Trigram: Line 2 (top), Line 1 (mid), Line 0 (bot)
  const lowerBin =
    '' +
    (lines[2].polarity === 'Dương' ? '1' : '0') +
    (lines[1].polarity === 'Dương' ? '1' : '0') +
    (lines[0].polarity === 'Dương' ? '1' : '0');

  // Upper Trigram: Line 5 (top), Line 4 (mid), Line 3 (bot)
  const upperBin =
    '' +
    (lines[5].polarity === 'Dương' ? '1' : '0') +
    (lines[4].polarity === 'Dương' ? '1' : '0') +
    (lines[3].polarity === 'Dương' ? '1' : '0');

  const fullBin = upperBin + lowerBin;

  const upperTri = TRIGRAMS[upperBin] ?? TRIGRAMS['111'];
  const lowerTri = TRIGRAMS[lowerBin] ?? TRIGRAMS['111'];

  const hexMeta = HEXAGRAM_NAMES[fullBin] ?? {
    name: `${upperTri.name} ${lowerTri.name}`,
    thoanCa: 'VẠN SỰ HANH THÔNG',
    judgment: 'Nguyên hanh lợi trinh. Cẩn trọng hành sự.',
  };

  const palaceMeta = HEXAGRAM_PALACE_MAP[fullBin] ?? {
    palace: upperTri.palace,
    palaceElement: upperTri.element,
    theIdx: 5,
    ungIdx: 2,
    nature: 'Thông Thường' as const,
  };

  const palace = palaceMeta.palace;
  const palaceElem = palaceMeta.palaceElement;
  const theIdx = palaceMeta.theIdx;
  const ungIdx = palaceMeta.ungIdx;
  const nature = palaceMeta.nature;

  // Nạp Giáp: Lower trigram lines 0..2 from lowerTri, Upper trigram lines 3..5 from upperTri
  const lowerNap = NAP_GIAP[lowerTri.name]?.slice(0, 3) ?? [];
  const upperNap = NAP_GIAP[upperTri.name]?.slice(3, 6) ?? [];
  const fullNap = [...lowerNap, ...upperNap];

  const lucThuList = getLucThu(dayStem);
  const lineNames = ['Hào sơ', 'Hào nhị', 'Hào tam', 'Hào tứ', 'Hào ngũ', 'Hào thượng'];

  // Identify Lục Thân for each line
  const assignedLucThan: LucThanType[] = [];
  for (let i = 0; i < 6; i++) {
    const bElem = BRANCH_ELEMENTS[fullNap[i]?.branch ?? 'Tý'];
    assignedLucThan.push(getLucThan(palaceElem, bElem));
  }

  // Phục Thần computation: Check missing Lục Thân
  const ALL_LUC_THAN: LucThanType[] = ['Phụ Mẫu', 'Huynh Đệ', 'Tử Tôn', 'Thê Tài', 'Quan Quỷ'];
  const missingLucThan = ALL_LUC_THAN.filter((lt) => !assignedLucThan.includes(lt));

  // Palace Bát Thuần lines for Phục Thần
  const pureNap = NAP_GIAP[palace];
  const phucThanMap: Record<number, string> = {};

  if (missingLucThan.length > 0 && pureNap) {
    const shortMap: Record<LucThanType, string> = {
      'Phụ Mẫu': 'Phụ',
      'Huynh Đệ': 'Huynh',
      'Tử Tôn': 'Tử',
      'Thê Tài': 'Tài',
      'Quan Quỷ': 'Quan',
    };
    for (let k = 0; k < 6; k++) {
      const pureElem = BRANCH_ELEMENTS[pureNap[k].branch];
      const pureLt = getLucThan(palaceElem, pureElem);
      if (missingLucThan.includes(pureLt) && !phucThanMap[k]) {
        phucThanMap[k] = `${shortMap[pureLt]}-${pureNap[k].branch}`;
      }
    }
  }

  const monthBranchElem = BRANCH_ELEMENTS[monthBranch as DiaChi] || 'Kim';

  const lineDetails: HexagramLineDetail[] = lines.map((l, i) => {
    const nap = fullNap[i] ?? { stem: 'Giáp', branch: 'Tý' as DiaChi };
    const bElem = BRANCH_ELEMENTS[nap.branch];
    const lucThan = assignedLucThan[i];
    const vs = computeVuongSuy(bElem, monthBranchElem);

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
      phucThan: phucThanMap[i],
      lucThu: lucThuList[i],
      vuongSuy: vs,
    };
  });

  return {
    name: hexMeta.name,
    palace: `Họ ${palace}`,
    palaceElement: palaceElem,
    symbol: fullBin,
    nature,
    thoanCa: hexMeta.thoanCa,
    judgment: hexMeta.judgment,
    commentary: {
      overview: hexMeta.overview,
      meaning: hexMeta.meaning,
      thoanTu: hexMeta.thoanTu,
      haoTu: hexMeta.haoTu,
    },
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

  // Map upperBin and lowerBin into 6 lines:
  // Lower trigram: lines 2, 1, 0
  // Upper trigram: lines 5, 4, 3
  const lines: IchingLineInput[] = [
    { lineIndex: 0, polarity: lowerBin[2] === '1' ? 'Dương' : 'Âm', movement: movingLine === 1 ? 'Động' : 'Tĩnh' },
    { lineIndex: 1, polarity: lowerBin[1] === '1' ? 'Dương' : 'Âm', movement: movingLine === 2 ? 'Động' : 'Tĩnh' },
    { lineIndex: 2, polarity: lowerBin[0] === '1' ? 'Dương' : 'Âm', movement: movingLine === 3 ? 'Động' : 'Tĩnh' },
    { lineIndex: 3, polarity: upperBin[2] === '1' ? 'Dương' : 'Âm', movement: movingLine === 4 ? 'Động' : 'Tĩnh' },
    { lineIndex: 4, polarity: upperBin[1] === '1' ? 'Dương' : 'Âm', movement: movingLine === 5 ? 'Động' : 'Tĩnh' },
    { lineIndex: 5, polarity: upperBin[0] === '1' ? 'Dương' : 'Âm', movement: movingLine === 6 ? 'Động' : 'Tĩnh' },
  ];

  return lines;
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
  const hasMoving = activeLines.some((l) => l.movement === 'Động');
  if (hasMoving) {
    const transformedLines: IchingLineInput[] = activeLines.map((l) => ({
      lineIndex: l.lineIndex,
      polarity: l.movement === 'Động' ? (l.polarity === 'Dương' ? 'Âm' : 'Dương') : l.polarity,
      movement: 'Tĩnh',
    }));
    changedHex = assembleHexagram(transformedLines, dayStem, monthBranch);
  }

  // 5. Spirit Deities (Lộc, Mã, Quý Nhân, Đào Hoa)
  const locMap: Record<string, string> = {
    Giáp: 'Dần', Ất: 'Mão', Bính: 'Tỵ', Đinh: 'Ngọ', Mậu: 'Tỵ',
    Kỷ: 'Ngọ', Canh: 'Thân', Tân: 'Dậu', Nhâm: 'Hợi', Quý: 'Tý',
  };
  const quyMap: Record<string, string[]> = {
    Giáp: ['Sửu', 'Mùi'], Mậu: ['Sửu', 'Mùi'],
    Ất: ['Tý', 'Thân'], Kỷ: ['Tý', 'Thân'],
    Bính: ['Hợi', 'Dậu'], Đinh: ['Hợi', 'Dậu'],
    Canh: ['Dần', 'Ngọ'], Tân: ['Dần', 'Ngọ'],
    Nhâm: ['Tỵ', 'Mão'], Quý: ['Tỵ', 'Mão'],
  };

  const getDichMa = (dBr: string) => {
    if (['Thân', 'Tý', 'Thìn'].includes(dBr)) return 'Dần';
    if (['Dần', 'Ngọ', 'Tuất'].includes(dBr)) return 'Thân';
    if (['Tỵ', 'Dậu', 'Sửu'].includes(dBr)) return 'Hợi';
    return 'Tỵ';
  };

  const getDaoHoa = (dBr: string) => {
    if (['Thân', 'Tý', 'Thìn'].includes(dBr)) return 'Dậu';
    if (['Dần', 'Ngọ', 'Tuất'].includes(dBr)) return 'Mão';
    if (['Tỵ', 'Dậu', 'Sửu'].includes(dBr)) return 'Ngọ';
    return 'Tý';
  };

  const spiritDeities = {
    loc: locMap[dayStem] ?? 'Dần',
    ma: getDichMa(dayBranch),
    quyNhan: quyMap[dayStem] ?? ['Sửu', 'Mùi'],
    daoHoa: getDaoHoa(dayBranch),
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
    nhatThan: `${dayBranch}-${BRANCH_ELEMENTS[dayBranch as DiaChi]}`,
    nguyetLenh: `${monthBranch}-${BRANCH_ELEMENTS[monthBranch as DiaChi]}`,
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
