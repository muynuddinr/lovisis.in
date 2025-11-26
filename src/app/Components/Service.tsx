import React, { useState, useEffect, useRef } from 'react';

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

const services = [
 {
  id: 1,
  icon: (
    <svg className="w-12 h-12 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  title: "Educational Testing Tools",
description: "Essential tools for educational testing, assessment, and performance evaluation."

}
,
  {
    id: 2,
    icon: (
      <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" />
        <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
        <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
      </svg>
    ),
    title: "Measurement Equipment",
    description: "Precision measurement devices for accurate data collection and analysis in various fields."
  },
  {
    id: 3,
    icon: (
      <svg className="w-12 h-12 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v7H5v-3H4zm3-7.5c0-.83.67-1.5 1.5-1.5S10 9.67 10 10.5 9.33 12 8.5 12 7 11.33 7 10.5zM12.5 11H11v5.5h3v-6l2.5-1.5L15 7.5 12.5 11z" />
      </svg>
    ),
    title: "Power Analysis Systems",
    description: "Advanced systems for power consumption analysis and energy efficiency optimization."
  },
 {
  id: 4,
  icon: (
    <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  title: "Custom Website Development",
  description: "Bespoke websites tailored to your business."
},

  {
    id: 5,
    icon: (
      <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Social Media Marketing",
    description: "Strategic social media campaigns to boost your online presence and engagement."
  },
  {
    id: 6,
    icon: (
      <svg className="w-12 h-12 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
      </svg>
    ),
    title: "SEO Services",
    description: "Comprehensive search engine optimization to improve your website's visibility."
  }
];


  // Duplicate services for seamless loop
  const marqueeServices = [...services, ...services];

  return (
    <>
      <style jsx>{`
        @keyframes drawLine {
          0% {
            width: 0;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            width: 80px;
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes slideInFromBottom {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes marqueeScroll {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(-50%); 
          }
        }

        .animate-draw-line {
          animation: ${isVisible ? "drawLine 2s ease-out 0.5s forwards" : "none"};
        }

        .animate-fade-in-up {
          animation: ${isVisible ? "fadeInUp 0.8s ease-out forwards" : "none"};
        }

        .animate-pulse-custom {
          animation: ${isVisible ? "pulse 2s infinite" : "none"};
        }

        .services-marquee {
          animation: ${isVisible ? "marqueeScroll 40s linear infinite" : "none"};
          will-change: transform;
        }

        .service-marquee-card {
          will-change: transform, opacity;
          position: relative;
          flex-shrink: 0;
        }

        .section-container {
          opacity: 0;
          animation: ${isVisible ? "fadeInUp 0.8s ease-out forwards" : "none"};
        }

        .header-content {
          opacity: 0;
          transform: translateY(20px);
          animation: ${isVisible ? "slideInFromBottom 0.6s ease-out forwards" : "none"};
        }

        @media (max-width: 768px) {
          .service-marquee-card {
            min-width: 280px;
            max-width: 280px;
          }
        }

        @media (min-width: 769px) {
          .service-marquee-card {
            min-width: 350px;
            max-width: 350px;
          }
        }
      `}</style>
      
      <section ref={sectionRef} className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-container">
          {/* Section Header */}
          <div className="text-center mb-16 header-content">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-2">
              Our services
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our <span className="text-cyan-500">Professional</span> Services
            </h2>
            <div className="relative flex justify-center mb-8">
              <div className="absolute w-20 h-1 bg-gray-200 rounded-full"></div>
              <div
                className={`w-0 h-1 bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 rounded-full shadow-lg ${
                  isVisible ? "animate-draw-line" : ""
                }`}
              ></div>
              <div
                className={`absolute w-0 h-1 bg-cyan-600 rounded-full blur-sm opacity-60 ${
                  isVisible ? "animate-draw-line" : ""
                }`}
              ></div>
              <div
                className={`absolute right-0 w-2 h-2 bg-cyan-600 rounded-full -translate-y-0.5 opacity-0 ${
                  isVisible ? "animate-pulse-custom" : ""
                }`}
                style={{
                  animationDelay: isVisible ? "2.5s" : "0s",
                  animationFillMode: isVisible ? "forwards" : "none",
                }}
              ></div>
            </div>
            <p className="text-lg text-gray-500 text-center mt-4 font-medium max-w-2xl mx-auto">
              Comprehensive solutions to meet all your business needs
            </p>
          </div>

          {/* Services Marquee */}
          <div className="relative w-full overflow-x-hidden pt-8   ">
            <div className="services-marquee flex items-center gap-12 w-max mb-2">
              {marqueeServices.map((service, index) => (
                <div 
                  key={`${service.id}-${index}`}
                  className="service-marquee-card bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center px-6 py-10 relative cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => {
                    console.log(`Navigating to ${service.title}`);
                  }}
                >
                  {/* Floating icon background */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-50 to-cyan-100 shadow-lg border-2 border-cyan-200 mb-6">
                    {service.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 hover:text-cyan-600 transition-colors duration-300 mb-4 text-center leading-tight">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-center text-base px-2">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;