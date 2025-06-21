import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function Robot(props) {
  const group = useRef();
  
  // Define animations and transformations
  const robotColors = {
    primary: '#8A2BE2',    // Main body color (Purple)
    secondary: '#4B0082',  // Secondary details (Indigo)
    accent: '#00BFFF',     // Glowing elements (Deep Sky Blue)
    emissive: '#FF00FF'    // Antenna light (Magenta)
  };

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Main Body */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        <boxGeometry args={[1.5, 2, 1]} />
        <meshStandardMaterial
          color={robotColors.primary}
          metalness={0.8}
          roughness={0.2}
          emissive={robotColors.secondary}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Head */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 1.5, 0]}
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={robotColors.secondary}
          metalness={0.7}
          roughness={0.2}
          envMapIntensity={1}
        />

        {/* Eyes */}
        <group>
          <mesh position={[0.25, 0.1, 0.55]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={robotColors.accent}
              emissive={robotColors.accent}
              emissiveIntensity={1.5}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[-0.25, 0.1, 0.55]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={robotColors.accent}
              emissive={robotColors.accent}
              emissiveIntensity={1.5}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Antenna */}
        <group position={[0, 0.6, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.5]} />
            <meshStandardMaterial
              color={robotColors.secondary}
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={robotColors.emissive}
              emissive={robotColors.emissive}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      </mesh>

      {/* Arms */}
      <group>
        {/* Right Arm */}
        <mesh
          position={[1, 0, 0]}
          rotation={[0, 0, -Math.PI / 6]}
        >
          <cylinderGeometry args={[0.2, 0.2, 2]} />
          <meshStandardMaterial
            color={robotColors.secondary}
            metalness={0.7}
            roughness={0.3}
          />
          <mesh position={[0, -1, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color={robotColors.primary}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </mesh>

        {/* Left Arm */}
        <mesh
          position={[-1, 0, 0]}
          rotation={[0, 0, Math.PI / 6]}
        >
          <cylinderGeometry args={[0.2, 0.2, 2]} />
          <meshStandardMaterial
            color={robotColors.secondary}
            metalness={0.7}
            roughness={0.3}
          />
          <mesh position={[0, -1, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color={robotColors.primary}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </mesh>
      </group>

      {/* Legs */}
      <group>
        <mesh position={[0.5, -1.5, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 2]} />
          <meshStandardMaterial
            color={robotColors.secondary}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[-0.5, -1.5, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 2]} />
          <meshStandardMaterial
            color={robotColors.secondary}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Chest Detail */}
      <mesh position={[0, 0.5, 0.6]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial
          color={robotColors.accent}
          emissive={robotColors.accent}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

export default Robot;