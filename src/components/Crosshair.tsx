"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CrosshairOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    // On cible le parent (la Section Hero) pour écouter les événements
    const container = containerRef.current;
    if (!container) return;
    
    const parentElement = container.parentElement;
    if (!parentElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parentElement.getBoundingClientRect();
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // On vérifie si la souris est bien dans les limites
      if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
          x.set(mouseX);
          y.set(mouseY);
          setIsActive(true);
      } else {
          setIsActive(false);
      }
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    parentElement.addEventListener("mousemove", handleMouseMove);
    parentElement.addEventListener("mouseenter", handleMouseEnter);
    parentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parentElement.removeEventListener("mousemove", handleMouseMove);
      parentElement.removeEventListener("mouseenter", handleMouseEnter);
      parentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []); 

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-30 pointer-events-none overflow-hidden mix-blend-difference"
    >
      {isActive && (
        <>
          {/* Ligne Verticale */}
          <motion.div
            className="absolute top-0 w-px h-full bg-primary/50"
            style={{ left: springX }}
          />
          
          {/* Ligne Horizontale */}
          <motion.div
            className="absolute left-0 h-px w-full bg-primary/50"
            style={{ top: springY }}
          />

          {/* Centre du viseur */}
          <motion.div
            className="absolute w-12 h-12 -ml-6 -mt-6 border border-primary/30 flex items-center justify-center"
            style={{ left: springX, top: springY }}
          >
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary"></div>
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-primary"></div>
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-primary"></div>
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary"></div>
              <div className="w-0.5 h-0.5 bg-primary rounded-full"></div>
          </motion.div>

          {/* HUD Target */}
          <motion.div 
            className="absolute text-[9px] font-mono text-primary/80 tracking-[0.2em] -mt-10 ml-8 whitespace-nowrap"
            style={{ left: springX, top: springY }}
          >
            <span className="bg-black/40 px-1 border-l border-primary">SYS_LOCK // ACTIVE</span>
          </motion.div>
        </>
      )}
    </div>
  );
}