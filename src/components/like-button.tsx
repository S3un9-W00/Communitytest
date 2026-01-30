'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });

    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setCount((prev) => (data.liked ? prev + 1 : prev - 1));
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
        liked
          ? 'bg-red-100 text-red-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      <span>{liked ? 'Liked' : 'Like'}</span>
      <span>{count}</span>
    </button>
  );
}
