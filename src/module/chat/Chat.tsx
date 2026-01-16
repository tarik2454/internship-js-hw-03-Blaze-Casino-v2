"use client";

import { useRef, FormEvent, useEffect } from "react";
import Image from "next/image";
import { useVirtualizer } from "@tanstack/react-virtual";
import styles from "./Chat.module.scss";
import { ArrowTop } from "@/shared/icons/arrow-top";
import { useUsers } from "@/config-api/user/useUser";
import { useChat } from "./useChat";
import { ROOMS } from "./chat.constants";
import { cx } from "@/shared/utils/classNames";

export function Chat() {
  const {
    messages,
    room,
    onlineCount,
    currentUser,
    sendMessage,
    handleRoomChange,
  } = useChat();

  const { data: usersData } = useUsers();
  const totalUsers = usersData?.length || 0;

  const parentRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
    gap: 16,
  });

  // Auto-scroll logic in useEffect
  useEffect(() => {
    if (messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
    }
  }, [messages.length, virtualizer]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!messageInputRef.current) return;

    const val = messageInputRef.current.value.trim();
    if (!val) return;

    sendMessage(val);
    messageInputRef.current.value = "";
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    if (isNaN(date.getTime())) {
      return "00:00 AM";
    }
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <section className={styles.chat}>
      <div className={styles.chatTitleWrapper}>
        <Image
          src="/images/chat/chat-title.svg"
          alt="Chat title"
          width={100}
          height={18}
        />
      </div>

      <div className={styles.roomButtons}>
        {ROOMS.map((r) => (
          <button
            key={r.id}
            className={cx(styles.roomButton, {
              [styles.activeRoomButton]: room === r.id,
            })}
            onClick={() => handleRoomChange(r.id)}
          >
            {r.name}
          </button>
        ))}
      </div>

      <ul className={styles.usersList}>
        <li className={styles.userItem}>{onlineCount} online</li>
        <li className={styles.userItem}>{totalUsers} friends</li>
      </ul>

      <div ref={parentRef} className={styles.chatListContainer}>
        <div
          className={styles.chatList}
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const msg = messages[virtualItem.index];
            if (!msg) return null;

            return (
              <li
                key={virtualItem.index}
                className={cx(styles.chatItem, {
                  [styles.myChatItem]: msg.username === currentUser?.username,
                })}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
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
                  <div className={styles.messageTime}>
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
                <p className={styles.messageContent}>{msg.text}</p>
              </li>
            );
          })}
        </div>
      </div>

      <form className={styles.chatForm} onSubmit={handleSendMessage}>
        <input
          type="text"
          id="chat-message"
          name="message"
          placeholder="Write a message..."
          className={styles.chatInput}
          ref={messageInputRef}
        />
        <button type="submit" className={styles.chatButton}>
          <ArrowTop />
        </button>
      </form>
    </section>
  );
}
