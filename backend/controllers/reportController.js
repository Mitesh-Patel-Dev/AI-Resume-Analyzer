const Resume = require("../models/Resume");

// ═══════════════════════════════════════════════════════════════
//  PDF Report Generator
//  Generates a downloadable HTML-based report (rendered as PDF by browser)
// ═══════════════════════════════════════════════════════════════

// @desc    Generate a downloadable analysis report
// @route   GET /api/resume/:id/report
const generateReport = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const scoreColor = resume.atsScore >= 75 ? "#22c55e" : resume.atsScore >= 50 ? "#eab308" : resume.atsScore >= 25 ? "#f97316" : "#ef4444";
    const scoreLabel = resume.atsScore >= 75 ? "Excellent" : resume.atsScore >= 50 ? "Good" : resume.atsScore >= 25 ? "Needs Work" : "Poor";

    const getStatusColor = (status) => {
      switch (status) {
        case "strong": return "#22c55e";
        case "moderate": return "#eab308";
        case "weak": return "#f97316";
        default: return "#ef4444";
      }
    };

    const getStatusBg = (status) => {
      switch (status) {
        case "strong": return "#f0fdf4";
        case "moderate": return "#fefce8";
        case "weak": return "#fff7ed";
        default: return "#fef2f2";
      }
    };

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Resume Analysis Report - ${resume.fileName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #fff;
      color: #1e293b;
      line-height: 1.6;
      padding: 40px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo { font-size: 24px; font-weight: 800; color: #4f46e5; }
    .date { color: #64748b; font-size: 13px; }

    .score-card {
      background: linear-gradient(135deg, #eef2ff, #faf5ff);
      border: 2px solid #e0e7ff;
      border-radius: 16px;
      padding: 30px;
      text-align: center;
      margin-bottom: 30px;
    }
    .score-number {
      font-size: 64px;
      font-weight: 800;
      color: ${scoreColor};
      line-height: 1;
    }
    .score-label {
      font-size: 14px;
      color: #64748b;
      margin-top: 5px;
    }
    .score-badge {
      display: inline-block;
      padding: 4px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      color: ${scoreColor};
      background: ${scoreColor}15;
      border: 1px solid ${scoreColor}30;
      margin-top: 10px;
    }

    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 30px;
    }
    .breakdown-item {
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      text-align: center;
    }
    .breakdown-value {
      font-size: 28px;
      font-weight: 700;
    }
    .breakdown-label { font-size: 12px; color: #64748b; margin-top: 4px; }
    .breakdown-max { font-size: 11px; color: #94a3b8; }

    h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #f1f5f9;
      color: #0f172a;
    }

    .section { margin-bottom: 30px; }

    .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag {
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 8px;
    }
    .skill-found { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .skill-missing { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }

    .role-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .role-table th {
      background: #f8fafc;
      padding: 10px 14px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e2e8f0;
    }
    .role-table td {
      padding: 10px 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .match-bar {
      height: 8px;
      border-radius: 4px;
      background: #e2e8f0;
    }
    .match-fill {
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(90deg, #4f46e5, #a855f7);
    }

    .feedback-item {
      padding: 14px;
      border-radius: 10px;
      margin-bottom: 10px;
      border-left: 4px solid;
    }
    .feedback-name { font-weight: 600; font-size: 14px; }
    .feedback-text { font-size: 13px; color: #475569; margin-top: 4px; }
    .feedback-tips { margin-top: 6px; padding-left: 16px; font-size: 12px; color: #64748b; }
    .feedback-tips li { margin-bottom: 3px; }

    .suggestion-item {
      padding: 12px 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      margin-bottom: 8px;
      font-size: 13px;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #f1f5f9;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
    }

    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div>
      <div class="logo">🤖 AI Resume Analyzer</div>
      <div style="font-size:13px;color:#64748b;margin-top:4px;">Professional Resume Analysis Report</div>
    </div>
    <div style="text-align:right;">
      <div class="date">Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
      <div style="font-size:13px;color:#334155;font-weight:500;margin-top:4px;">${resume.fileName}</div>
    </div>
  </div>

  <!-- Overall Score -->
  <div class="score-card">
    <div class="score-number">${resume.atsScore}</div>
    <div class="score-label">Overall ATS Score (out of 100)</div>
    <div class="score-badge">${scoreLabel}</div>
  </div>

  <!-- Score Breakdown -->
  <div class="section">
    <h2>📊 Score Breakdown</h2>
    <div class="breakdown-grid">
      <div class="breakdown-item">
        <div class="breakdown-value" style="color:#3b82f6">${resume.scoreBreakdown?.content || 0}</div>
        <div class="breakdown-label">Content</div>
        <div class="breakdown-max">/ 30</div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-value" style="color:#22c55e">${resume.scoreBreakdown?.skills || 0}</div>
        <div class="breakdown-label">Skills</div>
        <div class="breakdown-max">/ 35</div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-value" style="color:#a855f7">${resume.scoreBreakdown?.formatting || 0}</div>
        <div class="breakdown-label">Formatting</div>
        <div class="breakdown-max">/ 20</div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-value" style="color:#f59e0b">${resume.scoreBreakdown?.impact || 0}</div>
        <div class="breakdown-label">Impact</div>
        <div class="breakdown-max">/ 15</div>
      </div>
    </div>
  </div>

  <!-- Detected Skills -->
  <div class="section">
    <h2>✅ Detected Skills (${resume.detectedSkills?.length || 0})</h2>
    <div class="skills-grid">
      ${(resume.detectedSkills || []).map((s) => `<span class="skill-tag skill-found">${s}</span>`).join("")}
    </div>
  </div>

  <!-- Missing Skills -->
  <div class="section">
    <h2>⚠️ Missing In-Demand Skills (${resume.missingSkills?.length || 0})</h2>
    <div class="skills-grid">
      ${(resume.missingSkills || []).map((s) => `<span class="skill-tag skill-missing">${s}</span>`).join("")}
    </div>
  </div>

  <!-- Job Role Matching -->
  <div class="section">
    <h2>🎯 Job Role Matching</h2>
    <table class="role-table">
      <thead>
        <tr><th>Role</th><th>Match</th><th style="width:30%">Score</th></tr>
      </thead>
      <tbody>
        ${(resume.jobRoleMatches || []).map((jm) => `
          <tr>
            <td style="font-weight:500">${jm.role}</td>
            <td>${jm.matchPercentage}%</td>
            <td>
              <div class="match-bar">
                <div class="match-fill" style="width:${jm.matchPercentage}%"></div>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  <!-- Section Feedback -->
  <div class="section">
    <h2>📝 Section-wise Feedback</h2>
    ${(resume.sectionFeedback || []).map((sf) => `
      <div class="feedback-item" style="border-color:${getStatusColor(sf.status)};background:${getStatusBg(sf.status)}">
        <div class="feedback-name">${sf.section} — <span style="color:${getStatusColor(sf.status)};text-transform:capitalize">${sf.status}</span> (${sf.score}/100)</div>
        <div class="feedback-text">${sf.feedback}</div>
        ${sf.tips?.length > 0 ? `<ul class="feedback-tips">${sf.tips.map((t) => `<li>${t}</li>`).join("")}</ul>` : ""}
      </div>
    `).join("")}
  </div>

  <!-- Suggestions -->
  <div class="section">
    <h2>💡 Improvement Suggestions</h2>
    ${(resume.suggestions || []).map((s) => `<div class="suggestion-item">${s}</div>`).join("")}
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Generated by AI Resume Analyzer — ${new Date().getFullYear()}</p>
    <p style="margin-top:4px;">This report is for educational and self-improvement purposes.</p>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", `inline; filename="Resume-Report-${resume._id}.html"`);
    res.send(html);
  } catch (error) {
    console.error("Report generation error:", error.message);
    res.status(500).json({ message: "Error generating report" });
  }
};

module.exports = { generateReport };
