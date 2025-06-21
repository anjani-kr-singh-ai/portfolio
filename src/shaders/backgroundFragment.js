const fragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;
  varying float vDistance;
  
  void main() {
    // Create a star field effect
    vec2 st = vUv * 100.0;
    float star = step(0.99, fract(sin(dot(floor(st), vec2(12.9898, 78.233))) * 43758.5453));
    
    // Add twinkling effect
    float twinkle = 0.5 + 0.5 * sin(time + vDistance);
    
    // Create parallax effect based on distance
    float parallax = 0.5 + 0.5 * sin(time * 0.1 + vDistance * 0.05);
    
    // Combine effects
    vec3 finalColor = color * (star * twinkle * parallax);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default fragmentShader;