import { PrismaClient, Role, PlanType, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Admin
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      email: 'admin@luphuc.vn',
      fullName: 'Quản Trị Viên Lữ Phúc',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true,
    },
    create: {
      username: 'admin',
      email: 'admin@luphuc.vn',
      fullName: 'Quản Trị Viên Lữ Phúc',
      phoneNumber: '0900000000',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('Created/Verified Admin:', admin.email);

  // 2. Create Sample Test User with Active Subscription
  const userPasswordHash = await bcrypt.hash('User@123456', 10);
  const user = await prisma.user.upsert({
    where: { username: 'nguyenvana' },
    update: {
      email: 'user@luphuc.vn',
      fullName: 'Nguyễn Văn A',
      passwordHash: userPasswordHash,
    },
    create: {
      username: 'nguyenvana',
      email: 'user@luphuc.vn',
      fullName: 'Nguyễn Văn A',
      phoneNumber: '0900000001',
      passwordHash: userPasswordHash,
      role: Role.USER,
      isActive: true,
      subscriptions: {
        create: {
          planType: PlanType.PRO_ANNUAL,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });
  console.log('Created/Verified Test User:', user.email);

  // 3. Create Default Site Settings
  const defaultSettings = [
    { key: 'site_title', value: 'Lữ Phúc | Bát Tự Manh Phái & Dịch Học Cổ Truyền', description: 'Tiêu đề trang web' },
    { key: 'notice_banner', value: 'Lữ Phúc — Khóa luận giải Bát Tự & Dịch Học thực chiến cùng chuyên gia', description: 'Thông báo trên banner' },
    { key: 'maintenance_mode', value: 'false', description: 'Bật/tắt chế độ bảo trì' },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 4. Seed Feng Shui Items (Vật Phẩm Cải Vận)
  const items = [
    {
      slug: 'thach-anh-trang-thap-van-xuong',
      name: 'Tháp Văn Xương Thạch Anh Trắng',
      category: 'vat-pham-phong-thuy',
      element: 'KIM',
      price: 850000,
      imageUrl: '/images/items/thap-van-xuong-kim.jpg',
      description: 'Bổ trợ hành Kim, kích hoạt trí tuệ, thi cử công danh hiển đạt.',
      details: 'Chế tác từ đá thạch anh tự nhiên nguyên khối, phù hợp cho mệnh khuyết Kim hoặc Dụng Thần là Kim.',
      tags: 'Kim,Học Hành,Công Danh',
      priority: 10,
    },
    {
      slug: 'vong-tay-go-tram-huong-tu-nhien',
      name: 'Vòng Tay Trầm Hương Tự Nhiên',
      category: 'vat-pham-may-man',
      element: 'MOC',
      price: 1200000,
      imageUrl: '/images/items/tram-huong-moc.jpg',
      description: 'Bổ trợ hành Mộc, tịnh hóa năng lượng xấu, gia tăng vượng khí bình an.',
      details: 'Gỗ trầm hương tự nhiên lâu năm, mùi thơm dịu nhẹ bền lâu, phù hợp bổ khuyết Mộc.',
      tags: 'Mộc,Bình An,Tài Lộc',
      priority: 9,
    },
    {
      slug: 'ho-lo-thach-anh-den-hoa-sat',
      name: 'Hồ Lô Thạch Anh Đen Hóa Sát',
      category: 'cai-van',
      element: 'THUY',
      price: 650000,
      imageUrl: '/images/items/ho-lo-thuy.jpg',
      description: 'Bổ trợ hành Thủy, hóa giải hung sát tinh, trừ tà và nạp phúc khí.',
      details: 'Thạch anh đen tự nhiên mang năng lượng Thủy cực mạnh, dùng đặt bàn làm việc hoặc đầu giường.',
      tags: 'Thủy,Hóa Sát,Trừ Tà',
      priority: 8,
    },
    {
      slug: 'qua-cau-thach-anh-hong-chieu-tai',
      name: 'Quả Cầu Thạch Anh Hồng Chiêu Tài',
      category: 'vat-pham-phong-thuy',
      element: 'HOA',
      price: 980000,
      imageUrl: '/images/items/cau-hong-hoa.jpg',
      description: 'Bổ trợ hành Hỏa, kích hoạt nhân duyên, hòa hợp mối quan hệ gia đạo kinh doanh.',
      details: 'Đá thạch anh hồng tinh thể, phát tán năng lượng ấm áp thuộc Hỏa.',
      tags: 'Hỏa,Nhân Duyên,Tài Lộc',
      priority: 7,
    },
    {
      slug: 'ty-huu-ngoc-hoang-long-chieu-tai',
      name: 'Tỳ Hưu Ngọc Hoàng Long Chiêu Tài',
      category: 'cai-van',
      element: 'THO',
      price: 1500000,
      imageUrl: '/images/items/ty-huu-tho.jpg',
      description: 'Bổ trợ hành Thổ, trấn trạch hưng gia, thu hút tài lộc vững chắc.',
      details: 'Đá ngọc Hoàng Long tự nhiên vàng óng, linh vật phong thủy bảo vệ của cải bền bỉ.',
      tags: 'Thổ,Tài Lộc,Trấn Trạch',
      priority: 10,
    },
  ];

  for (const it of items) {
    await prisma.fengShuiItem.upsert({
      where: { slug: it.slug },
      update: it,
      create: it,
    });
  }

  // 5. Seed Initial Knowledge Articles
  const articles = [
    {
      slug: 'nhap-mon-bat-tu-manh-phai',
      title: 'Nhập môn Bát Tự Manh Phái: Lý thuyết cốt lõi về Tứ Trụ',
      category: 'kien-thuc-bat-tu',
      summary: 'Khái quát nguồn gốc, phương pháp luận giải và ứng dụng thực tiễn của Bát Tự trong cải biến vận mệnh.',
      content: 'Bát Tự (Tứ Trụ) là một môn mệnh lý cổ đại dựa trên năm, tháng, ngày và giờ sinh theo âm lịch và tiết khí. Qua hệ thống Thiên Can, Địa Chi và Thập Thần, người nghiên cứu có thể nhìn thấu điểm mạnh, điểm yếu và xu hướng thời vận của một đời người.',
      authorName: 'Thầy Đoàn Gia',
    },
    {
      slug: 'y-nghia-luc-than-trong-que-dich',
      title: 'Ý nghĩa Lục Thân và Lục Thú trong dự đoán Lục Hào',
      category: 'kien-thuc-dich-hoc',
      summary: 'Hướng dẫn luận đoán chi tiết về Phụ Mẫu, Huynh Đệ, Tử Tôn, Thê Tài và Quan Quỷ.',
      content: 'Trong Lục Hào, mỗi hào mang một Can Chi và một quan hệ Lục Thân. Hiểu rõ tương tác giữa Thế - Ứng, Dụng Thần và Nhật Nguyệt sẽ cho ta câu trả lời sáng tỏ cho mọi việc cần xem.',
      authorName: 'Ban Biên Tập',
    },
  ];

  for (const art of articles) {
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: art,
      create: art,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
