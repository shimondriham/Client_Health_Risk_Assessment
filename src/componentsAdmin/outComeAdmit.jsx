import React, { useEffect, useState } from "react";
import { doApiGet, doApiMethod } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import myQuestions from "../assets/questions.json";
import { useSelector } from "react-redux";
import thisIcon from '../assets/icon.png'; 

// --- Icons ---
const DownloadIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const ArrowLeftIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const UserIconWhite = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CalendarIconWhite = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const Spinner = () => <svg className="animate-spin" width="30" height="30" viewBox="0 0 24 24" fill="none" style={{animation: 'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" stroke="#eee" strokeWidth="4"></circle><path fill="#F96424" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>;
const FileTextIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

function OutComeAdmin() {
  const ThisID = useSelector((state) => state.myDetailsSlice.idOutComeAdmin);
  let [name, setName] = useState("Loading Client...");
  let [ar, setAr] = useState([]);
  let [loading, setLoading] = useState(true);
  let nav = useNavigate();
  
  const ORANGE = "#F96424"; 

  useEffect(() => {
    doApi();
  }, []);

  const doApiDetails = async (_id) => {
    let url = "/users/single/" + _id;
    try {
      let data = await doApiGet(url);
      setName(data.data.fullName);
    } catch (error) {
      console.log(error);
      setName("Unknown Client");
    }
  };

  const doApi = async () => {
    let idBody = { "idQuestions": ThisID }
    let tempAr = [];
    try {
      let resData = await doApiMethod("/questions/thisQuestion", "PUT", idBody);

      let data = resData.data;
      if (!data) {
          setLoading(false);
          return;
      }
      
      // משיכת פרטי המשתמש
      doApiDetails(data.userId);

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
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleDownload = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(22);
    pdf.setTextColor(249, 100, 36); // Orange
    pdf.setFont("helvetica", "bold");
    pdf.text("Medical Assessment Report", pageWidth / 2, 20, { align: "center" });

    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Client Name: ${name}`, 20, 35);
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

    pdf.save(`Assessment_${name.replace(/\s+/g, '_')}.pdf`);
  };

  // --- STYLES (זהים לדף הלקוח) ---
  const styles = {
    fullWidthHeader: {
        background: `linear-gradient(135deg, ${ORANGE} 0%, #FF7F45 100%)`, 
        width: '100%',
        padding: '40px 0',
        flexShrink: 0,
        boxShadow: '0 4px 20px rgba(249, 100, 36, 0.15)'
    },
    headerContent: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    questionCard: {
        padding: '25px 0',
        borderBottom: '1px solid #f0f0f0'
    },
    downloadBtnWhite: {
        backgroundColor: 'white',
        color: ORANGE,
        border: 'none',
        borderRadius: '50px',
        padding: '12px 28px',
        fontSize: '0.95rem',
        fontWeight: '600',
        display: 'flex', alignItems: 'center', gap: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
    },
    exitButton: {
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "50px",
        padding: "8px 20px",
        color: "#6B7280",
        fontWeight: "600",
        fontSize: "0.9rem",
        display: "flex", alignItems: "center", gap: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    }
  };

  return (
    <div className="vh-100 bg-white d-flex flex-column page-wrapper overflow-hidden">
        
        {/* CSS לגלילה */}
        <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 10px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #F1F1F1; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #A0A0A0; border-radius: 10px; border: 2px solid #F1F1F1; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #707070; }
        `}</style>

        {/* Navbar */}
        <nav className="d-flex align-items-center px-4 py-3 flex-shrink-0 justify-content-between border-bottom">
            <div className="d-flex align-items-center gap-2">
                <img src={thisIcon} alt="Logo" width="35" className="opacity-75" />
                <span className="logo-text" style={{ fontSize: '1.8rem' }}>Fitwave.ai <span style={{fontSize:'0.9rem', color:'#999', fontWeight:'normal'}}>| Admin</span></span>
            </div>
            
            <button 
                onClick={() => nav("/admin")} 
                style={styles.exitButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
                <ArrowLeftIcon /> Back to Dashboard
            </button>
        </nav>

        {/* Orange Header */}
        <div style={styles.fullWidthHeader}>
            <div style={styles.headerContent}>
                <div>
                    <div className="text-uppercase fw-bold text-white-50 small mb-1" style={{letterSpacing: '1.5px', fontSize:'0.75rem'}}>Admin View</div>
                    <h1 className="fw-bold mb-3 font-outfit text-white" style={{ fontSize: '2.2rem' }}>Client Assessment</h1>
                    
                    <div className="d-flex align-items-center gap-4 text-white-50" style={{fontSize: '0.95rem'}}>
                        <div className="d-flex align-items-center gap-2">
                            <UserIconWhite /> <span className="fw-medium text-white">{name}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <CalendarIconWhite /> <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                <div className="d-none d-md-block">
                     <button 
                        onClick={handleDownload} 
                        style={styles.downloadBtnWhite}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <DownloadIcon /> Export PDF
                    </button>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 d-flex justify-content-center w-100 overflow-hidden">
            <div className="w-100 h-100 d-flex flex-column" style={{ maxWidth: '900px' }}>
                
                <div className="flex-grow-1 custom-scrollbar px-4 bg-white" style={{ overflowY: 'auto' }}>
                    {loading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center h-50 pb-5">
                            <Spinner />
                            <span className="mt-3 text-muted fw-medium font-inter">Loading Data...</span>
                        </div>
                    ) : ar.length > 0 ? (
                        <div className="pb-5 pt-3">
                            {ar.map((item, index) => (
                                <div key={index} style={styles.questionCard}>
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                                        <div style={{flex: 1}}>
                                            <div className="mb-1 text-muted small fw-bold font-outfit" style={{color: ORANGE}}>QUESTION {index + 1}</div>
                                            <div className="fw-medium text-dark mb-2" style={{fontSize: '1.1rem', lineHeight:'1.4'}}>
                                                {item.question}
                                            </div>
                                        </div>
                                        <div style={{flex: 1, width: '100%'}}>
                                            <div className="p-3 rounded-3 bg-light border-start border-4" style={{borderColor: ORANGE}}>
                                                <span className="fw-bold text-dark font-inter" style={{fontSize: '1rem'}}>
                                                    {item.answer}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="d-flex flex-column align-items-center justify-content-center h-100 pb-5 text-center">
                            <div className="mb-3 text-muted" style={{opacity: 0.3}}><FileTextIcon /></div>
                            <h4 className="fw-bold text-dark">No Data Found</h4>
                            <p className="text-muted">No answers recorded for this user.</p>
                        </div>
                    )}
                </div>

                {/* Mobile Download Button */}
                <div className="d-md-none p-3 bg-white border-top flex-shrink-0">
                    <button 
                        onClick={handleDownload} 
                        style={{...styles.downloadBtnWhite, width: '100%', justifyContent: 'center', backgroundColor: ORANGE, color: 'white'}}
                    >
                        <DownloadIcon /> Export PDF
                    </button>
                </div>

            </div>
        </div>
    </div>
  );
}

export default OutComeAdmin;