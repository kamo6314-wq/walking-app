'use client'

import { useState } from 'react'
import { User, Lock, Fingerprint } from 'lucide-react'

interface LoginProps {
  onLogin: (user: any) => void
  onRegister: () => void
}

export default function Login({ onLogin, onRegister }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleBiometricLogin = async () => {
    if (!window.PublicKeyCredential) {
      alert('このブラウザは生体認証に対応していません')
      return
    }

    try {
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: "required"
      }

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      })

      if (credential) {
        // 生体認証成功 - 最後にログインしたユーザーを取得
        const lastUser = localStorage.getItem('lastLoggedInUser')
        if (lastUser) {
          const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
          const user = users.find((u: any) => u.username === lastUser)
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user))
            onLogin(user)
            return
          }
        }
        alert('ユーザー情報が見つかりません')
      }
    } catch (error) {
      console.error('生体認証エラー:', error)
      alert('生体認証に失敗しました')
    }
  }

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('ユーザー名とパスワードを入力してください')
      return
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const user = users.find((u: any) => u.username === username && u.password === password)

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('lastLoggedInUser', username)
      onLogin(user)
    } else {
      setError('ユーザー名またはパスワードが正しくありません')
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
          <p className="text-white/90">ログイン</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* 生体認証ボタン */}
          <button
            onClick={handleBiometricLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-3 mb-6"
          >
            <Fingerprint size={24} />
            生体認証でログイン
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          {/* パスワードログイン */}
          <form onSubmit={handlePasswordLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ユーザー名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ユーザー名"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="パスワード"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[var(--primary-blue)] text-white py-3 rounded-lg font-bold text-lg hover:bg-[var(--secondary-blue)] transition-colors mb-4"
            >
              ログイン
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={onRegister}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              アカウントをお持ちでない方はこちら
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
