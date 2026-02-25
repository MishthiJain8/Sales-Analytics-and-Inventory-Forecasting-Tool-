"use client";

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { Calendar, Filter, Download, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalysisPage() {
    const { salesData } = useStore();
    const [timeframe, setTimeframe] = useState<'30days' | '6months' | 'all'>('all');

    const filteredData = useMemo(() => {
        if (timeframe === '30days') return salesData.slice(-1); // Simplification for mock data "months"
        if (timeframe === '6months') return salesData.slice(-6);
        return salesData;
    }, [salesData, timeframe]);

    const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales Analysis</h1>
                    <p className="text-slate-500">Live data synchronization from Global State.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    <Download className="w-4 h-4" />
                    Export Reports
                </button>
            </div>

            {/* Persistence Info */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
                <Info className="w-5 h-5 text-indigo-600" />
                <p className="text-sm text-indigo-700 font-medium">These charts update instantly when new data is added via the Upload page. All data is saved to LocalStorage.</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit">
                {[
                    { id: '30days', label: 'Last 30 Days' },
                    { id: '6months', label: 'Last 6 Months' },
                    { id: 'all', label: 'All Time' }
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTimeframe(t.id as any)}
                        className={cn(
                            "px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                            timeframe === t.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Line Chart: Sales over Time */}
                <div className="card-premium p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Revenue Performance</h3>
                            <p className="text-sm text-slate-500 tracking-tight">Real-time revenue tracking across chosen period</p>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredData}>
                                <defs>
                                    <linearGradient id="colorAna" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={4}
                                    fill="url(#colorAna)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart: Monthly Revenue Comparison */}
                <div className="card-premium p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Order Volume Breakdown</h3>
                            <p className="text-sm text-slate-500 tracking-tight">Comparison of quantities sold</p>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="quantity" radius={[8, 8, 0, 0]} fill="#4f46e5">
                                    {filteredData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
