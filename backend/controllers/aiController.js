const { GoogleGenerativeAI } = require("@google/generative-ai");
const Resume = require("../models/Resume");

// ═══════════════════════════════════════════════════════════════
//  AI Resume Builder Controller
//  Uses Google Gemini to rewrite resumes with missing skills
// ═══════════════════════════════════════════════════════════════

// @desc    Generate an AI-optimized resume
// @route   POST /api/resume/generate-optimized
const generateOptimizedResume = async (req, res) => {
  try {
    const { resumeId } = req.body;

    // ─── Validate input ───
    if (!resumeId) {
      return res.status(400).json({ message: "Resume ID is required." });
    }

    // ─── Fetch the resume from DB ───
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    if (!resume.extractedText || resume.extractedText.trim().length < 50) {
      return res
        .status(400)
        .json({ message: "Resume text is too short to optimize." });
    }

    // ─── Check for Gemini API key ───
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message:
          "AI service is not configured. Please add GEMINI_API_KEY to environment variables.",
      });
    }

    // ─── Build the prompt ───
    const missingSkillsList =
      resume.missingSkills?.length > 0
        ? resume.missingSkills.join(", ")
        : "None identified";

    const systemPrompt = `You are an expert ATS resume writer with 15 years of experience in tech recruitment. 

TASK: Rewrite the following resume text to be highly professional, ATS-optimized, and impactful.

RULES:
1. You MUST naturally integrate the following missing skills into the experience and skills sections: [${missingSkillsList}].
2. Use strong action verbs (Developed, Architected, Spearheaded, Optimized, etc.).
3. Add quantifiable achievements where possible (percentages, numbers, metrics).
4. Maintain a clean, scannable format with clear section headers.
5. Keep the tone professional and confident.
6. Preserve the candidate's original information (name, education, contact) — do NOT fabricate details.
7. Return ONLY the formatted resume text. No explanations, no markdown code blocks, no extra commentary.

ORIGINAL RESUME TEXT:
${resume.extractedText}`;

    // ─── Call Google Gemini API ───
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const aiResumeText = response.text();

    if (!aiResumeText || aiResumeText.trim().length === 0) {
      return res.status(500).json({
        message: "AI returned an empty response. Please try again.",
      });
    }

    // ─── Save to database ───
    resume.aiGeneratedResume = aiResumeText.trim();
    await resume.save();

    // ─── Return updated resume ───
    res.json({
      message: "Resume optimized successfully!",
      aiGeneratedResume: resume.aiGeneratedResume,
      resumeId: resume._id,
    });
  } catch (error) {
    console.error("AI Generation Error:", error.message);

    // Handle specific Gemini API errors
    if (error.message?.includes("API_KEY")) {
      return res.status(500).json({
        message: "Invalid Gemini API key. Please check your configuration.",
      });
    }
    if (error.message?.includes("RATE_LIMIT") || error.message?.includes("429")) {
      return res.status(429).json({
        message: "AI rate limit reached. Please try again in a few seconds.",
      });
    }
    if (error.message?.includes("SAFETY")) {
      return res.status(400).json({
        message: "Content was flagged by safety filters. Please review your resume content.",
      });
    }

    res.status(500).json({
      message: "Failed to generate optimized resume: " + error.message,
    });
  }
};

module.exports = { generateOptimizedResume };
