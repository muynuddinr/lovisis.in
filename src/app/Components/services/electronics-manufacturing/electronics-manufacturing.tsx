"use client";

import {
  IoCheckmarkCircleOutline,
  IoCodeSlash,
  IoMegaphone,
  IoDesktop,
  IoAnalytics,
  IoCloudDone,
  IoColorPalette,
  IoSettings,
  IoLogoWordpress,
} from "react-icons/io5";
import { SiShopify } from "react-icons/si";
import { PiStudentBold, PiRulerBold } from "react-icons/pi";
import {
  MdOutlineMemory,
  MdOutlinePrecisionManufacturing,
} from "react-icons/md";
import { TbTestPipe } from "react-icons/tb";
import { BsBox } from "react-icons/bs";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";

// Animation variants
const bannerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.4,
      duration: 0.8
    }
  }
};

const bannerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
};

const servicesContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const serviceCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
};

const services = [
  {
    title: "Educational Equipment Manufacturing",
    description: "Production of high-quality educational tools and devices for enhanced learning experiences.",
    icon: PiStudentBold,
    features: [
      "Interactive learning solutions",
      "Durable educational tools",
      "Customizable designs",
      "Solutions for all education levels"
    ]
  },
  {
    title: "Testing & Measuring Instruments",
    description: "Development of precision testing and measuring tools for various applications.",
    icon: PiRulerBold,
    features: [
      "High-precision instruments",
      "Electrical testing tools",
      "Mechanical measurement devices",
      "Physical property analyzers"
    ]
  },
  {
    title: "Surface Mount Technology (SMT)",
    description: "State-of-the-art SMT assembly with high-precision component placement.",
    icon: MdOutlineMemory,
    features: [
      "High-density board assembly",
      "Automated optical inspection",
      "Lead-free soldering options",
      "Multi-layer PCB capability"
    ]
  },
  {
    title: "Through-hole Assembly",
    description: "Traditional through-hole assembly for specialized electronic components.",
    icon: MdOutlinePrecisionManufacturing,
    features: [
      "Manual and automated assembly",
      "Mixed technology boards",
      "Custom component fitting",
      "High reliability connections"
    ]
  },
  {
    title: "Testing & Quality Assurance",
    description: "Comprehensive testing and quality control procedures.",
    icon: TbTestPipe,
    features: [
      "Functional testing",
      "Environmental stress screening",
      "X-ray inspection",
      "Thermal testing"
    ]
  },
  {
    title: "Custom Enclosures",
    description: "Specialized enclosure design and manufacturing for electronic equipment.",
    icon: BsBox,
    features: [
      "Custom design solutions",
      "Protection for sensitive equipment",
      "Various material options",
      "Environmental protection"
    ]
  }
];

const portfolioProjects = [
  {
    title: "Refrigerator Trainer Kit",
    category: "Educational Equipment",
    image: "/images/services/portfolio/Refiginator.jpg",
    description: "A comprehensive training system designed for technical education, allowing students to study refrigeration systems hands-on. This kit includes all components of a real refrigerator system with transparent panels for visibility, measurement points for diagnostics, and fault simulation capabilities for troubleshooting practice.",
    technologies: ["Precision Engineering", "Educational Design", "Durable Materials"]
  },
  {
    title: "Precision Rectifier Unit",
    category: "Testing Equipment",
    image: "/images/services/portfolio/Rectifier.jpg",
    description: "Industrial-grade rectifier unit designed for accurate AC to DC conversion in laboratory and production environments. Features adjustable output voltage, current limiting protection, and high efficiency conversion suitable for sensitive electronic testing applications.",
    technologies: ["High-precision Components", "Thermal Management", "Safety Certified"]
  },
  {
    title: "Dual DC Power Supply System",
    category: "Laboratory Equipment",
    image: "/images/services/portfolio/Power.jpg",
    description: "Versatile dual-channel DC power supply with independent voltage and current control for each channel. Ideal for electronics laboratories, featuring digital displays, overload protection, and series/parallel operation modes for flexible power delivery.",
    technologies: ["Regulated Output", "Digital Control", "Compact Design"]
  },
  {
    title: "Smart Electronics Workbench",
    category: "Educational Furniture",
    image: "/images/services/portfolio/Bench.jpg",
    description: "Integrated workstation designed for electronics engineering education, combining durable work surface with built-in power supplies, measurement instruments, and component storage. The ergonomic design promotes safe and efficient learning environments.",
    technologies: ["Modular Design", "Safety Features", "Integrated Power"]
  },
  {
    title: "DT-7244A Measurement Device",
    category: "Testing Instruments",
    image: "/images/services/portfolio/DT-7244A.jpg",
    description: "Advanced digital measurement instrument for electrical engineering applications. Capable of precise voltage, current, and resistance measurements with data logging capabilities and computer interface for laboratory analysis.",
    technologies: ["High Accuracy", "Data Logging", "Industrial Standards"]
  }
];

export default function ElectronicsManufacturing() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            <Image
              src="/banner/Banner.jpg"
              alt="Electronics Manufacturing Banner"
              fill
              className="object-cover object-center"
              priority
              quality={90}
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-cyan-900/60"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-10"
        >
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </motion.div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={bannerVariants}
              className="text-white px-4 sm:px-0 text-center lg:text-left"
            >
              <motion.h1 
                variants={bannerItemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-light mb-4 sm:mb-8 leading-tight"
              >
                Electronics <span className="text-cyan-600 drop-shadow-lg">Manufacturing</span>
              </motion.h1>
              
              <motion.p 
                variants={bannerItemVariants}
                className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                Cutting-edge electronics manufacturing solutions with precision engineering and quality assurance
              </motion.p>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-sm text-gray-200 mb-2">Scroll down</span>
            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3 sm:mb-4">
              Our Electronics <span className="text-cyan-600 ml-2">Services</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base">
              Comprehensive electronics manufacturing solutions tailored to your business needs
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            variants={servicesContainerVariants}
            viewport={{ once: true, margin: "-50px" }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={serviceCardVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                }}
                className="bg-gray-50 shadow-md hover:shadow-lg p-4 sm:p-6 transition-all duration-300 rounded-lg"
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="flex flex-col items-center text-center gap-3 mb-4">
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-black">
                    {service.title}
                  </h3>
                </div>

                <p className="text-gray-700 mb-4 text-xs sm:text-sm leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-1 sm:space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: hoveredService === index ? 1 : 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2 text-gray-700 hover:text-black transition-colors duration-200 text-xs sm:text-sm"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-white">
        <div className="mb-12 sm:mb-20 rounded-2xl bg-gray-50 p-4 sm:p-8 md:p-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-800 md:leading-tight mb-3 sm:mb-4"
          >
            What We've <span className="text-cyan-500">Built</span>
          </motion.h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
            Take a glimpse into our innovative solutions and standout results across recent projects.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {portfolioProjects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card cursor-pointer rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl lg:sticky lg:top-32"
            >
              <div className="card__content grid grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 md:gap-6">
                <div className="order-2 md:order-1">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-2 sm:mb-3">
                    {project.title}
                  </h2>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Category:</span>
                      <span className="text-gray-700 text-sm sm:text-base">{project.category}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Technologies:</span>
                      <span className="text-gray-800 text-sm sm:text-base">{project.technologies.join(', ')}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Status:</span>
                      <span className="text-green-600 font-medium text-sm sm:text-base">Completed</span>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="order-1 md:order-2 self-center">
                  <figure className="h-48 sm:h-64 w-full overflow-hidden rounded-lg">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </figure>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}