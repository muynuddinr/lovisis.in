"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IoDownloadOutline, IoStarOutline, IoStar, IoClose } from 'react-icons/io5';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import type { Product, Review } from '@/types/shop';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ProductPage({
  params
}: {
  params: { category: string; subcategory: string; product: string }
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [catalogImages, setCatalogImages] = useState<string[]>([]);
  const [currentCatalogIndex, setCurrentCatalogIndex] = useState(0);
  const [isCatalogImageOpen, setIsCatalogImageOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Refs for animations
  const heroRef = useRef(null);
  const catalogRef = useRef(null);
  const reviewsRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isCatalogInView = useInView(catalogRef, { once: true, margin: "-100px" });
  const isReviewsInView = useInView(reviewsRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0.9, 1]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.1], [8, 16]);

  const fetchReviews = async () => {
    if (product?._id) {
      try {
        const response = await fetch(`/api/reviews?itemId=${product._id}&itemType=product`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${params.product}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data);

        if (data.catalogImage) {
          setCatalogImages([data.catalogImage]);
        } else if (data.catalogImages && data.catalogImages.length > 0) {
          setCatalogImages(data.catalogImages);
        } else {
          setCatalogImages([]);
        }
      } else {
        console.error('Failed to fetch product data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.product]);

  useEffect(() => {
    if (product?._id) {
      fetchReviews();
    }
  }, [product?._id]);

  useEffect(() => {
    if (isReviewsOpen || isContactFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isReviewsOpen, isContactFormOpen]);

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Add structured data
  useEffect(() => {
    if (product) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description ?? '',
        image: product.images || [],
        aggregateRating: reviews.length ? {
          '@type': 'AggregateRating',
          ratingValue: averageRating.toFixed(1),
          reviewCount: reviews.length
        } : undefined,
        review: reviews.map(review => ({
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating
          },
          author: {
            '@type': 'Person',
            name: review.name
          },
          reviewBody: review.comment
        }))
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [product, reviews, averageRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      const response = await fetch('/api/catalog-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          companyName: formData.get('companyName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          productName: product?.name,
          catalogImages: catalogImages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create catalog request');
      }

      alert('Request submitted successfully!');
      setIsContactFormOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create catalog request: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.span
          key={star}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: star * 0.1 }}
        >
          {star <= Math.round(rating) ? (
            <IoStar className="w-4 h-4 text-amber-400" />
          ) : (
            <IoStarOutline className="w-4 h-4 text-amber-400" />
          )}
        </motion.span>
      ))}
    </div>
  );

  const nextImage = () => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading product information...</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-slate-600 font-medium">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center text-slate-900">
      {/* Enhanced Header */}
      <motion.div
        style={{ opacity: headerOpacity, backdropFilter: `blur(${headerBlur}px)` }}
        className="w-full border-b border-slate-200/50 bg-white/80 sticky top-0 z-30 shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 line-clamp-2 tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent"
          >
            {product.name || 'Product Name'}
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto shadow-sm"
          />
        </div>
      </motion.div>

      <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-12">
        <motion.div
          ref={heroRef}
          variants={containerVariants}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
        >
          {/* Left Side - Product Images */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6 mx-auto w-full max-w-lg">
            <motion.div className="group relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="aspect-square relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
                >
                  {product.images && product.images.length > 0 ? (
                    <>
                      <Zoom>
                        <Image
                          src={product.images[currentImageIndex]}
                          alt={product.name}
                          fill
                          className="object-contain p-4 sm:p-6"
                          priority
                          quality={100}
                        />
                      </Zoom>
                      
                      {/* Navigation arrows */}
                      {product.images.length > 1 && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <IoChevronLeft className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <IoChevronRight className="w-5 h-5" />
                          </motion.button>
                        </>
                      )}

                      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {currentImageIndex + 1}/{product.images.length}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <p className="text-slate-400">No image available</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Thumbnail Grid */}
            {product.images && product.images.length > 1 && (
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-4 sm:grid-cols-5 gap-3"
              >
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                      currentImageIndex === index
                        ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                        : 'ring-1 ring-slate-300 hover:ring-blue-400 hover:shadow-md'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover p-1"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsContactFormOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold flex items-center justify-center gap-3 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="group-hover:animate-none"
              >
                <IoDownloadOutline className="w-5 h-5" />
              </motion.div>
              Request Product Catalog
            </motion.button>

            {/* Reviews Section */}
            <motion.div
              ref={reviewsRef}
              variants={itemVariants}
              className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1 h-6 bg-amber-400 rounded-full"
                    />
                    Customer Reviews
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsReviewsOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 text-sm rounded-lg font-medium shadow-md transition-all duration-200"
                >
                  Write Review
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isReviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                className="bg-gradient-to-br from-slate-100 to-slate-50 p-4 rounded-xl mb-4 border border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isReviewsInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="text-3xl font-bold text-slate-900"
                    >
                      {averageRating.toFixed(1)}
                    </motion.div>
                    <div className="flex items-center gap-0.5 justify-center">
                      {renderStars(averageRating)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">
                      {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </div>
                    <div className="h-2 bg-slate-300 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isReviewsInView ? { width: `${(averageRating / 5) * 100}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Reviews List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {reviews.length > 0 ? (
                    reviews.slice(0, 2).map((review, index) => (
                      <motion.div
                        key={review._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold text-sm">
                              {review.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-sm">{review.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className="text-xs text-slate-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {review.comment.substring(0, 120)}{review.comment.length > 120 ? '...' : ''}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6 bg-slate-100/50 rounded-xl"
                    >
                      <p className="text-slate-500 text-sm font-medium">No reviews yet</p>
                      <p className="text-slate-400 text-xs mt-1">Be the first to review!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {reviews.length > 2 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsReviewsOpen(true)}
                    className="w-full py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm font-medium transition-all duration-200 border border-blue-200"
                  >
                    View all {reviews.length} reviews
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Catalog Preview */}
          <motion.div
            ref={catalogRef}
            variants={itemVariants}
            className="mx-auto w-full max-w-lg"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isCatalogInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-slate-200/50 min-h-[500px] hover:shadow-2xl transition-all duration-500"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-1 h-6 bg-blue-600 rounded-full"
                />
                Product Catalog
              </h2>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="aspect-[3/4] relative rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50 shadow-inner"
              >
                {catalogImages.length > 0 ? (
                  <div className="relative h-full group">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsCatalogImageOpen(true)}
                      className="w-full h-full cursor-zoom-in relative overflow-hidden"
                    >
                      <Image
                        src={catalogImages[currentCatalogIndex]}
                        alt={`${product.name} Catalog Page ${currentCatalogIndex + 1}`}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {currentCatalogIndex + 1}/{catalogImages.length}
                      </div>
                    </motion.button>
                    
                    {catalogImages.length > 1 && (
                      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
                        {catalogImages.map((_, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => setCurrentCatalogIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              currentCatalogIndex === index ? 'bg-blue-600 shadow-lg' : 'bg-slate-400 hover:bg-slate-600'
                            }`}
                            aria-label={`View catalog page ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <IoDownloadOutline className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">No catalog images available</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Catalog Image Popup Modal */}
      <AnimatePresence>
        {isCatalogImageOpen && catalogImages.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
              onClick={() => setIsCatalogImageOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setIsCatalogImageOpen(false)}
            >
              <div
                className="relative w-full max-w-6xl h-[90vh] bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCatalogImageOpen(false)}
                  className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10 backdrop-blur-sm"
                  aria-label="Close"
                >
                  <IoClose className="w-6 h-6 text-white" />
                </motion.button>
                <div className="h-full w-full relative">
                  <Image
                    src={catalogImages[currentCatalogIndex]}
                    alt={`${product.name} Catalog Page ${currentCatalogIndex + 1}`}
                    fill
                    className="object-contain p-8"
                  />
                </div>
                {catalogImages.length > 1 && (
                  <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
                    {catalogImages.map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentCatalogIndex(index);
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentCatalogIndex === index ? 'bg-white shadow-lg' : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`View catalog page ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Review Modal */}
      <AnimatePresence>
        {isReviewsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-0 top-[100px] bottom-0 z-50 flex items-start justify-center overflow-hidden p-4"
            >
              <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[calc(100vh-120px)] flex flex-col border border-slate-200 overflow-hidden">
                <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-200 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Product Reviews</h2>
                    <p className="text-sm text-slate-500 mt-1">Share your experience with others</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsReviewsOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    aria-label="Close"
                  >
                    <IoClose className="w-5 h-5 text-slate-400" />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4 mb-6">
                    <AnimatePresence>
                      {reviews.length > 0 ? (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 p-6 rounded-2xl shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                              <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                                  <span className="text-white font-bold text-sm">
                                    {reviews[0].name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-900">{reviews[0].name}</h3>
                                  <p className="text-sm text-slate-500">
                                    {new Date(reviews[0].createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex">
                                  {renderStars(reviews[0].rating)}
                                </div>
                                <span className="text-sm font-semibold text-slate-700">
                                  {reviews[0].rating}/5
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-slate-100">
                              {reviews[0].comment}
                            </p>
                          </motion.div>

                          {reviews.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowAllReviews(!showAllReviews)}
                              className="w-full py-3 px-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl text-blue-600 hover:text-blue-700 text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-slate-200"
                            >
                              {showAllReviews ? (
                                <>
                                  Show Less
                                  <motion.svg
                                    animate={{ rotate: showAllReviews ? 180 : 0 }}
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </motion.svg>
                                </>
                              ) : (
                                <>
                                  Show {reviews.length - 1} More {reviews.length - 1 === 1 ? 'Review' : 'Reviews'}
                                  <motion.svg
                                    animate={{ rotate: showAllReviews ? 180 : 0 }}
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </motion.svg>
                                </>
                              )}
                            </motion.button>
                          )}

                          <AnimatePresence>
                            {showAllReviews && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                              >
                                {reviews.slice(1).map((review: Review, index) => (
                                  <motion.div
                                    key={review._id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                                          <span className="text-white font-bold text-sm">
                                            {review.name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-slate-900">{review.name}</h3>
                                          <p className="text-sm text-slate-500">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric'
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex">
                                          {renderStars(review.rating)}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">
                                          {review.rating}/5
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-slate-100">
                                      {review.comment}
                                    </p>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-12 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200"
                        >
                          <div className="text-slate-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-semibold text-lg mb-2">No reviews yet</p>
                          <p className="text-slate-500">Be the first to review this product!</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {product._id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="border-t pt-6 border-slate-200"
                    >
                      <ReviewForm itemId={product._id} itemType="product" onSubmitSuccess={fetchReviews} />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Contact Form Modal */}
      <AnimatePresence>
        {isContactFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-0 top-[100px] bottom-0 z-50 flex items-start justify-center overflow-hidden p-4"
            >
              <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Request Catalog</h2>
                      <p className="text-blue-100 text-sm mt-1">Get instant access to product details</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsContactFormOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                      aria-label="Close"
                    >
                      <IoClose className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSubmit}
                  className="p-6 space-y-4"
                >
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-slate-50 focus:bg-white"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      📧 We'll send the catalog to your email address & phone number within minutes.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <IoDownloadOutline className="w-5 h-5" />
                    Submit & Download Catalog
                  </motion.button>
                </motion.form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Enhanced focus styles */
        input:focus, textarea:focus, button:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition-property: color, background-color, border-color, transform, box-shadow, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        /* Glass morphism effect */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }

        /* Enhanced gradient text */
        .bg-clip-text {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Loading animation */
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }

        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px);
          background-size: 200px;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}