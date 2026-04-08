'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Request failed');
                setLoading(false);
                return;
            }

            if (isSignup) {
                setError('✓ Account created! Now logging in...');
                setIsSignup(false);
                setPassword('');
                setLoading(false);
            } else {
                // Login successful
                login(data.token, data.user);
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <BarChart3 className="text-blue-600" size={32} />
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Sales Analytics</h1>
                    </div>
                    <p className="text-gray-600 font-serif">Professional Sales Intelligence</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 text-center">
                        {isSignup ? 'Create Account' : 'Sign In'}
                    </h2>
                    <p className="text-gray-600 text-sm text-center mb-6">
                        {isSignup ? 'Join our analytics platform' : 'Access your sales data'}
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className={`mb-6 p-4 rounded-lg flex gap-3 ${
                            error.includes('✓')
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                        }`}>
                            <AlertCircle 
                                size={20} 
                                className={`flex-shrink-0 ${error.includes('✓') ? 'text-green-600' : 'text-red-600'}`}
                            />
                            <span className={error.includes('✓') ? 'text-green-700 text-sm' : 'text-red-700 text-sm'}>
                                {error}
                            </span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={isSignup ? 'Min 6 characters' : '••••••'}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {isSignup ? 'Create Account' : 'Sign In'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm mb-2">
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}
                        </p>
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError(null);
                                setPassword('');
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                        >
                            {isSignup ? 'Sign In' : 'Create Account'}
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-gray-600 text-xs font-serif leading-relaxed">
                            <strong>Demo Credentials:</strong><br />
                            Email: demo@test.com<br />
                            Password: Test1234
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6 font-serif">
                    © 2024 Sales Analytics Platform. All rights reserved.
                </p>
            </div>
        </div>
    );
}
