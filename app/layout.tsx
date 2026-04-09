'use client'

import './globals.css'
import { useEffect } from 'react'
import { configureAmplify } from '@/lib/amplify-config'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    configureAmplify()
  }, [])

  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
