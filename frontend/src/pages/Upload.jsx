import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/api";
import { FiUploadCloud, FiFile, FiX, FiCheckCircle, FiAlertCircle, FiCpu, FiBarChart2 } from "react-icons/fi";

const STAGES = ["Uploading", "Extracting Text", "Analyzing Skills", "Scoring"];

const Upload = () => {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [stage, setStage] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === "application/pdf") {
            setFile(droppedFile);
            setError("");
        } else {
            setError("Please upload a PDF file only.");
        }
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile?.type === "application/pdf") {
            setFile(selectedFile);
            setError("");
        } else {
            setError("Please upload a PDF file only.");
        }
    };

    const handleUpload = async () => {
        if (!file) { setError("Please select a resume to upload."); return; }
        setUploading(true);
        setError("");
        setStage(0);

        // Simulate stage progression
        const stageTimer = setInterval(() => {
            setStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
        }, 800);

        try {
            const formData = new FormData();
            formData.append("resume", file);
            const res = await uploadResume(formData);
            clearInterval(stageTimer);
            setStage(STAGES.length);
            setSuccess(res.data);
            setTimeout(() => navigate(`/results/${res.data.resume._id}`), 1500);
        } catch (err) {
            clearInterval(stageTimer);
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
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <h1 className="heading-lg text-3xl md:text-4xl text-white mb-3">
                        Upload Your <span className="gradient-text">Resume</span>
                    </h1>
                    <p className="text-surface-400 text-lg">
                        Drop your PDF and get AI analysis in seconds
                    </p>
                </div>

                {/* Success State */}
                {success && (
                    <div className="card-elevated p-8 text-center animate-scale-in">
                        <div className="w-16 h-16 bg-brand-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCheckCircle className="text-brand-400 text-3xl" />
                        </div>
                        <h2 className="heading-lg text-xl text-white mb-2">Analysis Complete!</h2>
                        <p className="text-surface-400 mb-2">
                            ATS Score: <span className="text-brand-400 font-bold text-lg">{success.resume.atsScore}/100</span>
                        </p>
                        <p className="text-surface-600 text-sm">Redirecting to results...</p>
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
                            className={`card-outlined p-12 text-center cursor-pointer transition-all duration-300 ${
                                dragActive
                                    ? "!border-brand-400 !bg-brand-500/5"
                                    : "hover:border-surface-600"
                            }`}
                            onClick={() => !uploading && document.getElementById("file-input").click()}
                        >
                            <input id="file-input" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all ${
                                dragActive ? "bg-brand-500/15" : "bg-surface-800/60"
                            }`}>
                                <FiUploadCloud className={`text-3xl transition-colors ${
                                    dragActive ? "text-brand-400" : "text-surface-500"
                                }`} />
                            </div>
                            <h3 className="text-lg font-heading font-semibold text-white mb-2">
                                {dragActive ? "Drop it here" : "Drag & drop your resume"}
                            </h3>
                            <p className="text-surface-500 text-sm mb-3">or click to browse files</p>
                            <p className="text-surface-700 text-xs">PDF only • Max 5MB</p>
                        </div>

                        {/* Selected File */}
                        {file && (
                            <div className="mt-4 card p-4 flex items-center justify-between animate-scale-in">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
                                        <FiFile className="text-brand-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white truncate max-w-xs">{file.name}</p>
                                        <p className="text-xs text-surface-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); setError(""); }}
                                    className="p-2 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <FiX />
                                </button>
                            </div>
                        )}

                        {/* Upload Progress Stages */}
                        {uploading && (
                            <div className="mt-6 card p-5 animate-scale-in">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-5 h-5 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin" />
                                    <span className="text-sm font-medium text-white">Processing your resume...</span>
                                </div>
                                <div className="space-y-2">
                                    {STAGES.map((s, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                                i < stage ? "bg-brand-500 text-white" :
                                                i === stage ? "border-2 border-brand-400 text-brand-400 animate-pulse" :
                                                "border border-surface-700 text-surface-600"
                                            }`}>
                                                {i < stage ? "✓" : i + 1}
                                            </div>
                                            <span className={`text-sm ${
                                                i <= stage ? "text-surface-300" : "text-surface-600"
                                            }`}>{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-scale-in">
                                <FiAlertCircle className="flex-shrink-0" /> {error}
                            </div>
                        )}

                        {/* Upload Button */}
                        <button
                            id="upload-button"
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="mt-6 w-full btn-primary flex items-center justify-center gap-2 !py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:!shadow-none disabled:!transform-none"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <FiUploadCloud /> Upload & Analyze
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
