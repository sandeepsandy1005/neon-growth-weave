import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Enhanced particle system for fluid trail effect
class FluidParticleSystem {
  particles: Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
    size: number;
    color: THREE.Color;
    opacity: number;
    magneticForce: THREE.Vector3;
  }> = [];
  
  mouse = new THREE.Vector2();
  prevMouse = new THREE.Vector2();
  mouseVelocity = new THREE.Vector2();
  
  // Neon AI theme colors
  colors = [
    new THREE.Color(0x8b5cf6), // neon purple
    new THREE.Color(0x06b6d4), // electric blue
    new THREE.Color(0x84cc16), // lime green
    new THREE.Color(0xe11d48), // neon pink
    new THREE.Color(0x0ea5e9), // sky blue
  ];

  constructor() {
    this.prevMouse.set(0, 0);
  }

  addParticle(x: number, y: number, intensity: number = 1) {
    // Calculate mouse velocity for more dynamic effects
    this.mouseVelocity.set(
      (x - this.prevMouse.x) * 10,
      (y - this.prevMouse.y) * 10
    );
    
    // Create multiple particles for richer effect
    const numParticles = Math.floor(intensity * 3) + 1;
    
    for (let i = 0; i < numParticles; i++) {
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.03 + this.mouseVelocity.x * 0.02,
        (Math.random() - 0.5) * 0.03 - this.mouseVelocity.y * 0.02,
        (Math.random() - 0.5) * 0.01
      );
      
      // Add swirl motion
      const angle = Math.random() * Math.PI * 2;
      const swirl = 0.01;
      velocity.x += Math.cos(angle) * swirl;
      velocity.y += Math.sin(angle) * swirl;
      
      this.particles.push({
        position: new THREE.Vector3(
          x + (Math.random() - 0.5) * 0.02,
          y + (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.005
        ),
        velocity,
        life: 1.0,
        maxLife: 1.0 + Math.random() * 0.5,
        size: Math.random() * 0.025 + 0.008,
        color: this.colors[Math.floor(Math.random() * this.colors.length)].clone(),
        opacity: Math.random() * 0.9 + 0.3,
        magneticForce: new THREE.Vector3(),
      });
    }
    
    this.prevMouse.set(x, y);
  }

  update(deltaTime: number, magneticElements: THREE.Vector3[] = []) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Apply magnetic forces from nearby elements
      particle.magneticForce.set(0, 0, 0);
      magneticElements.forEach(elementPos => {
        const distance = particle.position.distanceTo(elementPos);
        if (distance < 0.3) { // Magnetic influence radius
          const force = new THREE.Vector3()
            .subVectors(elementPos, particle.position)
            .normalize()
            .multiplyScalar((0.3 - distance) * 0.001);
          particle.magneticForce.add(force);
        }
      });
      
      // Update velocity with fluid dynamics
      particle.velocity.add(particle.magneticForce);
      particle.velocity.multiplyScalar(0.985); // fluid friction
      particle.velocity.y -= 0.0002; // subtle gravity
      
      // Add turbulence for organic motion
      const time = Date.now() * 0.001;
      const turbulence = new THREE.Vector3(
        Math.sin(time * 2 + particle.position.x * 10) * 0.0001,
        Math.cos(time * 1.5 + particle.position.y * 8) * 0.0001,
        Math.sin(time * 3 + particle.position.z * 12) * 0.00005
      );
      particle.velocity.add(turbulence);
      
      // Update position
      particle.position.add(particle.velocity);
      
      // Update life and opacity with smooth fade
      particle.life -= deltaTime * (0.4 + Math.random() * 0.3);
      const lifeFactor = particle.life / particle.maxLife;
      particle.opacity = Math.pow(lifeFactor, 1.5) * 0.9;
      
      // Color evolution based on life
      if (lifeFactor < 0.7) {
        particle.color.lerp(new THREE.Color(0x4338ca), deltaTime * 2); // fade to deep blue
      }
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
    
    // Limit particles for performance
    if (this.particles.length > 150) {
      this.particles.splice(0, this.particles.length - 150);
    }
  }
}

// Enhanced cursor mesh with advanced effects
function CursorMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const rippleRef = useRef<THREE.Mesh>(null);
  const { viewport, camera, scene } = useThree();
  
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [magneticElements, setMagneticElements] = useState<THREE.Vector3[]>([]);
  
  const particleSystem = useRef(new FluidParticleSystem());
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());
  const rippleScale = useRef(0);
  
  // Create enhanced materials
  const trailGeometry = useRef(new THREE.BufferGeometry());
  const trailMaterial = useRef(new THREE.PointsMaterial({
    size: 0.03,
    transparent: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    sizeAttenuation: true,
    alphaTest: 0.01,
  }));

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((x: number, y: number) => {
    const vector = new THREE.Vector3();
    vector.x = (x / window.innerWidth) * 2 - 1;
    vector.y = -(y / window.innerHeight) * 2 + 1;
    vector.z = 0;
    vector.unproject(camera);
    return vector;
  }, [camera]);

  // Detect magnetic elements (buttons, links, etc.)
  const updateMagneticElements = useCallback(() => {
    const elements = document.querySelectorAll('button, a, [data-magnetic="true"]');
    const positions: THREE.Vector3[] = [];
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const worldPos = screenToWorld(centerX, centerY);
      positions.push(worldPos);
    });
    
    setMagneticElements(positions);
  }, [screenToWorld]);

  // Mouse event handlers
  useEffect(() => {
    let animationFrame: number;
    
    const handleMouseMove = (event: MouseEvent) => {
      const worldPos = screenToWorld(event.clientX, event.clientY);
      targetPosition.current.copy(worldPos);
      
      // Add particles with varying intensity based on movement speed
      const movement = Math.sqrt(
        Math.pow(event.movementX, 2) + Math.pow(event.movementY, 2)
      );
      const intensity = Math.min(movement / 10, 3);
      particleSystem.current.addParticle(worldPos.x, worldPos.y, intensity);
      
      // Update magnetic elements periodically
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateMagneticElements);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      rippleScale.current = 0;
    };
    
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || 
          target.closest('button') || 
          target.classList.contains('cursor-pointer') || 
          target.closest('a') ||
          target.hasAttribute('data-magnetic')) {
        setIsHovering(true);
      }
    };
    
    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || 
          target.closest('button') || 
          target.classList.contains('cursor-pointer') || 
          target.closest('a') ||
          target.hasAttribute('data-magnetic')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    // Initial magnetic elements detection
    updateMagneticElements();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, [screenToWorld, updateMagneticElements]);

  useFrame((state, delta) => {
    if (!meshRef.current || !trailRef.current || !glowRef.current || !rippleRef.current) return;
    
    // Smooth cursor movement with enhanced magnetic effect
    const lerpFactor = isHovering ? 0.25 : 0.15;
    currentPosition.current.lerp(targetPosition.current, lerpFactor);
    
    // Apply position to cursor elements
    meshRef.current.position.copy(currentPosition.current);
    glowRef.current.position.copy(currentPosition.current);
    rippleRef.current.position.copy(currentPosition.current);
    
    // Enhanced scale and ripple effects
    const time = state.clock.elapsedTime;
    const baseScale = isHovering ? 1.8 : 1.2;
    const clickScale = isClicking ? 1.4 : 1.0;
    const pulse = Math.sin(time * 4) * 0.1 + 1;
    const finalScale = baseScale * clickScale * (isClicking ? pulse : 1);
    
    meshRef.current.scale.setScalar(finalScale);
    
    // Glow effect
    glowRef.current.scale.setScalar(finalScale * 2.5);
    const glowOpacity = 0.4 + Math.sin(time * 3) * 0.1;
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity = glowOpacity;
    
    // Ripple effect on click
    if (isClicking) {
      rippleScale.current += delta * 8;
      rippleRef.current.scale.setScalar(rippleScale.current);
      const rippleOpacity = Math.max(0, 1 - rippleScale.current / 3);
      (rippleRef.current.material as THREE.MeshBasicMaterial).opacity = rippleOpacity;
    } else {
      rippleScale.current = 0;
      rippleRef.current.scale.setScalar(0);
    }
    
    // Update particle system
    particleSystem.current.update(delta, magneticElements);
    
    // Update trail geometry with enhanced rendering
    const particles = particleSystem.current.particles;
    const positions = new Float32Array(particles.length * 3);
    const colors = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    
    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      
      colors[i * 3] = particle.color.r;
      colors[i * 3 + 1] = particle.color.g;
      colors[i * 3 + 2] = particle.color.b;
      
      sizes[i] = particle.size * particle.opacity * 100;
    });
    
    trailGeometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    trailGeometry.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    trailGeometry.current.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Rotate cursor slightly for dynamic effect
    meshRef.current.rotation.z = Math.sin(time * 2) * 0.1;
  });

  return (
    <>
      {/* Main cursor orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.012, 32, 32]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x8b5cf6)}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Enhanced glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x06b6d4)}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Click ripple effect */}
      <mesh ref={rippleRef}>
        <ringGeometry args={[0.02, 0.04, 32]} />
        <meshBasicMaterial 
          color={new THREE.Color(0x84cc16)}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Fluid particle trail */}
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
        filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))'
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
        <CursorMesh />
      </Canvas>
    </div>
  );
}