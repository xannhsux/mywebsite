/**
 * Generate placeholder grayscale photo data URIs.
 * Each generates a canvas-based desaturated rectangle image.
 * In production, replace these with actual photographs.
 */

const PLACEHOLDER_COUNT = 10;

/**
 * Creates a grayscale placeholder data URI using canvas.
 * Each placeholder has a unique gray tone and subtle grain.
 */
export function createPlaceholderDataURI(width, height, seed) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Base gray fill with variation per seed
  const baseGray = 140 + (seed * 17) % 80;
  ctx.fillStyle = `rgb(${baseGray}, ${baseGray}, ${baseGray})`;
  ctx.fillRect(0, 0, width, height);

  // Add subtle grain
  for (let i = 0; i < width * height * 0.03; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const gray = baseGray + (Math.random() - 0.5) * 40;
    ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.3)`;
    ctx.fillRect(x, y, 1, 1);
  }

  // Add a subtle darker rectangle to suggest composition
  const innerGray = baseGray - 20;
  ctx.fillStyle = `rgba(${innerGray}, ${innerGray}, ${innerGray}, 0.3)`;
  const margin = Math.min(width, height) * 0.2;
  ctx.fillRect(margin, margin, width - margin * 2, height - margin * 2);

  return canvas.toDataURL('image/jpeg', 0.85);
}

/**
 * Pre-defined photo configurations for the hero floating photos.
 * Each has width, height, and layout position offsets (% from center).
 */
export const PHOTO_CONFIGS = [
  { w: 120, h: 90,  x: -35, y: -30, rotation: -2 },
  { w: 100, h: 130, x:  30, y: -25, rotation:  3 },
  { w: 130, h: 95,  x: -40, y:  15, rotation:  1 },
  { w: 95,  h: 120, x:  35, y:  20, rotation: -3 },
  { w: 110, h: 85,  x: -25, y: -45, rotation:  2 },
  { w: 90,  h: 110, x:  42, y: -40, rotation: -1 },
  { w: 140, h: 100, x: -45, y:  35, rotation:  2 },
  { w: 105, h: 135, x:  28, y:  38, rotation: -2 },
  { w: 115, h: 90,  x: -15, y:  42, rotation:  1 },
  { w: 100, h: 100, x:  15, y: -42, rotation: -3 },
];

export { PLACEHOLDER_COUNT };
