import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiUpload, FiHome, FiUser } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary-500/10 rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/50 transition-shadow">
                            <HiOutlineSparkles className="text-white text-lg" />
                        </div>
                        <span className="text-lg font-bold gradient-text">
                            AI Resume Analyzer
                        </span>
                    </Link>

                    {/* Navigation */}
                    {user ? (
                        <div className="flex items-center gap-1">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                <FiHome className="text-base" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <Link
                                to="/upload"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                <FiUpload className="text-base" />
                                <span className="hidden sm:inline">Upload</span>
                            </Link>
                            <div className="w-px h-6 bg-dark-700 mx-2" />
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full">
                                    <FiUser className="text-primary-400 text-sm" />
                                    <span className="text-sm text-primary-300 font-medium hidden sm:inline">
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Logout"
                                >
                                    <FiLogOut className="text-base" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm text-dark-300 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-lg transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
