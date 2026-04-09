'use client'

import { useState, useEffect } from 'react'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Gacha from '@/components/Gacha'
import History from '@/components/History'
import Events from '@/components/Events'
import Navigation from '@/components/Navigation'
import AdminDashboard from '@/components/AdminDashboard'
import ProfileSettings from '@/components/ProfileSettings'

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [walkingPoints, setWalkingPoints] = useState(0)
  const [gachaPoints, setGachaPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser')
      if (user) {
        const userData = JSON.parse(user)
        setCurrentUser(userData)
        
        // Supabaseから最新のポイントを取得
        const loadPoints = async () => {
          try {
            const { getAllUsers } = await import('@/lib/supabase')
            const users = await getAllUsers()
            const currentUserData = users.find((u: any) => u.id === userData.id)
            if (currentUserData) {
              setWalkingPoints(currentUserData.walking_points || 0)
              setGachaPoints(currentUserData.gacha_points || 0)
            }
          } catch (error) {
            console.error('ポイント読み込みエラー:', error)
            // フォールバック: localStorageから読み込み
            const saved = localStorage.getItem(`userPoints_${userData.id}`) || localStorage.getItem('userPoints')
            if (saved) {
              const data = JSON.parse(saved)
              setWalkingPoints(data.walking || 0)
              setGachaPoints(data.gacha || 0)
            }
          }
        }
        loadPoints()
      }
      setIsLoading(false)
    }
  }, [])

  const updatePoints = async (walking: number, gacha: number) => {
    setWalkingPoints(walking)
    setGachaPoints(gacha)
    
    // Supabaseに保存
    if (currentUser?.id) {
      try {
        const { updateUser } = await import('@/lib/supabase')
        await updateUser(currentUser.id, {
          walking_points: walking,
          gacha_points: gacha
        })
      } catch (error) {
        console.error('ポイント更新エラー:', error)
      }
      
      // ローカルストレージにも保存（後方互換性）
      localStorage.setItem(`userPoints_${currentUser.id}`, JSON.stringify({ walking, gacha }))
    }
    localStorage.setItem('userPoints', JSON.stringify({ walking, gacha }))
  }

  const handleLogin = (user: any) => {
    setCurrentUser(user)
    const saved = localStorage.getItem(`userPoints_${user.id}`) || localStorage.getItem('userPoints')
    if (saved) {
      const data = JSON.parse(saved)
      setWalkingPoints(data.walking || 0)
      setGachaPoints(data.gacha || 0)
    }
  }

  const handleRegister = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    setCurrentUser(user)
    setShowRegister(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    setActiveTab('dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 未ログイン
  if (!currentUser) {
    if (showRegister) {
      return <Register onRegister={handleRegister} />
    }
    return <Login onLogin={handleLogin} onRegister={() => setShowRegister(true)} />
  }

  // 管理者タブ選択時
  if (activeTab === 'admin' && (currentUser?.isAdmin || currentUser?.is_admin)) {
    return (
      <div className="min-h-screen">
        <AdminDashboard onLogout={handleLogout} />
      </div>
    )
  }

  // 通常画面
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-[var(--primary-blue)] text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">歩活アプリ</h1>
        <div className="flex justify-around mt-3 text-sm">
          <div className="text-center">
            <div className="font-semibold">歩活ポイント</div>
            <div className="text-xl font-bold">{walkingPoints}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">ガチャポイント</div>
            <div className="text-xl font-bold">{gachaPoints}</div>
          </div>
        </div>
      </header>

      <div className="pb-20">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'events' && <Events />}
        {activeTab === 'gacha' && (
          <Gacha 
            gachaPoints={gachaPoints}
            onPointsUpdate={(points) => updatePoints(walkingPoints, points)}
          />
        )}
        {activeTab === 'history' && (
          <History 
            walkingPoints={walkingPoints}
            onPointsUpdate={(points) => updatePoints(points, gachaPoints)}
          />
        )}
        {activeTab === 'profile' && <ProfileSettings />}
      </div>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
