import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
    Building2,
    User,
    Mail,
    Phone,
    Briefcase,
    ArrowRight,
    Globe,
    BarChart2,
    CheckCircle2
} from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const { registerUser } = useData();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        businessName: '',
        industry: 'Retail',
        region: 'North America',
        managerName: '',
        jobTitle: 'Store Manager',
        workEmail: '',
        phone: '',
        companySize: '1-10'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        registerUser(formData);
        setStep(3); // Success state
        setTimeout(() => navigate('/login'), 2000);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto shadow-lg mb-4">
                        <BarChart2 size={24} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Manager Onboarding</h1>
                    <p className="text-slate-500 font-medium">Create your executive profile to access SalesFlow Pro.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500" />

                    {step === 3 ? (
                        <div className="text-center py-10 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Registration Complete!</h2>
                            <p className="text-slate-500 mt-2 font-medium">Redirecting to login portal...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-8">
                            {/* Progress Bar */}
                            <div className="flex gap-2 mb-8">
                                <div className={cn("h-1.5 flex-1 rounded-full", step >= 1 ? "bg-indigo-600" : "bg-slate-200")} />
                                <div className={cn("h-1.5 flex-1 rounded-full", step >= 2 ? "bg-indigo-600" : "bg-slate-200")} />
                            </div>

                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Building2 size={20} className="text-indigo-600" />
                                        Business Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                                            <input
                                                required
                                                name="businessName"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                                value={formData.businessName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
                                            <select
                                                name="industry"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                                value={formData.industry}
                                                onChange={handleChange}
                                            >
                                                <option>Retail</option>
                                                <option>Food & Beverage</option>
                                                <option>Technology</option>
                                                <option>Manufacturing</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Size</label>
                                            <select
                                                name="companySize"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                                value={formData.companySize}
                                                onChange={handleChange}
                                            >
                                                <option>1-10</option>
                                                <option>11-50</option>
                                                <option>51-200</option>
                                                <option>200+</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Region</label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    name="region"
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                                    value={formData.region}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        Next: Manager Details
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <User size={20} className="text-indigo-600" />
                                        Manager Personalization
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                required
                                                name="managerName"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                                value={formData.managerName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                                            <input
                                                required
                                                name="jobTitle"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                                value={formData.jobTitle}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    type="email"
                                                    name="workEmail"
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                                    value={formData.workEmail}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    name="phone"
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all"
                                        >
                                            Finish Registration
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-400">
                                    Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Sign In here</Link>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper for Tailwind classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default Signup;
