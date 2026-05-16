import { useState } from "react";
import { generateOptimizedResume } from "../services/api";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FiCopy, FiCheck, FiAlertTriangle } from "react-icons/fi";

const AutoFixResume = ({ resumeId }) => {
  const [loading, setLoading] = useState(false);
  const [aiResume, setAiResume] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await generateOptimizedResume(resumeId);
      setAiResume(res.data.aiGeneratedResume);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-elevated p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500/30 to-accent-500/30 rounded-xl flex items-center justify-center">
            <HiOutlineSparkles className="text-brand-300 text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              AI Resume Builder
            </h2>
            <p className="text-xs text-surface-500">
              Auto-fix your resume with Generative AI
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            loading
              ? "bg-surface-700 text-surface-400 cursor-not-allowed"
              : "bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-surface-400/30 border-t-surface-400 rounded-full animate-spin" />
              Rewriting...
            </>
          ) : (
            <>
              <HiOutlineSparkles />
              {aiResume ? "Regenerate" : "âœ¨ Auto-Fix with AI"}
            </>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <FiAlertTriangle className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* AI-Generated Resume Output */}
      {aiResume && (
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-surface-500">
              âœ… AI-optimized resume â€” edit below as needed
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-surface-300 hover:text-white transition-all"
            >
              {copied ? (
                <>
                  <FiCheck className="text-green-400" /> Copied!
                </>
              ) : (
                <>
                  <FiCopy /> Copy All
                </>
              )}
            </button>
          </div>

          {/* Editable Textarea */}
          <textarea
            value={aiResume}
            onChange={(e) => setAiResume(e.target.value)}
            className="w-full h-[500px] p-5 bg-surface-800/60 border border-surface-700/50 rounded-xl text-surface-200 text-sm leading-relaxed resize-y focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all font-mono"
            placeholder="AI-generated resume will appear here..."
          />

          {/* Info */}
          <p className="text-xs text-surface-600 text-center">
            ðŸ’¡ Tip: You can manually edit the text above before copying it into
            your final resume.
          </p>
        </div>
      )}

      {/* Empty State â€” before first generation */}
      {!aiResume && !loading && !error && (
        <div className="text-center py-10 px-4">
          <div className="w-16 h-16 bg-surface-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiOutlineSparkles className="text-2xl text-surface-500" />
          </div>
          <h3 className="text-sm font-medium text-surface-400 mb-1">
            Ready to optimize
          </h3>
          <p className="text-xs text-surface-600 max-w-sm mx-auto">
            Click "Auto-Fix with AI" to rewrite your resume with missing skills
            integrated, action verbs enhanced, and ATS formatting applied.
          </p>
        </div>
      )}
    </div>
  );
};

export default AutoFixResume;

