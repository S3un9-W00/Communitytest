import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Failed to get posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content required' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
