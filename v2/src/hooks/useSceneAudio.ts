import { useEffect } from "react";

import { useAudio } from "../context/AudioContext";
import { getTrackForScene } from "../engines/audio/audioMood";
import type { SceneName } from "../engines/sceneEngine";

/**
 * Keeps the playing audio track in sync with the current scene.
 * Changing scenes triggers a fade-out → fade-in transition.
 */
export function useSceneAudio(scene: SceneName) {
  const { unlocked, currentTrack, playTrack } = useAudio();

  useEffect(() => {
    if (!unlocked) {
      return;
    }

    const desired = getTrackForScene(scene);

    if (desired === currentTrack) {
      return;
    }

    void playTrack(desired);
  }, [scene, unlocked, currentTrack, playTrack]);
}
