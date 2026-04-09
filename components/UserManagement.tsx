'use client'

import { useState, useEffect } from 'react'
import { User, Trash2, Shield, Calendar, Trophy, Star } from 'lucide-react'

interface RegisteredUser {
  id: string
  username: string
  password: string
  isAdmin: boolean
  registeredAt: string
  avatar?: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    setUsers(registeredUsers)
  }

  const deleteUser = (userId: string) => {
    if (!confirm('このユーザーを削除しますか？\n※ユーザーのポイントデータも削除されます')) {
      return
    }

    const updatedUsers = users.filter(u => u.id !== userId)
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
    
    // ユーザーのポイントデータも削除
    localStorage.removeItem(`userPoints_${userId}`)
    
    setUsers(updatedUsers)
    setSelectedUser(null)
    alert('ユーザーを削除しました')
  }

  const deleteAllUsers = () => {
    if (!confirm('全てのユーザーを削除しますか？\n※この操作は取り消せません')) {
      return
    }

    if (!confirm('本当によろしいですか？\n全ユーザーとポイントデータが削除されます')) {
      return
    }

    // 全ユーザーのポイントデータを削除
    users.forEach(user => {
      localStorage.removeItem(`userPoints_${user.id}`)
    })

    // ユーザーリストをクリア
    localStorage.setItem('registeredUsers', '[]')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('lastLoggedInUser')
    
    setUsers([])
    setSelectedUser(null)
    alert('全ユーザーを削除しました')
  }

  const getUserPoints = (userId: string) => {
    const points = JSON.parse(localStorage.getItem(`userPoints_${userId}`) || '{"walking":0,"gacha":0}')
    return points
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ユーザー管理</h2>
        <button
          onClick={deleteAllUsers}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Trash2 size={20} />
          全ユーザー削除
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">登録ユーザー数: <span className="font-bold text-2xl text-blue-600">{users.length}</span>人</p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User size={48} className="mx-auto mb-2 opacity-50" />
            <p>登録ユーザーがいません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => {
              const points = getUserPoints(user.id)
              return (
                <div
                  key={user.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* アバター */}
                      <div className="flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                            {user.username.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* ユーザー情報 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold">{user.username}</h3>
                          {user.isAdmin && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <Shield size={12} />
                              管理者
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Trophy className="text-green-600" size={16} />
                            <span className="text-gray-600">歩活:</span>
                            <span className="font-bold text-green-600">{points.walking.toLocaleString()}pt</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="text-pink-600" size={16} />
                            <span className="text-gray-600">ガチャ:</span>
                            <span className="font-bold text-pink-600">{points.gacha.toLocaleString()}pt</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={14} />
                          登録日時: {formatDate(user.registeredAt)}
                        </div>
                        
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>

                    {/* 削除ボタン */}
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                      title="ユーザーを削除"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
