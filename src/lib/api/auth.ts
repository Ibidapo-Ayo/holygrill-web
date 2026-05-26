import { apiClient } from "./client";

export interface SignupAuthResponse {
  user_id: string;
  name: string;
  email: string;
  success: boolean;
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
  profile:AuthUserProfileResponse;
}

export interface AuthLoginResponse {
  access_token: string;
  expires_at: number;
  message: string;
  refresh_token: string;
  success: boolean;
  user: {
    email: string;
    id: string;
    profile: AuthUserProfileResponse;
  };
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
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
  try {
    const { data } = await apiClient.post<SignupAuthResponse>("/auth/signup", {
      full_name: name,
      email: email,
      password: password,
      phone: phone_number,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchUserProfile(): Promise<UserResponse> {
  const { data } =
    await apiClient.get<UserResponse>("/user/profile");
  return data;
}

export async function requestPasswordResetApi(
  email: string,
): Promise<ForgotPasswordResponse> {
  const { data } = await apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", {
    email,
  });
  return data;
}

export async function resetPasswordApi(
  accessToken: string,
  password: string,
): Promise<ResetPasswordResponse> {
  const { data } = await apiClient.post<ResetPasswordResponse>("/auth/reset-password", {
    access_token: accessToken,
    password,
  });
  return data;
}


export async function updateUserProfileApi(
  profileData: Partial<AuthUserProfileResponse>,
): Promise<UserResponse> {  
  const { data } = await apiClient.put<UserResponse>("/user/profile", profileData);
  return data;
}
