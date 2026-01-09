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
