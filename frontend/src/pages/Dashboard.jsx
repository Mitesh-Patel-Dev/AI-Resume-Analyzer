import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyResumes, deleteResume } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FiUpload,
  FiFileText,
  FiTrash2,
  FiEye,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiAward,
  FiBriefcase,
  FiDownload,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

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
    if (score >= 50) return "text-yellow-400";
    if (score >= 25) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 75) return "bg-green-500/10 border-green-500/20";
    if (score >= 50) return "bg-yellow-500/10 border-yellow-500/20";
    if (score >= 25) return "bg-orange-500/10 border-orange-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    if (score >= 25) return "Needs Work";
    return "Poor";
  };

  // Compute stats
  const totalResumes = resumes.length;
  const bestScore = resumes.length > 0 ? Math.max(...resumes.map((r) => r.atsScore)) : 0;
  const avgScore =
    resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length)
      : 0;
  const totalSkills =
    resumes.length > 0
      ? [...new Set(resumes.flatMap((r) => r.detectedSkills || []))].length
      : 0;
  const topRoles = [
    ...new Set(resumes.map((r) => r.bestFitRole).filter(Boolean)),
  ].slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-accent-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-dark-400">
              Track your resume performance and improve your ATS score
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
          >
            <FiUpload /> Upload Resume
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-slide-up">
          {[
            { icon: FiFileText, label: "Total Resumes", value: totalResumes, color: "primary" },
            { icon: FiAward, label: "Best Score", value: `${bestScore}/100`, color: "green" },
            { icon: FiTrendingUp, label: "Avg Score", value: `${avgScore}/100`, color: "yellow" },
            { icon: FiTarget, label: "Skills Found", value: totalSkills, color: "accent" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  stat.color === "primary"
                    ? "bg-primary-500/20 text-primary-400"
                    : stat.color === "green"
                    ? "bg-green-500/20 text-green-400"
                    : stat.color === "yellow"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-accent-500/20 text-accent-400"
                }`}
              >
                <stat.icon className="text-lg" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-dark-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Top Matched Roles */}
        {topRoles.length > 0 && (
          <div className="glass-card p-5 mb-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <FiBriefcase className="text-primary-400" />
              <h3 className="text-sm font-semibold text-white">Your Top Matched Roles</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {topRoles.map((role, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-sm bg-primary-500/10 border border-primary-500/20 rounded-lg text-primary-300 font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resumes List */}
        <div className="animate-slide-up">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <HiOutlineSparkles className="text-primary-400" />
            Your Resumes
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FiFileText className="text-3xl text-dark-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No resumes yet</h3>
              <p className="text-dark-500 mb-6">
                Upload your first resume to get AI-powered analysis
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
              >
                <FiUpload /> Upload Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="glass-card p-5 hover:border-primary-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-primary-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiFileText className="text-primary-400 text-xl" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{resume.fileName}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-dark-500">
                            <FiClock className="text-xs" />
                            {new Date(resume.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-xs text-dark-600">•</span>
                          <span className="text-xs text-dark-500">
                            {resume.detectedSkills?.length || 0} skills
                          </span>
                          {resume.bestFitRole && (
                            <>
                              <span className="text-xs text-dark-600">•</span>
                              <span className="text-xs text-primary-400 font-medium">
                                {resume.bestFitRole}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Score Badge */}
                      <div className="text-center">
                        <div
                          className={`px-4 py-2 rounded-xl border font-bold text-sm ${getScoreBg(
                            resume.atsScore
                          )} ${getScoreColor(resume.atsScore)}`}
                        >
                          {resume.atsScore}/100
                        </div>
                        <p className={`text-xs mt-1 ${getScoreColor(resume.atsScore)}`}>
                          {getScoreLabel(resume.atsScore)}
                        </p>
                      </div>

                      {/* Actions */}
                      <Link
                        to={`/results/${resume._id}`}
                        className="p-2.5 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                        title="View Results"
                      >
                        <FiEye />
                      </Link>
                      <button
                        onClick={() => handleDelete(resume._id)}
                        className="p-2.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {/* Score Breakdown Mini-Bars */}
                  {resume.scoreBreakdown && (
                    <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-dark-700/30">
                      {[
                        { label: "Content", val: resume.scoreBreakdown.content, max: 30, color: "#3b82f6" },
                        { label: "Skills", val: resume.scoreBreakdown.skills, max: 35, color: "#22c55e" },
                        { label: "Format", val: resume.scoreBreakdown.formatting, max: 20, color: "#a855f7" },
                        { label: "Impact", val: resume.scoreBreakdown.impact, max: 15, color: "#f59e0b" },
                      ].map((b, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-dark-500">{b.label}</span>
                            <span className="text-dark-400 font-medium">{b.val}/{b.max}</span>
                          </div>
                          <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(b.val / b.max) * 100}%`,
                                background: b.color,
                              }}
                            />
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
