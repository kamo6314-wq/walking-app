# 歩活アプリ

ANApocketのようなUIで、毎日のウォーキングを楽しく記録できるアプリです。

## 機能

### ユーザー機能
- ユーザー登録・ログイン（生体認証対応）
- 自動歩行記録（100mごとにポイント獲得）
- 移動手段判定（徒歩・車・電車・飛行機）
- 毎日ガチャ（レアリティ別演出）
- イベント参加
- チェックポイント自動検出（半径100m）
- グループチャット
- プロフィール設定（アイコン画像）
- ランキング表示（黒板風デザイン）

### 管理者機能（招待コード: 0325）
- イベント作成・編集・削除
- チェックポイント設定（最大10個）
- Google Mapsリンクから座標自動取得
- ボーナスポイント設定
- 参加者管理
- グループチャット管理
- 新着通知

## デプロイ方法

### AWS Amplifyでデプロイ（推奨）

1. GitHubにプッシュ
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. AWS Amplifyでデプロイ
- https://console.aws.amazon.com/amplify にアクセス
- 「新しいアプリ」→「ホスティング」をクリック
- GitHubリポジトリを接続
- ブランチを選択（main）
- ビルド設定は自動検出（amplify.yml使用）
- 「保存してデプロイ」をクリック
- 自動でビルド＆デプロイ開始！

### Amplify CLI（コマンドライン）

```bash
npm install -g @aws-amplify/cli
amplify configure
amplify init
amplify add hosting
amplify publish
```

## ローカル開発

```bash
npm install
npm run dev
```

http://localhost:3002 でアクセス

## 技術スタック

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Geolocation API
- Web Authentication API（生体認証）
- LocalStorage（データ永続化）

## 注意事項

- 位置情報の許可が必要です
- HTTPSが必要です（生体認証のため）
- 本番環境ではバックエンドAPIの実装を推奨
