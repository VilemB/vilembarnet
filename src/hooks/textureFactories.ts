import * as THREE from "three";

export interface TextTextureOptions {
  text: string;
  font: string;
  fontSize: number;
  fontWeight: string;
  textColor: string;
  backgroundColor: string;
  canvasWidth?: number;
  canvasHeight?: number;
}

export interface ImageTextureOptions {
  src: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function createTextTexture(options: TextTextureOptions): THREE.Texture | null {
  const { text, font, fontSize, fontWeight, textColor, backgroundColor, canvasWidth: providedWidth, canvasHeight: providedHeight } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // First, measure the text to determine natural dimensions
  const computedFontSize = fontSize || 400;
  ctx.font = `${fontWeight} ${computedFontSize}px "${font}"`;

  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

  // Create canvas sized to fit text with minimal padding
  const padding = computedFontSize * 0.2;
  const naturalCanvasWidth = textWidth + padding * 2;
  const naturalCanvasHeight = textHeight + padding * 2;

  // Use provided dimensions if available, otherwise use natural dimensions
  const canvasWidth = providedWidth ?? naturalCanvasWidth;
  const canvasHeight = providedHeight ?? naturalCanvasHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = textColor;
  ctx.font = `${fontWeight} ${computedFontSize}px "${font}"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Calculate uniform scale factor to fit text in canvas
  const scaleX = (canvasWidth * 0.9) / textWidth;
  const scaleY = (canvasHeight * 0.9) / textHeight;
  const scaleFactor = Math.min(scaleX, scaleY, 1);

  ctx.setTransform(
    scaleFactor,
    0,
    0,
    scaleFactor,
    canvasWidth / 2,
    canvasHeight / 2
  );

  ctx.lineWidth = computedFontSize * 0.005;
  for (let i = 0; i < 3; i++) {
    ctx.strokeText(text, 0, 0);
  }
  ctx.fillText(text, 0, 0);

  return new THREE.CanvasTexture(canvas);
}

export function createImageTexture(options: ImageTextureOptions): THREE.Texture | null {
  const { src, onLoad, onError } = options;

  const loader = new THREE.TextureLoader();

  try {
    const texture = loader.load(
      src,
      () => {
        texture.needsUpdate = true;
        onLoad?.();
      },
      undefined,
      (error) => {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    );

    return texture;
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}
