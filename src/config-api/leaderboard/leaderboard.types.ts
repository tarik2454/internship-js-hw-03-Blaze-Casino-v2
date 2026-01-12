export interface LeaderboardResponse {
  players: {
    rank: number;
    username: string;
    avatarURL: string;
    totalWagered: number;
    gamesPlayed: number;
    winRate: number;
  }[];
  currentUser: {
    rank: number;
    username: string;
    avatarURL: string;
    totalWagered: number;
    gamesPlayed: number;
    winRate: number;
  };
}
