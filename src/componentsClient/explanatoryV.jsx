import React from "react";
import { useNavigate } from "react-router-dom";

function ExplanatoryV() {
  const nav = useNavigate();

  const NextPage = () => {
    nav("/healthForm");
  };

  const goBackHome = () => {
    nav("/homeClient");
  };

  // --- Inline Icons ---
  const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:'2px'}}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  // --- Styles ---
  const styles = {
    page: {
      height: "100vh",
      width: "100vw",
      position: "fixed", // מונע גלילה לחלוטין
      top: 0,
      left: 0,
      backgroundColor: "#f8f9fa", // רקע אפור בהיר מאוד
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    },
    wave: {
      position: "absolute",
      bottom: "-20%",
      right: "-10%",
      width: "120%",
      height: "70%",
      background: "linear-gradient(135deg, #7b68ee 0%, #ec4899 100%)",
      borderRadius: "100% 0 0 0 / 80% 0 0 0",
      zIndex: 0 // מאחורי הכל
    },
    backButton: {
      position: "absolute",
      top: "20px",
      right: "20px",
      zIndex: 10,
      background: "white",
      border: "1px solid #e9ecef",
      padding: "8px 16px",
      borderRadius: "50px",
      fontWeight: "600",
      fontSize: "0.8rem",
      color: "#495057",
      cursor: "pointer",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    contentContainer: {
      zIndex: 2, // מעל הגל
      width: '100%', 
      maxWidth: '960px', 
      padding: '20px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%' // תופס את הגובה כדי למרכז
    },
    title: {
      fontWeight: 'bold',
      color: '#32325d',
      marginBottom: '20px',
      fontSize: '2rem',
      textShadow: '0 2px 4px rgba(255,255,255,0.8)' // קריאות מעל הגל אם צריך
    },
    videoWrapper: {
      width: '100%',
      maxHeight: '60vh', // מגביל את גובה הסרטון כדי שלא תהיה גלילה
      boxShadow: '0 20px 50px rgba(0,0,0,0.2)', // צל חזק כדי להבליט מעל הרקע
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center'
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'contain', // שומר יחס תמונה בתוך המסגרת
      maxHeight: '60vh'
    },
    gradientBtn: {
      background: "linear-gradient(90deg, #7b68ee 0%, #ec4899 100%)",
      border: "none",
      color: "white",
      padding: "12px 60px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      borderRadius: "50px",
      marginTop: "30px",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(123, 104, 238, 0.4)"
    }
  };

  return (
    <div style={styles.page}>
      
      {/* 1. הוספת הגל לרקע */}
      <div style={styles.wave}></div>

      {/* 2. כפתור חזרה לדף הבית */}
      <button style={styles.backButton} onClick={goBackHome}>
        <HomeIcon /> BACK TO HOME
      </button>

      {/* 3. התוכן המרכזי */}
      <div style={styles.contentContainer}>
        
        <h2 style={styles.title}>Explanatory Video</h2>

        {/* עטיפה לוידאו כדי לתת לו עיצוב יפה וצל */}
        <div style={styles.videoWrapper}>
          <video
            controls
            style={styles.video}
            id="explanatoryVideo"
          >
            <source src="/videos/121212.mp4" type="video/mp4" />
            הדפדפן שלך לא תומך בווידאו.
          </video>
        </div>

        <button 
          id="nextButton" 
          style={styles.gradientBtn} 
          onClick={NextPage}
        >
          Next
        </button>

      </div>
    </div>
  );
}

export default ExplanatoryV;