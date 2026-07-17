import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAuthAddress,
  deleteAuthAddress,
  fetchAuthAddresses,
  updateAuthAddress,
  type AuthAddress,
  type AuthAddressPayload,
} from '@/lib/api/auth';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/auth-session';
import { getCookie } from '@/lib/cookies';
import { useAuthStore } from '@/stores/authStore';

export const AUTH_ADDRESSES_QUERY_KEY = ['auth', 'addresses'];

export interface SaveAuthAddressInput {
  addressId?: string;
  payload: AuthAddressPayload;
}

function getAddressTimestamp(address: AuthAddress): number {
  const source = address.updated_at ?? address.created_at;

  if (!source) {
    return 0;
  }

  const epoch = Date.parse(source);
  return Number.isNaN(epoch) ? 0 : epoch;
}

export function getLatestAuthAddress(addresses: AuthAddress[]): AuthAddress | undefined {
  if (!addresses.length) {
    return undefined;
  }

  return [...addresses].sort((a, b) => {
    const timeDiff = getAddressTimestamp(b) - getAddressTimestamp(a);

    if (timeDiff !== 0) {
      return timeDiff;
    }

    return b.id.localeCompare(a.id);
  })[0];
}

export function useAuthAddressesQuery({ enabled = true }: { enabled?: boolean } = {}) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasToken = Boolean(getCookie(AUTH_TOKEN_COOKIE_NAME));

  return useQuery({
    queryKey: AUTH_ADDRESSES_QUERY_KEY,
    queryFn: fetchAuthAddresses,
    enabled: enabled && hasHydrated && (isAuthenticated || hasToken),
    staleTime: 60_000,
    retry: 1,
  });
}

export function useSaveAuthAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, payload }: SaveAuthAddressInput) =>
      addressId ? updateAuthAddress(addressId, payload) : createAuthAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_ADDRESSES_QUERY_KEY });
    },
  });
}

export function useDeleteAuthAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => deleteAuthAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_ADDRESSES_QUERY_KEY });
    },
  });
}
