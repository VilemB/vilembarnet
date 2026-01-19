"use client";

import { useRef } from "react";

export default function Home() {

  const textContainerRef = useRef<HTMLDivElement>(null);
  
  let easeFactor = 0.02;
  
  let scene, camera, renderer, planeMesh;

  let mousePosition = { x: 0.5, y: 0.5};
  let targetMousePosition = { x: 0.5, y: 0.5};
  let prevMousePosition = { x: 0.5, y: 0.5};

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;

    void main() {
      vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
      vec2 centerOfPixel = gridUV + vec2(1.0/40.0, 1.0/40.0);
      
      vec2 mouseDirection = u_mouse - u_prevMouse;
      
      vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
      float pixelDistanceToMouse = length(pixelToMouseDirection);
      float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
      
      vec2 uvOffset = strength * -mouseDirection * 0.3;
      vec2 uv = vUv - uvOffset;

      vec4 color = texture2D(uTexture, uv);
      gl_FragColor = color;
    }
  `;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div ref={textContainerRef} id="textContainer">
          <h1 className="text-6xl mb-4">vilem barnet</h1>
        </div>
        <p className="text-xl text-dark/70">
          Your Next.js project is ready to build.
        </p>
      </div>
    </main>
  );
}
