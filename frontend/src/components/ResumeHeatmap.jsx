const ResumeHeatmap = ({ sectionFeedback }) => {
    if (!sectionFeedback || sectionFeedback.length === 0) return null;

    const getStatusConfig = (status, score) => {
        if (status === "strong" || score >= 70) return {
            border: "border-green-500/40", bg: "bg-green-500/8", dot: "bg-green-400",
            text: "text-green-400", label: "Strong", glow: "shadow-green-500/10",
        };
        if (status === "moderate" || score >= 40) return {
            border: "border-amber-500/40", bg: "bg-amber-500/8", dot: "bg-amber-400",
            text: "text-amber-400", label: "Moderate", glow: "shadow-amber-500/10",
        };
        if (status === "weak") return {
            border: "border-orange-500/40", bg: "bg-orange-500/8", dot: "bg-orange-400",
            text: "text-orange-400", label: "Weak", glow: "shadow-orange-500/10",
        };
        return {
            border: "border-red-500/40", bg: "bg-red-500/8", dot: "bg-red-400",
            text: "text-red-400", label: "Missing", glow: "shadow-red-500/10",
        };
    };

    // Calculate overall heatmap score
    const avgScore = Math.round(
        sectionFeedback.reduce((s, f) => s + f.score, 0) / sectionFeedback.length
    );

    return (
        <div className="space-y-5">
            {/* Overall bar */}
            <div className="card-elevated p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-semibold text-white">Resume Health Score</h3>
                    <span className="text-2xl font-heading font-bold text-white">{avgScore}<span className="text-surface-500 text-sm">/100</span></span>
                </div>
                <div className="h-3 bg-surface-800 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                            width: `${avgScore}%`,
                            background: avgScore >= 70 ? "linear-gradient(90deg, #059669, #34d399)" :
                                avgScore >= 40 ? "linear-gradient(90deg, #d97706, #fbbf24)" :
                                "linear-gradient(90deg, #dc2626, #f87171)",
                        }}
                    />
                </div>
            </div>

            {/* Section Cards */}
            <div className="grid sm:grid-cols-2 gap-3">
                {sectionFeedback.map((section, i) => {
                    const config = getStatusConfig(section.status, section.score);
                    return (
                        <div
                            key={i}
                            className={`p-4 rounded-xl border ${config.border} ${config.bg} shadow-lg ${config.glow} transition-all hover:scale-[1.02]`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                                    <h4 className="font-heading font-semibold text-white text-sm">{section.section}</h4>
                                </div>
                                <span className={`text-xs font-semibold ${config.text}`}>{section.score}/100</span>
                            </div>

                            {/* Mini progress bar */}
                            <div className="h-1.5 bg-surface-900/50 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full rounded-full ${config.dot}`}
                                    style={{ width: `${section.score}%`, transition: "width 1s ease-out" }}
                                />
                            </div>

                            <p className="text-xs text-surface-400 leading-relaxed">{section.feedback}</p>

                            {section.tips?.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {section.tips.slice(0, 2).map((tip, j) => (
                                        <p key={j} className="text-xs text-surface-500 flex items-start gap-1">
                                            <span className="text-brand-400">→</span> {tip}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-surface-500">
                {[
                    { color: "bg-green-400", label: "Strong (70+)" },
                    { color: "bg-amber-400", label: "Moderate (40-69)" },
                    { color: "bg-orange-400", label: "Weak (1-39)" },
                    { color: "bg-red-400", label: "Missing (0)" },
                ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${l.color}`} />
                        <span>{l.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResumeHeatmap;
