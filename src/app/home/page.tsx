"use client";
import React from 'react';
import { Roboto, Russo_One } from "next/font/google";
import AnunciosCarousel from "../../components/ui/AnuncioCarousel";
import { FaEnvelope, FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Footer from "../../components/ui/Footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const russoOne = Russo_One({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  // Definir variantes para la animación de iconos
  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (custom) => ({
      opacity: 1, 
      scale: 1,
      transition: {
        delay: custom * 0.2,
        duration: 0.5
      }
    })
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header>
      <AnunciosCarousel
  images={[
    "/images/inkober_2024_02_Vegeta_01.png",
    "/images/pedos_Faye_Valentine.png",
    "/images/Uzumaki_practica_01_color.png",
    "/images/nubes_naranjas.png",
  ]}
/>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center p-4">
        <motion.div
          className="w-full max-w-md space-y-16 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col items-center space-y-8">
            <motion.h1
              className={`${russoOne.className} text-[#F4A261] text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center`}
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
            >
              CANCHA <br /> LIBRE
            </motion.h1>
            <motion.button
  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-10 rounded-lg text-2xl"
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.5 }}
  onClick={() => (window.location.href = "/reservas")}
>
  RESERVA AHORA
</motion.button>
            <p className={`${roboto.className} text-gray-600 text-base text-center`}>
              ¡Reserva una cancha hasta con dos días de antelación!
            </p>
            
            {/* Nueva sección de iconos con etiquetas usando grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full">
              <motion.div 
                custom={1}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center"
              >
                <div className="text-xl text-gray-400 hover:text-gray-600 cursor-pointer mb-1 w-8 h-8 flex items-center justify-center">
                  <FaEnvelope />
                </div>
                <p className={`${roboto.className} text-xs text-gray-500 text-center w-full`}>
                  Contáctanos
                </p>
              </motion.div>
              <motion.div 
                custom={2}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center"
              >
                <div className="text-xl text-gray-400 hover:text-gray-600 cursor-pointer mb-1 w-8 h-8 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPersonRunning} />
                </div>
                <p className={`${roboto.className} text-xs text-gray-500 text-center w-full`}>
                  Mis Actividades
                </p>
              </motion.div>
              <motion.div 
                custom={3}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center"
              >
                <div className="text-xl text-gray-400 hover:text-gray-600 cursor-pointer mb-1 w-8 h-8 flex items-center justify-center">
                  <FaCalendarAlt />
                </div>
                <p className={`${roboto.className} text-xs text-gray-500 text-center w-full`}>
                  Mis Reservas
                </p>
              </motion.div>
              <motion.div 
                custom={4}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center"
              >
                <div className="text-xl text-gray-400 hover:text-gray-600 cursor-pointer mb-1 w-8 h-8 flex items-center justify-center">
                  <FaUserCircle />
                </div>
                <p className={`${roboto.className} text-xs text-gray-500 text-center w-full`}>
                  Mi Perfil
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}