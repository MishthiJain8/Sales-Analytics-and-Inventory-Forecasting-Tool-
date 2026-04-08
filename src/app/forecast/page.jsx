'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp,
    Search,
    ChevronDown,
    Target,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Calculator,
    Info
} from 'lucide-react';
import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea
} from 'recharts';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useData } from '@/context/DataContext';

export default function ForecastPage() {
    const { products, fetchProducts, fetchProductData } = useData();
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productRecords, setProductRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleProductSelect = async (name) => {
        setSelectedProduct(name);
        setLoading(true);
        const records = await fetchProductData(name);
        const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        setProductRecords(sorted);
        setLoading(false);
    };

    // Prediction Engine: Simple Linear Regression
    const forecastData = useMemo(() => {
        if (productRecords.length < 2) return null;

        const n = productRecords.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

        productRecords.forEach((r, i) => {
            sumX += i;
            sumY += r.revenue;
            sumXY += i * r.revenue;
            sumXX += i * i;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Generate Past Data Points
        const past = productRecords.map((r, i) => ({
            date: r.date,
            revenue: r.revenue,
            isForecast: false
        }));

        // Generate 12 months forecast
        const lastDate = new Date(productRecords[n - 1].date);
        const forecast = [];
        for (let j = 1; j <= 12; j++) {
            const nextDate = new Date(lastDate);
            nextDate.setMonth(lastDate.getMonth() + j);
            const dateStr = nextDate.toLocaleString('default', { month: 'short', year: 'numeric' });

            forecast.push({
                date: dateStr,
                forecastRevenue: Math.max(0, Math.round(slope * (n - 1 + j) + intercept)),
                isForecast: true
            });
        }

        // Connect the lines (last point of past = first point of forecast)
        const combined = [
            ...past.map(p => ({ ...p, forecastRevenue: p.revenue })),
            ...forecast
        ];

        const growthRate = (slope / (sumY / n)) * 100;

        return { combined, slope, growthRate, n };
    }, [productRecords]);

    const verdict = useMemo(() => {
        if (!forecastData) return null;
        const { slope, growthRate } = forecastData;

        if (growthRate > 5) {
            return {
                label: 'Strong Buy / Invest',
                desc: 'This product is scaling rapidly with a high upward revenue trajectory. Recommend increasing production budget by 20-35%.',
                color: 'bg-darkgreen text-beige',
                icon: Sparkles
            };
        } else if (growthRate > 0) {
            return {
                label: 'Monitor / Maintain',
                desc: 'Stable growth detected. The product is profitable and gaining steady market share. No immediate strategy shift required.',
                color: 'bg-softgreen text-darkgreen',
                icon: Target
            };
        } else {
            return {
                label: 'Phase Out / Discontinue',
                desc: 'Negative growth trajectory detected over current historical period. Consumer interest is waning. Consider liquidation or re-branding.',
                color: 'bg-rose-500 text-white',
                icon: AlertTriangle
            };
        }
    }, [forecastData]);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-beige">
                <Sidebar />

                <main className="flex-1 p-10 overflow-y-auto scrollbar-thin">
                    <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-darkgreen/5 p-2 rounded-lg">
                                    <TrendingUp className="text-darkgreen" size={20} />
                                </div>
                                <h1 className="text-3xl font-black text-darkgreen tracking-tight">Growth Forecasting</h1>
                            </div>
                            <p className="text-softgreen-500 font-bold uppercase text-xs tracking-widest ml-11">
                                Linear Regression Predictive Engine
                            </p>
                        </div>

                        {/* Product Selector */}
                        <div className="relative group min-w-[300px]">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-softgreen pointer-events-none group-focus-within:text-darkgreen transition-colors">
                                <Search size={18} />
                            </div>
                            <select
                                value={selectedProduct}
                                onChange={(e) => handleProductSelect(e.target.value)}
                                className="w-full pl-12 pr-10 py-4 bg-white border border-beige-300 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-darkgreen/5 focus:border-softgreen transition-all font-bold text-darkgreen appearance-none shadow-sm cursor-pointer"
                            >
                                <option value="">Select Target Product</option>
                                {products.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-softgreen pointer-events-none">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </header>

                    {!selectedProduct ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                            <div className="bg-white/50 p-10 rounded-[3rem] border-2 border-dashed border-beige-300">
                                <div className="bg-beige w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-darkgreen/20">
                                    <Calculator size={40} />
                                </div>
                                <h2 className="text-xl font-black text-darkgreen mb-2">Awaiting Forecast Target</h2>
                                <p className="text-softgreen-500 max-w-xs mx-auto font-medium">
                                    Initialize the predictive engine by selecting a product SKU. The engine requires longitudinal data to map trajectories.
                                </p>
                            </div>
                        </div>
                    ) : productRecords.length < 2 ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                            <div className="bg-rose-50 p-10 rounded-[3rem] border-2 border-dashed border-rose-200">
                                <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500/30">
                                    <Info size={40} />
                                </div>
                                <h2 className="text-xl font-black text-rose-900 mb-2">Insufficient Data</h2>
                                <p className="text-rose-700/70 max-w-sm mx-auto font-medium">
                                    At least 2 unique data points are required to calculate a growth vector. Please upload more history for <b>{selectedProduct}</b>.
                                </p>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="h-[60vh] flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full border-4 border-softgreen border-t-transparent animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
                            {/* Forecast Legend Bar */}
                            <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-beige-300 shadow-sm w-fit">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1 bg-darkgreen rounded-full"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-darkgreen">Historical Data</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1 bg-darkgreen rounded-full border-t-2 border-dashed border-white"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-darkgreen">12m Projection</span>
                                </div>
                            </div>

                            {/* Main Forecast Chart */}
                            <div className="bg-white p-10 rounded-[2.5rem] border border-beige-300 shadow-xl shadow-darkgreen/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 text-beige-100 -mr-10 -mt-10">
                                    <Sparkles size={160} strokeWidth={1} />
                                </div>

                                <div className="mb-10 relative">
                                    <h3 className="text-2xl font-black text-darkgreen tracking-tight">Projected Revenue Growth</h3>
                                    <p className="text-softgreen-500 font-bold uppercase text-[10px] tracking-[4px]">Trajectory Intelligence</p>
                                </div>

                                <div className="h-[500px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={forecastData.combined}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5dc" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#8FBC8F', fontSize: 10, fontWeight: 700 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#8FBC8F', fontSize: 10, fontWeight: 700 }}
                                                tickFormatter={(val) => `$${val}`}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                                formatter={(val, name) => [
                                                    `$${val.toLocaleString()}`,
                                                    name === 'revenue' ? 'Historical' : 'Forecast'
                                                ]}
                                            />

                                            {/* Historical Solid Line */}
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#004d00"
                                                strokeWidth={4}
                                                dot={{ r: 4, fill: '#004d00', strokeWidth: 0 }}
                                                activeDot={{ r: 6, strokeWidth: 0 }}
                                                animationDuration={1500}
                                                connectNulls
                                            />

                                            {/* Forecast Dashed Line */}
                                            <Line
                                                type="monotone"
                                                dataKey="forecastRevenue"
                                                stroke="#004d00"
                                                strokeWidth={4}
                                                strokeDasharray="8 8"
                                                dot={false}
                                                animationDuration={2500}
                                                animationBegin={1000}
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Verdict & Strategy Box */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className={`lg:col-span-2 p-10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-10 transition-colors duration-500 ${verdict.color}`}>
                                    <div className="bg-white/10 p-8 rounded-[2rem] backdrop-blur-sm shrink-0">
                                        <verdict.icon size={64} />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                            <CheckCircle2 size={16} />
                                            <span className="text-xs font-black uppercase tracking-[3px]">Algorithmic Verdict</span>
                                        </div>
                                        <h2 className="text-4xl font-black mb-4 tracking-tighter leading-tight">{verdict.label}</h2>
                                        <p className="font-bold text-lg opacity-90 max-w-xl leading-relaxed">
                                            {verdict.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-beige-300 flex flex-col justify-center">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-softgreen-500 uppercase tracking-widest mb-1">Growth Vector</p>
                                            <h4 className={`text-3xl font-black ${forecastData.growthRate > 0 ? 'text-darkgreen' : 'text-rose-500'}`}>
                                                {forecastData.growthRate > 0 ? '+' : ''}{forecastData.growthRate.toFixed(2)}%
                                            </h4>
                                        </div>
                                        <div className="h-px bg-beige-300 w-full" />
                                        <div>
                                            <p className="text-[10px] font-black text-softgreen-500 uppercase tracking-widest mb-1">Confidence Score</p>
                                            <h4 className="text-3xl font-black text-darkgreen">
                                                {Math.min(99, Math.round(75 + forecastData.n * 2))}%
                                            </h4>
                                        </div>
                                        <button
                                            onClick={() => window.print()}
                                            className="w-full bg-beige hover:bg-beige-300 text-darkgreen font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4"
                                        >
                                            Export Strategy Report <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
