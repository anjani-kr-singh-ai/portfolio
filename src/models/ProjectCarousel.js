import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const ProjectCarousel = ({ projects }) => {
  const groupRef = useRef();
  const [hoveredProject, setHoveredProject] = useState(null);
  const [clickedProject, setClickedProject] = useState(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5; // Responsive layout
  
  // Load textures for project cards (placeholder)
  const textureUrls = projects.map(project => project.image);
  const texturePlaceholder = '/assets/textures/stars.png'; // Default texture
  
  // Rotate carousel
  useFrame((state, delta) => {
    if (groupRef.current && hoveredProject === null) {
      groupRef.current.rotation.y += 0.005;
    }
  });
  
  // Calculate positions in a circle
  const radius = isMobile ? 3 : 5;
  const getPosition = (index, total) => {
    const angle = (index / total) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    return [x, 0, z];
  };

  // Get rotation to face the camera
  const getRotation = (index, total) => {
    const angle = (index / total) * Math.PI * 2;
    return [0, angle + Math.PI, 0];
  };
  
  // Handle closing the modal
  const handleCloseModal = () => {
    setClickedProject(null);
  };

  return (
    <group ref={groupRef}>
      {projects.map((project, index) => {
        const position = getPosition(index, projects.length);
        const rotation = getRotation(index, projects.length);
        
        const isHovered = hoveredProject === project.id;
        
        return (
          <group
            key={project.id}
            position={position}
            rotation={rotation}
            onPointerOver={() => setHoveredProject(project.id)}
            onPointerOut={() => setHoveredProject(null)}
            onClick={() => setClickedProject(project)}
          >
            {/* Project Card */}
            <mesh
              scale={isHovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
            >
              <boxGeometry args={[2, 2.5, 0.1]} />
              <meshStandardMaterial 
                color="#4B0082" 
                metalness={0.5} 
                roughness={0.2}
              />
              
              {/* Project Image (placeholder) */}
              <mesh position={[0, 0.6, 0.055]}>
                <planeGeometry args={[1.8, 1]} />
                <meshBasicMaterial color="#8A2BE2" />
                <Text
                  position={[0, 0, 0.01]}
                  fontSize={0.1}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  Project Image
                </Text>
              </mesh>
              
              {/* Project Title */}
              <Text
                position={[0, -0.2, 0.06]}
                fontSize={0.15}
                color="white"
                font="/assets/fonts/Inter-Bold.woff"
                anchorX="center"
                anchorY="middle"
                maxWidth={1.8}
              >
                {project.title}
              </Text>
              
              {/* Tech Stack */}
              <group position={[0, -0.5, 0.06]}>
                <Text
                  position={[0, 0, 0]}
                  fontSize={0.08}
                  color="#00BFFF"
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={1.8}
                >
                  {project.tech.join(" • ")}
                </Text>
              </group>
              
              {/* View Project Button (visible on hover) */}
              {isHovered && (
                <mesh position={[0, -0.9, 0.06]} scale={[1, 0.3, 0.01]}>
                  <boxGeometry />
                  <meshBasicMaterial color="#00BFFF" />
                  <Text
                    position={[0, 0, 0.1]}
                    fontSize={0.1}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                  >
                    View Project
                  </Text>
                </mesh>
              )}
            </mesh>
          </group>
        );
      })}
      
      {/* Project Modal */}
      {clickedProject && (
        <Html center position={[0, 0, 0]} className="w-[300px] sm:w-[400px] z-10 pointer-events-auto">
          <div className="glass rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{clickedProject.title}</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-800 h-40 rounded mb-4 flex items-center justify-center">
              <span>Project Image</span>
            </div>
            
            <p className="mb-4">{clickedProject.description}</p>
            
            <div className="mb-4">
              <p className="text-sm text-gray-300 mb-2">Technologies:</p>
              <div className="flex flex-wrap gap-2">
                {clickedProject.tech.map((tech, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-[#4B0082] px-2 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              <a 
                href={clickedProject.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn flex-1 text-center text-sm"
              >
                Live Demo
              </a>
              <a 
                href={clickedProject.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn flex-1 text-center text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default ProjectCarousel;