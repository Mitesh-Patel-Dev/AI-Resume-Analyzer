import { FiGithub, FiExternalLink, FiDatabase, FiServer, FiMonitor, FiCpu, FiShield, FiLayers } from "react-icons/fi";

const About = () => {
    const techStack = [
        { category: "Frontend", items: ["React 18", "Vite", "Tailwind CSS", "React Router", "Axios"], icon: FiMonitor, color: "brand" },
        { category: "Backend", items: ["Node.js", "Express.js", "JWT Auth", "Multer", "PDF-Parse"], icon: FiServer, color: "accent" },
        { category: "Database", items: ["MongoDB Atlas", "Mongoose ODM"], icon: FiDatabase, color: "blue" },
        { category: "AI / ML", items: ["Skill Detection Engine", "ATS Scoring Algorithm", "LLM Integration (Groq)"], icon: FiCpu, color: "purple" },
    ];

    const modules = [
        { title: "User Authentication", desc: "JWT-based signup/login with secure session handling and protected routes.", icon: FiShield },
        { title: "Resume Upload & Parsing", desc: "Upload PDF resumes via drag-and-drop. Text extracted using pdf-parse library.", icon: FiLayers },
        { title: "AI Analysis Engine", desc: "Detects 150+ skills across 9 categories. Calculates ATS score across 4 dimensions.", icon: FiCpu },
        { title: "Job Role Matching", desc: "Matches resume skills to 8 career profiles and suggests the best-fit role.", icon: FiExternalLink },
        { title: "AI Resume Builder", desc: "Uses Groq LLM API (Llama 3.3 70B) to rewrite resumes with missing skills integrated.", icon: FiCpu },
        { title: "Report Generation", desc: "Generates downloadable PDF reports with full analysis, scores, and suggestions.", icon: FiExternalLink },
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full mb-6">
                        <span className="text-xs text-brand-300 font-medium tracking-wide uppercase">BCA Final Year Project</span>
                    </div>
                    <h1 className="heading-xl text-4xl sm:text-5xl text-white mb-4">
                        AI-Powered Resume Analyzer
                    </h1>
                    <p className="text-lg text-surface-400 max-w-2xl mx-auto leading-relaxed">
                        with ATS Optimization & Skill Intelligence
                    </p>
                </div>

                {/* Project Info */}
                <div className="card-elevated p-8 mb-8 animate-slide-up">
                    <h2 className="heading-lg text-xl text-white mb-4">About the Project</h2>
                    <p className="text-surface-400 leading-relaxed mb-4">
                        This is a full-stack web application built as a BCA Final Year Project. It analyzes uploaded PDF resumes using AI algorithms to provide comprehensive ATS compatibility scoring, skill detection, job role matching, and personalized improvement suggestions.
                    </p>
                    <p className="text-surface-400 leading-relaxed mb-6">
                        The system goes beyond basic keyword matching — it evaluates resume content quality, formatting standards, impact metrics, and skill coverage across 9 technical and soft-skill categories. An integrated AI Resume Builder can rewrite resumes using a large language model.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="https://github.com/Mitesh-Patel-Dev/AI-Resume-Analyzer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost inline-flex items-center gap-2 !py-2.5 !px-5 text-sm"
                        >
                            <FiGithub /> View on GitHub
                        </a>
                    </div>
                </div>

                {/* Developers */}
                <div className="card p-6 mb-8 animate-slide-up">
                    <h2 className="heading-lg text-lg text-white mb-5">Developers</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-surface-900/40 rounded-xl">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-white">MP</span>
                            </div>
                            <div>
                                <p className="font-heading font-semibold text-white text-lg">Mitesh Patel</p>
                                <p className="text-surface-500 text-sm">BCA Student • Full-Stack Developer</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-surface-900/40 rounded-xl">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-brand-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-white">VM</span>
                            </div>
                            <div>
                                <p className="font-heading font-semibold text-white text-lg">Vishal Mahto</p>
                                <p className="text-surface-500 text-sm">BCA Student • Full-Stack Developer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-8 animate-slide-up">
                    <h2 className="heading-lg text-xl text-white mb-5">Tech Stack</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {techStack.map((tech, i) => (
                            <div key={i} className="card p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                        tech.color === "brand" ? "bg-brand-500/15 text-brand-400" :
                                        tech.color === "accent" ? "bg-accent-500/15 text-accent-400" :
                                        tech.color === "blue" ? "bg-blue-500/15 text-blue-400" :
                                        "bg-purple-500/15 text-purple-400"
                                    }`}>
                                        <tech.icon className="text-base" />
                                    </div>
                                    <h3 className="font-heading font-semibold text-white">{tech.category}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tech.items.map((item, j) => (
                                        <span key={j} className="text-xs px-2.5 py-1 bg-surface-800/60 border border-surface-700/40 rounded-lg text-surface-400">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modules */}
                <div className="animate-slide-up">
                    <h2 className="heading-lg text-xl text-white mb-5">Core Modules</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {modules.map((mod, i) => (
                            <div key={i} className="card-outlined p-5 group">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <mod.icon className="text-brand-400 text-sm" />
                                    </div>
                                    <div>
                                        <h4 className="font-heading font-semibold text-white text-sm mb-1">{mod.title}</h4>
                                        <p className="text-surface-500 text-xs leading-relaxed">{mod.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
