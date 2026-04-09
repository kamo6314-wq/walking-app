'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: string
  time: string
  distance: string
  duration: string
  participants: number
  maxParticipants: number
  checkpoints: Checkpoint[]
  description: string
}

interface Checkpoint {
  name: string
  latitude: number
  longitude: number
  checked: boolean
  description: string
  landmark: string
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [watchId, setWatchId] = useState<number | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = () => {
    const saved = localStorage.getItem('walkingEvents')
    if (saved) {
      setEvents(JSON.parse(saved))
    } else {
      const defaultEvents: Event[] = [
        {
          id: '1',
          title: '🚀 淵野辺「宇宙と科学」満喫ウォーキング',
          date: '2026年4月15日',
          time: '10:00',
          distance: '4〜5km',
          duration: '約100分',
          participants: 12,
          maxParticipants: 30,
          checkpoints: [
            { 
              name: '淵野辺駅南口', 
              latitude: 35.5686, 
              longitude: 139.3897, 
              checked: false,
              description: '改札を出て南口ロータリーへ',
              landmark: '📍 駅前ロータリーの中央付近'
            },
            { 
              name: '鹿沼公園', 
              latitude: 35.5695, 
              longitude: 139.3920, 
              checked: false,
              description: '大きな池がある公園',
              landmark: '⛲ 公園内の噴水前'
            },
            { 
              name: 'JAXA相模原キャンパス', 
              latitude: 35.5632, 
              longitude: 139.4078, 
              checked: false,
              description: '宇宙科学探査交流棟',
              landmark: '🚀 正門入ってすぐの展示館入口'
            },
            { 
              name: '相模原市立博物館', 
              latitude: 35.5625, 
              longitude: 139.4085, 
              checked: false,
              description: 'JAXAの向かい側',
              landmark: '🏛️ 博物館のエントランス前'
            },
            { 
              name: '淵野辺駅', 
              latitude: 35.5686, 
              longitude: 139.3897, 
              checked: false,
              description: 'ゴール地点',
              landmark: '🎯 駅前ロータリー'
            },
          ],
          description: '宇宙探査の拠点と地元の憩いの場を巡る、相模原ならではのルート'
        },
        {
          id: '2',
          title: '🌸 春の桜並木ウォーキング',
          date: '2026年4月20日',
          time: '09:00',
          distance: '3km',
          duration: '約60分',
          participants: 8,
          maxParticipants: 25,
          checkpoints: [
            { 
              name: '相模大野駅', 
              latitude: 35.5310, 
              longitude: 139.4280, 
              checked: false,
              description: '北口改札を出る',
              landmark: '📍 駅前広場の時計台前'
            },
            { 
              name: '相模原公園', 
              latitude: 35.5350, 
              longitude: 139.4320, 
              checked: false,
              description: '広大な芝生広場',
              landmark: '🌳 公園入口のモニュメント前'
            },
            { 
              name: '桜並木通り', 
              latitude: 35.5330, 
              longitude: 139.4300, 
              checked: false,
              description: '春は満開の桜トンネル',
              landmark: '🌸 桜並木の中央地点'
            },
            { 
              name: '相模大野駅', 
              latitude: 35.5310, 
              longitude: 139.4280, 
              checked: false,
              description: 'ゴール地点',
              landmark: '🎯 駅前広場'
            },
          ],
          description: '満開の桜を楽しみながら歩く春のイベント'
        }
      ]
      localStorage.setItem('walkingEvents', JSON.stringify(defaultEvents))
      setEvents(defaultEvents)
    }
  }

  const handleParticipate = (event: Event) => {
    const participation = localStorage.getItem(`event_${event.id}_participation`)
    if (participation) {
      const data = JSON.parse(participation)
      setSelectedEvent({ ...event, checkpoints: data.checkpoints })
    } else {
      localStorage.setItem(`event_${event.id}_participation`, JSON.stringify({ checkpoints: event.checkpoints }))
      setSelectedEvent(event)
    }
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('位置情報がサポートされていません')
      return
    }

    setIsTracking(true)
    const id = navigator.geolocation.watchPosition(
      (position) => {
        checkNearbyCheckpoints(position.coords)
      },
      (error) => {
        console.error('位置情報エラー:', error)
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    )
    setWatchId(id)
  }

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsTracking(false)
  }

  const checkNearbyCheckpoints = (coords: GeolocationCoordinates) => {
    if (!selectedEvent) return

    const updatedCheckpoints = selectedEvent.checkpoints.map((checkpoint) => {
      if (checkpoint.checked) return checkpoint

      const distance = getDistance(
        coords.latitude,
        coords.longitude,
        checkpoint.latitude,
        checkpoint.longitude
      )

      if (distance <= 100) {
        alert(`🎉 チェックポイント到達！\n\n${checkpoint.name}\n${checkpoint.landmark}`)
        return { ...checkpoint, checked: true }
      }

      return checkpoint
    })

    const updatedEvent = { ...selectedEvent, checkpoints: updatedCheckpoints }
    setSelectedEvent(updatedEvent)
    localStorage.setItem(`event_${selectedEvent.id}_participation`, JSON.stringify({ checkpoints: updatedCheckpoints }))
  }

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  if (selectedEvent) {
    const completedCheckpoints = selectedEvent.checkpoints.filter((c) => c.checked).length
    const progress = (completedCheckpoints / selectedEvent.checkpoints.length) * 100

    return (
      <div className="p-4 space-y-4">
        <button
          onClick={() => {
            stopTracking()
            setSelectedEvent(null)
          }}
          className="text-[var(--primary-blue)] flex items-center gap-2"
        >
          ← イベント一覧に戻る
        </button>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={18} />
              <span>{selectedEvent.date} {selectedEvent.time}〜</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={18} />
              <span>{selectedEvent.distance} / {selectedEvent.duration}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>進捗状況</span>
              <span>{completedCheckpoints} / {selectedEvent.checkpoints.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {selectedEvent.checkpoints.map((checkpoint, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  checkpoint.checked 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      checkpoint.checked ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    {checkpoint.checked ? (
                      <CheckCircle size={24} className="text-white" />
                    ) : (
                      <span className="text-white font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-1 ${
                      checkpoint.checked ? 'text-green-700' : 'text-gray-900'
                    }`}>
                      {checkpoint.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {checkpoint.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                      {checkpoint.landmark}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={isTracking ? stopTracking : startTracking}
            className={`w-full py-3 rounded-lg font-bold text-white ${
              isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-[var(--primary-blue)] hover:bg-[var(--secondary-blue)]'
            }`}
          >
            {isTracking ? '追跡を停止' : '位置情報追跡を開始'}
          </button>

          <div className="mt-4 space-y-2">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-900 mb-1">
                💡 チェックポイントについて
              </p>
              <p className="text-xs text-yellow-800">
                • 各チェックポイントの半径100m以内に入ると自動でチェック<br/>
                • 📍マークの場所を目指してください<br/>
                • 全チェックポイント達成で特別ボーナス！
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                🗺️ ナビゲーションのコツ
              </p>
              <p className="text-xs text-blue-800">
                • 位置情報を常にONにしてください<br/>
                • 目印（噴水、モニュメント等）を探しましょう<br/>
                • 迷ったら地図アプリで確認OK
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">歩活イベント</h2>
        <p className="text-sm opacity-90">みんなで楽しく歩こう！</p>
      </div>

      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold flex-1">{event.title}</h3>
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
              <Users size={16} className="text-[var(--primary-blue)]" />
              <span className="text-sm font-semibold text-[var(--primary-blue)]">
                {event.participants}/{event.maxParticipants}
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{event.date} {event.time}〜</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{event.distance} / {event.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} />
              <span>{event.checkpoints.length}箇所のチェックポイント</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">{event.description}</p>

          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
            <div
              className="bg-[var(--primary-blue)] h-1.5 rounded-full"
              style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
            />
          </div>

          <button
            onClick={() => handleParticipate(event)}
            className="w-full bg-[var(--primary-blue)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--secondary-blue)] transition-colors"
          >
            参加する
          </button>
        </div>
      ))}
    </div>
  )
}
