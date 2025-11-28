import { connectDB } from '@/lib/db';
import Category from '@/app/models/Category';
import { Metadata } from 'next';
import NavbarCategory from '@/app/models/NavbarCategory';
import Product from '@/app/models/Product';
import NavbarCategoryClient from '@/app/Components/NavbarCategoryClient';

export const dynamic = 'force-dynamic';

async function getNavbarCategory(slug: string) {
  await connectDB();
  return await NavbarCategory.findOne({ slug });
}

async function getCategories(navbarCategoryId: string) {
  await connectDB();
  return await Category.find({ navbarCategoryId }).sort({ name: 1 });
}

async function getProducts(navbarCategoryId: string) {
  await connectDB();
  return await Product.find({
    navbarCategoryId
  }).sort({ name: 1 }).lean();
}

export async function generateMetadata({ params }: { params: Promise<{ navbarcategory: string }> }): Promise<Metadata> {
  const { navbarcategory } = await params;
  const navbarCategory = await getNavbarCategory(navbarcategory);
  
  if (!navbarCategory) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }

  return {
    title: `${navbarCategory.name} | Lovosis Technology Pvt Ltd`,
    description: navbarCategory.description || `Browse our collection of ${navbarCategory.name} products`,
    openGraph: {
      title: `${navbarCategory.name} | Lovosis Technology Pvt Ltd`,
      description: navbarCategory.description || `Browse our collection of ${navbarCategory.name} products`,
      type: 'website',
      url: `/products/${navbarcategory}`,
    }
  };
}

export default async function NavbarCategoryPage({
  params
}: {
  params: Promise<{ navbarcategory: string }>
}) {
  const { navbarcategory } = await params;
  const navbarCategory = await getNavbarCategory(navbarcategory);

  if (!navbarCategory) {
    return <div className="container mx-auto px-4 py-12">Navbar Category not found</div>;
  }

  const categories = await getCategories(navbarCategory._id.toString());
  const uncategorizedProducts = await getProducts(navbarCategory._id.toString());

  // Add JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: navbarCategory.name,
    description: navbarCategory.description,
    url: `/products/${navbarcategory}`,
    numberOfItems: categories.length + uncategorizedProducts.length,
    itemListElement: [
      ...categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: category.name,
          description: category.description,
          url: `/products/${navbarcategory}/${category.slug}`
        }
      })),
      ...uncategorizedProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: categories.length + index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
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
      <NavbarCategoryClient 
        navbarCategory={JSON.parse(JSON.stringify(navbarCategory))}
        categories={JSON.parse(JSON.stringify(categories))}
        uncategorizedProducts={JSON.parse(JSON.stringify(uncategorizedProducts))}
        params={params}
      />
    </>
  );
}