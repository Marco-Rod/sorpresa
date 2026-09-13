import { useAudio } from "../../context/AudioContext";

export function MusicControl({ inline = false }: { inline?: boolean }) {
  const { unlocked, muted, unlock, toggleMuted } = useAudio();

  const handleClick = async () => {
    if (!unlocked) {
      // First tap: unlock audio and start playback.
      await unlock();
      return;
    }

    // Subsequent taps: toggle mute.
    toggleMuted();
  };

  return (
    <button
      type="button"
      className={inline ? "home-page__sound" : "music-control"}
      onClick={handleClick}
      aria-label={!unlocked ? "Toca para comenzar la música" : muted ? "Activar música" : "Silenciar música"}
    >
      {muted ? "♫̸" : "♫"}
      {inline && <span>{!unlocked ? "Toca para comenzar la música 🎵" : muted ? "Activar música 🎵" : "Pausar la música"}</span>}
    </button>
  );
}
