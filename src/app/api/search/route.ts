import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || searchParams.get('s') || '';

    if (!query.trim()) {
      return NextResponse.json({
        status: 200,
        data: { articles: [], items: [], tools: [] },
      });
    }

    const cleanQ = query.trim();

    // 1. Search Articles
    const articles = await db.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: cleanQ, mode: 'insensitive' } },
          { summary: { contains: cleanQ, mode: 'insensitive' } },
          { content: { contains: cleanQ, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });

    // 2. Search Feng Shui Items
    const items = await db.fengShuiItem.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: cleanQ, mode: 'insensitive' } },
          { description: { contains: cleanQ, mode: 'insensitive' } },
          { element: { contains: cleanQ, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });

    // 3. Search Built-in Calculation Tools
    const tools = [
      {
        title: 'Lập Lá Số Bát Tự Tứ Trụ',
        url: '/la-so-bat-tu',
        description: 'Phân tích Nhật Chủ, Thập Thần, Dụng Thần, 100 năm Đại Vận và Lưu Niên.',
      },
      {
        title: 'Tìm Ngày Sinh Theo Tứ Trụ Bát Tự',
        url: '/la-so-bat-tu/tim-ngay-sinh-theo-tu-tru',
        description: 'Tra cứu ngược ngày giờ sinh Dương Lịch từ can chi của năm, tháng, ngày, giờ.',
      },
      {
        title: 'Xem Thời Vận & Lưu Niên',
        url: '/la-so-bat-tu/xem-thoi-van',
        description: 'Dự báo vận hạn từng năm, thời điểm thăng tiến và phòng tránh rủi ro.',
      },
      {
        title: 'Vật Phẩm Phong Thủy Cải Vận',
        url: '/la-so-bat-tu/xem-vat-pham-cai-van',
        description: 'Bổ trợ ngũ hành khuyết thiếu dựa trên Bát Tự Dụng Thần.',
      },
      {
        title: 'Gieo Quẻ Lục Hào Dã Hạc',
        url: '/que-dich/luc-hao',
        description: 'Chiêm đoán sự vụ kinh doanh, công danh, gia đạo theo 64 quẻ Kinh Dịch.',
      },
      {
        title: 'Tung Đồng Xu Ngẫu Nhiên',
        url: '/que-dich/ngau-nhien',
        description: 'Gieo 3 đồng tiền cổ 6 lần dự trắc cát hung sự việc.',
      },
      {
        title: 'Bói Sim Số Điện Thoại Mai Hoa',
        url: '/que-dich/so-dien-thoai',
        description: 'Phân tích năng lượng số điện thoại qua Thượng quái, Hạ quái và Hào động.',
      },
      {
        title: 'Lá Số Tử Vi Đẩu Số',
        url: '/la-so-tu-vi',
        description: 'An 12 cung, 14 chính tinh và giải đoán thiên bẩm, vận mệnh.',
      },
      {
        title: 'Tra Cứu Sao Chiếu Mệnh & Niên Hạn',
        url: '/la-so-tu-vi/xem-sao-han',
        description: 'Xem Cửu Diệu, Tam Tai, Kim Lâu, Hoang Ốc theo từng tuổi.',
      },
      {
        title: 'Chuyển Đổi Lịch Âm Dương',
        url: '/la-so-tu-vi/doi-lich-am-duong',
        description: 'Chuyển đổi ngày dương lịch sang âm lịch và ngược lại theo múi giờ Việt Nam.',
      },
      {
        title: 'Phong Thủy Bát Trạch Hướng Nhà',
        url: '/phong-thuy/bat-trach',
        description: 'Xác định cung phi quái mệnh, 8 hướng cát hung và phân kim 24 sơn hướng.',
      },
    ].filter(
      (t) =>
        t.title.toLowerCase().includes(cleanQ.toLowerCase()) ||
        t.description.toLowerCase().includes(cleanQ.toLowerCase())
    );

    return NextResponse.json({
      status: 200,
      data: {
        query: cleanQ,
        totalMatches: articles.length + items.length + tools.length,
        tools,
        articles,
        items,
      },
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { status: 500, message: 'Lỗi trong quá trình tìm kiếm' },
      { status: 500 }
    );
  }
}
