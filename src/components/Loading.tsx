"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function Loading({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [randomId, setRandomId] = useState("LOADING..."); // Placeholder initial statique
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Textes techniques aléatoires
  const loadingTexts = [
    "INITIALIZING_SYSTEM...",
    "LOADING_ASSETS...",
    "CONNECTING_TO_SERVER...",
    "VERIFYING_INTEGRITY...",
    "OPTIMIZING_SHADERS...",
    "READY_TO_LAUNCH"
  ];
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Génération de l'ID uniquement côté client pour éviter l'erreur d'hydratation
    setRandomId(Math.random().toString(36).substring(7).toUpperCase());

    // Animation de progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Vitesse variable pour effet "réalisme"
        const increment = Math.random() * 2 + 0.5; 
        return Math.min(prev + increment, 100);
      });
    }, 20);

    // Changement de texte
    const textInterval = setInterval(() => {
        setTextIndex(i => (i + 1) % loadingTexts.length);
    }, 400);

    return () => {
        clearInterval(interval);
        clearInterval(textInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const tl = gsap.timeline({
        onComplete: () => {
            if (onComplete) onComplete();
        }
      });

      // 1. Flash blanc au complet (optionnel, pour l'impact)
      // tl.to(contentRef.current, { filter: "brightness(2)", duration: 0.1, yoyo: true, repeat: 1 });

      // 2. Disparition du contenu vers le haut
      tl.to(contentRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
      });

      // 3. RIDEAU FINAL (Slide Up sec et technique)
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
        delay: 0.1
      });
    }
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Main Bento Container */}
      <div ref={contentRef} className="relative z-10 w-full max-w-md p-8 border border-white/20 bg-neutral-900/50 backdrop-blur-md">
          
          {/* Header: Logo & Version */}
          <div className="flex justify-between items-start mb-12">
              <div className="relative w-12 h-12">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <div className="text-right">
                  <span className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Version</span>
                  <span className="block text-xs font-mono text-white font-bold">2.0.4</span>
              </div>
          </div>

          {/* Big Percentage Number */}
          <div className="mb-4">
              <span className="text-8xl font-black text-white tracking-tighter leading-none">
                  {Math.floor(progress).toString().padStart(2, '0')}%
              </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 mb-4 overflow-hidden">
              <div 
                  className="h-full bg-primary transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
              ></div>
          </div>

          {/* Footer: Status Text & ID */}
          <div className="flex justify-between items-end pt-4 border-t border-white/10">
              <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-primary uppercase tracking-widest animate-pulse">
                      {progress === 100 ? "SYSTEM_READY" : loadingTexts[textIndex]}
                  </span>
                  <span className="text-[9px] font-mono text-white/30 uppercase mt-1">
                      ID: {randomId}
                  </span>
              </div>
              <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white"></div>
      </div>
    </div>
  );
}