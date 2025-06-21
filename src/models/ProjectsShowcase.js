// ProjectsShowcase.jsx
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, PerspectiveCamera, MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';


// Enhanced color palette with better visual hierarchy
const COLORS = [
  '#4f46e5', // Indigo
  '#ec4899', // Pink
  '#0891b2', // Cyan
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6'  // Violet
];

const ProjectCard = ({ project, position, rotation, index }) => {
  const meshRef = useRef();
  const textRef = useRef();
  const connectorRef = useRef();
  const particlesRef = useRef();

  const color = COLORS[index % COLORS.length];

  // Memoize position vector to avoid recreating it on every frame
  const cardPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const centerPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const distance = useMemo(() => cardPos.distanceTo(centerPos), [cardPos, centerPos]);
  const { camera } = useThree(); // Add at the top inside ProjectCard


  // Animate card
  useFrame((state) => {
  const t = state.clock.getElapsedTime() * 0.5;

  if (meshRef.current) {
    meshRef.current.rotation.x = Math.sin(t + index) * 0.1;
    meshRef.current.rotation.y = Math.sin(t * 0.5 + index) * 0.1;
    meshRef.current.position.y = position[1] + Math.sin(t + index * 0.5) * 0.05;
  }

  if (connectorRef.current && connectorRef.current.material) {
    connectorRef.current.material.opacity = 0.2 + Math.sin(t * 0.8 + index) * 0.1;
  }

  if (particlesRef.current) {
    particlesRef.current.rotation.y = t * 0.2;
  }

  // 🔁 Billboard the project title text
  if (textRef.current && camera) {
    textRef.current.quaternion.copy(camera.quaternion);
  }
});


  // Setup connector orientation only once (on mount + position deps)
  useEffect(() => {
    if (connectorRef.current) {
      // Setup connector geometry to point toward center
      connectorRef.current.scale.set(1, distance, 1);
      connectorRef.current.position.set(
        position[0] / -2,
        position[1] / -2,
        position[2] / -2
      );
      connectorRef.current.lookAt(centerPos);
      connectorRef.current.rotateX(Math.PI / 2);
    }
  }, [position, centerPos, distance]);

  return (
    <group position={position} rotation={rotation}>
      {/* Enhanced card with improved visuals */}
      <group ref={meshRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 0.1, 1.5]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.2}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={0.3}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Technology tags as small spheres */}
        <group position={[0, 0.1, 0.5]} scale={0.8}>
          {project.technologies.slice(0, 3).map((tech, i) => (
            <mesh 
              key={`tech-${i}`}
              position={[(i - 1) * 0.3, 0, 0]}
              scale={0.7}
            >
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial 
                color={color} 
                emissive={color}
                emissiveIntensity={0.5}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>

        {/* Project title with improved typography */}
        <Text
          ref={textRef}
          position={[0, 0.08, 0]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.9}
          lineHeight={1.2}
          letterSpacing={-0.02}
        >
          {project.name}
        </Text>
        
        {/* Small particle system around card */}
        <group ref={particlesRef}>
          {Array.from({length: 8}).map((_, i) => (
            <mesh
              key={`particle-${i}`}
              position={[
                Math.sin(i / 8 * Math.PI * 2) * 0.7,
                0.1,
                Math.cos(i / 8 * Math.PI * 2) * 0.7
              ]}
            >
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Improved connecting line with subtle glow */}
      <mesh ref={connectorRef}>
        <cylinderGeometry args={[0.01, 0.01, 1, 8]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.3}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};

// Enhanced spotlight beam
const SpotlightBeam = ({ id }) => {
  const beamRef = useRef();
  const innerBeamRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (beamRef.current) {
      beamRef.current.rotation.y = t * 0.2;
      beamRef.current.rotation.z = t * 0.1;
    }
    
    if (innerBeamRef.current && innerBeamRef.current.material) {
      innerBeamRef.current.material.opacity = 0.03 + Math.sin(t) * 0.01;
    }
  });

  return (
    <group ref={beamRef} name={`spotlight-beam-${id}`}>
      {/* Outer beam */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[3, 10, 32, 1, true]} />
        <meshBasicMaterial
          color="#ff7b00"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Inner beam for additional depth */}
      <mesh ref={innerBeamRef} position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.6, 1, 0.6]}>
        <coneGeometry args={[3, 10, 16, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// Main showcase component
const ProjectsShowcase = ({ dateTime, username, projects }) => {
  const groupRef = useRef();
  const sphereRef = useRef();
  const innerSphereRef = useRef();
  const ringRef = useRef();
  const { camera } = useThree();
  
  // Ensure camera is positioned properly initially
  useEffect(() => {
    if (camera) {
      camera.position.set(0, 2, 5.5);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);

  // Animation loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Gentle rotation for the main group
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
    
    // Pulsing animation for central sphere
    if (sphereRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      sphereRef.current.scale.set(scale, scale, scale);
    }
    
    // Counter-rotating inner sphere
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.y = -t * 0.3;
      innerSphereRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    
    // Subtle animation for the connection ring
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    }
  });

  // Calculate positions for project cards
  const calculatePosition = (index, total) => {
    const radius = 2.5;
    const angle = (index / total) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = Math.sin((index / total) * Math.PI * 2 + Math.PI/4) * 0.4;
    return [x, y, z];
  };

  // Generate background particles once with useMemo
  const particles = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => {
      const r = 5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      return (
        <mesh key={`particle-${i}`} position={[x, y, z]} name={`particle-${i}`}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial
            color={Math.random() > 0.8 ? COLORS[Math.floor(Math.random() * COLORS.length)] : "#ffffff"}
            transparent 
            opacity={Math.random() * 0.5 + 0.3} 
          />
        </mesh>
      );
    }), []
  );

  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera makeDefault position={[0, 2, 5.5]} fov={45} near={0.1} far={100} />

      {/* Controls */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minPolarAngle={Math.PI / 6} 
        maxPolarAngle={Math.PI / 2.2}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.7} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Background */}
      <color attach="background" args={['#05060f']} />
      
      {/* Main scene group */}
      <group ref={groupRef} name="projects-showcase-group">
        {/* Enhanced developer representation */}
        <group>
          {/* Main sphere */}
          <mesh ref={sphereRef} castShadow name="developer-sphere">
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshPhysicalMaterial
              color="#ff006a"
              roughness={0.1}
              metalness={0.9}
              emissive="#ff006a"
              emissiveIntensity={0.6}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>
          
          {/* Inner sphere with wireframe for depth */}
          <mesh ref={innerSphereRef} scale={0.7}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.2} />
          </mesh>
          
          {/* Sparkles effect for central point */}
          <Sparkles 
            count={20} 
            scale={1.5} 
            size={3} 
            speed={0.2} 
            opacity={0.5}
            color="#ff006a"
          />

          {/* Username with improved typography */}
          <Float speed={2} rotationIntensity={0.02} floatingRange={[-0.05, 0.05]}>
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.17}
              color="white"
              anchorX="center"
              anchorY="middle"
              letterSpacing={-0.01}
              material-toneMapped={false}
            >
              {username}
            </Text>
            
            {/* Date display */}
            <Text
              position={[0, -1.1, 0]}
              fontSize={0.08}
              color="#a0a0b9" 
              anchorX="center"
              anchorY="middle"
              material-toneMapped={false}
            >
              {dateTime}
            </Text>
          </Float>
        </group>

        {/* Project Cards */}
        {projects.map((project, index) => {
          const pos = calculatePosition(index, projects.length);
          const rot = [0, Math.atan2(pos[0], pos[2]), 0];

          return (
            <ProjectCard
              key={project.id}
              project={project}
              position={pos}
              rotation={rot}
              index={index}
            />
          );
        })}

        {/* Outer Ring with improved material */}
        <mesh ref={ringRef} position={[0, 0, 0]} name="projects-ring">
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.2} 
            emissive="#ffffff" 
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Background Particles */}
        {particles}
      </group>

      {/* Enhanced Spotlight Beam */}
      <SpotlightBeam id="projects-spotlight" />
    </>
  );
};

export default ProjectsShowcase;