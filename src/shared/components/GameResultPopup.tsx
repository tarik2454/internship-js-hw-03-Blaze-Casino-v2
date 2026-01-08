"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { cx } from "@/shared/utils/classNames";
import styles from "./GameResultPopup.module.scss";
import { PopupData, POPUP_TYPE } from "@/app/providers/PopupProvider";

const portalRoot = typeof document !== "undefined" ? document.body : null;

export const GameResultPopup = ({
  resultAmount,
  message,
  type = POPUP_TYPE.SUCCESS,
  onClose,
  autoCloseDelay = 3000,
}: PopupData) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isShouldRender, setIsShouldRender] = useState(true);
  const onCloseRef = useRef(onClose);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeStartRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(autoCloseDelay);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  function startCloseTimer(delay: number) {
    closeStartRef.current = Date.now();
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIsShouldRender(false);
        onCloseRef.current?.();
      }, 300);
    }, delay);
  }

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    startCloseTimer(remainingTimeRef.current);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(timeoutRef.current!);
    };
  }, [autoCloseDelay]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      const elapsed = Date.now() - closeStartRef.current;
      remainingTimeRef.current = Math.max(
        0,
        remainingTimeRef.current - elapsed,
      );
    }
  };

  const handleMouseLeave = () => {
    startCloseTimer(remainingTimeRef.current);
  };

  const handleClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
    setTimeout(() => {
      setIsShouldRender(false);
      onCloseRef.current?.();
    }, 300);
  };

  if (!isShouldRender || !portalRoot) return null;

  const isSuccess =
    type === POPUP_TYPE.SUCCESS ||
    (type === undefined && (resultAmount ?? 0) >= 0);

  const displayMessage = message ?? (isSuccess ? "You won!" : "You lost");
  const displayAmount =
    resultAmount !== undefined
      ? `${isSuccess ? "+" : "-"}${Math.abs(resultAmount).toFixed(2)}$`
      : null;

  return createPortal(
    <div
      className={cx(
        styles.popup,
        isVisible && styles.visible,
        isSuccess && styles.success,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={styles.closeButton} onClick={handleClose}>
        ×
      </button>
      <div className={styles.content}>
        <span className={styles.label}>{displayMessage}</span>
        {displayAmount && (
          <span className={styles.amount}>{displayAmount}</span>
        )}
      </div>
    </div>,
    portalRoot,
  );
};
