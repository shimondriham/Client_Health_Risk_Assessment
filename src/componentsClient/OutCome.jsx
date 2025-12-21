import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import myQuestions from "../assets/questions.json";
import { useSelector } from "react-redux";
import { doApiMethod } from "../services/apiService";
import logo from '../assets/react.svg'; 

// --- Icons ---
const DownloadIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const HomeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const UserIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F96424" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

function OutCome() {
    const thisidQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
    const userName = useSelector(state => state.myDetailsSlice.name) || "Valued Client";
    let [ar, setAr] = useState([]);
    const nav = useNavigate();
    
    const ORANGE = "#F96424"; 

    useEffect(() => {
        doApi()
    }, [])

    const doApi = async () => {
        // ... (אותו לוגיקה בדיוק, רק הנתונים נטענים)
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
        // ... (אותו לוגיקה ל-PDF)
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        pdf.setFontSize(22);
        pdf.setTextColor(249, 100, 36);
        pdf.setFont("helvetica", "bold");
        pdf.text("Medical Assessment Report", pageWidth / 2, 20, { align: "center" });
        pdf.setFontSize(12);
        pdf.setTextColor(60, 60, 60);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Client Name: ${userName}`, 20, 35);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);
        pdf.setDrawColor(220, 220, 220);
        pdf.line(20, 48, pageWidth - 20, 48);
        autoTable(pdf, {
            startY: 55,
            head: [["Question", "Response"]],
            body: ar.map(q => [q.question, q.answer || "-"]),
            theme: "grid",
            headStyles: { fillColor: [249, 100, 36], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
            margin: { left: 20, right: 20 },
        });
        pdf.save("Assessment_Report.pdf");
    };

    return (
        <>
        {/* הזרקת פונטים איכותיים */}
        <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700&display=swap');
            .font-outfit { font-family: 'Outfit', sans-serif; }
            .font-inter { font-family: 'Inter', sans-serif; }
            
            /* גלילה פנימית מעוצבת */
            .custom-scroll::-webkit-scrollbar { width: 8px; }
            .custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
            .custom-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
            .custom-scroll::-webkit-scrollbar-thumb:hover { background: #aaa; }
            `}
        </style>

        {/* מיכל ראשי - ללא גלילה חיצונית */}
        <div className="vh-100 d-flex flex-column font-inter text-dark overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
            
            {/* 1. Top Bar (Professional Dark/Gradient Header) */}
            <div style={{ background: 'linear-gradient(90deg, #111 0%, #333 100%)', flexShrink: 0, paddingBottom: '60px' }}> {/* Padding Bottom יוצר מקום לכרטיס לעלות למעלה */}
                <nav className="d-flex align-items-center justify-content-between px-5 py-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="d-flex align-items-center gap-2">
                        <img src={logo} alt="Logo" width="28" />
                        <span className="font-outfit fw-bold text-white" style={{fontSize: '1.2rem', letterSpacing: '0.5px'}}>Fitwave.ai</span>
                    </div>
                    <button 
                        onClick={() => nav("/HomeClient")} 
                        className="btn btn-link text-white-50 text-decoration-none fw-bold font-outfit hover-white"
                        style={{ fontSize: '0.9rem' }}
                    >
                        <span className="d-flex align-items-center gap-2"><HomeIcon /> Back to Dashboard</span>
                    </button>
                </nav>

                {/* Title Section */}
                <div className="px-5 mt-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 className="font-outfit text-white fw-bold display-6 mb-1">Assessment Report</h1>
                    <p className="text-white-50 font-inter m-0" style={{ fontSize: '1rem' }}>
                        Generated on {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* 2. Main Content Area (Floating Card) */}
            <div className="flex-grow-1 d-flex justify-content-center px-4 overflow-hidden" style={{ marginTop: '-40px' }}>
                <div className="w-100 bg-white rounded-4 shadow-lg d-flex flex-column overflow-hidden border border-light" style={{ maxWidth: '1000px', marginBottom: '20px' }}>
                    
                    {/* User Info Bar */}
                    <div className="px-4 py-4 border-bottom bg-white d-flex align-items-center justify-content-between flex-shrink-0">
                        <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', backgroundColor: '#FFF4F0' }}>
                                <UserIcon />
                            </div>
                            <div>
                                <span className="d-block text-muted small font-outfit fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Patient / Client</span>
                                <span className="d-block font-inter fw-bold text-dark" style={{ fontSize: '1.2rem' }}>{userName}</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleDownload}
                            className="btn text-white px-4 py-2 rounded-pill font-outfit fw-bold d-flex align-items-center gap-2 shadow-sm"
                            style={{ backgroundColor: ORANGE, border: 'none', transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <DownloadIcon /> Export PDF
                        </button>
                    </div>

                    {/* Scrollable List of Questions */}
                    <div className="flex-grow-1 overflow-auto custom-scroll p-0 bg-light">
                        {ar.length > 0 ? (
                            <div className="container-fluid p-4">
                                <div className="row g-3">
                                    {ar.map((q, index) => (
                                        <div className="col-12" key={index}>
                                            <div className="bg-white p-4 rounded-3 border border-light shadow-sm h-100 d-flex flex-column justify-content-center" style={{ transition: 'border-color 0.2s' }}>
                                                
                                                {/* Question */}
                                                <div className="mb-2">
                                                    <span className="text-muted small font-outfit fw-bold me-2">Q{index + 1}.</span>
                                                    <span className="font-inter fw-medium text-dark" style={{ fontSize: '1.05rem', lineHeight: '1.5' }}>
                                                        {q.question}
                                                    </span>
                                                </div>

                                                {/* Answer - מודגש בכתום */}
                                                <div className="ps-4 border-start border-3" style={{ borderColor: ORANGE }}>
                                                    <span className="font-inter fw-bold" style={{ fontSize: '1.1rem', color: '#111' }}>
                                                        {q.answer || <span className="text-muted fst-italic fw-normal">No Answer Provided</span>}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                <div className="spinner-border text-secondary mb-3" role="status"></div>
                                <span className="font-inter">Generating Report Data...</span>
                            </div>
                        )}
                    </div>

                    {/* Footer / Branding */}
                    <div className="py-2 text-center bg-white border-top flex-shrink-0">
                        <small className="text-muted font-outfit fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>CONFIDENTIAL REPORT • FITWAVE.AI</small>
                    </div>

                </div>
            </div>
        </div>
        </>
    );
}

export default OutCome;