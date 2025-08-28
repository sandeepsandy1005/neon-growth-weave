import { useEffect, useState, useRef } from 'react';

export const MouseFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number; opacity: number }>>([]);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      setIsVisible(true);

      // Add trail points
      setTrails(prevTrails => {
        const newTrail = {
          x: newPosition.x,
          y: newPosition.y,
          id: trailIdRef.current++,
          opacity: 1
        };
        return [...prevTrails.slice(-15), newTrail]; // Keep last 15 trail points
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animate trail fade out
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails(prevTrails => 
        prevTrails
          .map(trail => ({ ...trail, opacity: trail.opacity - 0.05 }))
          .filter(trail => trail.opacity > 0)
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Liquid trail effects */}
      {trails.map((trail, index) => {
        const size = 8 + (index * 2); // Size increases with trail length
        const delay = index * 20; // Staggered animation
        
        return (
          <div
            key={trail.id}
            className="fixed pointer-events-none z-40"
            style={{
              left: trail.x - size/2,
              top: trail.y - size/2,
              opacity: trail.opacity * 0.8,
              transform: 'translate(-50%, -50%)',
              transition: `all ${100 + delay}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            }}
          >
            <div 
              className="rounded-full mix-blend-screen"
              style={{
                width: size,
                height: size,
                background: `radial-gradient(circle, 
                  hsl(${271 + (index * 10)} 100% 65% / ${trail.opacity * 0.6}) 0%,
                  hsl(${186 + (index * 15)} 100% 69% / ${trail.opacity * 0.4}) 40%,
                  hsl(${320 + (index * 5)} 100% 74% / ${trail.opacity * 0.2}) 70%,
                  transparent 100%
                )`,
                filter: `blur(${2 + index * 0.5}px)`,
              }}
            />
          </div>
        );
      })}

      {/* Main liquid cursor core */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-75 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Core orb */}
        <div 
          className="relative w-4 h-4 rounded-full mix-blend-screen animate-pulse"
          style={{
            background: `radial-gradient(circle,
              hsl(271 100% 65% / 0.9) 0%,
              hsl(186 100% 69% / 0.7) 50%,
              transparent 100%
            )`,
            boxShadow: `
              0 0 20px hsl(271 100% 65% / 0.8),
              0 0 40px hsl(186 100% 69% / 0.6),
              0 0 60px hsl(320 100% 74% / 0.4)
            `,
          }}
        />
      </div>

      {/* Flowing outer glow layers */}
      <div
        className={`fixed pointer-events-none z-49 transition-all duration-150 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div 
          className="w-12 h-12 rounded-full mix-blend-screen"
          style={{
            background: `radial-gradient(circle,
              hsl(186 100% 69% / 0.4) 0%,
              hsl(271 100% 65% / 0.3) 60%,
              transparent 100%
            )`,
            filter: 'blur(8px)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Liquid ambient glow */}
      <div
        className={`fixed pointer-events-none z-48 transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div 
          className="w-20 h-20 rounded-full mix-blend-screen"
          style={{
            background: `radial-gradient(circle,
              hsl(320 100% 74% / 0.2) 0%,
              hsl(186 100% 69% / 0.15) 40%,
              hsl(271 100% 65% / 0.1) 70%,
              transparent 100%
            )`,
            filter: 'blur(15px)',
            animation: 'pulse 3s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Ultra-wide ambient field */}
      <div
        className={`fixed pointer-events-none z-47 transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-25'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div 
          className="w-32 h-32 rounded-full mix-blend-screen"
          style={{
            background: `radial-gradient(circle,
              hsl(271 100% 65% / 0.08) 0%,
              hsl(186 100% 69% / 0.06) 50%,
              transparent 100%
            )`,
            filter: 'blur(25px)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        body {
          cursor: none !important;
        }
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};