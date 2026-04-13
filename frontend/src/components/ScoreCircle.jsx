const ScoreCircle = ({ score }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    // Color based on score
    const getColor = () => {
        if (score >= 75) return { stroke: "#22c55e", glow: "rgba(34,197,94,0.3)" };
        if (score >= 50) return { stroke: "#eab308", glow: "rgba(234,179,8,0.3)" };
        if (score >= 25) return { stroke: "#f97316", glow: "rgba(249,115,22,0.3)" };
        return { stroke: "#ef4444", glow: "rgba(239,68,68,0.3)" };
    };

    const { stroke, glow } = getColor();

    const getLabel = () => {
        if (score >= 75) return "Excellent";
        if (score >= 50) return "Good";
        if (score >= 25) return "Needs Work";
        return "Poor";
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-36 h-36">
                <svg className="score-circle w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="rgba(100,116,139,0.2)"
                        strokeWidth="8"
                    />
                    {/* Glow effect */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={glow}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ filter: "blur(4px)" }}
                    />
                    {/* Score arc */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={stroke}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{
                            transition: "stroke-dashoffset 1.5s ease-out",
                        }}
                    />
                </svg>
                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{score}</span>
                    <span className="text-xs text-dark-400 font-medium">/ 100</span>
                </div>
            </div>
            <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{
                    color: stroke,
                    backgroundColor: `${stroke}15`,
                    border: `1px solid ${stroke}30`,
                }}
            >
                {getLabel()}
            </span>
        </div>
    );
};

export default ScoreCircle;
