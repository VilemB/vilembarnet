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

      // Get texture's natural dimensions
      const textureWidth = texture.image?.width || 800;
      const textureHeight = texture.image?.height || 800;
      const textureAspect = textureWidth / textureHeight;

      // Calculate canvas size to maintain aspect ratio
      // Scale down if needed, but keep aspect ratio
      const maxWidth = containerRef.current?.clientWidth || 600;
      const maxHeight = 800; // Maximum height for images

      let canvasWidth = textureWidth;
      let canvasHeight = textureHeight;

      // Scale down if larger than max dimensions
      if (canvasWidth > maxWidth || canvasHeight > maxHeight) {
        const scaleX = maxWidth / canvasWidth;
        const scaleY = maxHeight / canvasHeight;
        const scale = Math.min(scaleX, scaleY);
        canvasWidth = canvasWidth * scale;
        canvasHeight = canvasHeight * scale;
      }

      // Set camera to match canvas aspect ratio
      const canvasAspect = canvasWidth / canvasHeight;
      camera = new THREE.OrthographicCamera(
        -1,
        1,
        1 / canvasAspect,
        -1 / canvasAspect,
        0.1,
        1000
      );
      camera.position.z = 1;

      // Plane should fill the view
      const planeWidth = 2;
      const planeHeight = 2 / canvasAspect;

      const shaderUniforms = {
        u_mouse: { value: new THREE.Vector2() },
        u_prevMouse: { value: new THREE.Vector2() },
        u_texture: { value: texture },
        u_gridSize: { value: gridSize },
        u_intensity: { value: intensity },
        u_radius: { value: radius },
      };

      planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(planeWidth, planeHeight),
        new THREE.ShaderMaterial({
          uniforms: shaderUniforms,
          vertexShader: DISTORTION_VERTEX_SHADER,
          fragmentShader: DISTORTION_FRAGMENT_SHADER,
        })
      );

      scene.add(planeMesh);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor("#F3F0F0", 1);
      renderer.setSize(canvasWidth, canvasHeight); // Use calculated size, not container size
      renderer.setPixelRatio(window.devicePixelRatio);

      containerRef.current?.appendChild(renderer.domElement);
    }

    function reloadTexture() {
      const newTexture = createTexture();
      if (newTexture && planeMesh) {
        (planeMesh.material as THREE.ShaderMaterial).uniforms.u_texture.value = newTexture;
        // Trigger resize to recalculate canvas and plane dimensions based on new texture
        onContainerResize();
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
      easeFactor = 0.035;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      mousePosition.x = targetMousePosition.x =
        (event.clientX - rect.left) / rect.width;
      mousePosition.y = targetMousePosition.y =
        (event.clientY - rect.top) / rect.height;
    }

    function handleMouseLeave() {
      easeFactor = 0.035;
      targetMousePosition = { ...prevPosition };
    }

    function onContainerResize() {
      // Recalculate based on texture dimensions, not container
      const texture = (planeMesh.material as THREE.ShaderMaterial).uniforms.u_texture.value;
      if (!texture?.image) return;

      const textureWidth = texture.image.width;
      const textureHeight = texture.image.height;
      const textureAspect = textureWidth / textureHeight;

      const maxWidth = containerRef.current?.clientWidth || 600;
      const maxHeight = 800;

      let canvasWidth = textureWidth;
      let canvasHeight = textureHeight;

      if (canvasWidth > maxWidth || canvasHeight > maxHeight) {
        const scaleX = maxWidth / canvasWidth;
        const scaleY = maxHeight / canvasHeight;
        const scale = Math.min(scaleX, scaleY);
        canvasWidth = canvasWidth * scale;
        canvasHeight = canvasHeight * scale;
      }

      const canvasAspect = canvasWidth / canvasHeight;
      camera.left = -1;
      camera.right = 1;
      camera.top = 1 / canvasAspect;
      camera.bottom = -1 / canvasAspect;
      camera.updateProjectionMatrix();

      // Update plane to fill view
      const planeWidth = 2;
      const planeHeight = 2 / canvasAspect;
      planeMesh.geometry.dispose();
      planeMesh.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

      renderer.setSize(canvasWidth, canvasHeight);
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

    const resizeObserver = new ResizeObserver(() => {
      onContainerResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    containerRef.current?.addEventListener("mousemove", handleMouseMove);
    containerRef.current?.addEventListener("mouseenter", handleMouseEnter);
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      containerRef.current?.removeEventListener("mousemove", handleMouseMove);
      containerRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);

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
