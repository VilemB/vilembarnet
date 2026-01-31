"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import vertexPars from "@/shaders/vertex_pars";
import vertexMain from "@/shaders/vertex_main";
import fragmentPars from "@/shaders/fragment_pars";
import fragmentMain from "@/shaders/fragment_main";

interface AnimatedIcosahedronProps {
  className?: string;
  grid?: number;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  mobileBreakpoint?: number;
  cameraZ?: number;
}

export default function AnimatedIcosahedron({
  className = "",
  grid = 400,
  bloomStrength = 0.7,
  bloomRadius = 0.4,
  bloomThreshold = 0.4,
  mobileBreakpoint = 1000,
  cameraZ = 2.5,
}: AnimatedIcosahedronProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const isDestroyedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    isDestroyedRef.current = false;

    // Adjust grid detail based on screen size for performance
    const isMobile = window.innerWidth < mobileBreakpoint;
    const gridDetail = isMobile ? Math.floor(grid / 2) : grid;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let material: THREE.MeshStandardMaterial;
    let icosahedron: THREE.Mesh;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const init = () => {
      if (isDestroyedRef.current) return;

      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const adjustedCameraZ = width < height ? cameraZ * 1.4 : cameraZ;
      camera.position.z = adjustedCameraZ;

      // Renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const canvas = renderer.domElement;
      canvas.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;";
      container.appendChild(canvas);
      canvasRef.current = canvas;

      const dirLight = new THREE.DirectionalLight("#ED985F", 3.0);
      dirLight.position.set(5, 5, 5);

      const fillLight = new THREE.DirectionalLight("#FFFFFF", 1.5);
      fillLight.position.set(-5, 0, -5);

      const ambientLight = new THREE.AmbientLight("#ED985F", 0.8);
      scene.add(dirLight, fillLight, ambientLight);

      // Geometry
      const geometry = new THREE.IcosahedronGeometry(1, gridDetail);

      // Material with shader injection
      material = new THREE.MeshStandardMaterial({
        color: "#ED985F",
        roughness: 0.8,
        metalness: 0.05,
      });
      material.onBeforeCompile = (shader) => {
        // Store reference to shader
        material.userData.shader = shader;

        // Add uniforms
        shader.uniforms.uTime = { value: 0 };

        // Inject vertex shader code
        const parsVertexString = "#include <displacementmap_pars_vertex>";
        shader.vertexShader = shader.vertexShader.replace(
          parsVertexString,
          parsVertexString + vertexPars
        );

        const mainVertexString = "#include <displacementmap_vertex>";
        shader.vertexShader = shader.vertexShader.replace(
          mainVertexString,
          mainVertexString + vertexMain
        );

        // Inject fragment shader code
        const parsFragmentString = "#include <bumpmap_pars_fragment>";
        shader.fragmentShader = shader.fragmentShader.replace(
          parsFragmentString,
          parsFragmentString + fragmentPars
        );

        const mainFragmentString = "#include <normal_fragment_maps>";
        shader.fragmentShader = shader.fragmentShader.replace(
          mainFragmentString,
          mainFragmentString + fragmentMain
        );
      };

      icosahedron = new THREE.Mesh(geometry, material);
      scene.add(icosahedron);
    };

    const animate = () => {
      if (isDestroyedRef.current) return;

      const time = performance.now() / 6000;

      // Update shader uniform
      if (material?.userData?.shader?.uniforms?.uTime) {
        material.userData.shader.uniforms.uTime.value = time;
      }

      // Render
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isDestroyedRef.current || !container) return;

        const newWidth = container.offsetWidth;
        const newHeight = container.offsetHeight;

        if (camera) {
          camera.aspect = newWidth / newHeight;
          const adjustedCameraZ = newWidth < newHeight ? cameraZ * 1.4 : cameraZ;
          camera.position.z = adjustedCameraZ;
          camera.updateProjectionMatrix();
        }

        if (renderer) {
          renderer.setSize(newWidth, newHeight);
        }
      }, 50);
    };

    window.addEventListener("resize", handleResize);

    init();
    animate();

    return () => {
      isDestroyedRef.current = true;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);

      if (canvasRef.current && container.contains(canvasRef.current)) {
        container.removeChild(canvasRef.current);
      }

      // Cleanup Three.js resources
      if (renderer) renderer.dispose();
      if (material) material.dispose();
      if (icosahedron?.geometry) icosahedron.geometry.dispose();
    };
  }, [grid, bloomStrength, bloomRadius, bloomThreshold, mobileBreakpoint, cameraZ]);

  return (
    <div ref={containerRef} className={`relative ${className}`} />
  );
}
