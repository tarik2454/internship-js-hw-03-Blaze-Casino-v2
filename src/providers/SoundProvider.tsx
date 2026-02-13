"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type SoundContextValue = {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (value: number) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const DEFAULT_VOLUME = 0.5;

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);

  useEffect(() => {
    const savedMuted = localStorage.getItem("sound-muted");
    const savedVolume = localStorage.getItem("sound-volume");

    requestAnimationFrame(() => {
      if (savedMuted === "true") setIsMuted(true);

      if (savedVolume !== null) {
        const parsed = parseFloat(savedVolume);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          setVolumeState(parsed);
        }
      }
    });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("sound-muted", String(next));
      return next;
    });
  }, []);

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    setVolumeState(clamped);
    localStorage.setItem("sound-volume", String(clamped));
  }, []);

  return (
    <SoundContext.Provider value={{ isMuted, volume, toggleMute, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const ctx = useContext(SoundContext);
  if (!ctx)
    throw new Error("useSoundContext must be used within SoundProvider");
  return ctx;
}
