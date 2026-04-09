# 歩活アプリ

毎日歩いてポイントを貯めるウォーキングアプリ

## 機能

### ユーザー機能
- ユーザー登録・ログイン（Face ID / Touch ID対応）
- 自動歩行記録（GPS位置情報、100mごとにポイント獲得）
- 移動手段判定（徒歩・車・電車・飛行機）
- 毎日ガチャ（レアリティ別演出）
- イベント参加
- チェックポイント自動検出（半径100m）
- グループチャット
- プロフィール設定（アイコン画像）
- ランキング表示（黒板風デザイン）

### 管理者機能（招待コード: 0325）
- ユーザー管理（全ユーザー表示・削除）
- イベント作成・編集・削除
- チェックポイント設定（最大10個）
- Google Mapsリンクから座標自動取得
- ボーナスポイント設定
- 参加者管理
- グループチャット管理
- 新着通知

## 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **認証**: Web Authentication API (Face ID / Touch ID)
- **ホスティング**: AWS Amplify Hosting

## セットアップ手順

### 1. Supabaseプロジェクト作成

1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. 新しいプロジェクトを作成
4. プロジェクト名、データベースパスワードを設定
5. リージョンを選択（Tokyo推奨）

### 2. データベーステーブル作成

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `supabase-schema.sql`の内容をコピー＆ペースト
3. 「Run」をクリックしてテーブルを作成

### 3. 環境変数設定

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の値をコピー：
   - Project URL
   - anon public key

3. AWS Amplifyコンソールで環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon public key

### 4. デプロイ

1. GitHubにプッシュ
```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

2. AWS Amplifyが自動的に再デプロイ

## ローカル開発

1. `.env.local`ファイルを作成
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. 開発サーバー起動
```bash
npm install
npm run dev
```

http://localhost:3002 でアクセス

## データベース構造

### users テーブル
- id (UUID)
- username (TEXT, UNIQUE)
- password (TEXT)
- is_admin (BOOLEAN)
- walking_points (INTEGER)
- gacha_points (INTEGER)
- avatar (TEXT)
- created_at (TIMESTAMP)

### walk_records テーブル
- id (UUID)
- user_id (UUID)
- distance (INTEGER)
- points (INTEGER)
- location (TEXT)
- type (TEXT)
- path (JSONB)
- created_at (TIMESTAMP)

### events テーブル
- id (UUID)
- title (TEXT)
- description (TEXT)
- date (TEXT)
- time (TEXT)
- bonus_points (INTEGER)
- checkpoints (JSONB)
- participants (JSONB)
- created_at (TIMESTAMP)

### chat_messages テーブル
- id (UUID)
- event_id (UUID)
- user_id (UUID)
- username (TEXT)
- message (TEXT)
- is_admin (BOOLEAN)
- created_at (TIMESTAMP)

## 注意事項

- 位置情報の許可が必要です
- HTTPSが必要です（生体認証のため）
- パスワードは本番環境でハッシュ化を推奨
- Supabaseの無料プランは500MBまで

## ライセンス

Private
