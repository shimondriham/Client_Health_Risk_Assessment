import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import thisIcon from '../assets/icon.png'; 
const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;

// --- Icons ---
const CheckIconOrange = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F96424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{minWidth:'22px'}}>
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

// אייקון וי לבן לצ'קבוקס המסומן
const WhiteCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

function CalibrationVideo() {
  const [confirmed, setConfirmed] = useState(false);
  const nav = useNavigate();
  
  const ORANGE = "#F96424";
  const brandDark = "#1a1a1a";

  const NextPage = () => {
    // if (confirmed) {
        nav("/Calibration"); // המעבר לדף הבא
    // }
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  // --- Styles (זהה ל-HStatement) ---
  const styles = {
      pageWrapper: {
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Inter', sans-serif"
      },
      declarationCard: {
          backgroundColor: '#fff',
          borderRadius: '20px',
          border: '1px solid #f0f0f0',
          padding: '30px 40px',
          maxWidth: '700px',
          width: '95%',
          boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
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
          cursor: "pointer",
          transition: "all 0.2s ease"
      },
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

  // --- תוכן ההוראות המקצועי ---
  const instructionsList = [
      "Ensure your device has a functional camera and the lens is clean for accurate motion detection.",
      "Clear a space of at least 3 meters (approx. 10 feet) from the camera. Ensure the area is well-lit and free of obstacles blocking your full body view.",
      "Verify that you have a stable and strong internet connection to prevent interruptions during the analysis."
  ];

  return (
    <div style={styles.pageWrapper}>
      
      {/* 1. Navbar */}
      <nav className="d-flex align-items-center justify-content-between px-4 py-3 flex-shrink-0">
        <div className="d-flex align-items-center gap-2">
            <img src={thisIcon} alt="Logo" width="35" className="opacity-75" />
            <span style={{ fontSize: '2rem', fontFamily: "'Oooh Baby', cursive", lineHeight: 1, color: brandDark }}>Fitwave.ai</span>
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
             <div className="text-uppercase fw-bold text-muted small mb-1" style={{letterSpacing: '1px', fontSize: '0.75rem'}}>Pre-Assessment Checklist</div>
             <h1 className="fw-bold mb-1" style={{ fontSize: '2.2rem', color: brandDark }}>Setup Instructions</h1>
             <p className="text-muted m-0" style={{maxWidth: '500px', margin: '0 auto', fontSize: '0.95rem'}}>
                 Please verify the following conditions before starting.
             </p>
        </div>

        {/* כרטיס ההוראות */}
        <div style={styles.declarationCard}>
            
            <div className="d-flex flex-column gap-4">
                {instructionsList.map((text, i) => (
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
                {/* <div 
                    onClick={() => setConfirmed(!confirmed)}
                    className="d-flex align-items-center gap-2 p-1 rounded-3 user-select-none"
                    style={{ cursor: 'pointer' }}
                >
                    <div style={styles.checkboxBox(confirmed)}>
                        {confirmed && <WhiteCheck />}
                    </div>
                    <span className="fw-bold" style={{ fontSize: '1rem', color: '#111' }}>
                        I confirm the environment is ready
                    </span>
                </div> */}

                {/* Submit Button */}
<button
  onClick={NextPage}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
  className="btn btn-lg px-5 py-3 rounded-pill btn-brand-orange"
  style={{ 
    transition: 'transform 0.2s ease',
    minWidth: '240px',
    fontSize: '1.2rem',
  }}
>
  Start Calibration <ArrowRight />
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

export default CalibrationVideo;