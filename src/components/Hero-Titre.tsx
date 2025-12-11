"use client";

import { motion } from 'framer-motion';

export default function HeroTitre() {
    return (
        <div className="text-white">
            <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <p className="text-lg md:text-xl font-bold">Courez. Collectez La Lumière,<br/> sabotez votre rival et survivez à la nuit</p>

            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1
                    className="font-interference leading-none"
                    style={{
                        fontSize: 'clamp(3rem, 13vw, 10rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Momentum
                </h1>
            </motion.div>


        </div>
    );
}
