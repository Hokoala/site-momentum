"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PixelBlast from "@/components/PixelBlast";
import Loading from "@/components/Loading";
import HeroTitre from "@/components/HeroTitre";
import Button from "@/components/ButtonSavoir";
import ScrollReveal from "@/components/ScrollReveal";
import AnimationImage from "@/components/AnimationImage";
import SlideDown from "@/components/SlideDown";
import PixelTransition from "@/components/PixelTransition";

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
        className="relative w-full min-h-screen flex flex-col lg:flex-row lg:items-center bg-black px-4 sm:px-6 md:px-8 lg:px-12 py-10 lg:py-0"
        id="Description"
      >
        {/* Contenu texte */}
        <div className="w-full lg:max-w-3xl z-10">
          {/* Titre principal */}
          <SlideDown triggerId="Description">
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl text-white leading-none py-10 md:py-16 lg:py-20">
              Description du jeu
            </h2>
          </SlideDown>

          {/* Texte avec effet de révélation */}
          <SlideDown triggerId="Description" delay={0.1}>
          <ScrollReveal
            baseOpacity={0.3}
            enableBlur={true}
            baseRotation={0}
            blurStrength={5}
            textClassName="text-white text-xs sm:text-sm max-w-xl py-10 md:py-16 lg:py-20"

          >
            Affrontez votre rival dans une course effrénée où lumière et ténèbres
            s'affrontent ! Momentum est un parkour compétitif explosif pour 2
            joueurs où chaque note de musique rythme vos mouvements. Collectez des
            orbes lumineuses pour survivre aux phases nocturnes, sabotez votre
            adversaire avec des pièges vicieux, et dominez le classement mondial
            sur des cartes futuristes éblouissantes !
          </ScrollReveal>
          </SlideDown>

          {/* Carte d'appel à l'action */}
          <SlideDown triggerId="Description" delay={0.2}>
          <div className="relative bg-[#C0FE04] p-4 sm:p-5 md:p-6 pb-16 sm:pb-20 md:pb-24 w-full sm:w-fit max-w-xl">
            <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase leading-tight text-black">
              Laissez votre corps périr <br />
              Devenez un coureur
            </h2>

            <p className="mt-3 sm:mt-4 text-xs uppercase tracking-wide text-black leading-relaxed">
              Maîtrisez les mécaniques jour/nuit, adaptez votre stratégie en temps
              réel, utilisez intelligemment votre onde lumineuse et prenez
              l'avantage sur votre rival.
            </p>

            {/* Bouton positionné en bas à droite */}
            <div className="absolute bottom-0 right-0">
              <Button text="En savoir plus" href="#Description" />
            </div>
          </div>
          </SlideDown>
        </div>

        {/* Vidéo - cachée sur mobile, visible sur tablette+ */}
        <div className="hidden md:block absolute right-4 bottom-10 lg:right-16 lg:bottom-0 pointer-events-none">
          <video
            src="/assets/video/attract.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-64 lg:w-[600px] xl:w-[900px] h-auto opacity-80 lg:opacity-100"
          />
        </div>

        {/* Image mobile - affichée uniquement sur mobile */}
        <div className="md:hidden w-full flex justify-center mt-10">
          <Image
            src="/assets/test1.png"
            alt="Gameplay de Momentum montrant un coureur en action"
            width={400}
            height={400}
            className="w-64 sm:w-80 h-auto"
            priority
          />
        </div>
      </section>

      {/* Espace entre les sections */}
      <div className="w-full h-20 md:h-32 bg-black"></div>

      <AnimationImage />

      {/* Section Créateurs */}
      <section id="Creators" className="relative w-full min-h-screen bg-black py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <SlideDown triggerId="Creators">
            <h2 className="text-4xl md:text-7xl text-white font-bold uppercase mb-16">
              Les créateurs du jeu
            </h2>
          </SlideDown>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Créateur 1 - Elouan */}
            <SlideDown triggerId="Creators" delay={0.1}>
              <PixelTransition
                firstContent={
                  <Image
                    src="/assets/creators/elouan2.jpg"
                    alt="Elouan Bruzek"
                    fill
                    className="object-cover"
                  />
                }
                secondContent={
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black p-4 text-center">
                    <h3 className="text-xl font-bold text-lime-400 mb-2">
                      Elouan Bruzek
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      Game developer / Web developer
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
                }
                gridSize={12}
                pixelColor="#C0FE04"
                className="w-full"
                style={{ border: "2px solid #C0FE04" }}
              />
            </SlideDown>

            {/* Créateur 2 - Jean-Michel */}
            <SlideDown triggerId="Creators" delay={0.2}>
              <PixelTransition
                firstContent={
                  <Image
                    src="/assets/creators/JM1.png"
                    alt="Jean-Michel Le"
                    fill
                    className="object-cover"
                  />
                }
                secondContent={
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black p-4 text-center">
                    <h3 className="text-xl font-bold text-lime-400 mb-2">
                      Jean-Michel Le
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      Game developer / Web developer
                    </p>
                    <a
                      href="https://portfolio-nine-kappa-50.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lime-400 text-sm hover:underline"
                    >
                      Portfolio →
                    </a>
                  </div>
                }
                gridSize={12}
                pixelColor="#C0FE04"
                className="w-full"
                style={{ border: "2px solid #C0FE04" }}
              />
            </SlideDown>

            {/* Créateur 3 - Job-Faël */}
            <SlideDown triggerId="Creators" delay={0.3}>
              <PixelTransition
                firstContent={
                  <Image
                    src="/assets/creators/JOB2.jpg"
                    alt="Job-Faël Babalola"
                    fill
                    className="object-cover"
                  />
                }
                secondContent={
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black p-4 text-center">
                    <h3 className="text-xl font-bold text-lime-400 mb-2">
                      Job-Faël Babalola
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      Sound Designer / Graphic Designer
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
                }
                gridSize={12}
                pixelColor="#C0FE04"
                className="w-full"
                style={{ border: "2px solid #C0FE04" }}
              />
            </SlideDown>

            {/* Créateur 4 - Théo */}
            <SlideDown triggerId="Creators" delay={0.4}>
              <PixelTransition
                firstContent={
                  <Image
                    src="/assets/creators/THEO1.png"
                    alt="Théo Birost"
                    fill
                    className="object-cover"
                  />
                }
                secondContent={
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black p-4 text-center">
                    <h3 className="text-xl font-bold text-lime-400 mb-2">
                      Théo Birost
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      Graphic Designer / Artist 3D
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
                }
                gridSize={12}
                pixelColor="#C0FE04"
                className="w-full"
                style={{ border: "2px solid #C0FE04" }}
              />
            </SlideDown>
          </div>
        </div>
      </section>
    </main>

  );
}
