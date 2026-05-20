export const AUTH_TOKEN_COOKIE_NAME = "hg_token";
export const AUTH_TOKEN_EXPIRES_COOKIE_NAME = "hg_token_expires";
export const AUTH_USER_ID_COOKIE_NAME = "hg_user_id";

export const AUTH_PAGE_PATHS = ["/login", "/signup", "/forgot-password"] as const;
export const PROTECTED_PAGE_PATHS = ["/dashboard", "/profile", "/rewards"] as const;

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function isTokenExpired(
  expiresAt: number | string | null | undefined,
  now = Date.now(),
): boolean {
  const expiresAtNumber = Number(expiresAt);

  if (!Number.isFinite(expiresAtNumber)) {
    return true;
  }

  return expiresAtNumber * 1000 <= now;
}

export function hasValidAuthSession(
  token: string | null | undefined,
  expiresAt: number | string | null | undefined,
  now = Date.now(),
): boolean {
  return Boolean(token) && !isTokenExpired(expiresAt, now);
}

export function getCookieExpiryDays(
  expiresAt: number,
  now = Date.now(),
): number {
  return Math.max((expiresAt * 1000 - now) / MILLISECONDS_PER_DAY, 0);
}

export function matchesProtectedPath(pathname: string, paths: readonly string[]): boolean {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}