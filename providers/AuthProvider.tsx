"use client";

import { fetchUserProfile } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data.profile);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [logout, setLoading, setUser]);

  return <>{children}</>;
}
