import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Cpu, Target, Zap, Lightbulb, Activity } from 'lucide-react';
import './Ai.css';

const AiInsights = () => {
    const forecastData = [
        { name: 'Jan', value: 30000 },
        { name: 'Feb', value: 45000 },
        { name: 'Mar', value: 55000 },
        { name: 'Apr', value: 65000 },
        { name: 'May', value: 78000 },
        { name: 'Jun', value: 95000 },
    ];

    const strategies = [
        {
            id: 1,
            title: 'Optimize Neural Weights',
            desc: 'Model accuracy could improve by 23% with specialized hyperparameter tuning.',
            impact: 'High Impact',
            icon: <Target size={20} />,
        },
        {
            id: 2,
            title: 'Cross-Vector Analysis',
            desc: 'Implementing vector-based search increases data retrieval speed by 18%.',
            impact: 'Medium Impact',
            icon: <Zap size={20} />,
        },
        {
            id: 3,
            title: 'Scalable LLM Integration',
            desc: 'Potential to automate 34 additional data processing tasks.',
            impact: 'High Impact',
            icon: <Lightbulb size={20} />,
        },
    ];

    const activityLog = [
        { model: 'GPT-4 Analysis', type: 'NLP', tokens: '2.5M', confidence: '98%', date: 'Nov 28, 2024', status: 'Active' },
        { model: 'Custom CNN', type: 'Vision', tokens: '850K', confidence: '92%', date: 'Oct 15, 2024', status: 'Active' },
        { model: 'Predictive Engine', type: 'Forecasting', tokens: '5M', confidence: '89%', date: 'Sep 22, 2024', status: 'Active' },
        { model: 'Clustering v2', type: 'Unsupervised', tokens: '500K', confidence: 'N/A', date: 'Dec 18, 2024', status: 'Processing' },
    ];

    return (
        <div className="ai-page">
            <h1 className="page-title">AI Intelligence & Analytics</h1>

            <div className="ai-grid">
                <div className="left-column">
                    {/* AI Match Quality Score */}
                    <div className="card match-card">
                        <div className="card-header">
                            <div className="icon-bg">
                                <Brain size={24} color="#000" />
                            </div>
                            <h3>AI Efficiency Score</h3>
                        </div>

                        <div className="score-display">
                            <span className="current-score">87</span>
                            <span className="total-score">/ 100</span>
                        </div>

                        <div className="insight-box">
                            <div className="insight-title">
                                <Lightbulb size={16} fill="yellow" stroke="none" />
                                <span>Real-time Insight:</span>
                            </div>
                            <p>Refine training datasets for the FinTech module to maximize output quality.</p>
                        </div>
                    </div>

                    {/* AI Metric Card */}
                    <div className="card metric-card">
                        <div className="card-header">
                            <div className="icon-circle">
                                <Cpu size={20} />
                            </div>
                            <h3>Total Tokens Processed</h3>
                        </div>
                        <div className="metric-amount">44.2M</div>
                        <p className="metric-note">Across all deployed models</p>
                    </div>
                </div>

                <div className="right-column">
                    <div className="charts-row">
                        {/* AI Performance Forecast */}
                        <div className="card forecast-card">
                            <h3>6-Month Performance Forecast</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={forecastData}>
                                        <CartesianGrid vertical={false} stroke="#2a2e35" strokeDasharray="0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1d21', border: 'none', color: '#fff' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="var(--accent-cyan)"
                                            strokeWidth={3}
                                            dot={{ fill: 'var(--accent-cyan)', r: 4, strokeWidth: 0 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="ai-prediction">
                                <span className="prediction-label">AI Logic Prediction:</span>
                                <p>Efficiency expected to scale to 82% by June 2025 (+56% growth)</p>
                            </div>
                        </div>

                        {/* Top AI-Recommended Strategies */}
                        <div className="card strategies-card">
                            <h3>AI-Generated Optimization</h3>
                            <div className="strategies-list">
                                {strategies.map((strategy) => (
                                    <div key={strategy.id} className="strategy-item">
                                        <div className="strategy-icon-wrapper">
                                            {strategy.icon}
                                        </div>
                                        <div className="strategy-content">
                                            <div className="strategy-header">
                                                <h4>{strategy.title}</h4>
                                                <span className={`impact-badge ${strategy.impact.toLowerCase().split(' ')[0]}`}>
                                                    {strategy.impact}
                                                </span>
                                            </div>
                                            <p>{strategy.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Process Log */}
                    <div className="card log-card">
                        <h3>Neural Process Log</h3>
                        <div className="table-wrapper">
                            <table className="ai-table">
                                <thead>
                                    <tr>
                                        <th>Model Name</th>
                                        <th>Category</th>
                                        <th>Volume</th>
                                        <th>Confidence</th>
                                        <th>Last Run</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityLog.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ color: '#fff', fontWeight: 500 }}>{item.model}</td>
                                            <td>{item.type}</td>
                                            <td>{item.tokens}</td>
                                            <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{item.confidence}</td>
                                            <td>{item.date}</td>
                                            <td>
                                                <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiInsights;