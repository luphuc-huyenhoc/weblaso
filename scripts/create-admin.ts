import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_EMAIL || 'admin@luphuc.vn').trim().toLowerCase();
  const password = (args[1] || process.env.ADMIN_PASSWORD || 'Admin@123456').trim();
  const fullName = (args[2] || process.env.ADMIN_FULLNAME || 'Quản Trị Viên Lữ Phúc').trim();
  const username = (args[3] || email.split('@')[0] || 'admin').trim().toLowerCase();

  console.log('--- KHỞI TẠO / CẬP NHẬT TÀI KHOẢN ADMIN ---');
  console.log(`Email:    ${email}`);
  console.log(`Username: ${username}`);
  console.log(`Họ tên:   ${fullName}`);

  const passwordHash = await bcrypt.hash(password, 10);

  // Check if user exists by email or username
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  let user;
  if (existingUser) {
    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        role: Role.ADMIN,
        isActive: true,
        fullName: fullName || existingUser.fullName,
        passwordHash,
      },
    });
    console.log(`✅ Đã thăng cấp tài khoản hiện có [${user.email}] lên quyền Quản Trị Viên (ADMIN).`);
  } else {
    user = await prisma.user.create({
      data: {
        username,
        email,
        fullName,
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log(`✅ Đã tạo mới thành công tài khoản Quản Trị Viên (ADMIN): ${user.email}`);
  }

  console.log('\n--- THÔNG TIN ĐĂNG NHẬP ADMIN ---');
  console.log(`URL đăng nhập: http://localhost:3000/tai-khoan/dang-nhap`);
  console.log(`Tài khoản:     ${user.email} (hoặc username: ${user.username})`);
  console.log(`Mật khẩu:      ${password}`);
  console.log(`Vai trò:       ${user.role}`);
  console.log('---------------------------------\n');
}

main()
  .catch((err) => {
    console.error('❌ Lỗi khi khởi tạo tài khoản Admin:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
