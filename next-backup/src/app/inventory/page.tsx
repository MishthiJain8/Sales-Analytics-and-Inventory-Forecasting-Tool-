"use client";

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
    Search,
    Package,
    AlertTriangle,
    ArrowUpDown,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus,
    Minus,
    Trash2,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
    const { inventory, updateStock, deleteProduct, addProduct } = useStore();
    const [search, setSearch] = useState('');
    const [isAddingMode, setIsAddingMode] = useState(false);

    // New Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        sku: '',
        category: 'Beverages',
        stock: 0,
        price: 0
    });

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        addProduct(newProduct);
        setNewProduct({ name: '', sku: '', category: 'Beverages', stock: 0, price: 0 });
        setIsAddingMode(false);
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase())
    );

    const lowStockCount = inventory.filter(i => i.status !== 'In Stock').length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
                    <p className="text-slate-500">Full CRUD control over your product catalog.</p>
                </div>
                <button
                    onClick={() => setIsAddingMode(!isAddingMode)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-medium active:scale-95"
                >
                    {isAddingMode ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isAddingMode ? 'Cancel' : 'Add New Product'}
                </button>
            </div>

            {/* Add Product Form */}
            {isAddingMode && (
                <div className="card-premium p-6 border-indigo-200 bg-indigo-50/10 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Espresso Beans"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">SKU</label>
                            <input
                                required
                                type="text"
                                placeholder="SKU-123"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={newProduct.sku}
                                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <select
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                                <option>Beverages</option>
                                <option>Equipment</option>
                                <option>Accessories</option>
                                <option>Houseware</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Initial Stock</label>
                            <input
                                required
                                type="number"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                            Confirm Add
                        </button>
                    </form>
                </div>
            )}

            {lowStockCount > 0 && (
                <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-amber-900">{lowStockCount} items require your attention!</p>
                        <p className="text-sm text-amber-700">Stock levels are low for several key products.</p>
                    </div>
                </div>
            )}

            {/* Table Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Inventory Table */}
            <div className="card-premium overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Controls</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Stock Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                                {item.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{item.name}</span>
                                                <span className="text-xs text-slate-400 font-medium">{item.sku} • {item.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => updateStock(item.id, -1)}
                                                className="p-1 px-2 rounded-md border border-slate-200 hover:bg-rose-50 hover:text-rose-600 transition-colors active:scale-90"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold text-slate-700">{item.stock}</span>
                                            <button
                                                onClick={() => updateStock(item.id, 1)}
                                                className="p-1 px-2 rounded-md border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors active:scale-90"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-500",
                                                        item.status === 'In Stock' ? "bg-emerald-500" : item.status === 'Low Stock' ? "bg-amber-500" : "bg-rose-500"
                                                    )}
                                                    style={{ width: `${Math.min(100, (item.stock / 50) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1",
                                            item.status === 'In Stock' ? "bg-emerald-100 text-emerald-700" :
                                                item.status === 'Low Stock' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                                        )}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => deleteProduct(item.id)}
                                            className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
