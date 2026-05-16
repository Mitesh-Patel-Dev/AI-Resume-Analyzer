const Groq = require("groq-sdk");
const Resume = require("../models/Resume");

// ═══════════════════════════════════════════════════════════════
//  AI Resume Builder Controller
//  Uses Groq (Llama 3.3 70B) to rewrite resumes with missing skills
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

    // ─── Check for API key ───
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message:
          "AI service is not configured. Please add GROQ_API_KEY to environment variables.",
      });
    }

    // ─── Build the prompt ───
    const missingSkillsList =
      resume.missingSkills?.length > 0
        ? resume.missingSkills.join(", ")
        : "None identified";

    // Truncate resume text if too long
    const resumeText = resume.extractedText.substring(0, 6000);

    // ─── Call Groq API (Llama 3.3 70B) ───
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert ATS resume writer with 15 years of experience in tech recruitment. 

TASK: Rewrite the following resume text to be highly professional, ATS-optimized, and impactful.

RULES:
1. You MUST naturally integrate the following missing skills into the experience and skills sections: [${missingSkillsList}].
2. Use strong action verbs (Developed, Architected, Spearheaded, Optimized, etc.).
3. Add quantifiable achievements where possible (percentages, numbers, metrics).
4. Maintain a clean, scannable format with clear section headers.
5. Keep the tone professional and confident.
6. Preserve the candidate's original information (name, education, contact) — do NOT fabricate details.
7. Return ONLY the formatted resume text. No explanations, no markdown code blocks, no extra commentary.`,
        },
        {
          role: "user",
          content: `Here is my resume text. Please rewrite it:\n\n${resumeText}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const aiResumeText = chatCompletion.choices[0]?.message?.content;

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

    if (error.status === 429) {
      return res.status(429).json({
        message: "AI is busy. Please wait 1 minute and try again.",
      });
    }
    if (error.status === 401) {
      return res.status(500).json({
        message: "Invalid API key. Please check your GROQ_API_KEY.",
      });
    }

    res.status(500).json({
      message: "AI generation failed: " + error.message,
    });
  }
};

module.exports = { generateOptimizedResume };
