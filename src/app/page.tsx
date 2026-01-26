"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";
import HeroTitre from "@/components/HeroTitre";
import SlideDown from "@/components/SlideDown";
import AnimationImage from "@/components/AnimationImage";
import CrosshairOverlay from "@/components/Crosshair";
import HomeLeaderboard from "@/components/HomeLeaderboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Disc,
  ArrowUpRight,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu l'intro dans cette session
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      setIsLoading(false);
    } else {
      // Si c'est la première fois, on laisse le loader gérer son temps
      // et on ne fait rien ici, le loader appellera onComplete
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("hasVisited", "true");
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loading onComplete={handleLoadingComplete} />}

      <main className="relative w-full bg-black text-white overflow-x-hidden selection:bg-primary selection:text-black font-sans">
        {/* --- HUD HEADER (Technical Overlay) --- */}
        <div className="fixed top-14 md:top-16 left-0 w-full z-40 flex justify-between items-center px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-primary mix-blend-difference pointer-events-none">
          <span>SYS.STATUS: ONLINE</span>
          <span className="hidden md:inline">
            SECURE CONNECTION // PROTOCOL V.0.9
          </span>
          <span>MOMENTUM_BUILD_2026</span>
        </div>

        {/* --- HERO SECTION --- */}
        <section className="relative w-full h-screen border-b border-white/20 overflow-hidden bg-black hover:cursor-none group/hero">
          {/* CROSSHAIR restricted to this section */}
          <CrosshairOverlay />

          {/* VIDEO BACKGROUND */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60"
            >
              <source src="/assets/video/attract.mp4" type="video/mp4" />
            </video>

            {/* DOT PATTERN OVERLAY */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              width="100%"
              height="100%"
              style={{ opacity: 0.25 }}
            >
              <defs>
                <pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="5"
                  height="5"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r="1" fill="#fff"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)"></rect>
            </svg>

            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20"></div>
          </div>

          {/* Overlay Grid Lines (Static) */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-10">
            <div className="w-full h-full grid grid-cols-4 md:grid-cols-6 border-r border-white/10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-r border-white/10 h-full"></div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-20 w-full h-full flex flex-col justify-between p-6 md:p-12 pt-20 md:pt-32">
            <div className="w-full flex justify-between items-start">
              <div className="w-6 h-6"></div>
            </div>

            <div className="flex flex-col items-start max-w-7xl">
              <HeroTitre />

              <SlideDown
                triggerId="hero-cta"
                delay={0.3}
                className="mt-8 flex flex-col md:flex-row gap-6 items-start"
              >
                <Link href="/game/join">
                  <Button className="rounded-none h-12 px-8 text-sm font-bold uppercase tracking-widest bg-primary text-black hover:bg-white hover:text-black border border-transparent hover:border-white transition-all duration-0">
                    [ Initialize the protocol ]
                  </Button>
                </Link>
                <div className="flex items-center gap-3 text-[10px] font-mono text-white/60 max-w-xs leading-relaxed">
                  <div className="w-1.5 h-1.5 bg-red-500 animate-pulse"></div>
                  <span className="w-60">
                    WARNING: Elevated heart rate detected. Prepare for impact.
                  </span>
                </div>
              </SlideDown>
            </div>

            <div className="w-full flex justify-between items-end text-[10px] font-mono text-white/40">
              <span>COORDINATES: 48.8566° N, 2.3522° E</span>
              <span>SCROLL TO DESCEND</span>
            </div>
          </div>
        </section>

        {/* --- MARQUEE SCROLLER --- */}
        <section className="border-b border-white/20 bg-primary text-black overflow-hidden py-2 md:py-3 relative z-20">
          <div className="animate-marquee whitespace-nowrap flex gap-12 items-center text-lg md:text-2xl font-black uppercase tracking-tighter">
            <span>Run or Die</span>
            <span className="w-3 h-3 bg-black"></span>
            <span>Light vs Dark</span>
            <span className="w-3 h-3 bg-black"></span>
            <span>Momentum</span>
            <span className="w-3 h-3 bg-black"></span>
            <span>Rhythm Parkour</span>
            <span className="w-3 h-3 bg-black"></span>
            <span>Run or Die</span>
            <span className="w-3 h-3 bg-black"></span>
            <span>Light vs Dark</span>
            <span className="w-3 h-3 bg-black"></span>
            <span>Momentum</span>
            <span className="w-3 h-3 bg-black"></span>
            <span>Rhythm Parkour</span>
          </div>
        </section>

        {/* --- ANIMATION IMAGE SECTION (Restored) --- */}
        <div className="border-b border-white/20 bg-black relative z-10">
          <AnimationImage />
        </div>

        {/* --- THE GRID LAYOUT (Marathon Style) --- */}
        <section
          className="w-full border-b border-white/20 bg-black relative z-20"
          id="Description"
        >
          {/* Row 1: Concept */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[60vh]">
            {/* Sidebar / Sticky Title */}
            <div className="lg:col-span-3 border-r border-white/20 p-6 md:p-8 flex flex-col justify-between bg-neutral-900/20">
              <div className="sticky top-20">
                <span className="block text-primary text-[10px] font-mono mb-2">
                  01 // SYNOPSIS
                </span>
                <h2 className="text-2xl md:text-3xl font-bold uppercase leading-none tracking-tighter">
                  Concept
                </h2>
              </div>
              <div className="hidden lg:block w-full h-px bg-white/20 my-8"></div>
              <div className="hidden lg:block font-mono text-[10px] text-white/40">
                FILE_ID: MMT_DESC_01 <br />
                ENCRYPTION: NONE
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden bg-black">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Disc className="w-16 h-16 animate-spin-slow text-white" />
              </div>

              <h3 className="text-xl md:text-3xl uppercase font-bold leading-tight mb-6 max-w-4xl">
                "Let your body die. <br />
                <span className="text-primary bg-white/5 px-2">
                  Become a runner.
                </span>"
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-neutral-400 font-light leading-relaxed">
                <div>
                  <p className="mb-4">
                    Momentum is not just a running game.<br/>
                    It's a sensory experience where
                    <strong className="text-white"> light and darkness </strong>
                    clash.<br/>
                    Every jump, every slide is set to the music.
                  </p>
                  <ul className="space-y-1.5 font-mono text-xs text-primary">
                    <li className="flex items-center gap-2">
                      <span>[+]</span> 1V1 COMPETITIVE
                    </li>
                    <li className="flex items-center gap-2">
                      <span>[+]</span> PROCEDURAL PARKOUR
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-4">
                    Collect orbs to survive during the night phases.<br/>
                    Sabotage your opponent.<br/>
                    There is no second place, only survivors.<br/>
                  </p>
                  <Link
                    href="/game/join"
                    className="inline-flex items-center gap-2 text-white border-b border-primary hover:text-primary transition-colors uppercase font-bold tracking-widest text-xs pb-1 cursor-none"
                  >
                    Watch gameplay <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- LEADERBOARD SECTION --- */}
        <HomeLeaderboard />

        {/* --- CREATORS GRID --- */}
        <section
          className="w-full border-b border-white/20 bg-neutral-950 relative z-20"
          id="Creators"
        >
          <div className="p-8 md:p-10 flex flex-col justify-between bg-secondary text-white min-h-[250px]">
            <div>
              <span className="block text-white/60 text-[10px] font-mono mb-3">
                02 // THE TEAM
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tighter ">
                Crédits <br /> & Staff
              </h2>
            </div>
            <PlayCircle className="w-8 h-8 self-end" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {/* Creator Cards */}
            {[
              {
                name: "Elouan Bruzek",
                role: "Game & Web Developer",
                sub: "FULLSTACK",
                link: "https://elouanb.fr/",
                img: "/assets/creators/ELOUAN.png",
              },
              {
                name: "Jean-Michel Le",
                role: "Game & Web Developer",
                sub: "BACKEND",
                link: "https://jean-michel-le.dev/",
                img: "/assets/creators/JM.png",
              },
              {
                name: "Job-Faël Babalola",
                role: "Sound & Graphic Designer",
                sub: "SOUND/GFX",
                link: "https://jobfaelbabalola.fr/",
                img: "/assets/creators/JOB.png",
              },
              {
                name: "Théo Birost",
                role: "Graphic Designer & 3D Artist",
                sub: "3D/MOTION",
                link: "https://portfolio.theo-birost.fr/",
                img: "/assets/creators/THEO.png",
              },
            ].map((c, i) => (
              <Link
                key={i}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-8 md:p-10 min-h-[250px] flex flex-col justify-end hover:bg-white/5 transition-colors cursor-pointer bg-neutral-950"
              >
                {/* Creator Image Background */}
                <div className="absolute inset-0 z-0 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 opacity-30 group-hover:opacity-60">
                  <Image
                    src={c.img}
                    alt={c.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

                <div className="absolute top-6 left-6 text-[10px] font-mono text-white/30 group-hover:text-primary transition-colors z-20">
                  MEMBER_0{i + 1}
                </div>

                <div className="absolute top-6 right-6 z-20">
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="relative z-20 space-y-2">
                  <Badge
                    variant="outline"
                    className="rounded-none border-white/30 text-white/50 text-[9px] mb-1 group-hover:border-primary group-hover:text-primary uppercase bg-black/50 backdrop-blur-sm"
                  >
                    {c.sub}
                  </Badge>
                  <h3 className="text-lg font-bold uppercase text-white group-hover:text-primary transition-colors leading-tight drop-shadow-md">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest group-hover:text-white/70 drop-shadow-md">
                    {c.role}
                  </p>
                </div>

                {/* Corner decoration */}
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 group-hover:border-primary transition-colors z-20"></div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <section className="py-20 px-6 md:px-12 flex flex-col items-center justify-center text-center bg-black relative overflow-hidden z-20">
          <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/20 h-full"></div>
            ))}
          </div>

          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-8 z-10">
            Ready to run?
          </h2>

          <Link href="/game/join" className="z-10">
            <Button className="rounded-none h-14 px-12 text-base font-bold uppercase bg-white text-black hover:bg-primary hover:text-black transition-colors duration-0 border-2 border-transparent hover:border-black">
              Join session
            </Button>
          </Link>

          <div className="mt-12 w-full max-w-screen-2xl flex justify-between text-[10px] font-mono text-white/30 uppercase z-10">
            <span>Momentum Project © 2026</span>
            <span>All rights reserved</span>
            <span>System Status: Stable</span>
          </div>
        </section>
      </main>
    </>
  );
}
