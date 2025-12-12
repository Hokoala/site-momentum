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

        {/* Image - cachée sur mobile, visible sur tablette+ */}
        <div className="hidden md:block absolute right-4 bottom-10 lg:right-16 lg:bottom-0 pointer-events-none">
          <Image
            src="/assets/test1.png"
            alt="Gameplay de Momentum montrant un coureur en action"
            width={700}
            height={700}
            className="w-64 lg:w-[500px] xl:w-[700px] h-auto opacity-80 lg:opacity-100"
            priority
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
            {/* Créateur 1 */}
            <SlideDown triggerId="Creators" delay={0.1}>
            <div className="bg-white/5 border border-lime-400/20 p-6 hover:border-lime-400 transition-all duration-300 h-full">
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
            </SlideDown>

            {/* Créateur 2 */}
            <SlideDown triggerId="Creators" delay={0.2}>
            <div className="bg-white/5 border border-lime-400/20 p-6 hover:border-lime-400 transition-all duration-300 h-full">
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
            </SlideDown>

            {/* Créateur 3 */}
            <SlideDown triggerId="Creators" delay={0.3}>
            <div className="bg-white/5 border border-lime-400/20 p-6 hover:border-lime-400 transition-all duration-300 h-full">
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
            </SlideDown>

            {/* Créateur 4 */}
            <SlideDown triggerId="Creators" delay={0.4}>
            <div className="bg-white/5 border border-lime-400/20 p-6 hover:border-lime-400 transition-all duration-300 h-full">
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
            </SlideDown>
          </div>
        </div>
      </section>

      {/* Section Scores */}
      <section id="Scores" className="relative w-full min-h-screen bg-black py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <SlideDown>
            <h2 className="text-4xl md:text-7xl text-white font-bold uppercase mb-16">
              Scores
            </h2>
          </SlideDown>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top 1 */}
            <SlideDown delay={0.1} className="md:col-span-3">
              <div className="bg-gradient-to-r from-[#C0FE04]/20 to-transparent border-2 border-[#C0FE04] p-8">
                <div className="flex items-center gap-6">
                  <span className="text-6xl md:text-8xl font-bold text-[#C0FE04]">1</span>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">PlayerOne</h3>
                    <p className="text-[#C0FE04] text-xl mt-2">125,000 pts</p>
                  </div>
                  <div className="hidden md:block">
                    <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17C14.7614 17 17 14.7614 17 12V4H7V12C7 14.7614 9.23858 17 12 17Z" stroke="#C0FE04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 8H19C20.1046 8 21 8.89543 21 10V10C21 11.1046 20.1046 12 19 12H17" stroke="#C0FE04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 8H5C3.89543 8 3 8.89543 3 10V10C3 11.1046 3.89543 12 5 12H7" stroke="#C0FE04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17V20" stroke="#C0FE04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 21H16" stroke="#C0FE04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </SlideDown>

            {/* Top 2 */}
            <SlideDown delay={0.2}>
              <div className="bg-white/5 border border-white/20 p-6 hover:border-[#C0FE04] transition-all duration-300 h-full">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white/50">2</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">SpeedRunner</h3>
                    <p className="text-white/70 mt-1">98,500 pts</p>
                  </div>
                </div>
              </div>
            </SlideDown>

            {/* Top 3 */}
            <SlideDown delay={0.3}>
              <div className="bg-white/5 border border-white/20 p-6 hover:border-[#C0FE04] transition-all duration-300 h-full">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white/50">3</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">NightOwl</h3>
                    <p className="text-white/70 mt-1">87,200 pts</p>
                  </div>
                </div>
              </div>
            </SlideDown>

            {/* Top 4 */}
            <SlideDown delay={0.4}>
              <div className="bg-white/5 border border-white/20 p-6 hover:border-[#C0FE04] transition-all duration-300 h-full">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white/50">4</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">LightChaser</h3>
                    <p className="text-white/70 mt-1">76,800 pts</p>
                  </div>
                </div>
              </div>
            </SlideDown>

            {/* Top 5 */}
            <SlideDown delay={0.5} className="md:col-span-3">
              <div className="bg-white/5 border border-white/20 p-6 hover:border-[#C0FE04] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-white/50">5</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">ShadowDash</h3>
                    <p className="text-white/70 mt-1">65,400 pts</p>
                  </div>
                </div>
              </div>
            </SlideDown>
          </div>
        </div>
      </section>
    </main>

  );
}
