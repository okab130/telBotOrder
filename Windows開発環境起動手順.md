# 開発サーバー起動手順（Windows）

Windowsでの開発環境では、Turboのワークスペース一括起動に問題があるため、各アプリケーションを個別に起動します。

## 前提条件

1. Docker環境が起動していること
2. `npm install`が完了していること

## 起動手順

### 1. サーバー（APIサーバー）

**新しいPowerShellウィンドウ1**を開いて実行：

```powershell
chcp 65001
cd C:\Users\user\gh\telBotOrder\server
npx tsx watch src/index.ts
```

起動確認: `http://localhost:4000`

### 2. Telegram Bot

**新しいPowerShellウィンドウ2**を開いて実行：

```powershell
chcp 65001
cd C:\Users\user\gh\telBotOrder\apps\bot
npx tsx watch src/index.ts
```

### 3. 顧客向けアプリ（Customer App）

**新しいPowerShellウィンドウ3**を開いて実行：

```powershell
chcp 65001
cd C:\Users\user\gh\telBotOrder\apps\customer-app
vite
```

**注意**: viteがコマンドとして認識されない場合は、グローバルインストール：
```powershell
npm install -g vite
```

起動確認: `http://localhost:5173`

### 4. 管理画面（Admin Web）

**新しいPowerShellウィンドウ4**を開いて実行：

```powershell
chcp 65001
cd C:\Users\user\gh\telBotOrder\apps\admin-web
npx next dev -p 3000
```

起動確認: `http://localhost:3000`

## 各サービスのURL

| サービス | URL |
|---------|-----|
| APIサーバー | http://localhost:4000 |
| 顧客アプリ | http://localhost:5173 |
| 管理画面 | http://localhost:3000 |
| Bot | （Webhook経由） |

## トラブルシューティング

### エラー: 'tsx' is not recognized

**解決策**:
```powershell
npm install -g tsx
```

または、各ディレクトリで：
```powershell
npm install tsx --save-dev
```

### エラー: 'vite' is not recognized

**解決策**:
```powershell
cd C:\Users\user\gh\telBotOrder
npm install -D vite @vitejs/plugin-react
```

### エラー: 'next' is not recognized

**解決策**:
```powershell
cd C:\Users\user\gh\telBotOrder\apps\admin-web
npm install next react react-dom
```

### ポートが既に使用されている

**解決策**:
```powershell
# ポートを使用しているプロセスを確認
netstat -ano | findstr :4000

# プロセスIDを確認してタスクを終了
taskkill /PID <プロセスID> /F
```

## 注意事項

- 各PowerShellウィンドウの最初に `chcp 65001` を実行してUTF-8エンコーディングを設定
- すべてのサービスを停止する場合は、各PowerShellウィンドウで `Ctrl+C` を押す
- Docker環境（PostgreSQL, Redis, MinIO）は別途起動が必要

## Docker環境起動

開発サーバー起動前に、Dockerコンテナを起動：

```powershell
cd C:\Users\user\gh\telBotOrder
docker-compose up -d
```

確認：
```powershell
docker-compose ps
```

停止：
```powershell
docker-compose down
```
