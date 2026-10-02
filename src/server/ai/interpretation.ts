import { GoogleGenAI } from '@google/genai';

export interface InterpretationRequest {
  chartType: 'BAZI' | 'ZIWEI' | 'ICHING';
  data: any;
  userQuestion?: string;
}

/**
 * Build tailored prompt for Gemini AI
 */
function buildAstrologicalPrompt(req: InterpretationRequest): string {
  const { chartType, data, userQuestion } = req;

  if (chartType === 'BAZI') {
    const p = data?.calculation?.personal || data?.personal || {};
    const pil = data?.calculation?.pillars || data?.pillars || {};
    const dm = data?.calculation?.dayMaster || data?.dayMaster || {};
    const interp = data?.calculation?.interpretation || data?.interpretation || {};
    const elements = interp?.elementsScore || {};

    return `Bạn là một Đại sư Mệnh lý Bát Tự & Tứ Trụ Cổ Truyền uyên bác thuộc học phái Lữ Phúc (tôn chỉ: "Gieo Phúc - Gặt Phước").
Hãy phân tích và viết một bài LUẬN GIẢI LÁ SỐ BÁT TỰ chuyên sâu, chi tiết, khách quan, giàu triết lý và ứng dụng thực tiễn cho đương số sau:

THÔNG TIN BẢN MỆNH:
- Họ và tên: ${p.fullName || 'Đương số'}
- Giới tính: ${p.gender ? 'Nam mạng' : 'Nữ mạng'}
- Ngày giờ sinh: ${p.lunarDateStr || ''} (Dương lịch: ${p.solarDate || ''})
- Tứ Trụ Can Chi:
  + Trụ Năm: ${pil.year?.stem || ''} ${pil.year?.branch || ''} (Nạp âm: ${pil.year?.napAm || ''}, Thập Thần: ${pil.year?.tenGod || ''})
  + Trụ Tháng: ${pil.month?.stem || ''} ${pil.month?.branch || ''} (Nạp âm: ${pil.month?.napAm || ''}, Thập Thần: ${pil.month?.tenGod || ''})
  + Trụ Ngày: ${pil.day?.stem || ''} ${pil.day?.branch || ''} (Nhật Chủ: ${dm.stem || ''}, Đắc lệnh: ${dm.strength || ''} - ${dm.percentage || ''}%)
  + Trụ Giờ: ${pil.hour?.stem || ''} ${pil.hour?.branch || ''} (Nạp âm: ${pil.hour?.napAm || ''}, Thập Thần: ${pil.hour?.tenGod || ''})
- Điểm lực Ngũ Hành: Kim: ${elements.Kim || 0}, Mộc: ${elements.Mộc || 0}, Thủy: ${elements.Thủy || 0}, Hỏa: ${elements.Hỏa || 0}, Thổ: ${elements.Thổ || 0}
- Thần định lượng: Dụng Thần: ${interp.dungThan || ''} | Hỷ Thần: ${interp.hyThan || ''} | Kỵ Thần: ${interp.kyThan || ''}
${userQuestion ? `- Câu hỏi thắc mắc riêng của đương số: "${userQuestion}"` : ''}

YÊU CẦU BỐ CỤC BÀI LUẬN GIẢI (Định dạng Markdown đẹp mắt, có tiêu đề rõ ràng):
1. **Tổng Quan Thần Khí & Cách Cục Bản Mệnh**: Nhận định sự tương tác giữa Nhật Chủ và Lệnh Tháng, tỷ lệ ngũ hành thừa - thiếu, vượng - suy.
2. **Luận Giải Tính Cách & Khả Năng Tư Duy**: Điểm mạnh thiên bẩm, nhược điểm cần tu dưỡng.
3. **Luận Giải Công Danh, Sự Nghiệp & Định Hướng Nghề Nghiệp**: Ngành nghề phát huy tối đa Dụng Thần, cơ hội thăng tiến và đối tác phù hợp.
4. **Luận Giải Tài Lộc & Kinh Tế**: Nguồn tiền (Chính Tài hay Thiên Tài), thời vận tích lũy của cải, lưu ý quản lý tài chính.
5. **Luận Giải Tình Duyên, Gia Đạo & Con Cái**: Đặc điểm cung Phối ngẫu, mức độ hòa hợp, bí quyết gìn giữ hạnh phúc gia đình.
6. **Luận Giải Sức Khỏe & Thể Trạng**: Cơ quan nội tạng cần chú ý theo ngũ hành tạng phủ.
7. **Chiến Lược Cải Vận & Bổ Khuyết Ngũ Hành (Lữ Phúc Pháp)**: Hướng dẫn chi tiết màu sắc, phương vị, vật phẩm phong thủy và lối sống thiện lành để chuyển hóa hung thành cát.

Phong cách hành văn: Trang trọng, chuẩn mực mệnh lý cổ truyền, thấu cảm và hướng thiện, không mê tín dị đoan.`;
  }

  if (chartType === 'ZIWEI') {
    const p = data?.calculation?.personal || data?.personal || {};
    const palaces = data?.calculation?.palaces || data?.palaces || [];

    const menhPalace = palaces.find((x: any) => x.isMenh) || {};
    const thanPalace = palaces.find((x: any) => x.isThan) || {};

    return `Bạn là một Chuyên gia Tử Vi Đẩu Số Toàn Thư uyên bác của học phái Lữ Phúc (tôn chỉ: "Gieo Phúc - Gặt Phước").
Hãy phân tích và viết một bài LUẬN GIẢI LÁ SỐ TỬ VI ĐẨU SỐ chuyên sâu, thấu đáo cho đương số sau:

THÔNG TIN LÁ SỐ TỬ VI:
- Đương số: ${p.fullName || 'Đương số'} (${p.genderLabel || 'Nam mạng'})
- Tuổi âm: ${p.lunarAge || ''} tuổi (Năm xem: ${p.currentYearCanChi || ''})
- Bản mệnh: ${p.menhElement || ''} - Cục: ${p.cuc || ''}
- Mệnh Quái: ${p.menhQuai || ''} - Thân cư: ${p.thanCungName || ''}
- Chủ Mệnh: ${p.menhChu || ''} - Chủ Thân: ${p.thanChu || ''}
- Cung Mệnh (${menhPalace.cungName || 'Mệnh'} tại ${menhPalace.branch || ''}): Chính tinh [${(menhPalace.mainStars || []).map((s: any) => s.name).join(', ') || 'Vô chính diệu'}]
- Cung Thân (${thanPalace.cungName || 'Thân'} tại ${thanPalace.branch || ''}): Chính tinh [${(thanPalace.mainStars || []).map((s: any) => s.name).join(', ') || 'Vô chính diệu'}]
${userQuestion ? `- Câu hỏi nguyện vọng của đương số: "${userQuestion}"` : ''}

YÊU CẦU BỐ CỤC BÀI LUẬN GIẢI:
1. **Tổng Quan Mệnh Thân & Cục Số**: Đánh giá sự tương phối giữa Mệnh và Cục, ảnh hưởng của cung Thân khi bước vào trung niên.
2. **Luận Giải Cung Mệnh & Tam Phương Tứ Chính**: Phân tích sao thủ mệnh, cát sát tinh hội chiếu và cách cục đặc thù.
3. **Cung Quan Lộc (Sự Nghiệp)**: Điểm tựa công danh, môi trường làm việc phù hợp, tiềm năng lãnh đạo.
4. **Cung Tài Bạch (Tiền Tài)**: Khả năng tụ tài, kênh làm giàu bền vững, hạn hao tài.
5. **Cung Phu Thê & Phúc Đức**: Duyên phận hôn nhân, độ hòa hợp, phúc ấm tổ tiên.
6. **Lời Khuyên Vận Hạn & Đạo Đức Cải Mệnh**: Định hướng tu dưỡng tâm tính, ứng xử với cát hung để nạp phúc sinh tài.

Phong cách viết: Chuẩn mực, tôn trọng thuật số cổ truyền, mang tính xây dựng và chỉ dẫn thực tế.`;
  }

  // ICHING
  const calc = data?.calculation || data || {};
  const orig = calc.originalHexagram || {};
  const chg = calc.changedHexagram || {};

  return `Bạn là một Bậc thầy Dịch học & Quẻ Dịch Lục Hào phái Lữ Phúc (tôn chỉ: "Gieo Phúc - Gặt Phước").
Hãy phân tích và viết một bài LUẬN GIẢI QUẺ DỊCH chi tiết, sâu sắc:

THÔNG TIN QUẺ DỊCH:
- Quẻ Gốc (Chính quái): ${orig.name || ''} (Số ${orig.number || ''})
  + Thượng quái: ${orig.upperTrigram || ''} | Hạ quái: ${orig.lowerTrigram || ''}
  + Thoán từ: "${orig.judgment || ''}"
- Quẻ Biến (Chi quái): ${chg.name || 'Không có quẻ biến'}
${userQuestion ? `- Sự vụ đương số cầu hỏi: "${userQuestion}"` : ''}

YÊU CẦU BỐ CỤC BÀI LUẬN GIẢI:
1. **Khái Quát Ý Nghĩa Tượng Quẻ & Thời Thế**: Phân tích bối cảnh không gian thời gian mà quẻ phản ánh.
2. **Tương Tác Thể Dụng & Thế Ứng**: Chủ thể sự việc đang ở thế thuận hay nghịch, tương sinh hay tương khắc.
3. **Luận Giải Sự Vụ Cần Xem**: Đi thẳng vào câu trả lời cho việc người hỏi đang băn khoăn (công việc, tài chính, giao dịch, tình cảm...).
4. **Chỉ Dẫn Hành Động (Đạo Của Kinh Dịch)**: Nên tiến hay nên thoái, nắm bắt thời cơ ra sao để đạt kết quả cát tường nhất.`;
}

/**
 * Fallback heuristic interpretation when GEMINI_API_KEY is not configured yet
 */
function generateHeuristicInterpretation(req: InterpretationRequest): string {
  const { chartType, data } = req;

  if (chartType === 'BAZI') {
    const p = data?.calculation?.personal || data?.personal || {};
    const pil = data?.calculation?.pillars || data?.pillars || {};
    const dm = data?.calculation?.dayMaster || data?.dayMaster || {};
    const interp = data?.calculation?.interpretation || data?.interpretation || {};
    const reco = interp?.recommendations || {};

    return `## 📜 BÁO CÁO LUẬN GIẢI BÁT TỰ CHUYÊN SÂU (LỮ PHÚC)

### 1. Tổng Quan Bản Mệnh & Cách Cục
* **Đương số**: **${p.fullName || 'Đương số'}** (${p.gender ? 'Nam' : 'Nữ'} mạng).
* **Nhật Chủ (Nguyên Thần)**: Thiên Can **${dm.stem || 'Bản mệnh'}** tại Trụ Ngày.
* **Thể lực Thân Mệnh**: **${dm.strength || 'Bình hòa'}** (${dm.percentage || 50}% lực bản mệnh). 
* **Nhận định**: Bản mệnh mang trường năng lượng của Can **${dm.stem || ''}**, ${
      dm.strength?.includes('Vượng')
        ? 'khí lực dồi dào, tính tình kiên nghị, quyết đoán, có chí tiến thủ nhưng cần tiết chế bớt sự cứng nhắc.'
        : 'tính cách mềm mỏng, chu đáo, giỏi thích nghi, tuy nhiên đôi lúc thiếu tính quyết đoán khi đứng trước các quyết định lớn.'
    }

---

### 2. Định Lượng Thần Sát & Dụng Thần Điều Hỏa
* **Dụng Thần cứu mệnh**: <span style="color:#15803d; font-weight:bold;">${interp.dungThan || 'Bổ khuyết ngũ hành'}</span>. Đây là yếu tố cốt tử giúp cân bằng chân khí toàn bộ 4 trụ.
* **Hỷ Thần trợ lực**: <span style="color:#1d4ed8; font-weight:bold;">${interp.hyThan || 'Hòa hợp'}</span>.
* **Kỵ Thần cần tránh**: <span style="color:#b91c1c; font-weight:bold;">${interp.kyThan || 'Khắc chế'}</span>.

---

### 3. Luận Giải Công Danh, Sự Nghiệp & Tài Bạch
* **Con đường sự nghiệp**: Với cơ cấu Tứ Trụ hiện tại, đương số phù hợp phát triển trong các lĩnh vực liên quan đến hành **${interp.dungThan || 'Mộc/Hỏa'}**, đòi hỏi sự chuyên tâm và tư duy chiến lược dài hạn.
* **Tài vận**: Dòng tiền luân chuyển đều đặn. Cần tránh đầu tư mạo hiểm vào các năm gặp Kỵ Thần, nên ưu tiên tích lũy của cải vật chất vững chắc.

---

### 4. Luận Giải Tình Duyên & Gia Đạo
* Cung Phu/Thê tại Địa Chi Trụ Ngày cho thấy người bạn đời là người có trách nhiệm, tháo vát. Để gia đạo luôn ấm êm, hai bên cần lắng nghe và thấu hiểu lẫn nhau, lấy chữ "Nhẫn" làm đầu.

---

### 5. Phương Pháp Cải Vận Bổ Khuyết Ngũ Hành (Lữ Phúc Pháp)
* **Màu sắc trang phục & phụ kiện**: ${reco.favorableColors?.join(', ') || 'Màu sắc tương sinh theo Dụng Thần'}.
* **Phương hướng vượng khí**: ${reco.favorableDirections?.join(', ') || 'Hướng đón sinh khí'}.
* **Vật phẩm phong thủy tương hợp**: ${reco.favorableGemstones?.join(', ') || 'Đá phong thủy tự nhiên bổ khuyết'}.
* **Khẩu quyết dưỡng mệnh**: *"Tâm sinh tướng, đức sinh tài"*. Tích lũy phúc đức, hành thiện giúp đời chính là chìa khóa vàng mở ra mọi hanh thông cho số phận.

> *Lưu ý: Hệ thống đã kích hoạt chế độ phân tích thuật toán chuyên sâu. Để kết nối trực tiếp mô hình AI Gemini 3.8 Flash thời gian thực, quản trị viên chỉ cần thêm GEMINI_API_KEY trong cấu hình hệ thống.*`;
  }

  if (chartType === 'ZIWEI') {
    const p = data?.calculation?.personal || data?.personal || {};
    return `## 📜 LUẬN GIẢI TỬ VI ĐẨU SỐ TOÀN THƯ (LỮ PHÚC)

### 1. Tổng Quan Mệnh Thân
* **Họ tên**: **${p.fullName || 'Đương số'}** (${p.genderLabel || 'Nam mạng'})
* **Cục diện**: **${p.menhElement || 'Bản Mệnh'}** tương tác với **${p.cuc || 'Cục Số'}**.
* **Thân cư**: **${p.thanCungName || 'Mệnh'}** — cho thấy giai đoạn hậu vận sẽ chịu ảnh hưởng lớn từ những nỗ lực tự thân và phúc đức tích lũy.

### 2. Luận Giải Tam Phương Tứ Chính
* **Cung Mệnh**: Tọa lạc các tinh đẩu chủ quản sự nghiệp và tư chất. Đương số là người có hoài bão, giàu lòng tự trọng.
* **Cung Quan Lộc & Tài Bạch**: Có quý nhân tương trợ trong công việc, tuy nhiên cần chú trọng rèn luyện chuyên môn sâu để khẳng định vị thế.
* **Lời khuyên**: Vận hạn luôn luân chuyển, người biết thời thế sẽ đón lành tránh dữ, phát huy thế mạnh của sao cát và hạn chế tác hại của hung tinh.`;
  }

  return `## 📜 LUẬN GIẢI QUẺ DỊCH THỜI VẬN
* Quẻ phản ánh thời cơ hiện tại đang ở giai đoạn tích lũy và chuyển mình.
* Hãy hành động thận trọng, giữ vững chính đạo và minh bạch trong mọi việc để đón nhận cát lành.`;
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
