"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";

export default function Home() {

  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let easeFactor = 0.02;
    let scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer, planeMesh: THREE.Mesh;
    let mousePosition = { x: 0.5, y: 0.5 };
    let targetMousePosition = { x: 0.5, y: 0.5 };
    let prevPosition = { x: 0.5, y: 0.5 };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform vec2 u_prevMouse;

      void main() {
        vec2 gridUV = floor(vUv * vec2(80.0, 80.0)) / vec2(80.0, 80.0);
        vec2 centerOfPixel = gridUV + vec2(1.0/80.0, 1.0/80.0);

        vec2 mouseDirection = u_mouse - u_prevMouse;

        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.35, 0.0, pixelDistanceToMouse);

        vec2 uvOffset = strength * -mouseDirection * 0.2;
        vec2 uv = vUv - uvOffset;

        vec4 color = texture2D(u_texture, uv);
        gl_FragColor = color;
      }
    `;

    function createTextTexture(text: string, font: string, size: number, color: string, fontWeight = "100") {
      const canvas = document.createElement("canvas");
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

      const canvasWidth = window.innerWidth * 2;
      const canvasHeight = window.innerHeight * 2;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      if (!ctx) {
        return;
      }

      ctx.fillStyle = color || "#F3F0F0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = size || Math.floor(canvasWidth * 2);

      ctx.fillStyle = "#001F3D";
      ctx.font = `${fontWeight} ${fontSize}px "${font || "Italiana"}"`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;

      const scaleFactor = Math.min(1, (canvasWidth * 1) / textWidth);
      const aspectCorrection = canvasWidth / canvasHeight;

      ctx.setTransform(
        scaleFactor,
        0,
        0,
        scaleFactor / aspectCorrection,
        canvasWidth / 2,
        canvasHeight / 2
      );

      ctx.strokeStyle = "#ED985F";
      ctx.lineWidth = fontSize * 0.005;
      for (let i = 0; i < 3; i++) {
        ctx.strokeText(text, 0, 0);
      }
      ctx.fillText(text, 0, 0);

      return new THREE.CanvasTexture(canvas);
    }

    function initializeScene(texture: THREE.Texture) {
      scene = new THREE.Scene();

      const aspectRatio = window.innerWidth / window.innerHeight;
      camera = new THREE.OrthographicCamera(
        -1,
        1,
        1 / aspectRatio,
        -1 / aspectRatio,
        0.1,
        1000
      );
      camera.position.z = 1;

      let shaderUniforms = {
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        u_prevMouse: { type: "v2", value: new THREE.Vector2() },
        u_texture: { type: "t", value: texture },
      };

      planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          uniforms: shaderUniforms,
          vertexShader,
          fragmentShader,
        })
      );

      scene.add(planeMesh);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(0xffffff, 1);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      textContainerRef.current?.appendChild(renderer.domElement);
    }

    function reloadTexture() {
      const newTexture = createTextTexture(
        "vilem barnet",
        "Italiana",
        100,
        "#F3F0F0",
        "400"
      );
      (planeMesh.material as THREE.ShaderMaterial).uniforms.u_texture.value = newTexture;
    }

    function handleMouseMove(event: MouseEvent) {
      easeFactor = 0.035;
      let rect = textContainerRef.current?.getBoundingClientRect();
      prevPosition = { ...targetMousePosition };
      if (!rect) return;

      targetMousePosition.x = (event.clientX - rect.left) / rect.width;
      targetMousePosition.y = (event.clientY - rect.top) / rect.height;
    }

    function handleMouseEnter(event: MouseEvent) {
      easeFactor = 0.01;
      let rect = textContainerRef.current?.getBoundingClientRect();
      if (!rect) return;

      mousePosition.x = targetMousePosition.x =
        (event.clientX - rect.left) / rect.width;
      mousePosition.y = targetMousePosition.y =
        (event.clientY - rect.top) / rect.height;
    }

    function handleMouseLeave() {
      easeFactor = 0.01;
      targetMousePosition = { ...prevPosition };
    }

    function onWindowResize() {
      const aspectRatio = window.innerWidth / window.innerHeight;
      camera.left = -1;
      camera.right = 1;
      camera.top = 1 / aspectRatio;
      camera.bottom = -1 / aspectRatio;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

      reloadTexture();
    }

    initializeScene(
      createTextTexture("vilem barnet", "Italiana", 400, "#F3F0F0", "400")!
    );

    let animationFrameId: number;

    function animateScene() {
      animationFrameId = requestAnimationFrame(animateScene);

      mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
      mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

      (planeMesh.material as THREE.ShaderMaterial).uniforms.u_mouse.value.set(
        mousePosition.x,
        1.0 - mousePosition.y
      );

      (planeMesh.material as THREE.ShaderMaterial).uniforms.u_prevMouse.value.set(
        prevPosition.x,
        1.0 - prevPosition.y
      );

      renderer.render(scene, camera);
    }

    animateScene();

    textContainerRef.current?.addEventListener("mousemove", handleMouseMove);
    textContainerRef.current?.addEventListener("mouseenter", handleMouseEnter);
    textContainerRef.current?.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", onWindowResize, false);

    return () => {
      cancelAnimationFrame(animationFrameId);
      textContainerRef.current?.removeEventListener("mousemove", handleMouseMove);
      textContainerRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      textContainerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", onWindowResize);

      if (renderer) {
        renderer.dispose();
        textContainerRef.current?.removeChild(renderer.domElement);
      }
      if (planeMesh) {
        planeMesh.geometry.dispose();
        (planeMesh.material as THREE.ShaderMaterial).dispose();
      }
    };
  }, []);

  return (
    <main>
      <div ref={textContainerRef} id="textContainer"></div>
    </main>
  );
}
