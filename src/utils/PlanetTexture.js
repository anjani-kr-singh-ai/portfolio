import * as THREE from 'three';

// Utility function to create procedural planet texture
export const createPlanetTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#4B0082');   // Dark indigo
  gradient.addColorStop(0.5, '#8A2BE2');  // Medium purple
  gradient.addColorStop(1, '#9370DB');   // Medium purple
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add some noise/texture
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 1.5;
    const opacity = Math.random() * 0.5;
    
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    context.fill();
  }
  
  // Add swirl patterns
  for (let i = 0; i < 8; i++) {
    const centerX = Math.random() * canvas.width;
    const centerY = Math.random() * canvas.height;
    const radius = 40 + Math.random() * 80;
    
    for (let angle = 0; angle < Math.PI * 8; angle += 0.1) {
      const x = centerX + radius * Math.cos(angle) * angle / (Math.PI * 2);
      const y = centerY + radius * Math.sin(angle) * angle / (Math.PI * 2);
      
      context.beginPath();
      context.arc(x, y, 1, 0, Math.PI * 2);
      context.fillStyle = `rgba(173, 216, 230, ${Math.random() * 0.3})`;
      context.fill();
    }
  }
  
  // Create THREE.js texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  
  return texture;
};

export default createPlanetTexture;