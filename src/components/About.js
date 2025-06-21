import React, { useEffect, useState, useRef } from 'react';
import RotatingCube from '../models/RotatingCube';
import { motion } from 'framer-motion';
import './css/About.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Current date/time and user from props
  const currentDateTime = "2025-06-18 17:00:27";
  const userLogin = "anjani-kr-singh-ai";
  
  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(' ', 'T') + 'Z');
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      })
    };
  };
  
  const { date, time } = formatDate(currentDateTime);
  
  // Intersection observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  };
  
  return (
    <section className="anjani-about" ref={sectionRef}>
      {/* Dynamic background elements */}
      <div className="anjani-about-decoration star-1"></div>
      <div className="anjani-about-decoration star-2"></div>
      <div className="anjani-about-decoration line"></div>
      <div className="anjani-about-decoration orbit"></div>
      
      <div className="anjani-about-container">
        <motion.div 
          className="anjani-about-wrapper"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Text content section with animations */}
          <motion.div className="anjani-about-content" variants={itemVariants}>
            
            <h2 className="anjani-about-heading">
              Learn more <span className="anjani-about-heading-accent">about me</span>
            </h2>
            
            <p className="anjani-about-paragraph">
              <strong>Hello!</strong> I'm a passionate developer with expertise in web and AI technologies.
              My journey in tech has been focused on creating <em>intuitive</em> and <em>engaging</em> experiences.
            </p>
            
            <p className="anjani-about-paragraph">
              My specialty lies in building interactive web applications using React, Three.js, and modern CSS techniques.
              I love bringing creative ideas to life through code and design, creating memorable digital experiences.
            </p>
            
            <div className="anjani-about-skills">
              <div className="anjani-about-skill-chip">React</div>
              <div className="anjani-about-skill-chip">Three.js</div>
              <div className="anjani-about-skill-chip">AI</div>
              <div className="anjani-about-skill-chip">CSS/SCSS</div>
              <div className="anjani-about-skill-chip">Node.js</div>
            </div>
            
            <div className="anjani-about-cta">
              <button className="anjani-about-button anjani-about-primary-button">
                <span className="anjani-about-button-text">View Projects</span>
                <span className="anjani-about-button-icon">→</span>
              </button>
              <button className="anjani-about-button anjani-about-secondary-button">
                <span className="anjani-about-button-text">Contact Me</span>
              </button>
            </div>
          </motion.div>
          
          {/* 3D cube section with animation */}
          <motion.div 
            className="anjani-about-cube"
            variants={itemVariants}
          >
            <RotatingCube/>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scrolling indicator */}
      <div className="anjani-about-scroll-indicator">
        <div className="anjani-about-scroll-indicator-text">Scroll to explore</div>
        <div className="anjani-about-scroll-indicator-arrow"></div>
      </div>
    </section>
  );
};

export default About;