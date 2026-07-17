import { NextResponse } from 'next/server';
import {
  removeCartItemForRequest,
  updateCartItemForRequest,
} from '../_store';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await context.params;
    const payload = await request.json();
    const snapshot = await updateCartItemForRequest(request, itemId, payload);

    return NextResponse.json({ data: snapshot, message: 'Cart item updated.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update cart item.';
    const status = message === 'Cart item not found.' ? 404 : 400;

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await context.params;
  const snapshot = await removeCartItemForRequest(request, itemId);

  return NextResponse.json({ data: snapshot, message: 'Cart item removed.' });
}