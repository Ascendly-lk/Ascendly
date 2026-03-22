import './StatCard.css';

/**
 * StatCard — matches the Investor Dashboard stat card layout exactly.
 *
 * Visual structure (flex column):
 *   ┌──────────────────────────────┐
 *   │  [icon]  LABEL               │
 *   │                              │
 *   │  1,892                       │
 *   └──────────────────────────────┘
 *
 * Props:
 *   title      – label text (uppercased in CSS)
 *   value      – main numeric/string value
 *   suffix     – optional dim suffix after value (e.g. "/100")
 *   icon       – optional SVG/element for the icon circle
 *   variant    – 'dark' | 'gradient'
 *   decoration – optional mini chart/SVG element
 */
const StatCard = ({ title, value, suffix, icon, variant = 'dark', decoration }) => {
    return (
        <div className={`stat-card stat-card-${variant}`}>
            {/* Top row: icon circle + label */}
            <div className="stat-card-top">
                {icon && <span className="stat-card-icon">{icon}</span>}
                <span className="stat-card-title">{title}</span>
                {/* Decoration pinned top-right for no-icon cards */}
                {!icon && decoration && (
                    <div className="stat-card-deco-corner">{decoration}</div>
                )}
            </div>

            {/* Large value */}
            <div className="stat-card-value">
                {value}
                {suffix && <span className="stat-card-suffix">{suffix}</span>}
            </div>

            {/* Decoration below value for icon cards */}
            {icon && decoration && (
                <div className="stat-card-deco-bottom">{decoration}</div>
            )}
        </div>
    );
};

export default StatCard;
