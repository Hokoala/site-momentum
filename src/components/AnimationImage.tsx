"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Zap, Shield, Trophy, Crosshair } from "lucide-react";

export default function AnimationImage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const panel1Ref = useRef<HTMLDivElement>(null);
    const panel2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initAnimation = () => {
            gsap.registerPlugin(ScrollTrigger);

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

            // Animation Panel 1 (Bento Reveal)
            if (panel1Ref.current) {
                const bentoItems = panel1Ref.current.querySelectorAll(".bento-item");
                gsap.fromTo(bentoItems, 
                    { y: 100, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        stagger: 0.2, 
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: panel1Ref.current,
                            start: "top center",
                            end: "center center",
                            scrub: 1
                        }
                    }
                );
            }

            // Animation Panel 2 (Versus Split)
            if (panel2Ref.current) {
                const leftSide = panel2Ref.current.querySelector(".split-left");
                const rightSide = panel2Ref.current.querySelector(".split-right");
                
                gsap.fromTo(leftSide, { x: "-50%" }, { x: "0%", duration: 1, ease: "power2.out", scrollTrigger: { trigger: panel2Ref.current, start: "top bottom", end: "top top", scrub: 1 }});
                gsap.fromTo(rightSide, { x: "50%" }, { x: "0%", duration: 1, ease: "power2.out", scrollTrigger: { trigger: panel2Ref.current, start: "top bottom", end: "top top", scrub: 1 }});
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
            
            {/* --- PANEL 1: BENTO GRID (Darker Version) --- */}
            <section ref={panel1Ref} className="panel relative w-full h-screen overflow-hidden flex items-center justify-center p-6 md:p-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/Image-animation.png"
                        alt="Gameplay Momentum"
                        fill
                        className="object-cover opacity-60" // Darker opacity
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4 h-full md:h-auto">
                    
                    {/* Item 1: COURIR */}
                    <div className="bento-item bg-black/60 backdrop-blur-md border border-white/10 p-8 flex flex-col justify-between group hover:border-primary/50 transition-all duration-500 h-[30vh] md:h-[60vh]">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest border border-white/10 px-2 py-1">01 // SPEED</span>
                            <Zap className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter">Run</h3>
                            <p className="text-sm text-white/60 font-mono leading-relaxed border-l-2 border-primary/50 pl-4">
                                Maximum speed required.<br/>
                                Never slow down.
                            </p>
                        </div>
                        <div className="w-full h-1 bg-white/10 mt-8 overflow-hidden">
                            <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                        </div>
                    </div>

                    {/* Item 2: SURVIVRE */}
                    <div className="bento-item bg-black/60 backdrop-blur-md border border-white/10 p-8 flex flex-col justify-between group hover:border-red-500/50 transition-all duration-500 h-[30vh] md:h-[60vh] md:mt-12">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest border border-white/10 px-2 py-1">02 // SURVIVAL</span>
                            <Shield className="w-6 h-6 text-white/40 group-hover:text-red-500 transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter">Survive</h3>
                            <p className="text-sm text-white/60 font-mono leading-relaxed border-l-2 border-red-500/50 pl-4">
                                Avoid obstacles.<br/>
                                Death is immediate.
                            </p>
                        </div>
                        <div className="w-full h-1 bg-white/10 mt-8 overflow-hidden">
                            <div className="h-full bg-red-500 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                        </div>
                    </div>

                    {/* Item 3: GAGNER */}
                    <div className="bento-item bg-black/60 backdrop-blur-md border border-white/10 p-8 flex flex-col justify-between group hover:border-primary/50 transition-all duration-500 h-[30vh] md:h-[60vh] md:mt-24">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest border border-white/10 px-2 py-1">03 // VICTORY</span>
                            <Trophy className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter">Win</h3>
                            <p className="text-sm text-white/60 font-mono leading-relaxed border-l-2 border-primary/50 pl-4">
                                Dominate the leaderboard.<br/>
                                Become a legend.
                            </p>
                        </div>
                        <div className="w-full h-1 bg-white/10 mt-8 overflow-hidden">
                            <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PANEL 2: TECH SPLIT (Darker Version) --- */}
            <section ref={panel2Ref} className="panel relative w-full h-screen overflow-hidden flex">
                 <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/Image2-animation.png"
                        alt="Marathon animation"
                        fill
                        className="object-cover opacity-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-80"></div>
                </div>

                <div className="split-left w-1/2 h-full border-r border-white/10 flex flex-col justify-center items-end pr-8 md:pr-16 relative z-10 bg-black/40 backdrop-blur-sm pb-6">
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-4 text-primary font-mono text-xs tracking-widest">
                            TARGET_ACQUIRED <Crosshair className="w-4 h-4 animate-spin-slow" />
                        </div>
                        <h2 className="text-6xl md:text-9xl font-black text-white uppercase whitespace-nowrap tracking-tighter leading-none drop-shadow-2xl">
                            Face-off
                        </h2>
                    </div>
                </div>

                <div className="split-right w-1/2 h-full flex flex-col justify-center items-start pl-8 md:pl-16 relative z-10 bg-black/40 backdrop-blur-sm pt-6">
                    <div>
                        <h2 className="text-6xl md:text-9xl font-black text-white uppercase whitespace-nowrap tracking-tighter leading-none drop-shadow-2xl">
                            Your Rivals
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-primary"></div>
                            <p className="text-white/60 font-mono text-xs uppercase tracking-widest">
                                Multiplayer Arena Protocol
                            </p>
                        </div>
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-16 h-16 border border-white/20 rotate-45 flex items-center justify-center bg-black/80">
                        <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
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