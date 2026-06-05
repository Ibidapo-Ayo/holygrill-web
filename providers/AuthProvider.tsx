"use client";

import { fetchUserProfile, normalizeProfile } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(normalizeProfile(data.profile));
      } catch {
        // Keep the auth session from login/signup response while profile route is unavailable.
        if (!user) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [hasHydrated, isAuthenticated, setLoading, setUser, user]);

  return <>{children}</>;
}
