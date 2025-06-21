import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Introduction from './components/Introduction';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import CustomFooter from './components/CustomFooter';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const currentDate = "2025-06-21 04:44:34"; // Current UTC date/time
  const username = "anjani-kr-singh-aii"; // Current username

  useEffect(() => {
    // Simulate loading time
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3500);

    // GSAP Scroll Animations
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );
    });

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  if (loading) return <Preloader />;

  return (
    <div className="app dark" ref={scrollRef}>
      {/* Background Canvas */}
      <Canvas
        className="background-canvas"
        camera={{ position: [0, 0, 20], fov: 60 }}
      >
        <color attach="background" args={['#050816']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Main Content */}
      <div className="content z-10 relative">
        <Navbar />

        <main>
          <section id="home" className="section">
            <Introduction />
          </section>

          <section id="about" className="section">
            <About />
          </section>

          <section id="skills" className="section">
            <Skills />
          </section>

          <section id="projects" className="section">
            <Projects />
          </section>

          <section id="contact" className="section">
            <Contact />
          </section>
        </main>

        <CustomFooter/>
      </div>
    </div>
  );
}

export default App;