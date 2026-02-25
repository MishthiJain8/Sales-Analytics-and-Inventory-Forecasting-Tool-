"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useStore } from '@/store/useStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated && pathname !== '/login') {
            router.push('/login');
        }
    }, [isAuthenticated, pathname, router]);

    if (pathname === '/login') {
        return <main className="min-h-screen bg-slate-50">{children}</main>;
    }

    // Prevent flash of content if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto pt-12 lg:pt-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
