"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PixelBlast from "@/components/PixelBlast";
import Loading from "@/components/Loading";
import HeroTitre from "@/components/Hero-Titre";
import ScrollReveal from "@/components/ScrollReveal";
import Button from "@/components/Button-savoir";
import AnimationImage from "@/components/animation-image";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <main className="relative w-full bg-black overflow-x-hidden">
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#C0FE04"
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            speed={0.6}
            edgeFade={0.25}
            transparent
          />
        </div>

        <div className="relative z-10 h-full flex items-end justify-start p-3 md:p-9">
          <HeroTitre />
        </div>
      </section>

      <section
        className="relative w-full min-h-screen flex items-center bg-black px-3 md:px-3 lg:px-9"
        id="presentation"
      >
        <div className="max-w-3xl h-full">
          {/* Titre principal */}
          <h2 className="text-4xl md:text-9xl text-white leading-none py-20">
            Description du jeu
          </h2>

          {/* Texte avec effet de révélation */}
          <ScrollReveal
            baseOpacity={0.3}
            enableBlur={true}
            baseRotation={0}
            blurStrength={5}
            textClassName="text-white text-xs max-w-xl py-20"
            rotationEnd="center center"
            wordAnimationEnd="center center"
          >
            Affrontez votre rival dans une course effrénée où lumière et ténèbres
            s'affrontent ! Momentum est un parkour compétitif explosif pour 2
            joueurs où chaque note de musique rythme vos mouvements. Collectez des
            orbes lumineuses pour survivre aux phases nocturnes, sabotez votre
            adversaire avec des pièges vicieux, et dominez le classement mondial
            sur des cartes futuristes éblouissantes !
          </ScrollReveal>

          {/* Carte d'appel à l'action */}
          <div className="relative bg-[#C0FE04] p-6 md:p-5 pb-20 md:pb-24 w-fit max-w-xl">
            <h2 className="text-lg md:text-XL font-bold uppercase leading-tight text-black">
              Laissez votre corps périr <br />
              Devenez un coureur
            </h2>

            <p className="mt-4 text-xs md:text-xs uppercase tracking-wide text-black leading-relaxed">
              Maîtrisez les mécaniques jour/nuit, adaptez votre stratégie en temps
              réel, utilisez intelligemment votre onde lumineuse et prenez
              l'avantage sur votre rival.
            </p>

            {/* Bouton positionné en bas à droite */}
            <div className="absolute bottom-0 right-0">
              <Button text="En savoir plus" href="#presentation" />
            </div>
          </div>
        </div>

        {/* Image positionnée à droite du viewport */}
        <div className="absolute right-8 bottom-0 md:right-16 md:bottom-0 pointer-events-none">
          <Image
            src="/assets/test1.png"
            alt="Gameplay de Momentum montrant un coureur en action"
            width={700}
            height={700}
            className="w-80 md:w-[700px] h-auto"
            priority
          />
        </div>
      </section>

      {/* Espace entre les sections */}
      <div className="w-full h-20 md:h-32 bg-black"></div>

      <AnimationImage />

      {/* Section Créateurs */}
      <section className="relative w-full min-h-screen bg-black py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-7xl text-white font-bold uppercase mb-16">
            Les créateurs du jeu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Créateur 1 */}
            <div className="bg-white/5 border border-lime-400/20 p-6 hover:border-lime-400 transition-all duration-300">
              <h3 className="text-xl font-bold text-lime-400 mb-2">
                Elouan Bruzek
              </h3>
              <p className="text-white/70 text-sm mb-4">
                [Game developer / Web developer]
              </p>
              <a
                href="https://elouanb.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-400 text-sm hover:underline"
              >
                Portfolio →
              </a>
            </div>

            {/* Créateur 2 */}
            <div className="bg-white/5 border border-lime-400/20 p-6 hover:border-lime-400 transition-all duration-300">
              <h3 className="text-xl font-bold text-lime-400 mb-2">
                Jean-Michel Le
              </h3>
              <p className="text-white/70 text-sm mb-4">
                  [Game developer / Web developer]</p>
              <a
                href="https://portfolio-nine-kappa-50.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-400 text-sm hover:underline"
              >
                Portfolio →
              </a>
            </div>

            {/* Créateur 3 */}
            <div className="bg-white/5 border border-lime-400/20 p-6 hover:border-lime-400 transition-all duration-300">
              <h3 className="text-xl font-bold text-lime-400 mb-2">
                Job-Faël Babalola
              </h3>
              <p className="text-white/70 text-sm mb-4">
                  [Sound Designer / Graphic Designer]
              </p>
              <a
                href="http://mmi23f01.mmi-troyes.fr/portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-400 text-sm hover:underline"
              >
                Portfolio →
              </a>
            </div>

            {/* Créateur 4 */}
            <div className="bg-white/5 border border-lime-400/20 p-6 hover:border-lime-400 transition-all duration-300">
              <h3 className="text-xl font-bold text-lime-400 mb-2">Théo Birost</h3>
              <p className="text-white/70 text-sm mb-4">
                  [Graphic Designer / Artist 3D]
              </p>
              <a
                href="http://45.147.97.140/portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-400 text-sm hover:underline"
              >
                Portfolio →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>

  );
}
