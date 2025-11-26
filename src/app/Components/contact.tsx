"use client";
import { useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import { BsTelephoneFill } from "react-icons/bs";
import { FaInstagram, FaLinkedinIn, FaYoutube, FaFacebook, FaTwitter } from "react-icons/fa";
import { PiThreadsLogoFill } from "react-icons/pi";
import { SiGmail } from "react-icons/si";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactRef = useRef(null);
  const isInView = useInView(contactRef, { once: true, margin: "-100px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Phone validation (basic, 10+ digits)
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid phone number");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full bg-gray-50">
      <Toaster position="top-right" />
      {/* Banner Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Contact Us"
      >
        {/* Banner Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Primary banner image */}
          <div className="absolute inset-0">
            <Image
              src="/banner/Contact.png"
              alt="Contact Lovosis Technology"
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
                Get in <span className="text-cyan-600 drop-shadow-lg">Touch</span>
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
                Let's discuss how we can help transform your business with our technology solutions.
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
            <span className="text-sm text-gray-200 mb-2 drop-shadow-md">Contact Us</span>
            <svg className="w-6 h-6 text-gray-200 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>
      {/* Follow Us Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Follow Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay connected with us on social media for the latest updates, news, and offers.
            </p>
          </div>
          <div className="flex justify-center gap-8 flex-wrap">
            <a 
              href="https://www.facebook.com/lovosistech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-blue-600 hover:text-white p-4 rounded-full transition-all duration-300"
              aria-label="Facebook"
            >
              <FaFacebook className="text-2xl text-blue-600 hover:text-white" />
            </a>
            <a 
              href="https://twitter.com/lovosistech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-cyan-400 hover:text-white p-4 rounded-full transition-all duration-300"
              aria-label="Twitter"
            >
              <FaTwitter className="text-2xl text-cyan-400 hover:text-white" />
            </a>
            <a 
              href="https://www.instagram.com/lovosis_technology_private_ltd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-pink-600 hover:text-white p-4 rounded-full transition-all duration-300"
              aria-label="Instagram"
            >
              <FaInstagram className="text-2xl text-pink-600 hover:text-white" />
            </a>
            <a 
              href="https://www.linkedin.com/company/lovosis-technology-private-limited" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-cyan-700 hover:text-white p-4 rounded-full transition-all duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="text-2xl text-cyan-700 hover:text-white" />
            </a>
            <a 
              href="https://www.youtube.com/@LovosisTechnology" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-red-600 hover:text-white p-4 rounded-full transition-all duration-300"
              aria-label="YouTube"
            >
              <FaYoutube className="text-2xl text-red-600 hover:text-white" />
            </a>
            <a 
              href="https://www.threads.net/@lovosis_technology_private_ltd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-black hover:text-white p-4 rounded-full transition-all duration-300"
              aria-label="Threads"
            >
              <PiThreadsLogoFill className="text-2xl text-black hover:text-white" />
            </a>
          </div>
        </div>
      </div>
      {/* Enhanced Contact Form Section */}
      <section className="py-16 bg-white" id="contact-form" ref={contactRef}>
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1.5 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium mb-3"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              Get in touch
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Contact Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Ready to discuss your project? Fill out the form below and we'll respond within 24 hours.
            </motion.p>
          </div>
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3,
                },
              },
            }}
            className="grid md:grid-cols-5 gap-8"
          >
            {/* Contact Information - Left Side */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.6, -0.05, 0.01, 0.99]
                  },
                },
              }}
              className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 space-y-6 shadow-sm"
            >
              <div>
                <h3 className="font-medium text-gray-800 text-lg border-b pb-2 mb-3">
                  Contact
                </h3>
                <div className="text-gray-600 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-100 p-2 rounded-full">
                      <BsTelephoneFill className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">PHONE</p>
                      <p>+91 70129 70281</p>
                      <p>+91 97477 45544</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-100 p-2 rounded-full">
                      <SiGmail className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">EMAIL</p>
                      <p>info@lovosis.in</p>
                      <p>lovosist@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 text-lg border-b pb-2 mb-3">
                  Location
                </h3>
                <div className="text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-100 p-2 rounded-full">
                      <IoLocationSharp className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        BANGALORE OFFICE
                      </p>
                      <p>4-72/2, Swathi Building, 3rd Floor</p>
                      <p>Opp. Singapura Garden</p>
                      <p>Bengaluru, Karnataka 560090</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 text-lg border-b pb-2 mb-3">
                  Hours
                </h3>
                <div className="text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Mon-Sat:</span>
                    <span>9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Sun:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Contact Form - Right Side */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.6, -0.05, 0.01, 0.99]
                  },
                },
              }}
              className="md:col-span-3"
            >
              <div className="bg-gradient-to-br from-gray-50 to-cyan-50 rounded-2xl p-8 shadow-lg border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-300 bg-white text-gray-900 hover:border-cyan-300"
                        required
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all duration-300 bg-white text-gray-900 hover:border-cyan-300"
                        required
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Phone *
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-300 bg-white text-gray-900 hover:border-cyan-300"
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Subject *
                    </label>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-all duration-300 bg-white text-gray-900 hover:border-cyan-300"
                      required
                      placeholder="Subject of your message"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg   transition-all duration-300 bg-white text-gray-900 resize-y hover:border-cyan-300"
                      required
                      placeholder="Please describe your requirements..."
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-6 pt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className="font-medium">We'll respond within 24 hours</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white font-semibold text-base rounded-full transition-all duration-300 group transform hover:scale-105 hover:shadow-lg min-w-[180px] justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Map Section */}
      <section className="bg-white w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Title Container */}
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl mb-16">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 bg-cyan-100 border border-cyan-200 rounded-full text-cyan-700 text-sm font-medium mb-6"
              >
                Visit Our Location
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
              >
                Find Us in <span className="text-cyan-600">Bangalore</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
              >
                Visit our office to see our products in action and get hands-on consultation from our experts.
              </motion.p>
            </div>
          </div>
          {/* Full Width Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="w-full h-[600px] relative"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.3754874154447!2d77.53100297405233!3d13.07537291259675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23e28f4d4575%3A0x82fc68d725417776!2sLovosis%20Technology%20Private%20limited!5e0!3m2!1sen!2sin!4v1754620821129!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Swathi Building, Bengaluru, Karnataka"
              className="absolute inset-0"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}