"use client";

import { useEffect, useRef } from "react";
import type {
  CaseItem,
  CaseOpeningItem,
} from "@/config-api/cases/cases.types";
import styles from "./CaseRoulette.module.scss";

function isValidImageSrc(src: string | undefined): src is string {
  return typeof src === "string" && src.trim().length > 0;
}

const ROULETTE_DURATION_MS = 4000;
const ITEM_WIDTH = 100;
const REPEAT_COUNT = 20;

interface CaseRouletteProps {
  items: CaseItem[];
  winningItem: CaseOpeningItem;
  onAnimationEnd?: () => void;
}

export function CaseRoulette({
  items,
  winningItem,
  onAnimationEnd,
}: CaseRouletteProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const onAnimationEndRef = useRef(onAnimationEnd);
  onAnimationEndRef.current = onAnimationEnd;

  const winningIndex = items.findIndex((i) => i.id === winningItem.id);
  const safeWinningIndex = winningIndex >= 0 ? winningIndex : 0;
  const extendedItems = Array(REPEAT_COUNT)
    .fill(null)
    .flatMap(() => items);

  const lapsToScroll = Math.floor(REPEAT_COUNT / 2) - 1;
  const targetItemIndex = lapsToScroll * items.length + safeWinningIndex;

  useEffect(() => {
    if (extendedItems.length === 0 || items.length === 0) return;

    const strip = stripRef.current;
    const viewport = viewportRef.current;
    if (!strip || !viewport) return;

    strip.style.transition = `none`;
    strip.style.transform = `translateX(0)`;

    const startAnimation = () => {
      const viewportWidth = viewport.getBoundingClientRect().width;
      const centerOffset =
        targetItemIndex * ITEM_WIDTH + ITEM_WIDTH / 2 - viewportWidth / 2;
      const targetTranslate = Math.max(0, centerOffset);

      strip.style.transition = `transform ${ROULETTE_DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
      strip.style.transform = `translateX(-${targetTranslate}px)`;
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(startAnimation);
    });

    const timer = setTimeout(() => {
      onAnimationEndRef.current?.();
    }, ROULETTE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [targetItemIndex, extendedItems.length, items.length]);

  return (
    <div className={styles.rouletteWrapper}>
      <div ref={viewportRef} className={styles.rouletteViewport}>
        <div
          ref={stripRef}
          className={styles.rouletteStrip}
          style={{ width: extendedItems.length * ITEM_WIDTH }}
        >
          {extendedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={styles.rouletteItem}
              style={{ width: ITEM_WIDTH }}
            >
              {isValidImageSrc(item.imageUrl) ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className={styles.rouletteItemImage}
                />
              ) : (
                <div
                  className={styles.rouletteItemImage}
                  style={{
                    width: 80,
                    height: 80,
                    background: "var(--color-bg-secondary, #333)",
                  }}
                  aria-hidden
                />
              )}
              <span className={styles.rouletteItemName}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.rouletteCenterLine} aria-hidden />
    </div>
  );
}
