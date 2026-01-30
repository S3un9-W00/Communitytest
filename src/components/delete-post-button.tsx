'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setLoading(true);
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      alert('Failed to delete post');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
