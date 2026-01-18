"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getCookie } from "@/shared/utils/cookies";
import { useCurrentUser } from "@/config-api/user/useUser";
import { usePopup, POPUP_TYPE } from "@/app/providers/PopupProvider";
import {
  ChatMessage,
  ChatHistoryResponse,
  ChatRoomUsersResponse,
} from "./chat.types";
import { ROUTE_TO_ROOM } from "./chat.constants";

export function useChat() {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();
  const { showPopup } = usePopup();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCounts, setOnlineCounts] = useState<Record<string, number>>({});
  const [room, setRoom] = useState<string>(
    () => ROUTE_TO_ROOM[pathname] || "general",
  );

  const socketRef = useRef<Socket | null>(null);
  const roomRef = useRef(room);
  const currentJoinedRoomRef = useRef<string | null>(null);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    const targetRoom = ROUTE_TO_ROOM[pathname];
    if (!targetRoom || targetRoom === roomRef.current) return;

    startTransition(() => {
      setMessages([]);
      setRoom(targetRoom);
    });
  }, [pathname]);

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
      if (roomRef.current && currentJoinedRoomRef.current !== roomRef.current) {
        socket.emit("chat:join", { roomId: roomRef.current });
        currentJoinedRoomRef.current = roomRef.current;
      }
    });

    socket.on("chat:history", (data: ChatHistoryResponse) => {
      if (data.roomId === roomRef.current) {
        setMessages(data.messages);
      }
    });

    socket.on("message", (msg: ChatMessage) => {
      if (msg.roomId === roomRef.current) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) {
            return prev;
          }

          return [...prev, msg];
        });
      }
    });

    socket.on("chat:room:users", (data: ChatRoomUsersResponse) => {
      setOnlineCounts((prev) => ({
        ...prev,
        [data.roomId]: data.activeUsers,
      }));
    });

    socket.on("chat:error", (err: { message: string }) => {
      console.error("Chat error:", err.message);
      showPopup({
        message: err.message,
        type: POPUP_TYPE.ERROR,
        autoCloseDelay: 5000,
      });
    });

    return () => {
      if (socket.connected && currentJoinedRoomRef.current) {
        socket.emit("chat:leave", { roomId: currentJoinedRoomRef.current });
        currentJoinedRoomRef.current = null;
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?._id]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;

    if (currentJoinedRoomRef.current !== room) {
      socket.emit("chat:join", { roomId: room });
      currentJoinedRoomRef.current = room;
    }

    return () => {
      if (socket.connected && currentJoinedRoomRef.current) {
        socket.emit("chat:leave", { roomId: currentJoinedRoomRef.current });
        currentJoinedRoomRef.current = null;
      }
    };
  }, [room]);

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
