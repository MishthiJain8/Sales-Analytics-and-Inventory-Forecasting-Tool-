'use client';

import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Trash2, ArrowRight } from 'lucide-react';
import Papa from 'papaparse';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();
    const { user } = useAuth();

    const handleFileDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === 'text/csv' || droppedFile?.name.endsWith('.csv')) {
            setFile(droppedFile);
            setMessage({ type: '', text: '' });
        } else {
            setMessage({ type: 'error', text: 'Please upload a CSV file' });
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
            setFile(selectedFile);
            setMessage({ type: '', text: '' });
        } else {
            setMessage({ type: 'error', text: 'Invalid file format. Please select a CSV file.' });
        }
    };

    const clearFile = () => {
        setFile(null);
        setMessage({ type: '', text: '' });
    };

    const processUpload = useCallback(async () => {
        if (!file) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    // Map CSV columns to our schema
                    // Expected columns: Date, Product, Revenue (or Sales), Inventory (or Stock)
                    const records = results.data
                        .map(row => ({
                            date: row.Date || row['date'] || new Date().toISOString().split('T')[0],
                            product: row.Product || row['product'] || row['ProductName'] || 'Unknown',
                            revenue: parseFloat(row.Revenue || row['revenue'] || row['Sales'] || row['sales'] || 0) || 0,
                            sales: parseFloat(row.Sales || row['sales'] || row['Revenue'] || row['revenue'] || 0) || 0,
                            inventory: parseFloat(row.Inventory || row['inventory'] || row['Stock'] || row['stock'] || 0) || 0,
                            units: parseFloat(row.Units || row['units'] || 1) || 1
                        }))
                        .filter(r => r.product && r.product !== 'Unknown');

                    if (records.length === 0) {
                        setMessage({
                            type: 'error',
                            text: 'No valid records found. Expected columns: Date, Product, Revenue/Sales, Inventory/Stock'
                        });
                        setLoading(false);
                        return;
                    }

                    // Send to API
                    const res = await fetch('/api/data/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ records })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setMessage({
                            type: 'success',
                            text: `✓ Successfully uploaded ${data.count} records (Total: ${data.total})`
                        });
                        setFile(null);
                        setTimeout(() => router.push('/dashboard'), 2000);
                    } else {
                        setMessage({ type: 'error', text: 'Failed to upload data. Please try again.' });
                    }
                } catch (err) {
                    console.error('Upload error:', err);
                    setMessage({ type: 'error', text: 'Error processing file. Please check the format.' });
                }
                setLoading(false);
            },
            error: (err) => {
                console.error('CSV Parse error:', err);
                setMessage({ type: 'error', text: 'Failed to parse CSV file.' });
                setLoading(false);
            }
        });
    }, [file, router]);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Header */}
                <div className="bg-slate-800 border-b border-slate-700">
                    <div className="max-w-4xl mx-auto px-6 py-6">
                        <div className="flex items-center gap-3">
                            <FileSpreadsheet className="text-blue-500" size={28} />
                            <h1 className="text-2xl font-bold text-white">Upload Sales Data</h1>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Instructions */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-bold text-white mb-4">CSV Format Requirements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm">
                            <div>
                                <p className="font-semibold text-white mb-2">Required Columns:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Date (YYYY-MM-DD)</li>
                                    <li>Product (product name)</li>
                                    <li>Revenue or Sales (amount)</li>
                                    <li>Inventory or Stock (qty)</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-white mb-2">Example:</p>
                                <code className="text-xs bg-slate-900 p-3 rounded block">
                                    Date,Product,Revenue,Inventory
                                    <br />2024-01-01,Widget A,5000,150
                                    <br />2024-01-01,Widget B,3200,89
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Upload Zone */}
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        className={`border-4 border-dashed rounded-lg p-12 text-center transition-all ${
                            file
                                ? 'border-green-500 bg-green-500/10'
                                : 'border-slate-600 bg-slate-800/50 hover:border-blue-500 hover:bg-slate-800'
                        }`}
                    >
                        {!file ? (
                            <div className="flex flex-col items-center">
                                <div className="mb-6 bg-slate-700 p-6 rounded-lg text-blue-400">
                                    <Upload size={48} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Drag and drop your CSV here</h3>
                                <p className="text-slate-400 mb-8">or click to browse your computer</p>

                                <label className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer transition-colors inline-block">
                                    Select File
                                    <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                                </label>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="mb-6 bg-green-500/20 p-6 rounded-lg text-green-400">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{file.name}</h3>
                                <p className="text-slate-400 mb-8 text-sm">
                                    {(file.size / 1024).toFixed(1)} KB • CSV File
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={clearFile}
                                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={processUpload}
                                        disabled={loading}
                                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Upload Data
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    {message.text && (
                        <div
                            className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                                message.type === 'success'
                                    ? 'bg-green-500/20 border border-green-500 text-green-300'
                                    : 'bg-red-500/20 border border-red-500 text-red-300'
                            }`}
                        >
                            {message.type === 'success' ? (
                                <CheckCircle2 size={20} className="flex-shrink-0" />
                            ) : (
                                <AlertCircle size={20} className="flex-shrink-0" />
                            )}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* Sample Data Button */}
                    <div className="mt-12 text-center">
                        <p className="text-slate-400 mb-4">Don't have sample data? Download a template:</p>
                        <button
                            onClick={() => {
                                const sampleData = `Date,Product,Revenue,Inventory
2024-01-01,Laptop,15000,45
2024-01-01,Mouse,2500,120
2024-01-02,Laptop,16200,40
2024-01-02,Keyboard,4800,85
2024-01-03,Monitor,8500,60`;
                                const blob = new Blob([sampleData], { type: 'text/csv' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'sample-sales-data.csv';
                                a.click();
                            }}
                            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            Download Sample CSV
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
