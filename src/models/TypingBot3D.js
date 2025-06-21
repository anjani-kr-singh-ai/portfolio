import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useGLTF, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const TypingBot3D = ({ form, formStatus }) => {
  // Head ref to animate the robot
  const botRef = useRef();
  const screenRef = useRef();
  const keysRef = useRef({});
  const armsRef = useRef();
  
  // Track if we should show typing animation
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [displayText, setDisplayText] = useState('Hello! How can I help you?');
  
  // Effect to handle typing animation
  useEffect(() => {
    // Start typing animation when form changes
    if (form.message && form.message.length > 0) {
      setIsTyping(true);
      
      // Gradually reveal the message as if typing
      let currentText = '';
      const message = form.message;
      let charIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (charIndex < message.length) {
          currentText += message[charIndex];
          setTypedText(currentText);
          charIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100);
      
      return () => clearInterval(typingInterval);
    } else {
      setIsTyping(false);
      setTypedText('');
    }
  }, [form.message]);
  
  // Handle form status changes
  useEffect(() => {
    if (formStatus === 'sending') {
      setDisplayText('Sending your message...');
    } else if (formStatus === 'success') {
      setDisplayText('Message delivered! Thank you!');
      
      // Reset after a few seconds
      const timer = setTimeout(() => {
        setDisplayText('Ready for another message?');
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      if (!typedText) {
        setDisplayText('Hello! How can I help you?');
      }
    }
  }, [formStatus, typedText]);
  
  // Animation loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Animate robot head
    if (botRef.current) {
      // Gentle hovering animation
      botRef.current.position.y = Math.sin(t * 1.5) * 0.05 + 1.5;
      
      // Head tilting when typing
      if (isTyping) {
        botRef.current.rotation.z = Math.sin(t * 10) * 0.03;
        botRef.current.rotation.x = Math.sin(t * 5) * 0.02 - 0.1; // Looking down at keyboard
      } else {
        botRef.current.rotation.z = Math.sin(t * 2) * 0.02;
        botRef.current.rotation.x = Math.sin(t * 1.5) * 0.01;
      }
    }
    
    // Animate screen glow
    if (screenRef.current) {
      const intensity = 0.5 + Math.sin(t * 2) * 0.1;
      screenRef.current.material.emissiveIntensity = intensity;
    }
    
    // Animate keyboard keys
    if (keysRef.current && isTyping) {
      Object.values(keysRef.current).forEach((key, i) => {
        if (key && Math.random() > 0.7) {
          key.position.y = -0.02 - Math.random() * 0.03;
        } else if (key) {
          key.position.y = -0.02;
        }
      });
    }
    
    // Animate arms when typing
    if (armsRef.current && isTyping) {
      armsRef.current.rotation.x = -0.2 + Math.sin(t * 15) * 0.1;
    } else if (armsRef.current) {
      armsRef.current.rotation.x = -0.1 + Math.sin(t * 2) * 0.05;
    }
  });
  
  return (
    <group position={[0, -0.5, 0]}>
      {/* Bot Head */}
      <group ref={botRef} position={[0, 1.5, 0]}>
        {/* Main head */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial 
            color="#8A2BE2" 
            metalness={0.5} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Face screen */}
        <mesh position={[0, 0, 0.36]} ref={screenRef}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial 
            color="#00BFFF" 
            emissive="#00BFFF"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.15, 0.05, 0.37]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.15, 0.05, 0.37]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Mouth - changes with status */}
        <mesh position={[0, -0.1, 0.37]}>
          <planeGeometry args={[0.3, 0.05]} />
          <meshBasicMaterial 
            color={formStatus === 'success' ? "#4ade80" : 
                  formStatus === 'sending' ? "#FFA500" : "#FF00FF"} 
          />
        </mesh>
        
        {/* Antennas */}
        <mesh position={[-0.2, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh position={[0.2, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh position={[-0.2, 0.6, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial 
            color="#FF00FF" 
            emissive="#FF00FF"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0.2, 0.6, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial 
            color="#FF00FF" 
            emissive="#FF00FF"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      
      {/* Robot Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 16]} />
        <meshStandardMaterial 
          color="#0a0e24" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Arms */}
      <group ref={armsRef} position={[0, 0.7, 0]}>
        <mesh position={[-0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh position={[0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        
        {/* Hands */}
        <mesh position={[-0.5, -0.35, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            color="#8A2BE2" 
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.5, -0.35, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            color="#8A2BE2" 
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* Keyboard */}
      <mesh position={[0, -0.02, 0.6]} rotation={[-Math.PI * 0.1, 0, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Keyboard keys */}
      <group position={[0, 0, 0.6]} rotation={[-Math.PI * 0.1, 0, 0]}>
        {Array.from({ length: 30 }).map((_, i) => {
          const row = Math.floor(i / 10);
          const col = i % 10;
          const x = (col - 4.5) * 0.1;
          const z = (row - 1) * 0.15;
          
          return (
            <mesh 
              key={`key-${i}`}
              position={[x, -0.02, z]}
              ref={el => { keysRef.current[i] = el }}
            >
              <boxGeometry args={[0.08, 0.03, 0.08]} />
              <meshStandardMaterial 
                color={Math.random() > 0.8 ? "#00BFFF" : "#666"} 
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Speech bubble with typing text */}
      <group position={[0, 2.5, 0]}>
        <mesh>
          <planeGeometry args={[2.4, 0.8]} />
          <meshStandardMaterial 
            color="#111122" 
            transparent
            opacity={0.7}
          />
        </mesh>
        
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.1}
          maxWidth={2.2}
          lineHeight={1.2}
          color="#ffffff"
          textAlign="center"
          font="/fonts/Inter-Regular.woff" // Make sure this path is correct
          anchorX="center"
          anchorY="middle"
        >
          {typedText || displayText}
        </Text>
        
        {/* Speech bubble connector */}
        <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.2, 0.01]} />
          <meshStandardMaterial 
            color="#111122" 
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
      
      {/* Sparkles for magic effect */}
      <Sparkles
        count={30}
        scale={3}
        size={0.4}
        speed={0.3}
        opacity={0.5}
        noise={0.5}
        color="#FF00FF"
      />
      
      {/* Ground reflective surface */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial 
          color="#050816" 
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

export default TypingBot3D;