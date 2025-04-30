import { useWordRotation } from '../../hooks/useWordRotation';
import { motion, AnimatePresence } from 'framer-motion';
import { wordAnimation } from './animation';
import { Suspense, lazy } from 'react';
import background from '@/assets/background.png';

const Carousel = lazy(() => import('../carousel').then(mod => ({ default: mod.Carousel })));

export function Hero() {
  const rotatingWords = [
    'mais produtiva',
    'mais segura',
    'mais confiável',
    'mais inovadora',
    'mais colaborativa',
  ];

  const currentWord = useWordRotation(rotatingWords);

  return (
    <section
      className="flex flex-col justify-center items-center bg-cover bg-no-repeat w-full mt-6 overflow-hidden"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex flex-col items-center gap-4 w-full max-w-[938px]">
        <h1 className="text-4xl lg:text-6xl text-center">
          Juntos por uma indústria <br />
          <span className="text-primary inline-block">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWord}
                variants={wordAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {currentWord}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>
        <p className="text-lg md:text-xl text-center">
          Esse manifesto é a consolidação da nossa missão de impactar positivamente o mercado de
          soluções para indústria com produtos de qualidade e conexão de ponta a ponta.
        </p>
      </div>
      <Suspense fallback={
        <div className="w-full h-[540px] lg:pt-36 bg-gray-100 animate-pulse" />
      }>
        <Carousel />
      </Suspense>
    </section>
  );
}
