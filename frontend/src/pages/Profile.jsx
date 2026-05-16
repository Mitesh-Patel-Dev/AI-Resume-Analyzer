import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiCalendar, FiFileText, FiTarget, FiTrendingUp } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getMyResumes } from "../services/api";

const Profile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, best: 0, avg: 0, skills: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getMyResumes();
                const resumes = res.data;
                const total = resumes.length;
                const best = total > 0 ? Math.max(...resumes.map((r) => r.atsScore)) : 0;
                const avg = total > 0 ? Math.round(resumes.reduce((s, r) => s + r.atsScore, 0) / total) : 0;
                const skills = total > 0 ? [...new Set(resumes.flatMap((r) => r.detectedSkills || []))].length : 0;
                setStats({ total, best, avg, skills });
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="heading-lg text-3xl text-white mb-8 animate-fade-in">Profile</h1>

                {/* Profile Card */}
                <div className="card-elevated p-8 mb-6 animate-slide-up">
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <span className="text-2xl font-bold text-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 className="heading-lg text-xl text-white">{user?.name}</h2>
                            <p className="text-surface-500 text-sm">Member since {new Date().getFullYear()}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-surface-900/40 rounded-xl">
                            <FiUser className="text-surface-500" />
                            <div>
                                <p className="text-xs text-surface-600">Full Name</p>
                                <p className="text-sm text-white font-medium">{user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-surface-900/40 rounded-xl">
                            <FiMail className="text-surface-500" />
                            <div>
                                <p className="text-xs text-surface-600">Email</p>
                                <p className="text-sm text-white font-medium">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-surface-900/40 rounded-xl">
                            <FiCalendar className="text-surface-500" />
                            <div>
                                <p className="text-xs text-surface-600">Account Created</p>
                                <p className="text-sm text-white font-medium">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="card p-6 animate-slide-up">
                    <h3 className="heading-lg text-lg text-white mb-5">Your Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: FiFileText, label: "Resumes Uploaded", value: stats.total, color: "brand" },
                            { icon: FiTarget, label: "Best ATS Score", value: `${stats.best}/100`, color: "green" },
                            { icon: FiTrendingUp, label: "Average Score", value: `${stats.avg}/100`, color: "amber" },
                            { icon: FiTarget, label: "Unique Skills", value: stats.skills, color: "accent" },
                        ].map((s, i) => (
                            <div key={i} className="card-surface p-4 text-center">
                                <s.icon className={`mx-auto text-lg mb-2 ${
                                    s.color === "brand" ? "text-brand-400" :
                                    s.color === "green" ? "text-green-400" :
                                    s.color === "amber" ? "text-amber-400" : "text-accent-400"
                                }`} />
                                <p className="text-lg font-heading font-bold text-white">{s.value}</p>
                                <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
