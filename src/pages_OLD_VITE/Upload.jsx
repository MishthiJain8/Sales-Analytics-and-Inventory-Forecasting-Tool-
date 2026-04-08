import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Upload as UploadIcon, FileText, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const Upload = () => {
    const { addSalesRecord, injectMockSales } = useData();
    const [activeTab, setActiveTab] = useState('upload');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        date: '',
        name: '',
        quantity: '',
        revenue: ''
    });

    const handleFileUpload = (e) => {
        if (!e.target.files?.[0]) return;
        setLoading(true);
        setSuccess(false);

        // Strict requirement: 2 second delay then inject 5 records
        setTimeout(() => {
            injectMockSales();
            setLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 2000);
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        const [year, month] = formData.date.split('-');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = `${monthNames[parseInt(month) - 1]} ${year}`;

        addSalesRecord({
            date: formattedDate,
            revenue: parseFloat(formData.revenue),
            quantity: parseInt(formData.quantity)
        });

        setSuccess(true);
        setFormData({ date: '', name: '', quantity: '', revenue: '' });
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-2xl font-black text-slate-900">Data Injection Center</h1>
                <p className="text-slate-500 font-medium">Synchronize your local registry with bulk uploads or manual entries.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="flex border-b border-slate-50">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={cn(
                            "flex-1 py-6 font-bold flex items-center justify-center gap-2 transition-all",
                            activeTab === 'upload' ? "text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <UploadIcon size={20} />
                        Bulk CSV Upload
                    </button>
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={cn(
                            "flex-1 py-6 font-bold flex items-center justify-center gap-2 transition-all",
                            activeTab === 'manual' ? "text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <FileText size={20} />
                        Manual Ledger Entry
                    </button>
                </div>

                <div className="p-10">
                    {activeTab === 'upload' ? (
                        <div className="space-y-8">
                            <div className={cn(
                                "border-4 border-dashed rounded-[2rem] p-16 text-center transition-all duration-300",
                                loading ? "border-indigo-300 bg-indigo-50" : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                            )}>
                                {loading ? (
                                    <div className="space-y-4">
                                        <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto" />
                                        <div>
                                            <p className="font-black text-slate-900 text-lg">Processing Intelligence...</p>
                                            <p className="text-sm text-slate-500 font-medium tracking-tight uppercase">Injecting 5 synchronized records into state</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                                            <UploadIcon size={32} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-xl">Deposit Sales Matrix</p>
                                            <p className="text-sm text-slate-500 font-medium">Select any CSV file to trigger mock data generation.</p>
                                        </div>
                                        <label className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black cursor-pointer hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100">
                                            Browse Files
                                            <input type="file" className="hidden" onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                                <Sparkles className="text-indigo-600 shrink-0 mt-1" size={20} />
                                <p className="text-xs text-indigo-700 font-bold leading-relaxed">
                                    SYSTEM NOTE: This module is configured for demonstration. Any file upload will simulate a secure processing session and append 5 randomized historical records to the Global Context.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleManualSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Reporting Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Model Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Premium Arabica"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Units Allocated</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Gross Revenue ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold"
                                        value={formData.revenue}
                                        onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all"
                            >
                                COMMIT TO GLOBAL STATE
                            </button>
                        </form>
                    )}

                    {success && (
                        <div className="mt-8 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 text-emerald-800 animate-in fade-in zoom-in">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="font-black text-sm">State Synchronized Successfully</p>
                                <p className="text-xs font-bold text-emerald-600">All charts and tables have been updated across the portal.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Upload;
