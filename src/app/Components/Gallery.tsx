"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface GalleryImage {
    _id: string;
    title: string;
    description?: string;
    images: string[];
    category: string;
    date: string;
}

const CATEGORIES = ['All', 'Products', 'Events', 'Company', 'Projects'];

export default function Gallery() {
    const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [newImage, setNewImage] = useState<string>('');
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        fetchGalleryItems();
    }, [selectedCategory]);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, when: 'beforeChildren' }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    const hoverCardVariants: Variants = {
        initial: { y: 0 },
        hover: { y: -8 }
    };

    const hoverContentVariants: Variants = {
        initial: { opacity: 0, y: 20 },
        hover: { opacity: 1, y: 0 }
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', damping: 25, stiffness: 100 }
        },
        exit: { opacity: 0, scale: 0.95 }
    };

    // Details panel animations (badge, title, description enter one-by-one)
    const detailsContainer: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 }
        }
    };

    const detailsItem: Variants = {
        hidden: { opacity: 0, x: 16 },
        show: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.35, ease: 'easeOut' }
        }
    };

    const fetchGalleryItems = async () => {
        setIsLoading(true);
        try {
            const url = selectedCategory === 'All'
                ? '/api/gallery'
                : `/api/gallery?category=${selectedCategory}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch gallery items');

            const data = await response.json();
            setGalleryItems(data);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedItem && currentImageIndex < selectedItem.images.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedItem && currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    const handleImageUpload = (url: string) => {
        setNewImage(url);
    };

    const handleSubmitNewImage = async () => {
        if (!newImage) return;

        try {
            const response = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: [newImage], category: selectedCategory }),
            });

            if (!response.ok) throw new Error('Failed to upload image');

            fetchGalleryItems();
            setNewImage('');
        } catch (error) {
            console.error('Error uploading new image:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
                        Our Gallery
                    </h1>
                    <p className="text-xl text-black max-w-2xl mx-auto mb-8">
                        Explore our collection of images showcasing our products, events, and company culture.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                    : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8 rounded-3xl bg-white shadow-xl"
                >
                    {isLoading ? (
                        [...Array(9)].map((_, i) => (
                            <div key={i} className="aspect-square animate-pulse bg-gray-200 rounded-xl shadow-md" />
                        ))
                    ) : (
                        galleryItems.map((itemData) => (
                            <motion.div
                                variants={item}
                                key={itemData._id}
                                className="aspect-square relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-gray-200"
                                onClick={() => {
                                    setSelectedItem(itemData);
                                    setCurrentImageIndex(0);
                                }}
                                onMouseEnter={() => !isMobile && setHoveredItemId(itemData._id)}
                                onMouseLeave={() => !isMobile && setHoveredItemId(null)}
                                initial="initial"
                                whileHover={isMobile ? undefined : 'hover'}
                            >
                                {itemData.images && itemData.images.length > 0 ? (
                                    <>
                                        <Image
                                            src={itemData.images[0]}
                                            alt={itemData.title}
                                            fill
                                            className="object-scale-down bg-white transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            priority
                                        />
                                        <motion.div
                                            className="absolute inset-0 flex items-end p-6 pointer-events-none"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: hoveredItemId === itemData._id ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                                            <motion.div variants={hoverContentVariants} className="relative z-10 w-full">
                                                <h3 className="text-white font-semibold text-lg mb-2 drop-shadow-lg">{itemData.title}</h3>
                                                {itemData.description && (
                                                    <p className="text-white/95 text-sm leading-relaxed line-clamp-3 mb-3 drop-shadow-lg text-left">
                                                        {itemData.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sky-300 text-sm font-medium underline underline-offset-4">View Details</span>
                                                    <span className="text-white/80 text-xs">{itemData.category}</span>
                                                    {itemData.images.length > 1 && (
                                                        <span className="ml-auto text-white/80 text-xs">{itemData.images.length} images</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600">No image</span>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </motion.div>

                <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
                                <div className="relative flex-1 bg-gray-50 p-4 md:p-6">
                                    <div className="relative w-full h-full rounded-xl border border-gray-200 bg-white shadow-sm">
                                        <Image
                                            src={selectedItem.images[currentImageIndex]}
                                            alt={selectedItem.title}
                                            fill
                                            className="object-contain"
                                            quality={100}
                                            sizes="(max-width: 768px) 100vw, 60vw"
                                        />

                                        {selectedItem.images.length > 1 && (
                                            <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between">
                                                {currentImageIndex > 0 && (
                                                    <button
                                                        onClick={handlePrevImage}
                                                        className="p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors backdrop-blur-sm"
                                                    >
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {currentImageIndex < selectedItem.images.length - 1 && (
                                                    <button
                                                        onClick={handleNextImage}
                                                        className="p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors backdrop-blur-sm"
                                                    >
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <motion.div className="w-full md:w-96 p-6 flex flex-col bg-white" variants={detailsContainer} initial="hidden" animate="show">
                                    <motion.div className="flex items-start justify-between" variants={detailsItem}>
                                        <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                                            {selectedItem.category}
                                        </span>
                                        <button
                                            onClick={() => setSelectedItem(null)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            aria-label="Close"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </motion.div>

                                    <motion.h2 className="mt-4 text-2xl font-semibold text-gray-900" variants={detailsItem}>
                                        {selectedItem.title}
                                    </motion.h2>

                                    {selectedItem.description && (
                                        <motion.p className="mt-4 text-gray-600 leading-relaxed" variants={detailsItem}>
                                            {selectedItem.description}
                                        </motion.p>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
}