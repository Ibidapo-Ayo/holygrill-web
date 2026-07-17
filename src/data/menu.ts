export const DELIVERY_FEE = 500;

export function formatPrice(kobo: number): string {
  return `₦${kobo.toLocaleString()}`;
}
