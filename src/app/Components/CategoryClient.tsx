'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  description?: string;
  navbarCategoryId: string;
}

interface Subcategory {
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

interface CategoryClientProps {
  category: Category;
  subcategories: Subcategory[];
  products: Product[];
  params: { navbarcategory: string, category: string };
}

export default function CategoryClient({
  category,
  subcategories,
  products,
  params
}: CategoryClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {category.name}
          </h1>
          <div className="inline-flex items-center px-3 py-1 bg-cyan-100 rounded-full text-cyan-700 font-medium text-sm">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
            {subcategories.length + products.length}
          </div>
          {category.description && (
            <p className="text-gray-600 mt-4 text-base">{category.description}</p>
          )}
        </div>

        {/* Render subcategories if they exist */}
        {subcategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              Subcategories ({subcategories.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory._id}
                  href={`/products/${params.navbarcategory}/${params.category}/${subcategory.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md border border-gray-200 h-full group-hover:-translate-y-1">
                    <div className="relative h-40 w-full bg-gray-50 overflow-hidden">
                      <Image
                        src={subcategory.image || '/images/placeholder.jpg'}
                        alt={subcategory.name}
                        fill
                        unoptimized={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold mb-2 text-gray-800 group-hover:text-cyan-600 transition-colors duration-200">
                        {subcategory.name}
                      </h3>
                      {subcategory.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                          {subcategory.description}
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
              ))}
            </div>
          </div>
        )}

        {/* Always render products section if products exist */}
        {products.length > 0 && (
          <div>
            {subcategories.length > 0 && (
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Products ({products.length})
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${params.navbarcategory}/${params.category}/_/${product.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md border border-gray-200 h-full group-hover:-translate-y-1">
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
              ))}
            </div>
          </div>
        )}

        {subcategories.length === 0 && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base">No subcategories or products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}