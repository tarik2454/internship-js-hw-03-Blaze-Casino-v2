"use client";

import { useEffect, useRef, useState } from "react";
import { createCrashSocket, CrashSocketService } from "./crash.ws.service";
import { GameTickEvent, GameCrashEvent } from "./crash.ws.types";
import { useCrashCurrent } from "@/config-api/crash/useCrash";

export function useCrashSocket() {
  const { data: currentGame, refetch: refetchCurrentGame } = useCrashCurrent();

  // Только данные из WebSocket в реальном времени
  const [multiplier, setMultiplier] = useState(1.0);
  const [elapsed, setElapsed] = useState(0);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);

  const socketRef = useRef<CrashSocketService | null>(null);

  useEffect(() => {
    const socket = createCrashSocket();
    socketRef.current = socket;

    socket.connect({
      onConnect: () => {
        console.log("Connected to crash socket");
        // Подписаться на текущую игру если есть
        if (currentGame?.gameId) {
          socket.subscribeToGame(currentGame.gameId);
        }
      },
      onTick: (data: GameTickEvent) => {
        setMultiplier(data.multiplier);
        setElapsed(data.elapsed);
      },
      onCrash: (data: GameCrashEvent) => {
        setCrashPoint(data.crashPoint);
        // Загрузить следующую игру через 3 секунды
        setTimeout(() => {
          refetchCurrentGame();
          setCrashPoint(null);
          setMultiplier(1.0);
        }, 3000);
      },
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Подписаться на новую игру когда currentGame меняется
  useEffect(() => {
    if (currentGame?.gameId && socketRef.current?.isConnected()) {
      socketRef.current.subscribeToGame(currentGame.gameId);
      setMultiplier(1.0);
      setCrashPoint(null);
    }
  }, [currentGame?.gameId]);

  // Состояние игры берём напрямую с сервера
  const isRunning = currentGame?.state === "running";
  const canBet = currentGame?.state === "waiting" && !currentGame?.myBet;

  return {
    multiplier,
    elapsed,
    isRunning,
    canBet,
    crashPoint,
    gameId: currentGame?.gameId,
    betId: currentGame?.myBet?.betId,
    gameState: currentGame?.state,
  };
}
