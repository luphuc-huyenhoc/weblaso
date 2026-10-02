'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Crown,
  Printer,
  Copy,
  Check,
  RefreshCw,
  X,
  Loader2,
  AlertCircle,
  Send,
  FileDown,
  FileText
} from 'lucide-react';

interface AIInterpretationModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: 'BAZI' | 'ZIWEI' | 'ICHING';
  chartData: any;
  chartTitle?: string;
}

interface TableRow {
  label: string;
  value: string;
}

interface Chapter {
  title: string;
  content: string[];
}

interface ParsedDossier {
  title: string;
  subtitle: string;
  tableRows: TableRow[];
  chapters: Chapter[];
  hasSignature: boolean;
  rawText: string;
}

/**
 * Parse raw markdown/text into structured Lữ Phúc Consulting Dossier components.
 */
function parseDossier(rawText: string, defaultTitle?: string): ParsedDossier {
  const lines = rawText.split('\n');
  const tableRows: TableRow[] = [];
  const chapters: Chapter[] = [];
  let curChapter: Chapter | null = null;
  let title = 'BẢN LUẬN GIẢI MỆNH LÝ & CẢI VẬN';
  let subtitle = 'Hệ Thống Phân Tích Mệnh Lý · Chuyên Sâu Bát Tự Lữ Phúc';
  let hasSignature = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) continue;

    // Detect Title
    if (line.includes('BẢN LUẬN GIẢI MỆNH LÝ & CẢI VẬN')) {
      title = 'BẢN LUẬN GIẢI MỆNH LÝ & CẢI VẬN';
      continue;
    }

    // Detect Subtitle
    if (line.includes('Hệ Thống Phân Tích Mệnh Lý') || line.includes('Chuyên Sâu Bát Tự')) {
      subtitle = line.replace(/^[\#\*\_\-\s]+/, '').replace(/[\#\*\_\-\s]+$/, '').trim();
      continue;
    }

    // Skip section headers from body flow
    if (line.includes('I. THÔNG TIN HỒ SƠ TƯ VẤN') || line.includes('II. NỘI DUNG PHÂN TÍCH & ĐỊNH HƯỚNG CẢI VẬN')) {
      continue;
    }

    // Detect Markdown Table row
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---')) continue; // separator
      const parts = line.split('|').map(s => s.trim()).filter((s, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (parts.length >= 2) {
        if (parts[0].includes('Thông tin') && parts[1].includes('Chi tiết')) {
          continue; // header row
        }
        tableRows.push({
          label: parts[0].replace(/\*\*/g, '').trim(),
          value: parts.slice(1).join(' | ').replace(/\*\*/g, '').trim(),
        });
      }
      continue;
    }

    // Detect Signature Sign-off
    if (line.includes('LỮ PHÚC TỔ ĐƯỜNG') || line.includes('Gieo Phúc — Gặt Phước') || line.includes('Ký tên & Đóng dấu')) {
      hasSignature = true;
      continue;
    }

    // Detect Chapter Headings (### 1. ...)
    if (line.startsWith('### ') || line.startsWith('## ') || (/^(\d+\.|\bChương\b|\bMục\b)/i.test(line) && line.length < 80)) {
      if (curChapter) chapters.push(curChapter);
      curChapter = {
        title: line.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim(),
        content: [],
      };
      continue;
    }

    // Normal paragraph content
    if (curChapter) {
      curChapter.content.push(raw);
    } else {
      // If content appears before any chapter, create an introductory chapter
      curChapter = {
        title: 'Lời Mở Đầu & Tổng Quan',
        content: [raw],
      };
    }
  }

  if (curChapter) chapters.push(curChapter);

  return {
    title,
    subtitle: subtitle || defaultTitle || 'Hệ Thống Phân Tích Mệnh Lý · Chuyên Sâu Bát Tự Lữ Phúc',
    tableRows,
    chapters,
    hasSignature: true,
    rawText,
  };
}

/**
 * Generate native Word (.doc) HTML document matching official consulting dossier format.
 */
function buildWordDocHtml(dossier: ParsedDossier): string {
  const { title, subtitle, tableRows, chapters } = dossier;

  const rowsHtml = tableRows.map((r, idx) => `
    <tr style="${idx % 2 === 1 ? 'background-color: #FAF5F0;' : ''}">
      <td style="width: 32%; border: 1pt solid #E2D3C4; padding: 6pt 10pt; font-weight: bold; color: #282828; font-size: 12pt; vertical-align: top;">
        ${r.label}
      </td>
      <td style="width: 68%; border: 1pt solid #E2D3C4; padding: 6pt 10pt; color: #282828; font-size: 12pt; vertical-align: top;">
        ${r.value}
      </td>
    </tr>
  `).join('');

  const chaptersHtml = chapters.map(ch => `
    <h3 style="color: #1b2b48; font-size: 13pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; border-bottom: 1pt solid #E2D3C4; padding-bottom: 3pt;">
      ${ch.title}
    </h3>
    ${ch.content.map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const cleanItem = trimmed.replace(/^[\*\-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        return `<p style="margin: 3pt 0 3pt 16pt; font-size: 12pt; line-height: 1.6; color: #282828;">• ${cleanItem}</p>`;
      }
      const formatted = trimmed.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      return `<p style="margin: 5pt 0; font-size: 12pt; line-height: 1.65; color: #282828; text-align: justify;">${formatted}</p>`;
    }).join('')}
  `).join('');

  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 21.0cm 29.7cm;
      margin: 2.0cm 2.0cm 2.0cm 2.0cm;
      mso-header-margin: 1.0cm;
      mso-footer-margin: 1.0cm;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #282828;
      background-color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="Section1">
    <!-- Header Title -->
    <div style="text-align: center; margin-bottom: 20pt;">
      <h1 style="color: #8B1C2D; font-size: 19pt; font-weight: bold; margin: 0 0 4pt 0; text-transform: uppercase; letter-spacing: 0.5pt;">
        ${title}
      </h1>
      <p style="color: #A07832; font-size: 13pt; font-style: italic; margin: 0;">
        ${subtitle}
      </p>
    </div>

    <!-- Section I: Profile Information -->
    <div style="margin-top: 14pt;">
      <h2 style="color: #8B1C2D; font-size: 13.5pt; font-weight: bold; margin: 12pt 0 6pt 0;">
        | I. THÔNG TIN HỒ SƠ TƯ VẤN
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 16pt;">
        ${rowsHtml}
      </table>
    </div>

    <!-- Section II: Detailed Analysis -->
    <div style="margin-top: 16pt;">
      <h2 style="color: #8B1C2D; font-size: 13.5pt; font-weight: bold; margin: 12pt 0 6pt 0;">
        | II. NỘI DUNG PHÂN TÍCH &amp; ĐỊNH HƯỚNG CẢI VẬN
      </h2>
      ${chaptersHtml}
    </div>

    <!-- Sign-off & Seal Block -->
    <table style="width: 100%; margin-top: 26pt; border: none; page-break-inside: avoid;">
      <tr>
        <td style="width: 50%; border: none;"></td>
        <td style="width: 50%; text-align: right; vertical-align: top; border: none;">
          <div style="font-weight: bold; font-size: 13pt; color: #282828;">LỮ PHÚC TỔ ĐƯỜNG</div>
          <div style="font-style: italic; color: #555555; font-size: 11.5pt; margin: 2pt 0;">Gieo Phúc — Gặt Phước</div>
          <div style="color: #777777; font-size: 11pt; margin-bottom: 8pt;">(Ký tên &amp; Đóng dấu)</div>
          
          <table style="margin-left: auto; margin-right: 0; width: 110pt; height: 110pt; border: 2pt solid #c22222; border-radius: 50%; color: #c22222; text-align: center;">
            <tr>
              <td style="vertical-align: middle; text-align: center; padding: 4pt;">
                <div style="font-size: 8pt; font-weight: bold; letter-spacing: 0.5pt;">★ LỮ PHÚC TỔ ĐƯỜNG ★</div>
                <div style="font-size: 11.5pt; font-weight: bold; margin: 3pt 0; color: #dc2626;">GIEO PHÚC<br/>GẶT PHƯỚC</div>
                <div style="font-size: 7.5pt; letter-spacing: 0.5pt;">CẢI VẬN PHÁP ẤN</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

export function AIInterpretationModal({
  isOpen,
  onClose,
  chartType,
  chartData,
  chartTitle,
}: AIInterpretationModalProps) {
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [customQuestionLoading, setCustomQuestionLoading] = useState(false);

  const fetchInterpretation = async (customQ?: string) => {
    if (customQ) {
      setCustomQuestionLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch('/api/ai/luan-giai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartType,
          data: chartData,
          userQuestion: customQ || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Không thể tạo luận giải AI.');
      }

      setInterpretation(data.data.interpretation);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối khi tạo luận giải.');
    } finally {
      setLoading(false);
      setCustomQuestionLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !interpretation && !loading) {
      fetchInterpretation();
    }
  }, [isOpen]);

  const parsedDossier = useMemo(() => {
    if (!interpretation) return null;
    return parseDossier(interpretation, chartTitle);
  }, [interpretation, chartTitle]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!interpretation) return;
    navigator.clipboard.writeText(interpretation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    if (!parsedDossier) return;
    const htmlDoc = buildWordDocHtml(parsedDossier);
    const blob = new Blob(['\ufeff', htmlDoc], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Find personal name from table
    const personName = parsedDossier.tableRows.find(
      r => r.label.includes('Họ và tên') || r.label.includes('gia chủ')
    )?.value || chartTitle || 'Lu_Phuc';
    const cleanName = personName
      .replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_')
      .substring(0, 30);

    a.download = `Ban_Luan_Giai_Menh_Ly_${cleanName}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    fetchInterpretation(userQuestion.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-amber-300/80 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#27303f] text-white p-3.5 sm:p-5 flex items-center justify-between border-b border-[#3b475c] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base md:text-lg uppercase text-white tracking-wide">
                  Hồ Sơ Luận Giải Mệnh Lý & Cải Vận AI
                </h3>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-black text-amber-300 uppercase tracking-widest">
                  <Crown className="w-3 h-3 text-amber-300" />
                  <span>VIP MEMBER</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-300">
                {chartTitle || 'Hệ thống luận giải độc quyền Lữ Phúc (Gieo Phúc — Gặt Phước)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-6 text-gray-800 text-sm leading-relaxed bg-gray-50/50">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-[#c8860a] border border-amber-200 flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-gray-900 text-base">
                  Trí Tuệ Nhân Tạo Đang Phân Tích Mệnh Bàn...
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Mô hình AI đang kết hợp Tứ Trụ, Thần Sát, Dụng Thần và Vận Hạn để soạn thảo bản luận giải theo đúng quy chuẩn hồ sơ tư vấn Lữ Phúc.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-3 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="font-semibold text-xs">{error}</p>
              <button
                type="button"
                onClick={() => fetchInterpretation()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            </div>
          ) : parsedDossier ? (
            <div className="space-y-6">
              {/* Prestigious Word Dossier Viewer Card */}
              <div className="bg-[#fffdfa] p-4 sm:p-8 rounded-xl border border-[#e2d3c4] shadow-sm font-serif select-text space-y-6 text-[#282828]">
                {/* Title & Subtitle */}
                <div className="text-center space-y-1 pb-3 border-b border-[#e2d3c4]/70">
                  <h1 className="text-xl sm:text-2xl font-black text-[#8B1C2D] tracking-wide uppercase">
                    {parsedDossier.title}
                  </h1>
                  <p className="text-xs sm:text-sm italic font-medium text-[#A07832]">
                    {parsedDossier.subtitle}
                  </p>
                </div>

                {/* Section I: Thông tin hồ sơ tư vấn */}
                <div className="space-y-3">
                  <h2 className="text-sm sm:text-base font-bold text-[#8B1C2D] uppercase tracking-wide border-l-4 border-[#8B1C2D] pl-2.5">
                    | I. THÔNG TIN HỒ SƠ TƯ VẤN
                  </h2>

                  {parsedDossier.tableRows.length > 0 ? (
                    <div className="overflow-x-auto border border-[#E2D3C4] rounded-lg">
                      <table className="w-full text-xs sm:text-sm border-collapse">
                        <tbody>
                          {parsedDossier.tableRows.map((row, idx) => (
                            <tr
                              key={idx}
                              className={`border-b border-[#E2D3C4] last:border-b-0 ${
                                idx % 2 === 1 ? 'bg-[#FAF5F0]' : 'bg-white'
                              }`}
                            >
                              <td className="w-1/3 py-2.5 px-3 sm:px-4 font-bold text-gray-900 border-r border-[#E2D3C4] align-top">
                                {row.label}
                              </td>
                              <td className="w-2/3 py-2.5 px-3 sm:px-4 text-gray-800 align-top">
                                {row.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>

                {/* Section II: Nội dung phân tích & định hướng cải vận */}
                <div className="space-y-5 pt-2">
                  <h2 className="text-sm sm:text-base font-bold text-[#8B1C2D] uppercase tracking-wide border-l-4 border-[#8B1C2D] pl-2.5">
                    | II. NỘI DUNG PHÂN TÍCH & ĐỊNH HƯỚNG CẢI VẬN
                  </h2>

                  <div className="space-y-6">
                    {parsedDossier.chapters.map((ch, cIdx) => (
                      <div key={cIdx} className="space-y-2">
                        <h3 className="text-sm sm:text-base font-bold text-[#1b2b48] border-b border-[#e2d3c4]/60 pb-1">
                          {ch.title}
                        </h3>
                        <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-[#282828]">
                          {ch.content.map((p, pIdx) => {
                            const trimmed = p.trim();
                            if (!trimmed) return null;
                            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                              const cleanItem = trimmed
                                .replace(/^[\*\-]\s*/, '')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                              return (
                                <div
                                  key={pIdx}
                                  className="flex items-start space-x-2 pl-3"
                                >
                                  <span className="text-[#8B1C2D] font-bold">•</span>
                                  <span
                                    dangerouslySetInnerHTML={{ __html: cleanItem }}
                                  />
                                </div>
                              );
                            }
                            const formatted = trimmed.replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong>$1</strong>'
                            );
                            return (
                              <p
                                key={pIdx}
                                className="text-justify"
                                dangerouslySetInnerHTML={{ __html: formatted }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Sign-off & Red Seal Stamp */}
                <div className="pt-8 border-t border-[#e2d3c4]/70 flex flex-col items-end">
                  <div className="text-right space-y-1">
                    <p className="font-extrabold text-sm sm:text-base text-gray-900 tracking-wide">
                      LỮ PHÚC TỔ ĐƯỜNG
                    </p>
                    <p className="text-xs sm:text-sm italic text-gray-600">
                      Gieo Phúc — Gặt Phước
                    </p>
                    <p className="text-[11px] text-gray-500 italic pb-2">
                      (Ký tên & Đóng dấu)
                    </p>

                    {/* Lacquer Red Seal Stamp Badge */}
                    <div className="inline-block p-1 border-2 border-dashed border-red-300 rounded-full">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-red-700 bg-red-50/40 p-1 flex flex-col items-center justify-center text-center text-red-700 shadow-xs transform -rotate-6 select-none">
                        <div className="text-[7.5px] sm:text-[8px] font-bold tracking-widest uppercase">
                          ★ LỮ PHÚC TỔ ĐƯỜNG ★
                        </div>
                        <div className="border-t border-b border-red-600 my-0.5 py-0.5 w-full">
                          <div className="font-black text-xs sm:text-sm leading-tight text-red-800 tracking-wider">
                            GIEO PHÚC
                          </div>
                          <div className="font-black text-xs sm:text-sm leading-tight text-red-800 tracking-wider">
                            GẶT PHƯỚC
                          </div>
                        </div>
                        <div className="text-[7px] sm:text-[7.5px] font-bold tracking-widest text-red-600 uppercase">
                          CẢI VẬN PHÁP ẤN
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Follow-up Question Form */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 sm:p-4 space-y-2 no-print">
                <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c8860a]" />
                  <span>Hỏi thêm AI về một sự vụ cụ thể (Công danh, Tình duyên, Năm nay...):</span>
                </span>
                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Ví dụ: Năm nay tôi có nên đầu tư bất động sản không? Tình duyên bao giờ thuận lợi?..."
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#c8860a]"
                  />
                  <button
                    type="submit"
                    disabled={customQuestionLoading || !userQuestion.trim()}
                    className="inline-flex items-center space-x-1 px-4 py-2 bg-[#27303f] hover:bg-[#1a222e] text-white rounded-lg text-xs font-bold uppercase transition disabled:opacity-50 shrink-0"
                  >
                    {customQuestionLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">Gửi câu hỏi</span>
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 shrink-0 no-print">
          <div className="flex flex-wrap items-center gap-2">
            {/* Word .doc Export Button */}
            <button
              type="button"
              onClick={handleDownloadWord}
              disabled={!parsedDossier}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#185abd] hover:bg-[#124591] text-white rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-50"
              title="Tải toàn bộ bản luận giải về máy dưới dạng tệp Microsoft Word (.doc)"
            >
              <FileDown className="w-4 h-4 text-white" />
              <span>Tải file Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!interpretation}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold transition disabled:opacity-50"
              title="Sao chép toàn bộ văn bản luận giải"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span>Sao chép</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={!interpretation}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold transition disabled:opacity-50"
              title="In bản luận giải ra giấy"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              <span>In hồ sơ</span>
            </button>

            <button
              type="button"
              onClick={() => fetchInterpretation()}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold transition disabled:opacity-50"
              title="Phân tích và sinh lại bài luận giải mới"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              <span>Sinh lại</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#27303f] hover:bg-[#1a222e] text-white rounded-lg text-xs font-bold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
