/**
 * SparklineChart — tiny inline SVG trend line for stat cards.
 * Props:
 *   data    — array of numbers (at least 2)
 *   color   — stroke color (default: currentColor)
 *   width   — SVG width  (default: 80)
 *   height  — SVG height (default: 28)
 */
const SparklineChart = ({ data = [], color = 'currentColor', width = 80, height = 28 }) => {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const pad = 2;
    const w = width - pad * 2;
    const h = height - pad * 2;

    const points = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * w;
        const y = pad + h - ((v - min) / range) * h;
        return `${x},${y}`;
    });

    const polyline = points.join(' ');
    const last = points[points.length - 1].split(',');

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            aria-hidden="true"
            style={{ display: 'block', overflow: 'visible' }}
        >
            <polyline
                points={polyline}
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
            />
            <circle
                cx={last[0]}
                cy={last[1]}
                r="2.5"
                fill={color}
                opacity="0.9"
            />
        </svg>
    );
};

export default SparklineChart;
