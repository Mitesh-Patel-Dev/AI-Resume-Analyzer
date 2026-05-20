import { useState } from "react";
import { generateInterviewQuestions } from "../services/api";
import { FiCpu, FiCopy, FiCheck, FiAlertCircle } from "react-icons/fi";

const difficultyColors = {
    Easy: "bg-green-500/15 text-green-400 border-green-500/30",
    Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

const InterviewQuestions = ({ resumeId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await generateInterviewQuestions(resumeId);
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate questions.");
        } finally {
            setLoading(false);
        }
    };

    const copyAll = () => {
        if (!data?.questions) return;
        const allQs = [
            "TECHNICAL QUESTIONS:",
            ...(data.questions.technical || []).map((q, i) => `${i + 1}. [${q.difficulty}] ${q.question}`),
            "\nBEHAVIORAL QUESTIONS:",
            ...(data.questions.behavioral || []).map((q, i) => `${i + 1}. [${q.difficulty}] ${q.question}`),
            "\nSITUATIONAL QUESTIONS:",
            ...(data.questions.situational || []).map((q, i) => `${i + 1}. [${q.difficulty}] ${q.question}`),
        ].join("\n");
        navigator.clipboard.writeText(allQs);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderSection = (title, emoji, questions) => {
        if (!questions || questions.length === 0) return null;
        return (
            <div className="card p-5">
                <h4 className="font-heading font-semibold text-white mb-4">{emoji} {title}</h4>
                <div className="space-y-3">
                    {questions.map((q, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-surface-900/40 rounded-xl">
                            <span className="text-sm font-mono text-surface-600 mt-0.5">{i + 1}.</span>
                            <div className="flex-1">
                                <p className="text-sm text-surface-300 leading-relaxed">{q.question}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-md border ${difficultyColors[q.difficulty] || difficultyColors.Medium}`}>
                                        {q.difficulty}
                                    </span>
                                    {q.topic && (
                                        <span className="text-xs text-surface-600">{q.topic}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            {!data && (
                <div className="card-elevated p-8 text-center">
                    <div className="w-14 h-14 bg-accent-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FiCpu className="text-accent-400 text-2xl" />
                    </div>
                    <h3 className="font-heading font-semibold text-white mb-2">AI Interview Question Generator</h3>
                    <p className="text-surface-500 text-sm mb-6 max-w-md mx-auto">
                        Generate personalized interview questions based on your detected skills and best-fit role.
                    </p>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                        {loading ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                        ) : (
                            <><FiCpu /> Generate Questions</>
                        )}
                    </button>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                    <FiAlertCircle /> {error}
                </div>
            )}

            {data && (
                <div className="space-y-5 animate-slide-up">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-heading font-semibold text-white">Interview Questions</h3>
                            <p className="text-surface-500 text-xs mt-0.5">Role: {data.role}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={copyAll} className="btn-ghost !py-2 !px-3 text-xs flex items-center gap-1.5">
                                {copied ? <><FiCheck className="text-green-400" /> Copied</> : <><FiCopy /> Copy All</>}
                            </button>
                            <button onClick={handleGenerate} disabled={loading} className="btn-ghost !py-2 !px-3 text-xs flex items-center gap-1.5 disabled:opacity-50">
                                {loading ? "..." : "↻ Regenerate"}
                            </button>
                        </div>
                    </div>

                    {renderSection("Technical Questions", "💻", data.questions.technical)}
                    {renderSection("Behavioral Questions", "🧠", data.questions.behavioral)}
                    {renderSection("Situational Questions", "🎯", data.questions.situational)}
                </div>
            )}
        </div>
    );
};

export default InterviewQuestions;
