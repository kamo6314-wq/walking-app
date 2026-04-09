'use client'

import { useState, useEffect } from 'react'
import { Gift, Sparkles, Star } from 'lucide-react'

interface GachaProps {
  gachaPoints: number
  onPointsUpdate: (points: number) => void
}

interface Prize {
  points: number
  color: string
  gradient: string
  label: string
  rarity: string
}

const PRIZES: Prize[] = [
  { points: 10, color: 'bg-gray-400', gradient: 'from-gray-400 to-gray-500', label: 'ノーマル', rarity: '50%' },
  { points: 30, color: 'bg-blue-400', gradient: 'from-blue-400 to-blue-600', label: 'レア', rarity: '30%' },
  { points: 50, color: 'bg-purple-400', gradient: 'from-purple-400 to-purple-600', label: 'スーパーレア', rarity: '15%' },
  { points: 100, color: 'bg-yellow-400', gradient: 'from-yellow-400 to-orange-500', label: 'ウルトラレア', rarity: '5%' },
]

export default function Gacha({ gachaPoints, onPointsUpdate }: GachaProps) {
  const [canDraw, setCanDraw] = useState(false)
  const [result, setResult] = useState<Prize | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lastGachaDate')
    const today = new Date().toDateString()
    setCanDraw(saved !== today)
  }, [])

  const drawGacha = () => {
    if (!canDraw) return

    setIsAnimating(true)
    setResult(null)
    setShowResult(false)

    setTimeout(() => {
      const rand = Math.random() * 100
      let prize: Prize
      if (rand < 50) prize = PRIZES[0]
      else if (rand < 80) prize = PRIZES[1]
      else if (rand < 95) prize = PRIZES[2]
      else prize = PRIZES[3]

      setResult(prize)
      setShowResult(true)
      setIsAnimating(false)
      
      const newTotal = gachaPoints + prize.points
      onPointsUpdate(newTotal)
      
      const today = new Date().toDateString()
      localStorage.setItem('lastGachaDate', today)
      setCanDraw(false)
    }, 2500)
  }

  return (
    <div className="p-4">
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 text-white min-h-[600px] flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <Sparkles size={32} className="animate-pulse" />
          毎日ガチャ
          <Sparkles size={32} className="animate-pulse" />
        </h2>
        
        <div className="flex-1 flex items-center justify-center mb-6">
          {isAnimating ? (
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-spin" />
                <div className="absolute inset-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Gift size={64} className="animate-bounce" />
                </div>
              </div>
              <p className="text-2xl font-bold animate-pulse">抽選中...</p>
            </div>
          ) : showResult && result ? (
            <div className="text-center animate-bounce-in">
              <div className={`bg-gradient-to-br ${result.gradient} rounded-2xl p-8 shadow-2xl transform scale-110`}>
                <Star size={60} className="mx-auto mb-4 animate-spin-slow" fill="white" />
                <p className="text-2xl font-bold mb-2">{result.label}</p>
                <p className="text-6xl font-bold mb-4">{result.points}pt</p>
                <p className="text-xl">おめでとうございます！</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-2 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                  <Gift size={64} />
                </div>
              </div>
              <p className="text-xl">
                {canDraw ? '今日のガチャを引けます！' : '明日またチャレンジ！'}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={drawGacha}
          disabled={!canDraw || isAnimating}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all transform ${
            canDraw && !isAnimating
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105 active:scale-95 shadow-lg'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
        >
          {isAnimating ? '抽選中...' : canDraw ? 'ガチャを引く' : '本日は引き済みです'}
        </button>

        <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-4">
          <p className="text-center font-semibold mb-3">排出確率</p>
          <div className="space-y-2">
            {PRIZES.map((prize, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${prize.color}`} />
                  <span>{prize.label}</span>
                </div>
                <span className="font-semibold">{prize.rarity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
