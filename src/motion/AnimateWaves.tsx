'use client'

import { motion } from "framer-motion"

export default function AnimatedWaves() {
  return (
    <div className="relative w-full h-32 overflow-hidden">
      {/* Floating circle */}
      <motion.div
        className="absolute w-8 h-8 bg-[#F4A261] rounded-full"
        style={{ left: '50%', top: '10%' }}
        animate={{
          y: [0, -10, 0],
          x: [-5, 5, -5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Waves */}
      <div className="absolute bottom-0 w-full">
        {/* Back wave */}
        <motion.div
          className="absolute bottom-0 w-full h-32 bg-[#F4A261]/20 rounded-t-full"
          animate={{
            translateY: [16, 14, 16],
            scaleX: [1, 1.02, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Middle wave */}
        <motion.div
          className="absolute bottom-0 w-full h-32 bg-[#F4A261]/30 rounded-t-full"
          animate={{
            translateY: [12, 8, 12],
            scaleX: [1.02, 1, 1.02]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        />

        {/* Front wave */}
        <motion.div
          className="absolute bottom-0 w-full h-32 bg-[#F4A261]/40 rounded-t-full"
          animate={{
            translateY: [8, 4, 8],
            scaleX: [1, 1.03, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4
          }}
        />
      </div>
    </div>
  )
}

