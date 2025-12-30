import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doApiMethod } from '../services/apiService';
import thisIcon from '../assets/icon.png'; 
import '../App.css'; // שימוש בעיצוב הכללי

const Varification = () => {
  let nav = useNavigate();
  const myEmail = useSelector(state => state.myDetailsSlice.email);
  const [code, setCode] = useState(['', '', '', '', '']); 
  
  // בדיקה אם הקוד מלא
  const isCodeComplete = code.every((digit) => digit !== '');

  // --- Logic ---
  const handleChange = (event, index) => {
    const value = event.target.value;
    // מאפשר רק מספרים
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      // מעבר אוטומטי לשדה הבא
      if (value && index < 4) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    // מחיקה וחזרה אחורה
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  const handleSubmit = () => {
    if (!isCodeComplete) return;
    
    const codeString = code.join(''); 
    let _dataObg = {
      email: myEmail,
      verificationCode: codeString,
    }
    doApi(_dataObg)
  };

  const doApi = async (_dataBody) => {
    let url = "/users/verification";
    try {
      let resp = await doApiMethod(url, "PATCH", _dataBody);
      if (resp.data.matchedCount === 1) {
        nav("/login");
      }
    }
    catch (error) {
      console.log(error.response?.data);
      alert("Verification failed. Please try again.");
    }
  }

  // סגנון מיוחד לריבועי הקוד שדורס חלקית את ה-CSS הכללי
  const otpInputStyle = {
      width: '50px',
      height: '55px',
      textAlign: 'center',
      padding: '0',
      fontSize: '1.5rem',
      borderRadius: '16px', // עיגול נעים לריבועים
      margin: '0 5px' // רווח בין הריבועים
  };

  return (
    <div className="login-wrapper" style={{ height: '100vh', overflow: 'hidden' }}>
      
      {/* --- לוגו עליון --- */}
      <nav className="top-nav" style={{ padding: '5px 0' }}>
        <img src={thisIcon} alt="Logo" width="35" className="logo-icon opacity-75" />
        <span className="logo-text" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
      </nav>

      {/* --- תוכן מרכזי --- */}
      <div className="login-content" style={{ justifyContent: 'center' }}>
        
        <h1 className="main-title" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
          Verify Account
        </h1>
        
        <p className="subtitle" style={{ fontSize: '1rem', marginBottom: '30px', lineHeight: '1.5' }}>
            Enter the 5-digit security code sent to:
            <br />
            {/* הדגשת האימייל בצבע כהה יותר */}
            <span style={{ color: '#000', fontWeight: '600', fontSize: '1.1rem' }}>
                {myEmail || "your@email.com"}
            </span>
        </p>

        {/* תיבות הקלט */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          {code.map((value, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              maxLength="1"
              // משתמשים ב-custom-input כדי לקבל את הצבעים והפוקוס, ודורסים גודל עם style
              className="custom-input" 
              style={otpInputStyle}
              value={value}
              onChange={(event) => handleChange(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              autoComplete="off"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button 
            onClick={handleSubmit} 
            disabled={!isCodeComplete}
            className="btn-login-orange"
            style={{ 
                opacity: isCodeComplete ? 1 : 0.5, // מראה שהכפתור לא פעיל אם הקוד לא מלא
                cursor: isCodeComplete ? 'pointer' : 'not-allowed'
            }}
        >
          Verify Code
        </button>

        {/* אופציה לשליחה מחדש (אופציונלי - הוספתי לעיצוב) */}
        <div className="register-text" style={{marginTop: '20px'}}>
          Didn't receive the code? 
          <span className="register-link" style={{cursor: 'pointer'}}> Resend</span>
        </div>

      </div>

      {/* --- Footer --- */}
      <footer className="footer" style={{paddingTop: '10px'}}>
        <div>© Fitwave.ai 2026</div>
        <div className="footer-right">
          <span>✉️</span> support@fitwave.ai
        </div>
      </footer>

    </div>
  );
}

export default Varification;