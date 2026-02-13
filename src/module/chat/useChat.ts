"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { usePathname } from "next/navigation";
import { getCookie } from "@/config-api/cookies";
import { useCurrentUser } from "@/config-api/user/useUser";
import { usePopup, POPUP_TYPE } from "@/providers/PopupProvider";
import {
  ChatMessage,
  ChatHistoryResponse,
  ChatRoomUsersResponse,
} from "@/config-api/chat/chat.ws.types";
import { ROUTE_TO_ROOM } from "@/config-api/chat/chat.ws.constants";
import {
  ChatSocketService,
  createChatSocket,
} from "@/config-api/chat/chat.ws.service";

export function useChat() {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();
  const { showPopup } = usePopup();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCounts, setOnlineCounts] = useState<Record<string, number>>({});
  const [room, setRoom] = useState<string>(
    () => ROUTE_TO_ROOM[pathname] || "general",
  );

  const socketServiceRef = useRef<ChatSocketService | null>(null);
  const roomRef = useRef(room);

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

    const socketService = createChatSocket();
    socketServiceRef.current = socketService;

    socketService.connect(token, roomRef.current, {
      onHistory: (data: ChatHistoryResponse) => {
        if (data.roomId === roomRef.current) {
          setMessages(data.messages);
        }
      },
      onMessage: (msg: ChatMessage) => {
        if (msg.roomId === roomRef.current) {
          setMessages((prev) => {
            if (prev.some((m) => m._id === msg._id)) {
              return prev;
            }
            return [...prev, msg];
          });
        }
      },
      onRoomUsers: (data: ChatRoomUsersResponse) => {
        setOnlineCounts((prev) => ({
          ...prev,
          [data.roomId]: data.activeUsers,
        }));
      },
      onError: (err: { message: string }) => {
        const isAuthError =
          /auth|token|unauthorized/i.test(err.message);

        if (isAuthError) {
          socketService.disconnect();
          socketServiceRef.current = null;
          return;
        }

        showPopup({
          message: err.message,
          type: POPUP_TYPE.ERROR,
          autoCloseDelay: 5000,
        });
      },
    });

    return () => {
      socketService.disconnect();
      socketServiceRef.current = null;
    };
  }, [currentUser?._id, showPopup]);

  useEffect(() => {
    if (!currentUser && socketServiceRef.current) {
      socketServiceRef.current.disconnect();
      socketServiceRef.current = null;
    }
  }, [currentUser]);

  useEffect(() => {
    const socketService = socketServiceRef.current;
    if (!socketService || !socketService.isConnected()) return;

    const currentRoom = socketService.getCurrentRoom();
    if (currentRoom !== room) {
      socketService.joinRoom(room);
    }
  }, [room]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const socketService = socketServiceRef.current;
    if (!socketService || !currentUser || !currentUser._id) return;

    socketService.sendMessage(
      room,
      text,
      currentUser.username,
      currentUser._id,
    );
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
