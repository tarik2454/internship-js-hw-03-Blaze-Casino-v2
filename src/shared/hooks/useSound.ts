import { Howl } from "howler";
import { useEffect, useRef } from "react";
import { useSoundContext } from "@/providers/SoundProvider";

const SOUNDS = {
  click: "/sounds/click.wav",
  cardFlip: "/sounds/card-flip.mp3",
  reveal: "/sounds/reveal.mp3",
  result: "/sounds/result.mp3",
};

const VOLUME_SCALE: Record<keyof typeof SOUNDS, number> = {
  click: 1,
  cardFlip: 0.2,
  reveal: 1,
  result: 1,
};

export const useSound = () => {
  const { isMuted, volume, toggleMute, setVolume } = useSoundContext();
  const sounds = useRef<Record<keyof typeof SOUNDS, Howl | null>>({
    click: null,
    cardFlip: null,
    reveal: null,
    result: null,
  });

  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, src]) => {
      const scale = VOLUME_SCALE[key as keyof typeof SOUNDS];
      sounds.current[key as keyof typeof SOUNDS] = new Howl({
        src: [src],
        volume: volume * scale,
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

  const playSound = (type: keyof typeof SOUNDS) => {
    if (!isMuted && sounds.current[type]) {
      if (type !== "cardFlip") {
        sounds.current[type]?.stop();
      }
      sounds.current[type]?.play();
    }
  };

  return { playSound, isMuted, volume, toggleMute, setVolume };
};
