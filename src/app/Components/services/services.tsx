"use client";
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Monitor, CircuitBoard, Smartphone, Search, ArrowRight } from 'lucide-react';
import { motion, useAnimation, useInView, Variants } from 'framer-motion';

const ServicesPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Responsive Banner Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Our Services"
      >
        {/* Banner Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Primary banner image */}
          <div className="absolute inset-0">
            <Image
              src="/banner/Services.png"
              alt="Lovosis Technology Banner"
              fill
              className="object-cover object-center"
              priority
              quality={90}
              sizes="100vw"
            />
          </div>
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-cyan-900/60"></div>
        </div>
    
        {/* Animated background elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-10"
        >
          {/* Tech grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
            aria-hidden="true"
          />
        </motion.div>
        
        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.3,
                    delayChildren: 0.4,
                    ease: "easeOut",
                    duration: 0.8
                  }
                }
              }}
              className="text-white px-4 sm:px-0 text-center lg:text-left"
            >
              <motion.h1 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }
                }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 md:mb-8 leading-tight"
              >
                Professional <span className="text-cyan-600 drop-shadow-lg">Services</span>
              </motion.h1>
              
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }
                }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-md"
              >
                Transforming ideas into reality with cutting-edge technology solutions.
              </motion.p>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-sm text-gray-200 mb-2 drop-shadow-md">Scroll down</span>
            <svg className="w-6 h-6 text-gray-200 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <motion.section 
        id="services"
        className="py-12 md:py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInVariants}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-8 md:mb-12 lg:mb-16"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.span 
                className="inline-block px-3 py-1 md:px-4 md:py-2 bg-cyan-100 text-cyan-800 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4 uppercase tracking-wider"
                variants={itemVariants}
              >
                Our Expertise
              </motion.span>
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 md:mb-4"
                variants={itemVariants}
              >
                Our <span className="bg-gradient-to-r from-cyan-600 to-cyan-600 bg-clip-text text-transparent">Services</span>
              </motion.h2>
              <motion.p 
                className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                Delivering excellence through comprehensive technology solutions
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid gap-6 md:gap-8 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* IT Services Card */}
              <motion.div 
                className="bg-white rounded-lg shadow-none overflow-hidden border border-gray-100 md:border-none"
                variants={cardVariants}
              >
                <div className="flex flex-col">
                  <div className="w-full flex items-center justify-center p-4 md:p-8">
                    <div className="w-full h-48 md:h-64 relative rounded-xl overflow-hidden">
                      <Image
                        src="/cataegories/IT.jpg"
                        alt="Software Development"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 md:p-6">
                    <motion.h3 
                      className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4"
                      variants={itemVariants}
                    >
                      IT Services
                    </motion.h3>
                    
                    <motion.div 
                      className="space-y-2 md:space-y-3 mb-3 md:mb-4"
                      variants={containerVariants}
                    >
                      <motion.div className="flex flex-col md:flex-row md:items-start" variants={itemVariants}>
                        <span className="font-medium text-gray-600 text-xs md:text-sm mb-1 md:mb-0 md:w-24">Focus :</span>
                        <span className="text-gray-800 text-sm md:text-base">Custom Software Development</span>
                      </motion.div>
                      
                      <motion.div className="flex flex-col md:flex-row md:items-start" variants={itemVariants}>
                        <span className="font-medium text-gray-600 text-xs md:text-sm mb-1 md:mb-0 md:w-24">Technologies :</span>
                        <span className="text-gray-800 text-sm md:text-base">React, Node.js, Python, Flutter</span>
                      </motion.div>
                      
                      <motion.div className="flex flex-col md:flex-row md:items-start" variants={itemVariants}>
                        <span className="font-medium text-gray-600 text-xs md:text-sm mb-1 md:mb-0 md:w-24">Delivery :</span>
                        <span className="text-gray-800 text-sm md:text-base">Agile Methodology</span>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col"
                      variants={itemVariants}
                    >
                      <p className="text-gray-700 leading-relaxed text-xs md:text-sm mb-3 md:mb-4">
                        Full-stack software development for custom applications, including enterprise solutions, 
                        mobile apps, and embedded systems with user-friendly interfaces.
                      </p>
                      <a 
                        href="/services/it-services"
                        className="text-cyan-600 hover:text-cyan-800 text-xs md:text-sm font-semibold transition-colors inline-flex items-center group"
                      >
                        Learn More
                        <motion.span 
                          className="inline-block"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </motion.span>
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.hr 
                className="my-6 md:my-8 border-gray-200"
                variants={fadeInVariants}
              />

              {/* Electronics Manufacturing Card */}
              <motion.div 
                className="bg-white rounded-lg shadow-none overflow-hidden border border-gray-100 md:border-none"
                variants={cardVariants}
              >
                <div className="flex flex-col">
                  <div className="w-full flex items-center justify-center p-4 md:p-8">
                    <div className="w-full h-48 md:h-64 relative rounded-xl overflow-hidden">
                      <Image
                        src="/cataegories/Electronics.jpg"
                        alt="Electronics Manufacturing"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 md:p-6">
                    <motion.h3 
                      className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4"
                      variants={itemVariants}
                    >
                      Electronics Manufacturing
                    </motion.h3>
                    
                    <motion.div 
                      className="space-y-2 md:space-y-3 mb-3 md:mb-4"
                      variants={containerVariants}
                    >
                      <motion.div className="flex flex-col md:flex-row md:items-start" variants={itemVariants}>
                        <span className="font-medium text-gray-600 text-xs md:text-sm mb-1 md:mb-0 md:w-32">Services :</span>
                        <span className="text-gray-800 text-sm md:text-base">PCB Design & Production</span>
                      </motion.div>
                      
                      <motion.div className="flex flex-col md:flex-row md:items-start" variants={itemVariants}>
                        <span className="font-medium text-gray-600 text-xs md:text-sm mb-1 md:mb-0 md:w-32">Capabilities :</span>
                        <span className="text-gray-800 text-sm md:text-base">SMT Assembly, Testing</span>
                      </motion.div>
                      
                      <motion.div className="flex flex-col md:flex-row md:items-start" variants={itemVariants}>
                        <span className="font-medium text-gray-600 text-xs md:text-sm mb-1 md:mb-0 md:w-32">Standards :</span>
                        <span className="text-gray-800 text-sm md:text-base">ISO 9001 Certified</span>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col"
                      variants={itemVariants}
                    >
                      <p className="text-gray-700 leading-relaxed text-xs md:text-sm mb-3 md:mb-4">
                        Precision PCB design, prototyping, and full-scale production. 
                        Custom electronic solutions with rigorous quality control for reliable performance.
                      </p>
                      <a 
                        href="/services/electronics-manufacturing"
                        className="text-cyan-600 hover:text-cyan-800 text-xs md:text-sm font-semibold transition-colors inline-flex items-center group"
                      >
                        Learn More
                        <motion.span 
                          className="inline-block"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </motion.span>
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonial Section */}
      
    </div>
  );
};

export default ServicesPage;