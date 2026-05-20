const Resume = require("../models/Resume");

// ═══════════════════════════════════════════════════════════════
//  JOB DESCRIPTION MATCHING CONTROLLER
//  Uses TF-IDF inspired keyword extraction + cosine-like matching
// ═══════════════════════════════════════════════════════════════

// Common stop words to filter out
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","is","are","was","were","be","been","being",
  "have","has","had","do","does","did","will","would","could","should","shall",
  "may","might","can","must","need","to","of","in","for","on","with","at","by",
  "from","as","into","through","during","before","after","above","below","up",
  "down","out","off","over","under","again","further","then","once","here",
  "there","when","where","why","how","all","both","each","few","more","most",
  "other","some","such","no","nor","not","only","own","same","so","than","too",
  "very","just","because","about","between","while","also","this","that","these",
  "those","we","you","your","our","their","its","my","his","her","it","they",
  "them","us","me","he","she","i","what","which","who","whom","if","else",
  "work","working","job","role","position","company","team","using","used",
  "experience","years","year","ability","strong","excellent","good","etc",
  "including","required","requirements","preferred","qualifications",
  "responsibilities","looking","ideal","candidate","join","opportunity",
]);

// Extract meaningful keywords from text
function extractKeywords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s.#+\-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  // Count frequency
  const freq = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Also detect multi-word tech terms
  const normalizedText = text.toLowerCase();
  const multiWordTerms = [
    "machine learning", "deep learning", "data science", "data analysis",
    "project management", "problem solving", "react native", "vue.js",
    "node.js", "next.js", "express.js", "ruby on rails", "spring boot",
    "asp.net", "rest api", "ci/cd", "github actions", "tailwind css",
    "material ui", "web accessibility", "responsive design",
    "computer vision", "natural language processing", "neural network",
    "agile methodology", "scrum master", "full stack", "front end",
    "back end", "cloud computing", "version control", "unit testing",
    "software development", "system design", "object oriented",
    "data structures", "data visualization", "power bi",
  ];

  multiWordTerms.forEach((term) => {
    if (normalizedText.includes(term)) {
      freq[term] = (freq[term] || 0) + 2; // Boost multi-word terms
    }
  });

  return freq;
}

// Calculate match between resume and job description
function calculateMatch(resumeText, resumeSkills, jdText) {
  const jdKeywords = extractKeywords(jdText);
  const resumeKeywords = extractKeywords(resumeText);
  const resumeSkillsLower = resumeSkills.map((s) => s.toLowerCase());

  // All unique JD keywords sorted by frequency
  const jdTerms = Object.entries(jdKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50); // Top 50 terms

  let matchedKeywords = [];
  let missingKeywords = [];
  let totalWeight = 0;
  let matchedWeight = 0;

  jdTerms.forEach(([term, freq]) => {
    const weight = Math.min(freq, 3); // Cap weight at 3
    totalWeight += weight;

    // Check if term appears in resume text OR detected skills
    const inResume = resumeKeywords[term] || resumeSkillsLower.some(
      (skill) => skill.includes(term) || term.includes(skill)
    );

    if (inResume) {
      matchedWeight += weight;
      matchedKeywords.push(term);
    } else {
      missingKeywords.push(term);
    }
  });

  const matchPercentage = totalWeight > 0
    ? Math.round((matchedWeight / totalWeight) * 100)
    : 0;

  // Filter to most meaningful missing keywords
  missingKeywords = missingKeywords
    .filter((k) => k.length > 2)
    .slice(0, 15);

  // Filter matched to most relevant
  matchedKeywords = matchedKeywords
    .filter((k) => k.length > 2)
    .slice(0, 20);

  // Generate suggestions
  const suggestions = [];
  if (matchPercentage < 40) {
    suggestions.push("Your resume has low alignment with this job. Consider tailoring it specifically for this role.");
  }
  if (missingKeywords.length > 5) {
    suggestions.push(`Add these high-priority keywords: ${missingKeywords.slice(0, 5).join(", ")}`);
  }
  if (matchPercentage >= 70) {
    suggestions.push("Strong match! Fine-tune by adding any remaining missing keywords naturally.");
  }
  if (matchPercentage >= 40 && matchPercentage < 70) {
    suggestions.push("Moderate match. Focus on integrating the missing technical skills into your experience section.");
  }

  return {
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    totalJDKeywords: jdTerms.length,
    suggestions,
  };
}

// @desc    Match resume against a job description
// @route   POST /api/resume/:id/match-jd
const matchJobDescription = async (req, res) => {
  try {
    const { jdText } = req.body;

    if (!jdText || jdText.trim().length < 20) {
      return res.status(400).json({
        message: "Please provide a job description (at least 20 characters).",
      });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    const result = calculateMatch(
      resume.extractedText,
      resume.detectedSkills || [],
      jdText
    );

    res.json({
      message: "JD matching complete",
      ...result,
    });
  } catch (error) {
    console.error("JD Match Error:", error.message);
    res.status(500).json({ message: "Error matching job description." });
  }
};

module.exports = { matchJobDescription };
