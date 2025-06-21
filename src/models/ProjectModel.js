import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import { MathUtils, Vector3 } from 'three';
import * as THREE from 'three';

const ProjectCard = ({ project, position, rotation, index }) => {
  const meshRef = useRef();
  const textRef = useRef();
  
  // Generate a color based on the project index
  const colors = [
    'hotpink',
    '#ff7b00',
    '#00bbff',
    '#00ff88',
    '#aa44ff',
    '#ff4466'
  ];
  
  const color = colors[index % colors.length];
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.5;
    meshRef.current.rotation.x = Math.sin(t + index) * 0.1;
    meshRef.current.rotation.y = Math.sin(t * 0.5 + index) * 0.1;
    
    // Hover animation
    meshRef.current.position.y = position[1] + Math.sin(t + index * 0.5) * 0.05;
  });
  
  // Calculate distance for the connecting line
  const centerPos = new Vector3(0, 0, 0);
  const projectPos = new Vector3(position[0], position[1], position[2]);
  const distance = projectPos.distanceTo(centerPos);
  
  return (
    <group position={position} rotation={rotation}>
      {/* Project card */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 1.5]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.3} 
          metalness={0.7} 
          emissive={color}
          emissiveIntensity={0.2}
        />
        
        {/* Project title */}
        <Text 
          ref={textRef}
          position={[0, 0.07, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.9}
          lineHeight={1.2}
        >
          {project.name}
        </Text>
      </mesh>
      
      {/* Connecting line to center */}
      <group>
        {/* We need to position and rotate the cylinder properly to connect to the center */}
        <mesh
          position={[position[0] / -2, position[1] / -2, position[2] / -2]}
          rotation={[
            Math.atan2(Math.sqrt(position[0] * position[0] + position[2] * position[2]), position[1]),
            0,
            Math.atan2(position[0], position[2])
          ]}
        >
          <cylinderGeometry args={[0.01, 0.01, distance, 8]} />
          <meshStandardMaterial color={color} transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
};

const ProjectsShowcase = ({ dateTime, username, projects }) => {
  const groupRef = useRef();
  const sphereRef = useRef();
  const { camera } = useThree();
  
  useEffect(() => {
    // Position camera to see the showcase
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Rotate the entire group slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = MathUtils.damp(
        groupRef.current.rotation.y,
        t * 0.1,
        4,
        0.1
      );
    }
    
    // Make the center sphere pulse
    if (sphereRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      sphereRef.current.scale.set(scale, scale, scale);
    }
  });
  
  const calculatePosition = (index, total) => {
    const radius = 2.5;
    const angle = (index / total) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    // Randomize y position slightly to create a more dynamic look
    const y = Math.sin(index * 0.5) * 0.5;
    
    return [x, y, z];
  };
  
  // Create particles for background
  const particles = [];
  const particleCount = 100;
  
  for (let i = 0; i < particleCount; i++) {
    const r = 5;
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    particles.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={Math.random() * 0.5 + 0.3} />
      </mesh>
    );
  }
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1} 
        castShadow 
      />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Project showcase */}
      <group ref={groupRef}>
        {/* Center sphere - represents the developer */}
        <mesh ref={sphereRef} position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#ff006a" 
            roughness={0.1} 
            metalness={0.9} 
            emissive="#ff006a"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Developer name */}
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {username}
        </Text>
        
        {/* Projects */}
        {projects.map((project, index) => {
          const position = calculatePosition(index, projects.length);
          // Calculate rotation to always face center
          const rotation = [0, Math.atan2(position[0], position[2]), 0];
          
          return (
            <ProjectCard 
              key={index} 
              project={project} 
              position={position} 
              rotation={rotation} 
              index={index} 
            />
          );
        })}
        
        {/* Radial connection lines */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.2} 
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Background particles */}
        {particles}
      </group>
      
      {/* Animated light beam */}
      <SpotlightBeam />
    </>
  );
};

// Spotlight beam effect
const SpotlightBeam = () => {
  const beamRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (beamRef.current) {
      beamRef.current.rotation.y = t * 0.2;
      beamRef.current.rotation.z = t * 0.1;
    }
  });
  
  return (
    <group ref={beamRef}>
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[3, 10, 32, 1, true]} />
        <meshBasicMaterial 
          color="#ff7b00" 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default ProjectsShowcase;