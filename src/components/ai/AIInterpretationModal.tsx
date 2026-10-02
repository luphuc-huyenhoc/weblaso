'use client';

import React, { useState, useEffect } from 'react';
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
  BookOpen
} from 'lucide-react';

interface AIInterpretationModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: 'BAZI' | 'ZIWEI' | 'ICHING';
  chartData: any;
  chartTitle?: string;
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

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    fetchInterpretation(userQuestion.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-amber-300/80 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#27303f] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#3b475c] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg uppercase text-white tracking-wide">
                  Luận Giải Lá Số AI Chuyên Sâu
                </h3>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-black text-amber-300 uppercase tracking-widest">
                  <Crown className="w-3 h-3 text-amber-300" />
                  <span>VIP MEMBER</span>
                </span>
              </div>
              <p className="text-xs text-gray-300">
                {chartTitle || 'Bản mệnh học phái Lữ Phúc (Gieo Phúc - Gặt Phước)'}
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
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-gray-800 text-sm leading-relaxed">
          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-[#c8860a] border border-amber-200 flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-gray-900 text-base">
                  Trí Tuệ Nhân Tạo Đang Phân Tích Mệnh Bàn...
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Mô hình AI đang kết hợp ngũ hành, can chi, thần sát, đại vận và dụng thần để thiết lập bài luận giải chuẩn xác nhất.
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
          ) : interpretation ? (
            <div className="space-y-6">
              {/* Formatted Text Viewer */}
              <div className="prose prose-sm max-w-none space-y-3 font-serif sm:font-sans bg-[#fdfbf7] p-4 sm:p-6 rounded-xl border border-amber-200/60 shadow-xs select-text">
                {interpretation.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('## ') || paragraph.startsWith('### ')) {
                    const headingText = paragraph.replace(/^#+\s*/, '');
                    return (
                      <h4
                        key={idx}
                        className="text-base sm:text-lg font-black text-[#1b2b48] border-b border-amber-300/60 pb-1.5 pt-3 uppercase tracking-tight flex items-center space-x-2"
                      >
                        <span>{headingText}</span>
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n');
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-1 text-gray-800 text-xs sm:text-sm">
                        {items.map((it, iIdx) => (
                          <li key={iIdx} dangerouslySetInnerHTML={{ __html: it.replace(/^[\*\-]\s*/, '') }} />
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote
                        key={idx}
                        className="p-3 bg-amber-50/80 border-l-4 border-amber-500 text-amber-900 text-xs rounded-r-md italic my-2"
                        dangerouslySetInnerHTML={{ __html: paragraph.replace(/^>\s*/, '') }}
                      />
                    );
                  }
                  return (
                    <p
                      key={idx}
                      className="text-gray-800 text-xs sm:text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  );
                })}
              </div>

              {/* Custom Follow-up Question Form */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 sm:p-4 space-y-2 no-print">
                <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c8860a]" />
                  <span>Hỏi thêm AI về một sự vụ cụ thể (Công danh, Tình duyên, Năm nay...):</span>
                </span>
                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Ví dụ: Năm nay tôi có nên đổi việc không? Tình duyên bao giờ lập gia đình?..."
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#c8860a]"
                  />
                  <button
                    type="submit"
                    disabled={customQuestionLoading || !userQuestion.trim()}
                    className="inline-flex items-center space-x-1 px-4 py-2 bg-[#27303f] hover:bg-[#1a222e] text-white rounded-lg text-xs font-bold uppercase transition disabled:opacity-50"
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
          <div className="flex items-center space-x-2">
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
              <span>In luận giải</span>
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
