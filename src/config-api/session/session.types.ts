export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarURL?: string;
}
