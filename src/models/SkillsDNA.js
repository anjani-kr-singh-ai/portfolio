import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const SkillsDNA = () => {
  const dnaRef = useRef();
  
  // Primary and secondary skills for the two DNA strands
  const primarySkills = ["JavaScript", "React", "Node.js", "TypeScript", "HTML", "CSS"];
  const secondarySkills = ["MongoDB", "Git", "AWS", "Docker", "GraphQL", "Redux"];
  
  // DNA helix parameters
  const helixRadius = 1.2;    // Radius of helix
  const helixPitch = 1.5;     // Distance between twists
  const helixLength = 12;     // Total height of helix
  
  // Create base pairs between the DNA strands (connections)
  const createBasePairs = () => {
    const basePairs = [];
    const segments = primarySkills.length;
    const segmentHeight = helixLength / segments;
    
    for (let i = 0; i < segments; i++) {
      basePairs.push({
        height: -helixLength/2 + i * segmentHeight + segmentHeight/2,
        primarySkill: primarySkills[i],
        secondarySkill: secondarySkills[i]
      });
    }
    
    return basePairs;
  };
  
  const basePairs = createBasePairs();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Rotate DNA
    if (dnaRef.current) {
      dnaRef.current.rotation.y = t * 0.2;
    }
  });
  
  return (
    <>
      <color attach="background" args={['#050816']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#8A2BE2" />
      
      <group ref={dnaRef}>
        {/* Create the DNA strands */}
        {[0, 1].map(strandIndex => {
          // Points for the DNA strand
          const points = [];
          const strandOffset = strandIndex * Math.PI; // 180 degree offset between strands
          
          // Create points along the helix
          for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const angle = t * Math.PI * 2 * (helixLength / helixPitch);
            
            // Helix parametric equation
            const x = helixRadius * Math.cos(angle + strandOffset);
            const y = -helixLength/2 + t * helixLength;
            const z = helixRadius * Math.sin(angle + strandOffset);
            
            points.push(new THREE.Vector3(x, y, z));
          }
          
          // Create curve and tube geometry
          const curve = new THREE.CatmullRomCurve3(points);
          
          return (
            <mesh key={`strand-${strandIndex}`}>
              <tubeGeometry args={[curve, 100, 0.1, 8, false]} />
              <meshStandardMaterial 
                color={strandIndex === 0 ? "#8A2BE2" : "#00BFFF"} 
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
          );
        })}
        
        {/* Create base pairs and skill labels */}
        {basePairs.map((pair, index) => {
          // Calculate the positions for this base pair
          const angle = (pair.height + helixLength/2) / helixLength * Math.PI * 2 * (helixLength / helixPitch);
          
          // First strand position
          const x1 = helixRadius * Math.cos(angle);
          const z1 = helixRadius * Math.sin(angle);
          
          // Second strand position (180 degrees offset)
          const x2 = helixRadius * Math.cos(angle + Math.PI);
          const z2 = helixRadius * Math.sin(angle + Math.PI);
          
          return (
            <group key={`pair-${index}`}>
              {/* Base connector */}
              <mesh position={[0, pair.height, 0]}>
                <cylinderGeometry 
                  args={[0.03, 0.03, helixRadius * 2, 8]} 
                  rotation={[0, 0, Math.PI/2]}
                />
                <meshStandardMaterial 
                  color="#FFFFFF"
                  transparent
                  opacity={0.5}
                />
              </mesh>
              
              {/* Skill labels */}
              <group position={[x1 * 1.3, pair.height, z1 * 1.3]}>
                <Text
                  color="#FFFFFF"
                  fontSize={0.2}
                  maxWidth={2}
                  anchorX="center"
                  anchorY="middle"
                >
                  {pair.primarySkill}
                </Text>
                <mesh position={[0, 0, 0.1]}>
                  <sphereGeometry args={[0.12, 16, 16]} />
                  <meshStandardMaterial color="#8A2BE2" />
                </mesh>
              </group>
              
              <group position={[x2 * 1.3, pair.height, z2 * 1.3]}>
                <Text
                  color="#FFFFFF"
                  fontSize={0.2}
                  maxWidth={2}
                  anchorX="center"
                  anchorY="middle"
                >
                  {pair.secondarySkill}
                </Text>
                <mesh position={[0, 0, 0.1]}>
                  <sphereGeometry args={[0.12, 16, 16]} />
                  <meshStandardMaterial color="#00BFFF" />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
    </>
  );
};

export default SkillsDNA;