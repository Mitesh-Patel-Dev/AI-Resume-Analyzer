import { useState, useRef, useEffect } from "react";
import { FiVolume2, FiVolumeX, FiPause, FiPlay } from "react-icons/fi";

const VoiceFeedback = ({ resume }) => {
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    const utteranceRef = useRef(null);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const buildFeedbackText = () => {
        const parts = [];
        parts.push(`Your resume scored ${resume.atsScore} out of 100.`);

        if (resume.atsScore >= 75) parts.push("This is an excellent score.");
        else if (resume.atsScore >= 50) parts.push("This is a good score, but there's room for improvement.");
        else parts.push("This score needs improvement. Let me explain how.");

        if (resume.scoreBreakdown) {
            parts.push(`Content score is ${resume.scoreBreakdown.content} out of 30.`);
            parts.push(`Skills score is ${resume.scoreBreakdown.skills} out of 35.`);
            parts.push(`Formatting score is ${resume.scoreBreakdown.formatting} out of 20.`);
            parts.push(`Impact score is ${resume.scoreBreakdown.impact} out of 15.`);
        }

        if (resume.bestFitRole) {
            parts.push(`Your best fit role is ${resume.bestFitRole}.`);
        }

        if (resume.detectedSkills?.length > 0) {
            parts.push(`I detected ${resume.detectedSkills.length} skills in your resume.`);
        }

        if (resume.missingSkills?.length > 0) {
            parts.push(`You're missing ${resume.missingSkills.length} in-demand skills, including ${resume.missingSkills.slice(0, 3).join(", ")}.`);
        }

        if (resume.suggestions?.length > 0) {
            parts.push("Here are some key suggestions:");
            resume.suggestions.slice(0, 3).forEach((s) => {
                // Remove emojis for cleaner speech
                parts.push(s.replace(/[^\w\s.,!?'-]/g, "").trim());
            });
        }

        return parts.join(" ");
    };

    const speak = () => {
        if (speaking && !paused) {
            window.speechSynthesis.pause();
            setPaused(true);
            return;
        }
        if (paused) {
            window.speechSynthesis.resume();
            setPaused(false);
            return;
        }

        const text = buildFeedbackText();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.lang = "en-US";

        // Try to use a good voice
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find((v) => v.name.includes("Google") || v.name.includes("Microsoft")) || voices[0];
        if (preferred) utterance.voice = preferred;

        utterance.onend = () => {
            setSpeaking(false);
            setPaused(false);
        };
        utterance.onerror = () => {
            setSpeaking(false);
            setPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        setSpeaking(true);
        setPaused(false);
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        setPaused(false);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={speak}
                className="btn-ghost !py-2 !px-3 text-xs flex items-center gap-1.5"
                title={speaking ? (paused ? "Resume" : "Pause") : "Listen to feedback"}
            >
                {speaking ? (
                    paused ? <><FiPlay className="text-brand-400" /> Resume</> : <><FiPause className="text-amber-400" /> Pause</>
                ) : (
                    <><FiVolume2 /> Listen</>
                )}
            </button>
            {speaking && (
                <button onClick={stop} className="btn-ghost !py-2 !px-3 text-xs flex items-center gap-1.5 text-red-400" title="Stop">
                    <FiVolumeX /> Stop
                </button>
            )}
        </div>
    );
};

export default VoiceFeedback;
