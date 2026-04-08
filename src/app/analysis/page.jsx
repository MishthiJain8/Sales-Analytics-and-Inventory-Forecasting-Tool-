'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    BarChart3,
    Search,
    Filter,
    DollarSign,
    ShoppingCart,
    Percent,
    Calendar,
    ChevronDown
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Area,
    AreaChart
} from 'recharts';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useData } from '@/context/DataContext';

export default function AnalysisPage() {
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
        // Ensure chronological sort
        const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        setProductRecords(sorted);
        setLoading(false);
    };

    const metrics = useMemo(() => {
        if (productRecords.length === 0) return null;
        const totalRev = productRecords.reduce((sum, r) => sum + r.revenue, 0);
        const totalUnits = productRecords.reduce((sum, r) => sum + r.unitsSold, 0);
        const avgMargin = productRecords.reduce((sum, r) => sum + r.profitMargin, 0) / productRecords.length;
        return { totalRev, totalUnits, avgMargin };
    }, [productRecords]);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-beige">
                <Sidebar />

                <main className="flex-1 p-10 overflow-y-auto scrollbar-thin">
                    <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-darkgreen/5 p-2 rounded-lg">
                                    <BarChart3 className="text-darkgreen" size={20} />
                                </div>
                                <h1 className="text-3xl font-black text-darkgreen tracking-tight">Product Analysis</h1>
                            </div>
                            <p className="text-softgreen-500 font-bold uppercase text-xs tracking-widest ml-11">
                                Deep Dive into Single SKU Performance
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
                                <option value="">Select a Product Account</option>
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
                                    <Filter size={40} />
                                </div>
                                <h2 className="text-xl font-black text-darkgreen mb-2">No Product Selected</h2>
                                <p className="text-softgreen-500 max-w-xs mx-auto font-medium">
                                    Choose a product from the dropdown above to view its historical profitability and revenue streams.
                                </p>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="h-[60vh] flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full border-4 border-softgreen border-t-transparent animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Quick Summary Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-3xl border border-beige-300 shadow-sm flex items-center gap-6">
                                    <div className="bg-beige p-4 rounded-2xl text-darkgreen">
                                        <DollarSign size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-softgreen-500 uppercase tracking-widest">Total Lifecycle Revenue</p>
                                        <h4 className="text-2xl font-black text-darkgreen">${metrics?.totalRev.toLocaleString()}</h4>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-beige-300 shadow-sm flex items-center gap-6">
                                    <div className="bg-softgreen/10 p-4 rounded-2xl text-softgreen">
                                        <ShoppingCart size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-softgreen-500 uppercase tracking-widest">Units Distributed</p>
                                        <h4 className="text-2xl font-black text-darkgreen">{metrics?.totalUnits.toLocaleString()}</h4>
                                    </div>
                                </div>

                                <div className="bg-darkgreen p-6 rounded-3xl shadow-xl flex items-center gap-6 text-beige">
                                    <div className="bg-darkgreen-600 p-4 rounded-2xl text-softgreen">
                                        <Percent size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-softgreen/50 uppercase tracking-widest">Avg. Profit Margin</p>
                                        <h4 className="text-2xl font-black text-beige">{metrics?.avgMargin.toFixed(1)}%</h4>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 gap-8">
                                {/* Revenue & Margin Composed Chart */}
                                <div className="bg-white p-10 rounded-[2.5rem] border border-beige-300 shadow-xl shadow-darkgreen/5">
                                    <div className="flex items-center justify-between mb-10">
                                        <div>
                                            <h3 className="text-xl font-black text-darkgreen tracking-tight">Financial Health Performance</h3>
                                            <p className="text-softgreen-500 text-sm font-medium">Tracking revenue vs. margin efficiency overtime</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-darkgreen">
                                                <div className="w-3 h-3 bg-darkgreen rounded-full"></div> Revenue
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-softgreen">
                                                <div className="w-3 h-3 bg-softgreen rounded-full"></div> Margin (%)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[450px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={productRecords}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5dc" />
                                                <XAxis
                                                    dataKey="date"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#8FBC8F', fontSize: 10, fontWeight: 700 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    yAxisId="left"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#004d00', fontSize: 10, fontWeight: 700 }}
                                                    tickFormatter={(val) => `$${val}`}
                                                />
                                                <YAxis
                                                    yAxisId="right"
                                                    orientation="right"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#8FBC8F', fontSize: 10, fontWeight: 700 }}
                                                    tickFormatter={(val) => `${val}%`}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                                />
                                                <Line
                                                    yAxisId="left"
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#004d00"
                                                    strokeWidth={4}
                                                    dot={{ r: 6, fill: '#004d00', strokeWidth: 0 }}
                                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                                    animationDuration={1500}
                                                />
                                                <Line
                                                    yAxisId="right"
                                                    type="stepAfter"
                                                    dataKey="profitMargin"
                                                    stroke="#8FBC8F"
                                                    strokeWidth={3}
                                                    strokeDasharray="5 5"
                                                    dot={false}
                                                    animationDuration={1500}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Units Distributed Chart */}
                                <div className="bg-white p-10 rounded-[2.5rem] border border-beige-300 shadow-sm relative overflow-hidden group">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-darkgreen tracking-tight">Unit Velocity</h3>
                                        <div className="bg-beige p-2 rounded-xl text-darkgreen">
                                            <Calendar size={18} />
                                        </div>
                                    </div>
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={productRecords}>
                                                <defs>
                                                    <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#004d00" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#004d00" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="date" hide />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                    formatter={(val) => [val.toLocaleString(), 'Units Sold']}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="unitsSold"
                                                    stroke="#004d00"
                                                    fillOpacity={1}
                                                    fill="url(#colorUnits)"
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
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
