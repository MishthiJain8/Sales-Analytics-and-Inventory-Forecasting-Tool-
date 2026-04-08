'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RootPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        }
    }, [isAuthenticated, loading, router]);

    return (
        <div className="min-h-screen bg-beige flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-darkgreen border-t-transparent animate-spin" />
        </div>
    );
}
