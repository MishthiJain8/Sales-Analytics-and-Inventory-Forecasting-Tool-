import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
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
    AreaChart,
    Area,
    Cell
} from 'recharts';
import { Calendar, Download, Filter, Info, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const Analysis = () => {
    const { salesData } = useData();
    const [filter, setFilter] = useState('all');

    const filteredData = useMemo(() => {
        if (filter === '30days') return salesData.slice(-1); // Assuming 1 entry = 1 month in mock
        if (filter === '6months') return salesData.slice(-6);
        return salesData;
    }, [salesData, filter]);

    const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Advanced Sales Analysis</h1>
                    <p className="text-slate-500 font-medium">Multidimensional breakdown of historical performance matrix.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
                        {[
                            { id: '30days', label: '30D' },
                            { id: '6months', label: '6M' },
                            { id: 'all', label: 'All' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setFilter(t.id)}
                                className={cn(
                                    "px-4 py-1.5 rounded-xl text-xs font-black transition-all",
                                    filter === t.id ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Persistence Note */}
            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white flex items-center gap-4 shadow-xl shadow-indigo-100">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Info size={24} />
                </div>
                <div>
                    <p className="font-black text-sm uppercase tracking-wide">Live Data Sync Active</p>
                    <p className="text-xs font-bold text-indigo-100 mt-1">These charts are reading directly from the Global Context. Any updates in the Data Center reflect here instantly through React State and LocalStorage persistence.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {/* Revenue Performance Chart */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <BarChart2 className="text-slate-50" size={120} />
                    </div>
                    <div className="relative">
                        <h3 className="text-xl font-black text-slate-900 mb-2">Revenue Growth Dynamics</h3>
                        <p className="text-sm text-slate-500 font-medium mb-10">Tracking Gross Revenue across synchronized reporting periods</p>

                        <div className="h-[450px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filteredData}>
                                    <defs>
                                        <linearGradient id="colorAna" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                                        formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#4f46e5"
                                        strokeWidth={6}
                                        fillOpacity={1}
                                        fill="url(#colorAna)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Units Sold Chart */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-2">Volume Allocation Matrix</h3>
                    <p className="text-sm text-slate-500 font-medium mb-10">Breakdown of product unit units shifted per cycle</p>

                    <div className="h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                                />
                                <Bar dataKey="quantity" radius={[12, 12, 0, 0]} fill="#4f46e5" barSize={60}>
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
};

// Internal icon for styling
const BarChart2 = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

export default Analysis;
