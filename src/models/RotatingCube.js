import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './RotatingCube.css';

// A single tile of the cube - no hover effects
const Tile = ({ position, size, skill, index, faceIndex }) => {
  const meshRef = useRef();
  
  // Visual settings based on face index
  const faceColors = [
    { bg: "#8A2BE2", accent: "#00BFFF" }, // Front face
    { bg: "#4B0082", accent: "#FF00FF" }, // Back face
    { bg: "#6A0DAD", accent: "#00BFFF" }, // Top face
    { bg: "#4B0082", accent: "#8A2BE2" }, // Bottom face
    { bg: "#6A0DAD", accent: "#00BFFF" }, // Right face
    { bg: "#4B0082", accent: "#FF00FF" }  // Left face
  ];
  
  const colorSet = faceColors[faceIndex % faceColors.length];
  
  // Create a canvas-based texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Fill background with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colorSet.bg);
    gradient.addColorStop(1, shadeColor(colorSet.bg, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border with glow effect
    ctx.strokeStyle = colorSet.accent;
    ctx.lineWidth = 10;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colorSet.accent;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.shadowBlur = 0;
    
    // Add the skill icon
    ctx.fillStyle = 'white';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(skill.icon, canvas.width / 2, canvas.height / 2 - 20);
    
    // Add skill name
    ctx.font = 'bold 24px Arial';
    ctx.fillText(skill.name, canvas.width / 2, canvas.height / 2 + 40);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [skill, colorSet]);
  
  // Helper function to shade colors
  function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    
    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);
    
    R = Math.min(R, 255);
    G = Math.min(G, 255);
    B = Math.min(B, 255);
    
    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
    
    return "#" + RR + GG + BB;
  }
  
  // Enhanced material
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.4,
      roughness: 0.5,
      emissive: new THREE.Color(colorSet.accent),
      emissiveIntensity: 0.1,
    });
  }, [texture, colorSet.accent]);
  
  // No gaps between tiles - completely attached
  const tileGap = 0.0;
  const adjustedSize = size - tileGap;
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[adjustedSize, adjustedSize, adjustedSize]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

// A single face of the cube (3x3 grid of tiles)
const CubeFace = ({ 
  faceIndex, 
  position, 
  rotation, 
  skills, 
  tileSize = 0.65
}) => {
  const generateTilePositions = () => {
    const positions = [];
    // No gap between tiles for solid appearance
    const offset = tileSize * 1.0;
    
    for (let y = 1; y >= -1; y--) {
      for (let x = -1; x <= 1; x++) {
        positions.push([x * offset, y * offset, 0]);
      }
    }
    
    return positions;
  };
  
  const tilePositions = useMemo(() => generateTilePositions(), [tileSize]);
  
  return (
    <group position={position} rotation={rotation}>
      {skills.map((skill, index) => (
        <Tile 
          key={index}
          position={tilePositions[index]}
          size={tileSize}
          skill={skill}
          index={index}
          faceIndex={faceIndex}
        />
      ))}
    </group>
  );
};

// The complete rubik's cube with 6 faces
const RubiksCube = () => {
  const cubeRef = useRef();
  
  // Base skills for each face
  const baseSkills = [
    [
      // Frontend - Face 0
      { name: "React", icon: "⚛️", category: "Frontend", level: "Expert" },
      { name: "Vue", icon: "🟢", category: "Frontend", level: "Advanced" },
      { name: "Angular", icon: "🔴", category: "Frontend", level: "Intermediate" },
      { name: "HTML5", icon: "📄", category: "Frontend", level: "Expert" },
      { name: "CSS3", icon: "🎨", category: "Frontend", level: "Expert" },
      { name: "JavaScript", icon: "📜", category: "Frontend", level: "Expert" },
      { name: "TypeScript", icon: "🔷", category: "Frontend", level: "Advanced" },
      { name: "Redux", icon: "🔄", category: "Frontend", level: "Advanced" },
      { name: "Webpack", icon: "📦", category: "Frontend", level: "Intermediate" }
    ],
    [
      // Backend - Face 1
      { name: "Node.js", icon: "🟢", category: "Backend", level: "Expert" },
      { name: "Express", icon: "🚀", category: "Backend", level: "Expert" },
      { name: "Django", icon: "🐍", category: "Backend", level: "Intermediate" },
      { name: "Flask", icon: "🧪", category: "Backend", level: "Advanced" },
      { name: "GraphQL", icon: "📊", category: "Backend", level: "Advanced" },
      { name: "REST API", icon: "🔌", category: "Backend", level: "Expert" },
      { name: "Python", icon: "🐍", category: "Backend", level: "Advanced" },
      { name: "Java", icon: "☕", category: "Backend", level: "Intermediate" },
      { name: "Go", icon: "🔵", category: "Backend", level: "Beginner" }
    ],
    [
      // AI/ML - Face 2
      { name: "TensorFlow", icon: "🧠", category: "AI/ML", level: "Advanced" },
      { name: "PyTorch", icon: "🔥", category: "AI/ML", level: "Intermediate" },
      { name: "NLP", icon: "🗣️", category: "AI/ML", level: "Intermediate" },
      { name: "Computer Vision", icon: "👁️", category: "AI/ML", level: "Advanced" },
      { name: "Data Science", icon: "📊", category: "AI/ML", level: "Advanced" },
      { name: "ML Ops", icon: "🚂", category: "AI/ML", level: "Intermediate" },
      { name: "Neural Networks", icon: "🕸️", category: "AI/ML", level: "Advanced" },
      { name: "Scikit-learn", icon: "🔬", category: "AI/ML", level: "Advanced" },
      { name: "Pandas", icon: "🐼", category: "AI/ML", level: "Expert" }
    ],
    [
      // Cloud - Face 3
      { name: "AWS", icon: "☁️", category: "Cloud", level: "Advanced" },
      { name: "Azure", icon: "🌊", category: "Cloud", level: "Intermediate" },
      { name: "GCP", icon: "🌈", category: "Cloud", level: "Intermediate" },
      { name: "Kubernetes", icon: "🚢", category: "Cloud", level: "Advanced" },
      { name: "Docker", icon: "🐳", category: "Cloud", level: "Expert" },
      { name: "Terraform", icon: "🏗️", category: "Cloud", level: "Intermediate" },
      { name: "CI/CD", icon: "🔄", category: "Cloud", level: "Expert" },
      { name: "Serverless", icon: "⚡", category: "Cloud", level: "Advanced" },
      { name: "Microservices", icon: "🧩", category: "Cloud", level: "Advanced" }
    ],
    [
      // Database - Face 4
      { name: "MongoDB", icon: "🍃", category: "Database", level: "Expert" },
      { name: "PostgreSQL", icon: "🐘", category: "Database", level: "Advanced" },
      { name: "MySQL", icon: "🐬", category: "Database", level: "Advanced" },
      { name: "Redis", icon: "🔴", category: "Database", level: "Intermediate" },
      { name: "Elasticsearch", icon: "🔍", category: "Database", level: "Intermediate" },
      { name: "Firebase", icon: "🔥", category: "Database", level: "Advanced" },
      { name: "DynamoDB", icon: "⚡", category: "Database", level: "Intermediate" },
      { name: "Neo4j", icon: "🕸️", category: "Database", level: "Beginner" },
      { name: "SQL", icon: "📝", category: "Database", level: "Expert" }
    ],
    [
      // Design - Face 5
      { name: "Figma", icon: "🎨", category: "Design", level: "Advanced" },
      { name: "Adobe XD", icon: "📐", category: "Design", level: "Intermediate" },
      { name: "Photoshop", icon: "🖌️", category: "Design", level: "Intermediate" },
      { name: "Illustrator", icon: "✏️", category: "Design", level: "Intermediate" },
      { name: "UI Design", icon: "📱", category: "Design", level: "Advanced" },
      { name: "UX Research", icon: "🔎", category: "Design", level: "Advanced" },
      { name: "Accessibility", icon: "♿", category: "Design", level: "Advanced" },
      { name: "Animation", icon: "🎬", category: "Design", level: "Intermediate" },
      { name: "Design Systems", icon: "🧩", category: "Design", level: "Advanced" }
    ]
  ];

  // Set up face positions and rotations
  const faceConfigs = [
    { position: [0, 0, 2], rotation: [0, 0, 0] },               // Front
    { position: [0, 0, -2], rotation: [0, Math.PI, 0] },        // Back
    { position: [0, 2, 0], rotation: [Math.PI / 2, 0, 0] },     // Top
    { position: [0, -2, 0], rotation: [-Math.PI / 2, 0, 0] },   // Bottom
    { position: [2, 0, 0], rotation: [0, Math.PI / 2, 0] },     // Right
    { position: [-2, 0, 0], rotation: [0, -Math.PI / 2, 0] }    // Left
  ];
  
  // Optional: Slow auto-rotation if no user is interacting
  useFrame((state) => {
    if (!cubeRef.current) return;
    
    // Very slow gentle rotation when not being controlled
    cubeRef.current.rotation.y += 0.001;
    const time = state.clock.getElapsedTime();
    cubeRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;
  });
  
  return (
    <group ref={cubeRef} rotation={[0.4, 0.5, 0]} position={[0, 0, 0]}>
      {faceConfigs.map((config, index) => (
        <CubeFace
          key={index}
          faceIndex={index}
          position={config.position}
          rotation={config.rotation}
          skills={baseSkills[index]}
        />
      ))}
    </group>
  );
};

// Scene setup component with orbit controls for manual rotation
const CubeScene = () => {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1}
        castShadow
        intensity={1}
      />
      <spotLight
        position={[-10, -10, -10]}
        color="#8A2BE2"
        intensity={0.4}
        castShadow
      />
      <pointLight 
        position={[0, 0, 10]} 
        intensity={0.5}
        color="#00BFFF"
      />
      
      {/* Main cube */}
      <RubiksCube />
      
      {/* Enhanced orbit controls for better manual rotation */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.8}
        dampingFactor={0.1}
        enableDamping={true}
      />
    </>
  );
};

// Main exported component
const SkillsRubikCube = ({ dateTime = "2025-06-18 18:02:56", username = "anjani-kr-singh-ai" }) => {
  return (
    <div className="anjani-rubik-container">
      
      {/* Canvas container */}
      <div className="anjani-rubik-scene">
        <Canvas
          shadows
          camera={{ position: [0, 0, 10], fov: 40 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]} // Responsive resolution
        >
          <Suspense fallback={null}>
            <CubeScene />
          </Suspense>
          
          {/* Post-processing effects */}
          <fog attach="fog" args={['#050816', 10, 20]} />
        </Canvas>
      </div>
      
      {/* Visual effects - kept for aesthetics */}
      <div className="anjani-rubik-glow"></div>
      <div className="anjani-rubik-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`anjani-rubik-particle particle-${i + 1}`}></div>
        ))}
      </div>
      
      {/* Face category labels */}
      <div className="anjani-rubik-face-labels">
        <div className="anjani-rubik-face-label front">Frontend</div>
        <div className="anjani-rubik-face-label back">Backend</div>
        <div className="anjani-rubik-face-label top">AI/ML</div>
        <div className="anjani-rubik-face-label bottom">Cloud</div>
        <div className="anjani-rubik-face-label right">Database</div>
        <div className="anjani-rubik-face-label left">Design</div>
      </div>
    </div>
  );
};

export default SkillsRubikCube;