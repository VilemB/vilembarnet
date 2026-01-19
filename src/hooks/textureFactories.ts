import * as THREE from "three";

export interface TextTextureOptions {
  text: string;
  font: string;
  fontSize: number;
  fontWeight: string;
  textColor: string;
  backgroundColor: string;
}

export interface ImageTextureOptions {
  src: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function createTextTexture(options: TextTextureOptions): THREE.Texture | null {
  const { text, font, fontSize, fontWeight, textColor, backgroundColor } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const canvasWidth = window.innerWidth * 2;
  const canvasHeight = window.innerHeight * 2;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (!ctx) {
    return null;
  }

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const computedFontSize = fontSize || Math.floor(canvasWidth * 2);

  ctx.fillStyle = textColor;
  ctx.font = `${fontWeight} ${computedFontSize}px "${font}"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;

  const scaleFactor = Math.min(1, canvasWidth / textWidth);
  const aspectCorrection = canvasWidth / canvasHeight;

  ctx.setTransform(
    scaleFactor,
    0,
    0,
    scaleFactor / aspectCorrection,
    canvasWidth / 2,
    canvasHeight / 2
  );

  ctx.strokeStyle = "#F3F0F0";
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
