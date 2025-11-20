# 🚀 クイックスタートガイド

このガイドに従って、Telegramモバイルオーダーシステムを起動できます。

## 📋 前提条件

- Node.js 20.x以上
- npm 10.x以上
- Docker & Docker Compose
- Telegram Bot Token（BotFatherから取得）

## ⚡ 5分で起動

### Step 1: リポジトリクローン
```bash
git clone <your-repo>
cd telBotOrder
```

### Step 2: 依存関係インストール
```bash
npm install
```

### Step 3: Docker起動（データベース等）
```bash
docker-compose up -d
```

### Step 4: 環境変数設定
```bash
# ルート
cp .env.example .env

# Bot
cd apps/bot
cp .env.example .env
# TELEGRAM_BOT_TOKENを設定
cd ../..

# 顧客アプリ
cd apps/customer-app
cp .env.example .env
cd ../..

# 管理画面
cd apps/admin-web
cp .env.example .env
cd ../..
```

### Step 5: データベースセットアップ
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # シードデータ投入
cd ..
```

### Step 6: アプリケーション起動

**Terminal 1: サーバー**
```bash
cd server
npm run dev
# → http://localhost:4000/health
```

**Terminal 2: Bot**
```bash
cd apps/bot
npm install
npm run dev
# → Bot起動確認
```

**Terminal 3: 顧客アプリ**
```bash
cd apps/customer-app
npm install
npm run dev
# → http://localhost:5173
```

**Terminal 4: 管理画面**
```bash
cd apps/admin-web
npm install
npm run dev
# → http://localhost:3000
```

## 🧪 動作確認

### 1. サーバーヘルスチェック
```bash
curl http://localhost:4000/health
# 期待: {"status":"ok"}
```

### 2. 顧客アプリアクセス
ブラウザで `http://localhost:5173` を開く

### 3. 管理画面アクセス
ブラウザで `http://localhost:3000` を開く

### 4. Bot確認
Telegramで自分のBotに `/start` を送信

## 🐛 トラブルシューティング

### ポートが使用中
```bash
# 既存プロセスを確認
netstat -ano | findstr :4000
netstat -ano | findstr :5173
netstat -ano | findstr :3000

# プロセスを終了
taskkill /PID <PID> /F
```

### Docker起動エラー
```bash
# Dockerサービス確認
docker ps

# コンテナログ確認
docker-compose logs postgres
docker-compose logs minio
docker-compose logs redis
```

### npm installエラー
```bash
# キャッシュクリア
npm cache clean --force

# node_modules削除して再インストール
rm -rf node_modules
npm install
```

### Prisma関連エラー
```bash
cd server
npx prisma generate
npx prisma migrate reset --force
npx prisma db seed
```

## 📱 Telegram Mini App設定

### BotFatherでの設定
1. `/newbot` でBot作成
2. Bot Tokenをコピー
3. `/newapp` でMini App作成
4. URLに `https://your-domain.com` を設定（開発時は `ngrok` 使用）

### ngrok使用（ローカル開発）
```bash
# ngrokインストール
npm install -g ngrok

# 顧客アプリを公開
ngrok http 5173

# 表示されたURLをBotFatherのMini App URLに設定
```

## 🔐 環境変数チェックリスト

### 必須項目
- [ ] `TELEGRAM_BOT_TOKEN` - BotFatherから取得
- [ ] `DATABASE_URL` - PostgreSQL接続文字列
- [ ] `JWT_SECRET` - ランダムな文字列（本番環境）
- [ ] `NEXTAUTH_SECRET` - ランダムな文字列（本番環境）

### オプション
- [ ] `MINIO_ACCESS_KEY` - 画像保存用（開発環境）
- [ ] `AWS_S3_BUCKET` - 画像保存用（本番環境）
- [ ] `SENTRY_DSN` - エラートラッキング

## 📚 次に読むべきドキュメント

1. `IMPLEMENTATION_README.md` - 詳細な実装ガイド
2. `apps/README.md` - 各アプリケーションの個別ガイド
3. `IMPLEMENTATION_SUMMARY.md` - 実装完了サマリー
4. `実装ガイド.md` - サーバーサイド実装ガイド

## 💡 開発のヒント

### ホットリロード
すべてのアプリケーションはホットリロードに対応しています。
ファイルを編集すると自動で再読み込みされます。

### デバッグ
- Chrome DevTools - フロントエンド
- VS Code Debugger - サーバーサイド
- `console.log()` - Bot

### テスト実行
```bash
# 全テスト
npm test

# 個別
cd apps/customer-app && npm test
cd apps/bot && npm test
```

## 🎯 本番デプロイ前チェックリスト

- [ ] 環境変数を本番用に更新
- [ ] `NODE_ENV=production` 設定
- [ ] セキュリティキーを変更（JWT_SECRET等）
- [ ] CORS設定を確認
- [ ] HTTPSを有効化
- [ ] データベースバックアップ設定
- [ ] エラートラッキング設定（Sentry等）
- [ ] ロギング設定確認

---

**問題が解決しない場合:**
- GitHub Issuesで質問
- ドキュメントを再確認
- ログファイルを確認
