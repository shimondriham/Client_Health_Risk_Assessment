import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/react.svg'; 

// --- Icons ---
const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F96424" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{minWidth:'20px', marginTop:'2px'}}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const ArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export default function HStatement() {
  const [confirmed, setConfirmed] = useState(false);
  let nav = useNavigate();
  const ORANGE = "#F96424"; 

  const CalibrationVideo = () => {
    nav("/CalibrationVideo");
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  return (
    <>
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
        
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        `}
    </style>

    {/* מיכל ראשי - רקע אפור בהיר יוקרתי */}
    <div className="vh-100 bg-light d-flex flex-column font-inter text-dark overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
      
      {/* 1. Navbar */}
      <nav className="d-flex align-items-center justify-content-between px-4 bg-white border-bottom" style={{ height: '70px', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo" width="24" />
            <span className="font-outfit fw-bold" style={{fontSize: '1.1rem', color: '#333'}}>Fitwave.ai</span>
        </div>
        <span 
            onClick={goBackHome} 
            className="text-secondary small font-outfit fw-bold" 
            style={{cursor: 'pointer', fontSize: '0.85rem'}}
        >
            EXIT
        </span>
      </nav>

      {/* 2. תוכן מרכזי */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-3">
        <div className="w-100 d-flex flex-column align-items-center" style={{ maxWidth: '700px' }}>
            
            {/* כותרת */}
            <div className="text-center mb-4">
                <h2 className="mb-2 font-outfit" style={{ fontSize: '2rem', fontWeight: '600', color: '#111' }}>
                    Health Declaration
                </h2>
                <p className="text-muted font-inter m-0" style={{fontWeight: '400', fontSize: '1rem'}}>
                    Please confirm the following statements to proceed.
                </p>
            </div>

            {/* רשימת הצהרות - כרטיס לבן נקי */}
            <div 
                className="w-100 bg-white rounded-4 p-4 mb-4 shadow-sm border border-light" 
                style={{ fontSize: '1rem', fontWeight: '400', lineHeight: '1.6', color: '#333' }}
            >
                <div className="d-flex gap-3 mb-3">
                    <CheckIcon />
                    <span>I am feeling well and in suitable condition to participate in this assessment/activity.</span>
                </div>
                <div className="d-flex gap-3 mb-3">
                    <CheckIcon />
                    <span>To the best of my knowledge, I have no medical condition or limitation that prevents participation.</span>
                </div>
                <div className="d-flex gap-3 mb-3">
                    <CheckIcon />
                    <span>If I experience discomfort, pain, or fatigue during the activity, I will stop and notify the relevant party.</span>
                </div>
                <div className="d-flex gap-3">
                    <CheckIcon />
                    <span>I understand that this assessment is not a substitute for professional medical advice, and I take personal responsibility for my participation.</span>
                </div>
            </div>

            {/* צ'ק בוקס לאישור */}
            <div 
                className="d-flex align-items-center justify-content-center gap-2 mb-4 cursor-pointer user-select-none" 
                onClick={() => setConfirmed(!confirmed)}
                style={{ cursor: 'pointer' }}
            >
                <div 
                    style={{
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '6px', 
                        border: confirmed ? `none` : '2px solid #ccc',
                        backgroundColor: confirmed ? ORANGE : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                >
                    {confirmed && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    )}
                </div>
                <span className="font-outfit" style={{ fontSize: '1rem', fontWeight: '500', color: confirmed ? '#333' : '#666' }}>
                    I confirm the health declaration and wish to continue
                </span>
            </div>

            {/* כפתור אישור */}
            <div style={{ height: '50px' }}> 
                {confirmed && (
                    <button 
                        onClick={CalibrationVideo} 
                        className="btn text-white px-5 rounded-pill shadow-none animate__animated animate__fadeIn font-outfit"
                        style={{ 
                            backgroundColor: ORANGE, 
                            minWidth: '220px',
                            paddingTop: '12px',
                            paddingBottom: '12px',
                            fontSize: '1rem',
                            fontWeight: '500', 
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            margin: '0 auto'
                        }}
                    >
                        I Agree & Continue <ArrowRight />
                    </button>
                )}
            </div>

        </div>
      </div>
      
      {/* פוטר */}
      <div className="text-center py-3 text-muted font-inter" style={{fontSize: '0.8rem', fontWeight: '400'}}>
        © Fitwave.ai 2026
      </div>

    </div>
    </>
  );
}