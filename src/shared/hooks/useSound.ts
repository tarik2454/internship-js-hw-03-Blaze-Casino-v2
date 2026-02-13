import { Howl } from "howler";
import { useCallback, useEffect, useRef } from "react";
import { useSoundContext } from "@/providers/SoundProvider";

const SOUNDS = {
  startGame: "/sounds/start-game.mp3",
  addingMoney: "/sounds/adding-money.mp3",
  playing: "/sounds/playing.mp3",
  cashout: "/sounds/cashout.mp3",
};

const VOLUME_SCALE: Record<keyof typeof SOUNDS, number> = {
  addingMoney: 1,
  playing: 0.3,
  startGame: 1,
  cashout: 1,
};

const LOOP_SOUNDS: Set<keyof typeof SOUNDS> = new Set(["playing"]);

const START_OFFSET: Partial<Record<keyof typeof SOUNDS, number>> = {
  playing: 2,
};

export const useSound = () => {
  const { isMuted, volume, toggleMute, setVolume } = useSoundContext();
  const sounds = useRef<Record<keyof typeof SOUNDS, Howl | null>>({
    addingMoney: null,
    playing: null,
    startGame: null,
    cashout: null,
  });

  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, src]) => {
      const typedKey = key as keyof typeof SOUNDS;
      const scale = VOLUME_SCALE[typedKey];
      sounds.current[typedKey] = new Howl({
        src: [src],
        volume: volume * scale,
        loop: LOOP_SOUNDS.has(typedKey),
      });
    });

    const currentSounds = sounds.current;

    return () => {
      Object.values(currentSounds).forEach((sound) => sound?.unload());
    };
  }, []);

  useEffect(() => {
    Object.entries(sounds.current).forEach(([key, sound]) => {
      if (sound) {
        const scale = VOLUME_SCALE[key as keyof typeof SOUNDS];
        sound.volume(volume * scale);
      }
    });
  }, [volume]);

  const playSound = useCallback(
    (type: keyof typeof SOUNDS) => {
      if (!isMuted && sounds.current[type]) {
        sounds.current[type].stop();
        sounds.current[type].play();
        const offset = START_OFFSET[type];
        if (offset) {
          sounds.current[type].seek(offset);
        }
      }
    },
    [isMuted],
  );

  const stopSound = useCallback((type: keyof typeof SOUNDS) => {
    if (sounds.current[type]) {
      sounds.current[type].stop();
    }
  }, []);

  return { playSound, stopSound, isMuted, volume, toggleMute, setVolume };
};
