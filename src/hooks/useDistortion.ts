import { RefObject, useEffect } from "react";
import * as THREE from "three";
import { DISTORTION_VERTEX_SHADER, DISTORTION_FRAGMENT_SHADER } from "./distortionShaders";

export interface DistortionOptions {
  createTexture: () => THREE.Texture | null;
  containerRef: RefObject<HTMLDivElement | null>;
  gridSize?: number;
  intensity?: number;
  radius?: number;
  easeFactor?: number;
}

export function useDistortion(options: DistortionOptions) {
  const {
    createTexture,
    containerRef,
    gridSize = 80.0,
    intensity = 0.2,
    radius = 0.35,
    easeFactor: initialEaseFactor = 0.02,
  } = options;

  useEffect(() => {
    if (!containerRef.current) return;

    let easeFactor = initialEaseFactor;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let planeMesh: THREE.Mesh;
    let mousePosition = { x: 0.5, y: 0.5 };
    let targetMousePosition = { x: 0.5, y: 0.5 };
    let prevPosition = { x: 0.5, y: 0.5 };

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

      const shaderUniforms = {
        u_mouse: { value: new THREE.Vector2() },
        u_prevMouse: { value: new THREE.Vector2() },
        u_texture: { value: texture },
        u_gridSize: { value: gridSize },
        u_intensity: { value: intensity },
        u_radius: { value: radius },
      };

      planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          uniforms: shaderUniforms,
          vertexShader: DISTORTION_VERTEX_SHADER,
          fragmentShader: DISTORTION_FRAGMENT_SHADER,
        })
      );

      scene.add(planeMesh);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(0xffffff, 1);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      containerRef.current?.appendChild(renderer.domElement);
    }

    function reloadTexture() {
      const newTexture = createTexture();
      if (newTexture) {
        (planeMesh.material as THREE.ShaderMaterial).uniforms.u_texture.value = newTexture;
      }
    }

    function handleMouseMove(event: MouseEvent) {
      easeFactor = 0.035;
      const rect = containerRef.current?.getBoundingClientRect();
      prevPosition = { ...targetMousePosition };
      if (!rect) return;

      targetMousePosition.x = (event.clientX - rect.left) / rect.width;
      targetMousePosition.y = (event.clientY - rect.top) / rect.height;
    }

    function handleMouseEnter(event: MouseEvent) {
      easeFactor = 0.01;
      const rect = containerRef.current?.getBoundingClientRect();
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

    const initialTexture = createTexture();

    if (!initialTexture) return;

    initializeScene(initialTexture);

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

    containerRef.current?.addEventListener("mousemove", handleMouseMove);
    containerRef.current?.addEventListener("mouseenter", handleMouseEnter);
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", onWindowResize, false);

    return () => {
      cancelAnimationFrame(animationFrameId);
      containerRef.current?.removeEventListener("mousemove", handleMouseMove);
      containerRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", onWindowResize);

      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
      if (planeMesh) {
        planeMesh.geometry.dispose();
        (planeMesh.material as THREE.ShaderMaterial).dispose();
      }
    };
  }, [
    createTexture,
    containerRef,
    gridSize,
    intensity,
    radius,
    initialEaseFactor,
  ]);
}
