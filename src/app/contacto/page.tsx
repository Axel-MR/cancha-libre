"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Russo_One } from 'next/font/google';
import CanchaLibreLogo from '../../images/CanchaLibre_logo.png';
import Footer from '@/components/ui/Footer';
import AnunciosCarousel from '@/components/ui/AnuncioCarousel';

const russoOne = Russo_One({ weight: '400', subsets: ['latin'] });

const Contacto = () => {
  return (
    <div className="flex flex-col min-h-screen">
     <AnunciosCarousel
  images={[
    "/images/inkober_2024_02_Vegeta_01.png",
    "/images/pedos_Faye_Valentine.png",
    "/images/Uzumaki_practica_01_color.png",
    "/images/nubes_naranjas.png",
  ]}
/>
      <main className="flex-grow relative bg-white overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <Image
            src={CanchaLibreLogo}
            alt="Cancha Libre Logo"
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            className="opacity-20" // Ajusta la opacidad para mejorar la legibilidad
          />
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-full p-6 text-center">
          <motion.h1
            className={`${russoOne.className} text-[#F4A261] text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight`}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 1 }}
          >
            ¡Contáctanos!
          </motion.h1>

          <p className="mt-4 text-lg md:text-xl text-black">
            Si tienes alguna duda o sugerencia, no dudes en escribirnos.
          </p>

          <div className="mt-8 text-black">
            <p className="text-xl">Dudas y sugerencias:</p>
            <p className="mt-2 text-lg sm:text-xl">
              <a href="mailto:canchalibre@gmail.com" className="hover:underline">
                canchalibre@gmail.com
              </a>
            </p>
            <p className="mt-2 text-lg sm:text-xl">Teléfono: 4431231234</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contacto;

