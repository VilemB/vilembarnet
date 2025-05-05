"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { throttle } from "lodash-es"; // Using lodash for throttling scroll events

// Define a type for the scene state to avoid using 'any'
interface SceneState {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  directionalLight?: THREE.DirectionalLight;
  ambientLight?: THREE.AmbientLight;
  subject?: THREE.Mesh & { custom?: { rotationSpeed: number } };
  cleanup?: () => void;
  handleScroll?: (scrollY: number) => void; // Add scroll handler to state
  // Add other properties as needed
}

const SpaceDroidAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneState | null>(null); // Use the defined type

  const initScene = useCallback((element: HTMLDivElement) => {
    console.log("SpaceDroidAnimation: Initializing scene..."); // Debug log
    if (!element) return;

    sceneRef.current = {}; // Initialize scene object store
    const sceneState = sceneRef.current;

    // Basic Scene Setup
    sceneState.scene = new THREE.Scene();
    // Adjust camera for background view if needed
    const aspectRatio = window.innerWidth / window.innerHeight;
    sceneState.camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000); // Wider FOV maybe
    sceneState.camera.position.set(0, 5, 25); // Adjust initial position
    sceneState.camera.lookAt(new THREE.Vector3(0, 0, 0));
    sceneState.scene.add(sceneState.camera);

    // Lighting
    sceneState.directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    sceneState.directionalLight.position.set(-1, 1, 1);
    sceneState.scene.add(sceneState.directionalLight);

    sceneState.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    sceneState.scene.add(sceneState.ambientLight);

    // Renderer
    sceneState.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Ensure transparency
    });
    sceneState.renderer.setSize(window.innerWidth, window.innerHeight);
    // Renderer style is handled by the wrapper div now
    element.appendChild(sceneState.renderer.domElement);

    // Simple Cube (Placeholder)
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000, // Bright Red for visibility
      specular: 0x111111,
      shininess: 50,
    });
    sceneState.subject = new THREE.Mesh(geometry, material);
    sceneState.subject.position.y = 0; // Center it or adjust as needed
    sceneState.scene.add(sceneState.subject);

    // --- Remove Auto-Animation Setup ---
    // No automatic looping animation needed if controlled by scroll

    let animationFrameId: number;

    // Render loop
    const renderFrame = () => {
      animationFrameId = requestAnimationFrame(renderFrame);
      // Rotation is now handled by scroll listener

      if (sceneState.renderer && sceneState.scene && sceneState.camera) {
        sceneState.renderer.render(sceneState.scene, sceneState.camera);
      }
    };
    renderFrame();

    // Scroll Handler Logic
    sceneState.handleScroll = (scrollY: number) => {
      if (!sceneState.subject) return;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.max(
        0,
        Math.min(1, maxScroll > 0 ? scrollY / maxScroll : 0)
      );

      console.log(
        `ScrollY: ${scrollY.toFixed(2)}, Progress: ${scrollProgress.toFixed(3)}`
      ); // Debug log

      // Animate based on scroll
      sceneState.subject.rotation.y = scrollProgress * Math.PI * 2; // Full rotation over scroll height
      sceneState.subject.rotation.x = scrollProgress * Math.PI * 0.5;

      // Example: Move camera slightly
      // sceneState.camera.position.z = 25 + scrollProgress * 10;
      // sceneState.camera.position.y = 5 - scrollProgress * 5;
      // sceneState.camera.lookAt(0, 0, 0); // Keep looking at the center
    };

    // Resize handler
    const handleResize = () => {
      if (!element || !sceneState.renderer || !sceneState.camera) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      sceneState.renderer.setSize(width, height);
      sceneState.camera.aspect = width / height;
      sceneState.camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Store cleanup function
    sceneState.cleanup = () => {
      window.removeEventListener("resize", handleResize);
      // Remove scroll listener during cleanup
      window.removeEventListener("scroll", throttledScrollHandler);
      cancelAnimationFrame(animationFrameId);
      // Dispose Three.js objects
      sceneState.scene?.traverse((object) => {
        const obj = object as THREE.Mesh; // Basic type assertion
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((material) => material.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      sceneState.renderer?.dispose();
    };

    // Throttled scroll handler to improve performance
    const throttledScrollHandler = throttle(() => {
      sceneState.handleScroll?.(window.scrollY);
    }, 16); // Throttle to roughly 60fps

    // Add scroll listener
    window.addEventListener("scroll", throttledScrollHandler);
    // Initial call to set position based on initial scroll
    console.log("SpaceDroidAnimation: Adding scroll listener."); // Debug log
    throttledScrollHandler();
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (currentMount) {
      initScene(currentMount);
    }

    // Cleanup function
    return () => {
      // Check if both sceneRef.current and its cleanup method exist
      if (sceneRef.current && typeof sceneRef.current.cleanup === "function") {
        sceneRef.current.cleanup();
      }
    };
  }, [initScene]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed", // Position fixed to stay in background
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh", // Full viewport height
        zIndex: -10, // Behind other content
        overflow: "hidden", // Prevent scrollbars on this div
      }}
    />
  );
};

export default SpaceDroidAnimation;
