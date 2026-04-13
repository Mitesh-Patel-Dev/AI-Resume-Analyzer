import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/api";
import {
    FiUploadCloud,
    FiFile,
    FiX,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";

const Upload = () => {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile);
            setError("");
        } else {
            setError("Please upload a PDF file only.");
        }
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setError("");
        } else {
            setError("Please upload a PDF file only.");
        }
    };

    const removeFile = () => {
        setFile(null);
        setError("");
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a resume to upload.");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("resume", file);

            const res = await uploadResume(formData);
            setSuccess(res.data);

            // Navigate to results after 1.5s
            setTimeout(() => {
                navigate(`/results/${res.data.resume._id}`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1048576).toFixed(1) + " MB";
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-accent-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Upload Your <span className="gradient-text">Resume</span>
                    </h1>
                    <p className="text-dark-400 text-lg">
                        Drop your PDF and let AI analyze it in seconds
                    </p>
                </div>

                {/* Success State */}
                {success && (
                    <div className="glass-card p-8 text-center animate-slide-up">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCheckCircle className="text-green-400 text-3xl" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">
                            Resume Analyzed Successfully!
                        </h2>
                        <p className="text-dark-400 mb-2">
                            ATS Score: <span className="text-green-400 font-bold text-lg">{success.resume.atsScore}/100</span>
                        </p>
                        <p className="text-dark-500 text-sm">Redirecting to results...</p>
                    </div>
                )}

                {/* Upload Area */}
                {!success && (
                    <div className="animate-slide-up">
                        {/* Drag & Drop Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`glass-card p-10 text-center cursor-pointer transition-all duration-300 ${dragActive
                                    ? "border-primary-400 bg-primary-500/10 shadow-lg shadow-primary-500/20"
                                    : "hover:border-primary-500/30 hover:bg-dark-800/30"
                                }`}
                            onClick={() => document.getElementById("file-input").click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div
                                className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all ${dragActive
                                        ? "bg-primary-500/30 shadow-lg shadow-primary-500/30"
                                        : "bg-dark-800"
                                    }`}
                            >
                                <FiUploadCloud
                                    className={`text-4xl transition-colors ${dragActive ? "text-primary-300" : "text-dark-400"
                                        }`}
                                />
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">
                                {dragActive ? "Drop your resume here" : "Drag & drop your resume"}
                            </h3>
                            <p className="text-dark-500 text-sm mb-4">
                                or click to browse files
                            </p>
                            <p className="text-dark-600 text-xs">
                                Supports PDF files up to 5MB
                            </p>
                        </div>

                        {/* Selected File */}
                        {file && (
                            <div className="mt-5 glass-card p-4 flex items-center justify-between animate-slide-up">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
                                        <FiFile className="text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white truncate max-w-xs">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-dark-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile();
                                    }}
                                    className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <FiX />
                                </button>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-slide-up">
                                <FiAlertCircle className="flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Upload Button */}
                        <button
                            id="upload-button"
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="mt-6 w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing Resume...
                                </>
                            ) : (
                                <>
                                    <FiUploadCloud />
                                    Upload & Analyze
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
