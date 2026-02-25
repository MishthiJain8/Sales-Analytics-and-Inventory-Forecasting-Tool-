import { useData } from '../context/DataContext';
import {
    DollarSign,
    ShoppingCart,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Package,
    Upload
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { salesData, inventory } = useData();
    const navigate = useNavigate();

    const totalRevenue = salesData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalItemsSold = salesData.reduce((acc, curr) => acc + curr.quantity, 0);
    const lowStockAlerts = inventory.filter(item => item.stock < 20).length;

    const stats = [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Items Sold', value: totalItemsSold.toLocaleString(), change: '+8.2%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Low Stock Alerts', value: lowStockAlerts, change: lowStockAlerts > 5 ? '+2' : '-1', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Analytics Executive Overview</h1>
                    <p className="text-slate-500 font-medium">Real-time business intelligence synchronizing now.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/upload')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-sm"
                    >
                        <Upload size={18} />
                        Data Center
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} p-3 rounded-2xl`}>
                                <stat.icon className={`${stat.color}`} size={24} />
                            </div>
                            <div className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight size={14} />
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-600" />
                            Sales Volume Performance
                        </h3>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData.slice(-10)}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                    formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Package size={20} className="text-indigo-600" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => navigate('/upload')}
                            className="group p-4 bg-indigo-50 hover:bg-indigo-600 rounded-2xl transition-all duration-300 flex items-center justify-between"
                        >
                            <div className="text-left">
                                <p className="text-sm font-black text-indigo-900 group-hover:text-white transition-colors">Import Data</p>
                                <p className="text-xs text-indigo-400 group-hover:text-indigo-200 transition-colors">CSV or Manual Entry</p>
                            </div>
                            <ArrowUpRight className="text-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-45" />
                        </button>
                        <button
                            onClick={() => navigate('/forecast')}
                            className="group p-4 bg-emerald-50 hover:bg-emerald-600 rounded-2xl transition-all duration-300 flex items-center justify-between"
                        >
                            <div className="text-left">
                                <p className="text-sm font-black text-emerald-900 group-hover:text-white transition-colors">Predict Growth</p>
                                <p className="text-xs text-emerald-400 group-hover:text-emerald-200 transition-colors">AI Forecasting</p>
                            </div>
                            <ArrowUpRight className="text-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-45" />
                        </button>
                        <button
                            onClick={() => navigate('/inventory')}
                            className="group p-4 bg-blue-50 hover:bg-blue-600 rounded-2xl transition-all duration-300 flex items-center justify-between"
                        >
                            <div className="text-left">
                                <p className="text-sm font-black text-blue-900 group-hover:text-white transition-colors">Check Stock</p>
                                <p className="text-xs text-blue-400 group-hover:text-blue-200 transition-colors">Manage Products</p>
                            </div>
                            <ArrowUpRight className="text-blue-600 group-hover:text-white transition-all transform group-hover:rotate-45" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
