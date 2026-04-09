import { Home, Gift, History, Calendar, User } from 'lucide-react'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'ホーム', icon: Home },
    { id: 'events', label: 'イベント', icon: Calendar },
    { id: 'gacha', label: 'ガチャ', icon: Gift },
    { id: 'history', label: '履歴', icon: History },
    { id: 'profile', label: 'プロフィール', icon: User },
  ]

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
