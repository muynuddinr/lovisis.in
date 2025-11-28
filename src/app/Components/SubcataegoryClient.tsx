'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  slug: string;
}

interface Subcategory {
  _id: string;
  name: string;
  description: string;
  slug: string;
}

interface SubcategoryClientProps {
  subcategory: Subcategory;
  products: Product[];
  params: { 
    navbarcategory: string; 
    category: string; 
    subcategory: string 
  };
  jsonLd: any;
}

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Animation variants for each product card
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Component to detect when elements are in view
function InViewAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
}

export default function SubcategoryClient({ 
  subcategory, 
  products, 
  params, 
  jsonLd 
}: SubcategoryClientProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Safe slug helper to avoid `undefined` in URL segments
  const safe = (val?: string, alt?: string) => {
    if (val && val !== 'undefined' && val !== 'null') return val;
    if (alt && alt !== 'undefined' && alt !== 'null') return alt;
    return '_';
  };

  const navbarSlug = safe(params?.navbarcategory);
  const categorySlug = safe(params?.category);
  const subcategorySlug = safe(params?.subcategory, subcategory.slug);

  const handleImageLoad = (productId: string) => {
    setLoadedImages(prev => new Set([...prev, productId]));
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section with animation */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {subcategory.name}
            </h1>
            <div className="inline-flex items-center px-3 py-1 bg-cyan-100 rounded-full text-cyan-700 font-medium text-sm">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </div>
            {subcategory.description && (
              <p className="text-gray-600 mt-4 text-base">{subcategory.description}</p>
            )}
          </motion.div>

          {/* Products Grid with staggered animations */}
          {products.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <InViewAnimation key={product._id}>
                  <Link
                      href={`/products/${navbarSlug}/${categorySlug}/${subcategorySlug}/${product.slug}`}
                      className="group block"
                    >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md border border-gray-200 h-full group-hover:-translate-y-1">
                      {/* Product Image */}
                      <div className="relative h-40 w-full bg-gray-50 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                          onLoad={() => handleImageLoad(product._id)}
                        />
                        
                        {/* Loading Animation */}
                        {!loadedImages.has(product._id) && (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Content */}
                      <div className="p-4">
                        <h3 className="text-base font-semibold mb-2 text-gray-800 group-hover:text-cyan-600 transition-colors duration-200">
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
                </InViewAnimation>
              ))}
            </motion.div>
          ) : (
            /* Empty State with animation */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-base">No products found in this subcategory.</p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}