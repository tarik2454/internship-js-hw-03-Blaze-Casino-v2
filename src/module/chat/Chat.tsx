"use client";

import { useRef, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useVirtualizer } from "@tanstack/react-virtual";
import styles from "./Chat.module.scss";
import { ArrowTop } from "@/shared/icons/arrow-top";
import { useUsers } from "@/config-api/user/useUser";
import { useChat } from "./useChat";
import { ROOMS } from "./chat.constants";
import { cx } from "@/shared/utils/classNames";
import { formatTime } from "./utils";
import { ChatItem } from "./components/ChatItem";
import { Section } from "@/shared/components/Section";
import { MessageIcon } from "@/shared/icons/message";
import { Button } from "@/shared/components/Button";

export function Chat() {
  "use no memo";
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

  const [isVisible, setIsVisible] = useState(false);

  function useChatVirtualizer() {
    "use no memo";
    return useVirtualizer({
      count: messages.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 120,
      getItemKey: (index) => messages[index]?._id || index,
      overscan: 3,
      gap: 16,
    });
  }

  const virtualizer = useChatVirtualizer();

  useEffect(() => {
    if (messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
    }
  }, [messages.length, virtualizer]);

  // Прокрутка к последнему сообщению при открытии мобильного чата
  useEffect(() => {
    if (isVisible && messages.length > 0) {
      // Небольшая задержка для корректной работы виртуализатора после отображения
      setTimeout(() => {
        virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
      }, 100);
    }
  }, [isVisible, messages.length, virtualizer]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!messageInputRef.current) return;

    const val = messageInputRef.current.value.trim();
    if (!val) return;

    sendMessage(val);
    messageInputRef.current.value = "";
  };

  const handleOpenChat = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <div className={cx(styles.chatWrapper, { [styles.visible]: isVisible })}>
        <Section className={styles.chat}>
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
                  <ChatItem
                    key={msg._id}
                    msg={msg}
                    currentUser={currentUser}
                    virtualItem={virtualItem}
                    virtualizer={virtualizer}
                    formatTime={formatTime}
                  />
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
        </Section>
      </div>

      <div
        className={cx(styles.chatOverlay, { [styles.visible]: isVisible })}
        onClick={handleOpenChat}
      ></div>

      <div className={styles.chatButtonMobileWrapper}>
        <Button
          stylesVariant="yellowGradient"
          className={styles.chatButtonMobile}
          onClick={handleOpenChat}
        >
          <MessageIcon />
        </Button>
      </div>
    </>
  );
}
