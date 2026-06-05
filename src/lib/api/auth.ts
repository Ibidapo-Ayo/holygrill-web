import { AUTH_TOKEN_COOKIE_NAME } from "../auth-session";
import { getCookie } from "../cookies";
import { apiClient } from "./client";

export interface AuthSessionUser {
  user: {
    id: string;
    role: string;
    email: string;
    createdAt?: string;
  };
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
  department: string | null;
  email: string;
  email_notifications: boolean;
  faculty: string | null;
  full_name: string;
  has_scheduled_order: boolean;
  hp_balance: number;
  id: string;
  is_active: boolean;
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

export interface UserResponse {
  profile: AuthUserProfileResponse;
}

export interface AuthLoginResponse {
  user: AuthSessionUser["user"];
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export function getLoginAccessToken(data): string | null {
  return getCookie(AUTH_TOKEN_COOKIE_NAME) ?? null;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthLoginResponse> {
  const { data } = await apiClient.post<AuthLoginResponse>("/auth/login", {
    email,
    password,
  });
  return data;
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
    refreshToken,
  });

  return data;
}

export async function fetchUserProfile(): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>("/user/profile");
  return data;
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

export async function updateUserProfileApi(
  profileData: Partial<AuthUserProfileResponse>,
): Promise<UserResponse> {
  const { data } = await apiClient.put<UserResponse>(
    "/user/profile",
    profileData,
  );
  return data;
}
