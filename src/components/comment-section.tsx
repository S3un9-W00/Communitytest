'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  author: {
    id: string;
    name: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }

    if (!content.trim()) return;

    setLoading(true);
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setContent('');
    }
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    const res = await fetch(`/api/comments?id=${commentId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Comments ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={session ? 'Write a comment...' : 'Login to comment'}
          disabled={!session}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={loading || !session || !content.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">
                  <Link
                    href={`/profile/${comment.author.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {comment.author.name}
                  </Link>
                  <span className="mx-2 text-gray-500">·</span>
                  <span className="text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                {session?.user?.id === comment.author.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
