"use client";

import { useEffect, useRef } from "react";
import type { CaseItem, CaseOpeningItem } from "@/config-api/cases/cases.types";
import { CaseDetailItem } from "../CaseDetailItem";
import styles from "./CaseRoulette.module.scss";
import Image from "next/image";
import { Button } from "@/shared/components/Button";

const ROULETTE_DURATION_MS = 4000;
const ITEM_WIDTH = 100;
const REPEAT_COUNT = 20;

interface CaseRouletteProps {
  items: CaseItem[];
  winningItem: CaseOpeningItem;
  onAnimationEnd?: (skipped?: boolean) => void;
}

export function CaseRoulette({
  items,
  winningItem,
  onAnimationEnd,
}: CaseRouletteProps) {
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
  }, [targetItemIndex, extendedItems.length, items.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEndRef.current?.(false);
    }, ROULETTE_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

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

      <Button
        className={styles.rouletteSkipButton}
        onClick={() => onAnimationEnd?.(true)}
      >
        skip animation
      </Button>

      <div className={styles.imageWrapper}>
        <Image
          src="/images/cases/chest.svg"
          alt="roulette arrow"
          fill
          className={styles.image}
        />
      </div>
    </div>
  );
}
