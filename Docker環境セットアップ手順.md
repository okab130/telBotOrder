# Docker環境セットアップ手順

## 📋 目次

1. [現状確認](#現状確認)
2. [Docker Desktopのインストール（推奨）](#docker-desktopのインストール推奨)
3. [代替オプション](#代替オプション)
4. [Docker起動後の手順](#docker起動後の手順)
5. [トラブルシューティング](#トラブルシューティング)

---

## 現状確認

現在、以下のコマンドでエラーが発生しています：

```bash
docker-compose up -d
```

**エラー原因**: Dockerがインストールされていません。

---

## Docker Desktopのインストール（推奨）

### ステップ1: Docker Desktopをダウンロード

1. **公式サイトにアクセス**
   - URL: https://www.docker.com/products/docker-desktop/

2. **Windows版をダウンロード**
   - 「Download for Windows」ボタンをクリック
   - `Docker Desktop Installer.exe` がダウンロードされます

### ステップ2: インストール

1. **インストーラーを実行**
   ```
   Docker Desktop Installer.exe をダブルクリック
   ```

2. **インストールオプション**
   - ☑ Use WSL 2 instead of Hyper-V (recommended)
   - ☑ Add shortcut to desktop
   - 「OK」をクリック

3. **インストール完了**
   - 「Close and restart」をクリック
   - **Windowsを再起動してください**

### ステップ3: Docker Desktopを起動

1. **アプリケーションを起動**
   - デスクトップの「Docker Desktop」アイコンをダブルクリック
   - または、スタートメニューから「Docker Desktop」を検索

2. **初回起動設定**
   - 利用規約に同意
   - Docker Hubアカウントは不要（スキップ可能）

3. **起動確認**
   - 画面左下が緑色の「Engine running」になればOK

### ステップ4: 動作確認

PowerShellまたはコマンドプロンプトで以下を実行：

```bash
# Dockerバージョン確認
docker --version
# 出力例: Docker version 24.0.7, build afdd53b

# Docker Composeバージョン確認
docker compose version
# 出力例: Docker Compose version v2.23.3-desktop.2
```

### ステップ5: プロジェクトのDocker起動

```bash
# プロジェクトディレクトリに移動
cd C:\Users\user\gh\telBotOrder

# Dockerコンテナを起動
docker compose up -d

# 起動確認
docker compose ps
```

**期待される出力:**
```
NAME                 IMAGE                  STATUS
telbot-postgres      postgres:16-alpine     Up
telbot-minio         minio/minio:latest     Up
telbot-redis         redis:7-alpine         Up
telbot-adminer       adminer:latest         Up
```

---

## 代替オプション

Docker Desktopをインストールしたくない場合の選択肢です。

### オプションA: ローカルインストール（Chocolatey使用）

**前提条件**: Chocolateyがインストール済み
- 未インストールの場合: https://chocolatey.org/install

```bash
# PostgreSQLインストール
choco install postgresql -y

# Redisインストール
choco install redis-64 -y

# サービス起動
# PostgreSQL: 自動起動（Windows サービス）
# Redis: 自動起動（Windows サービス）
```

**接続情報**:
```env
# PostgreSQL
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/telbot_order

# Redis
REDIS_URL=redis://localhost:6379
```

### オプションB: 手動インストール

#### PostgreSQL

1. **ダウンロード**
   - URL: https://www.postgresql.org/download/windows/
   - EnterpriseDB版を推奨

2. **インストール**
   - インストーラーを実行
   - パスワードを設定（例: `postgres`）
   - ポート: `5432`（デフォルト）

3. **データベース作成**
   ```sql
   -- pgAdmin または psql で実行
   CREATE USER telbot_user WITH PASSWORD 'telbot_password';
   CREATE DATABASE telbot_order OWNER telbot_user;
   ```

#### Redis（Windows版）

1. **ダウンロード**
   - URL: https://github.com/microsoftarchive/redis/releases
   - `Redis-x64-3.0.504.msi` をダウンロード

2. **インストール**
   - インストーラーを実行
   - デフォルト設定でOK

3. **サービス確認**
   ```bash
   redis-cli ping
   # 出力: PONG
   ```

### オプションC: クラウドサービス（開発環境）

完全に無料枠で始められるクラウドサービスを使用：

#### 1. Supabase（PostgreSQL）

- URL: https://supabase.com/
- 無料枠: 500MB、2つのプロジェクト

**手順**:
1. アカウント作成
2. 新規プロジェクトを作成
3. 接続文字列を `.env` にコピー

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

#### 2. Upstash（Redis）

- URL: https://upstash.com/
- 無料枠: 10,000コマンド/日

**手順**:
1. アカウント作成
2. Redis データベースを作成
3. 接続文字列を `.env` にコピー

```env
REDIS_URL=rediss://default:[PASSWORD]@[HOST]:6379
```

#### 3. Cloudflare R2（MinIO代替）

- URL: https://www.cloudflare.com/ja-jp/developer-platform/r2/
- 無料枠: 10GB/月

**手順**:
1. Cloudflareアカウント作成
2. R2バケットを作成
3. API認証情報を取得

```env
S3_ENDPOINT=https://[ACCOUNT_ID].r2.cloudflarestorage.com
S3_ACCESS_KEY=[ACCESS_KEY]
S3_SECRET_KEY=[SECRET_KEY]
S3_BUCKET=[BUCKET_NAME]
```

---

## Docker起動後の手順

Dockerが起動したら、以下の手順で開発環境をセットアップします。

### 1. 依存パッケージのインストール

```bash
# プロジェクトルートで実行
cd C:\Users\user\gh\telBotOrder
npm install

# サーバー側のパッケージ
cd server
npm install
```

### 2. 環境変数の設定

```bash
# .env.example をコピー
cp .env.example .env

# .env を編集（必要に応じて）
notepad .env
```

**基本的な `.env` の内容**:
```env
# Database
DATABASE_URL=postgresql://telbot_user:telbot_password@localhost:5432/telbot_order

# Redis
REDIS_URL=redis://localhost:6379

# MinIO / S3
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=telbot-uploads
S3_REGION=us-east-1

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Telegram
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_BOT_USERNAME=your-bot-username

# Server
NODE_ENV=development
PORT=3000
```

### 3. データベースのセットアップ

```bash
cd server

# Prisma クライアント生成
npm run prisma:generate

# マイグレーション実行
npm run prisma:migrate

# 初期データ投入（オプション）
npm run prisma:seed
```

### 4. 開発サーバー起動

```bash
# サーバー起動
npm run dev
```

**アクセス確認**:
- API: http://localhost:3000
- Adminer（DB管理）: http://localhost:8080
- MinIO Console: http://localhost:9001

---

## トラブルシューティング

### Docker Desktopが起動しない

**症状**: 「Docker Desktop starting...」のまま進まない

**解決策**:
1. WSL 2を有効化
   ```powershell
   # PowerShellを管理者権限で実行
   wsl --install
   wsl --set-default-version 2
   ```

2. Windowsの機能を有効化
   - コントロールパネル → プログラム → Windowsの機能の有効化または無効化
   - ☑ Hyper-V
   - ☑ Windows Subsystem for Linux
   - ☑ 仮想マシンプラットフォーム

3. BIOSで仮想化を有効化
   - 再起動 → BIOSに入る（F2, Del, F10など）
   - Virtualization Technology を有効化

### ポート競合エラー

**症状**: `Error: port is already allocated`

**解決策**:
```bash
# 使用中のプロセスを確認
netstat -ano | findstr :5432

# プロセスを終了
taskkill /PID [プロセスID] /F

# または、docker-compose.yml のポート番号を変更
# ports:
#   - "5433:5432"  # ホスト側を5433に変更
```

### Docker Composeコマンドが見つからない

**症状**: `docker-compose: command not found`

**解決策**:
新しいバージョンのDockerでは、`docker-compose` → `docker compose`（スペース）に変更されています。

```bash
# 古い形式（v1）
docker-compose up -d

# 新しい形式（v2）- 推奨
docker compose up -d
```

### Dockerコンテナが起動しない

**確認コマンド**:
```bash
# ログ確認
docker compose logs

# 特定のサービスのログ
docker compose logs postgres

# コンテナ状態確認
docker compose ps -a
```

**よくある原因**:
1. メモリ不足
   - Docker Desktop → Settings → Resources → Memory を増やす

2. ディスク容量不足
   ```bash
   # 不要なイメージ・コンテナを削除
   docker system prune -a
   ```

### データベース接続エラー

**症状**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**解決策**:
1. Dockerコンテナが起動しているか確認
   ```bash
   docker compose ps
   ```

2. PostgreSQLの起動を待つ
   ```bash
   # コンテナのログを確認
   docker compose logs postgres
   # "database system is ready to accept connections" が表示されればOK
   ```

3. 接続情報を確認
   - ホスト: `localhost` または `127.0.0.1`
   - ポート: `5432`
   - ユーザー: `telbot_user`
   - パスワード: `telbot_password`
   - データベース: `telbot_order`

---

## 次のステップ

✅ Dockerセットアップ完了後：

1. **`実装ガイド.md`** を参照して実装開始
2. **`PROJECT_SUMMARY.md`** でプロジェクト全体を把握
3. **`実装完了サマリー.md`** で進捗管理

---

## 参考リンク

- [Docker Desktop公式ドキュメント](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/)
- [WSL 2セットアップガイド](https://learn.microsoft.com/ja-jp/windows/wsl/install)
- [PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/)
- [Redis公式ドキュメント](https://redis.io/docs/)

---

**作成日**: 2025-11-20  
**対象プロジェクト**: telBotOrder  
**バージョン**: 1.0
