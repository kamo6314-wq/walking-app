import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <title>歩活アプリ</title>
        <meta name="description" content="毎日歩いてポイントを貯めよう" />
      </head>
      <body>{children}</body>
    </html>
  )
}
