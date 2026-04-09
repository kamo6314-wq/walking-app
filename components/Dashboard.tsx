'use client'

import { useEffect, useState } from 'react'
import { Trophy, Star } from 'lucide-react'

interface RankingUser {
  name: string
  points: number
}

export default function Dashboard() {
  const [walkingRanking, setWalkingRanking] = useState<RankingUser[]>([])
  const [gachaRanking, setGachaRanking] = useState<RankingUser[]>([])

  useEffect(() => {
    const walking = JSON.parse(localStorage.getItem('walkingRanking') || '[]')
    const gacha = JSON.parse(localStorage.getItem('gachaRanking') || '[]')
    
    if (walking.length === 0) {
      const mockWalking = Array.from({ length: 10 }, (_, i) => ({
        name: `ユーザー${i + 1}`,
        points: Math.floor(Math.random() * 10000) + 1000
      })).sort((a, b) => b.points - a.points)
      localStorage.setItem('walkingRanking', JSON.stringify(mockWalking))
      setWalkingRanking(mockWalking)
    } else {
      setWalkingRanking(walking)
    }

    if (gacha.length === 0) {
      const mockGacha = Array.from({ length: 10 }, (_, i) => ({
        name: `ユーザー${i + 1}`,
        points: Math.floor(Math.random() * 5000) + 500
      })).sort((a, b) => b.points - a.points)
      localStorage.setItem('gachaRanking', JSON.stringify(mockGacha))
      setGachaRanking(mockGacha)
    } else {
      setGachaRanking(gacha)
    }
  }, [])

  const getMedalIcon = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}`
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* 歩活ポイントランキング */}
        <section className="chalkboard rounded-xl shadow-2xl p-4 border-4 border-amber-900">
          <div className="flex items-center justify-center gap-2 mb-4 pb-2 border-b-2 border-white/30">
            <Trophy className="text-yellow-300" size={24} />
            <h2 className="text-lg font-bold text-white chalk-text">歩活TOP10</h2>
          </div>
          <div className="space-y-2">
            {walkingRanking.slice(0, 10).map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white/10 rounded backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-yellow-300 w-8 text-center">
                    {getMedalIcon(index)}
                  </span>
                  <span className="text-white chalk-text text-sm">{user.name}</span>
                </div>
                <span className="font-bold text-yellow-200 chalk-text text-sm">
                  {user.points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ガチャポイントランキング */}
        <section className="chalkboard rounded-xl shadow-2xl p-4 border-4 border-amber-900">
          <div className="flex items-center justify-center gap-2 mb-4 pb-2 border-b-2 border-white/30">
            <Star className="text-pink-300" size={24} />
            <h2 className="text-lg font-bold text-white chalk-text">ガチャTOP10</h2>
          </div>
          <div className="space-y-2">
            {gachaRanking.slice(0, 10).map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white/10 rounded backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-pink-300 w-8 text-center">
                    {getMedalIcon(index)}
                  </span>
                  <span className="text-white chalk-text text-sm">{user.name}</span>
                </div>
                <span className="font-bold text-pink-200 chalk-text text-sm">
                  {user.points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
