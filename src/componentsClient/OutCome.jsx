import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import myQuestions from "../assets/questions.json";
import { useSelector } from "react-redux";
import { doApiMethod } from "../services/apiService";
import logo from '../assets/react.svg'; 

// --- Icons ---
const DownloadIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;

function OutCome() {
    const thisidQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
    const userName = useSelector(state => state.myDetailsSlice.name) || "User";
    let [ar, setAr] = useState([]);
    const nav = useNavigate();
    
    const ORANGE = "#F96424"; 

    const HomeP = () => nav("/HomeClient");

    useEffect(() => {
        doApi()
    }, [])

    const doApi = async () => {
        let idBody = { "idQuestions": thisidQuestions }
        let tempAr = [];
        try {
            let resData = await doApiMethod("/questions/thisQuestion", "PUT", idBody);
            let data = resData.data;
            if (!data) return;

            const allQuestions = myQuestions.sections.flatMap(section => section.questions);
            const questionMap = new Map(allQuestions.map(q => [q.id, q.question]));
            const questionTypeMap = new Map(allQuestions.map(q => [q.id, q.type]));

            for (let qId = 1; qId <= 53; qId++) {
                const answer = data[qId];
                if (answer !== undefined && answer !== null && !(Array.isArray(answer) && answer.length === 0)) {
                    const questionText = questionMap.get(qId);
                    const questionType = questionTypeMap.get(qId);
                    if (questionText !== undefined) {
                        let finalAnswer = questionType === "date" && typeof answer === "string" ? answer.substring(0, 10) : answer;
                        if (Array.isArray(finalAnswer) && finalAnswer.length > 1) {
                            finalAnswer = finalAnswer.join(", ");
                        }
                        tempAr.push({ question: questionText, answer: finalAnswer });
                    }
                }
            }
            setAr(tempAr);
        } catch (error) { console.log(error); }
    }

    const handleDownload = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();

        // כותרת PDF
        pdf.setFontSize(22);
        pdf.setTextColor(249, 100, 36); // צבע כתום
        pdf.setFont("helvetica", "bold");
        pdf.text("Medical Assessment Report", pageWidth / 2, 20, { align: "center" });

        // פרטים
        pdf.setFontSize(12);
        pdf.setTextColor(60, 60, 60);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Client Name: ${userName}`, 20, 35);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);

        pdf.setDrawColor(220, 220, 220);
        pdf.line(20, 48, pageWidth - 20, 48);

        // טבלה
        autoTable(pdf, {
            startY: 55,
            head: [["Question", "Response"]],
            body: ar.map(q => [q.question, q.answer || "-"]),
            theme: "grid",
            headStyles: { fillColor: [249, 100, 36], textColor: 255, fontStyle: 'bold' }, // כותרות בכתום
            alternateRowStyles: { fillColor: [250, 250, 250] },
            styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
            margin: { left: 20, right: 20 },
        });

        pdf.save("Assessment_Report.pdf");
    };

    // --- Styles ---
    const styles = {
        th: {
            position: "sticky", top: 0, 
            backgroundColor: "#F9FAFB",
            color: "#374151", 
            fontWeight: "600", // פונט עבה יותר לכותרות
            textTransform: "uppercase", 
            fontSize: "0.8rem", 
            letterSpacing: "0.05em",
            padding: "16px 24px", 
            textAlign: "left", 
            borderBottom: "2px solid #E5E7EB", 
            zIndex: 10
        },
        td: {
            padding: "16px 24px", 
            borderBottom: "1px solid #F3F4F6", 
            color: "#1F2937", 
            fontSize: "1rem", // פונט קריא
            fontWeight: "500", // פונט טיפה עבה
            lineHeight: "1.5"
        },
        rowStriped: { backgroundColor: "#F9FAFB" }
    };

    return (
        <div className="vh-100 bg-white d-flex flex-column font-sans text-dark overflow-hidden">
            
            {/* 1. Navbar */}
            <nav className="d-flex align-items-center px-4 py-3" style={{ height: '60px', flexShrink: 0, borderBottom: '1px solid #f3f4f6' }}>
                <img src={logo} alt="Logo" width="22" className="opacity-75" />
                <span className="ms-2 fw-medium fst-italic" style={{fontSize: '1rem', color: '#333'}}>Fitwave.ai</span>
                
                <span 
                    onClick={HomeP} 
                    className="ms-auto text-muted small" 
                    style={{cursor: 'pointer', fontWeight: '500'}}
                >
                    Back to Home
                </span>
            </nav>

            {/* 2. Main Content */}
            <div className="flex-grow-1 d-flex flex-column align-items-center p-0" style={{ overflow: 'hidden' }}>
                
                <div className="w-100 d-flex flex-column h-100" style={{ maxWidth: '900px' }}>
                    
                    {/* Header Info */}
                    <div className="px-4 py-4 text-center">
                        <h2 className="mb-2" style={{ fontWeight: '700', fontSize: '1.75rem', color: '#111' }}>
                            Assessment Completed
                        </h2>
                        <p className="text-muted mb-3" style={{ fontSize: '1rem', fontWeight: '400' }}>
                            Great job, <strong>{userName}</strong>. Here is your summary.
                        </p>
                        
                        <div className="d-flex justify-content-center gap-4 text-sm text-secondary" style={{fontSize: '0.9rem'}}>
                            <span style={{backgroundColor: '#F3F4F6', padding: '4px 12px', borderRadius: '20px'}}>
                                Date: <strong>{new Date().toLocaleDateString()}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Table Area (Scrollable) */}
                    <div className="flex-grow-1 bg-white border-top shadow-sm" style={{ overflowY: 'auto', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ ...styles.th, width: '65%' }}>Question</th>
                                    <th style={styles.th}>Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ar.length > 0 ? (
                                    ar.map((q, index) => (
                                        <tr key={index} style={index % 2 === 0 ? {} : styles.rowStriped}>
                                            <td style={styles.td}>
                                                {q.question}
                                            </td>
                                            <td style={{ ...styles.td, color: ORANGE, fontWeight: '600' }}> {/* תשובה מודגשת בכתום */}
                                                {q.answer || <span className="text-muted fw-normal fst-italic">No Answer</span>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center py-5 text-muted">
                                            Generating report...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Actions */}
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-white" style={{ borderTop: '1px solid #E5E7EB' }}>
                         <button
                            onClick={HomeP}
                            className="btn text-secondary d-flex align-items-center gap-2"
                            style={{ fontWeight: '600', fontSize: '0.95rem' }}
                        >
                            <HomeIcon /> Home
                        </button>

                        <button
                            onClick={handleDownload}
                            className="btn text-white px-4 py-2 rounded-pill shadow-none d-flex align-items-center gap-2"
                            style={{ backgroundColor: ORANGE, fontWeight: '600', fontSize: '0.95rem' }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            Download PDF <DownloadIcon />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default OutCome;