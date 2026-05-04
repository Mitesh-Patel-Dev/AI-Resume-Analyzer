const mongoose = require("mongoose");

// ─────────────────────────────────────────────
// Score Breakdown Sub-Schema
// ─────────────────────────────────────────────
const scoreBreakdownSchema = new mongoose.Schema(
  {
    content: { type: Number, default: 0 },       // Max 30
    skills: { type: Number, default: 0 },        // Max 35
    formatting: { type: Number, default: 0 },    // Max 20
    impact: { type: Number, default: 0 },        // Max 15
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// Job Role Match Sub-Schema
// ─────────────────────────────────────────────
const jobRoleMatchSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    matchPercentage: { type: Number, default: 0 },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// Section Feedback Sub-Schema
// ─────────────────────────────────────────────
const sectionFeedbackSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    status: { type: String, enum: ["strong", "moderate", "weak", "missing"], default: "missing" },
    score: { type: Number, default: 0 },          // 0-100 per section
    feedback: { type: String, default: "" },
    tips: { type: [String], default: [] },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// Skill Category Sub-Schema
// ─────────────────────────────────────────────
const skillCategorySchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    skills: { type: [String], default: [] },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// Main Resume Schema
// ─────────────────────────────────────────────
const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      default: "",
    },

    // ─── Overall Score ───
    atsScore: {
      type: Number,
      default: 0,
    },

    // ─── Score Breakdown (NEW) ───
    scoreBreakdown: {
      type: scoreBreakdownSchema,
      default: () => ({}),
    },

    // ─── Skills ───
    detectedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },

    // ─── Categorized Skills (NEW) ───
    skillCategories: {
      type: [skillCategorySchema],
      default: [],
    },

    // ─── Job Role Matching (NEW) ───
    jobRoleMatches: {
      type: [jobRoleMatchSchema],
      default: [],
    },
    bestFitRole: {
      type: String,
      default: "",
    },

    // ─── Section-wise Feedback (NEW) ───
    sectionFeedback: {
      type: [sectionFeedbackSchema],
      default: [],
    },

    // ─── Suggestions ───
    suggestions: {
      type: [String],
      default: [],
    },

    // ─── Resume Metadata (NEW) ───
    wordCount: {
      type: Number,
      default: 0,
    },
    pageEstimate: {
      type: Number,
      default: 1,
    },

    // ─── AI-Generated Resume (Auto-Fix) ───
    aiGeneratedResume: {
      type: String,
      default: "",
    },

    analysisComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
