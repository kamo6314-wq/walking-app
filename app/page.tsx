'use client'

import { useState, useEffect } from 'react'
import Register from '@/components/Register'
import Dashboard from '@/components/Dashboard'
import Gacha from '@/components/Gacha'
import History from '@/components/History'
import Events from '@/components/Events'
import Navigation from '@/components/Navigation'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'
import ProfileSettings from '@/components/ProfileSettings'

export default function Home() {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [walkingPoints, setWalkingPoints] = useState(0)
  const [gachaPoints, setGachaPoints] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser')
      const admin = localStorage.getItem('isAdmin')
      setIsRegistered(!!user)
      setIsAdmin(admin === 'true')
      
      if (user) {
        const saved = localStorage.getItem('userPoints')
        if (saved) {
          const data = JSON.parse(saved)
          setWalkingPoints(data.walking || 0)
          setGachaPoints(data.gacha || 0)
        }
      }
    }
  }, [])

  const updatePoints = (walking: number, gacha: number) => {
    setWalkingPoints(walking)
    setGachaPoints(gacha)
    localStorage.setItem('userPoints', JSON.stringify({ walking, gacha }))
  }

  if (isRegistered === null || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 管理者画面
  if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
    if (!isAdmin) {
      return <AdminLogin onLogin={() => setIsAdmin(true)} />
    }
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />
  }

  if (!isRegistered) {
    return <Register onRegister={() => setIsRegistered(true)} />
  }

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
