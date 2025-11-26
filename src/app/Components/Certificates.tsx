"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Certificate {
  id: number;
  title: string;
  description: string;
  image: string;
  issuer?: string;
  date?: string;
  validUntil?: string;
}

const Certificates: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [hoveredCertificate, setHoveredCertificate] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    const fetchTimer = setTimeout(() => setIsFetching(false), 1500);
    const loadTimer = setTimeout(() => setIsLoading(false), 300);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      clearTimeout(fetchTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  const bannerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.4,
        ease: "easeOut",
        duration: 0.8,
      },
    },
  };

  const bannerItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const certificates: Certificate[] = [
    {
      id: 1,
      title: "Company Recognition Certificate",
      description: "CERTIFICATE OF RECOGNITION - Awarded for outstanding contribution to industry excellence and innovation in technology solutions.",
      image: "/certificates/certificate (6).webp",
    },
    {
      id: 2,
      title: "Karnataka Startup Certificate",
      description: "Recognized by the Karnataka Startup Cell under the Karnataka Startup Policy for innovative technology solutions and entrepreneurial excellence.",
      image: "/certificates/certificate (3).jpg",
    },
    {
      id: 3,
      title: "IEC 61058-1 Compliance",
      description: "Complies with IEC 61058-1 international standard for safety requirements of switch components for appliances, ensuring product reliability and safety.",
      image: "/certificates/cerficiate.jpg",
    },
    {
      id: 4,
      title: "IEC 61010-1 Compliance",
      description: "Complies with IEC 61010-1 international standard for safety requirements of electrical equipment for measurement, control, and laboratory use.",
      image: "/certificates/certificate2.jpg",
    },
    {
      id: 5,
      title: "ISO 45001:2018 Certificate",
      description: "ISO 45001:2018 Occupational Health & Safety Management Systems - Demonstrating our commitment to workplace safety and employee wellbeing.",
      image: "/certificates/certificate3.webp",
    },
    {
      id: 6,
      title: "ISO 14001:2015 Certificate",
      description: "ISO 14001:2015 Environmental Management Systems - Certified for environmental responsibility and sustainable business practices.",
      image: "/certificates/certificate4.webp",
    },
    {
      id: 7,
      title: "ISO 9001:2015 Certificate",
      description: "ISO 9001:2015 Quality Management Systems - Certified for maintaining the highest standards of quality in our products and services.",
      image: "/certificates/certificate5.webp",
      issuer: "International Organization for Standardization",
      date: "2023",
      validUntil: "3 Years"
    },
    {
      id: 8,
      title: "GMP Certificate",
      description: "GMP (Good Manufacturing Practice) - Certified for following international manufacturing standards and quality control processes.",
      image: "/certificates/certificate6.webp",
      issuer: "Good Manufacturing Practice Authority",
      date: "2024",
      validUntil: "2 Years"
    },
    {
      id: 9,
      title: "Certificate of Compliance",
      description: "CERTIFICATE Of Compliance - Verified compliance with industry regulations and standards for operational excellence.",
      image: "/certificates/certificate7.webp",
      issuer: "Regulatory Compliance Board",
      date: "2024",
      validUntil: "1 Year"
    },
  ];

  const openModal = (certificate: Certificate): void => {
    document.body.style.overflow = "hidden";
    setSelectedCertificate(certificate);
  };

  const closeModal = (): void => {
    document.body.style.overflow = "auto";
    setSelectedCertificate(null);
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const loadingItem: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
      },
    },
    exit: { opacity: 0, scale: 0.95 },
  };

  const hoverCardVariants: Variants = {
    initial: { y: 0 },
    hover: { y: -10 },
  };

  const hoverContentVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    hover: { opacity: 1, y: 0 },
  };

  const handleCardClick = (certificate: Certificate) => (): void => {
    openModal(certificate);
  };

  const handleMouseEnter = (certificateId: number) => (): void => {
    if (!isMobile) {
      setHoveredCertificate(certificateId);
    }
  };

  const handleMouseLeave = (): void => {
    if (!isMobile) {
      setHoveredCertificate(null);
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  return (
    <>
      <Head>
        <title>Certifications & Compliance - Lovosis Technologies Pvt Ltd</title>
        <meta
          name="description"
          content="Industry-leading certifications demonstrating our commitment to quality, safety, and regulatory compliance across all operations."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero Banner */}
       <section 
              className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
              aria-label="Our Services"
            >
              {/* Banner Background with Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                {/* Primary banner image */}
                <div className="absolute inset-0">
                  <Image
                    src="/banner/Certificate.jpg"
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
                      Our <span className="text-cyan-600 drop-shadow-lg">Certificates</span>
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
                     For excellence in tech-driven idea transformation.
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

      {/* Certificates Grid */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isFetching ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={loadingItem}
                  className="h-60 sm:h-72 md:h-80 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden"
                >
                  <div className="h-full flex flex-col">
                    <div className="flex-1 bg-slate-200 animate-pulse"></div>
                    <div className="p-4 sm:p-6">
                      <div className="h-5 sm:h-6 w-3/4 bg-slate-200 rounded mb-3 sm:mb-4 animate-pulse"></div>
                      <div className="h-3 sm:h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-60 sm:h-72 md:h-80 bg-slate-100 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <>
              <motion.h2
                initial="hidden"
                animate="visible"
                variants={titleVariants}
                className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 sm:mb-12 text-center"
              >
                Our <span className="text-cyan-600">Accreditations</span>
              </motion.h2>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
              >
                {certificates.map((certificate) => (
                  <motion.div
                    key={certificate.id}
                    variants={item}
                    className="group relative bg-white rounded-lg sm:rounded-xl border border-slate-200 hover:border-cyan-200 shadow-sm hover:shadow-md sm:hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={handleCardClick(certificate)}
                    onMouseEnter={handleMouseEnter(certificate.id)}
                    onMouseLeave={handleMouseLeave}
                    initial="initial"
                    whileHover={isMobile ? undefined : "hover"}
                  >
                    <motion.div
                      variants={hoverCardVariants}
                      className="relative h-48 sm:h-56 md:h-64 bg-slate-50 overflow-hidden"
                    >
                      <Image
                        src={certificate.image}
                        alt={certificate.title}
                        fill
                        className="object-contain p-3 sm:p-4"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </motion.div>

                    <div className="p-4 sm:p-6">
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight tracking-tight line-clamp-2">
                        {certificate.title}
                      </h3>
                    </div>

                    {/* Hover overlay with description - Only shown on non-mobile */}
                    {!isMobile && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/50 flex items-end p-4 sm:p-6 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: hoveredCertificate === certificate.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          variants={hoverContentVariants}
                          className="text-white"
                        >
                          <p className="text-xs sm:text-sm line-clamp-3">
                            {certificate.description}
                          </p>
                          <button className="mt-2 text-xs font-medium text-cyan-600 hover:text-cyan-100 transition-colors">
                            View Details
                          </button>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Modal - Fixed for mobile image display */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={` rounded-xl sm:rounded-2xl w-full max-w-6xl ${
                isMobile ? "h-[90vh]" : "max-h-[90vh] sm:h-[90vh]"
              } overflow-hidden flex flex-col sm:flex-row shadow-2xl relative`}
              onClick={handleModalClick}
            >
              {/* Close Button - Inside Modal */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-1 sm:p-2  hover:bg-gray-50 rounded-full  transition-all duration-200 text-slate-600 hover:text-slate-800"
                aria-label="Close certificate modal"
              >
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Certificate Image - Fixed height for mobile */}
              <div className={`flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6 flex items-center justify-center ${
                isMobile ? "h-[40vh]" : "min-h-0"
              }`}>
                <div className="relative w-full h-full max-w-none bg-white rounded-lg shadow-inner border-2 sm:border-4 border-gray-200 overflow-hidden">
                  <Image
                    src={selectedCertificate.image}
                    alt={selectedCertificate.title}
                    fill
                    className="object-contain p-2 sm:p-4"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Certificate Details */}
              <div className={`w-full sm:w-80 bg-white border-t sm:border-l border-gray-200 flex flex-col ${
                isMobile ? "h-[50vh]" : ""
              }`}>
                {/* Header with Title */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-2 sm:mb-3">
                      Certificate
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold leading-tight text-gray-900">
                      {selectedCertificate.title}
                    </h1>
                  </motion.div>
                </div>

                {/* Description with scrollable content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 p-4 sm:p-6 overflow-y-auto"
                >
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                    {selectedCertificate.description}
                  </p>
                  
                  {/* Additional details if available */}
                 
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Certificates;