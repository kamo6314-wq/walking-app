'use client'

import { useState } from 'react'
import { User, Trophy, Calendar, Gift, Shield } from 'lucide-react'

interface RegisterProps {
  onRegister: (isAdmin: boolean) => void
}

export default function Register({ onRegister }: RegisterProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [showInviteCode, setShowInviteCode] = useState(false)

  const checkUsernameExists = (username: string): boolean => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    return users.some((u: any) => u.username === username)
  }

  const registerUser = (username: string, password: string, isAdmin: boolean) => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    
    const newUser = {
      id: Date.now().toString(),
      username,
      password, // 本番環境ではハッシュ化必須
      isAdmin,
      registeredAt: new Date().toISOString(),
      avatar: ''
    }

    users.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(users))
    
    return newUser
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      alert('ユーザー名を入力してください')
      return
    }

    if (!password || password.length < 4) {
      alert('パスワードは4文字以上で入力してください')
      return
    }

    // ユーザー名の重複チェック
    if (checkUsernameExists(username)) {
      alert('このユーザー名は既に使用されています')
      return
    }

    // 招待コードチェック（管理者登録）
    const isAdmin = inviteCode === '0325'

    // ユーザー登録
    const user = registerUser(username, password, isAdmin)

    // 現在のユーザーとして設定
    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('userPoints', JSON.stringify({ walking: 0, gacha: 0 }))

    // 生体認証の設定を試みる
    if (window.PublicKeyCredential) {
      try {
        await setupBiometricAuth(username)
      } catch (error) {
        console.log('生体認証の設定をスキップしました')
      }
    }

    onRegister(isAdmin)
  }

  const setupBiometricAuth = async (username: string) => {
    // Web Authentication API (WebAuthn) を使用
    // 実際の実装では、サーバー側での検証が必要
    try {
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "歩活アプリ",
          id: window.location.hostname
        },
        user: {
          id: new TextEncoder().encode(username),
          name: username,
          displayName: username
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "none"
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      })

      if (credential) {
        localStorage.setItem(`biometric_${username}`, 'enabled')
        alert('生体認証が設定されました')
      }
    } catch (error) {
      console.log('生体認証の設定に失敗:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full mb-4">
            <User size={48} className="text-[var(--primary-blue)]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">歩活アプリ</h1>
          <p className="text-white/90">アカウント登録</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ユーザー名 *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="山田太郎"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">※ 他のユーザーと重複できません</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              パスワード *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="4文字以上"
            />
            <p className="text-xs text-gray-500 mt-1">※ 次回ログイン時に使用します</p>
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowInviteCode(!showInviteCode)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Shield size={16} />
              管理者として登録する場合はこちら
            </button>
            
            {showInviteCode && (
              <div className="mt-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  招待コード
                </label>
                <input
                  type="password"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="招待コードを入力"
                  maxLength={4}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--primary-blue)] text-white py-3 rounded-lg font-bold text-lg hover:bg-[var(--secondary-blue)] transition-colors"
          >
            登録して始める
          </button>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <Trophy className="mx-auto mb-2 text-yellow-500" size={28} />
              <p className="text-xs text-gray-600">ランキング参加</p>
            </div>
            <div className="text-center">
              <Calendar className="mx-auto mb-2 text-blue-500" size={28} />
              <p className="text-xs text-gray-600">イベント参加</p>
            </div>
            <div className="text-center">
              <Gift className="mx-auto mb-2 text-purple-500" size={28} />
              <p className="text-xs text-gray-600">毎日ガチャ</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
