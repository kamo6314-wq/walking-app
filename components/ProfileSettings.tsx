'use client'

import { useState, useEffect } from 'react'
import { Camera, Save } from 'lucide-react'

export default function ProfileSettings() {
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      const data = JSON.parse(user)
      setUsername(data.username || '')
      setAvatar(data.avatar || '')
    }
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const updatedUser = {
      ...currentUser,
      username,
      avatar
    }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    
    // registeredUsersも更新
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const updatedUsers = users.map((u: any) => 
      u.id === currentUser.id ? updatedUser : u
    )
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
    
    alert('プロフィールを更新しました')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">プロフィール設定</h2>

      <div className="mb-6 text-center">
        <div className="relative inline-block">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
              {username.charAt(0) || '?'}
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
            <Camera size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">ユーザー名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          保存
        </button>
      </div>
    </div>
  )
}
