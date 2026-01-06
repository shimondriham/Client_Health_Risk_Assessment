import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import thisIcon from '../assets/icon.png'; 
const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
// --- Icons ---
const CheckIconOrange = () => (
    <svg width="35" height="22" viewBox="0 0 24 24" fill="none" stroke="#F96424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{minWidth:'22px'}}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const ArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default function HStatement() {
  const [confirmed, setConfirmed] = useState(false);
  const nav = useNavigate();
  const ORANGE = "#F96424"; 

  // פונקציית המעבר לדף הבא
  const handleContinue = () => {
    if (confirmed) {
        nav("/calibrationVideo");
    }
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  // --- Styles ---
  const styles = {
      // מיכל ראשי - ללא גלילה הצידה וללא גלילה למטה
      pageWrapper: {
          height: '100vh',
          width: '100%', 
          overflow: 'hidden', 
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column'
      },
      // כרטיס ההצהרה
      declarationCard: {
          backgroundColor: '#fff',
          borderRadius: '20px',
          border: '1px solid #f0f0f0',
          padding: '30px 40px',
          maxWidth: '700px',
          width: '95%',
          boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
      },
      // כפתור יציאה
      exitButton: {
          backgroundColor: "white",
          border: "1px solid #E5E7EB",
          borderRadius: "50px",
          padding: "8px 20px",
          color: "#6B7280",
          fontWeight: "600",
          fontSize: "0.9rem",
          display: "flex", alignItems: "center", gap: '8px',
          cursor: "pointer",
          transition: "all 0.2s ease"
      },
      // כפתור אישור ראשי
      submitBtn: (isActive) => ({
          backgroundColor: isActive ? ORANGE : '#e9ecef',
          color: isActive ? 'white' : '#adb5bd',
          border: 'none',
          padding: '12px 32px',
          borderRadius: '50px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: isActive ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          boxShadow: isActive ? '0 4px 15px rgba(249, 100, 36, 0.3)' : 'none',
          display: 'flex', alignItems: 'center', gap: '10px'
      }),
      checkboxBox: (isActive) => ({
          width: '24px', height: '24px',
          borderRadius: '6px',
          border: isActive ? `none` : '2px solid #ced4da',
          backgroundColor: isActive ? ORANGE : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0
      })
  };

  return (
    <div style={styles.pageWrapper} className="font-inter">
      
      {/* 1. Navbar */}
      <nav className="d-flex align-items-center justify-content-between px-4 py-3 flex-shrink-0">
        <div className="d-flex align-items-center gap-2">
            <img src={thisIcon} alt="Logo" width="35" className="opacity-75" />
            <span className="logo-text" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
        </div>
        <button 
                    onClick={() => nav("/HomeClient")} 
                    style={styles.exitButton}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                    <HomeIcon /> Home
                </button>
      </nav>

      {/* 2. Main Content */}
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-3">
        
        {/* כותרת */}
        <div className="text-center mb-4">
             <div className="text-uppercase fw-bold text-muted small mb-1" style={{letterSpacing: '1px', fontSize: '0.75rem'}}>Safety First</div>
             <h1 className="fw-bold text-dark mb-1" style={{ fontSize: '2.2rem' }}>Health Declaration</h1>
             <p className="text-muted m-0" style={{maxWidth: '500px', margin: '0 auto', fontSize: '0.95rem'}}>
                 Please confirm the statements below to proceed.
             </p>
        </div>

        {/* הכרטיס המרכזי */}
        <div style={styles.declarationCard}>
            
            <div className="d-flex flex-column gap-3">
                {[
                    "I confirm that all information I have provided so far is complete, accurate, and truthful to the best of my knowledge, and I have not withheld any medical information that could affect my participation in this assessment.",
                    "I declare that my current health permits me to perform minimal movements and basic physical actions required during the on-camera assessment; I will stop immediately if I experience pain, dizziness, shortness of breath, or any other discomfort."
                ].map((text, i) => (
                    <div className="d-flex gap-3 align-items-start" key={i}>
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                            <CheckIconOrange />
                        </div>
                        <span style={{ fontSize: '1rem', color: '#333', lineHeight: '1.4' }}>{text}</span>
                    </div>
                ))}
            </div>

            <hr className="my-4" style={{opacity: 0.1}}/>

            {/* אזור האישור והכפתור */}
            <div className="d-flex flex-column align-items-center gap-3">
                
                {/* Checkbox Line */}
                <div 
                    onClick={() => setConfirmed(!confirmed)}
                    className="d-flex align-items-center gap-2 p-1 rounded-3 user-select-none"
                    style={{ cursor: 'pointer' }}
                >
                    <div style={styles.checkboxBox(confirmed)}>
                        {confirmed && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        )}
                    </div>
                    <span className="fw-bold" style={{ fontSize: '1rem', color: '#111' }}>
                        I have read and confirm my information is accurate and that I can perform minimal on-camera movements.
                    </span>
                </div>

                {/* Submit Button - מפנה ל-biomechanicalAss */}
                <button 
                    onClick={handleContinue} 
                    disabled={!confirmed}
                    style={styles.submitBtn(confirmed)}
                    onMouseOver={(e) => { if(confirmed) e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseOut={(e) => { if(confirmed) e.currentTarget.style.transform = 'translateY(0)' }}
                >
                    I Agree & Continue <ArrowRight />
                </button>

            </div>

        </div>

      </div>
      
      {/* Footer */}
      <div className="text-center py-3 text-muted small opacity-50 flex-shrink-0" style={{fontSize: '0.8rem'}}>
        FitWave AI © 2026 • Secure Assessment
      </div>

    </div>
  );
}