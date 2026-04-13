const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");

// ═══════════════════════════════════════════════════════════════
//  SKILL INTELLIGENCE DATABASE
// ═══════════════════════════════════════════════════════════════

const SKILL_DATABASE = {
  "Programming Languages": [
    "JavaScript", "Python", "Java", "C++", "C#", "C", "TypeScript", "Ruby", "PHP",
    "Swift", "Kotlin", "Go", "Rust", "Scala", "R", "MATLAB", "Perl", "Dart",
    "Haskell", "Lua", "Objective-C", "Shell", "Bash",
  ],
  "Frontend Development": [
    "React", "Angular", "Vue.js", "Next.js", "HTML", "CSS", "Tailwind CSS",
    "Bootstrap", "Sass", "SCSS", "Redux", "jQuery", "Svelte", "Gatsby",
    "Material UI", "Chakra UI", "Styled Components", "Responsive Design",
    "Web Accessibility", "PWA",
  ],
  "Backend Development": [
    "Node.js", "Express", "Django", "Flask", "Spring Boot", "ASP.NET",
    "FastAPI", "Laravel", "Ruby on Rails", "NestJS", "Koa", "Hapi",
    "Microservices", "Socket.io", "gRPC",
  ],
  Databases: [
    "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Firebase",
    "DynamoDB", "Oracle", "SQL Server", "Cassandra", "SQL", "NoSQL",
    "Elasticsearch", "MariaDB", "Neo4j", "Supabase",
  ],
  "DevOps & Cloud": [
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins",
    "GitHub Actions", "Terraform", "Ansible", "Linux", "Nginx", "Apache",
    "Heroku", "Vercel", "Netlify", "DigitalOcean", "CloudFlare",
  ],
  "Tools & Technologies": [
    "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Figma", "Postman",
    "VS Code", "REST API", "GraphQL", "Webpack", "Babel", "npm", "Yarn",
    "Vite", "Swagger", "OAuth", "JWT", "WebSocket",
  ],
  "Data Science & AI": [
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas",
    "NumPy", "Scikit-learn", "NLP", "Computer Vision", "OpenCV",
    "Data Analysis", "Data Visualization", "Tableau", "Power BI",
    "Artificial Intelligence", "Neural Network",
  ],
  "Mobile Development": [
    "React Native", "Flutter", "Android", "iOS", "Xamarin", "Ionic",
    "Swift UI", "Jetpack Compose",
  ],
  "Soft Skills": [
    "Leadership", "Communication", "Teamwork", "Problem Solving",
    "Project Management", "Agile", "Scrum", "Critical Thinking",
    "Time Management", "Presentation", "Mentoring", "Collaboration",
    "Adaptability", "Creativity", "Decision Making",
  ],
};

// Flatten all skills
const ALL_SKILLS = Object.entries(SKILL_DATABASE).flatMap(([category, skills]) =>
  skills.map((skill) => ({ skill, category }))
);

// ═══════════════════════════════════════════════════════════════
//  JOB ROLE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const JOB_ROLES = {
  "Frontend Developer": {
    required: ["HTML", "CSS", "JavaScript", "React"],
    preferred: ["TypeScript", "Next.js", "Redux", "Tailwind CSS", "Sass", "Git", "Responsive Design", "Web Accessibility", "REST API", "Figma"],
  },
  "Backend Developer": {
    required: ["Node.js", "Express", "MongoDB", "SQL"],
    preferred: ["Python", "Docker", "REST API", "Git", "Redis", "PostgreSQL", "Microservices", "CI/CD", "Linux", "JWT"],
  },
  "Full Stack Developer": {
    required: ["JavaScript", "React", "Node.js", "MongoDB"],
    preferred: ["TypeScript", "Express", "SQL", "Git", "Docker", "REST API", "Next.js", "Tailwind CSS", "AWS", "CI/CD"],
  },
  "Data Scientist": {
    required: ["Python", "Machine Learning", "Pandas", "SQL"],
    preferred: ["TensorFlow", "PyTorch", "NumPy", "Scikit-learn", "Data Analysis", "Data Visualization", "R", "Deep Learning", "NLP", "Tableau"],
  },
  "DevOps Engineer": {
    required: ["Docker", "Linux", "CI/CD", "AWS"],
    preferred: ["Kubernetes", "Terraform", "Jenkins", "GitHub Actions", "Ansible", "Nginx", "Git", "Python", "Shell", "Azure"],
  },
  "Mobile App Developer": {
    required: ["React Native", "JavaScript"],
    preferred: ["Flutter", "TypeScript", "Git", "REST API", "Firebase", "Android", "iOS", "Redux", "Figma", "Dart"],
  },
  "Software Engineer": {
    required: ["JavaScript", "Python", "Git", "SQL"],
    preferred: ["Java", "C++", "Docker", "REST API", "Agile", "Data Structures", "System Design", "CI/CD", "Linux", "AWS"],
  },
  "AI/ML Engineer": {
    required: ["Python", "Machine Learning", "TensorFlow"],
    preferred: ["PyTorch", "Deep Learning", "NLP", "Computer Vision", "NumPy", "Pandas", "Docker", "AWS", "Git", "Scikit-learn"],
  },
};

// In-demand skills
const IN_DEMAND_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "TypeScript", "SQL",
  "Git", "Docker", "AWS", "REST API", "MongoDB", "CI/CD",
  "Agile", "Communication", "Problem Solving", "HTML", "CSS",
];

// ═══════════════════════════════════════════════════════════════
//  ANALYSIS ENGINE
// ═══════════════════════════════════════════════════════════════

// ─── Detect skills with categories ───
function detectSkills(text) {
  const normalizedText = text.toLowerCase();
  const found = [];
  const categoryMap = {};

  ALL_SKILLS.forEach(({ skill, category }) => {
    const pattern = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${pattern}\\b`, "i");
    if (regex.test(normalizedText)) {
      found.push(skill);
      if (!categoryMap[category]) categoryMap[category] = [];
      categoryMap[category].push(skill);
    }
  });

  const uniqueSkills = [...new Set(found)];

  const skillCategories = Object.entries(categoryMap).map(([category, skills]) => ({
    category,
    skills: [...new Set(skills)],
    count: new Set(skills).size,
  }));

  return { detectedSkills: uniqueSkills, skillCategories };
}

// ─── Score Breakdown Calculator ───
function calculateScoreBreakdown(text, detectedSkills) {
  const normalizedText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // ═══ 1. CONTENT SCORE (max 30) ═══
  let contentScore = 0;

  // Section detection
  const sectionKeywords = {
    summary: ["summary", "objective", "profile", "about me"],
    experience: ["experience", "work history", "employment", "professional experience"],
    education: ["education", "academic", "qualification", "degree"],
    skills: ["skills", "technical skills", "competencies", "technologies"],
    projects: ["projects", "portfolio", "personal projects"],
    certifications: ["certifications", "certificates", "courses"],
    achievements: ["achievements", "awards", "honors", "accomplishments"],
  };

  let sectionCount = 0;
  Object.values(sectionKeywords).forEach((keywords) => {
    if (keywords.some((kw) => normalizedText.includes(kw))) sectionCount++;
  });
  contentScore += Math.min(sectionCount * 3, 15);

  // Contact info
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /[\d\-().+\s]{10,}/.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  const hasGithub = /github/i.test(text);
  if (hasEmail) contentScore += 3;
  if (hasPhone) contentScore += 3;
  if (hasLinkedIn) contentScore += 3;
  if (hasGithub) contentScore += 2;

  // Resume length
  if (wordCount >= 250 && wordCount <= 700) {
    contentScore += 4;
  } else if (wordCount >= 150) {
    contentScore += 2;
  }

  contentScore = Math.min(contentScore, 30);

  // ═══ 2. SKILLS SCORE (max 35) ═══
  let skillsScore = 0;
  const skillCount = detectedSkills.length;

  // Detected skill count
  skillsScore += Math.min(skillCount * 2.5, 20);

  // In-demand skills coverage
  const inDemandFound = IN_DEMAND_SKILLS.filter((s) =>
    detectedSkills.map((d) => d.toLowerCase()).includes(s.toLowerCase())
  ).length;
  skillsScore += Math.min((inDemandFound / IN_DEMAND_SKILLS.length) * 15, 15);

  skillsScore = Math.min(Math.round(skillsScore), 35);

  // ═══ 3. FORMATTING SCORE (max 20) ═══
  let formattingScore = 0;

  // Bullet points / list indicators
  const bulletCount = (text.match(/[•\-–—▪▸►●○◆]/g) || []).length;
  if (bulletCount >= 5) formattingScore += 5;
  else if (bulletCount >= 2) formattingScore += 3;

  // Consistent date formats
  const datePatterns = text.match(/\b(20\d{2}|19\d{2})\b/g) || [];
  if (datePatterns.length >= 2) formattingScore += 4;

  // Proper length (not too short/long)
  if (wordCount >= 200 && wordCount <= 800) formattingScore += 4;
  else if (wordCount >= 100) formattingScore += 2;

  // No common formatting mistakes
  if (!normalizedText.includes("responsible for")) formattingScore += 2;
  if (!/\b(i am|i'm|my name is)\b/i.test(normalizedText)) formattingScore += 2;

  // Professional email
  if (hasEmail && !/\b(hotmail|yahoo)\b/i.test(text)) formattingScore += 3;

  formattingScore = Math.min(formattingScore, 20);

  // ═══ 4. IMPACT SCORE (max 15) ═══
  let impactScore = 0;

  // Action verbs
  const actionVerbs = [
    "developed", "built", "created", "designed", "implemented", "managed",
    "led", "optimized", "achieved", "delivered", "coordinated", "analyzed",
    "improved", "resolved", "collaborated", "automated", "architected",
    "deployed", "integrated", "mentored", "spearheaded", "streamlined",
    "launched", "engineered", "reduced", "increased",
  ];
  let verbCount = 0;
  actionVerbs.forEach((verb) => {
    if (normalizedText.includes(verb)) verbCount++;
  });
  impactScore += Math.min(verbCount * 1.5, 8);

  // Quantifiable achievements
  const quantified = text.match(/\d+\s*%|\$[\d,]+\.?\d*|\d+\s*(users|clients|projects|teams|members|customers|applications)/gi) || [];
  impactScore += Math.min(quantified.length * 2, 7);

  impactScore = Math.min(Math.round(impactScore), 15);

  const overall = contentScore + skillsScore + formattingScore + impactScore;

  return {
    breakdown: {
      content: contentScore,
      skills: skillsScore,
      formatting: formattingScore,
      impact: impactScore,
    },
    overall: Math.min(overall, 100),
  };
}

// ─── Job Role Matching ───
function matchJobRoles(detectedSkills) {
  const lowerSkills = detectedSkills.map((s) => s.toLowerCase());

  const matches = Object.entries(JOB_ROLES).map(([role, { required, preferred }]) => {
    const allRoleSkills = [...required, ...preferred];
    const matchedSkills = allRoleSkills.filter((s) => lowerSkills.includes(s.toLowerCase()));
    const missingRequired = required.filter((s) => !lowerSkills.includes(s.toLowerCase()));
    const missingPreferred = preferred.filter((s) => !lowerSkills.includes(s.toLowerCase()));

    // Weight required skills more heavily (60/40 split)
    const requiredMatch = required.length > 0
      ? (required.filter((s) => lowerSkills.includes(s.toLowerCase())).length / required.length) * 60
      : 30;
    const preferredMatch = preferred.length > 0
      ? (preferred.filter((s) => lowerSkills.includes(s.toLowerCase())).length / preferred.length) * 40
      : 20;

    return {
      role,
      matchPercentage: Math.round(requiredMatch + preferredMatch),
      matchedSkills,
      missingSkills: [...missingRequired, ...missingPreferred.slice(0, 3)],
    };
  });

  // Sort by match percentage descending
  matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return matches;
}

// ─── Section-wise Feedback ───
function analyzeSections(text) {
  const normalizedText = text.toLowerCase();
  const sections = [];

  // ── Summary / Objective ──
  const hasSummary = /summary|objective|profile|about\s*me/i.test(normalizedText);
  const summarySection = {
    section: "Professional Summary",
    status: "missing",
    score: 0,
    feedback: "",
    tips: [],
  };
  if (hasSummary) {
    const summaryLength = normalizedText.includes("summary")
      ? normalizedText.split("summary")[1]?.split("\n").slice(0, 5).join(" ").length || 0
      : 50;
    if (summaryLength > 100) {
      summarySection.status = "strong";
      summarySection.score = 90;
      summarySection.feedback = "Great professional summary with good detail.";
    } else if (summaryLength > 30) {
      summarySection.status = "moderate";
      summarySection.score = 60;
      summarySection.feedback = "Summary present but could be more detailed.";
      summarySection.tips = ["Add 2-3 sentences highlighting your key strengths and career goals."];
    } else {
      summarySection.status = "weak";
      summarySection.score = 30;
      summarySection.feedback = "Summary is too brief.";
      summarySection.tips = ["Write a compelling 3-4 line summary mentioning your experience, skills, and goals."];
    }
  } else {
    summarySection.feedback = "No professional summary found.";
    summarySection.tips = [
      "Add a 'Professional Summary' at the top of your resume.",
      "Include your years of experience, key skills, and career objective.",
    ];
  }
  sections.push(summarySection);

  // ── Work Experience ──
  const hasExperience = /experience|work\s*history|employment|professional\s*experience/i.test(normalizedText);
  const expSection = {
    section: "Work Experience",
    status: "missing",
    score: 0,
    feedback: "",
    tips: [],
  };
  if (hasExperience) {
    const hasActionVerbs = ["developed", "built", "managed", "led", "created", "implemented"].some(
      (v) => normalizedText.includes(v)
    );
    const hasMetrics = /\d+\s*%|\$[\d,]+|\d+\s*(users|projects|clients)/i.test(text);

    if (hasActionVerbs && hasMetrics) {
      expSection.status = "strong";
      expSection.score = 95;
      expSection.feedback = "Excellent! Your experience section uses action verbs and quantified results.";
    } else if (hasActionVerbs) {
      expSection.status = "moderate";
      expSection.score = 65;
      expSection.feedback = "Good use of action verbs, but lacking quantifiable achievements.";
      expSection.tips = ["Add metrics like 'Improved performance by 40%' or 'Managed a team of 5'."];
    } else {
      expSection.status = "weak";
      expSection.score = 35;
      expSection.feedback = "Experience section needs stronger language and measurable results.";
      expSection.tips = [
        "Start each bullet with action verbs (Developed, Built, Managed, Led).",
        "Include numbers and percentages to quantify your impact.",
      ];
    }
  } else {
    expSection.feedback = "No work experience section found.";
    expSection.tips = [
      "Add a 'Work Experience' section, even if it's internships or freelance work.",
      "Include company name, your role, dates, and 3-4 bullet points per role.",
    ];
  }
  sections.push(expSection);

  // ── Education ──
  const hasEducation = /education|academic|qualification|degree|university|college|bachelor|master/i.test(normalizedText);
  const eduSection = {
    section: "Education",
    status: "missing",
    score: 0,
    feedback: "",
    tips: [],
  };
  if (hasEducation) {
    const hasDegree = /bachelor|master|b\.?tech|b\.?sc|m\.?tech|m\.?sc|bca|mca|b\.?e|m\.?e|phd|diploma/i.test(normalizedText);
    const hasInstitution = /university|college|institute|school/i.test(normalizedText);
    if (hasDegree && hasInstitution) {
      eduSection.status = "strong";
      eduSection.score = 90;
      eduSection.feedback = "Education section is well-structured with degree and institution.";
    } else if (hasDegree || hasInstitution) {
      eduSection.status = "moderate";
      eduSection.score = 60;
      eduSection.feedback = "Education section present but missing some details.";
      eduSection.tips = ["Include your degree name, institution, graduation year, and GPA (if above 3.0)."];
    } else {
      eduSection.status = "weak";
      eduSection.score = 35;
      eduSection.feedback = "Education section exists but lacks structure.";
      eduSection.tips = ["Clearly mention your degree, university name, and dates."];
    }
  } else {
    eduSection.feedback = "No education section found.";
    eduSection.tips = [
      "Add an 'Education' section with your degree, institution, and graduation year.",
    ];
  }
  sections.push(eduSection);

  // ── Skills ──
  const hasSkills = /skills|technical\s*skills|competencies|technologies|tech\s*stack/i.test(normalizedText);
  const skillSection = {
    section: "Technical Skills",
    status: "missing",
    score: 0,
    feedback: "",
    tips: [],
  };
  if (hasSkills) {
    // Count how many known skills appear
    const skillMatches = ALL_SKILLS.filter(({ skill }) => {
      const pattern = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${pattern}\\b`, "i").test(normalizedText);
    }).length;

    if (skillMatches >= 10) {
      skillSection.status = "strong";
      skillSection.score = 95;
      skillSection.feedback = `Excellent! ${skillMatches} relevant skills detected.`;
    } else if (skillMatches >= 5) {
      skillSection.status = "moderate";
      skillSection.score = 60;
      skillSection.feedback = `${skillMatches} skills detected. Consider adding more.`;
      skillSection.tips = ["Add more relevant technical skills to improve ATS matching."];
    } else {
      skillSection.status = "weak";
      skillSection.score = 30;
      skillSection.feedback = "Very few recognizable skills found.";
      skillSection.tips = [
        "List your skills in a dedicated section organized by category.",
        "Include programming languages, frameworks, databases, and tools.",
      ];
    }
  } else {
    skillSection.feedback = "No dedicated skills section found.";
    skillSection.tips = [
      "Add a 'Technical Skills' section listing your abilities.",
      "Organize by: Languages, Frameworks, Databases, Tools.",
    ];
  }
  sections.push(skillSection);

  // ── Projects ──
  const hasProjects = /projects|portfolio|personal\s*projects|side\s*projects/i.test(normalizedText);
  const projSection = {
    section: "Projects",
    status: "missing",
    score: 0,
    feedback: "",
    tips: [],
  };
  if (hasProjects) {
    const hasGithubLink = /github\.com/i.test(text);
    const hasProjectDesc = normalizedText.split("project").length > 2;
    if (hasGithubLink && hasProjectDesc) {
      projSection.status = "strong";
      projSection.score = 90;
      projSection.feedback = "Great projects section with links and descriptions.";
    } else if (hasProjectDesc) {
      projSection.status = "moderate";
      projSection.score = 60;
      projSection.feedback = "Projects listed but could use more detail or links.";
      projSection.tips = ["Add GitHub/live links and mention the tech stack used."];
    } else {
      projSection.status = "weak";
      projSection.score = 30;
      projSection.feedback = "Projects section exists but lacks detail.";
      projSection.tips = [
        "Describe each project with: title, tech stack, your role, and key features.",
        "Add GitHub repository links or live demo URLs.",
      ];
    }
  } else {
    projSection.feedback = "No projects section found.";
    projSection.tips = [
      "Add a 'Projects' section — this is crucial for freshers and students.",
      "Include 2-3 projects with description, tech stack, and links.",
    ];
  }
  sections.push(projSection);

  // ── Contact Info ──
  const contactSection = {
    section: "Contact Information",
    status: "missing",
    score: 0,
    feedback: "",
    tips: [],
  };
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /[\d\-().+\s]{10,}/.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  let contactScore = 0;
  if (hasEmail) contactScore += 35;
  if (hasPhone) contactScore += 30;
  if (hasLinkedIn) contactScore += 35;

  if (contactScore >= 80) {
    contactSection.status = "strong";
    contactSection.score = contactScore;
    contactSection.feedback = "Contact information is complete.";
  } else if (contactScore >= 50) {
    contactSection.status = "moderate";
    contactSection.score = contactScore;
    contactSection.feedback = "Some contact details are missing.";
    if (!hasLinkedIn) contactSection.tips.push("Add your LinkedIn profile URL.");
    if (!hasPhone) contactSection.tips.push("Include a phone number.");
  } else {
    contactSection.status = "weak";
    contactSection.score = contactScore;
    contactSection.feedback = "Contact information is incomplete.";
    if (!hasEmail) contactSection.tips.push("Add your email address.");
    if (!hasPhone) contactSection.tips.push("Add your phone number.");
    if (!hasLinkedIn) contactSection.tips.push("Add your LinkedIn profile URL.");
  }
  sections.push(contactSection);

  return sections;
}

// ─── Smart Suggestions Generator ───
function generateSmartSuggestions(text, detectedSkills, scoreBreakdown, sectionFeedback, jobRoleMatches) {
  const suggestions = [];
  const normalizedText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Score-based suggestions
  if (scoreBreakdown.content < 15) {
    suggestions.push("📝 Content: Your resume content needs improvement. Add more structured sections with clear headings.");
  }
  if (scoreBreakdown.skills < 18) {
    suggestions.push("💡 Skills: Add more relevant technical skills. Focus on in-demand technologies like React, Node.js, Python, Docker.");
  }
  if (scoreBreakdown.formatting < 10) {
    suggestions.push("🎨 Formatting: Use bullet points to list achievements, maintain consistent date formats, and avoid first-person pronouns.");
  }
  if (scoreBreakdown.impact < 8) {
    suggestions.push("📊 Impact: Add quantifiable achievements — numbers, percentages, and metrics make your resume 40% more effective.");
  }

  // Section-based suggestions
  sectionFeedback.forEach((sf) => {
    if (sf.status === "missing") {
      suggestions.push(`⚠️ Missing Section: Add a '${sf.section}' section to your resume.`);
    } else if (sf.status === "weak") {
      suggestions.push(`🔧 Weak Section: Strengthen your '${sf.section}' — ${sf.feedback}`);
    }
  });

  // Job role suggestions
  if (jobRoleMatches.length > 0) {
    const bestRole = jobRoleMatches[0];
    if (bestRole.matchPercentage < 50) {
      suggestions.push(
        `🎯 Role Fit: For '${bestRole.role}', consider adding: ${bestRole.missingSkills.slice(0, 3).join(", ")}.`
      );
    }
  }

  // Missing in-demand skills
  const missingInDemand = IN_DEMAND_SKILLS.filter(
    (skill) => !detectedSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );
  if (missingInDemand.length > 3) {
    suggestions.push(
      `🌟 In-Demand Skills: Consider adding: ${missingInDemand.slice(0, 4).join(", ")} — these are highly sought by employers.`
    );
  }

  // Content-specific tips
  if (wordCount < 200) {
    suggestions.push("📏 Length: Your resume is too short. Aim for 300-600 words for a strong one-page resume.");
  } else if (wordCount > 1000) {
    suggestions.push("📏 Length: Your resume may be too long. Try to keep it to 1-2 pages maximum.");
  }

  // Additional smart tips
  if (!/linkedin/i.test(text)) {
    suggestions.push("🔗 LinkedIn: Add your LinkedIn profile URL — 90% of recruiters check candidates' LinkedIn.");
  }
  if (!/github/i.test(text) && detectedSkills.some((s) => ["JavaScript", "Python", "React", "Node.js"].includes(s))) {
    suggestions.push("💻 GitHub: Add your GitHub profile to showcase your code and open-source contributions.");
  }
  if (!/(project|portfolio)/i.test(text)) {
    suggestions.push("🚀 Projects: Add 2-3 personal projects with tech stack and links — especially important for freshers.");
  }
  if (normalizedText.includes("responsible for")) {
    suggestions.push("✏️ Language: Replace 'Responsible for' with action verbs like 'Led', 'Managed', 'Developed'.");
  }

  return suggestions;
}

// ═══════════════════════════════════════════════════════════════
//  CONTROLLERS
// ═══════════════════════════════════════════════════════════════

// @desc    Upload, parse, and analyze a resume PDF
// @route   POST /api/resume/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    // Read PDF and extract text
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;
    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
    const pageEstimate = Math.max(1, Math.ceil(wordCount / 500));

    // ─── Run analysis pipeline ───
    const { detectedSkills, skillCategories } = detectSkills(extractedText);
    const { breakdown, overall } = calculateScoreBreakdown(extractedText, detectedSkills);
    const jobRoleMatches = matchJobRoles(detectedSkills);
    const sectionFeedback = analyzeSections(extractedText);
    const missingSkills = IN_DEMAND_SKILLS.filter(
      (skill) => !detectedSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
    );
    const suggestions = generateSmartSuggestions(
      extractedText, detectedSkills, breakdown, sectionFeedback, jobRoleMatches
    );

    // Save to database
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      extractedText,
      atsScore: overall,
      scoreBreakdown: breakdown,
      detectedSkills,
      missingSkills,
      skillCategories,
      jobRoleMatches: jobRoleMatches.slice(0, 5), // Top 5 matches
      bestFitRole: jobRoleMatches[0]?.role || "General",
      sectionFeedback,
      suggestions,
      wordCount,
      pageEstimate,
      analysisComplete: true,
    });

    res.status(201).json({
      message: "Resume uploaded and analyzed successfully!",
      resume: {
        _id: resume._id,
        fileName: resume.fileName,
        atsScore: resume.atsScore,
        scoreBreakdown: resume.scoreBreakdown,
        detectedSkills: resume.detectedSkills,
        missingSkills: resume.missingSkills,
        skillCategories: resume.skillCategories,
        jobRoleMatches: resume.jobRoleMatches,
        bestFitRole: resume.bestFitRole,
        sectionFeedback: resume.sectionFeedback,
        suggestions: resume.suggestions,
        wordCount: resume.wordCount,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Error processing resume" });
  }
};

// @desc    Get all resumes for logged-in user
// @route   GET /api/resume/my-resumes
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select("-extractedText")
      .sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error("Get resumes error:", error.message);
    res.status(500).json({ message: "Error fetching resumes" });
  }
};

// @desc    Get a single resume with full analysis
// @route   GET /api/resume/:id
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    console.error("Get resume error:", error.message);
    res.status(500).json({ message: "Error fetching resume" });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resume/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }
    await Resume.deleteOne({ _id: resume._id });
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error.message);
    res.status(500).json({ message: "Error deleting resume" });
  }
};

module.exports = { uploadResume, getMyResumes, getResumeById, deleteResume };
