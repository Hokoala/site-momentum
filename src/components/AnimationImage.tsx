"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export default function AnimationImage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Attendre que le DOM soit complètement chargé
        const initAnimation = () => {
            gsap.registerPlugin(ScrollTrigger);

            const panels = containerRef.current?.querySelectorAll(".panel");

            if (!panels || panels.length === 0) return;

            panels.forEach((panel, index) => {
                ScrollTrigger.create({
                    trigger: panel as HTMLElement,
                    start: "top top",
                    end: "bottom top",
                    pin: true,
                    pinSpacing: false,
                    scrub: true,
                    markers: false, // Mettez à true pour déboguer
                });
            });
        };

        // Petit délai pour s'assurer que tout est monté
        const timer = setTimeout(initAnimation, 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full bg-black">
            {/* Panel 1 - COURIR, SURVIVRE, GAGNER */}
            <section className="panel relative w-full h-screen overflow-hidden">
                <Image
                    src="/assets/screen1.png"
                    alt="Gameplay de Momentum"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-sm p-6 md:p-10 z-10">
                    <h2 className="text-white font-bold text-3xl md:text-5xl tracking-wider mb-2">
                        COURIR.
                    </h2>
                    <h2 className="text-white font-bold text-3xl md:text-5xl tracking-wider mb-2">
                        SURVIVRE.
                    </h2>
                    <h2 className="text-white font-bold text-3xl md:text-5xl tracking-wider">
                        GAGNER.
                    </h2>
                </div>
            </section>

            {/* Panel 2 - Deuxième image */}
            <section className="panel relative w-full h-screen overflow-hidden">
                <Image
                    src="/assets/marathon-anim.jpg"
                    alt="Marathon animation"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-sm p-6 md:p-10 z-10">
                    <h2 className="text-white font-bold text-3xl md:text-5xl tracking-wider">
                        AFFRONTEZ VOS RIVAUX
                    </h2>
                </div>
            </section>
        </div>
    );
}
