"use client";

import Link from 'next/link';

const menuItems = [
    { label: 'HOME', href: '/' },
    { label: 'DESCRIPTION', href: '#Description' },
    { label: 'Creators', href: '#Creators' },
    { label: 'Scores', href: '#Scores' }
];

export default function Footer() {
    return (
        <footer className="relative w-full bg-black text-white border-2 border-white">
            {/* Bordure supérieure */}
            <div className=""></div>

            {/* Container principal */}
            <div className="relative flex flex-col lg:flex-row">

                {/* COLONNE GAUCHE */}
                <div className="w-full lg:w-[35%] flex flex-col min-h-[300px] lg:min-h-[500px]">

                    {/* Texte en haut */}
                    <div className="px-6 md:px-12 border-b-2 lg:border-r-2 border-white">
                        <p className="text-xs md:text-sm py-3.5">
                            UN PROJET IMAGINÉ ET DÉVELOPPÉ PAR<br />
                            L'AGENCE AIF-F STUDIOS.
                        </p>
                    </div>

                    {/* Logo MOMENTUM en bas */}
                    <div className="mt-auto p-4 md:p-8 border-b-2 lg:border-b-0 border-white">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-bold tracking-tight leading-[0.9]">
                            MOMENTUM
                        </h1>
                    </div>

                </div>

                {/* COLONNE DROITE */}
                <div className="flex-1 flex flex-col">

                    {/* Navigation en haut */}
                    <div className="border-b-2 border-white px-4 md:px-12 py-4 md:py-6">
                        <nav className="flex flex-wrap justify-center lg:justify-end gap-4 md:gap-8 lg:gap-16">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-xs md:text-sm tracking-widest hover:text-[#C0FE04] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Section inférieure - divisée en 3 parties */}
                    <div className="relative flex flex-col md:flex-row flex-1 min-h-[250px] md:min-h-[400px]">

                        {/* Partie gauche vide (pour l'espace) - cachée sur mobile */}
                        <div className="hidden md:block flex-1"></div>

                        {/* Pattern diagonal au centre avec bordure à droite */}
                        <div className="border-b-2 md:border-b-0 md:border-r-2 border-white">
                            <div
                                className="w-full md:w-[200px] lg:w-[280px] h-[100px] md:h-full"
                                style={{
                                    background: `repeating-linear-gradient(
                                        45deg,
                                        #C0FE04,
                                        #C0FE04 28px,
                                        #000000 28px,
                                        #000000 56px
                                    )`
                                }}
                            ></div>
                        </div>

                        {/* Partie droite avec le copyright */}
                        <div className="flex-1 flex items-end justify-center md:justify-end p-6 md:p-12">
                            <p className="text-xs text-center md:text-right leading-relaxed tracking-wide">
                                @ 2025 SITE DE LA SAE 501 PAR<br />
                                LES ÉTUDIANTS DE MMI
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
