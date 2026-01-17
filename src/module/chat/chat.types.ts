export interface ChatMessage {
  _id: string;
  roomId: string;
  username: string;
  text: string;
  userId: string;
  avatarURL?: string;
  time: string;
  createdAt: string;
}

export interface ChatHistoryResponse {
  roomId: string;
  messages: ChatMessage[];
}

export interface ChatStatsResponse {
  onlineCount: number;
}

export interface ChatRoomUsersResponse {
  roomId: string;
  activeUsers: number;
}
