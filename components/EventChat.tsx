'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Bell } from 'lucide-react'

interface Message {
  id: string
  eventId: string
  userId: string
  username: string
  avatar: string
  message: string
  timestamp: string
  isAdmin: boolean
}

export default function EventChat() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [notifications, setNotifications] = useState<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadEvents()
    loadNotifications()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      loadMessages(selectedEvent)
    }
  }, [selectedEvent])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadEvents = () => {
    const saved = localStorage.getItem('walkingEvents')
    if (saved) {
      setEvents(JSON.parse(saved))
    }
  }

  const loadMessages = (eventId: string) => {
    const saved = localStorage.getItem(`event_${eventId}_chat`)
    if (saved) {
      setMessages(JSON.parse(saved))
    } else {
      setMessages([])
    }
  }

  const loadNotifications = () => {
    const saved = localStorage.getItem('adminNotifications')
    if (saved) {
      setNotifications(parseInt(saved))
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedEvent) return

    const message: Message = {
      id: Date.now().toString(),
      eventId: selectedEvent,
      userId: 'admin',
      username: '管理者',
      avatar: '👤',
      message: newMessage,
      timestamp: new Date().toLocaleString('ja-JP'),
      isAdmin: true
    }

    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)
    localStorage.setItem(`event_${selectedEvent}_chat`, JSON.stringify(updatedMessages))
    
    // 参加者に通知を送信
    const participants = JSON.parse(localStorage.getItem(`event_${selectedEvent}_participants`) || '[]')
    participants.forEach((p: any) => {
      const userNotifications = parseInt(localStorage.getItem(`user_${p.userId}_notifications`) || '0')
      localStorage.setItem(`user_${p.userId}_notifications`, (userNotifications + 1).toString())
    })

    setNewMessage('')
  }

  const clearNotifications = () => {
    localStorage.setItem('adminNotifications', '0')
    setNotifications(0)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">グループチャット</h2>
        {notifications > 0 && (
          <button
            onClick={clearNotifications}
            className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
          >
            <Bell size={20} />
            {notifications}件の新着通知
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">イベントを選択</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full max-w-md"
        >
          <option value="">イベントを選択してください</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                まだメッセージがありません
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isAdmin ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {msg.avatar}
                  </div>
                  <div className={`flex-1 ${msg.isAdmin ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{msg.username}</span>
                      {msg.isAdmin && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                          管理者
                        </span>
                      )}
                    </div>
                    <div
                      className={`inline-block px-4 py-2 rounded-lg ${
                        msg.isAdmin
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.message}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 border rounded-lg px-4 py-2"
                placeholder="メッセージを入力..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Send size={20} />
                送信
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
