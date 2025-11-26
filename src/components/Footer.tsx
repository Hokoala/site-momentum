"use client";

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="relative bg-black">
            {/* Footer content */}
            <footer className="relative bg-black border-t border-white/10 text-white z-10">
                <div className="px-6 py-12">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-3">
                                <Link href="/" className="flex items-center gap-2 w-fit">
                                    <div className="bg-primary p-1 rounded-md">
                                        <svg
                                            className="w-4 h-4 text-primary-foreground"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-md font-light text-white">Aif-f Studios.</span>
                                </Link>
                                <p className="text-xs text-white/70">
                                    Studio de développement de jeux vidéo
                                </p>
                            </div>
                        </div>


                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-white">Navigation</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        Accueil
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-white">Équipe</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="https://elouanb.fr/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/70 hover:text-white transition-colors hover:cursor-pointer"
                                    >
                                        Elouan Bruzek
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://portfolio-nine-kappa-50.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/70 hover:text-white transition-colors hover:cursor-pointer"
                                    >
                                        Jean-Michel Le
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="http://mmi23f01.mmi-troyes.fr/portfolio/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/70 hover:text-white transition-colors hover:cursor-pointer"
                                    >
                                        Job-Faël Babalola
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="http://45.147.97.140/portfolio/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/70 hover:text-white transition-colors hover:cursor-pointer"
                                    >
                                        Théo Birost
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-white/70 text-center md:text-left">
                            © {currentYear} Aif-f Studios - Tous droits réservés
                        </p>
                        <p className="text-xs text-white/70 text-center md:text-right">
                            Projet Momentum réalisé dans le cadre de la SAE501 à l'IUT de Troyes
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
