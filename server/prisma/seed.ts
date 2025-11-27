import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 データベースシーディング開始...');

  // ユーザーデータの作成
  console.log('👤 ユーザーデータ作成中...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const chef = await prisma.user.upsert({
    where: { username: 'chef' },
    update: {},
    create: {
      username: 'chef',
      email: 'chef@example.com',
      password: hashedPassword,
      role: UserRole.CHEF,
      isActive: true,
    },
  });

  const staff = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      email: 'staff@example.com',
      password: hashedPassword,
      role: UserRole.STAFF,
      isActive: true,
    },
  });

  console.log(`✅ ユーザー作成完了: ${admin.username}, ${chef.username}, ${staff.username}`);

  // カテゴリデータの作成
  console.log('📂 カテゴリデータ作成中...');
  const categories = [
    { name: '前菜', displayOrder: 1 },
    { name: 'メイン', displayOrder: 2 },
    { name: 'デザート', displayOrder: 3 },
    { name: '飲み物', displayOrder: 4 },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    createdCategories.push(category);
  }

  console.log(`✅ カテゴリ作成完了: ${createdCategories.length}件`);

  // メニューアイテムの作成
  console.log('🍽️  メニューアイテム作成中...');
  const menuItems = [
    // 前菜
    {
      categoryId: createdCategories[0].id,
      name: 'シーザーサラダ',
      description: '新鮮な野菜とパルメザンチーズのサラダ',
      price: 800,
      displayOrder: 1,
    },
    {
      categoryId: createdCategories[0].id,
      name: 'カプレーゼ',
      description: 'トマトとモッツァレラチーズのサラダ',
      price: 900,
      displayOrder: 2,
    },
    // メイン
    {
      categoryId: createdCategories[1].id,
      name: 'マルゲリータピザ',
      description: 'トマトソースとモッツァレラチーズのクラシックピザ',
      price: 1500,
      displayOrder: 1,
    },
    {
      categoryId: createdCategories[1].id,
      name: 'カルボナーラ',
      description: '濃厚なクリームソースのパスタ',
      price: 1300,
      displayOrder: 2,
    },
    {
      categoryId: createdCategories[1].id,
      name: 'グリルチキン',
      description: 'ハーブで味付けしたジューシーなチキン',
      price: 1800,
      displayOrder: 3,
    },
    // デザート
    {
      categoryId: createdCategories[2].id,
      name: 'ティラミス',
      description: 'イタリアンクラシックデザート',
      price: 600,
      displayOrder: 1,
    },
    {
      categoryId: createdCategories[2].id,
      name: 'パンナコッタ',
      description: 'なめらかなイタリアンプディング',
      price: 550,
      displayOrder: 2,
    },
    // 飲み物
    {
      categoryId: createdCategories[3].id,
      name: 'コーラ',
      description: '冷たいコカコーラ',
      price: 300,
      displayOrder: 1,
    },
    {
      categoryId: createdCategories[3].id,
      name: 'オレンジジュース',
      description: '100%フレッシュオレンジジュース',
      price: 400,
      displayOrder: 2,
    },
    {
      categoryId: createdCategories[3].id,
      name: 'コーヒー',
      description: '挽きたてコーヒー',
      price: 350,
      displayOrder: 3,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
  }

  console.log(`✅ メニューアイテム作成完了: ${menuItems.length}件`);

  // テーブルデータの作成
  console.log('🪑 テーブルデータ作成中...');
  const tables = [];
  for (let i = 1; i <= 10; i++) {
    const tableNumber = `T${i.toString().padStart(2, '0')}`;
    const table = await prisma.table.upsert({
      where: { number: tableNumber },
      update: {},
      create: {
        number: tableNumber,
        capacity: i <= 5 ? 4 : 6,
        qrCode: `QR-${tableNumber}-${Date.now()}`,
        isActive: true,
      },
    });
    tables.push(table);
  }

  console.log(`✅ テーブル作成完了: ${tables.length}件`);

  console.log('🎉 シーディング完了！');
}

main()
  .catch((e) => {
    console.error('❌ シーディングエラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
