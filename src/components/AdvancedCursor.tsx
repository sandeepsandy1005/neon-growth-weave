import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Fluid trail shader for smooth liquid-like effect
const fluidTrailVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float alpha;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vColor = customColor;
    vAlpha = alpha;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fluidTrailFragmentShader = `
  uniform float time;
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Create soft circular particles with glow
    float strength = 1.0 - smoothstep(0.0, 0.5, dist);
    strength = pow(strength, 2.0);
    
    // Add subtle pulsing
    float pulse = sin(time * 3.0) * 0.1 + 0.9;
    strength *= pulse;
    
    vec3 color = vColor;
    float alpha = strength * vAlpha;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Advanced fluid trail system with metaball-like behavior
class FluidTrailSystem {
  points: Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
    size: number;
    baseColor: THREE.Color;
    targetColor: THREE.Color;
    alpha: number;
    age: number;
  }> = [];
  
  mouse = new THREE.Vector2();
  prevMouse = new THREE.Vector2();
  mouseVelocity = new THREE.Vector2();
  
  // Neon gradient colors for smooth blending
  colorPalette = [
    new THREE.Color(0x00ffff), // cyan
    new THREE.Color(0x8b5cf6), // purple  
    new THREE.Color(0x84cc16), // lime
    new THREE.Color(0x06b6d4), // electric blue
    new THREE.Color(0x10b981), // emerald
  ];

  constructor() {
    this.prevMouse.set(0, 0);
  }

  addTrailPoint(x: number, y: number, intensity: number = 1) {
    // Calculate smooth mouse velocity
    this.mouseVelocity.set(
      (x - this.prevMouse.x) * 0.8,
      (y - this.prevMouse.y) * 0.8
    );
    
    const speed = this.mouseVelocity.length();
    const numPoints = Math.min(Math.max(Math.floor(speed * 2 + 1), 1), 4);
    
    for (let i = 0; i < numPoints; i++) {
      // Create flowing velocity with organic curves
      const angle = Math.random() * Math.PI * 2;
      const spread = 0.01 + speed * 0.002;
      
      const velocity = new THREE.Vector3(
        this.mouseVelocity.x * 0.015 + Math.cos(angle) * spread,
        -this.mouseVelocity.y * 0.015 + Math.sin(angle) * spread,
        (Math.random() - 0.5) * 0.002
      );
      
      // Color based on speed and position for dynamic gradients
      const colorIndex = Math.floor((speed * 0.1 + Math.sin(x * 10) * 0.5 + 0.5) * this.colorPalette.length) % this.colorPalette.length;
      const nextColorIndex = (colorIndex + 1) % this.colorPalette.length;
      
      this.points.push({
        position: new THREE.Vector3(
          x + (Math.random() - 0.5) * 0.005,
          y + (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.001
        ),
        velocity,
        life: 1.0,
        maxLife: 0.8 + Math.random() * 0.6,
        size: (0.02 + speed * 0.001) * (0.8 + Math.random() * 0.4),
        baseColor: this.colorPalette[colorIndex].clone(),
        targetColor: this.colorPalette[nextColorIndex].clone(),
        alpha: 0.9 + Math.random() * 0.1,
        age: 0,
      });
    }
    
    this.prevMouse.set(x, y);
  }

  update(deltaTime: number) {
    const time = Date.now() * 0.001;
    
    for (let i = this.points.length - 1; i >= 0; i--) {
      const point = this.points[i];
      
      // Organic fluid motion with turbulence
      const turbulence = new THREE.Vector3(
        Math.sin(time * 1.5 + point.position.x * 8) * 0.0003,
        Math.cos(time * 1.2 + point.position.y * 6) * 0.0003,
        Math.sin(time * 2.0 + point.position.z * 10) * 0.0001
      );
      
      // Apply fluid dynamics
      point.velocity.add(turbulence);
      point.velocity.multiplyScalar(0.98); // smooth deceleration
      point.velocity.y -= 0.0001; // subtle gravity
      
      // Curve the motion for more organic flow
      const curvature = new THREE.Vector3(
        Math.sin(point.age * 2) * 0.0002,
        Math.cos(point.age * 1.5) * 0.0002,
        0
      );
      point.velocity.add(curvature);
      
      // Update position
      point.position.add(point.velocity);
      
      // Update life and aging
      point.life -= deltaTime * (0.6 + Math.random() * 0.2);
      point.age += deltaTime;
      
      const lifeFactor = point.life / point.maxLife;
      
      // Smooth color interpolation throughout life
      const colorMix = Math.sin(point.age * 3) * 0.5 + 0.5;
      point.baseColor.lerp(point.targetColor, deltaTime * 0.5);
      
      // Dynamic alpha with smooth fade
      point.alpha = Math.pow(lifeFactor, 1.8) * (0.8 + Math.sin(time + point.age) * 0.2);
      
      // Size evolution for organic feel
      const sizeFactor = Math.sin(lifeFactor * Math.PI) * (1 + Math.sin(point.age * 4) * 0.1);
      point.size *= (1 + sizeFactor * 0.02);
      
      // Remove expired points
      if (point.life <= 0) {
        this.points.splice(i, 1);
      }
    }
    
    // Performance optimization
    if (this.points.length > 200) {
      this.points.splice(0, this.points.length - 200);
    }
  }
}

// Main cursor component with fluid trail
function FluidCursor() {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const rippleRef = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();
  
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const trailSystem = useRef(new FluidTrailSystem());
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());
  const rippleScale = useRef(0);
  
  // Enhanced trail geometry and material
  const trailGeometry = useRef(new THREE.BufferGeometry());
  const trailMaterial = useRef(new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: fluidTrailVertexShader,
    fragmentShader: fluidTrailFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true,
  }));

  // Convert screen to world coordinates
  const screenToWorld = useCallback((x: number, y: number) => {
    const vector = new THREE.Vector3();
    vector.x = (x / window.innerWidth) * 2 - 1;
    vector.y = -(y / window.innerHeight) * 2 + 1;
    vector.z = 0;
    vector.unproject(camera);
    return vector;
  }, [camera]);

  // Enhanced mouse event handlers
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const worldPos = screenToWorld(event.clientX, event.clientY);
      targetPosition.current.copy(worldPos);
      
      // Calculate movement intensity for dynamic effects
      const movement = Math.sqrt(event.movementX ** 2 + event.movementY ** 2);
      const intensity = Math.min(movement / 8, 2.5);
      
      trailSystem.current.addTrailPoint(worldPos.x, worldPos.y, intensity);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      rippleScale.current = 0;
    };
    
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('button, a, [data-magnetic]') || 
          target.classList.contains('cursor-pointer')) {
        setIsHovering(true);
      }
    };
    
    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('button, a, [data-magnetic]') || 
          target.classList.contains('cursor-pointer')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [screenToWorld]);

  useFrame((state, delta) => {
    if (!meshRef.current || !trailRef.current || !glowRef.current || !rippleRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Smooth cursor movement with magnetic effect
    const lerpFactor = isHovering ? 0.3 : 0.2;
    currentPosition.current.lerp(targetPosition.current, lerpFactor);
    
    // Update cursor elements
    meshRef.current.position.copy(currentPosition.current);
    glowRef.current.position.copy(currentPosition.current);
    rippleRef.current.position.copy(currentPosition.current);
    
    // Dynamic scaling with smooth transitions
    const baseScale = isHovering ? 1.6 : 1.0;
    const clickScale = isClicking ? 1.3 : 1.0;
    const pulse = Math.sin(time * 3) * 0.05 + 1;
    const finalScale = baseScale * clickScale * pulse;
    
    meshRef.current.scale.setScalar(finalScale);
    
    // Enhanced glow effect
    const glowScale = finalScale * 3;
    glowRef.current.scale.setScalar(glowScale);
    const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
    glowMaterial.opacity = 0.3 + Math.sin(time * 2) * 0.1;
    
    // Ripple effect
    if (isClicking) {
      rippleScale.current += delta * 6;
      rippleRef.current.scale.setScalar(rippleScale.current);
      const rippleMaterial = rippleRef.current.material as THREE.MeshBasicMaterial;
      rippleMaterial.opacity = Math.max(0, 0.8 - rippleScale.current / 4);
    } else {
      rippleScale.current = 0;
      rippleRef.current.scale.setScalar(0);
    }
    
    // Update trail system
    trailSystem.current.update(delta);
    trailMaterial.current.uniforms.time.value = time;
    
    // Update trail geometry with fluid points
    const points = trailSystem.current.points;
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);
    const sizes = new Float32Array(points.length);
    const alphas = new Float32Array(points.length);
    
    points.forEach((point, i) => {
      positions[i * 3] = point.position.x;
      positions[i * 3 + 1] = point.position.y;
      positions[i * 3 + 2] = point.position.z;
      
      colors[i * 3] = point.baseColor.r;
      colors[i * 3 + 1] = point.baseColor.g;
      colors[i * 3 + 2] = point.baseColor.b;
      
      sizes[i] = point.size * 150;
      alphas[i] = point.alpha;
    });
    
    trailGeometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    trailGeometry.current.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    trailGeometry.current.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    trailGeometry.current.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    
    // Subtle cursor rotation
    meshRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
  });

  return (
    <>
      {/* Main cursor core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.008, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x00ffff)}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Soft glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.008, 12, 12]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x8b5cf6)}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Click ripple */}
      <mesh ref={rippleRef}>
        <ringGeometry args={[0.015, 0.025, 24]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x84cc16)}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Fluid trail points */}
      <points ref={trailRef} geometry={trailGeometry.current} material={trailMaterial.current} />
    </>
  );
}

// Main advanced cursor component
export function AdvancedCursor() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide default cursor globally
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';
    
    // Add cursor class to body for CSS targeting
    document.body.classList.add('custom-cursor-active');
    
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Set initial visibility
    setIsVisible(true);
    
    return () => {
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ 
        mixBlendMode: 'normal',
        filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.4))'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <FluidCursor />
      </Canvas>
    </div>
  );
}