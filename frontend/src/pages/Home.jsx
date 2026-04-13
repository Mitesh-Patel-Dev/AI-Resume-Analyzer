import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FiUploadCloud,
    FiCpu,
    FiBarChart2,
    FiCheckCircle,
    FiArrowRight,
    FiZap,
    FiShield,
    FiClock,
    FiTarget,
    FiTrendingUp,
    FiAward,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[150px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-600/15 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px]" />

                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                <div className="max-w-5xl mx-auto text-center pt-20 animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-8">
                        <HiOutlineSparkles className="text-primary-400" />
                        <span className="text-sm text-primary-300 font-medium">
                            AI-Powered Resume Analysis
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                        Land Your Dream Job
                        <br />
                        <span className="gradient-text">With a Perfect Resume</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Upload your resume and get an instant <strong className="text-dark-200">ATS compatibility score</strong>,
                        skill analysis, and personalized improvement suggestions — all powered by AI.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            to={user ? "/upload" : "/signup"}
                            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold text-lg rounded-2xl transition-all shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
                        >
                            Analyze My Resume
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to={user ? "/dashboard" : "/login"}
                            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-lg rounded-2xl transition-all"
                        >
                            {user ? "Go to Dashboard" : "Sign In"}
                        </Link>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                        {[
                            { value: "80+", label: "Skills Detected" },
                            { value: "7", label: "Scoring Criteria" },
                            { value: "30s", label: "Instant Analysis" },
                            { value: "Free", label: "No Credit Card" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-dark-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-xs text-dark-600">Scroll</span>
                    <div className="w-5 h-8 border-2 border-dark-600 rounded-full flex justify-center pt-1">
                        <div className="w-1 h-2 bg-dark-500 rounded-full" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
            <section className="py-24 px-4 relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary-950/30 to-transparent" />
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">How It Works</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
                            Three Simple Steps to a <span className="gradient-text">Better Resume</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                icon: FiUploadCloud,
                                title: "Upload Resume",
                                desc: "Drag and drop your PDF resume or click to browse. We accept files up to 5MB.",
                                color: "primary",
                            },
                            {
                                step: "02",
                                icon: FiCpu,
                                title: "AI Analysis",
                                desc: "Our engine extracts text, detects skills, and evaluates your resume across 7 key criteria.",
                                color: "accent",
                            },
                            {
                                step: "03",
                                icon: FiBarChart2,
                                title: "Get Results",
                                desc: "Receive your ATS score, detected skills, missing skills, and actionable improvement tips.",
                                color: "green",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="relative glass-card p-8 group hover:border-primary-500/30 transition-all hover:-translate-y-1"
                            >
                                {/* Step Number */}
                                <span className="absolute top-6 right-6 text-5xl font-extrabold text-white/[0.03] select-none">
                                    {item.step}
                                </span>

                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.color === "primary"
                                            ? "bg-primary-500/15 text-primary-400"
                                            : item.color === "accent"
                                                ? "bg-accent-500/15 text-accent-400"
                                                : "bg-green-500/15 text-green-400"
                                        }`}
                                >
                                    <item.icon className="text-2xl" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-dark-400 leading-relaxed">{item.desc}</p>

                                {/* Connector Line */}
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-dark-700" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════ */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-semibold text-accent-400 uppercase tracking-wider">Features</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
                            Everything You Need to <span className="gradient-text">Stand Out</span>
                        </h2>
                        <p className="text-dark-400 mt-4 max-w-2xl mx-auto">
                            Our AI-powered analyzer gives you the edge in today's competitive job market
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: FiTarget,
                                title: "ATS Score (0-100)",
                                desc: "See exactly how well your resume will perform against Applicant Tracking Systems.",
                                gradient: "from-blue-500/20 to-primary-500/20",
                                iconColor: "text-blue-400",
                            },
                            {
                                icon: FiCheckCircle,
                                title: "Skill Detection",
                                desc: "We identify 80+ technical and soft skills across 7 categories in your resume.",
                                gradient: "from-green-500/20 to-emerald-500/20",
                                iconColor: "text-green-400",
                            },
                            {
                                icon: FiZap,
                                title: "Missing Skills",
                                desc: "Know which in-demand skills you should add to match current job market trends.",
                                gradient: "from-orange-500/20 to-amber-500/20",
                                iconColor: "text-orange-400",
                            },
                            {
                                icon: FiTrendingUp,
                                title: "Smart Suggestions",
                                desc: "Get AI-powered personalized tips to dramatically improve your resume quality.",
                                gradient: "from-accent-500/20 to-pink-500/20",
                                iconColor: "text-accent-400",
                            },
                            {
                                icon: FiShield,
                                title: "Secure & Private",
                                desc: "Your data is protected with JWT authentication. Only you can access your resumes.",
                                gradient: "from-primary-500/20 to-violet-500/20",
                                iconColor: "text-primary-400",
                            },
                            {
                                icon: FiClock,
                                title: "Instant Results",
                                desc: "Get comprehensive analysis in under 30 seconds — no waiting, no queues.",
                                gradient: "from-cyan-500/20 to-teal-500/20",
                                iconColor: "text-cyan-400",
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="glass-card p-6 group hover:border-primary-500/20 transition-all hover:-translate-y-1"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
                                >
                                    <feature.icon className={`text-xl ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-dark-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          SCORING CRITERIA SECTION
      ═══════════════════════════════════════════ */}
            <section className="py-24 px-4 relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-accent-950/20 to-transparent" />
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Scoring Engine</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
                            How We Score <span className="gradient-text">Your Resume</span>
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {[
                            { label: "Technical & Soft Skills", points: "35 pts", desc: "We scan for 80+ skills across programming, frameworks, databases, cloud, and more." },
                            { label: "Resume Sections", points: "20 pts", desc: "Checks for key sections like Experience, Education, Skills, Projects, and Summary." },
                            { label: "Contact Information", points: "10 pts", desc: "Verifies email, phone number, and LinkedIn profile are present." },
                            { label: "Resume Length", points: "10 pts", desc: "Evaluates if your resume is the optimal length (300-600 words for one page)." },
                            { label: "Action Verbs", points: "10 pts", desc: "Looks for strong action verbs like Developed, Managed, Implemented, Built." },
                            { label: "Quantifiable Results", points: "10 pts", desc: "Detects metrics and numbers like '40% improvement' or '$2M revenue'." },
                            { label: "Formatting Quality", points: "5 pts", desc: "Checks for professional language, impact-driven phrasing, and keyword usage." },
                        ].map((criteria, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-5 bg-dark-800/30 hover:bg-dark-800/50 border border-dark-700/30 rounded-2xl transition-all"
                            >
                                <div className="flex-shrink-0 w-16 text-center">
                                    <span className="text-lg font-bold text-primary-400">{criteria.points}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">{criteria.label}</h4>
                                    <p className="text-dark-500 text-sm leading-relaxed">{criteria.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
          FINAL CTA SECTION
      ═══════════════════════════════════════════ */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="glass-card p-12 md:p-16 relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gradient-to-b from-primary-500/20 to-transparent blur-[80px]" />

                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30">
                                <FiAward className="text-white text-2xl" />
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Ready to Improve Your Resume?
                            </h2>
                            <p className="text-dark-400 text-lg mb-8 max-w-lg mx-auto">
                                Join thousands of job seekers who've improved their interview chances with AI-powered analysis.
                            </p>

                            <Link
                                to={user ? "/upload" : "/signup"}
                                className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold text-lg rounded-2xl transition-all shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
                            >
                                Get Started Free
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <p className="text-dark-600 text-sm mt-4">
                                No credit card required • Instant results
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
