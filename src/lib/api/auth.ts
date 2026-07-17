import { AUTH_TOKEN_COOKIE_NAME } from "../auth-session";
import { getCookie } from "../cookies";
import { apiClient } from "./client";
import { z } from "zod";

const authLoginUserSchema = z
  .object({
    id: z.string(),
    role: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    user_metadata: z
      .object({
        full_name: z.string().optional(),
      })
      .passthrough()
      .optional(),
    created_at: z.string().optional(),
  })
  .passthrough();

const authLoginResponseSchema = z
  .object({
    access_token: z.string(),
    expires_at: z.number(),
    expires_in: z.number(),
    refresh_token: z.string(),
    token_type: z.string(),
    user: authLoginUserSchema,
    weak_password: z.unknown().nullable().optional(),
  })
  .passthrough();

const authStreakResponseSchema = z.object({
  last_login_date: z.string(),
  last_updated: z.string(),
  streak_count: z.number(),
});

const authProfileResponseSchema = z
  .object({
    date_of_birth: z.string().nullable(),
    email_notifications: z.boolean(),
    full_name: z.string(),
    phone: z.string().nullable(),
  })
  .passthrough();

const authProfileUpdatePayloadSchema = z.object({
  date_of_birth: z.string(),
  email_notifications: z.boolean(),
  full_name: z.string(),
  phone: z.string(),
});

export interface AuthUser {
  id: string;
  role: string;
  email: string;
  full_name: string;
  photo_url: string | null;
  hp_balance: number;
  wallet_balance: number;
  date_of_birth?: string | null;
  email_notifications?: boolean;
  created_at?: string;
  createdAt?: string;
  phone?: string | null;
}

export interface AuthSessionUser {
  user: AuthUser;
}

export interface SignupAuthResponse {
  user: AuthSessionUser["user"] & {
    name: string;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthUserProfileResponse {
  created_at: string;
  current_tier_id: string | null;
  date_of_birth: string | null;
  deactivated_at: string | null;
  deactivated_by: string | null;
  deactivation_reason: string | null;
  department: string | null;
  email: string;
  email_notifications: boolean;
  faculty: string | null;
  full_name: string;
  has_scheduled_order: boolean;
  hp_balance: number;
  hp_earned_120day: number;
  id: string;
  is_active: boolean;
  jwt_version: number;
  last_activity_at: string | null;
  last_hp_activity_at: string | null;
  last_seen_at: string | null;
  onboarding_completed_at: string | null;
  phone: string | null;
  photo_url: string | null;
  preferences: Record<string, unknown>;
  push_enabled: boolean;
  referral_code: string;
  referred_by: string | null;
  role: string;
  tier_grace_ends_at: string | null;
  tier_grace_started_at: string | null;
  tier_lost_at: string | null;
  updated_at: string;
  wallet_balance: number;
}

export interface AuthWalletResponse {
  balance: number;
  currency: string;
}

export interface FetchUserProfileResponse {
  email: string;
  full_name: string;
  id: string;
  profile: AuthUserProfileResponse;
  role: string;
  tier: Record<string, unknown> | null;
  wallet: AuthWalletResponse;
}

export interface UserResponse {
  profile: AuthUserProfileResponse;
}

export interface AuthLoginResponse {
  user: AuthSessionUser["user"];
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiresIn: number;
}

export interface AuthStreakResponse {
  last_login_date: string;
  last_updated: string;
  streak_count: number;
}

export interface AuthProfileResponse {
  date_of_birth: string | null;
  email_notifications: boolean;
  full_name: string;
  phone: string | null;
}

export interface AuthProfileUpdatePayload {
  date_of_birth: string;
  email_notifications: boolean;
  full_name: string;
  phone: string;
}

export type AuthAddressLabel = "Home" | "Pickup";

export interface AuthAddress {
  id: string;
  address_line: string;
  city: string;
  state: string;
  is_default: boolean;
  label: AuthAddressLabel;
  landmark: string | null;
  latitude: number;
  longitude: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthAddressPayload {
  address_line: string;
  city: string;
  is_default: boolean;
  label: AuthAddressLabel;
  landmark: string;
  latitude: number;
  longitude: number;
  state: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

const authAddressSchema = z
  .object({
    id: z.string(),
    address_line: z.string(),
    city: z.string(),
    state: z.string(),
    is_default: z.boolean().default(false),
    label: z.enum(["Home", "Pickup"]).default("Home"),
    landmark: z.string().nullable().optional(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .passthrough();

const authAddressPayloadSchema = z.object({
  address_line: z.string().min(1),
  city: z.string().min(1),
  is_default: z.boolean(),
  label: z.enum(["Home", "Pickup"]),
  landmark: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  state: z.string().min(1),
});

type AuthAddressWritePayload = {
  address_line?: string;
  city?: string;
  is_default?: boolean;
  label?: AuthAddressLabel;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  state?: string;
};

function extractAddressesArray(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const shaped = data as Record<string, unknown>;
  const candidates = ["addresses", "data", "items", "results"];

  for (const key of candidates) {
    if (Array.isArray(shaped[key])) {
      return shaped[key] as unknown[];
    }

    const nested = shaped[key];
    if (nested && typeof nested === "object") {
      const nestedRecord = nested as Record<string, unknown>;
      for (const nestedKey of candidates) {
        if (Array.isArray(nestedRecord[nestedKey])) {
          return nestedRecord[nestedKey] as unknown[];
        }
      }
    }
  }

  return [];
}

function normalizeAuthAddressEntity(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  const shaped = data as Record<string, unknown>;

  return {
    ...shaped,
    id: shaped.id ?? shaped.address_id ?? shaped.addressId,
    address_line:
      shaped.address_line ??
      shaped.addressLine ??
      shaped.address ??
      shaped.full_address,
    city: shaped.city ?? shaped.town ?? "",
    state: shaped.state ?? shaped.region ?? "",
    is_default:
      shaped.is_default ?? shaped.isDefault ?? shaped.default ?? false,
    label: shaped.label ?? shaped.type ?? "Home",
    landmark: shaped.landmark ?? null,
    latitude: shaped.latitude ?? shaped.lat,
    longitude: shaped.longitude ?? shaped.lon ?? shaped.lng,
    created_at: shaped.created_at ?? shaped.createdAt,
    updated_at: shaped.updated_at ?? shaped.updatedAt,
  };
}

function extractAddressEntity(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  const shaped = data as Record<string, unknown>;

  if (shaped.address && typeof shaped.address === "object") {
    return shaped.address;
  }

  if (shaped.data && typeof shaped.data === "object") {
    return shaped.data;
  }

  return data;
}

function parseAuthAddress(data: unknown): AuthAddress {
  const parsed = authAddressSchema.parse(normalizeAuthAddressEntity(data));

  return {
    id: parsed.id,
    address_line: parsed.address_line,
    city: parsed.city,
    state: parsed.state,
    is_default: parsed.is_default,
    label: parsed.label,
    landmark: parsed.landmark ?? null,
    latitude: parsed.latitude,
    longitude: parsed.longitude,
    created_at: parsed.created_at,
    updated_at: parsed.updated_at,
  };
}

function extractAddressId(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const shaped = data as Record<string, unknown>;
  const rawId = shaped.id ?? shaped.address_id;

  if (typeof rawId === "string" && rawId.trim()) {
    return rawId;
  }

  return undefined;
}

function findMatchingAddress(
  addresses: AuthAddress[],
  payload: AuthAddressWritePayload,
  addressId?: string,
): AuthAddress | undefined {
  if (addressId) {
    const byId = addresses.find((entry) => entry.id === addressId);
    if (byId) {
      return byId;
    }
  }

  const exact = addresses.find(
    (entry) =>
      entry.address_line === payload.address_line &&
      entry.city === payload.city &&
      entry.state === payload.state &&
      entry.label === payload.label,
  );

  if (exact) {
    return exact;
  }

  return [...addresses]
    .sort((a, b) => {
      const aTime = Date.parse(a.updated_at ?? a.created_at ?? "");
      const bTime = Date.parse(b.updated_at ?? b.created_at ?? "");
      return (
        (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime)
      );
    })
    .find(Boolean);
}

async function resolveAuthAddressAfterWrite(
  responseData: unknown,
  payload: AuthAddressWritePayload,
  addressId?: string,
): Promise<AuthAddress> {
  const entity = extractAddressEntity(responseData);
  const parsed = authAddressSchema.safeParse(entity);

  if (parsed.success) {
    return parseAuthAddress(parsed.data);
  }

  const addresses = await fetchAuthAddresses();
  const matched = findMatchingAddress(
    addresses,
    payload,
    addressId ?? extractAddressId(entity),
  );

  if (matched) {
    return matched;
  }

  // Fallback to payload shape so UI can continue; query invalidation still refreshes with server data.
  return {
    id: addressId ?? extractAddressId(entity) ?? "",
    address_line: payload.address_line ?? "",
    city: payload.city ?? "",
    state: payload.state ?? "",
    is_default: payload.is_default ?? false,
    label: payload.label ?? "Home",
    landmark: payload.landmark || null,
    latitude: payload.latitude ?? 0,
    longitude: payload.longitude ?? 0,
  };
}

export function getLoginAccessToken(data): string | null {
  return getCookie(AUTH_TOKEN_COOKIE_NAME) ?? null;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthLoginResponse> {
  const { data } = await apiClient.post<unknown>("/auth/login", {
    email,
    password,
  });

  const parsedResponse = authLoginResponseSchema.parse(data);

  return {
    user: {
      id: parsedResponse.user.id,
      role: parsedResponse.user.role,
      email: parsedResponse.user.email,
      // Profile-only fields are resolved from /auth/me; keep login mapping minimal.
      full_name:
        parsedResponse.user.user_metadata?.full_name ??
        parsedResponse.user.email,
      photo_url: null,
      hp_balance: 0,
      wallet_balance: 0,
      date_of_birth: null,
      email_notifications: false,
      created_at: parsedResponse.user.created_at,
      createdAt: parsedResponse.user.created_at,
      phone: parsedResponse.user.phone || null,
    },
    accessToken: parsedResponse.access_token,
    refreshToken: parsedResponse.refresh_token,
    expiresAt: parsedResponse.expires_at,
    expiresIn: parsedResponse.expires_in,
  };
}

export async function signupApi(
  name: string,
  email: string,
  password: string,
  phone_number?: string,
): Promise<SignupAuthResponse> {
  const { data } = await apiClient.post<SignupAuthResponse>("/auth/signup", {
    full_name: name,
    email,
    password,
    phone: phone_number,
  });
  return data;
}

export async function logoutApi(refreshToken: string): Promise<void> {
  const { data } = await apiClient.post("/auth/logout", {
    refresh_token: refreshToken,
    refreshToken,
  });

  return data;
}

export async function fetchUserProfile(): Promise<FetchUserProfileResponse> {
  const { data } = await apiClient.get<FetchUserProfileResponse>("/auth/me");
  return data;
}

export async function getAuthStreak(): Promise<AuthStreakResponse> {
  const { data } = await apiClient.get<unknown>("/auth/streak");
  const parsed = authStreakResponseSchema.parse(data);

  return {
    last_login_date: parsed.last_login_date!,
    last_updated: parsed.last_updated!,
    streak_count: parsed.streak_count!,
  };
}

export async function getAuthProfile(): Promise<AuthProfileResponse> {
  const { data } = await apiClient.get<unknown>("/auth/profile");
  const parsed = authProfileResponseSchema.parse(data);

  return {
    date_of_birth: parsed.date_of_birth!,
    email_notifications: parsed.email_notifications!,
    full_name: parsed.full_name!,
    phone: parsed.phone!,
  };
}

export async function updateAuthProfile(
  payload: AuthProfileUpdatePayload,
): Promise<AuthProfileResponse> {
  const validatedPayload = authProfileUpdatePayloadSchema.parse(payload);
  const { data } = await apiClient.patch<unknown>(
    "/auth/profile",
    validatedPayload,
  );
  const parsed = authProfileResponseSchema.parse(data);

  return {
    date_of_birth: parsed.date_of_birth!,
    email_notifications: parsed.email_notifications!,
    full_name: parsed.full_name!,
    phone: parsed.phone!,
  };
}

export async function requestPasswordResetApi(
  email: string,
): Promise<ForgotPasswordResponse> {
  const { data } = await apiClient.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    {
      email,
    },
  );
  return data;
}

export async function resetPasswordApi(
  accessToken: string,
  password: string,
): Promise<ResetPasswordResponse> {
  const { data } = await apiClient.post<ResetPasswordResponse>(
    "/auth/reset-password",
    {
      access_token: accessToken,
      password,
    },
  );
  return data;
}

export async function fetchAuthAddresses(): Promise<AuthAddress[]> {
  const { data } = await apiClient.get<unknown>("/auth/addresses");

  if (Array.isArray(data)) {
    return data as AuthAddress[];
  }

  return extractAddressesArray(data) as AuthAddress[];
}

export async function createAuthAddress(payload: {
  address_line: string;
  city: string;
  is_default: boolean;
  label: AuthAddressLabel;
  landmark: string;
  latitude: number;
  longitude: number;
  state: string;
}): Promise<AuthAddress> {
  const validatedPayload = authAddressPayloadSchema.parse(payload);
  const { data } = await apiClient.post<unknown>(
    "/auth/addresses",
    validatedPayload,
  );
  return resolveAuthAddressAfterWrite(data, validatedPayload);
}

export async function updateAuthAddress(
  addressId: string,
  payload: {
    address_line: string;
    city: string;
    is_default: boolean;
    label: AuthAddressLabel;
    landmark: string;
    latitude: number;
    longitude: number;
    state: string;
  },
): Promise<AuthAddress> {
  const validatedPayload = authAddressPayloadSchema.parse(payload);
  const { data } = await apiClient.patch<unknown>(
    `/auth/addresses/${addressId}`,
    validatedPayload,
  );
  return resolveAuthAddressAfterWrite(data, validatedPayload, addressId);
}

export async function deleteAuthAddress(addressId: string): Promise<void> {
  await apiClient.delete(`/auth/addresses/${addressId}`);
}

export async function updateUserProfileApi(
  profileData: Partial<AuthUserProfileResponse>,
): Promise<UserResponse> {
  const { data } = await apiClient.put<UserResponse>(
    "/user/profile",
    profileData,
  );
  return data;
}
