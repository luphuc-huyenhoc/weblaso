'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, Bookmark, CreditCard, Activity, Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.status === 403 || res.status === 401) {
          setError('Tài khoản của bạn không có quyền Quản Trị Viên (Admin).');
          setLoading(false);
          return;
        }
        const json = await res.json();
        if (res.ok) {
          setData(json.data);
        } else {
          setError(json.message);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-gray-500 text-sm flex items-center justify-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin text-[#c8860a]" />
        <span>Đang kiểm tra quyền và tải dữ liệu hệ thống...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-red-50 border border-red-200 rounded-lg text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-red-900">Truy Cập Bị Giới Hạn</h2>
        <p className="text-xs text-red-700">{error}</p>
        <p className="text-xs text-gray-500">
          Vui lòng đăng nhập bằng tài khoản Quản trị viên (admin@luphuc.vn) để tiếp tục.
        </p>
        <Link
          href="/tai-khoan/dang-nhap"
          className="inline-block px-4 py-2 bg-[#c8860a] text-white text-xs font-bold rounded uppercase"
        >
          Đăng nhập tài khoản khác
        </Link>
      </div>
    );
  }

  const { stats, recentUsers, recentCharts } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-8 my-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full">
            Admin Control Center
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase mt-1">
            Bảng Quản Trị Hệ Thống Ngũ Hành
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <Link
            href="/api/health"
            target="_blank"
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded font-semibold text-gray-700 transition flex items-center space-x-1"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Health Check API</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Tổng Người Dùng</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{stats.totalUsers}</div>
          <div className="text-[11px] text-gray-400">Đã đăng ký tài khoản</div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Lá Số Đã Lưu</span>
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{stats.totalCharts}</div>
          <div className="text-[11px] text-gray-400">Bát Tự, Tử Vi, Dịch Số</div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Gói VIP Hoạt Động</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{stats.activeSubs}</div>
          <div className="text-[11px] text-gray-400">Thuê bao đang hiệu lực</div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold">Tổng Doanh Thu</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#c8860a]">
            {stats.revenue.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-gray-400">Qua cổng thanh toán</div>
        </div>
      </div>

      {/* Tables: Recent Users & Recent Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-gray-900 text-sm uppercase">Người Dùng Mới Nhất</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b">
                  <th className="p-2">Họ tên</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Vai trò</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-2 font-semibold text-gray-900">{u.name || '—'}</td>
                    <td className="p-2 text-gray-600">{u.email}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Charts */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-gray-900 text-sm uppercase">Lá Số Vừa Lưu</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b">
                  <th className="p-2">Tiêu đề</th>
                  <th className="p-2">Loại</th>
                  <th className="p-2">Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentCharts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-2 font-semibold text-gray-900 truncate max-w-[160px]">{c.title}</td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-[#c8860a] text-[10px] font-bold border border-amber-200">
                        {c.chartType}
                      </span>
                    </td>
                    <td className="p-2 font-mono text-gray-500 text-[10px]">v{c.engineVersion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
