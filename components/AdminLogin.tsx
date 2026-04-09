'use client'

import { useState } from 'react'
import { Shield } from 'lucide-react'

interface AdminLoginProps {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code === '0325') {
      localStorage.setItem('isAdmin', 'true')
      onLogin()
    } else {
      setError('招待コードが正しくありません')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full mb-4">
            <Shield size={48} className="text-gray-800" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">管理者ログイン</h1>
          <p className="text-gray-400">招待コードを入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              招待コード
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent text-center text-2xl tracking-widest"
              placeholder="••••"
              maxLength={4}
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  )
}
