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

    return (
        <header className="w-full bg-black  top-0 z-50 border-b-2 border-white">
            <div className="w-full px-2  flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-white text-xl font-bold tracking-wider">
                    MOMENTUM
                </Link>

                {/* Navigation centrale */}
                <nav className="flex items-center gap-12">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-white text-sm font-medium tracking-wider hover:text-[#C0FE04] transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Sélecteur de langue */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                            className="text-white text-sm font-medium tracking-wider hover:text-[#C0FE04] transition-colors flex items-center gap-2"
                        >
                            <span>{selectedLanguage.label}</span>
                            <span className="text-[#C0FE04]">[</span>
                            <svg
                                className={`w-3 h-3 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-[#C0FE04]">]</span>
                        </button>

                        {/* Menu déroulant */}
                        {isLanguageMenuOpen && (
                            <div className="absolute top-full mt-2 right-0 bg-black border-2 border-[#C0FE04] min-w-[150px]">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setSelectedLanguage(lang);
                                            setIsLanguageMenuOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left text-sm font-medium tracking-wider hover:bg-[#C0FE04] hover:text-black transition-colors ${
                                            selectedLanguage.code === lang.code ? 'bg-[#C0FE04] text-black' : 'text-white'
                                        }`}
                                    >
                                        <span>{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Bouton Jouer */}
                <Link
                    href="/"
                    className="text-black text-sm font-bold tracking-wider bg-[#C0FE04] px-10 py-4 hover:bg-white transition-colors"
                >
                    JOUER
                </Link>
            </div>
        </header>
    );
}