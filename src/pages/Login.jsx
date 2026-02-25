import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Mail, ShieldCheck, ArrowRight, Lock, Key, BarChart2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [stage, setStage] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { sendOTP, verifyOTP } = useData();
    const navigate = useNavigate();

    const handleRequestOTP = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            const success = sendOTP(email);
            if (success) {
                setStage(2);
            } else {
                setError('No account found for this email. Please sign up.');
            }
            setLoading(false);
        }, 1000);
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            const success = verifyOTP(email, otp);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Invalid Security Code. Please check the console (simulated SMS).');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="bg-indigo-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-100 mb-4 scale-110">
                        <BarChart2 size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">SalesFlow Pro</h1>
                    <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-[10px]">Manager Security Shield</p>
                </div>

                <div className="bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-slate-800">
                            {stage === 1 ? 'Verify Identity' : 'Secure Entry'}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
                            {stage === 1 ? 'Phase 01: Identification' : 'Phase 02: Verification'}
                        </p>
                    </div>

                    {stage === 1 ? (
                        <form onSubmit={handleRequestOTP} className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Registry</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        placeholder="manager@company.com"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-500 text-[10px] font-black uppercase text-center rounded-xl animate-shake">
                                    {error}
                                </div>
                            )}

                            <button
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Request Secure OTP
                                        <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">One-Time Security Code</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Enter 4-digit code"
                                        maxLength={4}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-2xl tracking-[1em] text-center"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-center text-indigo-500 mt-2">Check the browser console for the simulated OTP</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-500 text-[10px] font-black uppercase text-center rounded-xl animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStage(1)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    disabled={loading}
                                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Verify & Access'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-xs font-bold text-slate-400">
                            New Manager? <Link to="/signup" className="text-indigo-600 hover:underline">Provision account here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
