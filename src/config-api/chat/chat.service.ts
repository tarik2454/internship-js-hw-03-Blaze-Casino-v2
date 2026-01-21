import { io, Socket } from "socket.io-client";
import {
  ChatMessage,
  ChatHistoryResponse,
  ChatRoomUsersResponse,
} from "./chat.types";

export interface ChatSocketCallbacks {
  onConnect?: (roomId: string) => void;
  onHistory?: (data: ChatHistoryResponse) => void;
  onMessage?: (msg: ChatMessage) => void;
  onRoomUsers?: (data: ChatRoomUsersResponse) => void;
  onError?: (err: { message: string }) => void;
}

export const createChatSocket = () => {
  let socket: Socket | null = null;
  let currentRoom: string | null = null;
  let callbacks: ChatSocketCallbacks = {};

  const setupEventHandlers = () => {
    if (!socket) return;

    socket.on("connect", () => {
      if (currentRoom) {
        joinRoom(currentRoom);
      }
    });

    socket.on("connect_error", () => {});
    socket.on("disconnect", () => {});

    socket.on("chat:history", (data: ChatHistoryResponse) => {
      if (data.roomId === currentRoom) {
        callbacks.onHistory?.(data);
      }
    });

    socket.on("message", (msg: ChatMessage) => {
      if (msg.roomId === currentRoom) {
        callbacks.onMessage?.(msg);
      }
    });

    socket.on("chat:room:users", (data: ChatRoomUsersResponse) => {
      callbacks.onRoomUsers?.(data);
    });

    socket.on("chat:error", (err: { message: string }) => {
      callbacks.onError?.(err);
    });
  };

  const connect = (
    token: string,
    initialRoom: string,
    initialCallbacks: ChatSocketCallbacks,
  ) => {
    if (typeof window === "undefined") return;

    callbacks = initialCallbacks;
    currentRoom = initialRoom;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "/";

    socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
    });

    setupEventHandlers();
  };

  const joinRoom = (roomId: string) => {
    if (!socket || !socket.connected) return;

    if (currentRoom && currentRoom !== roomId) {
      leaveRoom(currentRoom);
    }

    socket.emit("chat:join", { roomId });
    currentRoom = roomId;
    callbacks.onConnect?.(roomId);
  };

  const leaveRoom = (roomId: string) => {
    if (!socket || !socket.connected) return;

    socket.emit("chat:leave", { roomId });
    if (currentRoom === roomId) {
      currentRoom = null;
    }
  };

  const sendMessage = (
    roomId: string,
    message: string,
    username: string,
    userId: string,
  ) => {
    if (!socket || !message.trim()) return;

    socket.emit("chat:message", {
      roomId,
      message,
      username,
      userId,
    });
  };

  const disconnect = () => {
    if (!socket) return;

    if (socket.connected && currentRoom) {
      socket.emit("chat:leave", { roomId: currentRoom });
      currentRoom = null;
    }

    if (socket.connected) {
      socket.disconnect();
    } else {
      socket.close();
    }

    socket = null;
  };

  const isConnected = (): boolean => {
    return socket?.connected ?? false;
  };

  const getCurrentRoom = (): string | null => {
    return currentRoom;
  };

  return {
    connect,
    joinRoom,
    leaveRoom,
    sendMessage,
    disconnect,
    isConnected,
    getCurrentRoom,
  };
};

export type ChatSocketService = ReturnType<typeof createChatSocket>;
