import { connectDB } from '@/lib/db';
import Subcategory from '@/app/models/Subcategory';
import Product from '@/app/models/Product';
import { Metadata } from 'next';
import SubcategoryClient from '@/app/Components/SubcataegoryClient';

async function getSubcategory(slug: string) {
  await connectDB();
  return await Subcategory.findOne({ slug });
}

async function getProducts(subcategoryId: string) {
  await connectDB();
  return await Product.find({ subcategoryId }).sort({ name: 1 }).lean();
}

export const revalidate = 0;

export async function generateMetadata({
  params
}: {
  params: Promise<{ navbarcategory: string; category: string; subcategory: string }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  const subcategory = await getSubcategory(resolvedParams.subcategory);

  if (!subcategory) {
    return {
      title: 'Subcategory Not Found | Lovosis Technology Pvt Ltd',
      description: 'The requested subcategory could not be found.'
    };
  }

  return {
    title: `${subcategory.name} | Lovosis Technology Pvt Ltd`,
    description: subcategory.description || `Explore our collection of ${subcategory.name} products`,
    openGraph: {
      title: `${subcategory.name} | Lovosis Technology Pvt Ltd`,
      description: subcategory.description || `Explore our collection of ${subcategory.name} products`,
      type: 'website',
      url: `/products/${resolvedParams.navbarcategory}/${resolvedParams.category}/${resolvedParams.subcategory}`,
    }
  };
}

export default async function SubcategoryPage({
  params
}: {
  params: Promise<{ navbarcategory: string; category: string; subcategory: string }>
}) {
  const resolvedParams = await params;
  const subcategory = await getSubcategory(resolvedParams.subcategory);
  
  // Check if subcategory exists before trying to get products
  if (!subcategory) {
    return <div>Subcategory not found</div>;
  }

  const products = await getProducts(subcategory._id.toString()); // Ensure _id is converted to string

  // Add JSON-LD structured data - matching the structure from slug1
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: subcategory.name,
    description: subcategory.description,
    url: `/products/${resolvedParams.navbarcategory}/${resolvedParams.category}/${resolvedParams.subcategory}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        url: `/products/${resolvedParams.navbarcategory}/${resolvedParams.category}/${resolvedParams.subcategory}/${product.slug}`,
        image: product.images?.[0] || '/images/placeholder.jpg'
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubcategoryClient 
        subcategory={JSON.parse(JSON.stringify(subcategory))}
        products={JSON.parse(JSON.stringify(products))}
        params={resolvedParams}
        jsonLd={jsonLd}
      />
    </>
  );
}