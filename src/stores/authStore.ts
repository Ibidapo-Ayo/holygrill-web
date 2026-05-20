import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setCookie, deleteCookie } from "@/lib/cookies";
import { UserResponse, loginApi, signupApi } from "@/lib/api/auth";
import {
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_TOKEN_EXPIRES_COOKIE_NAME,
  AUTH_USER_ID_COOKIE_NAME,
  getCookieExpiryDays,
} from "@/lib/auth-session";

interface AuthState {
  user: UserResponse["profile"] | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ) => Promise<void>;
  setUser: (user: UserResponse["profile"] | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

function setAuthCookies(
  accessToken: string,
  userId: string,
  expiresAt: number,
) {
  setCookie(
    AUTH_TOKEN_COOKIE_NAME,
    accessToken,
    getCookieExpiryDays(expiresAt),
  );
  setCookie(AUTH_USER_ID_COOKIE_NAME, userId);
  setCookie(
    AUTH_TOKEN_EXPIRES_COOKIE_NAME,
    expiresAt.toString(),
    getCookieExpiryDays(expiresAt),
  );
}

function clearAuthCookies() {
  deleteCookie(AUTH_TOKEN_COOKIE_NAME);
  deleteCookie(AUTH_USER_ID_COOKIE_NAME);
  deleteCookie(AUTH_TOKEN_EXPIRES_COOKIE_NAME);
}

/** Returns the URL only if it starts with http:// or https://. Prevents javascript: URI injection. */
export function safeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

/** Derive user initials from a display name (up to 2 letters). */
export function getInitials(name?: string | null): string {
  const safeName = name?.trim();

  if (!safeName) {
    return "";
  }

  return safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await loginApi(email, password);
          setAuthCookies(data.access_token, data.user.id, data.expires_at);
          set({ user: data.user.profile, isAuthenticated: true });
        } catch (e){
          console.log("Login error",e)
        } 
        finally {
          set({ isLoading: false });
        }
      },

      signup: async (name, email, password, phone) => {
        set({ isLoading: true });
        try {
          const data = await signupApi(name, email, password, phone);
          if (data && data.success) {
            await loginApi(email, password).then((loginData) => {
              setAuthCookies(
                loginData.access_token,
                loginData.user.id,
                loginData.expires_at,
              );
              set({ user: loginData.user.profile, isAuthenticated: true });
            });
          }
        } catch (e) {
          console.error("Signup failed:", e);
        } finally {
          set({ isLoading: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      logout: () => {
        clearAuthCookies();
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "holy-grills-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
