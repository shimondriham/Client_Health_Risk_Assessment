import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function HStatement() {
  const [confirmed, setConfirmed] = useState(false);
  let nav = useNavigate();

  const CalibrationVideo = () => {
    nav("/CalibrationVideo");
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  // --- Icons (Inline SVG to prevent errors) ---
  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2dce89" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{minWidth:'20px', marginTop:'3px'}}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  const ArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );

  // --- Styles ---
  const styles = {
    page: {
      minHeight: "100vh",
      position: "relative",
      backgroundColor: "#f8f9fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden", // Prevents scrollbars from the wave
      fontFamily: "system-ui, -apple-system, sans-serif"
    },
    wave: {
      position: "absolute",
      bottom: "-20%",
      right: "-10%",
      width: "120%",
      height: "70%",
      background: "linear-gradient(135deg, #7b68ee 0%, #ec4899 100%)",
      borderRadius: "100% 0 0 0 / 80% 0 0 0",
      zIndex: 0
    },
    backButton: {
      position: "absolute",
      top: "20px",
      right: "20px",
      zIndex: 10,
      background: "white",
      border: "1px solid #e9ecef",
      padding: "10px 20px",
      borderRadius: "50px",
      fontWeight: "600",
      fontSize: "0.85rem",
      color: "#495057",
      cursor: "pointer",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s"
    },
    card: {
      position: "relative",
      zIndex: 2,
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "3rem",
      width: "90%",
      maxWidth: "800px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      border: "1px solid rgba(0,0,0,0.02)"
    },
    listContainer: {
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "20px",
        border: "1px solid #e9ecef"
    },
    listItem: {
        display: "flex",
        gap: "15px",
        marginBottom: "15px",
        textAlign: "left",
        fontSize: "1rem",
        color: "#525f7f",
        lineHeight: "1.6"
    },
    checkboxContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        marginTop: "30px",
        cursor: "pointer",
        userSelect: "none"
    },
    gradientBtn: {
        background: "linear-gradient(90deg, #7b68ee 0%, #ec4899 100%)",
        border: "none",
        color: "white",
        padding: "12px 40px",
        fontSize: "1.1rem",
        fontWeight: "bold",
        borderRadius: "50px",
        marginTop: "20px",
        boxShadow: "0 4px 15px rgba(123, 104, 238, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        margin: "20px auto 0 auto" // Center the button
    }
  };

  return (
    <div style={styles.page}>
      
      {/* Background Graphic */}
      <div style={styles.wave}></div>

      {/* Top Right Back Button */}
      <button 
        style={styles.backButton} 
        onClick={goBackHome}
        onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
      >
        <HomeIcon /> BACK TO HOME
      </button>

      {/* Main Content Card */}
      <div style={styles.card}>
        
        {/* Header */}
        <div className="text-center mb-4">
            <h2 className="fw-bold mb-2" style={{color: '#32325d'}}>Health Declaration</h2>
            <p className="text-muted">Please confirm the following statements to proceed.</p>
        </div>

        {/* Styled List */}
        <div style={styles.listContainer}>
            <div style={styles.listItem}>
                <CheckIcon />
                <span>I am feeling well and in suitable condition to participate in this assessment/activity.</span>
            </div>
            <div style={styles.listItem}>
                <CheckIcon />
                <span>To the best of my knowledge, I have no medical condition or limitation that prevents participation.</span>
            </div>
            <div style={styles.listItem}>
                <CheckIcon />
                <span>If I experience discomfort, pain, or fatigue during the activity, I will stop and notify the relevant party.</span>
            </div>
            <div style={{...styles.listItem, marginBottom: 0}}>
                <CheckIcon />
                <span>I understand that this assessment is not a substitute for professional medical advice, and I take personal responsibility for my participation.</span>
            </div>
        </div>

        {/* Checkbox */}
        <div style={styles.checkboxContainer} onClick={() => setConfirmed(!confirmed)}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={() => {}} // Controlled by div click
            style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: '#7b68ee'}}
          />
          <span style={{fontWeight: '500', color: '#32325d'}}>I confirm the health declaration and wish to continue</span>
        </div>

        {/* Button (Conditional Render) */}
        {confirmed && (
            <div className="text-center">
                <button 
                    onClick={CalibrationVideo} 
                    style={styles.gradientBtn}
                >
                    Continue <ArrowRight />
                </button>
            </div>
        )}

      </div>
    </div>
  );
}