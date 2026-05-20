const Groq = require("groq-sdk");
const Resume = require("../models/Resume");

// ═══════════════════════════════════════════════════════════════
//  AI CONTROLLER — Groq (Llama 3.3 70B)
//  1. Resume Rewriter
//  2. Interview Question Generator
// ═══════════════════════════════════════════════════════════════

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw { status: 500, message: "AI service not configured. Add GROQ_API_KEY to environment." };
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// @desc    Generate an AI-optimized resume
// @route   POST /api/resume/generate-optimized
const generateOptimizedResume = async (req, res) => {
  try {
    const { resumeId } = req.body;
    if (!resumeId) return res.status(400).json({ message: "Resume ID is required." });

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found." });
    if (!resume.extractedText || resume.extractedText.trim().length < 50) {
      return res.status(400).json({ message: "Resume text is too short to optimize." });
    }

    const groq = getGroqClient();
    const missingSkillsList = resume.missingSkills?.length > 0
      ? resume.missingSkills.join(", ") : "None identified";
    const resumeText = resume.extractedText.substring(0, 6000);

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
        { role: "user", content: `Here is my resume text. Please rewrite it:\n\n${resumeText}` },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const aiResumeText = chatCompletion.choices[0]?.message?.content;
    if (!aiResumeText || aiResumeText.trim().length === 0) {
      return res.status(500).json({ message: "AI returned an empty response. Please try again." });
    }

    resume.aiGeneratedResume = aiResumeText.trim();
    await resume.save();

    res.json({
      message: "Resume optimized successfully!",
      aiGeneratedResume: resume.aiGeneratedResume,
      resumeId: resume._id,
    });
  } catch (error) {
    console.error("AI Generation Error:", error.message, error.status);
    if (error.status === 429) return res.status(429).json({ message: "AI is busy. Please wait 1 minute and try again." });
    if (error.status === 401) return res.status(500).json({ message: "Invalid API key. Please check your GROQ_API_KEY." });
    res.status(500).json({ message: "AI generation failed: " + error.message });
  }
};

// @desc    Generate interview questions based on resume skills
// @route   POST /api/resume/:id/interview-questions
const generateInterviewQuestions = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found." });

    const groq = getGroqClient();
    const skills = (resume.detectedSkills || []).slice(0, 15).join(", ");
    const role = resume.bestFitRole || "Software Developer";

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a senior tech interviewer. Generate interview questions for a candidate.

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code blocks, just raw JSON):
{
  "technical": [
    {"question": "...", "difficulty": "Easy|Medium|Hard", "topic": "..."}
  ],
  "behavioral": [
    {"question": "...", "difficulty": "Easy|Medium|Hard", "topic": "..."}
  ],
  "situational": [
    {"question": "...", "difficulty": "Easy|Medium|Hard", "topic": "..."}
  ]
}

Generate exactly 5 technical, 3 behavioral, and 2 situational questions.
Base technical questions on the candidate's actual skills.
Make behavioral questions relevant to a ${role} role.
Vary difficulty levels across Easy, Medium, and Hard.`,
        },
        {
          role: "user",
          content: `Candidate's skills: ${skills}\nBest fit role: ${role}\n\nGenerate interview questions.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 2048,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";
    
    // Parse JSON from response (handle potential markdown wrapping)
    let questions;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      questions = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr.message);
      questions = null;
    }

    if (!questions) {
      return res.status(500).json({ message: "Failed to parse AI response. Please try again." });
    }

    res.json({
      message: "Interview questions generated!",
      questions,
      role,
      skills: resume.detectedSkills?.slice(0, 15) || [],
    });
  } catch (error) {
    console.error("Interview Questions Error:", error.message);
    if (error.status === 429) return res.status(429).json({ message: "AI is busy. Please wait 1 minute and try again." });
    res.status(500).json({ message: "Failed to generate questions: " + error.message });
  }
};

module.exports = { generateOptimizedResume, generateInterviewQuestions };
