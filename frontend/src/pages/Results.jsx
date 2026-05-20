import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getResumeById, getReportUrl } from "../services/api";
import ScoreCircle from "../components/ScoreCircle";
import {
  FiCheck,
  FiAlertTriangle,
  FiArrowLeft,
  FiFileText,
  FiZap,
  FiTarget,
  FiCheckCircle,
  FiDownload,
  FiBriefcase,
  FiLayers,
  FiAlertCircle,
} from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineLightBulb } from "react-icons/hi2";
import AutoFixResume from "../components/AutoFixResume";
import JDMatcher from "../components/JDMatcher";
import InterviewQuestions from "../components/InterviewQuestions";
import ResumeHeatmap from "../components/ResumeHeatmap";
import AnalyticsCharts from "../components/AnalyticsCharts";
import VoiceFeedback from "../components/VoiceFeedback";

// â”€â”€â”€ Mini Progress Bar Component â”€â”€â”€
const ProgressBar = ({ value, max, color }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 bg-surface-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-sm font-semibold text-surface-300 w-16 text-right">
        {value}/{max}
      </span>
    </div>
  );
};

// â”€â”€â”€ Status Badge Component â”€â”€â”€
const StatusBadge = ({ status }) => {
  const config = {
    strong: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
    moderate: { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30" },
    weak: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
    missing: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
  };
  const c = config[status] || config.missing;
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize ${c.bg} ${c.text} border ${c.border}`}>
      {status}
    </span>
  );
};

const Results = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const res = await getResumeById(id);
      setResume(res.data);
    } catch (err) {
      setError("Could not load resume analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    const token = localStorage.getItem("token");
    const url = getReportUrl(id);
    // Open in new tab â€” user can Print â†’ Save as PDF
    window.open(`${url}?token=${token}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-surface-400">Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-md">
          <FiAlertTriangle className="text-4xl text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Analysis Not Found</h2>
          <p className="text-surface-400 mb-6">{error}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors"
          >
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "analytics", label: "📊 Analytics" },
    { key: "heatmap", label: "🗺️ Heatmap" },
    { key: "skills", label: "Skills" },
    { key: "roles", label: "Job Roles" },
    { key: "feedback", label: "Feedback" },
    { key: "suggestions", label: "Suggestions" },
    { key: "jd-match", label: "JD Match" },
    { key: "interview", label: "🎤 Interview" },
    { key: "ai-builder", label: "✨ AI Builder" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-accent-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors"
          >
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <VoiceFeedback resume={resume} />
            <button
              onClick={handleDownloadReport}
              className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm"
            >
              <FiDownload /> Download Report
            </button>
          </div>
        </div>

        {/* â•â•â• Header Card â•â•â• */}
        <div className="card p-8 mb-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <ScoreCircle score={resume.atsScore} />
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Resume Analysis Results
              </h1>
              <div className="flex items-center gap-2 justify-center lg:justify-start text-surface-400 mb-4">
                <FiFileText />
                <span className="text-sm">{resume.fileName}</span>
                <span className="text-surface-600">â€¢</span>
                <span className="text-sm">{resume.wordCount || 0} words</span>
                {resume.bestFitRole && (
                  <>
                    <span className="text-surface-600">â€¢</span>
                    <span className="text-sm text-brand-400 font-medium">
                      Best fit: {resume.bestFitRole}
                    </span>
                  </>
                )}
              </div>

              {/* Score Breakdown Bars */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
                <div>
                  <p className="text-xs text-surface-500 mb-1">Content</p>
                  <ProgressBar
                    value={resume.scoreBreakdown?.content || 0}
                    max={30}
                    color="#3b82f6"
                  />
                </div>
                <div>
                  <p className="text-xs text-surface-500 mb-1">Skills</p>
                  <ProgressBar
                    value={resume.scoreBreakdown?.skills || 0}
                    max={35}
                    color="#22c55e"
                  />
                </div>
                <div>
                  <p className="text-xs text-surface-500 mb-1">Formatting</p>
                  <ProgressBar
                    value={resume.scoreBreakdown?.formatting || 0}
                    max={20}
                    color="#a855f7"
                  />
                </div>
                <div>
                  <p className="text-xs text-surface-500 mb-1">Impact</p>
                  <ProgressBar
                    value={resume.scoreBreakdown?.impact || 0}
                    max={15}
                    color="#f59e0b"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* â•â•â• Tab Navigation â•â•â• */}
        <div className="flex gap-1 mb-6 overflow-x-auto p-1 bg-surface-800/50 rounded-xl animate-slide-up">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-[100px] px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                  : "text-surface-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB: OVERVIEW
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            {/* Detected Skills */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <FiCheckCircle className="text-green-400 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Detected Skills</h2>
                  <p className="text-xs text-surface-500">{resume.detectedSkills?.length || 0} skills found</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(resume.detectedSkills || []).slice(0, 15).map((skill, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-300 text-sm"
                  >
                    <FiCheck className="text-xs" /> {skill}
                  </span>
                ))}
                {(resume.detectedSkills?.length || 0) > 15 && (
                  <button
                    onClick={() => setActiveTab("skills")}
                    className="px-3 py-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    +{resume.detectedSkills.length - 15} more â†’
                  </button>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <FiTarget className="text-orange-400 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Missing Skills</h2>
                  <p className="text-xs text-surface-500">In-demand skills to add</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(resume.missingSkills || []).map((skill, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-300 text-sm"
                  >
                    <FiZap className="text-xs" /> {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Job Matches (Preview) */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                  <FiBriefcase className="text-brand-400 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Best Job Matches</h2>
                  <p className="text-xs text-surface-500">Top role fits</p>
                </div>
              </div>
              <div className="space-y-3">
                {(resume.jobRoleMatches || []).slice(0, 3).map((jm, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-surface-300 flex-1 truncate">{jm.role}</span>
                    <div className="w-24 h-2 bg-surface-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                        style={{ width: `${jm.matchPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-brand-400 w-10 text-right">
                      {jm.matchPercentage}%
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("roles")}
                className="mt-4 text-sm text-brand-400 hover:text-brand-300 transition-colors"
              >
                View all matches â†’
              </button>
            </div>

            {/* Section Health (Preview) */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center">
                  <FiLayers className="text-accent-400 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section Health</h2>
                  <p className="text-xs text-surface-500">Section-by-section analysis</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {(resume.sectionFeedback || []).map((sf, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-800/40 rounded-xl">
                    <span className="text-sm text-surface-300">{sf.section}</span>
                    <StatusBadge status={sf.status} />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("feedback")}
                className="mt-4 text-sm text-brand-400 hover:text-brand-300 transition-colors"
              >
                View detailed feedback â†’
              </button>
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB: SKILLS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "skills" && (
          <div className="space-y-6 animate-fade-in">
            {/* Skill Categories */}
            {(resume.skillCategories || []).length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <FiLayers className="text-brand-400" /> Skills by Category
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resume.skillCategories.map((cat, i) => (
                    <div key={i} className="p-4 bg-surface-800/40 rounded-xl border border-surface-700/30">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-white">{cat.category}</h3>
                        <span className="text-xs text-brand-400 font-medium bg-brand-500/10 px-2 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((skill, j) => (
                          <span key={j} className="px-2.5 py-1 text-xs bg-green-500/10 border border-green-500/20 rounded-md text-green-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Detected vs Missing */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h2 className="text-lg font-bold text-white mb-4">
                  âœ… All Detected Skills ({resume.detectedSkills?.length || 0})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(resume.detectedSkills || []).map((skill, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-300 text-sm">
                      <FiCheck className="text-xs" /> {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <h2 className="text-lg font-bold text-white mb-4">
                  âš ï¸ Missing In-Demand Skills ({resume.missingSkills?.length || 0})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(resume.missingSkills || []).map((skill, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-300 text-sm">
                      <FiZap className="text-xs" /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB: JOB ROLES
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "roles" && (
          <div className="space-y-6 animate-fade-in">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <FiBriefcase className="text-brand-400" /> Job Role Matching
              </h2>
              <div className="space-y-4">
                {(resume.jobRoleMatches || []).map((jm, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-xl border transition-all ${
                      i === 0
                        ? "bg-brand-500/5 border-brand-500/20"
                        : "bg-surface-800/30 border-surface-700/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {i === 0 && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-brand-500 to-accent-500 text-white rounded-md">
                            BEST FIT
                          </span>
                        )}
                        <h3 className="text-base font-semibold text-white">{jm.role}</h3>
                      </div>
                      <span className={`text-lg font-bold ${jm.matchPercentage >= 60 ? "text-green-400" : jm.matchPercentage >= 40 ? "text-yellow-400" : "text-orange-400"}`}>
                        {jm.matchPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-800 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-1000"
                        style={{ width: `${jm.matchPercentage}%` }}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-surface-500 mb-2">Matched Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(jm.matchedSkills || []).map((s, j) => (
                            <span key={j} className="px-2 py-0.5 text-xs bg-green-500/10 border border-green-500/20 rounded text-green-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-surface-500 mb-2">Skills to Add</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(jm.missingSkills || []).map((s, j) => (
                            <span key={j} className="px-2 py-0.5 text-xs bg-orange-500/10 border border-orange-500/20 rounded text-orange-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB: FEEDBACK
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "feedback" && (
          <div className="space-y-4 animate-fade-in">
            {(resume.sectionFeedback || []).map((sf, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      sf.status === "strong" ? "bg-green-500/20" :
                      sf.status === "moderate" ? "bg-yellow-500/20" :
                      sf.status === "weak" ? "bg-orange-500/20" : "bg-red-500/20"
                    }`}>
                      {sf.status === "strong" ? (
                        <FiCheckCircle className="text-green-400" />
                      ) : sf.status === "moderate" ? (
                        <FiAlertCircle className="text-yellow-400" />
                      ) : (
                        <FiAlertTriangle className={sf.status === "weak" ? "text-orange-400" : "text-red-400"} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{sf.section}</h3>
                      <p className="text-xs text-surface-500">Score: {sf.score}/100</p>
                    </div>
                  </div>
                  <StatusBadge status={sf.status} />
                </div>

                {/* Progress */}
                <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${
                      sf.status === "strong" ? "bg-green-500" :
                      sf.status === "moderate" ? "bg-yellow-500" :
                      sf.status === "weak" ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${sf.score}%` }}
                  />
                </div>

                <p className="text-surface-300 text-sm mb-3">{sf.feedback}</p>

                {sf.tips?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Tips to improve:</p>
                    {sf.tips.map((tip, j) => (
                      <div key={j} className="flex items-start gap-2 p-3 bg-surface-800/50 rounded-lg border border-surface-700/30">
                        <HiOutlineLightBulb className="text-accent-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-surface-400">{tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB: SUGGESTIONS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "suggestions" && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center">
                <HiOutlineLightBulb className="text-accent-400 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Smart Suggestions</h2>
                <p className="text-xs text-surface-500">AI-powered tips to boost your resume</p>
              </div>
            </div>
            <div className="space-y-3">
              {(resume.suggestions || []).map((suggestion, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-surface-800/50 rounded-xl border border-surface-700/50"
                >
                  <div className="w-6 h-6 bg-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlineSparkles className="text-accent-400 text-xs" />
                  </div>
                  <p className="text-surface-300 text-sm leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            TAB: AI BUILDER
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "ai-builder" && (
          <div className="animate-fade-in">
            <AutoFixResume resumeId={id} />
          </div>
        )}

        {/* ═══════ TAB: ANALYTICS ═══════ */}
        {activeTab === "analytics" && (
          <div className="animate-fade-in">
            <AnalyticsCharts resume={resume} />
          </div>
        )}

        {/* ═══════ TAB: HEATMAP ═══════ */}
        {activeTab === "heatmap" && (
          <div className="animate-fade-in">
            <ResumeHeatmap sectionFeedback={resume.sectionFeedback} />
          </div>
        )}

        {/* ═══════ TAB: JD MATCH ═══════ */}
        {activeTab === "jd-match" && (
          <div className="animate-fade-in">
            <JDMatcher resumeId={id} />
          </div>
        )}

        {/* ═══════ TAB: INTERVIEW ═══════ */}
        {activeTab === "interview" && (
          <div className="animate-fade-in">
            <InterviewQuestions resumeId={id} />
          </div>
        )}

        {/* â•â•â• Bottom CTA â•â•â• */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <Link
            to="/upload"
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
          >
            <HiOutlineSparkles /> Upload Another Resume
          </Link>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all"
          >
            <FiDownload /> Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;

