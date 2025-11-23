# GitHub Copilot CLI への MCP 導入手順

## 📋 目次

1. [MCPとは](#mcpとは)
2. [前提条件](#前提条件)
3. [導入手順](#導入手順)
4. [MCP設定](#mcp設定)
5. [動作確認](#動作確認)
6. [トラブルシューティング](#トラブルシューティング)

---

## MCPとは

**MCP（Model Context Protocol）** は、AIアシスタントがローカルツールやサービスと連携するための標準プロトコルです。

### MCPの主な機能

| 機能 | 説明 | 用途例 |
|-----|------|-------|
| **Tools** | AI が実行できるツール群 | ファイル操作、Git操作、API呼び出し |
| **Resources** | AI がアクセスできるリソース | ローカルファイル、データベース、Webページ |
| **Prompts** | 再利用可能なプロンプトテンプレート | コード生成、レビュー、ドキュメント作成 |

### GitHub Copilot CLIでのMCPのメリット

✅ **ローカルツール統合**: Git、npm、Docker等を直接操作  
✅ **ファイルシステムアクセス**: プロジェクトファイルの読み書き  
✅ **カスタムツール追加**: 独自のスクリプトやAPIを連携  
✅ **再現性向上**: プロンプトテンプレートで一貫した出力  

---

## 前提条件

### 必須環境

| 項目 | 要件 | 確認コマンド |
|-----|------|------------|
| **Node.js** | v18.0.0以上 | `node --version` |
| **npm** | v9.0.0以上 | `npm --version` |
| **GitHub Copilot CLI** | 最新版 | `gh copilot --version` |
| **GitHub CLI** | v2.40.0以上 | `gh --version` |

### 確認コマンド

```bash
# すべての前提条件を確認
node --version && npm --version && gh --version && gh copilot --version
```

**期待される出力例**:
```
v20.10.0
10.2.3
gh version 2.40.0 (2024-01-15)
gh extension version: 1.0.0
```

---

## 導入手順

### Phase 1: GitHub CLIのインストール（未インストールの場合）

#### Windows

```powershell
# winget経由
winget install --id GitHub.cli

# または Chocolatey経由
choco install gh
```

#### macOS

```bash
brew install gh
```

#### Linux

```bash
# Debian/Ubuntu
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

---

### Phase 2: GitHub Copilot CLI 拡張機能のインストール

#### ステップ2-1: GitHub CLIにログイン

```bash
# GitHubアカウントにログイン
gh auth login
```

**対話形式の質問に回答**:
1. GitHub.com を選択
2. HTTPS を選択
3. Yes（認証情報を保存）
4. ブラウザで認証

#### ステップ2-2: Copilot CLI拡張機能をインストール

```bash
# Copilot CLI拡張機能をインストール
gh extension install github/gh-copilot

# インストール確認
gh copilot --version
```

**期待される出力**:
```
gh extension version: 1.0.0
```

---

### Phase 3: MCPサーバーのセットアップ

#### ステップ3-1: MCP設定ディレクトリの作成

```bash
# Windows
mkdir %USERPROFILE%\.github-copilot\mcp

# macOS/Linux
mkdir -p ~/.github-copilot/mcp
```

#### ステップ3-2: MCP設定ファイルの作成

**Windows**: `%USERPROFILE%\.github-copilot\mcp\config.json`  
**macOS/Linux**: `~/.github-copilot/mcp/config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/your/project"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://user:password@localhost:5432/database"
      ]
    }
  }
}
```

---

### Phase 4: MCP標準サーバーのインストール

GitHub公式が提供する標準MCPサーバーをインストールします。

#### 4-1: ファイルシステムサーバー

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

**機能**:
- ファイルの読み取り
- ファイルの書き込み
- ディレクトリ一覧取得
- ファイル検索

#### 4-2: GitHubサーバー

```bash
npm install -g @modelcontextprotocol/server-github
```

**機能**:
- リポジトリ情報取得
- Issue/PR管理
- コミット履歴取得
- コードレビュー

**GitHub Personal Access Token の取得**:
1. https://github.com/settings/tokens にアクセス
2. "Generate new token (classic)" をクリック
3. スコープを選択:
   - `repo` - リポジトリフルアクセス
   - `read:org` - 組織情報読み取り
4. トークンをコピーして環境変数に設定

```bash
# Windows
setx GITHUB_PERSONAL_ACCESS_TOKEN "your-token-here"

# macOS/Linux
echo 'export GITHUB_PERSONAL_ACCESS_TOKEN="your-token-here"' >> ~/.bashrc
source ~/.bashrc
```

#### 4-3: データベースサーバー（PostgreSQL）

```bash
npm install -g @modelcontextprotocol/server-postgres
```

**機能**:
- テーブル情報取得
- クエリ実行
- スキーマ情報取得

---

## MCP設定

### 本プロジェクト用の設定例

**ファイルパス**: `C:\Users\user\.github-copilot\mcp\config.json`（Windows）

```json
{
  "mcpServers": {
    "telbot-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\user\\gh\\telBotOrder"
      ],
      "description": "telBotOrderプロジェクトのファイルシステムアクセス"
    },
    "telbot-github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}",
        "GITHUB_OWNER": "okab130",
        "GITHUB_REPO": "telBotOrder"
      },
      "description": "telBotOrderリポジトリのGitHub操作"
    },
    "telbot-postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://telbot_user:telbot_password@localhost:5432/telbot_order"
      ],
      "description": "telBotOrderデータベースアクセス"
    }
  }
}
```

### 設定ファイルの検証

```bash
# 設定ファイルの文法チェック（JSON形式確認）
# Windows
type %USERPROFILE%\.github-copilot\mcp\config.json | jq .

# macOS/Linux
cat ~/.github-copilot/mcp/config.json | jq .
```

---

## 動作確認

### ステップ1: MCPサーバーの起動確認

```bash
# Copilot CLIでMCPサーバー一覧を表示
gh copilot mcp list
```

**期待される出力**:
```
MCP Servers:
  - telbot-filesystem (running)
  - telbot-github (running)
  - telbot-postgres (running)
```

### ステップ2: ファイルシステムアクセステスト

```bash
# Copilot CLIで質問
gh copilot suggest "プロジェクトルートにあるpackage.jsonの内容を教えて"
```

**期待される動作**:
- MCPファイルシステムサーバー経由でpackage.jsonを読み取り
- 内容を要約して回答

### ステップ3: GitHub連携テスト

```bash
gh copilot suggest "このリポジトリの最新コミットを教えて"
```

**期待される動作**:
- MCP GitHubサーバー経由でコミット履歴取得
- 最新コミットの情報を回答

### ステップ4: データベース連携テスト

```bash
gh copilot suggest "telbot_orderデータベースのテーブル一覧を教えて"
```

**期待される動作**:
- MCP PostgreSQLサーバー経由でテーブル情報取得
- テーブル一覧を回答

---

## カスタムMCPサーバーの作成

### 簡易的なカスタムサーバー例

**ファイル**: `custom-mcp-server.js`

```javascript
#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

// MCPサーバー初期化
const server = new Server(
  {
    name: 'custom-telbot-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// カスタムツールの定義
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'get_order_count',
        description: '本日の注文数を取得する',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// ツール実行ハンドラー
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'get_order_count') {
    // ダミーデータ（実際はデータベースから取得）
    return {
      content: [
        {
          type: 'text',
          text: '本日の注文数: 42件',
        },
      ],
    };
  }
});

// サーバー起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

### カスタムサーバーの登録

**config.jsonに追加**:

```json
{
  "mcpServers": {
    "telbot-custom": {
      "command": "node",
      "args": [
        "C:\\Users\\user\\gh\\telBotOrder\\mcp\\custom-mcp-server.js"
      ],
      "description": "telBotOrderカスタムツール"
    }
  }
}
```

---

## トラブルシューティング

### 問題1: MCPサーバーが起動しない

**症状**:
```
Error: MCP server 'telbot-filesystem' failed to start
```

**原因と解決策**:

| 原因 | 確認方法 | 解決策 |
|-----|---------|-------|
| パスが間違っている | `config.json`のパス確認 | 絶対パスに修正 |
| 権限不足 | ディレクトリのアクセス権確認 | 管理者権限で実行 |
| Node.js未インストール | `node --version` | Node.jsインストール |

**デバッグコマンド**:
```bash
# MCPサーバーを直接起動してエラー確認
npx -y @modelcontextprotocol/server-filesystem C:\Users\user\gh\telBotOrder
```

### 問題2: GitHub Personal Access Tokenエラー

**症状**:
```
Error: GitHub API authentication failed
```

**解決策**:
```bash
# トークンが正しく設定されているか確認
echo $GITHUB_PERSONAL_ACCESS_TOKEN

# 再設定
export GITHUB_PERSONAL_ACCESS_TOKEN="your-new-token"
```

### 問題3: データベース接続エラー

**症状**:
```
Error: Connection to PostgreSQL failed
```

**確認項目**:
```bash
# PostgreSQLが起動しているか確認
docker compose ps

# 接続文字列が正しいか確認
psql postgresql://telbot_user:telbot_password@localhost:5432/telbot_order
```

### 問題4: Windows環境でのパス問題

**症状**:
```
Error: Cannot find module 'C:Usersuser...'
```

**解決策**:
- バックスラッシュをダブルエスケープ: `C:\\Users\\user\\...`
- またはスラッシュ使用: `C:/Users/user/...`

---

## 推奨MCP設定（本プロジェクト用）

### 最小構成（開発初期）

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/Users/user/gh/telBotOrder"]
    }
  }
}
```

### フル構成（本格開発時）

```json
{
  "mcpServers": {
    "telbot-filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/Users/user/gh/telBotOrder"]
    },
    "telbot-github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}",
        "GITHUB_OWNER": "okab130",
        "GITHUB_REPO": "telBotOrder"
      }
    },
    "telbot-postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://telbot_user:telbot_password@localhost:5432/telbot_order"]
    },
    "telbot-git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "C:/Users/user/gh/telBotOrder"]
    }
  }
}
```

---

## MCPを活用したCopilot CLI使用例

### 例1: プロジェクト構造の分析

```bash
gh copilot suggest "このプロジェクトのディレクトリ構造を分析して、モノレポ構成の特徴を教えて"
```

**Copilotの動作**:
1. MCP filesystemサーバーでディレクトリ一覧取得
2. package.json、turbo.jsonを読み取り
3. ワークスペース構成を分析
4. 結果を回答

### 例2: 最近のコミット確認

```bash
gh copilot suggest "直近10件のコミットメッセージを確認して、何が実装されたか教えて"
```

**Copilotの動作**:
1. MCP GitHubサーバーでコミット履歴取得
2. コミットメッセージを解析
3. 実装内容を要約

### 例3: データベーススキーマ確認

```bash
gh copilot suggest "データベースのOrderテーブルの定義を教えて"
```

**Copilotの動作**:
1. MCP PostgreSQLサーバーでテーブル定義取得
2. カラム情報、制約を確認
3. スキーマを説明

---

## 参考リンク

- [MCP公式ドキュメント](https://modelcontextprotocol.io/)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [カスタムサーバー開発ガイド](https://modelcontextprotocol.io/docs/server-development)

---

## まとめ

### MCP導入の手順

1. ✅ GitHub CLI + Copilot CLI 拡張機能インストール
2. ✅ MCP設定ディレクトリ作成
3. ✅ config.json作成
4. ✅ 標準MCPサーバーインストール
5. ✅ 動作確認

### 導入後のメリット

- 📂 プロジェクトファイルへの直接アクセス
- 🔗 GitHub API連携
- 🗄️ データベース操作
- 🛠️ カスタムツール追加

### 次のステップ

1. 基本的なMCP設定で開発開始
2. 必要に応じてカスタムツール追加
3. プロンプトテンプレート活用

**作成日**: 2025-11-23  
**対象**: GitHub Copilot CLI + MCP  
**バージョン**: 1.0
