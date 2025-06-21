// This file is a utility to generate a GLTF/GLB model file
// In a real implementation, you would use this script to generate the model file once

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { ProjectModel } from './ProjectModel';
import * as fs from 'fs';
import * as path from 'path';

// Create the project showcase model
const projectModel = new ProjectModel();
const model = projectModel.createProjectShowcase();

// Export the model to GLTF format
const exporter = new GLTFExporter();
exporter.parse(
  model,
  (gltf) => {
    // Convert to binary format (GLB)
    const glbBuffer = gltf; // In a real implementation, convert to binary
    
    // Save the file
    const outputPath = path.join(__dirname, 'project_showcase.glb');
    fs.writeFileSync(outputPath, Buffer.from(glbBuffer));
    console.log(`Model saved to ${outputPath}`);
  },
  (error) => {
    console.error('An error occurred during export:', error);
  },
  {
    binary: true // Export as GLB (binary GLTF)
  }
);