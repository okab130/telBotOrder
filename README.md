# Telegram モバイルオーダーシステム

飲食店向けTelegramベースのモバイルオーダーシステム。QRコードスキャンからテーブルごとの注文管理まで一貫して対応。

## 📋 概要

お客様はテーブルのQRコードをスキャンし、Telegram Mini Appsでメニューを閲覧・注文。
店舗スタッフはWeb管理画面でリアルタイムに注文を確認・処理し、効率的な店舗運営を実現。

## ✨ 主な機能

### 顧客向け（Telegram Mini Apps）
- 🔍 QRコードスキャンでセッション開始
- 📱 カテゴリ別メニュー閲覧（画像付き）
- 🛒 カート機能・追加注文
- 📝 注文履歴確認（自分/全員）
- 🔔 店員呼び出し機能
- 💳 会計依頼
- 🔎 商品検索

### 店舗管理画面（Web）
- 📊 ダッシュボード（売上・注文状況）
- 🍳 注文管理（リアルタイム更新）
- 📝 メニュー管理（画像アップロード）
- 🗂️ カテゴリ管理
- 🪑 テーブル管理（QRコード生成）
- 🔔 店員呼び出し対応
- 💳 会計処理・セッション管理
- 📈 売上レポート・ランキング
- 👥 ユーザー管理

### Telegram Bot
- 🤖 QRコード生成
- 📢 注文通知
- 🔔 店員呼び出し通知

## 🛠 技術スタック

### フロントエンド
- **顧客向け**: React 18 + TypeScript + Vite + Tailwind CSS
- **管理画面**: Next.js 14 + TypeScript + shadcn/ui
- **状態管理**: Zustand
- **データ取得**: TanStack Query v5
- **Telegram SDK**: @twa-dev/sdk

### バックエンド
- **ランタイム**: Node.js 20
- **フレームワーク**: Express.js + TypeScript
- **データベース**: PostgreSQL 16
- **ORM**: Prisma 5
- **リアルタイム**: Socket.IO 4
- **認証**: JWT + NextAuth.js
- **バリデーション**: Zod

### Bot
- **フレームワーク**: Grammy.js

### インフラ
- **コンテナ**: Docker + Docker Compose
- **オブジェクトストレージ**: MinIO (開発) / S3 (本番)
- **監視**: Sentry

## 📁 プロジェクト構成

```
telBotOrder/
├── apps/
│   ├── customer-app/          # 顧客向けTelegram Mini Apps
│   ├── admin-web/             # 管理画面
│   └── bot/                   # Telegram Bot
├── packages/
│   ├── api-client/            # API型定義共有
│   ├── database/              # Prismaスキーマ
│   └── shared/                # 共通ユーティリティ
├── server/                    # バックエンドAPI
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── middlewares/
│   └── prisma/
├── docker/                    # Docker設定
├── 画面モック/                # HTMLモック（22画面）
└── docs/                      # 設計ドキュメント
```

## 🚀 セットアップ

### 前提条件
- Node.js 20+
- pnpm 8+
- Docker Desktop
- PostgreSQL 16
- Telegram Bot Token

### 1. リポジトリクローン

```bash
git clone <repository-url>
cd telBotOrder
```

### 2. 依存パッケージインストール

```bash
pnpm install
```

### 3. 環境変数設定

```bash
# .env.example をコピー
cp .env.example .env

# 必要な値を設定
# - DATABASE_URL
# - JWT_SECRET
# - TELEGRAM_BOT_TOKEN
# - TELEGRAM_MINI_APP_URL
# など
```

### 4. データベースセットアップ

```bash
# Dockerコンテナ起動
docker-compose up -d

# マイグレーション実行
cd server
pnpm prisma migrate dev

# シードデータ投入
pnpm prisma db seed
```

### 5. 開発サーバー起動

```bash
# すべてのアプリを起動（Turborepo）
pnpm dev

# または個別に起動
cd apps/customer-app && pnpm dev  # http://localhost:5173
cd apps/admin-web && pnpm dev     # http://localhost:3000
cd apps/bot && pnpm dev           # Telegram Bot
cd server && pnpm dev             # http://localhost:4000
```

## 🧪 テスト

```bash
# ユニットテスト
pnpm test

# E2Eテスト
pnpm test:e2e

# カバレッジ
pnpm test:coverage
```

## 📖 ドキュメント

- [要件定義](./youken.md)
- [データモデル](./data_model.md)
- [機能概要](./機能概要.md)
- [機能詳細設計](./機能詳細設計.md)
- [画面一覧](./画面一覧.md)
- [画面詳細設計](./画面詳細設計.md)
- [技術スタック選定](./技術スタック選定.md)
- [API仕様書](./docs/api-specs.md)

## 🎨 画面モック

`画面モック/` ディレクトリに全22画面のHTMLモックあり。

- **顧客向け**: 9画面（C-S01〜C-S09）
- **管理画面**: 13画面（A-S01〜A-S13）

```bash
# ブラウザで閲覧
start 画面モック/C-S01_セッション開始.html
```

## 🔒 セキュリティ

- HTTPS必須
- JWT認証
- レート制限
- CORS設定
- SQL インジェクション対策（Prisma）
- XSS対策（DOMPurify）
- CSRF対策（SameSite Cookie）

## 📊 監視・ログ

- エラートラッキング: Sentry
- 構造化ログ: Winston
- パフォーマンス監視: Vercel Analytics

## 🌐 デプロイ

### 開発環境
- Docker Compose

### 本番環境
- **フロントエンド**: Vercel / Cloudflare Pages
- **バックエンド**: Railway / Render
- **データベース**: Supabase / Neon
- **ストレージ**: AWS S3 / Cloudflare R2

```bash
# ビルド
pnpm build

# 本番起動
pnpm start
```

## 🤝 コントリビューション

1. フォーク
2. フィーチャーブランチ作成 (`git checkout -b feature/amazing-feature`)
3. コミット (`git commit -m 'feat: Add amazing feature'`)
4. プッシュ (`git push origin feature/amazing-feature`)
5. プルリクエスト作成

## 📝 ライセンス

MIT License

## 👥 チーム

- プロジェクトオーナー: [Your Name]
- 開発: [Your Team]

## 📞 サポート

- Issues: [GitHub Issues](link)
- Email: support@example.com

## 🗺️ ロードマップ

### Phase 1: MVP ✅
- [x] 要件定義
- [x] データモデル設計
- [x] 画面設計・モック作成
- [ ] 基本機能実装
  - [ ] 注文フロー
  - [ ] 管理画面（注文・メニュー管理）
  - [ ] Telegram Bot

### Phase 2: 機能拡張
- [ ] 店員呼び出し
- [ ] 会計機能
- [ ] 売上管理

### Phase 3: 最適化
- [ ] パフォーマンス改善
- [ ] UX改善
- [ ] テストカバレッジ向上

### Phase 4: 本番リリース
- [ ] セキュリティ監査
- [ ] 負荷テスト
- [ ] ドキュメント整備
- [ ] 本番デプロイ

## 🙏 謝辞

- Telegram Mini Apps
- shadcn/ui
- Prisma
- Next.js

---

Made with ❤️ for better restaurant operations
