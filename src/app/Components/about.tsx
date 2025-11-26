"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Variants } from 'framer-motion';
import Image from 'next/image';

// Dynamically import icons to reduce bundle size
const IoCodeSlashOutline = dynamic(() => import('react-icons/io5').then(mod => mod.IoCodeSlashOutline), { ssr: false });
const IoBarChartOutline = dynamic(() => import('react-icons/io5').then(mod => mod.IoBarChartOutline), { ssr: false });
const IoLayersOutline = dynamic(() => import('react-icons/io5').then(mod => mod.IoLayersOutline), { ssr: false });
const IoRocketOutline = dynamic(() => import('react-icons/io5').then(mod => mod.IoRocketOutline), { ssr: false });
const IoPhonePortraitOutline = dynamic(() => import('react-icons/io5').then(mod => mod.IoPhonePortraitOutline), { ssr: false });
const IoSearchOutline = dynamic(() => import('react-icons/io5').then(mod => mod.IoSearchOutline), { ssr: false });

// Animation variants with slower transitions
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    } 
  }
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 1,
      ease: "easeOut"
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

 const services = [
  {
    icon: IoLayersOutline,
    title: "Educational Equipment",
    description: "Premium laboratory equipment for engineering colleges and technical schools, featuring digital oscilloscopes and electronic workbenches."
  },
  {
    icon: IoBarChartOutline,
    title: "Testing & Measurement Equipment", 
    description: "Professional-grade testing and measurement instruments for precise analysis, including oscilloscopes, multimeters, and signal generators."
  },
  {
    icon: IoCodeSlashOutline,
    title: "Web Design & Development",
    description: "Custom website creation, e-commerce solutions, and mobile-responsive designs that convert visitors into customers."
  },
  {
    icon: IoRocketOutline,
    title: "Digital Marketing",
    description: "Comprehensive digital marketing strategies, including social media management, content marketing, and targeted advertising campaigns to boost your brand presence."
  },
  {
    icon: IoSearchOutline,
    title: "SEO Optimization",
    description: "Advanced search engine optimization services to improve your website's visibility, organic traffic, and search rankings across all major search engines."
  },
  {
    icon: IoPhonePortraitOutline,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android, featuring intuitive user interfaces and seamless performance."
  }
];
  const faqs = [
    {
      question: "What types of educational equipment do you offer?",
      answer: "We provide a wide range of equipment including digital oscilloscopes, electronic workbenches, and specialized laboratory instruments designed for engineering and technical education."
    },
    {
      question: "What testing and measurement equipment do you offer?",
      answer: "We offer professional-grade testing and measurement instruments including oscilloscopes, multimeters, electronic workbenches, and signal generators for precise analysis and testing needs."
    },
    {
      question: "Do you offer electronics manufacturing services?",
      answer: "Yes, we provide Surface Mount Technology (SMT) assembly, through-hole assembly, testing & quality assurance, and custom enclosure manufacturing services with high precision and quality standards."
    },
    {
      question: "What digital services do you specialize in?",
      answer: "Our digital services include custom web development, e-commerce solutions, digital marketing strategies, and comprehensive SEO optimization to enhance your online presence."
    },
    {
      question: "Do you provide installation and training services?",
      answer: "Yes, we offer comprehensive installation services and hands-on training to ensure your team can effectively utilize all equipment and solutions we provide."
    },
    {
      question: "How can I contact your support team?",
      answer: "You can reach us through email at info@lovosis.in or lovosist@gmail.com, call us at +91 7012970281 or +91 9747745544, or visit our office in Bengaluru, Karnataka."
    }
  ];

  const educationalEquipment = [
    {
      title: "Digital Oscilloscopes",
      description: "High-precision tools for visualizing waveforms and examining electrical circuits in real-time"
    },
    {
      title: "Engineering Workbenches",
      description: "State-of-the-art workbenches equipped with latest tools for electronic and electrical experiments"
    },
    {
      title: "Education & Training Kits",
      description: "Comprehensive educational kits designed for hands-on learning in electronics and electrical engineering"
    }
  ];

 

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Hero Banner Section - Fixed */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="About Lovosis Technology"
      >
        {/* Banner Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Primary banner image */}
          <div className="absolute inset-0">
            <Image
              src="/banner/About.png"
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
              className="text-white"
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
                className="text-4xl sm:text-5xl lg:text-6xl font-light mb-8 leading-tight"
              >
                About <span className="text-cyan-600 drop-shadow-lg">Lovosis</span>
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
                className="text-lg sm:text-xl lg:text-2xl text-gray-100 mb-8 leading-relaxed max-w-2xl drop-shadow-md"
              >
                Innovators, partners and clients putting technology to work in the real world through educational excellence and digital transformation.
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

      {/* Who We Are Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={fadeIn}
        viewport={{ once: true, margin: "-100px" }}
        className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100"
        aria-labelledby="who-we-are-heading"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            className="mb-8"
          >
            <span className="text-sm font-medium text-cyan-600 uppercase tracking-wider">
              WHO WE ARE
            </span>
          </motion.div>
          <h1 
            id="who-we-are-heading"
            className="text-2xl md:text-5xl lg:text-2xl font-light text-gray-900 mb-8 leading-tight"
          >
            Building greater futures through innovation and collective knowledge.
          </h1>
          <motion.div 
            variants={fadeInUp}
            className="max-w-4xl mb-12"
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Lovosis Technology Private Limited is a digital transformation and technology partner of choice for educational institutions and businesses worldwide. Since our inception, we have upheld the highest standards of innovation, engineering excellence and customer service.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We are focused on creating long-term value for our clients, partners, employees, and the community at large. With expertise spanning educational equipment, testing & measurement instruments, web development, and digital marketing, we have built lasting partnerships with institutions across Karnataka and beyond.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our comprehensive solutions range from state-of-the-art laboratory equipment for engineering colleges to cutting-edge digital marketing strategies for businesses, helping organizations emerge as perpetually adaptive enterprises in todays technology-driven world.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true, margin: "-100px" }}
        className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="mission-vision-heading"
      >
        <div className="max-w-6xl mx-auto">
          <h2 id="mission-vision-heading" className="sr-only">Our Mission and Vision</h2>
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl font-light text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To empower educational institutions and businesses with state-of-the-art technology solutions that drive innovation, enhance learning experiences, and accelerate digital transformation.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl font-light text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To become the premier provider of innovative educational equipment and digital solutions, revolutionizing the way institutions teach and businesses operate in the digital era.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true, margin: "-100px" }}
        className="bg-white py-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="services-heading"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="mb-12">
            <span className="text-sm font-medium text-cyan-600 uppercase tracking-wider">
              OUR SERVICES
            </span>
            <h2 id="services-heading" className="text-2xl font-light text-gray-900 mt-2 mb-4">
              Comprehensive Technology Solutions
            </h2>
            <p className="text-gray-700 max-w-3xl">
              We deliver outstanding results across diverse domains, synergizing innovation with expertise to meet the evolving needs of educational institutions and businesses.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            role="list"
          >
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="border border-gray-100 p-8 hover:shadow-sm transition-all duration-300 rounded-lg group"
                role="listitem"
              >
                <service.icon className="w-8 h-8 text-cyan-600 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Educational Equipment Section */}
     

      {/* Digital Solutions Section */}
     

      {/* FAQ Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={fadeIn}
        viewport={{ once: true, margin: "-100px" }}
        className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            className="mb-12"
          >
            <span className="text-sm font-medium text-cyan-600 uppercase tracking-wider">
              SUPPORT
            </span>
            <h2 id="faq-heading" className="text-2xl font-light text-gray-900 mt-2 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="space-y-1"
          >
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="bg-white border border-gray-100 rounded-lg overflow-hidden"
              >
                <motion.button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  initial={false}
                  animate={{
                    backgroundColor: openFaq === index ? '#f9fafb' : '#ffffff'
                  }}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-${index}`}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <motion.span 
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-gray-600"
                    aria-hidden="true"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.span>
                </motion.button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                      id={`faq-${index}`}
                      role="region"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;