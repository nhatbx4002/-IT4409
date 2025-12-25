export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role?: string;
  provider?: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}
