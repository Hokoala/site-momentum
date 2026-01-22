"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "HOME", href: "/" },
  { label: "DESCRIPTION", href: "/#Description" },
  { label: "CREATORS", href: "/#Creators" },
  { label: "STATISTIQUES", href: "/statistiques" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/20">
      <div className="w-full h-14 md:h-16 flex items-center justify-between pl-4 md:pl-6 pr-0">
        
        {/* LOGO AREA */}
        <Link href="/" className="group flex items-center gap-3 h-full">
            <div className="relative w-8 h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:rotate-180">
                <Image
                    src="/logo.png"
                    alt="Momentum Logo"
                    fill
                    className="object-contain"
                />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tighter text-white group-hover:text-primary transition-colors">
                MOMENTUM
            </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex h-full items-center">
            <nav className="flex h-full">
                {menuItems.map((item, index) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="relative h-full flex items-center px-6 text-[10px] font-mono font-bold uppercase tracking-widest text-white/70 hover:text-black hover:bg-primary border-l border-white/10 transition-all duration-0"
                    >
                        <span className="mr-2 opacity-30">0{index + 1}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>
            
            {/* JOUER BUTTON */}
            <Link 
                href="/game/join" 
                className="h-full flex items-center px-8 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors border-l border-white/20"
            >
                [ JOUER ]
            </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="lg:hidden h-full aspect-square flex items-center justify-center border-l border-white/20 text-white hover:bg-primary hover:text-black transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 top-14 md:top-16 bg-black z-40 flex flex-col">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-5 border-b border-white/10 text-lg font-bold uppercase tracking-widest text-white hover:bg-white/5 group"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      LINK_0{index + 1}
                  </span>
                </Link>
              ))}
              <Link
                href="/game/join"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-auto p-6 bg-primary text-black text-xl font-black uppercase tracking-tighter text-center hover:bg-white transition-colors"
              >
                Lancer le jeu
              </Link>
          </div>
      )}
    </header>
  );
}