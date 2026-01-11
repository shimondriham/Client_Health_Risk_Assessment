import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import thisIcon from '../assets/icon.png'; 

const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;

const ArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

// --- Specific Instructions Icons (Orange) ---
const iconStyle = { minWidth: '24px' };
const ORANGE_COLOR = "#F96424";

const CameraIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ORANGE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

const DistanceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ORANGE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
      <path d="M2 12h20"></path>
      <path d="M2 12l5 5"></path>
      <path d="M2 12l5-5"></path>
      <path d="M22 12l-5 5"></path>
      <path d="M22 12l-5-5"></path>
    </svg>
);

const WifiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ORANGE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
      <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
      <line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
);


function CalibrationVideo() {
  const [confirmed, setConfirmed] = useState(false);
  const nav = useNavigate();
  
  const ORANGE = "#F96424";
  const brandDark = "#1a1a1a";

  const NextPage = () => {
        nav("/Calibration"); 
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  // --- Styles ---
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
      }
  };

  const instructionsList = [
      {
          icon: <CameraIcon />,
          text: "Ensure your device has a functional camera and the lens is clean for accurate motion detection."
      },
      {
          icon: <DistanceIcon />,
          text: "Clear a space of at least 3 meters (approx. 10 feet) from the camera. Ensure the area is well-lit."
      },
      {
          icon: <WifiIcon />,
          text: "Verify that you have a stable and strong internet connection to prevent interruptions."
      }
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
                {/* לולאה שעוברת על האובייקטים החדשים */}
                {instructionsList.map((item, i) => (
                    <div className="d-flex gap-3 align-items-start" key={i}>
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                            {/* רינדור האייקון הספציפי */}
                            {item.icon}
                        </div>
                        <span style={{ fontSize: '1rem', color: '#333', lineHeight: '1.5' }}>{item.text}</span>
                    </div>
                ))}
            </div>

            <hr className="my-4" style={{opacity: 0.1}}/>

            {/* אזור הכפתור */}
            <div className="d-flex flex-column align-items-center gap-3">
                
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