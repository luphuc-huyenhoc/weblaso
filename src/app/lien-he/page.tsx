'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function LienHePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Tư vấn Bát Tự & Cải Vận');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 my-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
          Kết Nối Với Chúng Tôi
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase">
          Liên Hệ & Đặt Lịch Tư Vấn Phong Thủy
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Đội ngũ chuyên gia sẵn sàng hỗ trợ giải đáp mọi thắc mắc về Bát Tự, Tử Vi, phong thủy nhà ở và vật phẩm hộ mệnh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
          <h3 className="font-bold text-gray-900 text-base uppercase border-b pb-3">
            Thông Tin Trụ Sở
          </h3>

          <div className="space-y-4 text-xs text-gray-700">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#c8860a] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 mb-0.5">Địa chỉ văn phòng:</strong>
                <span>Tòa nhà Phong Thủy Ngũ Hành, Quận 1, TP. Hồ Chí Minh</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-[#c8860a] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 mb-0.5">Hotline hỗ trợ:</strong>
                <span className="font-mono font-bold text-[#c8860a]">1900 6868 — 0912 345 678</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-[#c8860a] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 mb-0.5">Hòm thư điện tử:</strong>
                <span>hotro@nguhanh.net</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-[#c8860a] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900 mb-0.5">Thời gian làm việc:</strong>
                <span>Thứ 2 — Chủ Nhật: 08:00 - 21:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact / Consultation Form */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900">Gửi Yêu Cầu Thành Công!</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Cảm ơn bạn đã liên hệ. Đội ngũ chuyên gia sẽ xem xét thông tin và liên hệ lại với bạn trong vòng 24 giờ làm việc.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#c8860a] font-bold hover:underline pt-2"
              >
                Gửi thêm yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <h3 className="font-bold text-gray-900 text-base uppercase border-b pb-3 mb-4">
                Gửi Tin Nhắn / Đặt Lịch Hẹn
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên của bạn</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#c8860a] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#c8860a] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#c8860a] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Dịch vụ quan tâm</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:border-[#c8860a] text-sm"
                  >
                    <option value="Tư vấn Bát Tự & Cải Vận">Tư vấn Bát Tự & Cải Vận</option>
                    <option value="Xem Lá Số Tử Vi Chi Tiết">Xem Lá Số Tử Vi Chi Tiết</option>
                    <option value="Khảo sát Hướng Nhà Phong Thủy">Khảo sát Hướng Nhà Phong Thủy</option>
                    <option value="Đặt Mua Vật Phẩm Hộ Mệnh">Đặt Mua Vật Phẩm Hộ Mệnh</option>
                    <option value="Hỗ trợ kỹ thuật tài khoản">Hỗ trợ kỹ thuật tài khoản</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nội dung chi tiết</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mô tả cụ thể yêu cầu hoặc ngày giờ sinh cần xem..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#c8860a] text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-3 rounded shadow uppercase tracking-wider text-xs transition"
                >
                  <Send className="w-4 h-4" />
                  <span>GỬI YÊU CẦU TƯ VẤN</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
