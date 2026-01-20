export interface CurrentUserResponse {
  _id?: string;
  username: string;
  email: string;
  balance: number;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
  avatarURL?: string; // Keep this just in case, though not in spec
}

export interface UserSummary {
  username: string;
  gamesPlayed: number;
  balance: number;
}

export type UserListResponse = UserSummary[];
