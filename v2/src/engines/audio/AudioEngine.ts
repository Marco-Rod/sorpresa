import {
  AUDIO_TRACKS,
  type AudioTrackId,
} from "../../config/audio";

interface FadeOptions {
  duration?: number;
}

export class AudioEngine {
  private audio: HTMLAudioElement;

  private currentTrack: AudioTrackId | null = null;

  private unlocked = false;

  private muted: boolean;

  private fadeFrameId: number | null = null;

  private fadeResolve: (() => void) | null = null;

  private targetVolume = 1;

  private transitionId = 0;

  constructor(initialMuted = false) {
    this.audio = new Audio();
    this.audio.preload = "metadata";
    // playsInline is not in the TS lib types but is required on iOS Safari
    // to prevent full-screen takeover.
    (this.audio as HTMLAudioElement & { playsInline: boolean }).playsInline =
      true;
    this.muted = initialMuted;
  }

  getCurrentTrack(): AudioTrackId | null {
    return this.currentTrack;
  }

  isUnlocked(): boolean {
    return this.unlocked;
  }

  isMuted(): boolean {
    return this.muted;
  }

  /**
   * Must be called from a real user-gesture handler.
   * Loads and briefly plays the given track at volume 0
   * to satisfy browser autoplay policies, then pauses.
   */
  async unlock(
    trackId: AudioTrackId = "waiting",
  ): Promise<boolean> {
    if (this.unlocked) {
      return true;
    }

    const track = AUDIO_TRACKS[trackId];

    this.audio.src = track.src;
    this.audio.loop = track.loop;
    this.audio.volume = 0;

    try {
      await this.audio.play();

      this.audio.pause();
      this.audio.currentTime = 0;

      this.unlocked = true;
      this.currentTrack = null;

      return true;
    } catch {
      return false;
    }
  }

  async playTrack(
    trackId: AudioTrackId,
    options: { fade?: boolean } = {},
  ): Promise<void> {
    if (!this.unlocked) {
      return;
    }

    if (
      this.currentTrack === trackId &&
      !this.audio.paused
    ) {
      return;
    }

    const { fade = true } = options;

    // Guard against race conditions: stamp this transition.
    const transitionId = ++this.transitionId;

    const track = AUDIO_TRACKS[trackId];

    // Fade out current track before switching.
    if (fade && this.currentTrack && !this.audio.paused) {
      await this.fadeTo(0, { duration: 700 });

      if (transitionId !== this.transitionId) {
        return;
      }
    }

    this.cancelFade();
    this.audio.pause();
    this.audio.src = track.src;
    this.audio.loop = track.loop;
    this.audio.currentTime = 0;

    this.targetVolume = track.volume;
    this.currentTrack = trackId;

    // Start silent when fading in, otherwise start at full volume.
    this.audio.volume = this.muted || fade ? 0 : track.volume;

    try {
      await this.audio.play();

      if (transitionId !== this.transitionId) {
        return;
      }

      if (fade && !this.muted) {
        await this.fadeTo(track.volume, { duration: 1200 });
      }
    } catch (error) {
      console.warn("[AudioEngine] Could not play track:", trackId, error);
    }
  }

  pause(): void {
    this.audio.pause();
  }

  async resume(): Promise<void> {
    if (!this.unlocked || !this.currentTrack) {
      return;
    }

    try {
      await this.audio.play();
    } catch {
      // Browser may still block resume after background — safe to ignore.
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.audio.volume = muted ? 0 : this.targetVolume;
  }

  toggleMuted(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  destroy(): void {
    this.cancelFade();
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.audio.load();
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  private cancelFade(): void {
    if (this.fadeFrameId !== null) {
      cancelAnimationFrame(this.fadeFrameId);
      this.fadeFrameId = null;
    }

    // Resolve any pending fade promise so awaiting callers are not blocked.
    if (this.fadeResolve) {
      this.fadeResolve();
      this.fadeResolve = null;
    }
  }

  private fadeTo(
    volume: number,
    { duration = 900 }: FadeOptions = {},
  ): Promise<void> {
    this.cancelFade();

    if (this.muted) {
      this.audio.volume = 0;
      return Promise.resolve();
    }

    const startVolume = this.audio.volume;
    const target = Math.max(0, Math.min(volume, 1));
    const startTime = performance.now();

    return new Promise(resolve => {
      this.fadeResolve = resolve;

      const animate = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Smoothstep easing.
        const eased = progress * progress * (3 - 2 * progress);

        this.audio.volume =
          startVolume + (target - startVolume) * eased;

        if (progress >= 1) {
          this.fadeFrameId = null;
          this.fadeResolve = null;
          resolve();
          return;
        }

        this.fadeFrameId = requestAnimationFrame(animate);
      };

      this.fadeFrameId = requestAnimationFrame(animate);
    });
  }
}
