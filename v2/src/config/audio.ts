export type AudioTrackId =
  | "waiting"
  | "sunset"
  | "birthday";

export interface AudioTrackConfig {
  id: AudioTrackId;

  src: string;

  loop: boolean;

  volume: number;
}

export const AUDIO_TRACKS: Record<
  AudioTrackId,
  AudioTrackConfig
> = {
  waiting: {
    id: "waiting",
    src: "/audio/waiting.mp3",
    loop: true,
    volume: 0.55,
  },

  sunset: {
    id: "sunset",
    src: "/audio/sunset.mp3",
    loop: true,
    volume: 0.58,
  },

  birthday: {
    id: "birthday",
    src: "/audio/birthday.mp3",
    loop: false,
    volume: 0.68,
  },
};
