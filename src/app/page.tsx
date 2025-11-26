"use client";

import { useState, useEffect } from "react";
import PixelBlast from "@/components/PixelBlast";
import Loading from "@/components/Loading";
import HeroTitre from "@/components/Hero-Titre";
import ScrollReveal from "@/components/ScrollReveal";

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

        <div className="relative z-10 flex items-center justify-center h-full">
          <HeroTitre />
        </div>
      </section>

      <section
        className="relative w-full min-h-screen flex items-center bg-black px-8 md:px-16 lg:px-24"
        id="presentation"
      >
        <div className="max-w-7xl w-full space-y-10">
          <h2 className="text-8xl md:text-8xl font-bold text-white leading-none">
            Description du jeu
          </h2>
          <ScrollReveal
            baseOpacity={0.3}
            enableBlur={true}
            baseRotation={0}
            blurStrength={5}
            textClassName="text-white/70 text-2xl max-w-4xl"
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
        </div>

        {/* Image en bas à droite */}
        <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16">
          <img
            src="https://s6.imgcdn.dev/YKoRmh.jpg"
            alt="Gameplay Momentum"
            className="w-80 md:w-96 lg:w-[400px]  border-3 p-2 border-lime-400"
          />
        </div>
      </section>

      <section
        className="relative w-full min-h-screen flex items-center justify-center bg-black px-8 md:px-16 lg:px-24"
      >
        <div className="max-w-8xl w-full space-y-10">
          <h2 className="text-8xl md:text-8xl font-bold text-white leading-none mb-16 ">
            Images
          </h2>

          {/* Grille d'images - 2 images centrées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="border-2 border-lime-400 p-2">
              <img
                src="https://s6.imgcdn.dev/YKoRmh.jpg"
                alt="Gameplay Momentum 1"
                className="w-full h-auto"
              />
            </div>
            <div className="border-2 border-lime-400 p-2">
              <img
                src="https://s6.imgcdn.dev/YKoRmh.jpg"
                alt="Gameplay Momentum 2"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

      </section>

    </main>
  );
}
