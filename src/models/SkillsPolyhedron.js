import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// Individual Skill Node component with improved visuals and billboarding
const SkillNode = ({ position, skill, color, connectTo }) => {
  const nodeRef = useRef();

  const linePoints = useMemo(() => {
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(
        connectTo[0] - position[0], 
        connectTo[1] - position[1], 
        connectTo[2] - position[2]
      )
    ];
  }, [position, connectTo]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  return (
    <group position={position}>
      <mesh ref={nodeRef}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      <Billboard follow={true}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {skill.icon}
        </Text>
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      </Billboard>

      <line geometry={lineGeometry}>
        <lineBasicMaterial color={color} opacity={0.6} transparent linewidth={1} />
      </line>
    </group>
  );
};


// Core polyhedron with advanced visual effects
const CorePolyhedron = () => {
  const coreRef = useRef();
  const innerRef = useRef();
  
  // Create pulsing animation 
  
  
  return (
    <group>
      {/* Outer wireframe shell */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial 
          color="#4B0082"
          wireframe
          emissive="#8A2BE2"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Middle layer */}
      <mesh>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#241439"
          wireframe
          emissive="#7B68EE"
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Inner core with glow */}
      <mesh ref={innerRef}>
        <polyhedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#050816"
          metalness={0.9}
          roughness={0.1}
          emissive="#8A2BE2"
          emissiveIntensity={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Ambient glow effect */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color="#8A2BE2"
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
};

// Main component that builds the scene
const SkillsPolyhedron = ({ dateTime = "2025-06-19 16:08:12", username = "anjani-kr-singh-ai" }) => {
  const groupRef = useRef();
  
  // Enhanced skill data with more visually interesting icons
  const skillsData = useMemo(() => ({
    "Frontend": [
      { name: "React", icon: "⚛️" },
      { name: "JavaScript", icon: "📜" },
      { name: "TypeScript", icon: "🔷" },
      { name: "HTML/CSS", icon: "🎨" },
      { name: "Vue.js", icon: "🟢" }
    ],
    "Backend": [
      { name: "Node.js", icon: "🟢" },
      { name: "Python", icon: "🐍" },
      { name: "Express", icon: "🚀" },
      { name: "GraphQL", icon: "📊" },
      { name: "Java", icon: "☕" }
    ],
    "Database": [
      { name: "MongoDB", icon: "🍃" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "MySQL", icon: "🐬" },
      { name: "Redis", icon: "🔴" }
    ],
    "DevOps": [
      { name: "Docker", icon: "🐳" },
      { name: "AWS", icon: "☁️" },
      { name: "Kubernetes", icon: "🚢" },
      { name: "CI/CD", icon: "🔄" }
    ],
    "AI/ML": [
      { name: "TensorFlow", icon: "🧠" },
      { name: "PyTorch", icon: "🔥" },
      { name: "NLP", icon: "🗣️" },
      { name: "Data Science", icon: "📊" }
    ],
    "Design": [
      { name: "Figma", icon: "🎨" },
      { name: "UI/UX", icon: "📱" },
      { name: "Accessibility", icon: "♿" }
    ]
  }), []);
  
  // Enhanced color scheme for better visual contrast
  const categoryColors = useMemo(() => ({
    "Frontend": "#61DAFB",    // React blue
    "Backend": "#3C873A",     // Node green
    "Database": "#FF9900",    // Warm orange
    "DevOps": "#00A4EF",      // Azure blue
    "AI/ML": "#FF4081",       // Bright pink
    "Design": "#8A2BE2"       // Purple
  }), []);
  
  // Rotation animation for the entire structure
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = t * 0.08;
      // Gentle bobbing motion
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.03;
    }
  });
  
  return (
    <>
      {/* Lighting setup for dramatic shadows and highlights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8A2BE2" />
      <spotLight 
        position={[5, 5, 5]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.8}
        castShadow 
      />
      
      <group ref={groupRef}>
        {/* Central polyhedron */}
        <CorePolyhedron />
        
        {/* Skills distributed by category */}
        {Object.entries(skillsData).map(([category, skills], categoryIndex) => {
          // Position categories evenly around the core
          const totalCategories = Object.keys(skillsData).length;
          const phi = Math.acos(-1 + (2 * categoryIndex) / totalCategories);
          const theta = Math.sqrt(totalCategories * Math.PI) * phi;
          
          // Use spherical coordinates for better distribution
          const categoryX = 2.5 * Math.sin(phi) * Math.cos(theta);
          const categoryY = 2.5 * Math.sin(phi) * Math.sin(theta);
          const categoryZ = 2.5 * Math.cos(phi);
          
          const color = categoryColors[category];
          
          return (
            <group key={category} position={[categoryX * 0.8, categoryY * 0.8, categoryZ * 0.8]}>
              {/* Category label using Billboard to face camera */}
              <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
                <Text
                  position={[0, 0, 0]}
                  fontSize={0.25}
                  color={color}
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.01}
                  outlineColor="#000000"
                >
                  {category}
                </Text>
              </Billboard>
              
              {/* Skills for this category */}
              {skills.map((skill, skillIndex) => {
                // Distribute skills in a circle around their category
                const angle = (2 * Math.PI * skillIndex) / skills.length;
                const radius = 0.8 + skills.length * 0.05;
                
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                // Add slight vertical variation for more visual interest
                const y = Math.sin(angle * 2) * 0.3;
                
                return (
                  <SkillNode 
                    key={`${category}-${skill.name}`}
                    position={[
                      categoryX + x, 
                      categoryY + y, 
                      categoryZ + z
                    ]}
                    skill={skill}
                    color={color}
                    connectTo={[0, 0, 0]}
                  />
                );
              })}
            </group>
          );
        })}
        
        {/* User info with Billboard to always face camera */}
        <Billboard position={[0, -3, 0]}>
          <Text
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
          </Text>
        </Billboard>
      </group>
      
      {/* Camera controls */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        dampingFactor={0.1}
        enableDamping={true}
      />
      
      {/* Atmospheric fog for depth */}
      <fog attach="fog" args={['#050816', 10, 20]} />
    </>
  );
};

export default SkillsPolyhedron;