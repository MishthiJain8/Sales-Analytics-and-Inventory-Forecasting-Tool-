import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Upload,
    BarChart3,
    TrendingUp,
    Package,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useState } from 'react';
import { cn } from '../lib/utils';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Data Center', path: '/upload', icon: Upload },
    { name: 'Sales Analysis', path: '/analysis', icon: BarChart3 },
    { name: 'Forecast Engine', path: '/forecast', icon: TrendingUp },
    { name: 'Inventory', path: '/inventory', icon: Package },
];

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useData();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={cn(
            "bg-white border-r border-slate-200 h-screen sticky top-0 transition-all duration-300 z-50 flex flex-col",
            collapsed ? "w-20" : "w-64"
        )}>
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
                {!collapsed && (
                    <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                        SalesFlow
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 ml-auto"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group font-medium",
                            location.pathname === item.path
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        )}
                    >
                        <item.icon size={20} className={cn(
                            location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                        )} />
                        {!collapsed && <span>{item.name}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={logout}
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-3 text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all font-medium group"
                    )}
                >
                    <LogOut size={20} className="text-slate-400 group-hover:text-rose-600" />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
