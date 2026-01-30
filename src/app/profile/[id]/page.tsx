import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/components/navbar';
import { EditProfileButton } from '@/components/edit-profile-button';

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      createdAt: true,
      posts: {
        include: {
          _count: {
            select: { comments: true, likes: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { posts: true, comments: true },
      },
    },
  });
  return user;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, session] = await Promise.all([
    getUser(id),
    getServerSession(authOptions),
  ]);

  if (!user) {
    notFound();
  }

  const isOwner = session?.user?.id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              {user.bio && (
                <p className="mt-4 text-gray-700">{user.bio}</p>
              )}
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <span>Posts {user._count.posts}</span>
                <span>Comments {user._count.comments}</span>
                <span>
                  Joined {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
            {isOwner && <EditProfileButton user={user} />}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Posts by {user.name}
        </h2>

        {user.posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Likes {post._count.likes}</span>
                    <span>Comments {post._count.comments}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
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
