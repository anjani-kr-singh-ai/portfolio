import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaUser, FaClock, FaPaperPlane } from 'react-icons/fa';
import { Canvas } from '@react-three/fiber';
import './css/Contact.css'; // Import the CSS file
import { Float, Stars, Text } from '@react-three/drei';


// 3D Contact Form
const ContactForm3D = ({ handleSubmit, form, setForm, formStatus }) => {
  // Animation for form submission
  const rocketRef = useRef();
  
  // Update rocket position on form submission
  React.useEffect(() => {
    if (formStatus === 'sending' && rocketRef.current) {
      rocketRef.current.position.y += 0.1;
    }
  }, [formStatus]);
  
  return (
    <group position={[0, 0, -2]}>
      {/* Hologram effect */}
      <mesh>
        <boxGeometry args={[5, 3, 0.1]} />
        <meshStandardMaterial color="#8A2BE2" opacity={0.3} transparent={true} />
      </mesh>
      
      {/* Rocket animation for send button */}
      {formStatus === 'sending' && (
        <mesh ref={rocketRef} position={[0, -2, 1]}>
          <coneGeometry args={[0.2, 0.5, 16]} />
          <meshStandardMaterial color="#00BFFF" emissive="#00BFFF" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
};

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.25 });
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  
  // Current date/time and username
  const currentDateTime = "2025-06-21 04:51:02";
  const userLogin = "anjani-kr-singh-ai";
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Create Gmail mailto link with form data
    const subject = `Contact from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    const mailtoLink = `mailto:anjani.kumar.singhh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    
    // Open Gmail in new tab
    window.open(mailtoLink, '_blank');
    
    // Simulate form submission success
    setTimeout(() => {
      setFormStatus('success');
      setForm({
        name: '',
        email: '',
        message: ''
      });
      
      // Reset status after showing success message
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1500);
  };
  
  // Social media links
  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/anjani-kr-singh', name: 'GitHub' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com/in/anjani-kr-singh', name: 'LinkedIn' },
    { icon: <FaTwitter />, url: 'https://twitter.com/anjani_kr_singh', name: 'Twitter' },
    { icon: <FaEnvelope />, url: 'mailto:anjani.kumar.singhh@gmail.com', name: 'Email' }
  ];

  return (
    <section className="anjani-contact" ref={ref}>
      <div className="anjani-contact-container">

        <div className="anjani-contact-header">
          <h2 className="anjani-contact-heading">
            Get In <span className="anjani-contact-heading-accent">Touch</span>
          </h2>
          <p className="anjani-contact-paragraph">
            Have a project in mind or just want to say hello? Drop me a message!
          </p>
        </div>

        <div className="anjani-contact-wrapper">
          {/* Contact Form */}
          <motion.div 
            className="anjani-contact-form-container"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="anjani-contact-form">
              <div className="anjani-form-group">
                <label htmlFor="name" className="anjani-form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="anjani-form-input"
                  placeholder="Your Name"
                />
              </div>
              
              <div className="anjani-form-group">
                <label htmlFor="email" className="anjani-form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="anjani-form-input"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="anjani-form-group">
                <label htmlFor="message" className="anjani-form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="anjani-form-textarea"
                  placeholder="Your message here..."
                />
              </div>
              
              <button
                type="submit"
                className={`anjani-submit-button ${formStatus === 'sending' ? 'sending' : ''} ${formStatus === 'success' ? 'success' : ''}`}
                disabled={formStatus === 'sending'}
                onClick={handleSubmit} // Added onClick handler for direct Gmail opening
              >
                <span className="anjani-submit-button-text">
                  {formStatus === 'sending' ? (
                    <>Sending... <span className="anjani-submit-button-icon">🚀</span></>
                  ) : formStatus === 'success' ? (
                    <>Message Sent! <span className="anjani-submit-button-icon">✨</span></>
                  ) : (
                    <>Send Message <FaPaperPlane className="anjani-submit-button-icon" /></>
                  )}
                </span>
              </button>
              
              {formStatus === 'success' && (
                <div className="anjani-form-status success">
                  Your message has been sent successfully! I'll get back to you soon.
                </div>
              )}
            </form>
          </motion.div>
          
          {/* 3D Canvas and Social Links */}
          <motion.div 
            className="anjani-contact-right-column"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="anjani-contact-canvas-container">
              <Canvas camera={{ position: [0, 0, 6], fov: 45 }} shadows>
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                {/* Glowing Typing Bot Sphere */}
                <Float speed={1.8} rotationIntensity={1.2} floatIntensity={0.5}>
                  <mesh castShadow>
                    <sphereGeometry args={[1.5, 64, 64]} />
                    <meshStandardMaterial
                      color="#8A2BE2"
                      emissive="#00BFFF"
                      emissiveIntensity={0.6}
                      metalness={0.7}
                      roughness={0.2}
                    />
                  </mesh>
                </Float>

                {/* Simulated "typing" dots orbiting the bot */}
                {['.', '.', '.'].map((dot, i) => (
                  <Float
                    key={i}
                    speed={1 + i * 0.2}
                    rotationIntensity={0}
                    floatIntensity={0.2}
                  >
                    <Text
                      position={[Math.sin(i * 2) * 2.2, -1.5 + i * 0.5, Math.cos(i * 2) * 2.2]}
                      fontSize={0.3}
                      color="#ffffff"
                    >
                      {dot}
                    </Text>
                  </Float>
                ))}

                {/* Stars Background */}
                <Stars
                  radius={60}
                  depth={40}
                  count={800}
                  factor={4}
                  fade
                  speed={1}
                  saturation={0}
                />
              </Canvas>
            </div>

            {/* Social Links */}
            <div className="anjani-social-container">
              <h3 className="anjani-social-heading">
                Connect With Me
              </h3>
              <div className="anjani-social-links">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="anjani-social-link"
                    title={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
              
              {/* Direct email link with mailto protocol */}
              <a
  href={`mailto:anjani.kumar.singhh@gmail.com?subject=Message from ${userLogin}&body=Hello Anjani,%0D%0A%0D%0AI'd like to connect with you about...`}
  className="anjani-direct-contact-button"
>

                <FaEnvelope className="anjani-direct-contact-icon" />
                <span className="anjani-direct-contact-text">Email Me Directly</span>
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="anjani-contact-decoration glow-1"></div>
        <div className="anjani-contact-decoration glow-2"></div>
      </div>
    </section>
  );
};

export default Contact;