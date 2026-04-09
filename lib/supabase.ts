import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Supabaseクライアントを条件付きで作成
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ユーザー登録
export async function registerUser(username: string, password: string, isAdmin: boolean) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        username,
        password, // 本番環境ではハッシュ化必須
        is_admin: isAdmin,
        walking_points: 0,
        gacha_points: 0,
        avatar: '',
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

// ユーザー名でユーザーを検索
export async function getUserByUsername(username: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// ユーザー認証
export async function authenticateUser(username: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// 全ユーザー取得
export async function getAllUsers() {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ユーザー削除
export async function deleteUser(userId: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) throw error
  return true
}

// 全ユーザー削除
export async function deleteAllUsers() {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase
    .from('users')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // 全削除

  if (error) throw error
  return true
}

// ユーザー更新
export async function updateUser(userId: string, updates: any) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// 歩行記録を保存
export async function saveWalkRecord(
  userId: string,
  distance: number,
  points: number,
  location: string,
  type: string,
  path: any[]
) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('walk_records')
    .insert([
      {
        user_id: userId,
        distance,
        points,
        location,
        type,
        path,
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

// ユーザーの歩行記録を取得
export async function getUserWalkRecords(userId: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('walk_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// イベント作成
export async function createEvent(
  title: string,
  description: string,
  date: string,
  time: string,
  bonusPoints: number,
  checkpoints: any[]
) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        title,
        description,
        date,
        time,
        bonus_points: bonusPoints,
        checkpoints,
        participants: [],
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

// 全イベント取得
export async function getAllEvents() {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
