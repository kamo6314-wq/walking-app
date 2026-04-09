'use client'

import { Home, Gift, History, Calendar, User, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser')
      if (user) {
        const userData = JSON.parse(user)
        setIsAdmin(userData.isAdmin || false)
      }
    }
  }, [])

  const baseTabs = [
    { id: 'dashboard', label: 'ホーム', icon: Home },
    { id: 'events', label: 'イベント', icon: Calendar },
    { id: 'gacha', label: 'ガチャ', icon: Gift },
    { id: 'history', label: '履歴', icon: History },
    { id: 'profile', label: 'プロフィール', icon: User },
  ]

  const tabs = isAdmin 
    ? [...baseTabs, { id: 'admin', label: '管理者', icon: Shield }]
    : baseTabs

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
              activeTab === id
                ? 'text-[var(--primary-blue)]'
                : 'text-gray-500'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
