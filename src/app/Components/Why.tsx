"use client"
import { motion, Variants } from 'framer-motion';
import { IoRocketOutline, IoLayersOutline, IoCodeSlashOutline, IoBarChartOutline } from 'react-icons/io5';

const features = [
  {
    icon: IoRocketOutline,
    title: "Educational Equipment",
    description: "Cutting-edge laboratory equipment for engineering colleges, polytechnics, and industrial training institutes. Empowering the next generation of innovators.",
    bgGradient: "from-blue-100 to-cyan-100"
  },
  {
    icon: IoLayersOutline,
    title: "Testing & Measurement Equipment",
    description: "Professional-grade testing and measurement instruments for precise analysis, including oscilloscopes, multimeters, electronic workbenches, and signal generators.",
    bgGradient: "from-purple-100 to-pink-100"
  },
  {
    icon: IoCodeSlashOutline,
    title: "Web Design & Development",
    description: "Custom website creation, e-commerce solutions, and mobile-responsive designs that convert visitors into customers.",
    bgGradient: "from-emerald-100 to-cyan-100"
  },
  {
    icon: IoBarChartOutline,
    title: "Digital Marketing & SEO",
    description: "Comprehensive digital marketing strategies, including social media management, SEO optimization, and targeted advertising campaigns.",
    bgGradient: "from-orange-100 to-red-100"
  }
];

// Animation variants
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const featureCard: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export default function Service() {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.03, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div variants={item} className="text-center mb-12">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Why Choose <span className='text-cyan-600'>Lovosis</span>?
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            We combine innovation with expertise to deliver exceptional results that exceed expectations
          </motion.p>
        </motion.div>

        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureCard}
              className="p-6 rounded-2xl shadow-lg border border-gray-200 bg-white transition-all duration-300 relative overflow-hidden"
            >
              <motion.div 
                variants={scaleIn}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${feature.bgGradient} p-3 rounded-xl mb-4 inline-block`}
              >
                <feature.icon className="w-10 h-10 text-gray-800" />
              </motion.div>
              
              <motion.h3 
                variants={fadeInUp}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="text-xl font-bold text-gray-800 mb-3"
              >
                {feature.title}
              </motion.h3>
              
              <motion.p 
                variants={fadeInUp}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="text-gray-600 leading-relaxed text-sm"
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}