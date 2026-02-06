"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";


interface PixelatedTextProps {
  children: React.ReactNode;
  className?: string;
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  mobileBreakpoint?: number;
}

interface MouseState {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vX: number;
  vY: number;
}

interface Settings {
  grid: number;
  mouse: number;
  strength: number;
  relaxation: number;
}

export default function PixelatedText({
  children,
  className = "",
  grid = 40,
  mouse = 0.25,
  strength = 0.05,
  relaxation = 0.9,
  mobileBreakpoint = 1000,
}: PixelatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const isDestroyedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;

    if (!container || !textElement) return;

    isDestroyedRef.current = false;

    const isMobile = window.innerWidth < mobileBreakpoint;
    let time = 0;

    const mouseState: MouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    };

    const settings: Settings = { grid, mouse, strength, relaxation };

    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let material: THREE.ShaderMaterial;
    let planeMesh: THREE.Mesh;
    let dataTexture: THREE.DataTexture;

    const createCleanGrid = () => {
      const size = settings.grid;
      const totalSize = size * size * 4;
      const data = new Float32Array(totalSize);

      for (let i = 3; i < totalSize; i += 4) {
        data[i] = 255;
      }

      dataTexture = new THREE.DataTexture(
        data,
        size,
        size,
        THREE.RGBAFormat,
        THREE.FloatType
      );
      dataTexture.magFilter = dataTexture.minFilter = THREE.NearestFilter;

      if (material) {
        material.uniforms.uDataTexture.value = dataTexture;
        material.uniforms.uDataTexture.value.needsUpdate = true;
      }
    };

    const createThreeTexture = (canvas: HTMLCanvasElement) => {
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.flipY = true;
      return texture;
    };

    const createTexture = async () => {
      if (isDestroyedRef.current) return null;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const dpr = window.devicePixelRatio || 2;
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      await document.fonts.ready;

      const computedStyle = window.getComputedStyle(textElement);
      const fontSize = parseFloat(computedStyle.fontSize);
      const fontFamily = computedStyle.fontFamily;
      const fontWeight = computedStyle.fontWeight;
      const color = computedStyle.color;

      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const x = width / 2;
      const y = height / 2 + (fontSize * 0.02);

      ctx.fillText(textElement.textContent || "", x, y);

      return createThreeTexture(canvas);
    };

    const initializeScene = (texture: THREE.Texture) => {
      if (isDestroyedRef.current) return;

      const width = container.offsetWidth;
      const height = container.offsetHeight;

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
      camera.position.z = 1;

      createCleanGrid();

      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`;

      const fragmentShader = `
        uniform sampler2D uDataTexture;
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main() {
          vec4 offset = texture2D(uDataTexture, vUv);
          vec4 color = texture2D(uTexture, vUv - 0.02 * offset.rg);
          gl_FragColor = color;
        }`;

      material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          uTexture: { value: texture },
          uDataTexture: { value: dataTexture },
        },
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
      });

      planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(planeMesh);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0xEEEEEE, 1);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const canvas = renderer.domElement;
      canvas.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto;z-index:2";
      container.appendChild(canvas);
      canvasRef.current = canvas;
    };

    const updateDataTexture = () => {
      if (!dataTexture || isMobile) return;

      const data = dataTexture.image.data as Float32Array;
      const size = settings.grid;
      const relaxationFactor = settings.relaxation;

      for (let i = 0; i < data.length; i += 4) {
        data[i] *= relaxationFactor;
        data[i + 1] *= relaxationFactor;
      }

      if (
        Math.abs(mouseState.vX) < 0.001 &&
        Math.abs(mouseState.vY) < 0.001
      ) {
        mouseState.vX *= 0.9;
        mouseState.vY *= 0.9;
        dataTexture.needsUpdate = true;
        return;
      }

      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * (1 - mouseState.y);
      const maxDist = size * settings.mouse;
      const maxDistSq = maxDist * maxDist;
      const aspect = container.offsetHeight / container.offsetWidth;
      const strengthFactor = settings.strength * 100;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const distance =
            (gridMouseX - i) ** 2 / aspect + (gridMouseY - j) ** 2;
          if (distance < maxDistSq) {
            const index = 4 * (i + size * j);
            const power = Math.min(10, maxDist / Math.sqrt(distance));
            data[index] += strengthFactor * mouseState.vX * power;
            data[index + 1] -= strengthFactor * mouseState.vY * power;
          }
        }
      }

      mouseState.vX *= 0.9;
      mouseState.vY *= 0.9;
      dataTexture.needsUpdate = true;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (isMobile) return;

      const rect = container.getBoundingClientRect();
      const newX = (e.clientX - rect.left) / rect.width;
      const newY = (e.clientY - rect.top) / rect.height;

      mouseState.vX = newX - mouseState.prevX;
      mouseState.vY = newY - mouseState.prevY;
      mouseState.prevX = mouseState.x;
      mouseState.prevY = mouseState.y;
      mouseState.x = newX;
      mouseState.y = newY;
    };

    const render = () => {
      if (isDestroyedRef.current) return;

      time += 0.05;
      updateDataTexture();
      if (material) material.uniforms.time.value = time;
      if (renderer && scene && camera) renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(render);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = async () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(async () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        if (renderer) renderer.setSize(width, height);
        createCleanGrid();

        try {
          const newTexture = await createTexture();
          if (material && newTexture) {
            material.uniforms.uTexture.value = newTexture;
            material.uniforms.uTexture.value.needsUpdate = true;
          }
        } catch (error) {
          console.error("Failed to recreate texture on resize:", error);
        }
      }, 100);
    };

    const init = async () => {
      if (isMobile) {
        textElement.style.opacity = "1";
        return;
      }

      textElement.style.opacity = "";

      await new Promise((resolve) => setTimeout(resolve, 100));
      if (isDestroyedRef.current) return;

      const texture = await createTexture();
      if (isDestroyedRef.current) return;

      if (texture) {
        initializeScene(texture);
        if (isDestroyedRef.current) return;
        render();
      }
    };

    if (!isMobile) {
      container.addEventListener("mousemove", handlePointerMove);
    }
    window.addEventListener("resize", handleResize);

    init().catch((error) => {
      console.error("Failed to initialize pixelated text effect:", error);
    });
    return () => {
      isDestroyedRef.current = true;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      container.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);

      if (textElement) {
        textElement.style.opacity = "1";
      }

      if (canvasRef.current && container.contains(canvasRef.current)) {
        container.removeChild(canvasRef.current);
      }

      if (renderer) renderer.dispose();
      if (material) material.dispose();
      if (planeMesh?.geometry) planeMesh.geometry.dispose();
      if (dataTexture) dataTexture.dispose();
    };
  }, [grid, mouse, strength, relaxation, mobileBreakpoint]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <h1 ref={textRef} className="opacity-0">
        {children}
      </h1>
    </div>
  );
}
