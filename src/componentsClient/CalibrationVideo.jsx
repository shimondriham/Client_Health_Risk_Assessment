import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/react.svg'; 

function CalibrationVideo() {
  const nav = useNavigate();
  const ORANGE = "#F96424"; 

  const NextPage = () => {
    nav("/Calibration");
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  return (
    <>
    {/* ייבוא הפונטים (בדיוק כמו בדף הקודם) */}
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        `}
    </style>

    {/* מיכל ראשי - 100vh ללא גלילה */}
    <div className="vh-100 bg-white d-flex flex-column font-inter text-dark overflow-hidden">
      
      {/* Navbar */}
      <nav className="d-flex align-items-center px-4 py-3" style={{ height: '70px', flexShrink: 0 }}>
        <img src={logo} alt="Logo" width="22" className="opacity-75" />
        <span className="ms-2 font-outfit fw-bold" style={{fontSize: '1.1rem', color: '#333'}}>Fitwave.ai</span>
        
        <span 
            onClick={goBackHome} 
            className="ms-auto text-muted small font-outfit fw-normal" 
            style={{cursor: 'pointer', fontSize: '0.85rem'}}
        >
            Exit to Home
        </span>
      </nav>

      {/* תוכן מרכזי - ממורכז למסך */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-3">
        <div className="w-100 d-flex flex-column align-items-center" style={{ maxWidth: '900px' }}>
            
            {/* כותרת - פונט Outfit */}
            <div className="text-center mb-4">
                <h2 className="mb-1 font-outfit" style={{ fontSize: '2rem', fontWeight: '600', color: '#111' }}>
                    Calibration Video
                </h2>
                <p className="text-muted font-inter m-0" style={{fontWeight: '400', fontSize: '1rem'}}>
                    Follow the steps to calibrate your camera
                </p>
            </div>

            {/* נגן וידאו - פרופורציונלי וללא שוליים שחורים */}
            <div 
                className="w-100 rounded-4 overflow-hidden shadow-sm position-relative mb-4" 
                style={{ 
                    maxWidth: '100%',
                    aspectRatio: '16/9', // יחס תמונה קולנועי
                    maxHeight: '60vh',   // לא משתלט על כל המסך
                    backgroundColor: 'black'
                }}
            >
                <video
                    controls
                    className="w-100 h-100"
                    style={{ 
                        objectFit: 'cover', // הטריק שמעלים פסים שחורים
                        display: 'block'
                    }} 
                    id="calibrationVideo"
                >
                    <source src="/videos/121212.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* כפתור - פונט Outfit */}
            <div className="text-center">
                <button 
                    id="calNextButton" 
                    onClick={NextPage}
                    className="btn text-white px-5 rounded-pill shadow-none font-outfit"
                    style={{ 
                        backgroundColor: ORANGE, 
                        minWidth: '200px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        fontSize: '1rem',
                        fontWeight: '500', 
                        letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    Next Step
                </button>
            </div>

        </div>
      </div>
      
      {/* פוטר */}
      <div className="text-center py-3 text-muted font-inter" style={{fontSize: '0.75rem', fontWeight: '400'}}>
        © Fitwave.ai 2026
      </div>

    </div>
    </>
  );
}

export default CalibrationVideo;