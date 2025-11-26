"use client"
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import img1 from "../../../public/images/home/1.jpg";
import img2 from "../../../public/images/home/2.jpg";
import img3 from "../../../public/images/home/3.jpg";
import img4 from "../../../public/images/home/4.jpg";
import Services from './Service';
import Why from './Why';
import Testimony from './Testimony';
import Service from './Service'; 
import Below from './Below';

const sliderData = [
  {
    url: img1.src,
    alt: "Educational",
    alt2: "Equipment",
    description: "State-of-the-art educational equipment for modern learning environments. Empowering students with hands-on experience."
  },
  {
    url: img2.src,
    alt: "Testing & Measuring",
    alt2: "Equipment",
    description: "Precision testing and measuring equipment for accurate results. Industry-standard tools for professional applications."
  },
  {
    url: img3.src,
    alt: "Software",
    alt2: "Solutions",
    description: "Innovative software solutions to streamline your operations. Custom development for your unique needs."
  },
  {
    url: img4.src,
    alt: "Digital Marketing",
    alt2: "& SEO",
    description: "Comprehensive digital marketing strategies and SEO services to boost your online presence and drive business growth."
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % sliderData.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative h-screen w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0">
          <AnimatePresence mode='wait'>
            {sliderData.map((slide, index) => (
              currentSlide === index && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={slide.url}
                    alt={`${slide.alt} ${slide.alt2}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    quality={100}
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  
                  <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="max-w-3xl"
                      >
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                          {slide.alt} <span className="text-cyan-600">{slide.alt2}</span>
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                          {slide.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          

          {/* Slide Indicators - Only show on hover with improved design */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3"
              >
                {sliderData.map((_, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentSlide(index)}
                    className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' 
                        : 'bg-white/40 hover:bg-white/70 backdrop-blur-sm'
                    }`}
                  >
                    {currentSlide === index && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 rounded-full border-2 border-white/60"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <Below/>
      <Why/>
      <Service/>
      <Testimony/>
    </div>
  );
}
