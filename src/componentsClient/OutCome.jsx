import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import myQuestions from "../assets/questions.json"; 
import { useSelector } from "react-redux";
import { doApiMethod } from "../services/apiService";

// --- Icons ---
const DownloadIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const HomeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const CheckCircleIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

const initialUsers = [];

function OutCome() {
  const thisidQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
  const userName = useSelector(state => state.myDetailsSlice.name) || "User"; 
  let [ar, setAr] = useState(initialUsers);
  const nav = useNavigate();
  
  const HomeP = () => nav("/HomeClient");

  useEffect(() => {
    doApi()
  }, [])

  const doApi = async () => {
    let idBody = {
      "idQuestions": thisidQuestions
    }
    let tempAr = [];
    try {
      let resData = await doApiMethod("/questions/thisQuestion", "PUT", idBody);
      
      let data = resData.data;
      if(!data) return;

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
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownload = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(22);
    pdf.setTextColor(50, 50, 93);
    pdf.setFont("helvetica", "bold");
    pdf.text("Medical Assessment Report", pageWidth / 2, 20, { align: "center" });

    pdf.setFontSize(12);
    pdf.setTextColor(100);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Client Name: ${userName}`, 20, 35);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);
    
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 48, pageWidth - 20, 48);

    pdf.setFontSize(11);
    pdf.text("Thank you for completing the assessment. Below is a summary of your responses:", 20, 58);

    autoTable(pdf, {
      startY: 65,
      head: [["Question", "Response"]],
      body: ar.map(q => [q.question, q.answer || "-"]),
      theme: "grid",
      headStyles: { fillColor: [123, 104, 238], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
      margin: { left: 20, right: 20 },
    });

    pdf.save("Assessment_Report.pdf");
  };

  // --- STYLES ---
  const styles = {
    page: {
        height: "100vh", width: "100vw", position: "fixed", top: 0, left: 0,
        backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden"
    },
    wave: {
        position: "absolute", bottom: "-20%", right: "-10%", width: "120%", height: "70%",
        background: "linear-gradient(135deg, #7b68ee 0%, #ec4899 100%)",
        borderRadius: "100% 0 0 0 / 80% 0 0 0", zIndex: 0
    },
    card: {
        zIndex: 2, backgroundColor: "white", borderRadius: "24px",
        width: "90%", maxWidth: "900px", height: "85vh",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        display: "flex", flexDirection: "column", position: "relative", overflow: "hidden"
    },
    header: {
        padding: "30px 40px", backgroundColor: "white",
        borderBottom: "1px solid #f3f4f6", flexShrink: 0,
        textAlign: "center"
    },
    title: { fontSize: "1.8rem", fontWeight: "800", color: "#1f2937", marginBottom: "0.5rem" },
    subtitle: { color: "#6b7280", fontSize: "1rem" },
    
    infoBar: {
        backgroundColor: "#f9fafb", padding: "15px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid #f3f4f6", fontSize: "0.9rem", color: "#374151", fontWeight: "500"
    },

    contentScroll: {
        padding: "0", overflowY: "auto", flexGrow: 1, backgroundColor: "white"
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        position: "sticky", top: 0, backgroundColor: "#f3f4f6", 
        color: "#4b5563", fontWeight: "700", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em",
        padding: "16px 24px", textAlign: "left", borderBottom: "1px solid #e5e7eb", zIndex: 10
    },
    td: {
        padding: "16px 24px", borderBottom: "1px solid #f3f4f6", color: "#1f2937", fontSize: "0.95rem", lineHeight: "1.5"
    },
    rowStriped: { backgroundColor: "#f9fafb" },
    
    footer: {
        padding: "20px 40px", backgroundColor: "white", borderTop: "1px solid #f3f4f6",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0
    },
    gradientBtn: {
        background: "linear-gradient(90deg, #7b68ee 0%, #ec4899 100%)",
        color: "white", border: "none", padding: "12px 32px",
        borderRadius: "50px", fontWeight: "700", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "10px",
        boxShadow: "0 4px 15px rgba(123, 104, 238, 0.3)",
        transition: "transform 0.2s"
    },
    outlineBtn: {
        background: "white", border: "2px solid #e5e7eb", color: "#6b7280",
        padding: "10px 24px", borderRadius: "50px", fontWeight: "700", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wave}></div>

      <div style={styles.card}>
        
        <div style={styles.header}>
            <div style={{marginBottom: '15px'}}>
                <CheckCircleIcon />
            </div>
            <h2 style={styles.title}>Assessment Completed!</h2>
            <p style={styles.subtitle}>
                Great job, {userName}. Here is a summary of your responses.
            </p>
        </div>

        <div style={styles.infoBar}>
            <span>Client: <strong>{userName}</strong></span>
            <span>Date: <strong>{new Date().toLocaleDateString()}</strong></span>
        </div>

        <div style={styles.contentScroll}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={{...styles.th, width: '60%'}}>Question</th>
                        <th style={styles.th}>Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {ar.length > 0 ? (
                        ar.map((q, index) => (
                            <tr key={index} style={index % 2 === 0 ? {} : styles.rowStriped}>
                                <td style={styles.td}>
                                    {/* הורדתי את המספור כאן */}
                                    {q.question}
                                </td>
                                <td style={{...styles.td, fontWeight: '500', color: '#7b68ee'}}>
                                    {q.answer || <span style={{color:'#d1d5db', fontStyle:'italic'}}>No Answer</span>}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" style={{textAlign:'center', padding:'40px', color:'#9ca3af'}}>
                                Loading report data...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <div style={styles.footer}>
            <button 
                className="hover-scale"
                onClick={HomeP} 
                style={styles.outlineBtn}
                onMouseOver={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'}}
                onMouseOut={(e) => {e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'}}
            >
                <HomeIcon /> Back to Home
            </button>

            <button 
                className="hover-scale"
                onClick={handleDownload} 
                style={styles.gradientBtn}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                Download Report <DownloadIcon />
            </button>
        </div>

      </div>
    </div>
  );
}

export default OutCome;