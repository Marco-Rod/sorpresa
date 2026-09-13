const preloadedImages = new Set<string>();

/**
 * Kicks off an async decode of an image so it is ready in the browser cache
 * before it is needed. Safe to call multiple times for the same src.
 */
export async function preloadImage(src: string): Promise<void> {
  if (preloadedImages.has(src)) return;

  preloadedImages.add(src);

  const image = new Image();
  image.decoding = "async";
  image.src = src;

  try {
    await image.decode();
  } catch {
    // Non-critical: the image will still load on demand.
  }
}
