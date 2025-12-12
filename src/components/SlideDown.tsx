"use client";

import React, { useEffect, useRef, ReactNode, useCallback, useState } from 'react';
import { gsap } from 'gsap';

interface SlideDownProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  triggerId?: string;
}

const SlideDown: React.FC<SlideDownProps> = ({
  children,
  delay = 0,
  className = '',
  triggerId = 'scores',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const playAnimation = useCallback(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    setHasAnimated(true);
    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: -50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power3.out',
      }
    );
  }, [delay, hasAnimated]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver pour détecter le scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playAnimation();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    const handleHashChange = () => {
      if (window.location.hash === `#${triggerId}`) {
        playAnimation();
      }
    };

    // Jouer l'animation si on arrive directement sur le hash
    if (window.location.hash === `#${triggerId}`) {
      playAnimation();
    }

    window.addEventListener('hashchange', handleHashChange);

    // Écouter les clics sur les liens du header
    const links = document.querySelectorAll(`a[href="#${triggerId}"]`);
    links.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(playAnimation, 100);
      });
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [triggerId, playAnimation]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

export default SlideDown;
