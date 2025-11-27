"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const menuItems = [
    {
        label: 'Accueil',
        href: '/',
        description: 'Retour à la page principale',
    },
    {
        label: 'Présentation',
        href: '#presentation',
        description: 'Retour à la page principale',
    }
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <header className="w-full px-4 py-2 bg-black/70 backdrop-blur-md fixed top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-white text-lg font-bold">
                    <Image
                        src="/assets/logo-momentum.svg"
                        alt="Momentum Logo"
                        width={32}
                        height={32}
                        className="w-10 h-auto"
                    />
                </Link>

                {/* Navigation au milieu */}
                <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-white hover:text-lime-400 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>


                {/* Espace vide à droite */}
                <div className="w-20"></div>
            </div>
        </header>
    );

}
