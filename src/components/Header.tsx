"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const menuItems = [
  {
    label: "HOME",
    href: "/",
  },
  {
    label: "DESCRIPTION",
    href: "/#Description",
  },
  {
    label: "Creators",
    href: "/#Creators",
  },
  {
    label: "Statistiques",
    href: "/statistiques",
  },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-black top-0 z-50 border-b border">
      <div className="w-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-lg md:text-xl font-bold tracking-wider transition-all duration-300 hover:text-[#C0FE04] flex items-center"
        >
          <Image
            src="logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          MOMENTUM
        </Link>

        {/* Bouton hamburger - visible sur mobile */}
        <button
          className="lg:hidden text-white p-2 transition-transform duration-300 hover:scale-110"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <span
              className={`absolute left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "top-3 rotate-45" : "top-1 rotate-0"
              }`}
            />
            <span
              className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                isMobileMenuOpen
                  ? "opacity-0 translate-x-3"
                  : "opacity-100 translate-x-0"
              }`}
            />
            <span
              className={`absolute left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "top-3 -rotate-45" : "top-5 rotate-0"
              }`}
            />
          </div>
        </button>

        {/* Navigation desktop */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-thin hover:text-[#C0FE04] transition-all duration-300 hover:underline uppercase"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bouton Jouer - desktop */}
        <Button variant="default" size="default">
          <Link href="/">JOUER</Link>
        </Button>
      </div>

      {/* Menu mobile */}
      <div
        className={`lg:hidden border-t-2 border-white overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-sm font-medium tracking-wider hover:text-[#C0FE04] hover:bg-white/10 transition-all duration-300 px-4 py-4 border-b border-white/20"
            >
              {item.label}
            </Link>
          ))}

          {/* Bouton Jouer mobile */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-black text-sm font-bold tracking-wider bg-[#C0FE04] px-4 py-4 text-center transition-all duration-300 hover:bg-white"
          >
            JOUER
          </Link>
        </nav>
      </div>
    </header>
  );
}
