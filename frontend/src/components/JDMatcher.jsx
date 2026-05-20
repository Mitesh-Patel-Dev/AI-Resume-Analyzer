import { useState } from "react";
import { matchJobDescription } from "../services/api";
import { FiSearch, FiCheckCircle, FiAlertCircle, FiArrowRight } from "react-icons/fi";

const JDMatcher = ({ resumeId }) => {
    const [jdText, setJdText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleMatch = async () => {
        if (jdText.trim().length < 20) {
            setError("Please paste a job description (at least 20 characters).");
            return;
        }
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await matchJobDescription(resumeId, jdText);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to match. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const getMatchColor = (pct) => {
        if (pct >= 70) return { ring: "text-green-400", bg: "bg-green-500/15", label: "Strong Match" };
        if (pct >= 40) return { ring: "text-amber-400", bg: "bg-amber-500/15", label: "Moderate Match" };
        return { ring: "text-red-400", bg: "bg-red-500/15", label: "Low Match" };
    };

    return (
        <div className="space-y-5">
            <div>
                <h3 className="font-heading font-semibold text-white mb-1">Paste Job Description</h3>
                <p className="text-surface-500 text-sm mb-3">
                    Paste the full job posting to see how well your resume matches.
                </p>
                <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={6}
                    className="w-full p-4 bg-surface-900/50 border border-surface-700/60 rounded-xl text-white placeholder-surface-600 text-sm leading-relaxed resize-none transition-all"
                />
                <button
                    onClick={handleMatch}
                    disabled={loading || jdText.trim().length < 20}
                    className="mt-3 btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                    ) : (
                        <><FiSearch /> Analyze Match</>
                    )}
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                    <FiAlertCircle /> {error}
                </div>
            )}

            {result && (
                <div className="space-y-5 animate-slide-up">
                    {/* Match Percentage */}
                    <div className="card-elevated p-6 text-center">
                        <div className="relative w-28 h-28 mx-auto mb-4">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-surface-800" strokeWidth="6" />
                                <circle
                                    cx="50" cy="50" r="42" fill="none"
                                    stroke="currentColor"
                                    className={getMatchColor(result.matchPercentage).ring}
                                    strokeWidth="6" strokeLinecap="round"
                                    strokeDasharray={264}
                                    strokeDashoffset={264 - (result.matchPercentage / 100) * 264}
                                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-heading font-bold text-white">{result.matchPercentage}%</span>
                            </div>
                        </div>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getMatchColor(result.matchPercentage).bg} ${getMatchColor(result.matchPercentage).ring}`}>
                            {getMatchColor(result.matchPercentage).label}
                        </span>
                    </div>

                    {/* Matched Keywords */}
                    {result.matchedKeywords?.length > 0 && (
                        <div className="card p-5">
                            <h4 className="font-heading font-semibold text-white mb-3 flex items-center gap-2">
                                <FiCheckCircle className="text-green-400" /> Matched Keywords ({result.matchedKeywords.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.matchedKeywords.map((kw, i) => (
                                    <span key={i} className="tag tag-brand">{kw}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Missing Keywords */}
                    {result.missingKeywords?.length > 0 && (
                        <div className="card p-5">
                            <h4 className="font-heading font-semibold text-white mb-3 flex items-center gap-2">
                                <FiAlertCircle className="text-amber-400" /> Missing Keywords ({result.missingKeywords.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.missingKeywords.map((kw, i) => (
                                    <span key={i} className="tag tag-warning">{kw}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {result.suggestions?.length > 0 && (
                        <div className="card p-5">
                            <h4 className="font-heading font-semibold text-white mb-3">💡 Suggestions</h4>
                            <ul className="space-y-2">
                                {result.suggestions.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-surface-400">
                                        <FiArrowRight className="text-brand-400 mt-0.5 flex-shrink-0" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JDMatcher;
