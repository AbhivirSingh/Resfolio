import React, { useRef, useState, useCallback, MouseEvent } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  scale?: number;
  disabled?: boolean;
}

const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = "", 
  glareColor = "rgba(255, 255, 255, 0.1)",
  scale = 1.05,
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current || !contentRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to the element center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width;
    const yPct = mouseY / height;

    const x = (xPct - 0.5) * 2; 
    const y = (yPct - 0.5) * 2; 

    // Rotation calculation (max 10 degrees)
    const rotateX = -y * 10; 
    const rotateY = x * 10;

    // Direct DOM manipulation for high performance
    contentRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, 1)`;

    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${xPct * 100}% ${yPct * 100}%, ${glareColor}, transparent 80%)`;
    }
  }, [disabled, scale, glareColor]);

  const handleMouseEnter = () => {
    if (!disabled) setIsHovering(true);
  };

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    setIsHovering(false);
    
    // Reset transform on leave
    if (contentRef.current) {
      contentRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
    // Hide glare
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, [disabled]);

  return (
    <div 
      ref={containerRef}
      className={`relative z-0 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={contentRef}
        // Use a faster transition on hover for responsiveness, and slower on leave for smooth settling
        className={`w-full will-change-transform ${isHovering ? 'transition-transform duration-100 ease-out' : 'transition-transform duration-500 ease-out'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-xl" style={{ transformStyle: 'preserve-3d' }}>
          {children}
          
          {!disabled && (
            <div 
              ref={glareRef}
              className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300 z-50"
              style={{ opacity: 0 }}
            />
          )}
          
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none z-50" />
        </div>
      </div>
    </div>
  );
};

export default TiltCard;