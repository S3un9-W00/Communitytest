'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Community
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/posts/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Write
                </Link>
                <Link
                  href={`/profile/${session.user.id}`}
                  className="text-gray-700 hover:text-gray-900"
                >
                  {session.user.name}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
