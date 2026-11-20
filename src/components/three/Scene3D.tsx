import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useVideoConfig} from 'remotion';
import {Environment, Lightformer} from '@react-three/drei';

/**
 * Standard 3D stage: studio lighting (no network HDRI), soft key/rim, filmic tone.
 * RULE: animate only from useCurrentFrame() — never useFrame(). Sequences inside need layout="none".
 */
export const Scene3D: React.FC<{children: React.ReactNode; cameraZ?: number; fov?: number}> = ({children, cameraZ = 6, fov = 35}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={{position: [0, 0, cameraZ], fov}} gl={{antialias: true, alpha: true}} dpr={1}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <directionalLight position={[-6, 2, -4]} intensity={1.4} color="#6AA6FF" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -5]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#6AA6FF" position={[-5, 1, 2]} scale={[3, 8, 1]} />
        <Lightformer form="ring" intensity={2} position={[5, 2, 3]} scale={3} />
      </Environment>
      {children}
    </ThreeCanvas>
  );
};
