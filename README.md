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
- **バックエンド**: AWS Amplify Gen 2
- **データベース**: Amazon DynamoDB
- **API**: GraphQL (AWS AppSync)
- **認証**: Web Authentication API (Face ID / Touch ID)
- **ホスティング**: AWS Amplify Hosting

## デプロイ手順

### AWS Amplifyでデプロイ

1. **GitHubリポジトリと連携**
   - https://console.aws.amazon.com/amplify にアクセス
   - 「新しいアプリ」→「ホストウェブアプリ」を選択
   - GitHubを選択して認証
   - リポジトリ: `kamo6314-wq/walking-app`
   - ブランチ: `main`

2. **ビルド設定**
   - `amplify.yml`が自動検出されます
   - バックエンド（DynamoDB、GraphQL API）も自動デプロイされます
   - そのまま「次へ」

3. **デプロイ実行**
   - 「保存してデプロイ」をクリック
   - 以下が自動実行されます：
     - バックエンドリソース作成（DynamoDB テーブル、GraphQL API）
     - フロントエンドビルド
     - 本番環境へデプロイ

4. **完了**
   - デプロイ完了後、Amplifyが提供するURLでアクセス可能
   - 例: `https://main.xxxxx.amplifyapp.com`
   - 以降、GitHubへのプッシュで自動再デプロイ

### 環境変数

Amplify Gen 2では`amplify_outputs.json`が自動生成されるため、手動での環境変数設定は不要です。

## ローカル開発

```bash
npm install
npm run dev
```

http://localhost:3002 でアクセス

## データ永続化

- **本番環境**: Amazon DynamoDB（自動デプロイ）
- **ローカル開発**: localStorage（開発用）

## 注意事項

- 位置情報の許可が必要です
- HTTPSが必要です（生体認証のため）
- パスワードは本番環境でハッシュ化を推奨

## ライセンス

Private
