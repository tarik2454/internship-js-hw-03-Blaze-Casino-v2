export interface CurrentUserResponse {
  _id?: string;
  username: string;
  email: string;
  balance: number;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
  avatarURL?: string;
}

export interface UserSummary {
  username: string;
  gamesPlayed: number;
  balance: number;
}

export interface UpdateUserRequest {
  username?: string;
  balance?: number;
  totalWagered?: number;
  gamesPlayed?: number;
  totalWon?: number;
  avatarURL?: string;
}

export interface UpdateUserResponse {
  _id?: string;
  username: string;
  email: string;
  balance: number;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
  avatarURL?: string;
}

export type UserListResponse = UserSummary[];
