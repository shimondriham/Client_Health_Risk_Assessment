import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import reactIcon from '../assets/react.svg'; 

// --- Icons (מותאמים לצבע המותג) ---
const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F96424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{minWidth:'24px'}}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const ArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export default function HStatement() {
  const [confirmed, setConfirmed] = useState(false);
  const nav = useNavigate();
  const ORANGE = "#F96424"; 

  const CalibrationVideo = () => {
    nav("/CalibrationVideo");
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  return (
    /* שימוש במחלקת העל page-wrapper לעיצוב אחיד */
    <div className="vh-100 bg-white d-flex flex-column page-wrapper overflow-hidden">
      
      {/* 1. Navbar - אחיד לכל הדפים */}
      <nav className="d-flex align-items-center justify-content-between px-4 py-2 flex-shrink-0" style={{ height: '70px', padding: '5px 0' }}>
        <div className="d-flex align-items-center gap-2">
            <img src={reactIcon} alt="Logo" width="22" className="logo-icon opacity-75" />
            <span className="logo-text" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
        </div>
        
        <div onClick={goBackHome} className="btn-exit d-flex align-items-center gap-2">
            <span>Exit to Home</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </div>
      </nav>

      {/* 2. תוכן מרכזי */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-3 overflow-auto">
        <div className="w-100 d-flex flex-column align-items-center" style={{ maxWidth: '800px' }}>
            
            {/* כותרת */}
            <div className="text-center mb-5">
                <h2 className="mb-2" style={{ fontSize: '2.5rem', fontWeight: '500' }}>
                    Health Declaration
                </h2>
                <p className="text-secondary m-0" style={{ fontSize: '1.1rem' }}>
                    Please confirm the following statements to proceed.
                </p>
            </div>

            {/* כרטיס הצהרות - נקי ומודרני */}
            <div 
                className="w-100 bg-white rounded-4 p-4 p-md-5 mb-5 shadow-sm" 
                style={{ 
                    border: '1px solid #f0f0f0',
                    fontSize: '1.1rem', 
                    fontWeight: '400', 
                    lineHeight: '1.6', 
                    color: '#333' 
                }}
            >
                {[
                    "I am feeling well and in suitable condition to participate in this assessment.",
                    "To the best of my knowledge, I have no medical condition that prevents participation.",
                    "If I experience discomfort, pain, or fatigue, I will stop immediately.",
                    "I understand this assessment is not a substitute for professional medical advice."
                ].map((text, i) => (
                    <div className="d-flex gap-3 mb-4 last:mb-0" key={i}>
                        <div style={{ marginTop: '2px' }}><CheckIcon /></div>
                        <span>{text}</span>
                    </div>
                ))}
            </div>

            {/* צ'ק בוקס לאישור */}
            <div 
                className="d-flex align-items-center justify-content-center gap-3 mb-4 cursor-pointer user-select-none" 
                onClick={() => setConfirmed(!confirmed)}
                style={{ cursor: 'pointer' }}
            >
                <div 
                    style={{
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '8px', 
                        border: confirmed ? `none` : '2px solid #e0e0e0',
                        backgroundColor: confirmed ? ORANGE : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        boxShadow: confirmed ? '0 4px 10px rgba(249, 100, 36, 0.3)' : 'none'
                    }}
                >
                    {confirmed && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    )}
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: '500', color: confirmed ? '#1a1a1a' : '#666' }}>
                    I confirm the health declaration
                </span>
            </div>

            {/* כפתור אישור (נעלם ומופיע) */}
            <div style={{ height: '60px', opacity: confirmed ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: confirmed ? 'auto' : 'none' }}> 
                <button 
                    onClick={CalibrationVideo} 
                    className="btn-brand-orange d-flex align-items-center gap-2"
                >
                    I Agree & Continue <ArrowRight />
                </button>
            </div>

        </div>
      </div>
      
      {/* פוטר */}
      <div className="text-center py-3 text-muted small flex-shrink-0">
        FitWave AI © 2026
      </div>

    </div>
  );
}