import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addIfShowNav } from "../featuers/myDetailsSlice";
import logo from '../assets/react.svg'; // וודא שהנתיב ללוגו נכון

const Welcome = () => {
    let nav = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addIfShowNav({ ifShowNav: false }));
    }, []);

    const toSignIn = () => nav("/login");
    const toSignUp = () => nav("/SignUp");

    // הגדרת הצבע הכתום החדש
    const brandOrange = "#F96424";

    const orangeBtnStyle = {
        backgroundColor: brandOrange,
        border: "none",
        color: "white",
        transition: "background-color 0.2s ease"
    };

    // סגנון לפונט הכללי כדי שיראה כמו בתמונה
    const fontStyle = {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#333333" // צבע טקסט כהה אך לא שחור מלא
    };

    return (
        // הוספתי את fontStyle לדיב העוטף
        <div className="min-vh-100 bg-white d-flex flex-column" style={fontStyle}>
            
            <nav className="d-flex justify-content-between align-items-center px-4 py-4">
                <div className="d-flex align-items-center gap-2">
                    {/* עדכנתי את ייבוא הלוגו בצורה סטנדרטית יותר */}
                    <img src={logo} alt="FITWAVE Logo" style={{ width: "35px" }} />
                    {/* שיניתי את צבע הטקסט של הלוגו שיתאים לעיצוב החדש */}
                    <span className="fw-bold fs-4" style={{ color: "#1a1a1a" }}>FITWAVE</span>
                </div>
                {/* כפתור לוגין נקי יותר ללא רקע אפור */}
                <button 
                    onClick={toSignIn} 
                    className="btn fw-bold px-4 text-dark text-decoration-none hover-opacity"
                    style={{ fontSize: '1.1rem' }}
                >
                    Log In
                </button>
            </nav>

            <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center px-3 mt-5">
                <div style={{ maxWidth: "850px" }}>
                    
                    <h1 className="display-3 fw-bolder mb-4 lh-sm" style={{ color: "#1a1a1a" }}>
                        The smart health app,<br />
                        {/* שימוש בצבע הכתום עבור ההדגשה */}
                        for <span style={{ color: brandOrange }}>your well-being.</span>
                    </h1>

                    <p className="lead mb-5 mx-auto" style={{ maxWidth: "700px", fontSize: "1.35rem", color: "#666666", fontWeight: "400" }}>
                        FITWAVE transforms your home camera into an advanced diagnostic tool. 
                        We conduct smart biomechanical assessments to identify limitations, 
                        prevent injuries, and enhance quality of life for those aged 40+.
                    </p>

                    <button 
                        onClick={toSignUp} 
                        // הסרתי את shadow-sm. הוספתי rounded-pill למראה עגול יותר כמו בתמונה
                        className="btn btn-lg px-5 py-3 fw-bold rounded-pill" 
                        style={orangeBtnStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e05a20"} // אפקט הובר פשוט
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = brandOrange}
                    >
                        Get Started. It's FREE &rarr;
                    </button>

                    <p className="text-muted mt-4 small" style={{ fontSize: "1rem" }}>No credit card required.</p>
                </div>
            </main>

        </div>
    );
}

export default Welcome;