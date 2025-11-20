# アプリケーション個別README

## 🤖 Telegram Bot (apps/bot)

### 概要
Grammy.jsを使用したTelegram Bot。QRコード生成、注文確認、店員呼び出しなどの機能を提供。

### 環境変数
```env
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_MINI_APP_URL=https://your-mini-app-url.com
API_URL=http://localhost:4000
NODE_ENV=development
```

### コマンド一覧
- `/start` - Bot開始、ウェルカムメッセージ
- `/help` - ヘルプ表示（コールバック）
- `/genqr <テーブル番号>` - QRコード生成（管理者用）
- `/orders` - 注文状況確認
- `/call` - 店員呼び出し

### 開発
```bash
npm run dev    # 開発モード（tsx watch）
npm run build  # ビルド
npm start      # 本番起動
npm test       # テスト実行
```

---

## 📱 顧客向けアプリ (apps/customer-app)

### 概要
Telegram Mini Apps用のReactアプリケーション。モバイルオーダー機能を提供。

### ページ構成
- `/` - セッション開始
- `/menu` - メニュー一覧
- `/product/:id` - 商品詳細
- `/cart` - カート
- `/orders` - 注文履歴

### 状態管理（Zustand）
- `sessionStore` - セッション情報（sessionId, tableId, partySize）
- `cartStore` - カート情報（items, 追加/削除/更新）

### 環境変数
```env
VITE_API_URL=http://localhost:4000
```

### 開発
```bash
npm run dev     # 開発サーバー（ポート5173）
npm run build   # ビルド
npm run preview # ビルド版プレビュー
npm test        # テスト実行
```

### カスタマイズポイント
- `src/lib/api.ts` - APIエンドポイント定義
- `src/store/` - 状態管理ロジック
- `src/pages/` - 各ページコンポーネント

---

## 🖥️ 管理画面 (apps/admin-web)

### 概要
Next.js 14（App Router）を使用した管理画面。注文管理、メニュー管理など。

### ページ構成
- `/` - ホームページ
- `/dashboard` - ダッシュボード（予定）
- `/orders` - 注文管理
- `/menu` - メニュー管理（予定）
- `/tables` - テーブル管理（予定）

### 環境変数
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 開発
```bash
npm run dev   # 開発サーバー（ポート3000）
npm run build # ビルド
npm start     # 本番起動
npm test      # テスト実行
```

### 実装予定機能
- [ ] NextAuth.js認証
- [ ] メニュー管理（CRUD）
- [ ] 画像アップロード
- [ ] テーブル管理
- [ ] 売上レポート
- [ ] ユーザー管理

---

## 🧪 テスト

### カバレッジ
- `apps/customer-app/tests/cartStore.test.ts` - カートストアのユニットテスト
- `apps/bot/tests/bot.test.ts` - Bot基本テスト

### テスト実行
```bash
# 個別実行
cd apps/customer-app && npm test
cd apps/bot && npm test

# ルートから一括実行
npm test
```

### テスト追加方法
1. `tests/`ディレクトリに`*.test.ts`ファイル作成
2. Vitestのdescribe/it/expectを使用
3. `npm test`で実行

---

## 📦 ビルド・デプロイ

### 本番ビルド
```bash
# ルートから一括ビルド
npm run build

# 個別ビルド
cd apps/customer-app && npm run build
cd apps/admin-web && npm run build
cd apps/bot && npm run build
```

### デプロイ先候補
- **Bot**: Railway, Render, VPS
- **Customer App**: Vercel, Netlify, Cloudflare Pages
- **Admin Web**: Vercel, Netlify
- **Server**: Railway, Render, DigitalOcean

### 環境変数設定（本番）
各プラットフォームの環境変数設定画面で以下を設定:
- `TELEGRAM_BOT_TOKEN`
- `DATABASE_URL`
- `JWT_SECRET`
- `API_URL`
- `NEXTAUTH_SECRET`

---

## 🔧 トラブルシューティング

### よくある問題

**Q: npm installが失敗する**
A: Node.js 20以上が必要です。`node -v`で確認してください。

**Q: Vitestが動かない**
A: vitest.config.tsが正しく設定されているか確認してください。

**Q: Telegram Mini Appが開かない**
A: `@twa-dev/sdk`のインストールと、index.htmlのscriptタグを確認してください。

**Q: APIリクエストが失敗する**
A: 環境変数`VITE_API_URL`または`NEXT_PUBLIC_API_URL`が正しく設定されているか確認してください。

### デバッグ方法
1. ブラウザのDevToolsでコンソールログ確認
2. Networkタブでリクエスト/レスポンス確認
3. React DevToolsでコンポーネント状態確認
4. TanStack Query DevToolsでクエリ状態確認

---

## 📚 参考リンク

### ドキュメント
- [Grammy.js](https://grammy.dev/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Vite](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)

### チュートリアル
- [Telegram Bot作成](https://core.telegram.org/bots/tutorial)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Vitest](https://vitest.dev/guide/)
