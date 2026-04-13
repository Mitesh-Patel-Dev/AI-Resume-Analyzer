const express = require("express");
const multer = require("multer");
const path = require("path");
const {
    uploadResume,
    getMyResumes,
    getResumeById,
    deleteResume,
} = require("../controllers/resumeController");
const { generateReport } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer config — store uploaded PDFs in /uploads folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

// Only allow PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// All routes are protected (require login)
router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/my-resumes", protect, getMyResumes);
router.get("/:id", protect, getResumeById);
router.get("/:id/report", protect, generateReport);
router.delete("/:id", protect, deleteResume);

module.exports = router;
