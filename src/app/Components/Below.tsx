"use client";

import {
  motion,
  useInView,
} from "framer-motion";
import { useRef } from "react";

export default function Below() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true });
  const isImageInView = useInView(imageRef, { once: true });

  return (
    <div className="py-12 overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image Section */}
          <motion.div 
            ref={imageRef}
            className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden flex items-center justify-center "
            initial={{ filter: "blur(20px)" }}
            animate={
              isImageInView ? { filter: "blur(0px)" } : { filter: "blur(20px)" }
            }
            transition={{ 
              duration: 0.5, 
              ease: "easeOut"
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/banner/home.png')`,
              }}
            />
          </motion.div>

          {/* Right Side - Content - No changes */}
          <motion.div
            ref={contentRef}
            className="p-6 lg:p-8 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={
              isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
            }
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1
              className="text-3xl text-black lg:text-4xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={
                isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              State-of-the-Art{" "}
              <motion.span
                className="text-cyan-600 inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isContentInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                Educational Equipment
              </motion.span>{" "}
              for Modern Learning
            </motion.h1>

            <motion.div
              className="space-y-4 text-[#555555] text-base lg:text-lg"
              initial={{ opacity: 0 }}
              animate={isContentInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              {[
                "We specialize in cutting-edge laboratory equipment for engineering colleges, polytechnics, and industrial training institutes. Empowering the next generation of innovators with hands-on experience.",
                "Our offerings include professional-grade testing and measurement instruments such as oscilloscopes, multimeters, electronic workbenches, signal generators, and comprehensive educational testing tools for assessment and performance evaluation.",
                "We leverage the latest and most reliable technologies to deliver web development, mobile app solutions, and comprehensive digital marketing services including SEO optimization, social media management, and targeted advertising campaigns.",
              ].map((text, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isContentInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: 20 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + idx * 0.15,
                    ease: "easeOut",
                  }}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.7, delay: 1, ease: "easeOut" }}
              className="pt-4"
            >
              {/* Add any CTA buttons or additional content here */}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}