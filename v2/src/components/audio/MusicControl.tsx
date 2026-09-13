import { useAudio } from "../../context/AudioContext";

export function MusicControl() {
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
      className="music-control"
      onClick={handleClick}
      aria-label={muted ? "Activar música" : "Silenciar música"}
    >
      {muted ? "♫̸" : "♫"}
    </button>
  );
}
