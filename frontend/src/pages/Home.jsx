import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FiUploadCloud, FiCpu, FiBarChart2, FiCheckCircle, FiArrowRight,
    FiZap, FiShield, FiTarget, FiTrendingUp, FiAward, FiChevronDown,
    FiFileText, FiLayers, FiRefreshCw,
} from "react-icons/fi";

// ─── FAQ Accordion Item ───
const FAQItem = ({ question, answer, isOpen, toggle }) => (
    <div className="border-b border-surface-800/50 last:border-0">
        <button
            onClick={toggle}
            className="w-full flex items-center justify-between py-5 text-left group"
        >
            <span className="text-surface-200 font-medium group-hover:text-white transition-colors pr-4">
                {question}
            </span>
            <FiChevronDown
                className={`text-surface-500 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-brand-400" : ""
                }`}
            />
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-40 pb-5" : "max-h-0"
            }`}
        >
            <p className="text-surface-400 text-sm leading-relaxed">{answer}</p>
        </div>
    </div>
);

const Home = () => {
    const { user } = useAuth();
    const [openFaq, setOpenFaq] = useState(0);

    const faqs = [
        { q: "Is this tool really free?", a: "Yes, completely free. No credit card required. Upload as many resumes as you want." },
        { q: "What file formats do you support?", a: "Currently, we support PDF files up to 5MB. We extract text directly from the PDF for analysis." },
        { q: "How is the ATS score calculated?", a: "We evaluate your resume across 4 dimensions: Content quality (30pts), Skills coverage (35pts), Formatting standards (20pts), and Impact/action verbs (15pts)." },
        { q: "Is my resume data secure?", a: "Yes. Your data is protected with JWT authentication. Only you can access your uploaded resumes and analysis results." },
        { q: "What is the AI Resume Builder?", a: "Our AI Builder uses a large language model to rewrite your resume, integrating missing skills and optimizing it for ATS systems automatically." },
    ];

    return (
        <div className="min-h-screen">
            {/* ═══════════════════════════════════════════
                HERO — Asymmetric Layout
            ═══════════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center px-4 overflow-hidden">
                {/* Background: subtle gradient, no animated orbs */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-950/40 via-transparent to-accent-950/20" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-500/[0.04] to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto w-full pt-24 pb-16">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left — Text */}
                        <div className="animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full mb-6">
                                <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
                                <span className="text-xs text-brand-300 font-medium tracking-wide uppercase">
                                    AI-Powered Analysis
                                </span>
                            </div>

                            <h1 className="heading-xl text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
                                Your resume,
                                <br />
                                <span className="gradient-text">optimized by AI</span>
                            </h1>

                            <p className="text-lg text-surface-400 max-w-lg mb-8 leading-relaxed">
                                Upload your resume and get an instant ATS compatibility score,
                                skill gap analysis, job role matching, and AI-powered rewriting —
                                all in under 30 seconds.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mb-12">
                                <Link
                                    to={user ? "/upload" : "/signup"}
                                    className="btn-primary text-base flex items-center justify-center gap-2 !py-3.5 !px-8"
                                >
                                    Start Analyzing
                                    <FiArrowRight />
                                </Link>
                                <Link
                                    to="/about"
                                    className="btn-ghost text-base flex items-center justify-center gap-2 !py-3.5"
                                >
                                    Learn More
                                </Link>
                            </div>

                            {/* Mini stats */}
                            <div className="flex gap-8">
                                {[
                                    { value: "150+", label: "Skills Detected" },
                                    { value: "8", label: "Job Roles Matched" },
                                    { value: "<30s", label: "Analysis Time" },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <p className="text-xl font-heading font-bold text-white">{s.value}</p>
                                        <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Visual mockup */}
                        <div className="hidden lg:block animate-slide-in-right">
                            <div className="relative">
                                {/* Main card */}
                                <div className="card-elevated p-6 relative z-10">
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <p className="text-xs text-surface-500 mb-1">ATS Score</p>
                                            <p className="text-3xl font-heading font-bold text-white">78<span className="text-lg text-surface-500">/100</span></p>
                                        </div>
                                        <div className="w-16 h-16 rounded-full border-[3px] border-brand-500/30 flex items-center justify-center relative">
                                            <svg className="absolute inset-0 score-circle" viewBox="0 0 64 64">
                                                <circle cx="32" cy="32" r="28" fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="176" strokeDashoffset="39" strokeLinecap="round" />
                                            </svg>
                                            <span className="text-sm font-bold text-brand-400">78%</span>
                                        </div>
                                    </div>
                                    {/* Score bars */}
                                    {[
                                        { label: "Content", score: 24, max: 30, color: "#3b82f6" },
                                        { label: "Skills", score: 28, max: 35, color: "#10b981" },
                                        { label: "Formatting", score: 16, max: 20, color: "#8b5cf6" },
                                        { label: "Impact", score: 10, max: 15, color: "#f59e0b" },
                                    ].map((b, i) => (
                                        <div key={i} className="mb-3 last:mb-0">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-surface-400">{b.label}</span>
                                                <span className="text-surface-500">{b.score}/{b.max}</span>
                                            </div>
                                            <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${(b.score / b.max) * 100}%`, backgroundColor: b.color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Floating skill tags */}
                                <div className="absolute -top-4 -right-4 z-20 card p-3 animate-float">
                                    <div className="flex items-center gap-2">
                                        <FiCheckCircle className="text-brand-400 text-sm" />
                                        <span className="text-xs text-surface-300 font-medium">React.js</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 -left-6 z-20 card p-3 animate-float" style={{ animationDelay: "2s" }}>
                                    <div className="flex items-center gap-2">
                                        <FiZap className="text-amber-400 text-sm" />
                                        <span className="text-xs text-surface-300 font-medium">+Docker missing</span>
                                    </div>
                                </div>

                                {/* Background decoration */}
                                <div className="absolute -inset-8 bg-gradient-to-br from-brand-500/5 to-accent-500/5 rounded-3xl -z-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                HOW IT WORKS — Vertical Timeline
            ═══════════════════════════════════════════ */}
            <section className="py-24 px-4 relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-surface-900/50 to-transparent" />
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-medium text-brand-400 uppercase tracking-wider mb-3">How It Works</p>
                        <h2 className="heading-lg text-3xl sm:text-4xl text-white">
                            Three steps to a <span className="gradient-text">better resume</span>
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/50 via-accent-500/30 to-transparent hidden sm:block" />

                        <div className="space-y-10">
                            {[
                                { icon: FiUploadCloud, title: "Upload your resume", desc: "Drag & drop your PDF resume. We extract every word using advanced text parsing.", num: "01", color: "brand" },
                                { icon: FiCpu, title: "AI analyzes everything", desc: "Our engine scans 150+ skills, evaluates formatting, checks impact metrics, and matches you to 8 career profiles.", num: "02", color: "accent" },
                                { icon: FiBarChart2, title: "Get actionable results", desc: "Receive your ATS score breakdown, missing skills, job role matches, section feedback, and an AI-rewritten version.", num: "03", color: "brand" },
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6 sm:gap-8 items-start animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                                    <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        step.color === "brand" ? "bg-brand-500/15" : "bg-accent-500/15"
                                    }`}>
                                        <step.icon className={`text-xl ${step.color === "brand" ? "text-brand-400" : "text-accent-400"}`} />
                                    </div>
                                    <div className="pt-1.5">
                                        <p className="text-xs font-mono text-surface-600 mb-1">STEP {step.num}</p>
                                        <h3 className="text-lg font-heading font-bold text-white mb-2">{step.title}</h3>
                                        <p className="text-surface-400 text-sm leading-relaxed max-w-md">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                FEATURES — Bento Grid
            ═══════════════════════════════════════════ */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-medium text-accent-400 uppercase tracking-wider mb-3">Features</p>
                        <h2 className="heading-lg text-3xl sm:text-4xl text-white">
                            Everything you need to <span className="gradient-text">stand out</span>
                        </h2>
                    </div>

                    {/* Bento Grid — asymmetric sizes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Large card — ATS Score */}
                        <div className="card-elevated p-7 sm:col-span-2 lg:col-span-2 lg:row-span-2">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-11 h-11 bg-blue-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FiTarget className="text-blue-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-heading font-bold text-white mb-1">Multi-Dimensional ATS Scoring</h3>
                                    <p className="text-surface-400 text-sm leading-relaxed">
                                        Not just one number. We break your score into 4 categories so you know exactly what to fix.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { label: "Content", pts: "30 pts", icon: FiFileText, color: "blue" },
                                    { label: "Skills", pts: "35 pts", icon: FiCheckCircle, color: "brand" },
                                    { label: "Formatting", pts: "20 pts", icon: FiLayers, color: "purple" },
                                    { label: "Impact", pts: "15 pts", icon: FiTrendingUp, color: "amber" },
                                ].map((c, i) => (
                                    <div key={i} className="card-surface p-4 text-center">
                                        <c.icon className={`mx-auto text-lg mb-2 ${
                                            c.color === "blue" ? "text-blue-400" :
                                            c.color === "brand" ? "text-brand-400" :
                                            c.color === "purple" ? "text-purple-400" : "text-amber-400"
                                        }`} />
                                        <p className="text-xs text-surface-500">{c.label}</p>
                                        <p className="text-sm font-bold text-white mt-0.5">{c.pts}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Regular cards */}
                        {[
                            { icon: FiCheckCircle, title: "150+ Skill Detection", desc: "Scans across 9 categories: Frontend, Backend, DevOps, Data Science, Mobile, and more.", color: "brand" },
                            { icon: FiZap, title: "Missing Skills Alert", desc: "Know which in-demand skills you're missing to match current job market trends.", color: "amber" },
                            { icon: FiRefreshCw, title: "AI Resume Builder", desc: "One click to rewrite your entire resume with missing skills naturally integrated.", color: "accent" },
                            { icon: FiShield, title: "Secure & Private", desc: "JWT authentication, encrypted storage. Only you can access your data.", color: "blue" },
                        ].map((f, i) => (
                            <div key={i} className="card-outlined p-6 group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                                    f.color === "brand" ? "bg-brand-500/10 group-hover:bg-brand-500/20" :
                                    f.color === "amber" ? "bg-amber-500/10 group-hover:bg-amber-500/20" :
                                    f.color === "accent" ? "bg-accent-500/10 group-hover:bg-accent-500/20" :
                                    "bg-blue-500/10 group-hover:bg-blue-500/20"
                                } transition-colors`}>
                                    <f.icon className={`text-lg ${
                                        f.color === "brand" ? "text-brand-400" :
                                        f.color === "amber" ? "text-amber-400" :
                                        f.color === "accent" ? "text-accent-400" : "text-blue-400"
                                    }`} />
                                </div>
                                <h3 className="text-base font-heading font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-surface-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                TESTIMONIALS
            ═══════════════════════════════════════════ */}
            <section className="py-24 px-4 relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent" />
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-sm font-medium text-brand-400 uppercase tracking-wider mb-3">Testimonials</p>
                        <h2 className="heading-lg text-3xl sm:text-4xl text-white">
                            What students are saying
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            { name: "Priya Sharma", role: "BCA Student, Mumbai University", text: "This tool helped me realize my resume was missing key skills like Docker and AWS. After adding them, I got 3 interview calls in a week!", avatar: "PS" },
                            { name: "Rahul Verma", role: "MCA Graduate, IGNOU", text: "The ATS score breakdown is incredibly detailed. I went from a 42 to a 78 after following the suggestions. Best free tool I've found.", avatar: "RV" },
                            { name: "Ananya Desai", role: "B.Tech CSE, Gujarat Tech", text: "The AI Resume Builder feature is amazing — it rewrote my resume with action verbs and metrics I never thought of. Highly recommended!", avatar: "AD" },
                        ].map((t, i) => (
                            <div key={i} className="card p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">{t.avatar}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{t.name}</p>
                                        <p className="text-xs text-surface-500">{t.role}</p>
                                    </div>
                                </div>
                                <p className="text-surface-400 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                FAQ
            ═══════════════════════════════════════════ */}
            <section className="py-24 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-sm font-medium text-accent-400 uppercase tracking-wider mb-3">FAQ</p>
                        <h2 className="heading-lg text-3xl text-white">Common questions</h2>
                    </div>

                    <div className="card p-6 sm:p-8">
                        {faqs.map((faq, i) => (
                            <FAQItem
                                key={i}
                                question={faq.q}
                                answer={faq.a}
                                isOpen={openFaq === i}
                                toggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                FINAL CTA
            ═══════════════════════════════════════════ */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="card-elevated p-10 sm:p-14 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-gradient-to-b from-brand-500/10 to-transparent blur-[60px]" />
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-500/20">
                                <FiAward className="text-white text-2xl" />
                            </div>
                            <h2 className="heading-lg text-3xl sm:text-4xl text-white mb-4">
                                Ready to improve your resume?
                            </h2>
                            <p className="text-surface-400 text-lg mb-8 max-w-md mx-auto">
                                Join students who've boosted their interview chances with AI-powered analysis.
                            </p>
                            <Link
                                to={user ? "/upload" : "/signup"}
                                className="btn-primary text-base inline-flex items-center gap-2 !py-3.5 !px-10"
                            >
                                Get Started Free
                                <FiArrowRight />
                            </Link>
                            <p className="text-surface-600 text-xs mt-4">
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
