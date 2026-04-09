'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, MapPin, Save, X } from 'lucide-react'

interface Checkpoint {
  name: string
  latitude: number
  longitude: number
  description: string
  landmark: string
  googleMapsLink: string
}

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
  bonusPoints: number
}

export default function EventManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    date: '',
    time: '',
    distance: '',
    duration: '',
    maxParticipants: 30,
    description: '',
    bonusPoints: 100,
    checkpoints: []
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = () => {
    const saved = localStorage.getItem('walkingEvents')
    if (saved) {
      setEvents(JSON.parse(saved))
    }
  }

  const saveEvents = (newEvents: Event[]) => {
    localStorage.setItem('walkingEvents', JSON.stringify(newEvents))
    setEvents(newEvents)
  }

  const extractCoordinatesFromLink = (link: string): { lat: number; lng: number } | null => {
    // Google Mapsリンクから座標を抽出
    const patterns = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,  // @lat,lng
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // !3dlat!4dlng
      /q=(-?\d+\.\d+),(-?\d+\.\d+)/ // q=lat,lng
    ]

    for (const pattern of patterns) {
      const match = link.match(pattern)
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2])
        }
      }
    }
    return null
  }

  const addCheckpoint = () => {
    if ((formData.checkpoints?.length || 0) >= 10) {
      alert('チェックポイントは最大10個までです')
      return
    }

    const newCheckpoint: Checkpoint = {
      name: '',
      latitude: 0,
      longitude: 0,
      description: '',
      landmark: '',
      googleMapsLink: ''
    }

    setFormData({
      ...formData,
      checkpoints: [...(formData.checkpoints || []), newCheckpoint]
    })
  }

  const updateCheckpoint = (index: number, field: keyof Checkpoint, value: string) => {
    const checkpoints = [...(formData.checkpoints || [])]
    checkpoints[index] = { ...checkpoints[index], [field]: value }

    // Google Mapsリンクが更新された場合、座標を抽出
    if (field === 'googleMapsLink') {
      const coords = extractCoordinatesFromLink(value)
      if (coords) {
        checkpoints[index].latitude = coords.lat
        checkpoints[index].longitude = coords.lng
      }
    }

    setFormData({ ...formData, checkpoints })
  }

  const removeCheckpoint = (index: number) => {
    const checkpoints = [...(formData.checkpoints || [])]
    checkpoints.splice(index, 1)
    setFormData({ ...formData, checkpoints })
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.time) {
      alert('必須項目を入力してください')
      return
    }

    if ((formData.checkpoints?.length || 0) === 0) {
      alert('チェックポイントを最低1つ追加してください')
      return
    }

    const newEvent: Event = {
      id: editingId || Date.now().toString(),
      title: formData.title!,
      date: formData.date!,
      time: formData.time!,
      distance: formData.distance || '',
      duration: formData.duration || '',
      participants: 0,
      maxParticipants: formData.maxParticipants || 30,
      checkpoints: formData.checkpoints!.map(cp => ({
        ...cp,
        checked: false
      })) as any,
      description: formData.description || '',
      bonusPoints: formData.bonusPoints || 100
    }

    if (editingId) {
      saveEvents(events.map(e => e.id === editingId ? newEvent : e))
    } else {
      saveEvents([...events, newEvent])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      distance: '',
      duration: '',
      maxParticipants: 30,
      description: '',
      bonusPoints: 100,
      checkpoints: []
    })
    setIsCreating(false)
    setEditingId(null)
  }

  const startEdit = (event: Event) => {
    setFormData(event)
    setEditingId(event.id)
    setIsCreating(true)
  }

  const deleteEvent = (id: string) => {
    if (confirm('このイベントを削除しますか？')) {
      saveEvents(events.filter(e => e.id !== id))
    }
  }

  if (isCreating || editingId) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {editingId ? 'イベント編集' : '新規イベント作成'}
          </h2>
          <button onClick={resetForm} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">イベント名 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="🚀 淵野辺「宇宙と科学」満喫ウォーキング"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">開催日 *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">開始時刻 *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">距離</label>
              <input
                type="text"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="4〜5km"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">所要時間</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="約100分"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">最大参加人数</label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">ボーナスポイント</label>
            <input
              type="number"
              value={formData.bonusPoints}
              onChange={(e) => setFormData({ ...formData, bonusPoints: parseInt(e.target.value) })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="100"
            />
            <p className="text-xs text-gray-500 mt-1">全チェックポイント達成時の獲得ポイント</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">イベント説明</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              rows={3}
              placeholder="イベントの詳細説明"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold">
                チェックポイント ({formData.checkpoints?.length || 0}/10)
              </label>
              <button
                onClick={addCheckpoint}
                disabled={(formData.checkpoints?.length || 0) >= 10}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                <Plus size={20} />
                追加
              </button>
            </div>

            <div className="space-y-4">
              {formData.checkpoints?.map((checkpoint, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">チェックポイント {index + 1}</h4>
                    <button
                      onClick={() => removeCheckpoint(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={checkpoint.name}
                      onChange={(e) => updateCheckpoint(index, 'name', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="チェックポイント名（例：淵野辺駅南口）"
                    />
                    <input
                      type="text"
                      value={checkpoint.description}
                      onChange={(e) => updateCheckpoint(index, 'description', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="説明（例：改札を出て南口ロータリーへ）"
                    />
                    <input
                      type="text"
                      value={checkpoint.landmark}
                      onChange={(e) => updateCheckpoint(index, 'landmark', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="目印（例：📍 駅前ロータリーの中央付近）"
                    />
                    <div>
                      <input
                        type="text"
                        value={checkpoint.googleMapsLink}
                        onChange={(e) => updateCheckpoint(index, 'googleMapsLink', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Google Mapsのリンクを貼り付け"
                      />
                      {checkpoint.latitude !== 0 && checkpoint.longitude !== 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ 座標取得済み: {checkpoint.latitude.toFixed(4)}, {checkpoint.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              保存
            </button>
            <button
              onClick={resetForm}
              className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">イベント一覧</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
        >
          <Plus size={20} />
          新規作成
        </button>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {event.date} {event.time}〜 | {event.distance} | {event.duration}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  参加者: {event.participants}/{event.maxParticipants}名 | ボーナス: {event.bonusPoints}pt
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(event)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{event.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} />
              <span>{event.checkpoints.length}箇所のチェックポイント</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
