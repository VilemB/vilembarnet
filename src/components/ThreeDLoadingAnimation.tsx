"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Mesh,
  TorusGeometry,
  MeshStandardMaterial,
  Group,
  Vector3,
} from "three";

interface OpticalIllusionRingsProps {
  isExiting?: boolean;
}

const OpticalIllusionRings: React.FC<OpticalIllusionRingsProps> = ({
  isExiting,
}) => {
  const groupRef = useRef<Group>(null!);
  const ring1Ref = useRef<Mesh<TorusGeometry, MeshStandardMaterial>>(null!);
  const ring2Ref = useRef<Mesh<TorusGeometry, MeshStandardMaterial>>(null!);
  const ring3Ref = useRef<Mesh<TorusGeometry, MeshStandardMaterial>>(null!);

  // Target scale for exit animation
  const targetScale = useRef(new Vector3(1, 1, 1));

  useEffect(() => {
    if (isExiting) {
      targetScale.current.set(0, 0, 0);
    } else {
      // Optional: Reset scale if needed, though for a one-shot exit, this might not be necessary
      // targetScale.current.set(1, 1, 1);
      // if (groupRef.current) {
      //   groupRef.current.scale.set(1,1,1); // Immediate reset if not exiting
      // }
    }
  }, [isExiting]);

  useFrame((_state, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.5;
      ring1Ref.current.rotation.y += delta * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.7;
      ring2Ref.current.rotation.z += delta * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.6;
      ring3Ref.current.rotation.x -= delta * 0.2;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;

      // Animate scale if isExiting
      if (isExiting || groupRef.current.scale.x !== targetScale.current.x) {
        // Lerp scale for smooth animation
        groupRef.current.scale.lerp(targetScale.current, delta * 7); // Adjust speed (7) as needed
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ring 1 - White */}
      <mesh ref={ring1Ref} scale={1.2} position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={"#FFFFFF"}
          emissive={"#333333"}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
      {/* Ring 2 - Mid Gray */}
      <mesh ref={ring2Ref} scale={1} position={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={"#808080"}
          emissive={"#1A1A1A"}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
      {/* Ring 3 - Dark Gray */}
      <mesh ref={ring3Ref} scale={0.8} position={[0, 0, 0]}>
        <torusGeometry args={[0.6, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={"#404040"}
          emissive={"#0D0D0D"}
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
};

interface ThreeDLoadingAnimationProps {
  isExiting?: boolean;
}

const ThreeDLoadingAnimation: React.FC<ThreeDLoadingAnimationProps> = ({
  isExiting,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas style={{ width: "250px", height: "250px" }}>
        <ambientLight intensity={Math.PI / 1.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.25}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight
          position={[-10, -10, -10]}
          decay={0}
          intensity={Math.PI / 2}
        />
        <OpticalIllusionRings isExiting={isExiting} />
      </Canvas>
    </div>
  );
};

export default ThreeDLoadingAnimation;
