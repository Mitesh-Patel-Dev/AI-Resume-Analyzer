import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiArrowRight, FiTarget, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginUser({ email, password });
            login(res.data, res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex pt-16">
            {/* Left — Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-950/60 via-surface-900 to-surface-950 items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.06] to-accent-500/[0.04]" />
                <div className="relative max-w-md">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-brand-500/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                    </div>
                    <h2 className="heading-lg text-3xl text-white mb-4">
                        Welcome back to ResumeAI
                    </h2>
                    <p className="text-surface-400 leading-relaxed mb-10">
                        Continue optimizing your resume with AI-powered insights and ATS scoring.
                    </p>

                    <div className="space-y-5">
                        {[
                            { icon: FiTarget, text: "Detailed ATS score breakdown" },
                            { icon: FiCheckCircle, text: "150+ skills auto-detected" },
                            { icon: FiTrendingUp, text: "Track improvement over time" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                                    <item.icon className="text-brand-400 text-sm" />
                                </div>
                                <span className="text-sm text-surface-300">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="mb-8">
                        <h1 className="heading-lg text-2xl text-white mb-2">Sign in</h1>
                        <p className="text-surface-500">Enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-scale-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-surface-900/50 border border-surface-700/60 rounded-xl text-white placeholder-surface-600 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                                <input
                                    id="login-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 bg-surface-900/50 border border-surface-700/60 rounded-xl text-white placeholder-surface-600 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <FiArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-surface-500 text-sm mt-8">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
