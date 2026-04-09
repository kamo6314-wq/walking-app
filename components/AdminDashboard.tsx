'use client'

import { useState } from 'react'
import { Users, Calendar, MessageSquare, Settings, LogOut, Plus } from 'lucide-react'
import EventManager from './EventManager'
import ParticipantsList from './ParticipantsList'
import EventChat from './EventChat'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('events')

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings size={28} />
            管理者ダッシュボード
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            ログアウト
          </button>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white shadow-lg min-h-screen p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'events'
                  ? 'bg-gray-800 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Calendar size={20} />
              イベント管理
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'participants'
                  ? 'bg-gray-800 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Users size={20} />
              参加者管理
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'chat'
                  ? 'bg-gray-800 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <MessageSquare size={20} />
              グループチャット
            </button>
          </div>
        </nav>

        <main className="flex-1 p-6">
          {activeTab === 'events' && <EventManager />}
          {activeTab === 'participants' && <ParticipantsList />}
          {activeTab === 'chat' && <EventChat />}
        </main>
      </div>
    </div>
  )
}
