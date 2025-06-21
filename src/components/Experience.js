import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';

// 3D Icons Component for Experience Section
const ExperienceIcons = ({ setActiveExperience }) => {
  const experiences = [
    {
      id: 1,
      title: "Senior Developer",
      company: "Cosmic Tech",
      period: "2022 - Present",
      description: "Leading development of interactive web applications with focus on 3D experiences and WebGL performance optimization.",
      icon: "💼"
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Galaxy Studios",
      period: "2020 - 2022",
      description: "Developed responsive UIs for various clients, implemented animations and transitions using GSAP and Framer Motion.",
      icon: "🚀"
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Nebula Creations",
      period: "2018 - 2020",
      description: "Created user-centered designs, conducted user research and testing, developed prototypes using Figma and Adobe XD.",
      icon: "🎨"
    }
  ];

  return (
    <group>
      {experiences.map((exp, index) => {
        // Position icons in a horizontal line
        const position = [(index - 1) * 3, 0, 0];
        
        return (
          <Float 
            key={exp.id}
            speed={2} 
            rotationIntensity={0.2} 
            floatIntensity={0.5}
          >
            <group 
              position={position}
              onClick={() => setActiveExperience(exp)}
            >
              <Text
                position={[0, 0, 0]}
                fontSize={1}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {exp.icon}
              </Text>
              <Text
                position={[0, -1.2, 0]}
                fontSize={0.4}
                color="#00BFFF"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.5}
              >
                {exp.title}
              </Text>
              <Text
                position={[0, -1.6, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={2.5}
              >
                {exp.company}
              </Text>
              <mesh
                position={[0, 0, -0.1]}
                scale={[2, 2.5, 0.1]}
              >
                <boxGeometry />
                <meshStandardMaterial
                  color="#4B0082"
                  opacity={0.7}
                  transparent
                  metalness={0.5}
                  roughness={0.2}
                />
              </mesh>
            </group>
          </Float>
        );
      })}
    </group>
  );
};

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.25 });
  const [activeExperience, setActiveExperience] = useState(null);

  const experiences = [
    {
      id: 1,
      title: "Senior Developer",
      company: "Cosmic Tech",
      period: "2022 - Present",
      description: "Leading development of interactive web applications with focus on 3D experiences and WebGL performance optimization.",
      skills: ["Three.js", "WebGL", "React", "Performance Optimization"]
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Galaxy Studios",
      period: "2020 - 2022",
      description: "Developed responsive UIs for various clients, implemented animations and transitions using GSAP and Framer Motion.",
      skills: ["React", "Vue.js", "GSAP", "Framer Motion"]
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Nebula Creations",
      period: "2018 - 2020",
      description: "Created user-centered designs, conducted user research and testing, developed prototypes using Figma and Adobe XD.",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"]
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-12">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          My <span className="text-[#8A2BE2]">Experience</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-4">
          Touch the floating holograms to view my professional journey.
        </p>
      </motion.div>

      <div className="flex flex-col items-center">
        {/* 3D Interactive Experience Icons */}
        <div className="h-[400px] w-full">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <ExperienceIcons setActiveExperience={setActiveExperience} />
          </Canvas>
        </div>

        {/* Experience Details */}
        <div className="mt-8 w-full max-w-2xl">
          {activeExperience ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass p-6 rounded-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-[#00BFFF]">
                    {activeExperience.title}
                  </h3>
                  <p className="text-xl text-white">
                    {activeExperience.company}
                  </p>
                </div>
                <span className="text-gray-300">
                  {activeExperience.period}
                </span>
              </div>
              
              <p className="text-gray-200 mb-4">
                {activeExperience.description}
              </p>
              
              <div>
                <p className="text-gray-300 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {activeExperience.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#4B0082] rounded-full text-white text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-gray-300 p-6">
              <p>Click on an icon to view experience details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Experience;