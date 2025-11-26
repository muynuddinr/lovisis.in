import { NextResponse } from 'next/server';
import { connectDB as dbConnect } from '@/lib/db';
import Review from '@/app/models/Review';
import { authMiddleware } from '@/middleware/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(request as any);
  if (authResult.status !== 200) return authResult;

  try {
    await dbConnect();
    await Review.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}