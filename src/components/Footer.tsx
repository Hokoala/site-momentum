"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const menuItems = [
  { label: "HOME", href: "/" },
  { label: "DESCRIPTION", href: "#Description" },
  { label: "CREATORS", href: "#Creators" },
  { label: "STATS", href: "/statistiques" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-black text-white border-t border-white/20">
      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[300px]">
        {/* COL 1: IDENTITY */}
        <div className="lg:col-span-2 border-r border-white/20 flex flex-col justify-between p-6 md:p-8">
          <div className="space-y-3">
            <p className="font-mono text-[10px] text-primary uppercase tracking-widest">
              AGENCY: AIF-F STUDIOS
            </p>
            <p className="text-xs font-bold uppercase leading-relaxed max-w-sm text-white/70">
              Projet étudiant SAE 501. Une expérience immersive de parkour
              rythmique développée avec Next.js et Unity.
            </p>
          </div>

          <div className="mt-8 lg:mt-0">
            <h1 className="text-[12vw] lg:text-[6rem] font-black leading-[0.8] tracking-tighter select-none text-white mix-blend-difference">
              MOMENTUM
            </h1>
          </div>
        </div>

        {/* COL 2: LINKS */}
        <div className="border-r border-white/20 bg-neutral-900/10">
          <div className="flex flex-col h-full">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex items-center justify-between px-6 border-b border-white/10 hover:bg-white hover:text-black transition-colors group"
              >
                <span className="text-sm font-bold uppercase tracking-wider">
                  {item.label}
                </span>
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* COL 3: PATTERN & INFO */}
        <div className="flex flex-col">
          {/* Pattern Block */}
          <div className="flex-1 bg-[repeating-linear-gradient(45deg,#111,#111_10px,#C0FE04_10px,#C0FE04_20px)] border-b border-white/20"></div>

          {/* Info Block */}
          <div className="p-6 flex flex-col justify-end h-1/2 bg-black">
            <div className="space-y-1 text-right">
              <p className="font-mono text-[10px] text-white/40">
                VERSION: 2.0.4-RC
              </p>
              <p className="font-mono text-[10px] text-white/40">
                SERVER: PARIS-EU-WEST
              </p>
              <div className="w-full h-px bg-white/20 my-2"></div>
              <p className="font-bold text-[10px] uppercase tracking-widest">
                © 2025 BUT MMI TROYES
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
