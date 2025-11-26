import { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import NavbarCategory from '@/app/models/NavbarCategory';
import Category from '@/app/models/Category';
import NavbarCategories from '@/app/Components/NavCataegories';

export const metadata: Metadata = {
  title: 'Product Categories | Lovosis Technologies Pvt. Ltd.',
  description: 'Explore our wide range of product categories. Find high-quality industrial equipment and supplies at Lovosis Technology Pvt Ltd.',
  keywords: 'industrial products, equipment categories, Lovosis Technology Pvt Ltd products, industrial supplies',
  openGraph: {
    title: 'Product Categories | Lovosis Technologies Pvt. Ltd.',
    description: 'Explore our wide range of product categories. Find high-quality industrial equipment and supplies at Lovosis Technology Pvt Ltd.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Lovosis Technologies Pvt. Ltd.',
    url: 'https://lovosis.in/products',
    images: [{
      url: '/og-image.jpg', // Make sure to add an OG image in your public folder
      width: 1200,
      height: 630,
      alt: 'Lovosis Technology Pvt Ltd Product Categories'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Categories | Lovosis Technologies Pvt. Ltd.',
    description: 'Explore our wide range of product categories. Find high-quality industrial equipment and supplies at Lovosis Technology Pvt Ltd.',
    images: ['/og-image.jpg'], // Same as OG image
  },
  robots: {
    index: true,
    follow: true,
  }
};

// Add this line to disable caching and enable real-time updates
export const revalidate = 0;

async function getNavbarCategories() {
  await connectDB();
  return await NavbarCategory.find({}).sort({ name: 1 });
}

async function getCategories() {
  await connectDB();
  return await Category.find({}).sort({ name: 1 });
}

export default async function ShopPage() {
  const navbarCategories = await getNavbarCategories();
  const categories = await getCategories();
  
  // Convert MongoDB documents to plain objects
  const navbarCategoriesData = JSON.parse(JSON.stringify(navbarCategories));
  const categoriesData = JSON.parse(JSON.stringify(categories));

  return (
    <NavbarCategories 
      initialNavbarCategories={navbarCategoriesData} 
      initialCategories={categoriesData} 
    />
  );
}