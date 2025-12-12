"use client";

import Link from 'next/link';
import { useState } from 'react';

const menuItems = [
    {
        label: 'HOME',
        href: '/',
    },
    {
        label: 'DESCRIPTION',
        href: '#Description',
    },
    {
        label: 'CRÉATEURS',
        href: '#presentation',
    },
    {
        label: 'SCORES',
        href: '#scores',
    }
];

const languages = [
    { code: 'fr', label: 'FRANÇAIS' },
    { code: 'en', label: 'ENGLISH' }
];

export default function Header() {
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="w-full bg-black top-0 z-50 border-b-2 border-white">
            <div className="w-full px-4 md:px-6 py-3 md:py-0 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-white text-lg md:text-xl font-bold tracking-wider transition-all duration-300 hover:text-[#C0FE04]"
                >
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
                                isMobileMenuOpen ? 'top-3 rotate-45' : 'top-1 rotate-0'
                            }`}
                        />
                        <span
                            className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                                isMobileMenuOpen ? 'opacity-0 translate-x-3' : 'opacity-100 translate-x-0'
                            }`}
                        />
                        <span
                            className={`absolute left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                                isMobileMenuOpen ? 'top-3 -rotate-45' : 'top-5 rotate-0'
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
                            className="text-white text-sm font-medium tracking-wider transition-colors duration-300 hover:text-[#C0FE04] py-5"
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Sélecteur de langue */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                            className="text-white text-sm font-medium tracking-wider hover:text-[#C0FE04] transition-colors duration-300 flex items-center gap-2"
                        >
                            <span>{selectedLanguage.label}</span>
                            <span className="text-[#C0FE04]">[</span>
                            <svg
                                className={`w-3 h-3 transition-transform duration-300 ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-[#C0FE04]">]</span>
                        </button>

                        {/* Menu déroulant langue */}
                        <div
                            className={`absolute top-full mt-2 right-0 bg-black border-2 border-[#C0FE04] min-w-[150px] transition-all duration-300 origin-top ${
                                isLanguageMenuOpen
                                    ? 'opacity-100 scale-y-100 translate-y-0'
                                    : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
                            }`}
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setSelectedLanguage(lang);
                                        setIsLanguageMenuOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-sm font-medium tracking-wider transition-all duration-200 hover:bg-[#C0FE04] hover:text-black ${
                                        selectedLanguage.code === lang.code ? 'bg-[#C0FE04] text-black' : 'text-white'
                                    }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Bouton Jouer - desktop */}
                <Link
                    href="/"
                    className="hidden lg:block text-black text-sm font-bold tracking-wider bg-[#C0FE04] px-6 xl:px-10 py-3 xl:py-4 transition-all duration-300 hover:bg-white"
                >
                    JOUER
                </Link>
            </div>

            {/* Menu mobile */}
            <div
                className={`lg:hidden border-t-2 border-white overflow-hidden transition-all duration-500 ease-in-out ${
                    isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
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
