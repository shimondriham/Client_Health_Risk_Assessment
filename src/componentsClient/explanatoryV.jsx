import React from "react";
import { useNavigate } from "react-router-dom";
import thisIcon from "../assets/icon.png"; // וודא שהשם תואם לקובץ שלך
const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;

const styles = {
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
function ExplanatoryV() {
  const nav = useNavigate();

  // --- הגדרות צבעים ---
  const brandOrange = "#F96424";
  const brandDark = "#1a1a1a";

  const NextPage = () => {
    nav("/healthForm");
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  // --- CSS פנימי: עיצוב ואנימציות ---
  const styles =` 
      // /* ייבוא פונטים */
      // @import url('https://fonts.googleapis.com/css2?family=Oooh+Baby&family=Inter:wght@400;500;600&display=swap');

      // /* הגדרת הפונט הראשי */
      // page-wrapper {
      //     font-family: 'Swissintl', 'Inter', -apple-system, sans-serif !important;
      //     color: ${brandDark};
      // }

      // /* פונט לוגו */
      // logo-text {
      //     font-family: 'Oooh Baby', cursive !important;
      //     line-height: 1;
      //     color: ${brandDark};
      // }

      // /* --- כפתור משודרג עם הנפשה --- */
      // btn-brand-orange {
      //     background-color: ${brandOrange};
      //     color: white;
      //     border: none;
      //     font-weight: 500;
      //     letter-spacing: 0.5px;
      //     box-shadow: 0 4px 10px rgba(249, 100, 36, 0.3);
      //     transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      // }
      
      // btn-brand-orange:hover {
      //     background-color: #ff7b42;
      //     transform: translateY(-4px);
      //     box-shadow: 0 10px 20px rgba(249, 100, 36, 0.4);
      // }
      
      // btn-brand-orange:active {
      //     transform: translateY(-1px);
      //     box-shadow: 0 5px 10px rgba(249, 100, 36, 0.3);
      // }

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
    `
  ;

  return (
    <>
      <style>{styles}</style>

      <div
        className="vh-100 d-flex flex-column font-inter text-dark overflow-hidden"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        {/* --- HEADER --- */}
        <nav
          className="px-4 py-2 d-flex align-items-center justify-content-between bg-white"
          style={{
            height: "65px",
            flexShrink: 0,
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <div className="top-nav" style={{ padding: "5px 0" }}>
            <img
              src={thisIcon}
              alt="Logo"
              width="35"
              className="logo-icon opacity-75"
            />
            <span className="logo-text" style={{ fontSize: "2rem" }}>
              Fitwave.ai
            </span>
          </div>

          {/* כפתור היציאה נשאר בצד ימין */}
           <button 
                    onClick={() => nav("/HomeClient")} 
                    style={styles.exitButton}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                    <HomeIcon /> Home
                </button>
        </nav>

        {/* תוכן מרכזי */}
        <div
          className="flex-grow-1 d-flex flex-column align-items-center p-3"
          style={{ minHeight: 0 }}
        >
          {/* כותרת */}
          <div className="text-center mb-3 flex-shrink-0">
            <h2
              className="mb-1"
              style={{ fontSize: "2rem", fontWeight: "500" }}
            >
              How it works
            </h2>
            <p className="text-secondary m-0">
              Please watch the instructions carefully
            </p>
          </div>

          {/* מיכל וידאו גמיש */}
          <div
            className="w-100 rounded-4 overflow-hidden bg-black mb-4 shadow-sm"
            style={{
              flex: "1 1 auto",
              maxWidth: "900px",
              maxHeight: "55vh",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <video
              controls
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
              id="explanatoryVideo"
            >
              <source src="/videos/121212.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* כפתור פעולה */}
          <div className="flex-shrink-0 pb-2">
            <button
              id="nextButton"
              onClick={NextPage}
              className="btn btn-lg px-5 py-3 rounded-pill btn-brand-orange"
              style={{
                minWidth: "240px",
                fontSize: "1.2rem",
              }}
            >
              Start Assessment &rarr;
            </button>
          </div>
        </div>

        {/* פוטר */}
        <div className="text-center py-2 text-muted small flex-shrink-0">
          FitWave AI © 2025
        </div>
      </div>
    </>
  );
}

export default ExplanatoryV;
