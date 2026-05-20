import { Link } from "react-router-dom";
import { FiGithub, FiMail, FiLinkedin } from "react-icons/fi";

const Footer = () => {
    return (
        <footer className="border-t border-surface-800/50 bg-[#080e1a]">
            <div className="max-w-6xl mx-auto px-4 py-14">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="AI Resume Analyzer" className="w-7 h-7 rounded-lg" />
                            <span className="text-base font-heading font-bold text-surface-200">
                                AI Resume Analyzer
                            </span>
                        </Link>
                        <p className="text-surface-500 text-sm leading-relaxed max-w-xs">
                            AI-powered resume analysis and optimization.
                            Built as a BCA Final Year Project.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-heading font-semibold text-surface-300 mb-4">
                            Product
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: "Upload Resume", to: "/upload" },
                                { label: "Dashboard", to: "/dashboard" },
                                { label: "About", to: "/about" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-surface-500 hover:text-brand-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-sm font-heading font-semibold text-surface-300 mb-4">
                            Account
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: "Sign Up", to: "/signup" },
                                { label: "Log In", to: "/login" },
                                { label: "Profile", to: "/profile" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-surface-500 hover:text-brand-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-sm font-heading font-semibold text-surface-300 mb-4">
                            Connect
                        </h4>
                        <div className="flex items-center gap-2">
                            <a
                                href="https://github.com/Mitesh-Patel-Dev/AI-Resume-Analyzer"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-surface-800/60 hover:bg-brand-500/15 border border-surface-700/50 hover:border-brand-500/30 rounded-lg flex items-center justify-center text-surface-500 hover:text-brand-400 transition-all"
                                title="GitHub"
                            >
                                <FiGithub className="text-sm" />
                            </a>
                            <a
                                href="mailto:miteshpatel2212@gmail.com"
                                className="w-9 h-9 bg-surface-800/60 hover:bg-brand-500/15 border border-surface-700/50 hover:border-brand-500/30 rounded-lg flex items-center justify-center text-surface-500 hover:text-brand-400 transition-all"
                                title="Email"
                            >
                                <FiMail className="text-sm" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-surface-800/60 hover:bg-brand-500/15 border border-surface-700/50 hover:border-brand-500/30 rounded-lg flex items-center justify-center text-surface-500 hover:text-brand-400 transition-all"
                                title="LinkedIn"
                            >
                                <FiLinkedin className="text-sm" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-surface-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-surface-600 text-sm">
                        © {new Date().getFullYear()} AI Resume Analyzer — BCA Final Year Project
                    </p>
                    <p className="text-surface-700 text-xs">
                        Built by Mitesh Patel & Vishal Mahto • AI-Powered Resume Analyzer with ATS Optimization
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
