const { GoogleGenerativeAI } = require("@google/generative-ai");
const Resume = require("../models/Resume");

// ═══════════════════════════════════════════════════════════════
//  AI Resume Builder Controller
//  Uses Google Gemini to rewrite resumes with missing skills
// ═══════════════════════════════════════════════════════════════

// Helper: retry with exponential backoff
async function callGeminiWithRetry(model, prompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error(`Gemini attempt ${attempt}/${maxRetries} failed:`, error.message);
      if (attempt === maxRetries) throw error;
      // Wait longer between each retry: 2s, 5s, 10s
      const waitMs = attempt * 3000;
      console.log(`Waiting ${waitMs}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}

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

    // Truncate resume text if too long (Gemini has token limits)
    const resumeText = resume.extractedText.substring(0, 8000);

    const prompt = `You are an expert ATS resume writer with 15 years of experience in tech recruitment. 

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
${resumeText}`;

    // ─── Call Google Gemini API with retry ───
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const aiResumeText = await callGeminiWithRetry(model, prompt);

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
    console.error("AI Generation Error:", error.message, error.status);

    const errMsg = error.message || "";

    if (error.status === 429 || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({
        message: "AI is busy. Please wait 1-2 minutes and try again.",
      });
    }
    if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("API key not valid")) {
      return res.status(500).json({
        message: "Invalid Gemini API key. Please check your GEMINI_API_KEY.",
      });
    }
    if (errMsg.includes("SAFETY")) {
      return res.status(400).json({
        message: "Content was flagged by safety filters. Please review your resume.",
      });
    }

    res.status(500).json({
      message: "AI generation failed: " + error.message,
    });
  }
};

module.exports = { generateOptimizedResume };
