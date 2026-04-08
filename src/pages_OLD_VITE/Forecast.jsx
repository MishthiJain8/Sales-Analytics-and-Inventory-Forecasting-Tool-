import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend
} from 'recharts';
import { Sparkles, TrendingUp, Info, ArrowUpRight, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

const Forecast = () => {
    const { salesData } = useData();
    const [horizon, setHorizon] = useState(3);

    // Prediction Logic: Simple Linear Regression Trend
    const predictions = useMemo(() => {
        if (salesData.length < 2) return [];

        // Convert dates to indices for calculation
        const n = salesData.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = salesData.map(d => d.revenue);

        // Basic Linear Regression Formulas
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
        const sumXX = x.reduce((a, b) => a + b * b, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Forecast future points
        const lastMonth = salesData[salesData.length - 1].date;
        const [monthName, year] = lastMonth.split(' ');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthIdx = months.indexOf(monthName);
        let currentYear = parseInt(year);

        return Array.from({ length: horizon }).map((_, i) => {
            const xFuture = n + i;
            const predRevenue = Math.round(slope * xFuture + intercept);

            monthIdx++;
            if (monthIdx > 11) {
                monthIdx = 0;
                currentYear++;
            }

            return {
                date: `${months[monthIdx]} ${currentYear}`,
                revenue: predRevenue,
                isPrediction: true
            };
        });
    }, [salesData, horizon]);

    const combinedData = useMemo(() => {
        const historical = salesData.slice(-6).map(d => ({ ...d, isPrediction: false }));
        // Connect the line at the last actual point
        const lastActual = historical[historical.length - 1];
        return [...historical, ...predictions];
    }, [salesData, predictions]);

    const projectedTotal = predictions.reduce((acc, curr) => acc + curr.revenue, 0);
    const growthRate = (((predictions[predictions.length - 1]?.revenue / salesData[salesData.length - 1].revenue) - 1) * 100).toFixed(1);

    return (
        <div className="space-y-8 animate-in mt-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Predictive Intelligence Engine</h1>
                    <p className="text-slate-500 font-medium">Computing future revenue trajectories based on {salesData.length} data points.</p>
                </div>

                <div className="flex items-center gap-4 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Horizon:</span>
                    <div className="flex gap-1">
                        {[1, 3, 6].map((m) => (
                            <button
                                key={m}
                                onClick={() => setHorizon(m)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-black transition-all",
                                    horizon === m ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {m}M
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                        <Sparkles className="absolute -top-4 -right-4 text-white/10 w-32 h-32 group-hover:rotate-12 transition-transform duration-500" />
                        <h4 className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-6">Total Projected Revenue</h4>
                        <p className="text-4xl font-black leading-none">${projectedTotal.toLocaleString()}</p>
                        <div className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">
                            <Calendar size={14} />
                            Next {horizon} Months
                        </div>
                    </div>

                    <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-100 relative overflow-hidden">
                        <TrendingUp className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32" />
                        <h4 className="text-emerald-100 text-xs font-black uppercase tracking-widest mb-6">Growth Trajectory</h4>
                        <p className="text-4xl font-black leading-none">{growthRate > 0 ? '+' : ''}{growthRate}%</p>
                        <div className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">
                            <ArrowUpRight size={14} />
                            End of Period
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Info size={16} className="text-indigo-600" />
                            <h4 className="text-sm font-black text-slate-900">Algorithm Logic</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed">
                            Uses a Least Squares Linear Regression model to find the best-fit line across all historical records. Higher variance in recent data will influence the slope more steeply.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900">Revenue Prediction Map</h3>
                        <div className="flex gap-6 items-center">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                Historical
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <div className="w-3 h-3 border-2 border-dashed border-indigo-400 rounded-full" />
                                Dashed AI Projection
                            </div>
                        </div>
                    </div>

                    <div className="h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={combinedData}>
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
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={6}
                                    dot={false}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                    strokeDasharray={(entry) => entry?.isPrediction ? "8 8" : "0"}
                                />
                                <ReferenceLine
                                    x={salesData[salesData.length - 1].date}
                                    stroke="#94a3b8"
                                    strokeDasharray="5 5"
                                    label={{ value: 'CALCULATION POINT', position: 'top', fill: '#94a3b8', fontSize: 10, fontWeight: 'black' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forecast;
