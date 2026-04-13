import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FiGithub, FiMail, FiHeart } from "react-icons/fi";

const Footer = () => {
    return (
        <footer className="border-t border-dark-800/50 bg-dark-950/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <HiOutlineSparkles className="text-white text-sm" />
                            </div>
                            <span className="text-base font-bold text-white">
                                AI Resume Analyzer
                            </span>
                        </Link>
                        <p className="text-dark-500 text-sm leading-relaxed">
                            Upload your resume and receive AI-powered insights to improve
                            your chances of landing interviews.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
                            Product
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: "Upload Resume", to: "/upload" },
                                { label: "Dashboard", to: "/dashboard" },
                                { label: "How It Works", to: "/#how-it-works" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-dark-500 hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
                            Account
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: "Sign Up", to: "/signup" },
                                { label: "Login", to: "/login" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-dark-500 hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
                            Connect
                        </h4>
                        <div className="flex items-center gap-3">
                            <a
                                href="mailto:contact@airesumeanalyzer.com"
                                className="w-9 h-9 bg-dark-800 hover:bg-primary-500/20 border border-dark-700 hover:border-primary-500/30 rounded-lg flex items-center justify-center text-dark-500 hover:text-primary-400 transition-all"
                                title="Email"
                            >
                                <FiMail className="text-sm" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-dark-800 hover:bg-primary-500/20 border border-dark-700 hover:border-primary-500/30 rounded-lg flex items-center justify-center text-dark-500 hover:text-primary-400 transition-all"
                                title="GitHub"
                            >
                                <FiGithub className="text-sm" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-dark-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-dark-600 text-sm">
                        © {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1 text-dark-600 text-sm">
                        Made with <FiHeart className="text-red-500 text-xs" /> for students
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
