'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    Upload,
    LogOut,
    TrendingUp,
    Package,
    DollarSign,
    ArrowUpRight,
    MessageCircle,
    Lightbulb,
    Send
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lineData, setLineData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [showQA, setShowQA] = useState(false);
    const [showInsights, setShowInsights] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await fetch('/api/data/upload');
            const result = await res.json();
            if (res.ok) {
                const records = result.records || [];
                setData(records);
                calculateAnalytics(records);
            }
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateAnalytics = (records) => {
        if (records.length === 0) {
            setSummary({ totalRevenue: 0, topProduct: 'N/A', avgInventory: 0, productCount: 0 });
            return;
        }

        // Summary stats
        const totalRevenue = records.reduce((sum, r) => sum + (r.revenue || r.sales || 0), 0);
        const productCount = new Set(records.map(r => r.product)).size;
        const avgInventory = records.reduce((sum, r) => sum + (r.inventory || 0), 0) / records.length;

        // Group by product for analysis
        const byProduct = {};
        records.forEach(r => {
            const prod = r.product || 'Unknown';
            if (!byProduct[prod]) byProduct[prod] = { revenue: 0, count: 0, inventory: [] };
            byProduct[prod].revenue += r.revenue || r.sales || 0;
            byProduct[prod].count++;
            if (r.inventory) byProduct[prod].inventory.push(r.inventory);
        });

        const topProduct = Object.entries(byProduct).sort((a, b) => b[1].revenue - a[1].revenue)[0]?.[0] || 'N/A';

        setSummary({
            totalRevenue: totalRevenue.toFixed(0),
            topProduct,
            avgInventory: avgInventory.toFixed(0),
            productCount
        });

        // Time series data (by date)
        const byDate = {};
        records.forEach(r => {
            const date = r.date || new Date().toISOString().split('T')[0];
            if (!byDate[date]) byDate[date] = 0;
            byDate[date] += r.revenue || r.sales || 0;
        });

        const timeSeriesData = Object.entries(byDate)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .slice(-30)
            .map(([date, revenue]) => ({
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: Math.round(revenue)
            }));
        setLineData(timeSeriesData);

        // Product performance (bar chart)
        const productPerf = Object.entries(byProduct)
            .map(([name, data]) => ({
                name: name.substring(0, 15),
                revenue: Math.round(data.revenue),
                count: data.count
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 8);
        setBarData(productPerf);

        // Product revenue distribution (pie chart)
        const productDist = Object.entries(byProduct)
            .map(([name, data]) => ({
                name,
                value: Math.round(data.revenue)
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
        setPieData(productDist);
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

    const generateInsights = () => {
        if (!summary) return '';
        
        const totalRev = parseInt(summary.totalRevenue);
        const avgInv = parseInt(summary.avgInventory);
        const topProd = summary.topProduct;
        
        let insight = `Based on your sales data: `;
        insight += `Your top performer is **${topProd}** generating significant revenue. `;
        insight += `Total revenue across all products is **$${totalRev.toLocaleString()}**. `;
        insight += `Average inventory level is **${avgInv} units**. `;
        
        if (lineData.length > 1) {
            const latestRevenue = lineData[lineData.length - 1]?.revenue || 0;
            const previousRevenue = lineData[lineData.length - 2]?.revenue || 0;
            const trend = latestRevenue > previousRevenue ? 'increasing' : 'decreasing';
            insight += `Recent trend shows **${trend}** revenue momentum. `;
        }
        
        insight += `**Recommendation:** Focus on maintaining inventory for high performers while monitoring underperforming products.`;
        return insight;
    };

    const handleAddQuestion = () => {
        if (!currentQuestion.trim()) return;
        
        const answers = {
            'top product': `The top product is ${summary?.topProduct} with the highest revenue.`,
            'total revenue': `Your total revenue is $${summary?.totalRevenue}.`,
            'inventory': `Average inventory level is ${summary?.avgInventory} units.`,
            'products': `You have ${summary?.productCount} different products.`,
            'best seller': `Your best seller is ${summary?.topProduct}.`,
            'sales trend': `Your sales show recent activity across ${data.length} records.`,
            'high revenue': `Your highest revenue product is ${summary?.topProduct}.`,
        };
        
        let answer = 'Based on your data: ';
        const question = currentQuestion.toLowerCase();
        for (const [key, value] of Object.entries(answers)) {
            if (question.includes(key)) {
                answer = value;
                break;
            }
        }
        if (answer === 'Based on your data: ') {
            answer = `I found ${data.length} sales records with ${summary?.productCount} products. The top performer is ${summary?.topProduct}.`;
        }
        
        setQuestions([...questions, { q: currentQuestion, a: answer }]);
        setCurrentQuestion('');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="text-blue-600" size={28} />
                                <h1 className="text-2xl font-serif font-bold text-gray-900">Sales Analytics</h1>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-sm font-medium text-gray-600">{user?.email}</div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="flex gap-8">
                            <button
                                onClick={() => { setShowInsights(true); setShowQA(false); }}
                                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                                    showInsights
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Lightbulb className="inline mr-2" size={18} />
                                Insights & Analysis
                            </button>
                            <button
                                onClick={() => { setShowQA(true); setShowInsights(false); }}
                                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                                    showQA
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <MessageCircle className="inline mr-2" size={18} />
                                Q&A
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {/* Upload Button */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.push('/upload')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                            <Upload className="inline mr-2" size={18} />
                            Upload Sales Data
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading analytics...</p>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                            <Package className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-700 mb-4 text-lg font-semibold">No data uploaded yet</p>
                            <p className="text-gray-600 mb-6">Upload a CSV file to see your sales analytics</p>
                            <button
                                onClick={() => router.push('/upload')}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                            >
                                <Upload size={18} />
                                Upload Your First File
                            </button>
                        </div>
                    ) : (
                        <>
                            {showInsights && (
                                <>
                                    {/* Key Metrics */}
                                    {summary && (
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                            {[
                                                { label: 'Total Revenue', value: `$${summary.totalRevenue}`, icon: DollarSign },
                                                { label: 'Top Product', value: summary.topProduct, icon: TrendingUp },
                                                { label: 'Avg Inventory', value: summary.avgInventory, icon: Package },
                                                { label: 'Products', value: summary.productCount, icon: BarChart3 }
                                            ].map((metric, i) => {
                                                const Icon = metric.icon;
                                                return (
                                                    <div key={i} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-200 transition-colors">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <p className="text-gray-600 text-sm font-medium mb-1">{metric.label}</p>
                                                                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                                                            </div>
                                                            <Icon className="text-blue-600" size={28} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Insights Summary */}
                                    <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
                                        <div className="flex gap-4">
                                            <Lightbulb className="text-blue-600 flex-shrink-0" size={24} />
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-2">Executive Summary</h3>
                                                <p className="text-gray-700 leading-relaxed font-serif text-sm">
                                                    {generateInsights()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Charts Grid */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                                        {/* Revenue Trend */}
                                        {lineData.length > 0 && (
                                            <div className="bg-white rounded-lg p-6 border border-gray-200 col-span-2">
                                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                    <TrendingUp className="text-blue-600" size={20} />
                                                    Revenue Trend
                                                </h3>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <LineChart data={lineData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                        <XAxis dataKey="date" stroke="#6b7280" />
                                                        <YAxis stroke="#6b7280" />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                                            labelStyle={{ color: '#111827' }}
                                                            formatter={(value) => `$${value.toLocaleString()}`}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="revenue"
                                                            stroke="#2563eb"
                                                            strokeWidth={2}
                                                            dot={{ r: 4, fill: '#2563eb' }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}

                                        {/* Top Products */}
                                        {barData.length > 0 && (
                                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                    <ArrowUpRight className="text-green-600" size={20} />
                                                    Top Products
                                                </h3>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <BarChart data={barData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                        <XAxis dataKey="name" stroke="#6b7280" />
                                                        <YAxis stroke="#6b7280" />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                                            labelStyle={{ color: '#111827' }}
                                                            formatter={(value) => `$${value.toLocaleString()}`}
                                                        />
                                                        <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}

                                        {/* Product Distribution */}
                                        {pieData.length > 0 && (
                                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Distribution</h3>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <PieChart>
                                                        <Pie
                                                            data={pieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={({ name, value }) => `${name}: $${value}`}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {pieData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px' }}
                                                            labelStyle={{ color: '#111827' }}
                                                            formatter={(value) => `$${value.toLocaleString()}`}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                    </div>

                                    {/* Data Table */}
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-lg font-bold text-gray-900">Recent Records</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-200 bg-gray-50">
                                                        <th className="text-left px-6 py-3 text-gray-700 font-semibold">Date</th>
                                                        <th className="text-left px-6 py-3 text-gray-700 font-semibold">Product</th>
                                                        <th className="text-right px-6 py-3 text-gray-700 font-semibold">Revenue</th>
                                                        <th className="text-right px-6 py-3 text-gray-700 font-semibold">Inventory</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.slice(0, 10).map((row, i) => (
                                                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                                            <td className="px-6 py-3 text-gray-900">{row.date || 'N/A'}</td>
                                                            <td className="px-6 py-3 text-gray-900">{row.product}</td>
                                                            <td className="text-right px-6 py-3 text-green-600 font-semibold">${(row.revenue || row.sales || 0).toLocaleString()}</td>
                                                            <td className="text-right px-6 py-3 text-gray-700">{row.inventory || 0}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}

                            {showQA && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Ask About Your Data</h3>
                                    
                                    {/* Q&A History */}
                                    <div className="mb-6 max-h-96 overflow-y-auto">
                                        {questions.length === 0 ? (
                                            <p className="text-gray-500 text-sm italic">Ask a question about your sales data to get started</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {questions.map((item, i) => (
                                                    <div key={i} className="border-l-4 border-blue-600 pl-4 py-2">
                                                        <p className="text-gray-700 font-semibold mb-1">Q: {item.q}</p>
                                                        <p className="text-gray-600 text-sm">A: {item.a}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Input */}
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={currentQuestion}
                                            onChange={(e) => setCurrentQuestion(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
                                            placeholder="E.g., What's my top product? What's the total revenue?"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
                                        />
                                        <button
                                            onClick={handleAddQuestion}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
