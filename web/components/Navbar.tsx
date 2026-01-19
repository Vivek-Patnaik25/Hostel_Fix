'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <Link href="/" className="flex flex-shrink-0 items-center">
                            <span className="text-xl font-bold text-indigo-600">HostelFix</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700">
                                    {session.user?.name} ({session.user?.role})
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <Link href="/auth/login" className="text-sm font-semibold leading-6 text-gray-900">
                                Log in <span aria-hidden="true">&rarr;</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
