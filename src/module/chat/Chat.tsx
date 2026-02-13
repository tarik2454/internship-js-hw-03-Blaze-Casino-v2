"use client";

import { useRef, FormEvent, useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import styles from "./Chat.module.scss";
import { ArrowTop } from "@/shared/icons/arrow-top";
import { useUsers } from "@/config-api/user/useUser";
import { useChat } from "./useChat";
import { cx } from "@/shared/utils/classNames";
import { formatTime } from "./chat.utils";
import { ChatItem } from "./components/ChatItem";
import { Section } from "@/shared/components/Section";
import { MessageIcon } from "@/shared/icons/message";
import { ChatTitleIcon } from "@/shared/icons/chat-title";
import { Button } from "@/shared/components/Button";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";

export function Chat() {
  "use no memo";
  const { locale } = useLocale();
  const t = getTranslations(locale);
  const { messages, onlineCount, currentUser, sendMessage } = useChat();

  const { data: usersData } = useUsers();
  const totalUsers = usersData?.length || 0;

  const parentRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useLockBodyScroll(isVisible);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => (isMounted ? parentRef.current : null),
    estimateSize: () => 120,
    getItemKey: (index) => messages[index]?._id || index,
    overscan: 3,
    gap: 16,
  });

  const isFirstScrollRef = useRef(true);

  const isAtBottom = (el: HTMLElement, threshold = 20) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  useEffect(() => {
    if (!isMounted || !parentRef.current || messages.length === 0) return;

    const scrollElement = parentRef.current;

    if (isFirstScrollRef.current) {
      const rafId = requestAnimationFrame(() => {
        virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
        isFirstScrollRef.current = false;
      });

      return () => cancelAnimationFrame(rafId);
    }

    if (!isAtBottom(scrollElement)) return;

    const rafId = requestAnimationFrame(() => {
      virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
    });

    return () => cancelAnimationFrame(rafId);
  }, [messages.length, virtualizer, isMounted]);

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
      <div
        className={cx(styles.chatWrapper, { [styles.isVisible]: isVisible })}
        onClick={(e) => e.stopPropagation()}
      >
        <Section className={styles.chat}>
          <div className={styles.chatTitleWrapper}>
            <ChatTitleIcon />
          </div>

          <ul className={styles.usersList}>
            <li className={styles.userItem}>
              {onlineCount} {t.chat.online}
            </li>
            <li className={styles.userItem}>
              {totalUsers} {t.chat.friends}
            </li>
          </ul>

          <div ref={parentRef} className={styles.chatListContainer}>
            {isMounted ? (
              <div
                className={styles.chatList}
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {(() => {
                  const virtualItems = virtualizer.getVirtualItems();

                  return virtualItems.map((virtualItem) => {
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
                        locale={locale}
                      />
                    );
                  });
                })()}
              </div>
            ) : (
              <div className={styles.chatList} style={{ width: "100%" }}></div>
            )}
          </div>

          <form className={styles.chatForm} onSubmit={handleSendMessage}>
            <input
              type="text"
              id="chat-message"
              name="message"
              placeholder={t.chat.messagePlaceholder}
              className={styles.chatInput}
              ref={messageInputRef}
            />
            <button
              type="submit"
              className={styles.chatButton}
              aria-label={t.chat.sendMessage}
            >
              <ArrowTop />
            </button>
          </form>
        </Section>
      </div>

      <div
        className={cx(styles.chatOverlay, { [styles.isVisible]: isVisible })}
        onClick={handleOpenChat}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleOpenChat();
          }
        }}
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
