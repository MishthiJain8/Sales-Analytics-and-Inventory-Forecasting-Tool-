"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    LayoutDashboard,
    Package,
    TrendingUp,
    Upload,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Data', href: '/upload', icon: Upload },
    { name: 'Sales Analysis', href: '/analysis', icon: BarChart3 },
    { name: 'Predictions', href: '/forecast', icon: TrendingUp },
    { name: 'Inventory', href: '/inventory', icon: Package },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const logout = useStore((state) => state.logout);

    const isActive = (href: string) => pathname === href;

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 bg-white rounded-lg shadow-md border border-slate-200"
                >
                    <Menu className="w-6 h-6 text-slate-600" />
                </button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 flex items-center justify-between">
                        {!isCollapsed && (
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                                SalesFlow
                            </span>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:block p-1 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                        active
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5",
                                        active ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"
                                    )} />
                                    {!isCollapsed && <span className="font-medium">{item.name}</span>}
                                    {active && !isCollapsed && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={logout}
                            className={cn(
                                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
                            )}
                        >
                            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600" />
                            {!isCollapsed && <span className="font-medium">Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
