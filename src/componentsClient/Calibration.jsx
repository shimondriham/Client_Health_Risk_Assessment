import React from 'react';
import { useNavigate } from 'react-router-dom';
import CameraComponent from './cameraComponent.jsx';
import reactIcon from '../assets/react.svg'; 

function Calibration() {
  const nav = useNavigate();

  const handleNext = () => {
    nav("/h_statement"); 
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  return (
    <div className="vh-100 bg-white d-flex flex-column page-wrapper overflow-hidden">
      
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column align-items-center p-3" style={{ minHeight: 0 }}>
        
        <div className="text-center mb-3 flex-shrink-0">
            <h2 className="mb-1" style={{ fontSize: '2rem', fontWeight: '500' }}>
                System Check
            </h2>
            <p className="text-secondary m-0">
                Ensure your whole body is visible in the frame
            </p>
        </div>

        {/* Camera Wrapper */}
        <div 
            className="camera-wrapper w-100 rounded-4 overflow-hidden bg-black mb-4 shadow-sm"
            style={{ 
                flex: '1 1 auto', 
                maxWidth: '900px',
                maxHeight: '55vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #eee'
            }}
        >
            <CameraComponent />
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 pb-2">
            <button 
                onClick={handleNext}
                className="btn btn-lg px-5 py-3 rounded-pill btn-brand-orange"
                style={{ 
                    minWidth: '240px',
                    fontSize: '1.2rem',
                }}
            >
                Start Analysis
            </button>
        </div>

      </div>
      
      {/* Footer */}
      <div className="text-center py-2 text-muted small flex-shrink-0">
        FitWave AI © 2026
      </div>

    </div>
  );
}

export default Calibration;