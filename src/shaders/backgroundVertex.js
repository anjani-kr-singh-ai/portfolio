const vertexShader = `
  varying vec2 vUv;
  varying float vDistance;
  
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDistance = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export default vertexShader;