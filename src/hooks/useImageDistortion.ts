import { RefObject, useCallback } from "react";
import { useDistortion } from "./useDistortion";
import { createImageTexture } from "./textureFactories";

export interface ImageDistortionOptions {
  src: string;
  containerRef: RefObject<HTMLDivElement | null>;
  gridSize?: number;
  intensity?: number;
  radius?: number;
  easeFactor?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function useImageDistortion(options: ImageDistortionOptions) {
  const {
    src,
    containerRef,
    gridSize = 80.0,
    intensity = 0.2,
    radius = 0.35,
    easeFactor = 0.02,
    onLoad,
    onError,
  } = options;

  const textureFactory = useCallback(
    () =>
      createImageTexture({
        src,
        onLoad,
        onError,
      }),
    [src, onLoad, onError]
  );

  useDistortion({
    createTexture: textureFactory,
    containerRef,
    gridSize,
    intensity,
    radius,
    easeFactor,
  });
}
