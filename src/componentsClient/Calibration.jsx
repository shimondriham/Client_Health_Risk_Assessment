import React from 'react';
import { useNavigate } from 'react-router-dom';
import CameraComponent from './cameraComponent.jsx';
import logo from '../assets/react.svg'; 

function Calibration() {
  const nav = useNavigate();
  const ORANGE = "#F96424"; 

  // תיקון הניתוב לשם המדויק שביקשת
  const handleNext = () => {
    nav("/h_statement"); 
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  return (
    <>
    {/* 1. ייבוא הפונטים והגדרות CSS למתיחת הוידאו */}
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }

        /* קריטי: מתיחת הוידאו בתוך הקומפוננטה */
        .camera-wrapper video, .camera-wrapper canvas {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 16px; /* עיגול פינות לוידאו */
        }
        `}
    </style>

    {/* מיכל ראשי - 100vh ללא גלילה, רקע נקי */}
    <div className="vh-100 d-flex flex-column font-inter text-dark overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
      
      {/* 2. Navbar - אחיד לשאר האפליקציה */}
      <nav className="d-flex align-items-center justify-content-between px-4 bg-white" style={{ height: '70px', flexShrink: 0, borderBottom: '1px solid #E5E7EB' }}>
        <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo" width="24" />
            <span className="font-outfit fw-bold" style={{fontSize: '1.1rem', color: '#111'}}>Fitwave.ai</span>
        </div>
        <span 
            onClick={goBackHome} 
            className="text-secondary small font-outfit fw-bold" 
            style={{cursor: 'pointer', letterSpacing: '0.5px', fontSize: '0.85rem'}}
        >
            EXIT
        </span>
      </nav>

      {/* 3. תוכן מרכזי */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-3 overflow-hidden">
        <div className="w-100 h-100 d-flex flex-column align-items-center" style={{ maxWidth: '1000px' }}>
            
            {/* כותרת */}
            <div className="text-center mb-3 flex-shrink-0">
                <h2 className="mb-1 font-outfit" style={{ fontSize: '1.8rem', fontWeight: '600', color: '#111' }}>
                    System Check
                </h2>
                <p className="text-muted font-inter m-0" style={{fontWeight: '400', fontSize: '1rem'}}>
                    Ensure your whole body is visible in the frame
                </p>
            </div>

            {/* אזור המצלמה - תופס את כל הגובה הפנוי */}
            <div 
                className="camera-wrapper w-100 bg-black rounded-4 overflow-hidden shadow-sm position-relative d-flex align-items-center justify-content-center" 
                style={{ 
                    flex: 1,           // נמתח לגובה
                    minHeight: '0',    // מונע חריגה
                    width: '100%',
                    border: '4px solid white', // מסגרת לבנה יוקרתית
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                }}
            >
                <CameraComponent />
            </div>

        </div>
      </div>

      {/* 4. Footer - כפתור הפעולה */}
      <div className="d-flex align-items-center justify-content-center bg-white border-top px-4" style={{ height: '90px', flexShrink: 0, zIndex: 10 }}>
            <button 
                onClick={handleNext}
                className="btn text-white px-5 rounded-pill shadow-none font-outfit"
                style={{ 
                    backgroundColor: ORANGE, 
                    minWidth: '220px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    fontSize: '1rem',
                    fontWeight: '600', 
                    letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
                Start Analysis
            </button>
      </div>

    </div>
    </>
  )
}

export default Calibration;