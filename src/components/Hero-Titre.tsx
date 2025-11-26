"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroTitre() {
    return (
        <div className="text-white text-center space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Image
                    src="/assets/logo-momentum.svg"
                    alt="Momentum Logo"
                    width={32}
                    height={32}
                    className="w-45 h-auto mx-auto"
                />
            </motion.div>

            <motion.h1
                className="text-6xl font-bold"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                MOMENTUM
            </motion.h1>

            <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <p>Courez, collectez la lumière, sabotez votre rival et survivez à la nuit.</p>
                <p>Vitesse, stratégie et rythme pour dominer l'arène.</p>
            </motion.div>
        </div>
    );
}
