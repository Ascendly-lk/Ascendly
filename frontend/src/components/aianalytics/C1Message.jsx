/**
 * C1Message — renders a Thesys C1 interactive UI response inside a chat bubble.
 *
 * Receives the full accumulated DSL string (never individual chunks).
 * Falls back to null while the string is still empty (shows typing indicator in parent).
 */
import { C1Component, ThemeProvider } from '@thesysai/genui-sdk';
import '@crayonai/react-ui/styles/index.css';
import { FileUploadZone } from './FileUploadZone';

const ascendlyTheme = {
    lineChartPalette:  ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e'],
    barChartPalette:   ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e'],
    areaChartPalette:  ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e'],
    pieChartPalette:   ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e'],
};

const C1Message = ({ dsl, isStreaming, onAction }) => {
    if (!dsl) return null;

    return (
        <ThemeProvider mode="dark" theme={ascendlyTheme}>
            <C1Component
                c1Response={dsl}
                isStreaming={isStreaming}
                customComponents={{ FileUploadZone }}
                onAction={onAction}
            />
        </ThemeProvider>
    );
};

export default C1Message;
