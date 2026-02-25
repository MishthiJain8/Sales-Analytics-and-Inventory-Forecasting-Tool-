"use client";

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import Papa from 'papaparse';
import { cn } from '@/lib/utils';
import { SalesData } from '@/lib/mockData';

export default function UploadPage() {
    const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const uploadCSVData = useStore((state) => state.uploadCSVData);
    const addSalesRecord = useStore((state) => state.addSalesRecord);
    const injectRandomSales = useStore((state) => state.injectRandomSales);

    // Manual Form State
    const [formData, setFormData] = useState({
        date: '',
        name: '',
        quantity: '',
        revenue: ''
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadSuccess(false);

        // Simulate 2s delay as per requirement
        setTimeout(() => {
            injectRandomSales(); // Inject 5 records as requested
            setIsUploading(false);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        }, 2000);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRecord: SalesData = {
            date: new Date(formData.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            revenue: parseFloat(formData.revenue),
            quantity: parseInt(formData.quantity)
        };
        addSalesRecord(newRecord);
        setUploadSuccess(true);
        setFormData({ date: '', name: '', quantity: '', revenue: '' });
        setTimeout(() => setUploadSuccess(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Input Sales Data</h1>
                <p className="text-slate-500">Persistent global state updates for all charts.</p>
            </div>

            <div className="card-premium overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all",
                            activeTab === 'upload' ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Upload className="w-4 h-4" />
                        CSV Upload
                    </button>
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all",
                            activeTab === 'manual' ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <FileText className="w-4 h-4" />
                        Manual Entry
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'upload' ? (
                        <div className="space-y-6">
                            <div className={cn(
                                "border-2 border-dashed rounded-2xl p-12 text-center transition-all",
                                isUploading ? "border-indigo-300 bg-indigo-50" : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"
                            )}>
                                {isUploading ? (
                                    <div className="space-y-4">
                                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                                        <div>
                                            <p className="font-bold text-slate-900">Uploading File...</p>
                                            <p className="text-sm text-slate-500">Injecting 5 new random records into state</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Click to upload mock CSV</p>
                                            <p className="text-sm text-slate-500">Will instantly reflect on dashboard</p>
                                        </div>
                                        <label className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 active:scale-95">
                                            Select File
                                            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-indigo-900">Functional State Injection</p>
                                    <p className="text-xs text-indigo-700 mt-1">Uploading any file will trigger a 2s animation and inject 5 random sales data points to demonstrate live updates.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleManualSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Product Name</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    >
                                        <option value="">Select Product...</option>
                                        <option>Arabica Roast</option>
                                        <option>French Press</option>
                                        <option>Espresso Shot</option>
                                        <option>Mocha Latte</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Quantity Sold</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Revenue ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.revenue}
                                        onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                Submit & Update Live State
                            </button>
                        </form>
                    )}

                    {uploadSuccess && (
                        <div className="mt-6 p-4 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center gap-3 text-emerald-800 animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span className="font-bold">Success! New data points added to the Global State and Saved to LocalStorage.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
