import { NextResponse } from 'next/server';

// 簡易的なメモリストレージ（本番環境ではDynamoDBを使用）
let users: any[] = [];

export async function GET() {
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newUser = {
    id: Date.now().toString(),
    ...body,
    registeredAt: new Date().toISOString(),
  };
  users.push(newUser);
  return NextResponse.json({ user: newUser });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id === 'all') {
    users = [];
    return NextResponse.json({ success: true });
  }
  
  users = users.filter(u => u.id !== id);
  return NextResponse.json({ success: true });
}
