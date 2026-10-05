import React from 'react';
import { motion } from 'motion/react';

interface AnimatedTitleProps {
  text?: string;
  highlightText?: string;
  subtitle?: string;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  text = "Menumbuhkan Fitrah Santri Cilik yang",
  highlightText = "Beradab, Cerdas & Berjiwa Qur'ani",
  subtitle = "Raudhatul Athfal (RA) Almaqom mengedepankan pendekatan fitrah berbasis sentra, kasih sayang pendidik, dan pengalaman belajar konkret yang menumbuhkan cinta ilmu sejak dini.",
}) => {
  const words = text.split(" ");
  const highlightWords = highlightText.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 18, 
      rotate: -1.5,
      filter: "blur(3px)" 
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 18,
        stiffness: 140,
      },
    },
  };

  return (
    <div className="relative max-w-3xl">
      {/* Title with word-by-word staggered reveal */}
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2C2B2A] tracking-tight leading-[1.18]"
        style={{ textWrap: 'balance' }}
      >
        <span className="inline">
          {words.map((word, index) => (
            <motion.span
              key={`w-${index}`}
              variants={wordVariants}
              className="inline-block mr-[0.28em]"
            >
              {word}
            </motion.span>
          ))}
        </span>

        {/* Highlighted text with soft terracotta and organic hand-drawn underline accent */}
        <span className="relative inline-block text-[#D96B43]">
          {highlightWords.map((word, index) => (
            <motion.span
              key={`hw-${index}`}
              variants={wordVariants}
              className="inline-block mr-[0.26em]"
            >
              {word}
            </motion.span>
          ))}

          {/* Organic Hand-Drawn SVG Brush Underline */}
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
            viewBox="0 0 280 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-3 -mt-1 text-[#5B8266] overflow-visible"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M3 11C60 4 140 3 277 8C200 13 90 14 15 16"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </span>
      </motion.h1>

      {/* Subtitle / Descriptive prose with smooth entrance */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-4 text-base sm:text-lg text-[#55524E] leading-relaxed max-w-2xl font-normal"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};
export default AnimatedTitle;
