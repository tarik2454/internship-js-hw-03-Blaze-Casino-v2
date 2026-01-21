"use client";

import { memo, useCallback, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { ChatMessage } from "@/config-api/chat/chat.types";
import { CurrentUserResponse } from "@/config-api/user/user.types";
import { cx } from "@/shared/utils/classNames";
import styles from "./ChatItem.module.scss";

interface ChatItemProps {
  msg: ChatMessage;
  currentUser: CurrentUserResponse | null | undefined;
  virtualItem: VirtualItem;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  formatTime: (iso: string) => string;
}

const ChatItemContent = memo(
  ({
    msg,
    currentUser,
    formatTime,
  }: {
    msg: ChatMessage;
    currentUser: CurrentUserResponse | null | undefined;
    formatTime: (iso: string) => string;
  }) => {
    return (
      <>
        <div className={styles.messageHeader}>
          <Image
            src={
              msg.avatarURL ??
              (msg.username === currentUser?.username
                ? currentUser?.avatarURL
                : "/images/header/user.svg") ??
              "/images/header/user.svg"
            }
            alt="User avatar"
            width={44}
            height={44}
            className={styles.messageUserAvatar}
          />
          <div className={styles.messageUserName}>
            {msg.username || currentUser?.username || "Unknown"}
          </div>
          <div className={styles.messageTime}>{formatTime(msg.createdAt)}</div>
        </div>
        <p className={styles.messageContent}>{msg.text}</p>
      </>
    );
  },
);

ChatItemContent.displayName = "ChatItemContent";

export function ChatItem({
  msg,
  currentUser,
  virtualItem,
  virtualizer,
  formatTime,
}: ChatItemProps) {
  "use no memo";
  const virtualizerRef = useRef(virtualizer);

  useLayoutEffect(() => {
    virtualizerRef.current = virtualizer;
  }, [virtualizer]);

  const measureRef = useCallback((node: HTMLLIElement | null) => {
    if (node) {
      virtualizerRef.current.measureElement(node);
    }
  }, []);

  return (
    <li
      className={cx(styles.chatItem, {
        [styles.myChatItem]: msg.username === currentUser?.username,
      })}
      data-index={virtualItem.index}
      ref={measureRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        transform: `translateY(${virtualItem.start}px)`,
      }}
    >
      <ChatItemContent
        msg={msg}
        currentUser={currentUser}
        formatTime={formatTime}
      />
    </li>
  );
}
