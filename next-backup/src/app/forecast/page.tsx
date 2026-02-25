"use client";

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { predictSales } from '@/lib/forecasting';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ReferenceLine,
    Legend
} from 'recharts';
import { Sparkles, TrendingUp, Calendar, Info, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ForecastPage() {
    const { salesData } = useStore();
    const [horizon, setHorizon] = useState(3);

    const predictions = useMemo(() => predictSales(salesData, horizon), [salesData, horizon]);

    const combinedData = useMemo(() => {
        // Show last 6 months of historical data
        const historical = salesData.slice(-6).map(d => ({
            date: d.date,
            revenue: d.revenue,
            isPrediction: false
        }));

        // Create the overlap point (last actual month) for a continuous line
        const lastActual = historical[historical.length - 1];

        const future = predictions.map(p => ({
            date: p.date,
            revenue: p.predictedRevenue,
            isPrediction: true
        }));

        return [...historical, ...future];
    }, [salesData, predictions]);

    const projectedTotal = predictions.reduce((acc, curr) => acc + curr.predictedRevenue, 0);
    const avgHistorical = salesData.slice(-3).reduce((acc, curr) => acc + curr.revenue, 0) / 3;
    const growthRate = ((projectedTotal / horizon - avgHistorical) / avgHistorical * 100).toFixed(1);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales Prediction</h1>
                    <p className="text-slate-500">Live forecasting engine tracking {salesData.length} records.</p>
                </div>
                <div className="flex items-center gap-4 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <span className="text-xs font-bold text-slate-500 ml-3 uppercase tracking-wider">Forecast Horizon:</span>
                    <div className="flex gap-1">
                        {[1, 3, 6].map((m) => (
                            <button
                                key={m}
                                onClick={() => setHorizon(m)}
                                className={cn(
                                    "px-4 py-1.5 rounded-xl text-sm font-bold transition-all",
                                    horizon === m ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:text-indigo-600"
                                )}
                            >
                                {m}m
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Metric Cards */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                        <Sparkles className="w-8 h-8 text-indigo-200 mb-6" />
                        <h3 className="text-indigo-100 text-sm font-medium">Projected Revenue</h3>
                        <p className="text-3xl font-bold mt-1">${projectedTotal.toLocaleString()}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded-full border border-white/10">
                            <Calendar className="w-3 h-3" />
                            Next {horizon} Months
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
                        <TrendingUp className="w-8 h-8 text-emerald-200 mb-6" />
                        <h3 className="text-emerald-100 text-sm font-medium">Projected Growth</h3>
                        <p className="text-3xl font-bold mt-1">+{growthRate}%</p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded-full border border-white/10">
                            <ArrowUp className="w-3 h-3" />
                            Above historical avg
                        </div>
                    </div>

                    <div className="card-premium p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-4 h-4 text-slate-400" />
                            <h4 className="text-sm font-bold text-slate-900">Prediction Engine</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Uses a Linear Regression utility to compute trends from the global sales state. Forecasts are instantly recalculated when you add data.
                        </p>
                    </div>
                </div>

                {/* Prediction Chart */}
                <div className="lg:col-span-3 card-premium p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900">Historical vs. Predicted Trends</h3>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                Historical Data
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <div className="w-3 h-3 rounded-full border-2 border-dashed border-indigo-400" />
                                AI Projection
                            </div>
                        </div>
                    </div>

                    <div className="h-[430px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={combinedData}>
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
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={4}
                                    dot={false}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    strokeDasharray={(entry: any) => entry?.isPrediction ? "8 8" : "0"}
                                />
                                <ReferenceLine
                                    x={salesData[salesData.length - 1].date}
                                    stroke="#94a3b8"
                                    strokeDasharray="3 3"
                                    label={{ value: 'TODAY', position: 'top', fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
