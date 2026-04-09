'use client'

import { useEffect, useState } from 'react'
import { Trophy, Star } from 'lucide-react'

interface RankingUser {
  name: string
  points: number
  avatar?: string
}

export default function Dashboard() {
  const [walkingRanking, setWalkingRanking] = useState<RankingUser[]>([])
  const [gachaRanking, setGachaRanking] = useState<RankingUser[]>([])

  useEffect(() => {
    loadRankings()
  }, [])

  const loadRankings = () => {
    // 登録ユーザーから実際のランキングを生成
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    
    // 歩活ポイントランキング
    const walkingRanking = users
      .map((user: any) => {
        const userPoints = JSON.parse(localStorage.getItem(`userPoints_${user.id}`) || '{"walking":0,"gacha":0}')
        return {
          name: user.username,
          points: userPoints.walking || 0,
          avatar: user.avatar || user.username.charAt(0)
        }
      })
      .sort((a: any, b: any) => b.points - a.points)
      .slice(0, 10)
    
    // ガチャポイントランキング
    const gachaRanking = users
      .map((user: any) => {
        const userPoints = JSON.parse(localStorage.getItem(`userPoints_${user.id}`) || '{"walking":0,"gacha":0}')
        return {
          name: user.username,
          points: userPoints.gacha || 0,
          avatar: user.avatar || user.username.charAt(0)
        }
      })
      .sort((a: any, b: any) => b.points - a.points)
      .slice(0, 10)
    
    setWalkingRanking(walkingRanking)
    setGachaRanking(gachaRanking)
  }

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
            {walkingRanking.length === 0 ? (
              <div className="text-center py-8 text-white/60 chalk-text">
                <p className="text-sm">まだランキングがありません</p>
                <p className="text-xs mt-2">歩いてポイントを獲得しよう！</p>
              </div>
            ) : (
              walkingRanking.slice(0, 10).map((user, index) => (
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
              ))
            )}
          </div>
        </section>

        {/* ガチャポイントランキング */}
        <section className="chalkboard rounded-xl shadow-2xl p-4 border-4 border-amber-900">
          <div className="flex items-center justify-center gap-2 mb-4 pb-2 border-b-2 border-white/30">
            <Star className="text-pink-300" size={24} />
            <h2 className="text-lg font-bold text-white chalk-text">ガチャTOP10</h2>
          </div>
          <div className="space-y-2">
            {gachaRanking.length === 0 ? (
              <div className="text-center py-8 text-white/60 chalk-text">
                <p className="text-sm">まだランキングがありません</p>
                <p className="text-xs mt-2">ガチャを引いてポイントを獲得しよう！</p>
              </div>
            ) : (
              gachaRanking.slice(0, 10).map((user, index) => (
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
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
