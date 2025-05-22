import { createFileRoute } from "@tanstack/react-router";
import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";
import { Header } from "@/components/header";

export const Route = createFileRoute("/editor")({
  component: RouteComponent,
});

function Highway() {
  const texture = useLoader(THREE.TextureLoader, "/highway.png");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 10);

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <boxGeometry args={[5, 100, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function RouteComponent() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <div className="absolute top-0 left-0 w-full z-50">
        <Header isSimple />
      </div>
      <Canvas
        camera={{
          fov: 90,
          near: 0.1,
          far: 1000,
          position: [0, 4, 10],
        }}
      >
        <Stars
          radius={250}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <hemisphereLight intensity={1} color="white" groundColor="black" />
        <fog attach="fog" args={["#0f0e18", 5, 20]} />
        <color attach="background" args={["#0f0e18"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />
        <Highway />

        <EffectComposer multisampling={5}>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
