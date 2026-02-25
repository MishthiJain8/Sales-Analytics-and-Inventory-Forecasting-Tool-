import { Search, Bell, User } from 'lucide-react';

const Topbar = () => {
    return (
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="relative w-96 group hidden md:block">
                <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search for metrics, items, or reports..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                />
            </div>

            <div className="flex items-center gap-4 ml-auto lg:ml-0">
                <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white" />
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 leading-none">Admin User</p>
                        <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-tighter">Chief Analyst</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
