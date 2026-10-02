import { GoogleGenAI } from '@google/genai';

export interface InterpretationRequest {
  chartType: 'BAZI' | 'ZIWEI' | 'ICHING';
  data: any;
  userQuestion?: string;
}

function formatSolarDate(d: string | undefined): string {
  if (!d) return '';
  const parts = d.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return d;
}

/**
 * Build tailored prompt for Gemini AI ensuring output strictly matches
 * the official Lữ Phúc Consulting Word Dossier format.
 */
function buildAstrologicalPrompt(req: InterpretationRequest): string {
  const { chartType, data, userQuestion } = req;

  if (chartType === 'BAZI') {
    const p = data?.calculation?.personal || data?.personal || {};
    const pil = data?.calculation?.pillars || data?.pillars || {};
    const dm = data?.calculation?.dayMaster || data?.dayMaster || {};
    const interp = data?.calculation?.interpretation || data?.interpretation || {};
    const elements = interp?.elementsScore || {};

    const fullName = p.fullName || (p.gender === false || p.genderLabel?.includes('Nữ') ? 'Nữ mệnh' : 'Nam mệnh');
    const solarStr = formatSolarDate(p.solarDate || p.solarDateStr);
    const lunarStr = p.lunarDateStr || '';
    const hourBranch = pil.hour?.branch || p.hour || 'Thìn';
    const birthInfo = `${solarStr ? `${solarStr} ` : ''}(Âm lịch: ${lunarStr || 'Đầy đủ tiết khí'}) — Giờ ${hourBranch}`;
    const fourPillarsStr = `Năm ${pil.year?.stem || ''} ${pil.year?.branch || ''} — Tháng ${pil.month?.stem || ''} ${pil.month?.branch || ''} — Ngày ${pil.day?.stem || ''} ${pil.day?.branch || ''} — Giờ ${pil.hour?.stem || ''} ${pil.hour?.branch || ''}`;

    return `Bạn là Đại sư Mệnh lý Bát Tự & Tứ Trụ Cổ Truyền uyên bác thuộc học phái Lữ Phúc (tôn chỉ: "Gieo Phúc — Gặt Phước").
Hãy phân tích và viết một bản LUẬN GIẢI MỆNH LÝ & CẢI VẬN chuyên sâu, chuẩn xác, giàu tính ứng dụng cho đương số.

BẮT BUỘC TRẢ VỀ CHÍNH XÁC THEO KHUNG MẪU HỒ SƠ TƯ VẤN (CHUẨN FILE WORD LỮ PHÚC) DƯỚI ĐÂY:

# BẢN LUẬN GIẢI MỆNH LÝ & CẢI VẬN
Hệ Thống Phân Tích Mệnh Lý · Chuyên Sâu Bát Tự Lữ Phúc

| I. THÔNG TIN HỒ SƠ TƯ VẤN

| Thông tin | Chi tiết |
| :--- | :--- |
| **Họ và tên gia chủ:** | ${fullName} |
| **Ngày tháng năm sinh:** | ${birthInfo} |
| **Tứ Trụ Can Chi:** | ${fourPillarsStr} |
| **Chuyên đề tư vấn:** | Luận giải Bát Tự Lữ Phúc, Tài Lộc, Sự Nghiệp, Cung Vị Gia Đạo & Cải Vận Bổ Khuyết |
| **Đơn vị tư vấn:** | Lữ Phúc - Cải Vận Bổ Khuyết (Hotline: 037.44.36.921) |

| II. NỘI DUNG PHÂN TÍCH & ĐỊNH HƯỚNG CẢI VẬN

DỮ LIỆU BÁT TỰ BẢN MỆNH CẦN PHÂN TÍCH:
- Nhật Chủ (Nguyên Thần): Can ${dm.stem || ''} (${dm.strength || ''} - ${dm.percentage || ''}% lực bản mệnh)
- Ngũ hành lực: Kim: ${elements.Kim || 0}, Mộc: ${elements.Mộc || 0}, Thủy: ${elements.Thủy || 0}, Hỏa: ${elements.Hỏa || 0}, Thổ: ${elements.Thổ || 0}
- Thần định lượng: Dụng Thần: ${interp.dungThan || ''} | Hỷ Thần: ${interp.hyThan || ''} | Kỵ Thần: ${interp.kyThan || ''}
${userQuestion ? `- Câu hỏi nguyện vọng riêng của đương số: "${userQuestion}"` : ''}

YÊU CẦU NỘI DUNG MỤC II (Trình bày chi tiết, sâu sắc từng chương):
### 1. Tổng Quan Bản Mệnh & Cách Cục
Phân tích khí lực của Nhật Chủ tương tác với Lệnh Tháng. Cân bằng ngũ hành âm dương, cách cục nổi bật (Chính Quan, Thất Sát, Thiên Tài, v.v.). Tính cách, khí chất, ưu điểm và điểm cần tu sửa.

### 2. Định Lượng Thần Sát & Dụng Thần Điều Hỏa
Giải thích vai trò của Dụng Thần (${interp.dungThan || ''}) và Hỷ Thần trong việc cứu giải và lưu thông chân khí toàn cục 4 trụ. Tác hại của Kỵ Thần và cách phòng ngừa.

### 3. Luận Giải Cung Vị Tài Lộc & Con Đường Sự Nghiệp
Nguồn tiền (Chính Tài hay Thiên Tài), thiên hướng công việc thích hợp với ngũ hành Dụng Thần, thời vận hanh thông để đầu tư, tích lũy tài sản vững bền.

### 4. Luận Giải Cung Vị Gia Đạo, Phu Thê & Con Cái
Phân tích cung phối ngẫu tại Chi Ngày, sự hòa hợp duyên nợ, đặc điểm đối phương, bí quyết gìn giữ hạnh phúc gia đình dựa trên sự nhường nhịn và thấu hiểu.

### 5. Luận Giải Thể Trạng Sức Khỏe & Vận Hạn
Thể trạng theo ngũ hành tạng phủ thừa - thiếu. Những giai đoạn lưu niên cần cẩn trọng.

### 6. Phương Pháp Cải Vận Bổ Khuyết Ngũ Hành (Lữ Phúc Pháp)
- Màu sắc trang phục, phụ kiện tương sinh bồi trợ Dụng Thần.
- Phương vị địa lý, không gian làm việc đón sinh khí.
- Vật phẩm phong thủy tự nhiên trợ mệnh.
- Lối sống, đạo dưỡng tâm: "Tâm sinh tướng, đức sinh tài" — Tích phúc hành thiện để chuyển hóa nghịch cảnh.
${userQuestion ? `\n### 7. Giải Đáp Thắc Mắc Riêng Của Gia Chủ\nTrả lời tận tâm, rõ ràng và có căn cứ mệnh lý cho câu hỏi: "${userQuestion}"` : ''}

LỮ PHÚC TỔ ĐƯỜNG
Gieo Phúc — Gặt Phước
(Ký tên & Đóng dấu)

Phong cách hành văn: Chuẩn mực, trang trọng, trí tuệ cổ truyền, hướng thiện, không hù dọa hay mê tín dị đoan.`;
  }

  if (chartType === 'ZIWEI') {
    const p = data?.calculation?.personal || data?.personal || {};
    const palaces = data?.calculation?.palaces || data?.palaces || [];
    const menhPalace = palaces.find((x: any) => x.isMenh) || {};
    const thanPalace = palaces.find((x: any) => x.isThan) || {};

    const fullName = p.fullName || (p.genderLabel || 'Đương số');
    const solarStr = formatSolarDate(p.solarDateStr || p.solarDate);
    const lunarStr = p.lunarDateStr || '';
    const hourBranch = p.miniBazi?.hour?.chi || p.hour || '';
    const birthInfo = `${solarStr ? `${solarStr} ` : ''}(Âm lịch: ${lunarStr}) — Giờ ${hourBranch}`;
    const ziweiSummary = `Bản Mệnh: ${p.menhElement || ''} — Cục: ${p.cuc || ''} — Thân cư: ${p.thanCungName || ''} (Chủ Mệnh: ${p.menhChu || ''})`;

    return `Bạn là Chuyên gia Tử Vi Đẩu Số Toàn Thư uyên bác của học phái Lữ Phúc (tôn chỉ: "Gieo Phúc — Gặt Phước").
Hãy phân tích và viết một bản LUẬN GIẢI MỆNH LÝ & CẢI VẬN chuyên sâu cho đương số.

BẮT BUỘC TRẢ VỀ CHÍNH XÁC THEO KHUNG MẪU HỒ SƠ TƯ VẤN (CHUẨN FILE WORD LỮ PHÚC) DƯỚI ĐÂY:

# BẢN LUẬN GIẢI MỆNH LÝ & CẢI VẬN
Hệ Thống Phân Tích Mệnh Lý · Chuyên Sâu Tử Vi Đẩu Số Lữ Phúc

| I. THÔNG TIN HỒ SƠ TƯ VẤN

| Thông tin | Chi tiết |
| :--- | :--- |
| **Họ và tên gia chủ:** | ${fullName} |
| **Ngày tháng năm sinh:** | ${birthInfo} |
| **Lá số Tử Vi:** | ${ziweiSummary} |
| **Chuyên đề tư vấn:** | Luận giải Tử Vi Đẩu Số Toàn Thư, Công Danh, Tài Lộc, Cung Vị Phu Thê & Hóa Giải Vận Hạn |
| **Đơn vị tư vấn:** | Lữ Phúc - Cải Vận Bổ Khuyết (Hotline: 037.44.36.921) |

| II. NỘI DUNG PHÂN TÍCH & ĐỊNH HƯỚNG CẢI VẬN

DỮ LIỆU TỬ VI CẦN PHÂN TÍCH:
- Cung Mệnh (${menhPalace.cungName || 'Mệnh'} tại ${menhPalace.branch || ''}): Chính tinh [${(menhPalace.mainStars || []).map((s: any) => s.name).join(', ') || 'Vô chính diệu'}]
- Cung Thân (${thanPalace.cungName || 'Thân'} tại ${thanPalace.branch || ''}): Chính tinh [${(thanPalace.mainStars || []).map((s: any) => s.name).join(', ') || 'Vô chính diệu'}]
${userQuestion ? `- Câu hỏi nguyện vọng riêng của đương số: "${userQuestion}"` : ''}

YÊU CẦU NỘI DUNG MỤC II:
### 1. Tổng Quan Mệnh Thân & Cục Số
Đánh giá sự tương phối giữa Mệnh và Cục, ảnh hưởng của cung Thân khi bước vào trung niên.

### 2. Luận Giải Cung Mệnh & Tam Phương Tứ Chính
Phân tích sao thủ Mệnh, các cát tinh và sát tinh hội tụ, cách cục đặc thù.

### 3. Cung Quan Lộc (Sự Nghiệp) & Cung Tài Bạch (Tiền Tài)
Điểm tựa công danh, môi trường làm việc phát huy sở trường, khả năng giữ tiền và tích lũy.

### 4. Cung Phu Thê & Phúc Đức Gia Đạo
Duyên nợ vợ chồng, phúc ấm gia tiên và nền tảng gìn giữ hòa khí.

### 5. Chỉ Dẫn Hành Vận & Tu Dưỡng Phước Đức (Lữ Phúc Tôn Chỉ)
Hướng dẫn nạp phúc sinh tài, vượt qua thử thách của các hung tinh.
${userQuestion ? `\n### 6. Giải Đáp Thắc Mắc Riêng Của Gia Chủ\nTrả lời cụ thể cho câu hỏi: "${userQuestion}"` : ''}

LỮ PHÚC TỔ ĐƯỜNG
Gieo Phúc — Gặt Phước
(Ký tên & Đóng dấu)

Phong cách hành văn: Chuẩn mực, tôn trọng thuật số cổ truyền, mang tính xây dựng và chỉ dẫn thực tế.`;
  }

  // ICHING
  const calc = data?.calculation || data || {};
  const orig = calc.originalHexagram || {};
  const chg = calc.changedHexagram || {};

  return `Bạn là Bậc thầy Dịch học & Quẻ Dịch Lục Hào phái Lữ Phúc (tôn chỉ: "Gieo Phúc — Gặt Phước").
Hãy phân tích và viết một bản LUẬN GIẢI MỆNH LÝ & CẢI VẬN chi tiết, sâu sắc.

BẮT BUỘC TRẢ VỀ CHÍNH XÁC THEO KHUNG MẪU HỒ SƠ TƯ VẤN (CHUẨN FILE WORD LỮ PHÚC) DƯỚI ĐÂY:

# BẢN LUẬN GIẢI MỆNH LÝ & CẢI VẬN
Hệ Thống Phân Tích Mệnh Lý · Chuyên Sâu Bát Tự & Chu Dịch

| I. THÔNG TIN HỒ SƠ TƯ VẤN

| Thông tin | Chi tiết |
| :--- | :--- |
| **Họ và tên gia chủ:** | ${userQuestion ? 'Gia chủ cầu quẻ' : 'Đương số'} |
| **Ngày giờ chiêm quẻ:** | ${new Date().toLocaleDateString('vi-VN')} — Chu Dịch Chiêm Bốc |
| **Quẻ Chu Dịch:** | Quẻ Gốc: ${orig.name || ''} (Số ${orig.number || ''}) — Quẻ Biến: ${chg.name || 'Thuần quẻ'} |
| **Chuyên đề tư vấn:** | Luận giải Quẻ Dịch Chu Dịch, Thời Thế, Cơ Vận Sự Vụ & Chỉ Dẫn Hành Động |
| **Đơn vị tư vấn:** | Lữ Phúc - Cải Vận Bổ Khuyết (Hotline: 037.44.36.921) |

| II. NỘI DUNG PHÂN TÍCH & ĐỊNH HƯỚNG CẢI VẬN

DỮ LIỆU QUẺ:
- Quẻ Gốc: ${orig.name || ''} (${orig.upperTrigram || ''} trên, ${orig.lowerTrigram || ''} dưới)
- Thoán từ: "${orig.judgment || ''}"
${userQuestion ? `- Sự vụ cầu hỏi: "${userQuestion}"` : ''}

YÊU CẦU NỘI DUNG MỤC II:
### 1. Khái Quát Ý Nghĩa Tượng Quẻ & Thời Thế Hiện Tại
Phân tích bối cảnh không gian thời gian mà quẻ phản ánh.

### 2. Tương Tác Thể Dụng, Thế Ứng & Hào Động
Chủ thể sự việc đang ở thế thuận hay nghịch, tương sinh hay tương khắc.

### 3. Luận Giải Chi Tiết Về Sự Vụ Cần Xem
${userQuestion ? `Đi thẳng vào câu trả lời rõ ràng cho việc băn khoăn: "${userQuestion}"` : 'Định hướng công danh, tài chính, giao dịch, tình cảm.'}

### 4. Chỉ Dẫn Hành Động (Đạo Của Kinh Dịch)
Nên tiến hay nên thoái, nắm bắt thời cơ để đạt kết quả cát tường nhất.

LỮ PHÚC TỔ ĐƯỜNG
Gieo Phúc — Gặt Phước
(Ký tên & Đóng dấu)`;
}

/**
 * Fallback heuristic interpretation when GEMINI_API_KEY is not configured yet.
 * Strictly adheres to the official Lữ Phúc Consulting Word Dossier layout.
 */
function generateHeuristicInterpretation(req: InterpretationRequest): string {
  const { chartType, data, userQuestion } = req;

  if (chartType === 'BAZI') {
    const p = data?.calculation?.personal || data?.personal || {};
    const pil = data?.calculation?.pillars || data?.pillars || {};
    const dm = data?.calculation?.dayMaster || data?.dayMaster || {};
    const interp = data?.calculation?.interpretation || data?.interpretation || {};
    const reco = interp?.recommendations || {};

    const fullName = p.fullName || (p.gender === false || p.genderLabel?.includes('Nữ') ? 'Nữ mệnh' : 'Nam mệnh');
    const solarStr = formatSolarDate(p.solarDate || p.solarDateStr);
    const lunarStr = p.lunarDateStr || '';
    const hourBranch = pil.hour?.branch || p.hour || 'Thìn';
    const birthInfo = `${solarStr ? `${solarStr} ` : ''}(Âm lịch: ${lunarStr || 'Đầy đủ tiết khí'}) — Giờ ${hourBranch}`;
    const fourPillarsStr = `Năm ${pil.year?.stem || ''} ${pil.year?.branch || ''} — Tháng ${pil.month?.stem || ''} ${pil.month?.branch || ''} — Ngày ${pil.day?.stem || ''} ${pil.day?.branch || ''} — Giờ ${pil.hour?.stem || ''} ${pil.hour?.branch || ''}`;

    return `# BẢN LUẬN GIẢI MỆNH LÝ & CẢI VẬN
Hệ Thống Phân Tích Mệnh Lý · Chuyên Sâu Bát Tự Lữ Phúc

| I. THÔNG TIN HỒ SƠ TƯ VẤN

| Thông tin | Chi tiết |
| :--- | :--- |
| **Họ và tên gia chủ:** | ${fullName} |
| **Ngày tháng năm sinh:** | ${birthInfo} |
| **Tứ Trụ Can Chi:** | ${fourPillarsStr} |
| **Chuyên đề tư vấn:** | Luận giải Bát Tự Lữ Phúc, Tài Lộc, Sự Nghiệp, Cung Vị Gia Đạo & Cải Vận Bổ Khuyết |
| **Đơn vị tư vấn:** | Lữ Phúc - Cải Vận Bổ Khuyết (Hotline: 037.44.36.921) |

| II. NỘI DUNG PHÂN TÍCH & ĐỊNH HƯỚNG CẢI VẬN

### 1. Tổng Quan Bản Mệnh & Cách Cục
* **Đương số**: **${fullName}**
* **Nhật Chủ (Nguyên Thần)**: Thiên Can **${dm.stem || 'Bản mệnh'}** tại Trụ Ngày.
* **Thể lực Thân Mệnh**: **${dm.strength || 'Bình hòa'}** (${dm.percentage || 50}% lực bản mệnh).
* **Nhận định khí chất**: Bản mệnh hấp thu chân khí của Can **${dm.stem || ''}**. ${
      dm.strength?.includes('Vượng')
        ? 'Nội lực dồi dào, tính tình kiên nghị, quyết đoán, có chí tiến thủ mạnh mẽ. Tuy nhiên cần lưu ý tiết chế bớt sự cứng nhắc trong các mối quan hệ xã hội.'
        : 'Tính cách mềm mỏng, chu đáo, tinh tế, giỏi thích nghi với hoàn cảnh. Tuy nhiên cần rèn luyện thêm sự quyết đoán trước những bước ngoặt quan trọng.'
    }

### 2. Định Lượng Thần Sát & Dụng Thần Điều Hỏa
* **Dụng Thần cứu mệnh**: **${interp.dungThan || 'Bổ khuyết ngũ hành'}**. Đây là ngũ hành then chốt giúp khai thông bế tắc và lưu chuyển dòng chảy năng lượng trong Tứ Trụ.
* **Hỷ Thần trợ lực**: **${interp.hyThan || 'Hòa hợp'}**. Đóng vai trò nâng đỡ, tiếp thêm sinh khí cho Dụng Thần.
* **Kỵ Thần cần tránh**: **${interp.kyThan || 'Khắc chế'}**. Cần chủ động tiết chế năng lượng của hành này để phòng ngừa hao tổn.

### 3. Luận Giải Cung Vị Tài Lộc & Con Đường Sự Nghiệp
* **Định hướng sự nghiệp**: Cấu trúc Tứ Trụ cho thấy đương số rất thích hợp phát triển trong các lĩnh vực tương sinh với Dụng Thần **${interp.dungThan || 'Mộc/Hỏa'}**, đòi hỏi sự chuyên tâm sâu và tư duy chiến lược dài hạn.
* **Tài vận & Tích lũy**: Dòng tiền hanh thông theo từng chu kỳ vận hạn. Đương số nên ưu tiên tích lũy tài sản vững bền, tránh đầu tư rủi ro vào các năm lưu niên gặp Kỵ Thần xung phá.

### 4. Luận Giải Cung Vị Gia Đạo, Phu Thê & Con Cái
* Cung Phu/Thê tại Địa Chi Trụ Ngày phản ánh bạn đời là người có trách nhiệm, đảm đang và hết lòng vì tổ ấm.
* Để gia đạo bền vững trường tồn, hai bên cần lấy chữ "Nhẫn" làm gốc, đồng lòng sẻ chia và tôn trọng quan điểm riêng của nhau.

### 5. Luận Giải Sức Khỏe & Vận Hạn Lưu Niên
* Chú ý chăm sóc ngũ hành tạng phủ tương ứng với hành yếu trong lá số. Thường xuyên rèn luyện thể dục dưỡng sinh, giữ tâm thế an nhiên.

### 6. Phương Pháp Cải Vận Bổ Khuyết Ngũ Hành (Lữ Phúc Pháp)
* **Màu sắc trang phục & phụ kiện cát tường**: ${reco.favorableColors?.join(', ') || 'Màu sắc tương sinh theo Dụng Thần'}.
* **Phương hướng vượng khí kích hoạt tài vận**: ${reco.favorableDirections?.join(', ') || 'Hướng đón sinh khí'}.
* **Vật phẩm phong thủy trợ mệnh**: ${reco.favorableGemstones?.join(', ') || 'Đá phong thủy tự nhiên bổ khuyết'}.
* **Khẩu quyết dưỡng mệnh Lữ Phúc**: *"Tâm sinh tướng, đức sinh tài"*. Tích lũy phước thiện, hiếu kính cha mẹ và giữ tâm ngay thẳng chính là cội nguồn của mọi cát lành.
${userQuestion ? `\n### 7. Giải Đáp Thắc Mắc Riêng Của Gia Chủ\nVề việc *" ${userQuestion} "*: Xét theo năng lượng Bát Tự và chu kỳ vận hạn hiện thời, thời cơ đang ở giai đoạn tích lũy lực lượng. Hãy giữ vững sự chuẩn bị chu đáo, lắng nghe trực giác và hành xử thận trọng để đạt kết quả viên mãn.` : ''}

LỮ PHÚC TỔ ĐƯỜNG
Gieo Phúc — Gặt Phước
(Ký tên & Đóng dấu)`;
  }

  if (chartType === 'ZIWEI') {
    const p = data?.calculation?.personal || data?.personal || {};
    const fullName = p.fullName || (p.genderLabel || 'Đương số');
    const solarStr = formatSolarDate(p.solarDateStr || p.solarDate);
    const lunarStr = p.lunarDateStr || '';
    const hourBranch = p.miniBazi?.hour?.chi || p.hour || '';
    const birthInfo = `${solarStr ? `${solarStr} ` : ''}(Âm lịch: ${lunarStr}) — Giờ ${hourBranch}`;
    const ziweiSummary = `Bản Mệnh: ${p.menhElement || ''} — Cục: ${p.cuc || ''} — Thân cư: ${p.thanCungName || ''}`;

    return `# BẢN LUẬN GIẢI MỆNH LÝ & CẢI VẬN
Hệ Thống Phân Tích Mệnh Lý · Chuyên Sâu Tử Vi Đẩu Số Lữ Phúc

| I. THÔNG TIN HỒ SƠ TƯ VẤN

| Thông tin | Chi tiết |
| :--- | :--- |
| **Họ và tên gia chủ:** | ${fullName} |
| **Ngày tháng năm sinh:** | ${birthInfo} |
| **Lá số Tử Vi:** | ${ziweiSummary} |
| **Chuyên đề tư vấn:** | Luận giải Tử Vi Đẩu Số Toàn Thư, Công Danh, Tài Lộc, Cung Vị Phu Thê & Hóa Giải Vận Hạn |
| **Đơn vị tư vấn:** | Lữ Phúc - Cải Vận Bổ Khuyết (Hotline: 037.44.36.921) |

| II. NỘI DUNG PHÂN TÍCH & ĐỊNH HƯỚNG CẢI VẬN

### 1. Tổng Quan Mệnh Thân & Cục Số
* **Họ tên đương số**: **${fullName}**
* **Tương tác Mệnh - Cục**: Bản mệnh **${p.menhElement || ''}** phối hợp cùng **${p.cuc || ''}** tạo nên thế đứng vững chắc trong cuộc đời.
* **Thân cư**: **${p.thanCungName || 'Mệnh'}** — Cho thấy hậu vận phản ánh rõ nét thành quả từ sự nỗ lực kiên trì và đạo đức hành xử của đương số.

### 2. Luận Giải Cung Mệnh & Tam Phương Tứ Chính
* Cung Mệnh tọa thủ các tinh đẩu định hình nhân cách và tư chất thiên bẩm. Đương số là người trọng chữ tín, có lòng tự trọng cao và luôn ấp ủ hoài bão lớn.
* Tam phương tứ chính có cát tinh nâng đỡ, giúp vượt qua nhiều khúc quanh hiểm trở trong đời.

### 3. Cung Quan Lộc (Sự Nghiệp) & Cung Tài Bạch (Tiền Tài)
* Sự nghiệp có quý nhân tương trợ, nên tập trung vào chuyên môn sâu để xác lập vị thế bền vững.
* Nguồn tài lộc tích lũy đều đặn, càng về hậu vận càng sung túc nếu biết quản lý chặt chẽ.

### 4. Cung Phu Thê & Phúc Đức Gia Đạo
* Duyên phận lứa đôi cần sự tôn trọng và nhường nhịn để hòa hợp dài lâu.
* Phúc ấm gia tiên là bệ đỡ vững chắc, cần gìn giữ và vun đắp thêm công đức cho thế hệ mai sau.

### 5. Chỉ Dẫn Hành Vận & Tu Dưỡng Phước Đức (Lữ Phúc Tôn Chỉ)
* Đạo lý cải mệnh cốt ở tu thân. Hành thiện tích đức, sống chân thành và giữ tâm trong sáng chính là phương thức hóa giải hung sát hiệu quả nhất.
${userQuestion ? `\n### 6. Giải Đáp Thắc Mắc Riêng Của Gia Chủ\nVề vấn đề: "${userQuestion}": Tử vi chỉ rõ thời vận luôn tuần hoàn. Hãy thuận theo thiên thời, chuẩn bị nội lực vững vàng để đón nhận thắng lợi.` : ''}

LỮ PHÚC TỔ ĐƯỜNG
Gieo Phúc — Gặt Phước
(Ký tên & Đóng dấu)`;
  }

  // ICHING
  const calc = data?.calculation || data || {};
  const orig = calc.originalHexagram || {};
  const chg = calc.changedHexagram || {};

  return `# BẢN LUẬN GIẢI MỆNH LÝ & CẢI VẬN
Hệ Thống Phân Tích Mệnh Lý · Chuyên Sâu Bát Tự & Chu Dịch

| I. THÔNG TIN HỒ SƠ TƯ VẤN

| Thông tin | Chi tiết |
| :--- | :--- |
| **Họ và tên gia chủ:** | ${userQuestion ? 'Gia chủ cầu quẻ' : 'Đương số'} |
| **Ngày giờ chiêm quẻ:** | ${new Date().toLocaleDateString('vi-VN')} — Chu Dịch Chiêm Bốc |
| **Quẻ Chu Dịch:** | Quẻ Gốc: ${orig.name || ''} (Số ${orig.number || ''}) — Quẻ Biến: ${chg.name || 'Thuần quẻ'} |
| **Chuyên đề tư vấn:** | Luận giải Quẻ Dịch Chu Dịch, Thời Thế, Cơ Vận Sự Vụ & Chỉ Dẫn Hành Động |
| **Đơn vị tư vấn:** | Lữ Phúc - Cải Vận Bổ Khuyết (Hotline: 037.44.36.921) |

| II. NỘI DUNG PHÂN TÍCH & ĐỊNH HƯỚNG CẢI VẬN

### 1. Khái Quát Ý Nghĩa Tượng Quẻ & Thời Thế Hiện Tại
* **Quẻ Gốc**: **${orig.name || ''}** (${orig.judgment || 'Nguyên hanh lợi trinh'}).
* Thời thế hiện tại đòi hỏi sự sáng suốt, nhìn thấu gốc rễ vấn đề trước khi đưa ra quyết sách quan trọng.

### 2. Tương Tác Thể Dụng & Thế Ứng
* Chủ thể và sự việc đang trong quá trình chuyển hóa năng lượng. Thuận theo lẽ tự nhiên sẽ gặt hái kết quả tốt đẹp.

### 3. Luận Giải Trực Tiếp Sự Vụ Cần Xem
* ${userQuestion ? `Đối với câu hỏi "${userQuestion}": Quẻ chỉ ra rằng cần giữ vững tâm thế kiên định, minh bạch và chân thành, không nên nóng vội đốt cháy giai đoạn.` : 'Công danh, tài vận đang trên đà tích lũy, hãy kiên trì ắt có thành tựu xứng đáng.'}

### 4. Chỉ Dẫn Hành Động & Đạo Dịch Cải Vận (Tiến Thoái Tùy Thời)
* *"Cùng tắc biến, biến tắc thông, thông tắc cửu"*. Nắm bắt quy luật của dịch lý để chủ động tiến thoái đúng lúc.

LỮ PHÚC TỔ ĐƯỜNG
Gieo Phúc — Gặt Phước
(Ký tên & Đóng dấu)`;
}

/**
 * Main AI Interpretation Generator
 */
export async function generateAIInterpretation(req: InterpretationRequest): Promise<{
  text: string;
  model: string;
  isAiGenerated: boolean;
}> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If Gemini API Key is configured, use Gemini AI
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = buildAstrologicalPrompt(req);
      const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      const outputText = response.text;
      if (outputText && outputText.trim()) {
        return {
          text: outputText.trim(),
          model: modelName,
          isAiGenerated: true,
        };
      }
    } catch (err: any) {
      console.error('Error invoking Gemini API:', err?.message || err);
      // Fall through to heuristic fallback gracefully
    }
  }

  // Graceful heuristic fallback if no key or API error
  const fallbackText = generateHeuristicInterpretation(req);
  return {
    text: fallbackText,
    model: 'LuPhuc-Astrology-Engine-v2',
    isAiGenerated: false,
  };
}
