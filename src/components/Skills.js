import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import SkillsPolyhedron from '../models/SkillsPolyhedron.js';
import './css/Skills.css';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

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
  
  // Skills categories
  const skillCategories = [
    {
      name: "Frontend",
      skills: ["React", "Vue", "JavaScript", "TypeScript", "HTML/CSS", "Tailwind CSS"]
    },
    {
      name: "Backend",
      skills: ["Node.js", "Express", "Python", "Django", "Java", "GraphQL"]
    },
    {
      name: "Tools & Others",
      skills: ["Git", "Docker", "AWS", "Firebase", "MongoDB", "PostgreSQL"]
    }
  ];

  // Current timestamp
  const timestamp = "2025-06-19 07:58:46";
  const userLogin = "anjani-kr-singh-ai";

  return (
    <section className="anjani-skills" id="skills">
      <div className="anjani-skills-container">

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="anjani-skills-header"
        >

          <motion.h2 
            className="anjani-skills-heading"
            variants={itemVariants}
          >
            My <span className="anjani-skills-heading-accent">Skills</span>
          </motion.h2>
          <motion.p 
            className="anjani-skills-paragraph"
            variants={itemVariants}
          >
            Explore my technical expertise visualized as an <strong>interactive 3D polyhedron</strong>.
            Skills are organized by category radiating from a central core.
          </motion.p>
        </motion.div>

        <div className="anjani-skills-wrapper">
          {/* 3D Skills Polyhedron Visualization */}
          <motion.div 
            className="anjani-skills-sphere"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Canvas className="anjani-skills-canvas">
              <SkillsPolyhedron dateTime={timestamp} username={userLogin} />
            </Canvas>
          </motion.div>

          {/* Skills List */}
          <motion.div 
            className="anjani-skills-list"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {skillCategories.map((category, index) => (
              <motion.div 
                key={index} 
                className="anjani-skills-category"
                variants={itemVariants}
              >
                <h3 className="anjani-skills-category-title">
                  {category.name}
                </h3>
                <div className="anjani-skills-chips">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      className="anjani-skills-chip"
                      whileHover={{ 
                        scale: 1,
                        boxShadow: "0 0 15px rgba(138, 43, 226, 0.5)" 
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15
                      }}
                    >
                      <span className="anjani-skills-chip-text">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
            
            <motion.div 
              className="anjani-skills-cta"
              variants={itemVariants}
            >
              <a href="#projects" className="anjani-skills-button anjani-skills-primary-button">
                <span className="anjani-skills-button-text">See My Projects</span>
                <span className="anjani-skills-button-icon">→</span>
              </a>
              <a href="#contact" className="anjani-skills-button anjani-skills-secondary-button">
                <span className="anjani-skills-button-text">Get In Touch</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="anjani-skills-decoration star-1"></div>
        <div className="anjani-skills-decoration star-2"></div>
        <div className="anjani-skills-decoration line"></div>
        <div className="anjani-skills-decoration orbit"></div>
      </div>
    </section>
  );
};

export default Skills;