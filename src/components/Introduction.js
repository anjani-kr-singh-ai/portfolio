import React, { useRef, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Robot } from '../models/Robot.js';
import './css/Introduction.css';

// Loading fallback component
const LoadingFallback = () => (
  <div className="anjani-avatar-loading">
    <div className="anjani-avatar-loading-spinner"></div>
    <p>Loading Avatar...</p>
  </div>
);

const Introduction = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div id="anjani-intro" className="anjani-intro">
      <div className="anjani-intro-container">
        {/* Text Content */}
        <motion.div 
          className="anjani-intro-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="anjani-intro-badge">
            <span className="anjani-intro-badge-icon">💫</span>
            <span className="anjani-intro-badge-text">
              <span className="anjani-intro-badge-date">2025-06-18</span>
              <span className="anjani-intro-badge-separator">•</span>
              <span className="anjani-intro-badge-login">anjani-kr-singh-ai</span>
            </span>
          </div>
  
          <motion.h2 
            className="anjani-intro-subtitle"
            variants={itemVariants}
          >
            Welcome to my Nebluverse
          </motion.h2>
          
          <motion.h1 
            className="anjani-intro-title"
            variants={itemVariants}
          >
            I'm Anjani <span className="anjani-intro-wave"></span>
          </motion.h1>
          
          <motion.p 
            className="anjani-intro-description"
            variants={itemVariants}
          >
            <span className="anjani-intro-role">Developer</span>
            <span className="anjani-intro-separator"></span>
            <span className="anjani-intro-role">Designer</span>
            <span className="anjani-intro-separator"></span>
            <span className="anjani-intro-role">Dreamer</span>
          </motion.p>
          
          <motion.div 
            className="anjani-intro-cta"
            variants={itemVariants}
          >
            <a href="#about" className="anjani-intro-button">
              <span className="anjani-intro-button-text">Explore My Universe</span>
              <span className="anjani-intro-button-icon">→</span>
              <span className="anjani-intro-button-glow"></span>
            </a>
          </motion.div>
        </motion.div>
        
        {/* 3D Avatar */}
        <motion.div 
          className="anjani-intro-avatar"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="anjani-intro-avatar-container">
            <Canvas shadows>
              <Suspense fallback={null}>
                <ambientLight intensity={0.6} />
                <spotLight 
                  position={[19.5, -1, 0]}
                  angle={0.15} 
                  penumbra={1} 
                  intensity={1.5}
                  castShadow 
                  shadow-mapSize={[1024, 1024]}
                />
<Robot position={[0, -1.2, 0]} scale={[1, 1, 1]} />
                <ContactShadows 
                  opacity={0.6} 
                  scale={10} 
                  blur={1.5} 
                  far={10} 
                  resolution={256} 
                  color="#000000"
                />
                <Environment preset="city" />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={2}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 3}
                />
              </Suspense>
            </Canvas>
            
            {/* Avatar platform */}
            <div className="anjani-intro-avatar-platform">
              <div className="anjani-intro-avatar-platform-glow"></div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Background decorations */}
      <div className="anjani-intro-decoration dot-1"></div>
      <div className="anjani-intro-decoration dot-2"></div>
      <div className="anjani-intro-decoration dot-3"></div>
      <div className="anjani-intro-decoration line-1"></div>
      <div className="anjani-intro-decoration line-2"></div>
    </div>
  );
};

export default Introduction;