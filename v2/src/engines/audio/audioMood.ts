import type { AudioTrackId } from "../../config/audio";
import type { SceneName } from "../sceneEngine";

/**
 * Maps a scene to the audio track that should be playing.
 *
 * Narrative mapping:
 *   morning / day            → waiting track  (Mi suerte)
 *   sunset / night           → sunset track   (Yellow)
 *   final-countdown          → sunset track   (maintains tension until zero)
 *   birthday                 → birthday track (Tu cumpleaños)
 */
export function getTrackForScene(scene: SceneName): AudioTrackId {
  switch (scene) {
    case "sunset":
    case "night":
    case "final-countdown":
      return "sunset";

    case "birthday":
      return "birthday";

    default:
      return "waiting";
  }
}
