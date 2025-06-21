import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import './css/Preloader.css';

// Camera controller for subtle movement
function CameraController() {
  const { camera } = useThree();
  const time = useRef(0);
  
  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);
  
  useFrame(() => {
    time.current += 0.002;
    const x = Math.sin(time.current) * 0.2;
    const y = Math.cos(time.current * 0.5) * 0.1;
    
    camera.position.x += (x - camera.position.x) * 0.01;
    camera.position.y += (y - camera.position.y) * 0.01;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Professional background gradient with animated elements
function GradientBackground() {
  const backgroundRef = useRef();
  
  useFrame(({ clock }) => {
    if (backgroundRef.current) {
      backgroundRef.current.rotation.z = clock.getElapsedTime() * 0.02;
    }
  });
  
  return (
    <mesh ref={backgroundRef} scale={[20, 20, 20]} position={[0, 0, -10]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial 
        color="#050c20" 
        map={useMemo(() => {
          const canvas = document.createElement('canvas');
          canvas.width = 1024;
          canvas.height = 1024;
          const ctx = canvas.getContext('2d');
          
          // Create professional dark gradient background
          const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
          gradient.addColorStop(0, '#050c20');   // Deep blue-black
          gradient.addColorStop(0.5, '#0b1a3b'); // Navy blue
          gradient.addColorStop(1, '#050c20');   // Back to deep blue-black
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1024, 1024);
          
          // Add subtle texture/noise
          for (let i = 0; i < 5000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 1.5;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          return new THREE.CanvasTexture(canvas);
        }, [])}
        transparent={true}
        opacity={1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Professional geometric elements
function GeometricElements() {
  const groupRef = useRef();
  
  const geometries = useMemo(() => {
    const items = [];
    // Create various shapes in a professional arrangement
    for (let i = 0; i < 20; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5 - 3
      );
      
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      const scale = 0.2 + Math.random() * 0.5;
      
      // Choose geometry type based on index
      let geometry;
      if (i % 4 === 0) {
        geometry = 'box';
      } else if (i % 4 === 1) {
        geometry = 'octahedron';
      } else if (i % 4 === 2) {
        geometry = 'dodecahedron';
      } else {
        geometry = 'tetrahedron';
      }
      
      const color = new THREE.Color(
        0.1 + Math.random() * 0.1,
        0.3 + Math.random() * 0.2,
        0.6 + Math.random() * 0.3
      );
      
      items.push({
        position,
        rotation,
        scale,
        geometry,
        color,
        speed: 0.2 + Math.random() * 0.5,
        rotationAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
      });
    }
    return items;
  }, []);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      groupRef.current.children.forEach((mesh, i) => {
        const item = geometries[i];
        // Rotate each element around its own axis
        const rotationAngle = time * 0.2 * item.speed;
        mesh.rotation.x = item.rotation.x + rotationAngle;
        mesh.rotation.y = item.rotation.y + rotationAngle;
        
        // Subtle floating movement
        mesh.position.y += Math.sin(time * item.speed) * 0.0015;
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {geometries.map((item, index) => (
        <mesh
          key={index}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
        >
          {item.geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
          {item.geometry === 'octahedron' && <octahedronGeometry args={[1]} />}
          {item.geometry === 'dodecahedron' && <dodecahedronGeometry args={[1]} />}
          {item.geometry === 'tetrahedron' && <tetrahedronGeometry args={[1]} />}
          <meshStandardMaterial
            color={item.color}
            metalness={0.8}
            roughness={0.2}
            wireframe={Math.random() > 0.7}
            opacity={0.8}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

// Professional connecting lines
function ConnectingLines() {
  const linesRef = useRef();
  const pointsCount = 12;
  
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < pointsCount; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 3 - 2
        )
      );
    }
    return pts;
  }, [pointsCount]);
  
  useFrame(({ clock }) => {
    if (linesRef.current) {
      const time = clock.getElapsedTime() * 0.5;
      const positions = linesRef.current.geometry.attributes.position;
      
      // Animate line endpoints
      for (let i = 0; i < pointsCount; i++) {
        points[i].y += Math.sin(time + i * 0.5) * 0.01;
        points[i].x += Math.cos(time + i * 0.5) * 0.01;
      }
      
      // Connect each point to its closest neighbors
      let index = 0;
      for (let i = 0; i < pointsCount; i++) {
        for (let j = i + 1; j < pointsCount; j++) {
          const distance = points[i].distanceTo(points[j]);
          if (distance < 6) {
            positions.setXYZ(index++, points[i].x, points[i].y, points[i].z);
            positions.setXYZ(index++, points[j].x, points[j].y, points[j].z);
          }
        }
      }
      
      positions.needsUpdate = true;
    }
  });
  
  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={pointsCount * pointsCount}
          array={new Float32Array(pointsCount * pointsCount * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color="#4080ff" 
        transparent
        opacity={0.2}
        linewidth={1}
      />
    </lineSegments>
  );
}

// Professional particles effect
function PortfolioParticles() {
  const particlesRef = useRef();
  const count = 100;
  
  const [particlePositions, particleSizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create a more professional distribution
      const radius = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() * 0.8 + 0.1) * Math.PI; // Concentrate around the horizontal plane
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5; // Flatten vertically
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Subtle size variation for professional look
      sizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    return [positions, sizes];
  }, [count]);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const time = clock.getElapsedTime();
      particlesRef.current.rotation.y = time * 0.03;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          array={particlePositions} 
          count={count} 
          itemSize={3} 
        />
        <bufferAttribute
          attach="attributes-size"
          array={particleSizes}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Glow effect for text via DOM elements
function GlowEffect() {
  return (
    <div className="glow-container">
      <div className="glow-element"></div>
    </div>
  );
}

function Preloader() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText = "ANJANI'S PORTFOLIO";
  
  useEffect(() => {
    // Professional progress animation with variable speed
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        // More professional loading curve
        let increment;
        if (prev < 15) {
          increment = Math.random() * 0.8 + 0.2;  // Initial loading
        } else if (prev < 60) {
          increment = Math.random() * 1.2 + 0.3;  // Main loading phase
        } else if (prev < 85) {
          increment = Math.random() * 0.7 + 0.2;  // Slowing down
        } else {
          increment = Math.random() * 0.3 + 0.1;  // Final phase
        }
        
        const newProgress = prev + increment;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);
    
    // Professional typing animation
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.substring(0, currentIndex));
      currentIndex++;
      
      if (currentIndex > fullText.length) {
        // Keep full text displayed when finished typing
        clearInterval(typingInterval);
      }
    }, 120);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(typingInterval);
    };
  }, []);

  return (
    <div className="preloader">
      {/* 3D Background Canvas - Professional Style */}
      <Canvas 
        className="preloader-canvas"
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]} // Responsive rendering
      >
        <CameraController />
        <GradientBackground />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, 5]} intensity={0.5} color="#4080ff" />
        
        <Stars
          radius={50}
          depth={20}
          count={1000}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />
        
        <ConnectingLines />
        <GeometricElements />
        <PortfolioParticles />
      </Canvas>
      
      {/* Professional Content Overlay */}
      <div className="preloader-content">
        <GlowEffect />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="preloader-header"
        >
          <h1 className="preloader-title">
            <span className="typed-text">{typedText}</span>
            <span className="blinking-cursor"></span>
          </h1>
        </motion.div>
        
        <div className="progress-container">
          <motion.div
            className="progress-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="percentage">{Math.round(loadingProgress)}%</span>
            <span className="status">
              {loadingProgress < 20 ? "Initializing" : 
               loadingProgress < 50 ? "Loading Projects" : 
               loadingProgress < 80 ? "Preparing Assets" :
               loadingProgress < 95 ? "Finalizing" :
               "Ready"}
            </span>
          </motion.div>
          
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.2 }}
            >
              <div className="progress-glow"></div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="portfolio-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          <p>Web Developer • UX Designer • Creative Technologist</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Preloader;