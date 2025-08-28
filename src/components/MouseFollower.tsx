import { useEffect, useState } from 'react';

export const MouseFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
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

  return (
    <>
      {/* Main cursor glow */}
      <div
        className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-10 h-10 bg-neon-purple/30 rounded-full blur-md animate-pulse" />
      </div>

      {/* Secondary glow */}
      <div
        className={`fixed pointer-events-none z-49 transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          left: mousePosition.x - 30,
          top: mousePosition.y - 30,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-16 h-16 bg-neon-cyan/20 rounded-full blur-lg" />
      </div>

      {/* Outer glow */}
      <div
        className={`fixed pointer-events-none z-48 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          left: mousePosition.x - 50,
          top: mousePosition.y - 50,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-24 h-24 bg-neon-pink/10 rounded-full blur-xl" />
      </div>
    </>
  );
};