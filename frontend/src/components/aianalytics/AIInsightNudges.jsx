/**
 * AIInsightNudges — contextual prompt chips on the analytics dashboard.
 *
 * Generates smart nudges client-side from already-fetched metrics.
 * Each chip navigates to the AI assistant with a pre-filled prompt.
 * No backend call needed — pure React.
 */
import { useNavigate } from 'react-router-dom';
import './AIInsightNudges.css';

const SparkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

function generateNudges(metrics) {
    const nudges = [];

    const filesUploaded = metrics?.files_uploaded?.value;
    const analysesChange = metrics?.ai_queries?.change_percent;
    const activeReports = metrics?.active_reports?.value;

    if (filesUploaded > 0) {
        nudges.push({
            label: `Analyse your ${filesUploaded} dataset${filesUploaded > 1 ? 's' : ''}`,
            prompt: 'Analyze my uploaded data and give me a full business summary',
        });
    }

    if (typeof analysesChange === 'number' && analysesChange < 0) {
        nudges.push({
            label: 'AI usage dropped — find out why',
            prompt: 'Why has my AI analysis usage decreased recently?',
        });
    }

    if (activeReports === 0 || activeReports === '--') {
        nudges.push({
            label: 'Generate your first revenue forecast',
            prompt: 'Forecast my revenue for the next 3 months',
        });
    }

    // Always-available fallback nudges
    nudges.push(
        { label: 'Compare with industry benchmarks', prompt: 'Compare my business metrics against industry benchmarks' },
        { label: 'Get strategic recommendations', prompt: 'Give me strategic recommendations to grow my business' },
    );

    return nudges.slice(0, 4); // cap at 4 chips
}

const AIInsightNudges = ({ metrics }) => {
    const navigate = useNavigate();
    const nudges = generateNudges(metrics);

    if (!nudges.length) return null;

    const handleChip = (prompt) => {
        navigate('/ai-analytics/assistant', { state: { initialPrompt: prompt } });
    };

    return (
        <div className="ai-nudges-section">
            <div className="ai-nudges-header">
                <SparkIcon />
                <span>AI Suggestions</span>
            </div>
            <div className="ai-nudges-chips">
                {nudges.map((n) => (
                    <button
                        key={n.label}
                        className="ai-nudge-chip"
                        onClick={() => handleChip(n.prompt)}
                    >
                        {n.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AIInsightNudges;
