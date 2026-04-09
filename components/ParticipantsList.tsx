'use client'

import { useState, useEffect } from 'react'
import { Users, Calendar } from 'lucide-react'

interface Participant {
  userId: string
  username: string
  email: string
  avatar: string
  joinedAt: string
}

interface EventParticipants {
  eventId: string
  eventTitle: string
  participants: Participant[]
}

export default function ParticipantsList() {
  const [eventParticipants, setEventParticipants] = useState<EventParticipants[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  useEffect(() => {
    loadParticipants()
  }, [])

  const loadParticipants = () => {
    const events = JSON.parse(localStorage.getItem('walkingEvents') || '[]')
    
    const participantsData: EventParticipants[] = events.map((event: any) => {
      const saved = localStorage.getItem(`event_${event.id}_participants`)
      const participants = saved ? JSON.parse(saved) : []
      
      return {
        eventId: event.id,
        eventTitle: event.title,
        participants
      }
    })

    setEventParticipants(participantsData)
  }

  const filteredParticipants = selectedEvent
    ? eventParticipants.filter(ep => ep.eventId === selectedEvent)
    : eventParticipants

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">参加者管理</h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">イベントで絞り込み</label>
        <select
          value={selectedEvent || ''}
          onChange={(e) => setSelectedEvent(e.target.value || null)}
          className="border rounded-lg px-4 py-2 w-full max-w-md"
        >
          <option value="">すべてのイベント</option>
          {eventParticipants.map((ep) => (
            <option key={ep.eventId} value={ep.eventId}>
              {ep.eventTitle} ({ep.participants.length}名)
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {filteredParticipants.map((ep) => (
          <div key={ep.eventId} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={24} className="text-blue-600" />
              <h3 className="text-xl font-bold">{ep.eventTitle}</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {ep.participants.length}名参加
              </span>
            </div>

            {ep.participants.length === 0 ? (
              <p className="text-gray-500 text-center py-8">まだ参加者がいません</p>
            ) : (
              <div className="grid gap-3">
                {ep.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {participant.avatar || participant.username.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{participant.username}</h4>
                      <p className="text-sm text-gray-600">{participant.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">参加日時</p>
                      <p className="text-sm font-medium">{participant.joinedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
