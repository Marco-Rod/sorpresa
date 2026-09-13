const MUSIC_MUTED_KEY = "garden:music-muted";

export function getStoredMuted(): boolean {
  return localStorage.getItem(MUSIC_MUTED_KEY) === "true";
}

export function storeMuted(muted: boolean) {
  localStorage.setItem(MUSIC_MUTED_KEY, String(muted));
}
