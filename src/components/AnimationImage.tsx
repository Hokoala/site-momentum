"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Zap, Shield, Trophy, Target, Crosshair } from "lucide-react";

export default function AnimationImage() {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Refs for animations
    const cardsRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initAnimation = () => {
            gsap.registerPlugin(ScrollTrigger);

            // 1. Setup Pinning for Panels
            const panels = containerRef.current?.querySelectorAll(".panel");
            if (panels) {
                panels.forEach((panel) => {
                    ScrollTrigger.create({
                        trigger: panel as HTMLElement,
                        start: "top top",
                        end: "bottom top",
                        pin: true,
                        pinSpacing: false,
                        scrub: true,
                    });
                });
            }

            // 2. Animations "Vivant" (Continuous)
            
            // Panel 1: Floating Cards (Float up/down independently)
            if (cardsRef.current) {
                const cards = cardsRef.current.children;
                Array.from(cards).forEach((card, i) => {
                    gsap.to(card, {
                        y: -15 - (i * 5), // Different distances
                        duration: 2 + (i * 0.5), // Different speeds
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: i * 0.2 // Stagger start
                    });
                });
            }

            // Panel 2: Rotating Target & Pulsing Text
            if (targetRef.current) {
                gsap.to(targetRef.current, {
                    rotation: 360,
                    duration: 20,
                    repeat: -1,
                    ease: "linear"
                });
            }
            
            if (textRef.current) {
                gsap.fromTo(textRef.current,
                    { scale: 0.95, opacity: 0.9 },
                    { 
                        scale: 1.05, 
                        opacity: 1, 
                        duration: 3, 
                        repeat: -1, 
                        yoyo: true, 
                        ease: "sine.inOut" 
                    }
                );
            }
        };

        const timer = setTimeout(initAnimation, 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            gsap.globalTimeline.clear();
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full bg-black">
            
            {/* --- PANEL 1: MODULES FLOTTANTS --- */}
            <section className="panel relative w-full h-screen overflow-hidden flex items-center justify-center">
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/Image-animation.png"
                        alt="Gameplay Momentum"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                </div>

                {/* Container for Floating Modules */}
                <div ref={cardsRef} className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                    
                    {/* Module 1: COURIR */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-xl flex flex-col items-center text-center group hover:bg-white/10 transition-colors duration-500 hover:border-primary/50">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Zap className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_10px_rgba(192,254,4,0.8)]" />
                        </div>
                        <h3 className="text-3xl font-black italic text-white mb-2 tracking-tighter">COURIR</h3>
                        <p className="text-xs text-white/60 font-mono uppercase tracking-widest">Vitesse Maximale</p>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>
                    </div>

                    {/* Module 2: SURVIVRE (Offset visually) */}
                    <div className="md:mt-12 bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-xl flex flex-col items-center text-center group hover:bg-white/10 transition-colors duration-500 hover:border-red-500/50">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Shield className="w-8 h-8 text-white group-hover:text-red-500 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-colors" />
                        </div>
                        <h3 className="text-3xl font-black italic text-white mb-2 tracking-tighter">SURVIVRE</h3>
                        <p className="text-xs text-white/60 font-mono uppercase tracking-widest">Éviter les pièges</p>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>
                    </div>

                    {/* Module 3: GAGNER */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-xl flex flex-col items-center text-center group hover:bg-white/10 transition-colors duration-500 hover:border-primary/50">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Trophy className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_10px_rgba(192,254,4,0.8)]" />
                        </div>
                        <h3 className="text-3xl font-black italic text-white mb-2 tracking-tighter">GAGNER</h3>
                        <p className="text-xs text-white/60 font-mono uppercase tracking-widest">Dominer le classement</p>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>
                    </div>

                </div>
            </section>


            {/* --- PANEL 2: ACTIVE TARGETING --- */}
            <section className="panel relative w-full h-screen overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/Image2-animation.png"
                        alt="Marathon animation"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80"></div>
                </div>

                {/* Animated HUD / Target */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    
                    {/* Rotating Outer Ring */}
                    <div ref={targetRef} className="absolute w-[600px] h-[600px] border border-white/5 rounded-full flex items-center justify-center pointer-events-none">
                        <div className="absolute top-0 w-1 h-4 bg-primary"></div>
                        <div className="absolute bottom-0 w-1 h-4 bg-primary"></div>
                        <div className="absolute left-0 w-4 h-1 bg-primary"></div>
                        <div className="absolute right-0 w-4 h-1 bg-primary"></div>
                        <div className="w-[580px] h-[580px] border border-dashed border-white/10 rounded-full"></div>
                    </div>

                    {/* Central Content */}
                    <div ref={textRef} className="relative z-20 text-center mix-blend-overlay">
                        <Target className="w-12 h-12 mx-auto mb-6 text-white" />
                        
                        <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                            Affrontez
                        </h2>
                        <h2 className="text-5xl md:text-8xl font-black text-transparent stroke-white text-stroke uppercase tracking-tighter leading-none">
                            Vos Rivaux
                        </h2>
                    </div>

                    {/* Floating HUD Elements */}
                    <div className="absolute top-1/2 left-10 md:left-20 -translate-y-1/2 hidden md:flex flex-col gap-4 opacity-50">
                        <div className="flex items-center gap-2 font-mono text-xs text-white">
                            <Crosshair className="w-4 h-4 text-primary" /> TARGET ACQUIRED
                        </div>
                        <div className="h-32 w-px bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
                    </div>

                    <div className="absolute top-1/2 right-10 md:right-20 -translate-y-1/2 hidden md:flex flex-col gap-4 items-end opacity-50">
                        <div className="flex items-center gap-2 font-mono text-xs text-white">
                            LIVE FEED <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        </div>
                        <div className="h-32 w-px bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .text-stroke {
                    -webkit-text-stroke: 1px rgba(255,255,255,0.8);
                }
                @media (min-width: 768px) {
                    .text-stroke {
                        -webkit-text-stroke: 2px rgba(255,255,255,0.8);
                    }
                }
            `}</style>
        </div>
    );
}
