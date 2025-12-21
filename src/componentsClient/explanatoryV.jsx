import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/react.svg'; 

function ExplanatoryV() {
  const nav = useNavigate();
  const ORANGE = "#F96424"; 

  const NextPage = () => {
    nav("/healthForm");
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  return (
    // מיכל ראשי - ללא גלילה, רקע לבן, פונט דק
    <div className="vh-100 bg-white d-flex flex-column font-sans text-dark overflow-hidden">
      
      {/* 1. Navbar נקי ודק */}
      <nav className="d-flex align-items-center px-4 py-3" style={{ height: '60px', flexShrink: 0 }}>
        <img src={logo} alt="Logo" width="22" className="opacity-75" />
        <span className="ms-2 fw-normal fst-italic" style={{fontSize: '1rem', color: '#333'}}>Fitwave.ai</span>
        
        {/* כפתור יציאה דק */}
        <span 
            onClick={goBackHome} 
            className="ms-auto text-muted small" 
            style={{cursor: 'pointer', fontSize: '0.85rem', fontWeight: '300'}}
        >
            Exit to Home
        </span>
      </nav>

      {/* 2. תוכן מרכזי */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-3">
        <div className="w-100 d-flex flex-column align-items-center" style={{ maxWidth: '900px' }}>
            
            {/* כותרת דקה ונקייה */}
            <div className="text-center mb-4">
                <h2 className="mb-1" style={{ fontSize: '2rem', fontWeight: '300', letterSpacing: '-0.5px' }}>
                    Explanatory Video
                </h2>
                <p className="text-muted small m-0" style={{fontWeight: '300'}}>
                    Please watch the instructions carefully
                </p>
            </div>

            {/* נגן וידאו "מלא" ללא שוליים שחורים:
               1. הסרתי את הרקע השחור (bg-black).
               2. השתמשתי ב-object-fit: cover כדי למלא את כל המקום.
               3. aspect-ratio: 16/9 שומר על פרופורציה רחבה קבועה.
            */}
            <div 
                className="w-100 rounded-4 overflow-hidden shadow-sm position-relative mb-5" 
                style={{ 
                    maxWidth: '100%',
                    aspectRatio: '16/9', // שומר על יחס רוחב-גובה קולנועי
                    maxHeight: '60vh',   // לא גבוה מידי
                }}
            >
                <video
                    controls
                    className="w-100 h-100"
                    style={{ 
                        objectFit: 'cover', // זה הסוד - ממלא את כל המסגרת בלי פסים שחורים
                        display: 'block'
                    }} 
                    id="explanatoryVideo"
                >
                    <source src="/videos/121212.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* כפתור פעולה דק */}
            <div className="text-center">
                <button 
                    id="nextButton" 
                    onClick={NextPage}
                    className="btn text-white px-5 rounded-pill shadow-none"
                    style={{ 
                        backgroundColor: ORANGE, 
                        minWidth: '180px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        fontSize: '0.95rem',
                        fontWeight: '500', // משקל בינוני-דק
                        letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    Start Assessment
                </button>
            </div>

        </div>
      </div>
      
      {/* פוטר */}
      <div className="text-center py-3 text-muted" style={{fontSize: '0.7rem', fontWeight: '300'}}>
        © Fitwave.ai 2026
      </div>

    </div>
  );
}

export default ExplanatoryV;