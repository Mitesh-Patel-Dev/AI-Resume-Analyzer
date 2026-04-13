const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "AI Resume Analyzer API is running 🚀" });
});

// ─── Serve Frontend in Production ───
const frontendBuildPath = path.join(__dirname, "..", "frontend", "dist");

if (require("fs").existsSync(frontendBuildPath)) {
    // Serve static files from the React build
    app.use(express.static(frontendBuildPath));

    // Handle React routing — send all non-API requests to index.html
    app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
            res.sendFile(path.join(frontendBuildPath, "index.html"));
        }
    });
    console.log("📦 Serving frontend from:", frontendBuildPath);
} else {
    console.log("⚠️  Frontend build not found. Run 'npm run build' in /frontend to build.");
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});
