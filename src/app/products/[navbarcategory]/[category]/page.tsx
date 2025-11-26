import { connectDB } from '@/lib/db';
import Category from '@/app/models/Category';
import Subcategory from '@/app/models/Subcategory';
import Product from '@/app/models/Product';
import { Metadata } from 'next';
import CategoryClient from '@/app/Components/CategoryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCategory(slug: string) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug });

    if (!category) {
      console.error(`Category with slug "${slug}" not found. Check the database for existing categories.`);
      console.log('Available categories:', await Category.find({}, { slug: 1, name: 1 }));
      return null;
    }

    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getSubcategories(categoryId: string) {
  try {
    await connectDB();
    return await Subcategory.find({ categoryId });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

async function getProducts(navbarCategoryId: string, categoryId: string) {
  try {
    await connectDB();
    return await Product.find({
      navbarCategoryId,
      categoryId,
      $or: [
        { subcategoryId: { $exists: false } },
        { subcategoryId: null }
      ]
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { navbarcategory: string, category: string } }): Promise<Metadata> {
  const category = await getCategory(params.category);
  
  if (!category) {
    return {
      title: 'Category Not Found | Lovosis Technology Pvt Ltd',
      description: 'The requested category could not be found.'
    };
  }

  return {
    title: `${category.name} | Lovosis Technology Pvt Ltd`,
    description: category.description || `Browse our collection of ${category.name} products`,
    openGraph: {
      title: `${category.name} | Lovosis Technology Pvt Ltd`,
      description: category.description || `Browse our collection of ${category.name} products`,
      type: 'website',
      url: `/products/${params.navbarcategory}/${params.category}`,
    }
  };
}

export default async function CategoryPage({
  params
}: {
  params: { navbarcategory: string, category: string }
}) {
  const category = await getCategory(params.category);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 bg-white text-black">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Category not found</h1>
        <p className="text-gray-800">
          The category "{params.category}" does not exist.
        </p>
        <a
          href={`/products/${params.navbarcategory}`}
          className="mt-4 text-blue-600 hover:text-blue-500 hover:underline"
        >
          &larr; Back to {params.navbarcategory}
        </a>
      </div>
    );
  }

  const subcategories = await getSubcategories(category._id.toString());
  const products = await getProducts(category.navbarCategoryId.toString(), category._id.toString());

  // Add JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `/products/${params.navbarcategory}/${params.category}`,
    numberOfItems: subcategories.length + products.length,
    itemListElement: [
      ...subcategories.map((subcategory, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: subcategory.name,
          description: subcategory.description,
          url: `/products/${params.navbarcategory}/${params.category}/${subcategory.slug}`,
          image: subcategory.image || '/images/placeholder.jpg'
        }
      })),
      ...products.map((product, index) => ({
        '@type': 'ListItem',
        position: subcategories.length + index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          url: `/products/${params.navbarcategory}/${params.category}/_/${product.slug}`,
          image: product.images?.[0] || '/images/placeholder.jpg'
        }
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryClient 
        category={JSON.parse(JSON.stringify(category))}
        subcategories={JSON.parse(JSON.stringify(subcategories))}
        products={JSON.parse(JSON.stringify(products))}
        params={params}
      />
    </>
  );
}