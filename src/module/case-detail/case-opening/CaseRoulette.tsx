"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseItem, CaseOpeningItem } from "@/config-api/cases/cases.types";
import { CaseDetailItem } from "../CaseDetailItem";
import { CaseOpeningActions } from "./CaseOpeningActions";
import styles from "./CaseRoulette.module.scss";

const ROULETTE_DURATION_MS = 4000;
const ITEM_WIDTH = 100;
const REPEAT_COUNT = 20;

interface CaseRouletteProps {
  items: CaseItem[];
  winningItem: CaseOpeningItem;
  onAnimationEnd?: () => void;
  itemValue: number;
  sellPrice: number;
  onTryAgain: () => void;
}

export function CaseRoulette({
  items,
  winningItem,
  onAnimationEnd,
  itemValue,
  sellPrice,
  onTryAgain,
}: CaseRouletteProps) {
  const [isStopped, setIsStopped] = useState(false);
  const stripRef = useRef<HTMLUListElement>(null);
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

    const gapPx = getComputedStyle(strip).gap;
    const gap = parseFloat(gapPx) || 0;
    const slotWidth = ITEM_WIDTH + gap;
    const stripWidth =
      extendedItems.length * ITEM_WIDTH + (extendedItems.length - 1) * gap;
    strip.style.width = `${stripWidth}px`;

    const startAnimation = () => {
      const viewportWidth = viewport.getBoundingClientRect().width;
      const centerOffset =
        targetItemIndex * slotWidth + ITEM_WIDTH / 2 - viewportWidth / 2;
      const targetTranslate = Math.max(0, centerOffset);

      strip.style.transition = `transform ${ROULETTE_DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
      strip.style.transform = `translateX(-${targetTranslate}px)`;
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(startAnimation);
    });

    const timer = setTimeout(() => {
      setIsStopped(true);
      onAnimationEndRef.current?.();
    }, ROULETTE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [targetItemIndex, extendedItems.length, items.length]);

  return (
    <div className={styles.rouletteWrapper}>
      <div ref={viewportRef} className={styles.rouletteViewport}>
        <ul ref={stripRef} className={styles.rouletteStrip}>
          {extendedItems.map((item, index) => (
            <CaseDetailItem
              key={`${item.id}-${index}`}
              item={item}
              classNameWrapper={styles.rouletteItem}
              classNameName={styles.rouletteItemName}
              classNameImage={styles.rouletteItemImage}
            />
          ))}
        </ul>
        <div className={styles.rouletteCenterLine} aria-hidden />
      </div>

      <CaseOpeningActions
        itemValue={itemValue}
        sellPrice={sellPrice}
        onTryAgain={onTryAgain}
        revealPrice={isStopped}
        className={styles.rouletteActions}
      />
    </div>
  );
}
