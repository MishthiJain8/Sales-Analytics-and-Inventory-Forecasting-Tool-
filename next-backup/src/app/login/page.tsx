"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Lock, Mail, ArrowRight, BarChart2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const login = useStore((state) => state.login);
    const router = useRouter();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate real auth check
        setTimeout(() => {
            if (email === 'admin' && password === 'admin') {
                login();
                router.push('/dashboard');
            } else {
                setError('Invalid credentials. Please use admin / admin.');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-blue-50">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                {/* Logo / Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-6 animate-bounce-subtle">
                        <BarChart2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">SalesFlow</h1>
                    <p className="text-slate-500 mt-2 font-medium">Production-Ready Analytics & Forecasting</p>
                </div>

                {/* Login Card */}
                <div className="glass border-white/40 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold ring-1 ring-indigo-200">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Credentials: admin / admin
                        </div>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Identity (Email/Username)</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="admin"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Security Key (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="admin"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold animate-shake text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 disabled:opacity-70 group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Access Dashboard
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Secure Analytics Portal v1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
