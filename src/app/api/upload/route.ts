import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import File from '@/app/models/File';
import { authMiddleware } from '@/middleware/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const authResult = await authMiddleware(request as any);
  if (authResult.status !== 200) return authResult;
  
  await connectDB();
  
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Save file to MongoDB
  const newFile = new File({
    name: file.name,
    type: file.type,
    size: file.size,
    data: buffer,
  });
  
  await newFile.save();
  
  return NextResponse.json({
    url: `/api/files/${newFile._id}`,
  });
}
