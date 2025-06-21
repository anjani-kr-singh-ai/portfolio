import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Line, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const SkillsNeuralNetwork = () => {
  const { viewport } = useThree();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(null);
  
  // Skills organized by layers (input, hidden, output)
  const layers = [
    // Input layer - fundamental skills
    { 
      title: "Core", 
      skills: ["HTML", "CSS", "JavaScript", "Python"] 
    },
    // Hidden layer 1 - frameworks and libraries
    { 
      title: "Frameworks", 
      skills: ["React", "Vue", "Node.js", "Express", "Django"]
    },
    // Hidden layer 2 - tools and technologies
    {
      title: "Tools",
      skills: ["Git", "Docker", "AWS", "MongoDB", "GraphQL"]
    },
    // Output layer - specializations
    {
      title: "Expertise",
      skills: ["Frontend", "Backend", "DevOps"]
    }
  ];

  // Define layer colors
  const layerColors = {
    0: "#61DAFB",  // Core - Light Blue
    1: "#8A2BE2",  // Frameworks - Purple
    2: "#FF9900",  // Tools - Orange 
    3: "#00BFFF",  // Expertise - Bright Blue
  };

  // Create nodes for neural network
  const nodes = useMemo(() => {
    const nodesData = [];
    const layerSpacing = 4; // Space between layers
    
    layers.forEach((layer, layerIndex) => {
      const x = layerIndex * layerSpacing - ((layers.length - 1) * layerSpacing) / 2;
      
      // Add layer title
      nodesData.push({
        type: 'title',
        position: [x, 2.5, 0],
        content: layer.title,
        layerIndex
      });
      
      // Add skill nodes
      layer.skills.forEach((skill, skillIndex) => {
        const skillCount = layer.skills.length;
        const y = (skillIndex - (skillCount - 1) / 2) * 1.2;
        nodesData.push({
          type: 'skill',
          position: [x, y, 0],
          content: skill,
          layerIndex,
          skillIndex,
          id: `${layerIndex}-${skillIndex}`
        });
      });
    });
    
    return nodesData;
  }, []);
  
  // Create connections between nodes in adjacent layers
  const connections = useMemo(() => {
    const lines = [];
    const nodesByLayer = {};
    
    // Group nodes by layer
    nodes.filter(node => node.type === 'skill').forEach(node => {
      if (!nodesByLayer[node.layerIndex]) {
        nodesByLayer[node.layerIndex] = [];
      }
      nodesByLayer[node.layerIndex].push(node);
    });
    
    // Connect nodes between adjacent layers
    Object.keys(nodesByLayer).forEach(layerIndex => {
      const currentLayer = nodesByLayer[layerIndex];
      const nextLayer = nodesByLayer[parseInt(layerIndex) + 1];
      
      if (currentLayer && nextLayer) {
        currentLayer.forEach(startNode => {
          nextLayer.forEach(endNode => {
            // Create a unique ID for this connection
            const connectionId = `${startNode.id}-${endNode.id}`;
            
            lines.push({
              id: connectionId,
              start: startNode.position,
              end: endNode.position,
              opacity: 0.2 + Math.random() * 0.2,
              startNode,
              endNode
            });
          });
        });
      }
    });
    
    return lines;
  }, [nodes]);
  
  // Animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (groupRef.current) {
      // Gentle network rotation and slight floating effect
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
      groupRef.current.position.y = Math.sin(t * 0.3) * 0.1;
    }
  });
  
  // Handle pointer events
  const handleNodeHover = (nodeId) => {
    setHovered(nodeId);
  };
  
  const handleNodeUnhover = () => {
    setHovered(null);
  };
  
  // Determine if a connection should be highlighted
  const isConnectionHighlighted = (connection) => {
    if (!hovered) return false;
    return connection.startNode.id === hovered || connection.endNode.id === hovered;
  };
  
  // Determine if a node should be highlighted
  const isNodeHighlighted = (node) => {
    return node.id === hovered;
  };
  
  return (
    <>
      {/* Camera settings */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, 5]} intensity={0.4} color="#8A2BE2" />
      
      <group ref={groupRef}>
        {/* Neural network connections */}
        {connections.map((line, i) => (
          <Line
            key={`line-${i}`}
            points={[line.start, line.end]}
            color={isConnectionHighlighted(line) ? "#FFFFFF" : "#8A2BE2"}
            lineWidth={isConnectionHighlighted(line) ? 3 : 1}
            opacity={isConnectionHighlighted(line) ? 0.9 : line.opacity}
            transparent
          />
        ))}
        
        {/* Neural network nodes */}
        {nodes.map((node, i) => (
          <group key={`node-${i}`} position={node.position}>
            {node.type === 'skill' && (
              <>
                {/* Node sphere */}
                <mesh
                  onPointerOver={() => handleNodeHover(node.id)}
                  onPointerOut={handleNodeUnhover}
                >
                  <sphereGeometry args={[
                    isNodeHighlighted(node) ? 0.35 : 0.25, 
                    16, 
                    16
                  ]} />
                  <meshStandardMaterial 
                    color={layerColors[node.layerIndex]}
                    emissive={layerColors[node.layerIndex]}
                    emissiveIntensity={isNodeHighlighted(node) ? 1 : 0.5}
                    roughness={0.3}
                    metalness={isNodeHighlighted(node) ? 0.8 : 0.5}
                  />
                </mesh>
                
                {/* Node label */}
                <Text
                  position={[0, -0.5, 0]}
                  fontSize={isNodeHighlighted(node) ? 0.25 : 0.2}
                  color={isNodeHighlighted(node) ? "#FFFFFF" : "#DDDDDD"}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2}
                  outlineWidth={isNodeHighlighted(node) ? 0.01 : 0}
                  outlineColor="#000000"
                >
                  {node.content}
                </Text>
              </>
            )}
            
            {node.type === 'title' && (
              <Text
                fontSize={0.35}
                color={layerColors[node.layerIndex]}
                anchorX="center"
                anchorY="middle"
                fontWeight={700}
              >
                {node.content}
              </Text>
            )}
          </group>
        ))}
      </group>
    </>
  );
};

export default SkillsNeuralNetwork;