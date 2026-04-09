'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Edit2, Save, Trash2, Navigation, Car, Train, Plane, Map } from 'lucide-react'

interface WalkRecord {
  id: string
  date: string
  distance: number
  points: number
  location: string
  type: 'walk' | 'car' | 'train' | 'plane'
  path: { lat: number; lng: number; timestamp: number }[]
}

interface HistoryProps {
  walkingPoints: number
  onPointsUpdate: (points: number) => void
}

export default function History({ walkingPoints, onPointsUpdate }: HistoryProps) {
  const [records, setRecords] = useState<WalkRecord[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDistance, setEditDistance] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [currentDistance, setCurrentDistance] = useState(0)
  const [showMap, setShowMap] = useState<string | null>(null)
  const lastPositionRef = useRef<GeolocationPosition | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const totalDistanceRef = useRef(0)
  const currentPathRef = useRef<{ lat: number; lng: number; timestamp: number }[]>([])
  const lastSaveTimeRef = useRef(Date.now())

  useEffect(() => {
    const saved = localStorage.getItem('walkRecords')
    if (saved) {
      setRecords(JSON.parse(saved))
    }
    
    startAutoTracking()
    
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  const detectMovementType = (speed: number): 'walk' | 'car' | 'train' | 'plane' => {
    if (speed < 2.5) return 'walk'
    if (speed < 20) return 'car'
    if (speed < 100) return 'train'
    return 'plane'
  }

  const startAutoTracking = () => {
    if (!navigator.geolocation) return

    setIsTracking(true)
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const speed = position.coords.speed || 0
        const movementType = detectMovementType(speed)
        
        currentPathRef.current.push({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now()
        })

        if (lastPositionRef.current) {
          const distance = calculateDistance(
            lastPositionRef.current.coords.latitude,
            lastPositionRef.current.coords.longitude,
            position.coords.latitude,
            position.coords.longitude
          )
          
          if (distance >= 5) {
            totalDistanceRef.current += distance
            setCurrentDistance(Math.floor(totalDistanceRef.current))
            
            if (movementType === 'walk' && totalDistanceRef.current >= 100) {
              saveWalkRecord(position, Math.floor(totalDistanceRef.current), movementType)
              totalDistanceRef.current = 0
              currentPathRef.current = []
            }
            else if (movementType !== 'walk' && Date.now() - lastSaveTimeRef.current > 60000) {
              saveWalkRecord(position, Math.floor(totalDistanceRef.current), movementType)
              totalDistanceRef.current = 0
              currentPathRef.current = []
            }
          }
        }
        lastPositionRef.current = position
      },
      (error) => console.error('位置情報エラー:', error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    )
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const saveWalkRecord = (position: GeolocationPosition, distance: number, type: 'walk' | 'car' | 'train' | 'plane') => {
    const points = type === 'walk' ? Math.floor(distance / 100) : 0
    
    const newRecord: WalkRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ja-JP'),
      distance,
      points,
      location: `緯度: ${position.coords.latitude.toFixed(4)}, 経度: ${position.coords.longitude.toFixed(4)}`,
      type,
      path: [...currentPathRef.current]
    }

    const saved = localStorage.getItem('walkRecords')
    const existingRecords = saved ? JSON.parse(saved) : []
    const newRecords = [newRecord, ...existingRecords]
    
    setRecords(newRecords)
    localStorage.setItem('walkRecords', JSON.stringify(newRecords))
    
    if (type === 'walk') {
      onPointsUpdate(walkingPoints + points)
    }
    
    lastSaveTimeRef.current = Date.now()
  }

  const saveRecords = (newRecords: WalkRecord[]) => {
    setRecords(newRecords)
    localStorage.setItem('walkRecords', JSON.stringify(newRecords))
  }

  const startEdit = (record: WalkRecord) => {
    setEditingId(record.id)
    setEditDistance(record.distance.toString())
  }

  const saveEdit = (id: string) => {
    const distance = parseInt(editDistance)
    if (isNaN(distance) || distance < 0) {
      alert('正しい距離を入力してください')
      return
    }

    const newRecords = records.map(r => {
      if (r.id === id) {
        const oldPoints = r.points
        const newPoints = r.type === 'walk' ? Math.floor(distance / 100) : 0
        const pointsDiff = newPoints - oldPoints
        onPointsUpdate(walkingPoints + pointsDiff)
        return { ...r, distance, points: newPoints }
      }
      return r
    })

    saveRecords(newRecords)
    setEditingId(null)
  }

  const deleteRecord = (id: string) => {
    const record = records.find(r => r.id === id)
    if (record && confirm('この記録を削除しますか？')) {
      onPointsUpdate(walkingPoints - record.points)
      saveRecords(records.filter(r => r.id !== id))
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'walk': return <Navigation size={20} className="text-green-600" />
      case 'car': return <Car size={20} className="text-blue-600" />
      case 'train': return <Train size={20} className="text-purple-600" />
      case 'plane': return <Plane size={20} className="text-red-600" />
      default: return <Navigation size={20} />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'walk': return '徒歩'
      case 'car': return '車'
      case 'train': return '電車'
      case 'plane': return '飛行機'
      default: return '不明'
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'walk': return 'bg-green-100 text-green-700'
      case 'car': return 'bg-blue-100 text-blue-700'
      case 'train': return 'bg-purple-100 text-purple-700'
      case 'plane': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const openMap = (record: WalkRecord) => {
    if (record.path && record.path.length > 0) {
      setShowMap(record.id)
    } else {
      alert('この記録には経路データがありません')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Navigation size={32} className={isTracking ? 'animate-pulse' : ''} />
            <div>
              <p className="text-sm opacity-90">現在の移動距離</p>
              <p className="text-2xl font-bold">{currentDistance}m</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">自動記録中</p>
            <div className="flex gap-1 mt-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150" />
            </div>
          </div>
        </div>
        <p className="text-xs mt-2 opacity-75">徒歩のみポイント獲得 / 100m歩くごとに自動記録</p>
      </div>

      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MapPin size={48} className="mx-auto mb-2 opacity-50" />
            <p>まだ記録がありません</p>
          </div>
        ) : (
          records.map((record) => (
            <div key={record.id}>
              {showMap === record.id ? (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold">移動経路</h3>
                    <button onClick={() => setShowMap(null)} className="text-sm text-blue-600">
                      閉じる
                    </button>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <Map size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">地図表示機能</p>
                      <p className="text-xs mt-1">{record.path.length}個の位置データ</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Google Maps APIを統合すると<br/>実際の経路が表示されます
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getTypeBadgeColor(record.type)}`}>
                          {getTypeIcon(record.type)}
                          {getTypeLabel(record.type)}
                        </span>
                        {record.type === 'walk' && (
                          <span className="text-xs text-green-600 font-semibold">
                            +{record.points}pt
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{record.date}</p>
                      <p className="text-xs text-gray-400 mt-1">{record.location}</p>
                    </div>
                    <div className="flex gap-2">
                      {record.path && record.path.length > 0 && (
                        <button onClick={() => openMap(record)} className="text-blue-600 hover:text-blue-700">
                          <Map size={20} />
                        </button>
                      )}
                      {editingId === record.id ? (
                        <button onClick={() => saveEdit(record.id)} className="text-green-600 hover:text-green-700">
                          <Save size={20} />
                        </button>
                      ) : (
                        <button onClick={() => startEdit(record)} className="text-blue-600 hover:text-blue-700">
                          <Edit2 size={20} />
                        </button>
                      )}
                      <button onClick={() => deleteRecord(record.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      {editingId === record.id ? (
                        <input
                          type="number"
                          value={editDistance}
                          onChange={(e) => setEditDistance(e.target.value)}
                          className="border rounded px-2 py-1 w-24"
                        />
                      ) : (
                        <span className="text-lg font-bold">{record.distance.toLocaleString()}m</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
