import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center animate-fade-in">
                <h1 className="text-8xl font-heading font-extrabold gradient-text mb-4">404</h1>
                <h2 className="heading-lg text-2xl text-white mb-3">Page not found</h2>
                <p className="text-surface-500 max-w-sm mx-auto mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn-primary inline-flex items-center gap-2">
                    <FiArrowLeft /> Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
