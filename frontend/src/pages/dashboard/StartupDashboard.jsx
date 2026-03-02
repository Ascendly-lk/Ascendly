import Sidebar from "../../components/dashboard/Sidebar";
import TopBar from "../../components/dashboard/TopBar";
import StatCard from "../../components/dashboard/StatCard";
import AIForecastCard from "../../components/dashboard/AIForecastCard";
import AdvisorsCard from "../../components/dashboard/AdvisorsCard";
import PromoCard from "../../components/dashboard/PromoCard";
import RevenueTrendCard from "../../components/dashboard/RevenueTrendCard";
import "./StartupDashboard.css";

const StartupDashboard = () => {
    const userIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );

    const analyticsIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
    );

    const miniBars = (
        <svg width="60" height="30" viewBox="0 0 60 30">
            <rect x="0" y="15" width="8" height="15" rx="2" fill="#00FFEF" opacity="2" />
            <rect x="13" y="10" width="8" height="20" rx="2" fill="#00FFEF" opacity="0.8" />
            <rect x="26" y="5" width="8" height="25" rx="2" fill="#00FFEF" opacity="0.9" />
            <rect x="39" y="12" width="8" height="18" rx="2" fill="#00FFEF" opacity="0.8" />
            <rect x="52" y="8" width="8" height="22" rx="2" fill="#00FFEF" opacity="0.85" />
        </svg>
    );

    const growthCurve = (
        <svg width="80" height="40" viewBox="0 0 80 40">
            <path d="M 0,35 Q 20,30 40,20 T 80,10" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.4" />
        </svg>
    );

    return (
        <div className="startup-dashboard">
            <Sidebar />

            <div className="dashboard-main">
                <TopBar />

                <div className="dashboard-content">
                    {/* Row 1: Stat Cards */}
                    <div className="dashboard-row dashboard-stats">
                        <StatCard title="Active users" value="1892" icon={userIcon} variant="dark" />

                        <StatCard title="Monthly Revenue" value="$18,500" icon={null} variant="dark" decoration={miniBars} />

                        <StatCard title="Engagement Score" value="81/100" icon={analyticsIcon} variant="dark" />

                        <StatCard title="Growth" value="+17.4%" icon={null} variant="gradient" decoration={growthCurve} />
                    </div>

                    {/* Row 2: AI Forecast & Advisors */}
                    <div className="dashboard-row dashboard-row-2">
                        <div className="dashboard-col-large">
                            <AIForecastCard />
                        </div>
                        <div className="dashboard-col-small">
                            <AdvisorsCard />
                        </div>
                    </div>

                    {/* Row 3: Promo & Revenue Trend */}
                    <div className="dashboard-row dashboard-row-3">
                        <div className="dashboard-col-large">
                            <PromoCard />
                        </div>
                        <div className="dashboard-col-small">
                            <RevenueTrendCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupDashboard;