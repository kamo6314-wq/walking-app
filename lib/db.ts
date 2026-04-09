import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

export const client = generateClient<Schema>();

// ユーザー登録
export async function registerUser(username: string, password: string, isAdmin: boolean) {
  try {
    const { data: newUser } = await client.models.User.create({
      username,
      password, // 本番環境ではハッシュ化必須
      isAdmin,
      walkingPoints: 0,
      gachaPoints: 0,
      registeredAt: new Date().toISOString(),
      avatar: '',
    });
    return newUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// ユーザー名でユーザーを検索
export async function getUserByUsername(username: string) {
  try {
    const { data: users } = await client.models.User.list({
      filter: { username: { eq: username } },
    });
    return users[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// ユーザー認証
export async function authenticateUser(username: string, password: string) {
  try {
    const { data: users } = await client.models.User.list({
      filter: {
        username: { eq: username },
        password: { eq: password },
      },
    });
    return users[0] || null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

// 全ユーザー取得
export async function getAllUsers() {
  try {
    const { data: users } = await client.models.User.list();
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// ユーザー削除
export async function deleteUser(userId: string) {
  try {
    await client.models.User.delete({ id: userId });
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// ユーザー更新
export async function updateUser(userId: string, updates: Partial<Schema['User']['type']>) {
  try {
    const { data: updatedUser } = await client.models.User.update({
      id: userId,
      ...updates,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
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
  try {
    const { data: record } = await client.models.WalkRecord.create({
      userId,
      date: new Date().toISOString(),
      distance,
      points,
      location,
      type,
      path: JSON.stringify(path),
    });
    return record;
  } catch (error) {
    console.error('Error saving walk record:', error);
    throw error;
  }
}

// ユーザーの歩行記録を取得
export async function getUserWalkRecords(userId: string) {
  try {
    const { data: records } = await client.models.WalkRecord.list({
      filter: { userId: { eq: userId } },
    });
    return records;
  } catch (error) {
    console.error('Error getting walk records:', error);
    return [];
  }
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
  try {
    const { data: event } = await client.models.Event.create({
      title,
      description,
      date,
      time,
      bonusPoints,
      checkpoints: JSON.stringify(checkpoints),
      participants: JSON.stringify([]),
    });
    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

// 全イベント取得
export async function getAllEvents() {
  try {
    const { data: events } = await client.models.Event.list();
    return events;
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
}
