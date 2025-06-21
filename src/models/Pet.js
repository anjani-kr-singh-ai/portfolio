import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, MeshDistortMaterial, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import glsl from 'babel-plugin-glsl/macro';

// Custom fur shader for realistic pet appearance
const FurMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.9, 0.8, 0.6),
    furLength: 0.15,
    furDensity: 2.0,
    furThinness: 0.15,
    furDirection: new THREE.Vector3(0, 0.1, 0),
    positionBuffer: { value: null },
  },
  glsl`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
    }
  `,
  glsl`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    uniform vec3 color;
    uniform float furLength;
    uniform float furDensity;
    uniform float furThinness;
    uniform vec3 furDirection;
    uniform float time;
    
    float random(vec3 co) {
      return fract(sin(dot(co.xyz, vec3(12.9898, 78.233, 53.539))) * 43758.5453);
    }
    
    void main() {
      // Create a fur pattern based on noise
      float noise = random(vPosition * furDensity + time * 0.1);
      
      // Calculate fur shading
      float light = dot(normalize(vec3(1.0, 1.0, 1.0)), vNormal);
      light = 0.5 + light * 0.5;
      
      // Create fur strands
      vec3 furColor = color * light;
      
      // Add color variation
      furColor.r += noise * 0.1;
      furColor.g += noise * 0.05;
      
      // Add highlights
      float highlight = pow(max(0.0, dot(vNormal, normalize(vec3(0.2, 0.8, 0.4)))), 20.0);
      furColor += highlight * 0.3;
      
      gl_FragColor = vec4(furColor, 1.0);
    }
  `
);

extend({ FurMaterial });

export function Pet({ mousePosition, ...props }) {
  const group = useRef();
  const { viewport } = useThree();
  
  // State for animation control
  const [isMoving, setIsMoving] = useState(false);
  const [blinkTimer, setBlinkTimer] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [targetPosition, setTargetPosition] = useState([0, -1, 0]);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [hoveringHead, setHoveringHead] = useState(false);
  const [purring, setPurring] = useState(false);
  
  // References to mesh parts
  const bodyRef = useRef();
  const headRef = useRef();
  const tailRef = useRef();
  const leftEarRef = useRef();
  const rightEarRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  
  const materialRef = useRef();
  
  // Set up random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, Math.random() * 3000 + 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Mouse follower logic
  useFrame((state, delta) => {
    if (!group.current || !mousePosition) return;
    
    // Update material time uniform for animations
    if (materialRef.current) {
      materialRef.current.time += delta;
    }
    
    // Convert normalized mouse coordinates to 3D space
    const targetX = mousePosition.x * viewport.width / 2.5;
    const targetZ = -mousePosition.y * viewport.height / 3;
    const targetY = -1; // Keep grounded
    
    const newTarget = [targetX, targetY, targetZ];
    setTargetPosition(newTarget);
    
    // Calculate distance to target
    const dx = targetX - group.current.position.x;
    const dy = targetY - group.current.position.y;
    const dz = targetZ - group.current.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    // Set movement state
    if (distance > 0.2) {
      setIsMoving(true);
      
      // Interpolate position for smooth movement
      const speed = Math.min(distance * 2, 3) * delta;
      group.current.position.x += dx * speed;
      group.current.position.y += dy * speed;
      group.current.position.z += dz * speed;
      
      // Rotate body to face movement direction
      if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
        const targetAngle = Math.atan2(dx, dz);
        let currentAngle = group.current.rotation.y;
        
        // Smooth rotation
        const angleDiff = targetAngle - currentAngle;
        let rotationDelta = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), delta * 5);
        
        // Handle angle wrap-around
        if (Math.abs(angleDiff) > Math.PI) {
          rotationDelta = Math.sign(-angleDiff) * Math.min(2 * Math.PI - Math.abs(angleDiff), delta * 5);
        }
        
        group.current.rotation.y += rotationDelta;
      }
      
      // Animate parts when moving
      if (bodyRef.current) {
        bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.05;
      }
      
      if (tailRef.current) {
        tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.3;
      }
      
      if (headRef.current) {
        headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.05;
      }
    } else {
      setIsMoving(false);
      
      // Idle animations
      if (tailRef.current) {
        tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
      
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
    }
    
    // Eye tracking mouse
    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeMovement = Math.min(0.2, distance * 0.2);
      leftEyeRef.current.position.x = -0.15 + dx * 0.01;
      leftEyeRef.current.position.z = dz * 0.01;
      rightEyeRef.current.position.x = 0.15 + dx * 0.01;
      rightEyeRef.current.position.z = dz * 0.01;
    }
    
    // Blinking animation
    if (leftEyeRef.current && rightEyeRef.current && isBlinking) {
      leftEyeRef.current.scale.y = 0.1;
      rightEyeRef.current.scale.y = 0.1;
    } else if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = 1;
      rightEyeRef.current.scale.y = 1;
    }
    
    // Ear movements
    if (leftEarRef.current && rightEarRef.current) {
      if (isMoving) {
        leftEarRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.1 - 0.2;
        rightEarRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 5) * 0.1 + 0.2;
      } else {
        leftEarRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.05 - 0.1;
        rightEarRef.current.rotation.z = -Math.sin(state.clock.elapsedTime) * 0.05 + 0.1;
      }
    }
  });
  
  // Material colors for the pet
  const petColors = {
    body: new THREE.Color("#d4ae8b"),
    ears: new THREE.Color("#c4a080"),
    nose: new THREE.Color("#ff9a9e"),
    eyes: new THREE.Color("#2d2d2d"),
    pupils: new THREE.Color("#000000"),
  };
  
  return (
    <group ref={group} {...props} dispose={null}>
      {/* Pet body */}
      <group ref={bodyRef}>
        <mesh castShadow receiveShadow>
          <ellipsoidGeometry args={[0.5, 0.35, 0.7]} />
          <meshStandardMaterial 
            ref={materialRef}
            color={petColors.body}
            roughness={0.7}
            metalness={0.1}
            map={null}
          />
        </mesh>
        
        {/* Tail */}
        <group ref={tailRef} position={[-0.6, 0.1, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.1, 0.8]} />
            <meshStandardMaterial color={petColors.body} roughness={0.7} />
          </mesh>
        </group>
        
        {/* Front legs */}
        <mesh position={[0.25, -0.3, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.3]} />
          <meshStandardMaterial color={petColors.body} roughness={0.7} />
        </mesh>
        <mesh position={[0.25, -0.3, -0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.3]} />
          <meshStandardMaterial color={petColors.body} roughness={0.7} />
        </mesh>
        
        {/* Back legs */}
        <mesh position={[-0.3, -0.3, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.3]} />
          <meshStandardMaterial color={petColors.body} roughness={0.7} />
        </mesh>
        <mesh position={[-0.3, -0.3, -0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.3]} />
          <meshStandardMaterial color={petColors.body} roughness={0.7} />
        </mesh>
      </group>
      
      {/* Head */}
      <group ref={headRef} position={[0.4, 0.2, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={petColors.body} roughness={0.7} />
        </mesh>
        
        {/* Ears */}
        <mesh ref={leftEarRef} position={[-0.15, 0.25, -0.15]} rotation={[0, -0.4, -0.2]} castShadow>
          <coneGeometry args={[0.1, 0.2, 32]} />
          <meshStandardMaterial color={petColors.ears} roughness={0.7} />
          
          {/* Inner ear */}
          <mesh position={[0, 0.05, 0]} scale={[0.7, 0.7, 0.7]}>
            <coneGeometry args={[0.08, 0.1, 32]} />
            <meshStandardMaterial color="#e6b3a4" roughness={0.6} />
          </mesh>
        </mesh>
        
        <mesh ref={rightEarRef} position={[-0.15, 0.25, 0.15]} rotation={[0, 0.4, 0.2]} castShadow>
          <coneGeometry args={[0.1, 0.2, 32]} />
          <meshStandardMaterial color={petColors.ears} roughness={0.7} />
          
          {/* Inner ear */}
          <mesh position={[0, 0.05, 0]} scale={[0.7, 0.7, 0.7]}>
            <coneGeometry args={[0.08, 0.1, 32]} />
            <meshStandardMaterial color="#e6b3a4" roughness={0.6} />
          </mesh>
        </mesh>
        
        {/* Face features */}
        {/* Eyes */}
        <group position={[0.2, 0.05, 0]}>
          <mesh ref={leftEyeRef} position={[-0.15, 0, -0.15]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
            
            {/* Pupil */}
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial 
                color="#000000" 
                emissive="#000000" 
                emissiveIntensity={0.5} 
              />
            </mesh>
          </mesh>
          
          <mesh ref={rightEyeRef} position={[-0.15, 0, 0.15]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
            
            {/* Pupil */}
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial 
                color="#000000" 
                emissive="#000000" 
                emissiveIntensity={0.5}
              />
            </mesh>
          </mesh>
        </group>
        
        {/* Nose */}
        <mesh position={[0.3, -0.05, 0]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color={petColors.nose} 
            roughness={0.3}
            emissive={petColors.nose}
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Whiskers */}
        {[...Array(6)].map((_, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const y = Math.floor(i / 2) * 0.04 - 0.04;
          return (
            <mesh key={i} position={[0.25, y, side * 0.15]} rotation={[0, side * Math.PI / 4, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.3, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
          );
        })}
      </group>
      
      {/* Interactive glow effect */}
      <pointLight 
        position={[0, 0.5, 0]} 
        color="#ffb385" 
        intensity={isMoving ? 1.5 : 0.5} 
        distance={3}
        decay={2}
      />
    </group>
  );
}

export default Pet;