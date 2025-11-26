"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { IoDownloadOutline, IoStarOutline, IoStar, IoClose } from 'react-icons/io5';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import type { Product, Review } from '@/types/shop';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function ProductPage({
  params
}: {
  params: Promise<{ navbarcategory: string; category: string; subcategory: string; product: string }>
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const resolvedParams = use(params);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [catalogImages, setCatalogImages] = useState<string[]>([]);
  const [currentCatalogIndex, setCurrentCatalogIndex] = useState(0);
  const [isCatalogImageOpen, setIsCatalogImageOpen] = useState(false);

  const fetchReviews = async () => {
    if (product?._id) {
      const response = await fetch(`/api/reviews?itemId=${product._id}&itemType=product`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/preview?slug=${resolvedParams.product}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const hasChanged = JSON.stringify(data) !== JSON.stringify(product);

        if (hasChanged) {
          setProduct(data);

          if (data.catalogImage) {
            setCatalogImages([data.catalogImage]);
          } else if (data.catalogImages && data.catalogImages.length > 0) {
            setCatalogImages(data.catalogImages);
          } else {
            setCatalogImages([]);
          }
        }
      } else {
        console.error('Failed to fetch product data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    fetchProduct();

    // Polling interval to check for updates
    const pollingInterval = setInterval(fetchProduct, 5000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProduct();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollingInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resolvedParams.product]);

  useEffect(() => {
    fetchReviews();
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
        image: product.images,
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
        document.head.removeChild(script);
      };
    }
  }, [product, reviews, averageRating]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product information...</p>
        </div>
      </div>
    );
  }

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

      const data = await response.json();
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
        <span key={star}>
          {star <= Math.round(rating) ? (
            <IoStar className="w-4 h-4 text-amber-400" />
          ) : (
            <IoStarOutline className="w-4 h-4 text-amber-400" />
          )}
        </span>
      ))}
    </div>
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <div className="w-full border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>
          <div className="w-20 h-0.5 bg-cyan-600 mx-auto"></div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Product Images */}
          <div className="space-y-6 mx-auto w-full max-w-lg">
            <div className="group relative">
              {product && product.images && product.images.length > 0 ? (
                <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                  <Zoom>
                    <Image
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      fill
                      className="object-contain p-6"
                      priority
                      quality={100}
                      unoptimized
                    />
                  </Zoom>
                  
                  {/* Navigation arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                    {currentImageIndex + 1}/{product.images.length}
                  </div>
                </div>
              ) : (
                // Fallback when no images
                <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No product images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {product && product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-md overflow-hidden transition-all duration-200 ${
                      currentImageIndex === index
                        ? 'ring-2 ring-cyan-500 shadow-md'
                        : 'ring-1 ring-gray-300 hover:ring-cyan-400'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover p-1"
                      quality={100}
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={() => setIsContactFormOpen(true)}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold flex items-center justify-center gap-3 text-base shadow-sm hover:shadow-md transition-all duration-200"
            >
              <IoDownloadOutline className="w-5 h-5" />
              Request Product Catalog
            </button>

            {/* Reviews Section */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Customer Reviews
                </h2>
                <button
                  onClick={() => setIsReviewsOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-md font-medium transition-colors"
                >
                  Write Review
                </button>
              </div>

              <div className="bg-white p-4 rounded-md mb-4 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-0.5 justify-center">
                      {renderStars(averageRating)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">
                      {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </div>
                    <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${(averageRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length > 0 ? (
                  reviews.slice(0, 2).map((review, index) => (
                    <div
                      key={review._id}
                      className="bg-white p-4 rounded-md border border-gray-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{review.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment.substring(0, 120)}{review.comment.length > 120 ? '...' : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-white rounded-md border border-gray-200">
                    <p className="text-gray-500 text-sm font-medium">No reviews yet</p>
                    <p className="text-gray-400 text-xs mt-1">Be the first to review!</p>
                  </div>
                )}

                {reviews.length > 2 && (
                  <button
                    onClick={() => setIsReviewsOpen(true)}
                    className="w-full py-3 text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-md text-sm font-medium transition-colors border border-cyan-200"
                  >
                    View all {reviews.length} reviews
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Catalog Preview */}
          <div className="mx-auto w-full max-w-lg">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 min-h-[500px]">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Product Catalog
              </h2>

              <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                {catalogImages.length > 0 ? (
                  <div className="relative h-full group">
                    <button
                      onClick={() => setIsCatalogImageOpen(true)}
                      className="w-full h-full cursor-zoom-in relative overflow-hidden"
                    >
                      <Image
                        src={catalogImages[currentCatalogIndex]}
                        alt={`${product.name} Catalog Page ${currentCatalogIndex + 1}`}
                        fill
                        className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
                        quality={100}
                        unoptimized
                      />
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                        {currentCatalogIndex + 1}/{catalogImages.length}
                      </div>
                    </button>
                    
                    {catalogImages.length > 1 && (
                      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
                        {catalogImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentCatalogIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                              currentCatalogIndex === index ? 'bg-cyan-600' : 'bg-gray-400 hover:bg-gray-600'
                            }`}
                            aria-label={`View catalog page ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <IoDownloadOutline className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">No catalog images available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Image Popup Modal */}
      {isCatalogImageOpen && catalogImages.length > 0 && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-50"
            onClick={() => setIsCatalogImageOpen(false)}
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setIsCatalogImageOpen(false)}
          >
            <div
              className="relative w-full max-w-6xl h-[90vh] bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsCatalogImageOpen(false)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="Close"
              >
                <IoClose className="w-6 h-6 text-white" />
              </button>
              <div className="h-full w-full relative">
                <Image
                  src={catalogImages[currentCatalogIndex]}
                  alt={`${product.name} Catalog Page ${currentCatalogIndex + 1}`}
                  fill
                  className="object-contain p-8"
                  quality={100}
                />
              </div>
              {catalogImages.length > 1 && (
                <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
                  {catalogImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentCatalogIndex(index);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        currentCatalogIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`View catalog page ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Review Modal */}
      {isReviewsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
          />
          <div className="fixed inset-x-0  bottom-0 z-50 flex items-start justify-center overflow-hidden p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl max-h-[calc(100vh-120px)] flex flex-col border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Product Reviews</h2>
                  <p className="text-sm text-gray-500 mt-1">Share your experience with others</p>
                </div>
                <button
                  onClick={() => setIsReviewsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <IoClose className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4 mb-6">
                  {reviews.length > 0 ? (
                    <>
                      <div className="bg-cyan-50 border border-cyan-200 p-6 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-cyan-600 rounded-full w-12 h-12 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {reviews[0].name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{reviews[0].name}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(reviews[0].createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                            <div className="flex">
                              {renderStars(reviews[0].rating)}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {reviews[0].rating}/5
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed bg-white/80 p-4 rounded-lg border border-gray-100">
                          {reviews[0].comment}
                        </p>
                      </div>

                      {reviews.length > 1 && (
                        <button
                          onClick={() => setShowAllReviews(!showAllReviews)}
                          className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-cyan-600 hover:text-cyan-700 text-sm font-semibold transition-colors border border-gray-200"
                        >
                          {showAllReviews ? 'Show Less' : `Show ${reviews.length - 1} More ${reviews.length - 1 === 1 ? 'Review' : 'Reviews'}`}
                        </button>
                      )}

                      {showAllReviews && (
                        <div className="space-y-4">
                          {reviews.slice(1).map((review: Review, index) => (
                            <div
                              key={review._id}
                              className="bg-gray-50 border border-gray-200 p-6 rounded-lg"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      {review.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                                    <p className="text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                  <div className="flex">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="text-sm font-semibold text-gray-700">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 leading-relaxed bg-white/80 p-4 rounded-lg border border-gray-100">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-semibold text-lg mb-2">No reviews yet</p>
                      <p className="text-gray-500">Be the first to review this product!</p>
                    </div>
                  )}
                </div>

                {product._id && (
                  <div className="border-t pt-6 border-gray-200">
                    <ReviewForm itemId={product._id} itemType="product" onSubmitSuccess={fetchReviews} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Contact Form Modal */}
      {isContactFormOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsContactFormOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl border border-gray-200">
              <div className="bg-cyan-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Request Catalog</h2>
                    <p className="text-cyan-100 text-sm mt-1">Get instant access to product details</p>
                  </div>
                  <button
                    onClick={() => setIsContactFormOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <IoClose className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4"
              >
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent text-black text-sm transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent text-black text-sm transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent text-sm text-black transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black  focus:border-transparent text-sm transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                  <p className="text-sm text-cyan-800 font-medium">
                    📧 We'll send the catalog to your email address & phone number within minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 px-6 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <IoDownloadOutline className="w-5 h-5" />
                  Submit & Download Catalog
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}