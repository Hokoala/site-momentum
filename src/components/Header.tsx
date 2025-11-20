"use client";

import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="font-['KHInterferenceTRIAL-Regular'] text-2xl font-bold text-white hover:text-purple-400 transition-colors">
                        Momentum
                    </Link>

                    {/* Navigation */}
                    <ul className="flex items-center gap-8">
                        <li>
                            <Link href="/" className="text-white/80 hover:text-white transition-colors">
                                Accueil
                            </Link>
                        </li>
                        <li>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

