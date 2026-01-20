import { RefObject, useCallback } from "react";
import { useDistortion } from "./useDistortion";
import { createTextTexture } from "./textureFactories";

export interface TextDistortionOptions {
  text: string;
  font?: string;
  fontSize?: number;
  fontWeight?: string;
  textColor?: string;
  backgroundColor?: string;
  gridSize?: number;
  intensity?: number;
  radius?: number;
  easeFactor?: number;
  containerRef: RefObject<HTMLDivElement | null>;
}

export function useTextDistortion(options: TextDistortionOptions) {
  const {
    text,
    font = "Italiana",
    fontSize = 400,
    fontWeight = "400",
    textColor = "#001F3D",
    backgroundColor = "#F3F0F0",
    gridSize = 80.0,
    intensity = 0.2,
    radius = 0.35,
    easeFactor = 0.02,
    containerRef,
  } = options;

  const textureFactory = useCallback(
    () =>
      createTextTexture({
        text,
        font,
        fontSize,
        fontWeight,
        textColor,
        backgroundColor,
      }),
    [text, font, fontSize, fontWeight, textColor, backgroundColor]
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
