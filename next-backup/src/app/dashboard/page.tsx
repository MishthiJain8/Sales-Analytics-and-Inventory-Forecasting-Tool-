"use client";

import { useStore } from '@/store/useStore';
import {
    TrendingUp,
    Users,
    AlertTriangle,
    ArrowUpRight,
    Plus,
    TrendingDown,
    ChevronRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const { salesData, inventory } = useStore();

    const totalRevenue = salesData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalItemsSold = salesData.reduce((acc, curr) => acc + curr.quantity, 0);
    const lowStockItems = inventory.filter(item => item.status !== 'In Stock');

    const last7Days = salesData.slice(-7);

    const stats = [
        {
            label: 'Total Revenue (YTD)',
            value: `$${totalRevenue.toLocaleString()}`,
            change: '+12.5%',
            positive: true,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Total Items Sold',
            value: totalItemsSold.toLocaleString(),
            change: '+8.2%',
            positive: true,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Low Stock Alerts',
            value: lowStockItems.length.toString(),
            change: lowStockItems.length > 3 ? '+2' : '-1',
            positive: lowStockItems.length <= 3,
            icon: AlertTriangle,
            color: lowStockItems.length > 0 ? 'text-rose-600' : 'text-emerald-600',
            bg: lowStockItems.length > 0 ? 'bg-rose-50' : 'bg-emerald-50'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500">Welcome back! Heres whats happening with your sales today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/upload"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Upload Data</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card-premium p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                                stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}>
                                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart Preview */}
                <div className="lg:col-span-2 card-premium p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Sales Trends</h3>
                        <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20">
                            <option>Last 7 Months</option>
                            <option>Last 12 Months</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData.slice(-7)}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Low Stock Items preview */}
                <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Inventory Alerts</h3>
                        <Link href="/inventory" className="text-indigo-600 text-sm font-medium hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {inventory.filter(i => i.status !== 'In Stock').slice(0, 4).map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">{item.name}</span>
                                    <span className="text-xs text-slate-500">SKU: {item.sku}</span>
                                </div>
                                <div className="text-right">
                                    <p className={cn(
                                        "text-xs font-bold px-2 py-0.5 rounded-full inline-block",
                                        item.status === 'Low Stock' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                                    )}>
                                        {item.stock} left
                                    </p>
                                </div>
                            </div>
                        ))}
                        {lowStockItems.length === 0 && (
                            <div className="text-center py-10">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <p className="text-sm text-slate-500">All items are in stock!</p>
                            </div>
                        )}
                        <Link
                            href="/inventory"
                            className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Manage Inventory
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
