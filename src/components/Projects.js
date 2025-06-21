import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import ProjectsShowcase from '../models/ProjectsShowcase.js';
import './css/Projects.css';

const Projects = () => {
  const ref = useRef(null);
  const modelRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    // Set a flag when component mounts to ensure canvas renders properly
    setModelLoaded(true);
  }, []);

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
  
  // Projects list
  const projectsList = [
  {
    id: "proj-001",
    name: "Brief AI – Smart News Summarizer Bot",
    description: "Telegram bot that summarizes news articles, detects tone, assigns categories, and generates catchy titles in real-time.",
    technologies: [
      "Python", "Telegram Bot API", "facebook/bart-large-cnn", 
      "google/pegasus-xsum", "BERTopic", "newspaper3k", 
      "facebook/bart-large-mnli"
    ],
    link: "https://github.com/anjani-kr-singh-ai/AI_PROJECT" // Replace with actual GitHub repo if available
  },
  {
    id: "proj-002",
    name: "News AI – Category-based News Bot",
    description: "A Telegram bot that fetches and summarizes real-time news based on user-defined categories like Tech or Health.",
    technologies: [
      "Python", "Telegram Bot API", "GNews API", 
      "facebook/bart-large-cnn", "google/pegasus-xsum", 
      "cardiffnlp/twitter-roberta-base-sentiment"
    ],
    link: "https://github.com/anjani-kr-singh-ai/AI_PROJECT" // Replace with actual GitHub repo if available
  },
  {
    id: "proj-003",
    name: "Solasta2k25 Website",
    description: "Frontend development for IIITDM Kurnool’s official tech-fest website with dynamic sliders, flip cards, and smooth UX.",
    technologies: ["React", "Framer Motion", "Tailwind CSS", "HTML5", "CSS3"],
    link: "solasta.iiitk.ac.in" // Update if your fork/personal repo exists
  },
  {
    id: "proj-004",
    name: "The Raghav – Short Film",
    description: "Lead actor in ‘The Raghav’, a short film created for Vision 2.0 portraying intense emotions and character depth.",
    technologies: ["Acting", "Storytelling", "Film Production"], // Replace with actual video link if available
  }
];


  // Current timestamp from prompt
  const timestamp = "2025-06-20 05:42:17";
  const userLogin = "anjani-kr-singh-ai";

  return (
    <section className="anjani-projects" id="projects">
      <div className="anjani-projects-container">

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="anjani-projects-header"
          id="projects-header"
        >
          <motion.h2 
            className="anjani-projects-heading"
            variants={itemVariants}
            id="projects-heading"
          >
            My <span className="anjani-projects-heading-accent">Projects</span>
          </motion.h2>
          <motion.p 
            className="anjani-projects-paragraph"
            variants={itemVariants}
            id="projects-intro"
          >
            Discover my portfolio of projects visualized as an <strong>interactive 3D showcase</strong>.
            Each project represents a milestone in my journey as a developer.
          </motion.p>
        </motion.div>

        <div className="anjani-projects-wrapper" id="projects-content">
          {/* 3D Projects Showcase Visualization */}
          <div 
            ref={modelRef}
            className="anjani-projects-model-container"
            id="projects-3d-container"
          >
            {modelLoaded && (
              <Canvas 
                className="anjani-projects-canvas"
                id="projects-canvas"
                camera={{ position: [0, 2, 5], fov: 50 }}
                shadows
              >
                <ProjectsShowcase  
                  projects={projectsList} 
                />
              </Canvas>
            )}
          </div>

          {/* Projects List */}
          <motion.div 
            className="anjani-projects-list"
            id="projects-list"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {projectsList.map((project, index) => (
              <motion.div 
                key={project.id} 
                id={`project-card-${project.id}`}
                className="anjani-project-card"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" 
                }}
              >
                <h3 id={`project-title-${project.id}`} className="anjani-project-title">
                  {project.name}
                </h3>
                <p id={`project-desc-${project.id}`} className="anjani-project-description">
                  {project.description}
                </p>
                <div id={`project-tech-${project.id}`} className="anjani-project-tech-stack">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={`${project.id}-tech-${techIndex}`} 
                      id={`${project.id}-tech-${techIndex}`} 
                      className="anjani-project-tech"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a 
                  id={`project-link-${project.id}`}
                  href={project.link} 
                  className="anjani-project-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span className="anjani-project-link-text">View Project</span>
                  <span className="anjani-project-link-icon">↗</span>
                </a>
              </motion.div>
            ))}
            
            <motion.div 
              className="anjani-projects-cta"
              id="projects-cta"
              variants={itemVariants}
            >
              <a 
                id="projects-contact-btn"
                href="#contact" 
                className="anjani-projects-button anjani-projects-primary-button"
              >
                <span className="anjani-projects-button-text">Contact Me</span>
                <span className="anjani-projects-button-icon">→</span>
              </a>
              <a 
                id="projects-skills-btn"
                href="#skills" 
                className="anjani-projects-button anjani-projects-secondary-button"
              >
                <span className="anjani-projects-button-text">View My Skills</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="anjani-projects-decoration circle-1" id="projects-deco-circle1"></div>
        <div className="anjani-projects-decoration circle-2" id="projects-deco-circle2"></div>
        <div className="anjani-projects-decoration line" id="projects-deco-line"></div>
        <div className="anjani-projects-decoration grid" id="projects-deco-grid"></div>
      </div>
    </section>
  );
};

export default Projects;