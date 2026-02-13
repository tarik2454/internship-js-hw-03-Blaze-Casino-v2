"use client";

import { useEffect, useRef, useState } from "react";
import { createCrashSocket, CrashSocketService } from "./crash.ws.service";
import { GameTickEvent, GameCrashEvent } from "./crash.ws.types";
import { GAME_STATE } from "./crash.ws.constants";
import { useCrashCurrent } from "@/config-api/crash/useCrash";

export function useCrashSocket() {
  const { data: currentGame, refetch: refetchCurrentGame } = useCrashCurrent();

  const [multiplier, setMultiplier] = useState(1.0);
  const [elapsed, setElapsed] = useState(0);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);

  const socketRef = useRef<CrashSocketService | null>(null);

  useEffect(() => {
    const socket = createCrashSocket();
    socketRef.current = socket;

    socket.connect({
      onConnect: () => {
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
        refetchCurrentGame();
      },
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [refetchCurrentGame]);

  useEffect(() => {
    if (currentGame?.gameId && socketRef.current?.isConnected()) {
      socketRef.current.subscribeToGame(currentGame.gameId);
      setMultiplier(1.0);
      setCrashPoint(null);
    }
  }, [currentGame?.gameId]);

  const canBet =
    currentGame?.state === GAME_STATE.WAITING && !currentGame?.myBet;

  return {
    multiplier,
    elapsed,
    canBet,
    crashPoint,
    gameId: currentGame?.gameId,
    betId: currentGame?.myBet?.betId,
    betAmount: currentGame?.myBet?.amount,
    gameState: currentGame?.state,
  };
}
