import React from 'react';
import { useNavigate } from 'react-router-dom';
import CameraComponent from './cameraComponent.jsx';

function Calibration() {
  const nav = useNavigate();
  const ORANGE = "#F96424"; 

  const handleNext = () => {
    nav("/homeClient"); 
  };

  return (
    <div className="vh-100 vw-100 bg-light d-flex align-items-center justify-content-center overflow-hidden font-sans text-dark">
      
      {/* הזרקת עיצוב ספציפי כדי למתוח את הוידאו בתוך הקומפוננטה */}
      <style>
        {`
          .camera-wrapper video, .camera-wrapper canvas {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
        `}
      </style>

      <div 
        className="bg-white p-4 text-center shadow-sm d-flex flex-column align-items-center" 
        style={{ 
            width: '90%',        
            maxWidth: '1000px',  
            height: '90vh',      
            borderRadius: '24px'
        }}
      >
        
        {/* כותרת */}
        <div style={{ flexShrink: 0 }}>
            <h2 className="mb-2" style={{ fontWeight: '300', fontSize: '2rem', letterSpacing: '-0.5px' }}>
                Media Device Check
            </h2>
            <p className="text-muted small mb-3" style={{ fontWeight: '300' }}>
                Ensure your camera is positioned correctly
            </p>
        </div>

        {/* אזור המצלמה
            1. camera-wrapper: מחלקה שנועדה ל-CSS למעלה
            2. bg-light: במקום שחור, כדי שלא יהיו פסים שחורים
            3. width: 100% כדי למלא את הרוחב
        */}
        <div 
            className="camera-wrapper w-100 bg-light rounded-4 overflow-hidden mb-3 position-relative d-flex align-items-center justify-content-center" 
            style={{ 
                flex: 1, 
                minHeight: 0
            }}
        >
          <CameraComponent />
        </div>

        {/* כפתור */}
        <div style={{ flexShrink: 0 }}>
            <button 
                className="btn text-white rounded-pill px-5 py-2 shadow-none"
                onClick={handleNext}
                style={{ 
                    backgroundColor: ORANGE,
                    border: 'none',
                    fontWeight: '500', 
                    letterSpacing: '0.5px',
                    minWidth: '160px'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
                Next Step
            </button>
        </div>

      </div>
    </div>
  )
}

export default Calibration;