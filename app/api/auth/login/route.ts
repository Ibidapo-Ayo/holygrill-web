import { NextResponse } from 'next/server';

// Mock users for demo purposes
const MOCK_USERS = [
  { id: 'usr-001', email: 'demo@futa.edu.ng', password: 'password', name: 'Demo User', avatarUrl: null, role: 'customer' },
  { id: 'usr-admin', email: 'admin@holygrills.ng', password: 'admin123', name: 'Admin User', avatarUrl: null, role: 'admin' },
];

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
  }

  // Generate a simple mock token (base64 of user info + timestamp)
  const tokenPayload = btoa(JSON.stringify({ id: user.id, email: user.email, ts: Date.now() }));
  const token = `hg_${tokenPayload}`;

  return NextResponse.json({
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    },
    message: 'Login successful',
  });
}
