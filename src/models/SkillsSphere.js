import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

const SkillsSphere = () => {
  const groupRef = useRef(null);
  const sphereRef = useRef(null);
  
  // Simplified skill set with clear categorization
  const skills = [
    // Primary skills - closer to the core
    { name: "React", color: "#61DAFB", radius: 2.2, phi: 0.4, importance: 1 },
    { name: "JavaScript", color: "#F7DF1E", radius: 2.1, phi: 1.2, importance: 1 },
    { name: "Node.js", color: "#3C873A", radius: 2.3, phi: 2.1, importance: 0.95 },
    { name: "TypeScript", color: "#3178C6", radius: 2.2, phi: 2.9, importance: 0.9 },
    { name: "HTML/CSS", color: "#E34F26", radius: 2.1, phi: 3.8, importance: 0.9 },
    { name: "Python", color: "#3776AB", radius: 2.4, phi: 4.7, importance: 0.85 },
    
    // Secondary skills - middle layer
    { name: "MongoDB", color: "#47A248", radius: 3.3, phi: 0.8, importance: 0.8 },
    { name: "AWS", color: "#FF9900", radius: 3.2, phi: 1.9, importance: 0.75 },
    { name: "GraphQL", color: "#E535AB", radius: 3.4, phi: 3.1, importance: 0.75 },
    { name: "Git", color: "#F05032", radius: 3.2, phi: 4.2, importance: 0.75 },
    { name: "Express", color: "#000000", radius: 3.3, phi: 5.3, importance: 0.7 },
    
    // Tertiary skills - outer layer
    { name: "Docker", color: "#2496ED", radius: 4.3, phi: 0.5, importance: 0.65 },
    { name: "Redux", color: "#764ABC", radius: 4.2, phi: 2.2, importance: 0.6 },
    { name: "Tailwind", color: "#38B2AC", radius: 4.1, phi: 3.7, importance: 0.6 },
    { name: "Firebase", color: "#FFCA28", radius: 4.2, phi: 5.0, importance: 0.6 }
  ];
  
  // Calculate positions on a sphere
  const skillsWithPositions = useMemo(() => {
    return skills.map(skill => {
      // Convert spherical coordinates to cartesian
      const theta = skill.phi;
      const phi = Math.random() * Math.PI; // Varied vertical positioning
      
      const x = skill.radius * Math.sin(phi) * Math.cos(theta);
      const y = skill.radius * Math.sin(phi) * Math.sin(theta);
      const z = skill.radius * Math.cos(phi);
      
      return {
        ...skill,
        position: [x, y, z],
        size: 0.3 + skill.importance * 0.2 // Size based on importance
      };
    });
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate the main group slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }
    
    // Subtle breathing animation for the core sphere
    if (sphereRef.current) {
      sphereRef.current.scale.x = sphereRef.current.scale.y = sphereRef.current.scale.z = 
        1 + Math.sin(time * 0.4) * 0.03;
    }
  });
  
  return (
    <>
      {/* Simple environment with subtle lighting */}
      <color attach="background" args={['#050816']} />
      <Environment preset="warehouse" intensity={0.5} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.2} color="#FFFFFF" />
      
      {/* Core sphere with subtle distortion */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial 
          color="#4B0082"
          attach="material" 
          distort={0.2} 
          speed={1.5} 
          roughness={0.4}
          metalness={0.8}
          emissive="#8A2BE2"
          emissiveIntensity={0.3}
          clearcoat={0.5}
        />
      </mesh>
      
      {/* Main group with skills */}
      <group ref={groupRef}>
        {skillsWithPositions.map((skill, index) => (
          <Float 
            key={`skill-${index}`}
            speed={1} 
            rotationIntensity={0.1} 
            floatIntensity={0.3}
            position={skill.position}
          >
            <Html 
              transform
              distanceFactor={10}
              center
              zIndexRange={[100, 0]}
              sprite
            >
              <div 
                style={{
                  padding: `${5 + skill.importance * 5}px ${10 + skill.importance * 10}px`,
                  borderRadius: '30px',
                  background: `rgba(10, 14, 36, 0.7)`,
                  border: `1px solid ${skill.color}`,
                  boxShadow: `0 0 8px ${skill.color}40`,
                  color: skill.color,
                  fontSize: `${skill.size * 16}px`,
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Space Grotesk, monospace',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
                onPointerOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = `0 0 15px ${skill.color}80`;
                  e.currentTarget.style.background = `rgba(10, 14, 36, 0.9)`;
                }}
                onPointerOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `0 0 8px ${skill.color}40`;
                  e.currentTarget.style.background = `rgba(10, 14, 36, 0.7)`;
                }}
              >
                {skill.name}
              </div>
            </Html>
          </Float>
        ))}
      </group>
      
      {/* Simple orbital rings for structure */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[2.0, 2.05, 64]} />
        <meshBasicMaterial color="#8A2BE2" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation-x={Math.PI / 2.5}>
        <ringGeometry args={[3.2, 3.25, 64]} />
        <meshBasicMaterial color="#00BFFF" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation-x={Math.PI / 3}>
        <ringGeometry args={[4.1, 4.15, 64]} />
        <meshBasicMaterial color="#FF00FF" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};

export default SkillsSphere;