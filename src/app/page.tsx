import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/navbar';

async function getPosts() {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: { id: true, name: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return posts;
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Posts</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No posts yet.</p>
            <Link
              href="/posts/new"
              className="mt-4 inline-block text-blue-600 hover:text-blue-500"
            >
              Write the first post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author.name}</span>
                    <div className="flex items-center space-x-4">
                      <span>Likes {post._count.likes}</span>
                      <span>Comments {post._count.comments}</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
