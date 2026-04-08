'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Upload,
    BarChart3,
    TrendingUp,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Data', href: '/upload', icon: Upload },
    { name: 'Product Analysis', href: '/analysis', icon: BarChart3 },
    { name: 'Forecasting', href: '/forecast', icon: TrendingUp },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside className="w-64 bg-darkgreen text-beige flex flex-col h-screen sticky top-0 border-r border-darkgreen-400">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-softgreen p-2 rounded-xl">
                        <BarChart3 className="text-darkgreen" size={24} />
                    </div>
                    <h1 className="text-xl font-black tracking-tight leading-tight">
                        ANALYTICS<br />
                        <span className="text-softgreen">ENGINE</span>
                    </h1>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-softgreen text-darkgreen font-bold shadow-lg shadow-black/20"
                                        : "hover:bg-darkgreen-600/50 text-softgreen/70 hover:text-softgreen"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} />
                                    <span className="text-sm">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-darkgreen-400/30">
                <div className="bg-darkgreen-600/30 rounded-2xl p-4 mb-4">
                    <p className="text-[10px] uppercase tracking-widest text-softgreen/50 font-bold mb-1">
                        Logged in as
                    </p>
                    <p className="text-sm font-medium truncate text-beige">
                        {user?.email || 'User'}
                    </p>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors group"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-bold">Logout</span>
                </button>
            </div>
        </aside>
    );
}
