"use client";

import { useEffect, useState, useRef } from "react";
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<string>(
    () => ROUTE_TO_ROOM[pathname] || "general",
  );
  const roomRef = useRef(room);
  const socketRef = useRef<Socket | null>(null);
  const { data: currentUser } = useCurrentUser();
  const [onlineCount, setOnlineCount] = useState<number>(0);

  // Sync roomRef with room state
  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  // Handle route-based room switching
  useEffect(() => {
    const targetRoom = ROUTE_TO_ROOM[pathname];
    if (targetRoom && targetRoom !== room) {
      setMessages([]);
      setRoom(targetRoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Socket initialization
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getCookie("accessToken");
    if (!token) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "/";
    const s = io(socketUrl, { auth: { token } });
    socketRef.current = s;

    s.on("connect", () => {
      s.emit("chat:join", { roomId: roomRef.current });
    });

    s.on("chat:history", (data: ChatHistoryResponse) => {
      if (data.roomId === roomRef.current) {
        setMessages(data.messages);
      }
    });

    s.on("message", (msg: ChatMessage) => {
      if (msg.roomId === roomRef.current) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    s.on("chat:error", (err: { message: string }) => {
      console.error("Chat error:", err.message);
    });

    s.on("chat:stats", (data: ChatStatsResponse) => {
      setOnlineCount(data.onlineCount);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // Room transition logic
  useEffect(() => {
    const s = socketRef.current;
    if (!s || !s.connected) return;

    s.emit("chat:join", { roomId: room });

    return () => {
      s.emit("chat:leave", { roomId: room });
    };
  }, [room]);

  const sendMessage = (text: string) => {
    if (!socketRef.current || !currentUser) return;

    socketRef.current.emit("chat:message", {
      roomId: room,
      message: text,
      username: currentUser.username,
      userId: currentUser._id,
    });
  };

  const handleRoomChange = (newRoom: string) => {
    if (newRoom === room) return;
    setMessages([]);
    setRoom(newRoom);
  };

  return {
    messages,
    room,
    onlineCount,
    currentUser,
    sendMessage,
    handleRoomChange,
  };
}
