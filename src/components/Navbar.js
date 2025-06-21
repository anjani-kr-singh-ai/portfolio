import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import './css/Navbar.css';

const Navbar = ({ isDarkTheme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar background based on scroll position
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Update active section based on scroll position
      const sections = document.querySelectorAll('.section');
      const scrollY = window.scrollY;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`anjani-navbar ${scrolled ? 'anjani-navbar-scrolled' : ''}`}
      id="anjani-navbar"
    >
      <div className="anjani-navbar-container" id="anjani-navbar-container">
        {/* Logo */}
        <a href="#home" className="anjani-navbar-logo" id="anjani-navbar-logo">
          <span className="anjani-navbar-logo-icon">🌌</span>
          <span className="anjani-navbar-logo-text">
            Anjani's <span className="anjani-navbar-logo-accent">Nebluverse</span>
          </span>
        </a>

        {/* Navigation Links - Desktop */}
        <div className="anjani-navbar-links-desktop" id="anjani-navbar-links-desktop">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className={`anjani-navbar-link ${
                activeSection === link.href.substring(1) ? 'anjani-navbar-link-active' : ''
              }`}
              onClick={handleLinkClick}
            >
              {link.name}
              {activeSection === link.href.substring(1) && (
                <motion.span
                  className="anjani-navbar-indicator"
                  layoutId="anjani-navbar-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </a>
          ))}
          
          {/* Theme Toggle */}
          <div className="anjani-navbar-theme-toggle">
            <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="anjani-navbar-mobile-controls" id="anjani-navbar-mobile-controls">
          <button 
            className={`anjani-navbar-menu-button ${mobileMenuOpen ? 'anjani-navbar-menu-open' : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Menu"
            id="anjani-navbar-menu-button"
          >
            <span className="anjani-navbar-menu-bar"></span>
            <span className="anjani-navbar-menu-bar"></span>
            <span className="anjani-navbar-menu-bar"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`anjani-navbar-mobile-menu ${mobileMenuOpen ? 'anjani-navbar-mobile-menu-open' : ''}`}>
        {navLinks.map(link => (
          <a
            key={link.name}
            href={link.href}
            className={`anjani-navbar-mobile-link ${
              activeSection === link.href.substring(1) ? 'anjani-navbar-mobile-link-active' : ''
            }`}
            onClick={handleLinkClick}
          >
            {link.name}
          </a>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;