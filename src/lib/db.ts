import mongoose from 'mongoose';

// Import all models to ensure they are registered
import '@/app/models/Admin';
import '@/app/models/Blog';
import '@/app/models/CatalogRequest';
import '@/app/models/Category';
import '@/app/models/Certificate';
import '@/app/models/Contact';
import '@/app/models/Event';
import '@/app/models/File';
import '@/app/models/Gallery';
import '@/app/models/NavbarCategory';
import '@/app/models/Newsletter';
import '@/app/models/Product';
import '@/app/models/Registration';
import '@/app/models/Review';
import '@/app/models/Subcategory';

let isConnected = false;

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
} 