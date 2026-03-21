import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a structured PDF report based on chat history.
 * @param {Array} messages - Chat history array
 */
export const generatePDFReport = (messages) => {
    try {
        const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // ----- COLORS & THEMES ----- //
    const primaryTeal = [26, 139, 126];    // #1A8B7E
    const textGray = [80, 80, 80];         // Darker gray for PDF readability

    // ----- HEADER ----- //
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
    doc.text("Ascendly", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    doc.text(`Generated: ${dateStr}`, 14, 28);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("AI Business Insights Report", 14, 40);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 44, pageWidth - 14, 44);

    let currentY = 55;

    // ----- EXECUTIVE SUMMARY ----- //
    // Find the first meaningful user request and AI response
    const meaningfulMessages = messages.filter(m => m.id !== 1 && m.text && m.text.trim().length > 0);
    const firstReq = meaningfulMessages.find(m => m.role === 'user');
    const firstRes = meaningfulMessages.find(m => m.role === 'assistant');

    if (firstReq && firstRes) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Executive Summary", 14, currentY);
        currentY += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        
        // Summarize briefly
        const reqSplit = doc.splitTextToSize(`Objective: ${firstReq.text}`, pageWidth - 28);
        doc.text(reqSplit, 14, currentY);
        currentY += (reqSplit.length * 5) + 4;
        
        // Take just the first 300 chars of the AI response as a summary highlight
        let aiPreview = firstRes.text.substring(0, 300).replace(/\*\*/g, '').replace(/#/g, '').replace(/\n/g, ' ');
        if (firstRes.text.length > 300) aiPreview += "...";
        const aiSplit = doc.splitTextToSize(`Conclusion: ${aiPreview}`, pageWidth - 28);
        doc.text(aiSplit, 14, currentY);
        currentY += (aiSplit.length * 5) + 10;
    }

    // ----- KPI SUMMARY (Mock Data) ----- //
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("KPI Summary", 14, currentY);
    currentY += 6;

    autoTable(doc, {
        startY: currentY,
        head: [['Metric', 'Value', 'Trend']],
        body: [
            ['Monthly Active Users', '12,450', 'Up 8%'],
            ['Conversion Rate', '4.3%', 'Up 1.2%'],
            ['Customer Retention', '78%', 'Down 2%'],
            ['MRR Revenue', '$24,000', 'Up 12%']
        ],
        theme: 'striped',
        headStyles: { fillColor: primaryTeal, textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
            0: { cellWidth: 80, fontStyle: 'bold' },
            1: { cellWidth: 50 },
            2: { cellWidth: 50 }
        }
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // ----- KEY AI RECOMMENDATIONS ----- //
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Actionable AI Recommendations", 14, currentY);
    currentY += 8;

    const recommendations = [
        "Improve onboarding flow to increase Day-1 retention.",
        "Focus marketing efforts on high-converting Enterprise segments.",
        "Optimize pricing tiers to align with new MRR goals.",
        "Increase engagement through personalized push notifications."
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    recommendations.forEach((rec, idx) => {
        const line = doc.splitTextToSize(`• ${rec}`, pageWidth - 28);
        doc.text(line, 14, currentY);
        currentY += (line.length * 5) + 2;
    });

    currentY += 10;

    // ----- CHAT HIGHLIGHTS ----- //
    // Check if we need a new page
    if (currentY > 230) {
        doc.addPage();
        currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Chat Conversation Highlights", 14, currentY);
    currentY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    // Reverse logic to get the last 3-4 interactions for highlights
    const highlights = meaningfulMessages.slice(-6); 

    highlights.forEach(m => {
        if (currentY > 270) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setTextColor(m.role === 'user' ? 0 : [primaryTeal[0], primaryTeal[1], primaryTeal[2]]);
        doc.text(m.role === 'user' ? "User Inquiry:" : "AI Insight:", 14, currentY);
        currentY += 5;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        
        // Clean markdown heavily
        let rawText = m.text.replace(/\*\*/g, '').replace(/###/g, '').replace(/##/g, '').replace(/#/g, '');
        // If response is huge, truncate
        if (m.role === 'assistant' && rawText.length > 500) {
            rawText = rawText.substring(0, 500) + "... [truncated]";
        }

        const lines = doc.splitTextToSize(rawText, pageWidth - 28);
        doc.text(lines, 14, currentY);
        currentY += (lines.length * 4) + 6;
    });

    // ----- FOOTER ----- //
    const pgCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pgCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Page ${i} of ${pgCount}  |  Ascendly AI Analytics © ${new Date().getFullYear()}`,
            pageWidth / 2,
            290,
            { align: 'center' }
        );
    }

    doc.save("Ascendly_AI_Business_Insights.pdf");
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("There was an error generating the PDF Report. Please try again.");
    }
};
