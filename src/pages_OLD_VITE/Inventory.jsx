import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, Plus, Minus, Trash2, AlertTriangle, Package, Filter, X } from 'lucide-react';
import { cn } from '../lib/utils';

const Inventory = () => {
    const { inventory, updateStock, addInventoryItem, deleteInventoryItem } = useData();
    const [search, setSearch] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', sku: '', category: 'Coffee', stock: 0 });

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase())
    );

    const getStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'bg-rose-100 text-rose-700 border-rose-200' };
        if (stock < 20) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-700 border-amber-200' };
        return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    };

    const handleCreate = (e) => {
        e.preventDefault();
        addInventoryItem({ ...newItem, stock: parseInt(newItem.stock) });
        setNewItem({ name: '', sku: '', category: 'Coffee', stock: 0 });
        setIsAdding(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Inventory Management</h1>
                    <p className="text-slate-500 font-medium">Advanced catalog control with synchronized stock registries.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-sm"
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                    {isAdding ? 'Close Panel' : 'Provision New Item'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-100 shadow-xl animate-in zoom-in-95 duration-300">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Designation</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Arabica Beans"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">SKU ID</label>
                            <input
                                required
                                type="text"
                                placeholder="PRO-00X"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                value={newItem.sku}
                                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Initial Reserve</label>
                            <input
                                required
                                type="number"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                value={newItem.stock}
                                onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg">
                            Confirm Provisioning
                        </button>
                    </form>
                </div>
            )}

            {inventory.some(i => i.stock < 20) && (
                <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-[2rem] flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                        <AlertTriangle size={32} />
                    </div>
                    <div>
                        <p className="font-black text-amber-900 text-lg">Supply Chain Alerts Detected</p>
                        <p className="text-sm font-bold text-amber-700">Multiple items have fallen below the 20-unit safety threshold. Action required.</p>
                    </div>
                </div>
            )}

            <div className="relative group">
                <Search className="absolute left-5 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Filter catalog by product name, SKU, or category metrics..."
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm font-bold text-slate-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Article Details</th>
                                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Reserve Control</th>
                                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Inventory Health</th>
                                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredInventory.map((item) => {
                                const status = getStatus(item.stock);
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 leading-none">{item.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-black mt-2 uppercase tracking-tighter">{item.sku} • {item.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => updateStock(item.id, -1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span className="w-8 text-center font-black text-slate-700 text-lg">{item.stock}</span>
                                                <button
                                                    onClick={() => updateStock(item.id, 1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-90"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex justify-center">
                                                <div className="w-40 h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            item.stock === 0 ? "bg-rose-500" : item.stock < 20 ? "bg-amber-500" : "bg-emerald-500"
                                                        )}
                                                        style={{ width: `${Math.min(100, (item.stock / 100) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                status.color
                                            )}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <button
                                                onClick={() => deleteInventoryItem(item.id)}
                                                className="p-3 text-slate-300 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all active:scale-90"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
