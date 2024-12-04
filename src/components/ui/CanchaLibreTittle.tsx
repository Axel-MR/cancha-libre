import React from 'react';
import { motion } from 'framer-motion';
import { Russo_One } from "next/font/google";

// Configuración de la fuente
const russoOne = Russo_One({
  subsets: ["latin"],
  weight: ["400"],
});

const CanchaLibreTittle = () => {
  return (
    <div className="flex flex-col items-center space-y-8">
      <motion.h1
        className={`${russoOne.className} text-[#F4A261] text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center`}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1 }}
      >
        CANCHA <br /> LIBRE
      </motion.h1>
    </div>
  );
};

export default CanchaLibreTittle;
