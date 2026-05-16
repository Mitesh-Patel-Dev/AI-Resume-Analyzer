import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyResumes, deleteResume } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FiUpload, FiFileText, FiTrash2, FiEye, FiClock, FiTrendingUp,
  FiTarget, FiAward, FiBriefcase, FiBarChart,
} from "react-icons/fi";

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await getMyResumes();
      setResumes(res.data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await deleteResume(id);
      setResumes(resumes.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting resume:", err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-amber-400";
    if (score >= 25) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 75) return "bg-green-500/10 border-green-500/20";
    if (score >= 50) return "bg-amber-500/10 border-amber-500/20";
    if (score >= 25) return "bg-orange-500/10 border-orange-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    if (score >= 25) return "Needs Work";
    return "Poor";
  };

  const totalResumes = resumes.length;
  const bestScore = resumes.length > 0 ? Math.max(...resumes.map((r) => r.atsScore)) : 0;
  const avgScore = resumes.length > 0 ? Math.round(resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length) : 0;
  const totalSkills = resumes.length > 0 ? [...new Set(resumes.flatMap((r) => r.detectedSkills || []))].length : 0;
  const topRoles = [...new Set(resumes.map((r) => r.bestFitRole).filter(Boolean))].slice(0, 3);

  // Score history data for chart (last 5 resumes)
  const chartData = resumes.slice(-5).map((r) => ({ score: r.atsScore, date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) }));
  const maxChartScore = Math.max(100, ...chartData.map((d) => d.score));

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 animate-fade-in">
          <div>
            <h1 className="heading-lg text-3xl text-white mb-1">
              Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-surface-500">Track your resume performance and improve your ATS score</p>
          </div>
          <Link to="/upload" className="btn-primary flex items-center gap-2">
            <FiUpload /> Upload Resume
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {[
            { icon: FiFileText, label: "Total Resumes", value: totalResumes, color: "brand" },
            { icon: FiAward, label: "Best Score", value: `${bestScore}/100`, color: "green" },
            { icon: FiTrendingUp, label: "Avg Score", value: `${avgScore}/100`, color: "amber" },
            { icon: FiTarget, label: "Skills Found", value: totalSkills, color: "accent" },
          ].map((stat, i) => (
            <div key={i} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                stat.color === "brand" ? "bg-brand-500/15 text-brand-400" :
                stat.color === "green" ? "bg-green-500/15 text-green-400" :
                stat.color === "amber" ? "bg-amber-500/15 text-amber-400" :
                "bg-accent-500/15 text-accent-400"
              }`}>
                <stat.icon className="text-lg" />
              </div>
              <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
              <p className="text-sm text-surface-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Score History Chart */}
        {chartData.length >= 2 && (
          <div className="card p-6 mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-5">
              <FiBarChart className="text-brand-400" />
              <h3 className="font-heading font-semibold text-white">Score History</h3>
              <span className="text-xs text-surface-600 ml-auto">Last {chartData.length} uploads</span>
            </div>
            <div className="flex items-end gap-3 h-40">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-mono text-surface-400">{d.score}</span>
                  <div className="w-full bg-surface-800/60 rounded-t-lg relative overflow-hidden" style={{ height: "100%" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700"
                      style={{
                        height: `${(d.score / maxChartScore) * 100}%`,
                        background: d.score >= 75 ? "linear-gradient(to top, #059669, #34d399)" :
                          d.score >= 50 ? "linear-gradient(to top, #d97706, #fbbf24)" :
                          "linear-gradient(to top, #dc2626, #f87171)",
                      }}
                    />
                  </div>
                  <span className="text-xs text-surface-600">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Matched Roles */}
        {topRoles.length > 0 && (
          <div className="card p-5 mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <FiBriefcase className="text-accent-400" />
              <h3 className="text-sm font-heading font-semibold text-white">Your Top Matched Roles</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {topRoles.map((role, i) => (
                <span key={i} className="tag tag-brand">{role}</span>
              ))}
            </div>
          </div>
        )}

        {/* Resume List */}
        <div className="animate-slide-up">
          <h2 className="heading-lg text-xl text-white mb-5 flex items-center gap-2">
            <FiFileText className="text-brand-400" /> Your Resumes
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <div className="w-16 h-16 bg-surface-800/60 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FiFileText className="text-2xl text-surface-500" />
              </div>
              <h3 className="heading-lg text-lg text-white mb-2">No resumes yet</h3>
              <p className="text-surface-500 mb-6">Upload your first resume to get AI-powered analysis</p>
              <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
                <FiUpload /> Upload Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div key={resume._id} className="card p-5 hover:border-surface-600 transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiFileText className="text-brand-400 text-lg" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{resume.fileName}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-surface-500">
                            <FiClock className="text-xs" />
                            {new Date(resume.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="text-xs text-surface-700">•</span>
                          <span className="text-xs text-surface-500">{resume.detectedSkills?.length || 0} skills</span>
                          {resume.bestFitRole && (
                            <>
                              <span className="text-xs text-surface-700">•</span>
                              <span className="text-xs text-brand-400 font-medium">{resume.bestFitRole}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className={`px-4 py-2 rounded-xl border font-bold text-sm ${getScoreBg(resume.atsScore)} ${getScoreColor(resume.atsScore)}`}>
                          {resume.atsScore}/100
                        </div>
                        <p className={`text-xs mt-1 ${getScoreColor(resume.atsScore)}`}>{getScoreLabel(resume.atsScore)}</p>
                      </div>
                      <Link to={`/results/${resume._id}`} className="p-2.5 text-surface-500 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-all" title="View">
                        <FiEye />
                      </Link>
                      <button onClick={() => handleDelete(resume._id)} className="p-2.5 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {resume.scoreBreakdown && (
                    <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-surface-800/40">
                      {[
                        { label: "Content", val: resume.scoreBreakdown.content, max: 30, color: "#3b82f6" },
                        { label: "Skills", val: resume.scoreBreakdown.skills, max: 35, color: "#10b981" },
                        { label: "Format", val: resume.scoreBreakdown.formatting, max: 20, color: "#8b5cf6" },
                        { label: "Impact", val: resume.scoreBreakdown.impact, max: 15, color: "#f59e0b" },
                      ].map((b, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-surface-500">{b.label}</span>
                            <span className="text-surface-400 font-medium">{b.val}/{b.max}</span>
                          </div>
                          <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(b.val / b.max) * 100}%`, background: b.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
