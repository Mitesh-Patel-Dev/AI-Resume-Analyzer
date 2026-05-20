import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-app flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/about" element={<About />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <PrivateRoute>
                                            <Dashboard />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/upload"
                                    element={
                                        <PrivateRoute>
                                            <Upload />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/results/:id"
                                    element={
                                        <PrivateRoute>
                                            <Results />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <PrivateRoute>
                                            <Profile />
                                        </PrivateRoute>
                                    }
                                />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
