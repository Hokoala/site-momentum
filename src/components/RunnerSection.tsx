"use client";

import ButtonSavoir from '@/components/ButtonSavoir';

export default function RunnerSection() {
  return (
    <section className="bg-lime-400 p-10 md:p-16 font-interference relative">
      <div className="max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold uppercase leading-tight text-black">
          Laissez votre corps périr <br />
          Devenez un coureur
        </h2>

        <p className="mt-6 text-lg md:text-xl uppercase tracking-wide text-black">
          Maîtrisez les mécaniques jour/nuit, adaptez votre stratégie en temps réel,
          utilisez intelligemment votre onde lumineuse et prenez l'avantage sur
          votre rival. Chaque décision compte : chemin rapide ou sécurisé, attaque
          ou défense, contrôle ou risque.
        </p>
      </div>

      {/* Bouton personnalisé */}
      <div className="mt-14 flex justify-end">
        <ButtonSavoir
          text="En savoir plus"
          href="#presentation"
        />
      </div>
    </section>
  );
}

