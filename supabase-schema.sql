-- ユーザーテーブル
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  walking_points INTEGER DEFAULT 0,
  gacha_points INTEGER DEFAULT 0,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 歩行記録テーブル
CREATE TABLE walk_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  distance INTEGER NOT NULL,
  points INTEGER NOT NULL,
  location TEXT,
  type TEXT NOT NULL,
  path JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- イベントテーブル
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  time TEXT,
  bonus_points INTEGER DEFAULT 0,
  checkpoints JSONB,
  participants JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- チャットメッセージテーブル
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_walk_records_user_id ON walk_records(user_id);
CREATE INDEX idx_chat_messages_event_id ON chat_messages(event_id);
CREATE INDEX idx_users_username ON users(username);

-- Row Level Security (RLS) を有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE walk_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 全員が読み取り可能
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Public read access" ON walk_records FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON chat_messages FOR SELECT USING (true);

-- 全員が書き込み可能（本番環境では制限を追加）
CREATE POLICY "Public insert access" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON walk_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON chat_messages FOR INSERT WITH CHECK (true);

-- 全員が更新可能（本番環境では制限を追加）
CREATE POLICY "Public update access" ON users FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON walk_records FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON events FOR UPDATE USING (true);

-- 全員が削除可能（本番環境では制限を追加）
CREATE POLICY "Public delete access" ON users FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON walk_records FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON events FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON chat_messages FOR DELETE USING (true);
