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
        const size = 12 + (index * 3); // Size increases with trail length
        const delay = index * 30; // Staggered animation
        const rotation = index * 45; // Rotating each trail element
        
        return (
          <div
            key={trail.id}
            className="fixed pointer-events-none z-40"
            style={{
              left: trail.x - size/2,
              top: trail.y - size/2,
              opacity: trail.opacity * 0.7,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              transition: `all ${150 + delay}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            }}
          >
            <div 
              className="mix-blend-screen animate-pulse"
              style={{
                width: size,
                height: size * 0.8,
                borderRadius: `${60 + index * 10}% ${40 + index * 15}% ${70 + index * 5}% ${50 + index * 20}% / ${80 + index * 5}% ${60 + index * 10}% ${40 + index * 15}% ${90 + index * 8}%`,
                background: `linear-gradient(${index * 30}deg, 
                  hsl(${180 + (index * 8)} 100% 60% / ${trail.opacity * 0.8}) 0%,
                  hsl(${120 + (index * 12)} 100% 65% / ${trail.opacity * 0.6}) 30%,
                  hsl(${200 + (index * 6)} 100% 70% / ${trail.opacity * 0.4}) 70%,
                  transparent 100%
                )`,
                transform: `scaleY(${0.6 + index * 0.1}) scaleX(${0.8 + index * 0.05})`,
                animation: `liquid-morph-${index % 3} ${2 + index * 0.3}s ease-in-out infinite alternate`,
              }}
            />
          </div>
        );
      })}

      {/* Main liquid cursor core */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-100 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Core liquid blob */}
        <div 
          className="relative mix-blend-screen"
          style={{
            width: '16px',
            height: '12px',
            borderRadius: '60% 40% 70% 50% / 80% 60% 40% 90%',
            background: `linear-gradient(135deg,
              hsl(180 100% 60% / 0.9) 0%,
              hsl(120 100% 65% / 0.8) 30%,
              hsl(200 100% 70% / 0.7) 70%,
              hsl(160 100% 55% / 0.6) 100%
            )`,
            boxShadow: `
              0 0 15px hsl(180 100% 60% / 0.8),
              0 0 30px hsl(120 100% 65% / 0.6),
              0 0 45px hsl(200 100% 70% / 0.4)
            `,
            animation: 'liquid-main 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Flowing outer liquid layer */}
      <div
        className={`fixed pointer-events-none z-49 transition-all duration-200 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div 
          className="mix-blend-screen"
          style={{
            width: '24px',
            height: '20px',
            borderRadius: '50% 70% 40% 80% / 60% 90% 50% 70%',
            background: `linear-gradient(225deg,
              hsl(180 100% 60% / 0.4) 0%,
              hsl(200 100% 70% / 0.3) 50%,
              transparent 100%
            )`,
            animation: 'liquid-outer 4s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Liquid ambient field */}
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
          className="mix-blend-screen"
          style={{
            width: '40px',
            height: '32px',
            borderRadius: '70% 30% 60% 90% / 50% 80% 70% 40%',
            background: `radial-gradient(ellipse,
              hsl(120 100% 65% / 0.15) 0%,
              hsl(160 100% 55% / 0.1) 40%,
              transparent 100%
            )`,
            animation: 'liquid-ambient 5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Ultra-wide liquid field */}
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
          className="mix-blend-screen"
          style={{
            width: '60px',
            height: '48px',
            borderRadius: '80% 40% 90% 20% / 60% 70% 30% 80%',
            background: `radial-gradient(ellipse,
              hsl(200 100% 70% / 0.05) 0%,
              hsl(180 100% 60% / 0.03) 50%,
              transparent 100%
            )`,
            animation: 'liquid-wide 6s ease-in-out infinite alternate',
          }}
        />
      </div>

      <style>{`
        @keyframes liquid-main {
          0% { 
            border-radius: 60% 40% 70% 50% / 80% 60% 40% 90%;
            transform: scale(1) rotate(0deg);
          }
          33% { 
            border-radius: 80% 20% 50% 70% / 60% 90% 70% 50%;
            transform: scale(1.1) rotate(120deg);
          }
          66% { 
            border-radius: 40% 80% 90% 30% / 70% 40% 80% 60%;
            transform: scale(0.9) rotate(240deg);
          }
          100% { 
            border-radius: 60% 40% 70% 50% / 80% 60% 40% 90%;
            transform: scale(1) rotate(360deg);
          }
        }

        @keyframes liquid-outer {
          0% { 
            border-radius: 50% 70% 40% 80% / 60% 90% 50% 70%;
            transform: scale(1) rotate(0deg);
          }
          50% { 
            border-radius: 90% 30% 80% 40% / 50% 70% 90% 60%;
            transform: scale(1.2) rotate(180deg);
          }
          100% { 
            border-radius: 50% 70% 40% 80% / 60% 90% 50% 70%;
            transform: scale(1) rotate(360deg);
          }
        }

        @keyframes liquid-ambient {
          0% { 
            border-radius: 70% 30% 60% 90% / 50% 80% 70% 40%;
            transform: scale(1);
          }
          50% { 
            border-radius: 40% 90% 30% 70% / 80% 50% 40% 90%;
            transform: scale(1.1);
          }
          100% { 
            border-radius: 70% 30% 60% 90% / 50% 80% 70% 40%;
            transform: scale(1);
          }
        }

        @keyframes liquid-wide {
          0% { 
            border-radius: 80% 40% 90% 20% / 60% 70% 30% 80%;
            transform: scale(1);
          }
          100% { 
            border-radius: 20% 90% 40% 80% / 70% 30% 80% 60%;
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
};