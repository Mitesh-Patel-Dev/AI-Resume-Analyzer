import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiLogOut, FiUpload, FiGrid, FiUser, FiMenu, FiX, FiInfo, FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/login");
        setMobileOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                isActive(to)
                    ? "bg-brand-500/10 text-brand-400 font-medium"
                    : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/60"
            }`}
        >
            <Icon className="text-[15px]" />
            <span>{label}</span>
        </Link>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c1222]/90 backdrop-blur-xl border-b border-surface-800/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-lg flex items-center justify-center shadow-md shadow-brand-500/20">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                        <span className="text-lg font-heading font-bold text-surface-100 tracking-tight">
                            ResumeAI
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {user ? (
                            <>
                                <NavLink to="/dashboard" icon={FiGrid} label="Dashboard" />
                                <NavLink to="/upload" icon={FiUpload} label="Upload" />
                                <NavLink to="/about" icon={FiInfo} label="About" />

                                <div className="w-px h-5 bg-surface-800 mx-2" />

                                <Link
                                    to="/profile"
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                                        isActive("/profile")
                                            ? "bg-brand-500/15 border border-brand-500/30"
                                            : "bg-surface-800/50 border border-surface-700/50 hover:border-surface-600"
                                    }`}
                                >
                                    <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-white">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm text-surface-300 font-medium">
                                        {user.name?.split(" ")[0]}
                                    </span>
                                </Link>

                                <button
                                    onClick={toggleTheme}
                                    className="ml-1 p-2 text-surface-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                >
                                    {theme === 'dark' ? <FiSun className="text-[15px]" /> : <FiMoon className="text-[15px]" />}
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Logout"
                                >
                                    <FiLogOut className="text-[15px]" />
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/about" icon={FiInfo} label="About" />
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 text-surface-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                                >
                                    {theme === 'dark' ? <FiSun className="text-[15px]" /> : <FiMoon className="text-[15px]" />}
                                </button>
                                <div className="w-px h-5 bg-surface-800 mx-2" />
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm text-surface-300 hover:text-white transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn-primary text-sm !py-2 !px-5"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-surface-400 hover:text-white rounded-lg"
                    >
                        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden py-4 border-t border-surface-800/60 animate-slide-up">
                        <div className="flex flex-col gap-1">
                            {user ? (
                                <>
                                    <NavLink to="/dashboard" icon={FiGrid} label="Dashboard" />
                                    <NavLink to="/upload" icon={FiUpload} label="Upload" />
                                    <NavLink to="/profile" icon={FiUser} label="Profile" />
                                    <NavLink to="/about" icon={FiInfo} label="About" />
                                    <div className="h-px bg-surface-800 my-2" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <FiLogOut className="text-[15px]" /> Log out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/about" icon={FiInfo} label="About" />
                                    <div className="h-px bg-surface-800 my-2" />
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="px-3 py-2 text-sm text-surface-300"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileOpen(false)}
                                        className="btn-primary text-sm text-center !py-2"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
