import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/components/navbar';
import { LikeButton } from '@/components/like-button';
import { CommentSection } from '@/components/comment-section';
import { DeletePostButton } from '@/components/delete-post-button';

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true },
      },
      comments: {
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      likes: true,
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });
  return post;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, session] = await Promise.all([
    getPost(id),
    getServerSession(authOptions),
  ]);

  if (!post) {
    notFound();
  }

  const isAuthor = session?.user?.id === post.authorId;
  const hasLiked = post.likes.some((like) => like.userId === session?.user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              <Link
                href={`/profile/${post.author.id}`}
                className="font-medium text-gray-900 hover:text-blue-600"
              >
                {post.author.name}
              </Link>
              <span className="mx-2">·</span>
              <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Edit
                </Link>
                <DeletePostButton postId={post.id} />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="prose max-w-none mb-6 whitespace-pre-wrap">
            {post.content}
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t">
            <LikeButton
              postId={post.id}
              initialLiked={hasLiked}
              initialCount={post._count.likes}
            />
            <span className="text-gray-500">Comments {post._count.comments}</span>
          </div>
        </article>

        <CommentSection postId={post.id} initialComments={post.comments} />
      </main>
    </div>
  );
}
