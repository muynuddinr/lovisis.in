'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  images?: string[];
  slug: string;
}

interface NavbarCategory {
  _id: string;
  name: string;
  description?: string;
}

interface NavbarCategoryClientProps {
  navbarCategory: NavbarCategory;
  categories: Category[];
  uncategorizedProducts: Product[];
  params: { navbarcategory: string };
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function NavbarCategoryClient({
  navbarCategory,
  categories,
  uncategorizedProducts,
  params
}: NavbarCategoryClientProps) {
  // Build safe slugs to avoid `undefined` showing up in hrefs
  const safe = (val?: string, alt?: string) => {
    if (val && val !== 'undefined' && val !== 'null') return val;
    if (alt && alt !== 'undefined' && alt !== 'null') return alt;
    return '_';
  };

  const navbarSlug = safe(params?.navbarcategory, (navbarCategory as any)?.slug);
  const totalItems = categories.length + uncategorizedProducts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section - More compact */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            variants={headerVariants}
          >
            {navbarCategory.name}
          </motion.h1>
          
          <motion.div 
            className="inline-flex items-center px-3 py-1 bg-cyan-100 rounded-full text-cyan-700 font-medium text-sm mb-4"
            variants={headerVariants}
          >
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
            {totalItems}
          </motion.div>

          {navbarCategory.description && (
            <motion.p 
              className="text-base text-gray-600 max-w-2xl mx-auto"
              variants={headerVariants}
            >
              {navbarCategory.description}
            </motion.p>
          )}
        </motion.div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={sectionVariants}
            className="mb-16"
          >
            
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {categories.map((category) => (
                <motion.div
                  key={category._id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={`/products/${navbarSlug}/${category.slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md border border-gray-200 h-full">
                      <div className="relative h-40 w-full bg-gray-50 overflow-hidden">
                        <Image
                          src={category.image || '/images/placeholder.jpg'}
                          alt={category.name}
                          fill
                          unoptimized={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors duration-200">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                            {category.description}
                          </p>
                        )}
                        <div className="inline-flex items-center text-cyan-600 font-medium text-xs group-hover:text-cyan-700 transition-colors duration-200">
                          Explore
                          <svg className="ml-1 w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Uncategorized Products Section */}
        {uncategorizedProducts.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={sectionVariants}
          >
            
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {uncategorizedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={`/products/${navbarSlug}/_/_/${product.slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md border border-gray-200 h-full">
                      <div className="relative h-40 w-full bg-gray-50 overflow-hidden">
                        <Image
                          src={product.images?.[0] || '/images/placeholder.jpg'}
                          alt={product.name}
                          fill
                          unoptimized={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors duration-200">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                            {product.description}
                          </p>
                        )}
                        <div className="inline-flex items-center text-cyan-600 font-medium text-xs group-hover:text-cyan-700 transition-colors duration-200">
                          View Product
                          <svg className="ml-1 w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </div>
    </div>
  );
}