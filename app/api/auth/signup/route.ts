import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password, phone_number } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Name, email, and password are required.' }, { status: 400 });
  }

  // In a real app you'd persist to a database. For demo, just return a new user.
  const userId = `usr-${Date.now()}`;
  const tokenPayload = btoa(JSON.stringify({ id: userId, email, ts: Date.now() }));
  const token = `hg_${tokenPayload}`;

  return NextResponse.json(
    {
      data: {
        token,
        user: {
          id: userId,
          name,
          email,
          phone: phone_number ?? null,
          avatarUrl: null,
          role: 'customer',
        },
      },
      message: 'Account created successfully',
    },
    { status: 201 }
  );
}
