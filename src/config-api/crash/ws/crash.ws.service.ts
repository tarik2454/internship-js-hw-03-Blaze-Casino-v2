import { io, Socket } from "socket.io-client";
import {
  GameTickEvent,
  GameCrashEvent,
  SubscribeGamePayload,
} from "./crash.ws.types";
import { CRASH_SOCKET } from "./crash.ws.constants";

export interface CrashSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onTick?: (data: GameTickEvent) => void;
  onCrash?: (data: GameCrashEvent) => void;
}

export const createCrashSocket = () => {
  let socket: Socket | null = null;
  let currentGameId: string | null = null;
  let callbacks: CrashSocketCallbacks = {};

  const connect = (initialCallbacks: CrashSocketCallbacks) => {
    if (typeof window === "undefined") return;
    if (socket?.connected) return;

    callbacks = initialCallbacks;
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "/";

    socket = io(`${socketUrl}${CRASH_SOCKET.NAMESPACE}`, {
      transports: ["websocket"],
      // Без аутентификации
    });

    socket.on("connect", () => {
      callbacks.onConnect?.();
      // Переподписаться на игру после реконнекта
      if (currentGameId) {
        subscribeToGame(currentGameId);
      }
    });

    socket.on("disconnect", () => {
      callbacks.onDisconnect?.();
    });

    socket.on(CRASH_SOCKET.EVENTS.GAME_TICK, (data: GameTickEvent) => {
      if (data.gameId === currentGameId) {
        callbacks.onTick?.(data);
      }
    });

    socket.on(CRASH_SOCKET.EVENTS.GAME_CRASH, (data: GameCrashEvent) => {
      if (data.gameId === currentGameId) {
        callbacks.onCrash?.(data);
        currentGameId = null; // Игра завершена
      }
    });
  };

  const subscribeToGame = (gameId: string) => {
    if (!socket?.connected) return;

    currentGameId = gameId;
    socket.emit(CRASH_SOCKET.EVENTS.SUBSCRIBE_GAME, {
      gameId,
    } as SubscribeGamePayload);
  };

  const disconnect = () => {
    if (!socket) return;

    currentGameId = null;
    socket.disconnect();
    socket = null;
  };

  const isConnected = () => socket?.connected ?? false;
  const getCurrentGameId = () => currentGameId;

  return {
    connect,
    subscribeToGame,
    disconnect,
    isConnected,
    getCurrentGameId,
  };
};

export type CrashSocketService = ReturnType<typeof createCrashSocket>;
