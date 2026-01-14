import Image from "next/image";
import styles from "./Chat.module.scss";
import { ArrowTop } from "@/shared/icons/arrow-top";

export async function Chat() {
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

      <ul className={styles.usersList}>
        <li className={styles.userItem}>250 online</li>
        <li className={styles.userItem}>250 online</li>
        <li className={styles.userItem}>250 online</li>
      </ul>

      <ul className={styles.chatList}>
        <li className={styles.chatItem}>
          <div className={styles.messageHeader}>
            <Image
              src="/images/header/user.svg"
              alt="User avatar"
              width={44}
              height={44}
              className={styles.messageUserAvatar}
            />
            <div className={styles.messageUserName}>John Doe</div>
            <div className={styles.messageTime}>12:00</div>
          </div>
          <p className={styles.messageContent}>Hello</p>
        </li>
        <li className={styles.chatItem}>
          <div className={styles.messageHeader}>
            <Image
              src="/images/header/user.svg"
              alt="User avatar"
              width={44}
              height={44}
              className={styles.messageUserAvatar}
            />
            <div className={styles.messageUserName}>John Doe</div>
            <div className={styles.messageTime}>12:00</div>
          </div>
          <p className={styles.messageContent}>Hello</p>
        </li>
        <li className={styles.chatItem}>
          <div className={styles.messageHeader}>
            <Image
              src="/images/header/user.svg"
              alt="User avatar"
              width={44}
              height={44}
              className={styles.messageUserAvatar}
            />
            <div className={styles.messageUserName}>John Doe</div>
            <div className={styles.messageTime}>12:00</div>
          </div>
          <p className={styles.messageContent}>Hello</p>
        </li>
      </ul>

      <form className={styles.chatForm}>
        <input
          type="text"
          id="chat-message"
          name="message"
          placeholder="Write a message..."
          className={styles.chatInput}
        />
        <button className={styles.chatButton}>
          <ArrowTop />
        </button>
      </form>
    </section>
  );
}
