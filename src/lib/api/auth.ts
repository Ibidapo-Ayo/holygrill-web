import { apiClient } from './client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
}

interface AuthResponse {
  data: { token: string; user: AuthUser };
  message: string;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse['data']> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return data.data;
}

export async function signupApi(
  name: string,
  email: string,
  password: string,
  phone_number?: string
): Promise<AuthResponse['data']> {
  const { data } = await apiClient.post<AuthResponse>('/auth/signup', {
    name,
    email,
    password,
    phone_number,
  });
  return data.data;
}
