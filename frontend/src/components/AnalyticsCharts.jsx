import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell } from "recharts";

const COLORS = ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#f97316"];

const AnalyticsCharts = ({ resume }) => {
    if (!resume) return null;

    // ─── Radar: Skill Category Coverage ───
    const radarData = (resume.skillCategories || []).map((cat) => ({
        category: cat.category.replace(/\s*&\s*/g, " & ").split(" ").slice(0, 2).join(" "),
        skills: cat.count,
        fullMark: 10,
    }));

    // ─── Bar: Score Breakdown ───
    const scoreData = resume.scoreBreakdown ? [
        { name: "Content", score: resume.scoreBreakdown.content, max: 30, fill: "#3b82f6" },
        { name: "Skills", score: resume.scoreBreakdown.skills, max: 35, fill: "#10b981" },
        { name: "Format", score: resume.scoreBreakdown.formatting, max: 20, fill: "#8b5cf6" },
        { name: "Impact", score: resume.scoreBreakdown.impact, max: 15, fill: "#f59e0b" },
    ] : [];

    // ─── Pie: Skill Distribution ───
    const pieData = (resume.skillCategories || [])
        .filter((c) => c.count > 0)
        .map((cat) => ({
            name: cat.category.split(" ")[0],
            value: cat.count,
        }));

    // ─── Bar: Job Role Match ───
    const roleData = (resume.jobRoleMatches || []).slice(0, 5).map((r) => ({
        role: r.role.split(" ").slice(0, 2).join(" "),
        match: r.matchPercentage,
        fill: r.matchPercentage >= 60 ? "#10b981" : r.matchPercentage >= 40 ? "#f59e0b" : "#ef4444",
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            return (
                <div className="bg-surface-900 border border-surface-700 rounded-lg px-3 py-2 text-xs">
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-surface-400">{payload[0].name}: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid sm:grid-cols-2 gap-5">
            {/* Radar Chart: Skill Coverage */}
            {radarData.length >= 3 && (
                <div className="card p-5 sm:col-span-2">
                    <h4 className="font-heading font-semibold text-white mb-4">📊 Skill Coverage Radar</h4>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#1e293b" />
                            <PolarAngleAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, "auto"]} tick={{ fill: "#475569", fontSize: 10 }} />
                            <Radar name="Skills" dataKey="skills" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Bar Chart: Score Breakdown */}
            {scoreData.length > 0 && (
                <div className="card p-5">
                    <h4 className="font-heading font-semibold text-white mb-4">📈 Score Breakdown</h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={scoreData} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} />
                            <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                                {scoreData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Pie Chart: Skill Distribution */}
            {pieData.length > 0 && (
                <div className="card p-5">
                    <h4 className="font-heading font-semibold text-white mb-4">🎯 Skill Distribution</h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
                        {pieData.map((d, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-surface-400">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                {d.name} ({d.value})
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Role Match Bar */}
            {roleData.length > 0 && (
                <div className="card p-5 sm:col-span-2">
                    <h4 className="font-heading font-semibold text-white mb-4">💼 Job Role Match</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={roleData} layout="vertical" barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} />
                            <YAxis type="category" dataKey="role" width={100} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="match" radius={[0, 6, 6, 0]}>
                                {roleData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default AnalyticsCharts;
