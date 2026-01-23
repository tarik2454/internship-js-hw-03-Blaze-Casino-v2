export const generateMultiplierLevels = (
  max: number,
  step: number,
): number[] => {
  const levels: number[] = [];
  for (let i = 1.0; i <= max; i += step) {
    levels.push(Math.round(i * 10) / 10);
  }
  return levels;
};

export const generateTimeLevels = (
  maxSeconds: number,
  step: number,
): number[] => {
  const levels: number[] = [];
  for (let i = 0; i <= maxSeconds; i += step) {
    levels.push(i);
  }
  return levels;
};

export const generateVisibleMultiplierLevels = (
  currentMultiplier: number,
  visibleRange: number = 5.0,
  step: number = 0.2,
  min: number = 1.0,
  max: number = 10.0,
): number[] => {
  const start = Math.max(
    min,
    Math.floor((currentMultiplier - visibleRange) * 10) / 10,
  );
  const end = Math.min(
    max,
    Math.ceil((currentMultiplier + visibleRange) * 10) / 10,
  );

  const levels: number[] = [];
  for (let i = start; i <= end; i += step) {
    const rounded = Math.round(i * 10) / 10;
    if (rounded >= min && rounded <= max) {
      levels.push(rounded);
    }
  }
  return levels;
};

export const generateVisibleTimeLevels = (
  currentSeconds: number,
  visibleRange: number = 15,
  step: number = 3,
  min: number = 0,
  max: number = 60,
): number[] => {
  const start = Math.max(
    min,
    Math.floor((currentSeconds - visibleRange) / step) * step,
  );
  const end = Math.min(
    max,
    Math.ceil((currentSeconds + visibleRange) / step) * step,
  );

  const levels: number[] = [];
  for (let i = start; i <= end; i += step) {
    if (i >= min && i <= max) {
      levels.push(i);
    }
  }
  return levels;
};

// Функции-обертки с предустановленными параметрами для UI игры Crash

export const getMultiplierLevels = (multiplier: number): number[] => {
  return generateVisibleMultiplierLevels(multiplier, 5.0, 0.2, 1.0, 10.0);
};

export const getTimeLevels = (elapsedSeconds: number): number[] => {
  return generateVisibleTimeLevels(elapsedSeconds, 40, 3, 0, 120);
};
