"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getCookie } from "@/shared/utils/cookies";
import { useCurrentUser } from "@/config-api/user/useUser";
import {
  ChatMessage,
  ChatHistoryResponse,
  ChatStatsResponse,
} from "./chat.types";
import { ROUTE_TO_ROOM } from "./chat.constants";

export function useChat() {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCounts, setOnlineCounts] = useState<Record<string, number>>({});
  const [room, setRoom] = useState<string>(
    () => ROUTE_TO_ROOM[pathname] || "general",
  );

  const socketRef = useRef<Socket | null>(null);
  const roomRef = useRef(room);

  /* ---------------- roomRef sync ---------------- */
  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  /* ---------------- room from route ---------------- */
  useEffect(() => {
    const targetRoom = ROUTE_TO_ROOM[pathname];
    if (!targetRoom || targetRoom === roomRef.current) return;

    startTransition(() => {
      setMessages([]);
      setRoom(targetRoom);
    });
  }, [pathname]);

  /* ---------------- socket init (depends on token) ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getCookie("accessToken");
    if (!token) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "/";
    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("chat:join", { roomId: roomRef.current });
    });

    socket.on("chat:history", (data: ChatHistoryResponse) => {
      console.log("📨 Received chat:history:", {
        roomId: data.roomId,
        currentRoom: roomRef.current,
        messagesCount: data.messages.length,
        firstMessage: data.messages[0],
        lastMessage: data.messages[data.messages.length - 1],
      });

      if (data.roomId === roomRef.current) {
        setMessages(data.messages);
        console.log("✅ Messages set to state:", data.messages.length);
      }
    });

    socket.on("message", (msg: ChatMessage) => {
      console.log("💬 Received new message:", {
        roomId: msg.roomId,
        currentRoom: roomRef.current,
        username: msg.username,
        text: msg.text,
      });

      if (msg.roomId === roomRef.current) {
        setMessages((prev) => {
          // защита от дублей
          if (prev.some((m) => m._id === msg._id)) {
            console.log("⚠️ Duplicate message detected, skipping:", msg._id);
            return prev;
          }
          console.log("✅ Adding message to state. Total:", prev.length + 1);
          return [...prev, msg];
        });
      }
    });

    socket.on("chat:stats", (data: ChatStatsResponse) => {
      setOnlineCounts((prev) => ({
        ...prev,
        [roomRef.current]: data.onlineCount,
      }));
    });

    socket.on("chat:error", (err: { message: string }) => {
      console.error("Chat error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?._id]); // ← важно: переподключение после логина

  /* ---------------- room change ---------------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;

    socket.emit("chat:join", { roomId: room });

    return () => {
      socket.emit("chat:leave", { roomId: room });
    };
  }, [room]);

  /* ---------------- actions ---------------- */
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    if (!socketRef.current || !currentUser) return;

    socketRef.current.emit("chat:message", {
      roomId: room,
      message: text,
      username: currentUser.username,
      userId: currentUser._id,
    });
  };

  const handleRoomChange = (newRoom: string) => {
    if (newRoom === roomRef.current) return;

    startTransition(() => {
      setMessages([]);
      setRoom(newRoom);
    });
  };

  const onlineCount = onlineCounts[room] ?? 0;

  return {
    messages,
    room,
    onlineCount,
    currentUser,
    sendMessage,
    handleRoomChange,
  };
}
