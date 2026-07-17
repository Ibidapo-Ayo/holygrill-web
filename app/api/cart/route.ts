import { NextResponse } from 'next/server';
import {
  addCartItemForRequest,
  clearCartForRequest,
  getCartSnapshotForRequest,
} from './_store';

export async function GET(request: Request) {
  const snapshot = await getCartSnapshotForRequest(request);
  return NextResponse.json({ data: snapshot });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const snapshot = await addCartItemForRequest(request, payload);

    return NextResponse.json({ data: snapshot, message: 'Cart updated.' }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to add item to cart.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const snapshot = await clearCartForRequest(request);
  return NextResponse.json({ data: snapshot, message: 'Cart cleared.' });
}