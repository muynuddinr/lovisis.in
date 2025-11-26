'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Variant from 'framer-motion';

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  navbarCategoryId: string;
}

interface CategoriesClientProps {
  initialNavbarCategories: NavbarCategory[];
  initialCategories: Category[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const imageVariants = {
  hidden: { scale: 1 },
  hover: { scale: 1.05 }
};

const listVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      staggerChildren: 0.05
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function CategoriesClient({ 
  initialNavbarCategories, 
  initialCategories 
}: CategoriesClientProps) {
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>(initialNavbarCategories);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Optional: Fetch fresh data on client side if needed
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setNavbarCategories(data.navbarCategories);
        setCategories(data.categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only refetch if you want real-time updates
    // fetchData();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-20 bg-white min-h-screen"
      >
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800"
      >
        Product Categories
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="ml-3 bg-cyan-100 text-cyan-800 text-sm font-semibold px-3 py-1 rounded-full"
        >
          {navbarCategories.length}
        </motion.span>
      </motion.h1>

      {/* Desktop View */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {navbarCategories.map((navbarCategory) => {
          const categoryItems = categories.filter(
            (category) => category.navbarCategoryId === navbarCategory._id
          );

          return (
            <motion.div 
              key={navbarCategory._id} 
              variants={itemVariants}
              className="mb-6 bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="cursor-pointer" onClick={() => toggleCategory(navbarCategory._id)}>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex justify-between items-center">
                  {navbarCategory.name}
                  {categoryItems.length > 0 && (
                    <motion.span 
                      animate={{ rotate: expandedCategory === navbarCategory._id ? 180 : 0 }}
                      className="text-gray-500"
                    >
                      ▼
                    </motion.span>
                  )}
                </h2>
              </div>

              <Link href={`/products/${navbarCategory.slug}`}>
                {navbarCategory.image && (
                  <motion.div 
                    variants={imageVariants}
                      initial="hidden"
                      whileHover="hover"
                      className="relative h-40 w-full mb-4 rounded-lg overflow-hidden"
                    >
                    <Image
                      src={navbarCategory.image.startsWith('/api/files/')
                        ? navbarCategory.image
                        : navbarCategory.image}
                      alt={navbarCategory.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover rounded-lg transition-transform duration-300"
                      quality={100}
                    />
                  </motion.div>
                )}

                {navbarCategory.description && (
                  <p className="text-gray-600 mb-4 text-sm">{navbarCategory.description}</p>
                )}
              </Link>

              {categoryItems.length > 0 && (
                <AnimatePresence>
                  {expandedCategory === navbarCategory._id && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={listVariants}
                      className="mt-4 overflow-hidden"
                    >
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Subcategories:</h3>
                      <ul className="space-y-2 pl-2">
                        {categoryItems.map((category) => (
                          <motion.li 
                            key={category._id}
                            variants={listItemVariants}
                          >
                            <Link
                              href={`/products/${navbarCategory.slug}/${category.slug}`}
                              className="text-gray-600 hover:text-cyan-600 hover:underline text-sm transition-colors duration-200 block py-1"
                            >
                              {category.name}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile View */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="sm:hidden grid grid-cols-1 gap-4"
      >
        {navbarCategories.map((navbarCategory) => {
          const categoryItems = categories.filter(
            (category) => category.navbarCategoryId === navbarCategory._id
          );

          return (
            <motion.div 
              key={navbarCategory._id} 
              variants={itemVariants}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
            >
              <div 
                className="cursor-pointer"
                onClick={() => toggleCategory(navbarCategory._id)}
              >
                <h2 className="text-lg font-semibold text-gray-800 flex justify-between items-center">
                  {navbarCategory.name}
                  {categoryItems.length > 0 && (
                    <motion.span 
                      animate={{ rotate: expandedCategory === navbarCategory._id ? 180 : 0 }}
                      className="text-gray-500"
                    >
                      ▼
                    </motion.span>
                  )}
                </h2>
              </div>

              <Link href={`/products/${navbarCategory.slug}`}>
                {navbarCategory.image && (
                  <motion.div 
                    className="relative h-40 w-full my-4 rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={navbarCategory.image.startsWith('/api/files/')
                        ? navbarCategory.image
                        : navbarCategory.image}
                      alt={navbarCategory.name}
                      fill
                      sizes="100vw"
                      className="object-cover rounded-lg"
                    />
                  </motion.div>
                )}

                {navbarCategory.description && (
                  <p className="text-gray-600 mb-3 text-sm">{navbarCategory.description}</p>
                )}
              </Link>

              {categoryItems.length > 0 && (
                <AnimatePresence>
                  {expandedCategory === navbarCategory._id && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={listVariants}
                      className="overflow-hidden"
                    >
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Subcategories:</h3>
                      <ul className="space-y-2 pl-2">
                        {categoryItems.map((category) => (
                          <motion.li 
                            key={category._id}
                            variants={listItemVariants}
                          >
                            <Link
                              href={`/products/${navbarCategory.slug}/${category.slug}`}
                              className="text-gray-600 hover:text-cyan-600 hover:underline text-sm transition-colors duration-200 block py-1"
                            >
                              {category.name}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}