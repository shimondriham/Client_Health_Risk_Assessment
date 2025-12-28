import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addIfShowNav } from "../featuers/myDetailsSlice";
// logo import הוסר מכאן

const Welcome = () => {
    let nav = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addIfShowNav({ ifShowNav: false }));
    }, []);

    const toSignIn = () => nav("/login");
    const toSignUp = () => nav("/SignUp");

    // --- הגדרות עיצוב ---
    const brandOrange = "#F96424";
    const brandDark = "#1a1a1a";
    
    // --- CSS פנימי: פונטים ואנימציות ---
    const styles = `
        /* ייבוא פונט Oooh Baby ללוגו + Inter כגיבוי ל-Swissintl */
        @import url('https://fonts.googleapis.com/css2?family=Oooh+Baby&family=Inter:wght@400;500;700&display=swap');

        /* הגדרת הפונט הראשי לכל העמוד - Swissintl */
        .welcome-page-wrapper {
            font-family: 'Swissintl', 'Inter', -apple-system, sans-serif !important;
            color: ${brandDark};
        }

        /* הגדרת הלוגו עם הפונט המיוחד */
        .logo-font {
            font-family: 'Oooh Baby', cursive !important;
            font-size: 48px;
            font-weight: 400;
        }

        /* כותרות בסגנון Swissintl Medium */
        h1, h2, .swiss-style-header {
            font-family: 'Swissintl', 'Inter', sans-serif;
            font-weight: 500; /* Medium */
        }
        
        .main-heading {
            font-size: 56px;
            line-height: 1.1;
        }
        
        h2 {
             font-size: 42px; /* גודל 42 כפי שביקשת */
        }

        @media (max-width: 768px) {
            .main-heading { font-size: 42px; }
            h2 { font-size: 32px; }
            .logo-font { font-size: 36px; }
        }

        /* --- אנימציות --- */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translate3d(0, 40px, 0); }
            to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        .animate-fade-up {
            animation: fadeInUp 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            opacity: 0;
        }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }

        /* אפקטים לכפתורים וכרטיסיות */
        .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
            border-color: ${brandOrange} !important;
        }

        .btn-brand-orange {
            background-color: ${brandOrange};
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(249, 100, 36, 0.3);
        }
        .btn-brand-orange:hover {
            background-color: #e05a20;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(249, 100, 36, 0.4);
            color: white;
        }
    `;

    // אייקון וי
    const CheckIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="me-3 flex-shrink-0">
            <path d="M20 6L9 17L4 12" stroke={brandOrange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    return (
        <div className="min-vh-100 bg-white d-flex flex-column welcome-page-wrapper">
            <style>{styles}</style>

            {/* === Navbar === */}
            <nav className="d-flex justify-content-between align-items-center px-4 py-3 fixed-top bg-white/95 backdrop-blur shadow-sm" 
                 style={{zIndex: 1000, backgroundColor: "rgba(255,255,255,0.95)"}}>
                
                {/* הלוגו (רק טקסט) */}
                <div className="d-flex align-items-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <span className="logo-font" style={{ color: brandDark, lineHeight: '1', fontSize: '2rem' }}>Fitwave.ai</span>
                </div>

                <button 
                    onClick={toSignIn} 
                    className="btn fw-bold px-4 text-dark text-decoration-none rounded-pill"
                    style={{ fontSize: '1rem', border: '1px solid #eee' }}
                >
                    Log In
                </button>
            </nav>

            {/* === 1. Hero Section === */}
            <header className="d-flex flex-column align-items-center justify-content-center text-center px-3 position-relative" 
                    style={{ marginTop: "140px", paddingBottom: "100px" }}>
                
                {/* רקע דקורטיבי עדין */}
                <div style={{
                    position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
                    width: "100%", height: "100%", background: "radial-gradient(circle at center, rgba(249,100,36,0.03) 0%, rgba(255,255,255,0) 60%)",
                    zIndex: -1
                }}></div>

                <div style={{ maxWidth: "900px" }}>
                    <h1 className="animate-fade-up delay-1 main-heading mb-4" style={{ color: brandDark }}>
                        The smart health app,<br />
                        for <span style={{ color: brandOrange }}>your well-being.</span>
                    </h1>
                    
                    <p className="animate-fade-up delay-2 mb-5 mx-auto text-secondary" 
                       style={{ maxWidth: "650px", fontSize: "20px", lineHeight: "1.6", fontWeight: "300" }}>
                        FITWAVE transforms your camera into a diagnostic tool. 
                        Detect limitations and prevent injuries with AI precision.
                    </p>
                    
                    <div className="animate-fade-up delay-3 d-flex flex-column flex-sm-row gap-3 justify-content-center">
                        <button 
                            onClick={toSignUp} 
                            className="btn btn-lg px-5 py-3 fw-medium rounded-pill btn-brand-orange" 
                            style={{ fontSize: '18px' }}
                        >
                            Get Started Free
                        </button>
                    </div>
                    
                    <p className="animate-fade-up delay-3 text-muted mt-4 small">
                        No credit card required
                    </p>
                </div>
            </header>

            {/* === 2. Trust Strip === */}
            <div className="py-5 border-top border-bottom" style={{backgroundColor: "#fafafa"}}>
                <div className="container text-center">
                    <p className="text-uppercase fw-bold text-muted small mb-4 tracking-wide">TRUSTED BY PROFESSIONALS IN</p>
                    <div className="d-flex justify-content-center gap-5 flex-wrap opacity-50 swiss-style-header fs-4" style={{color: brandDark}}>
                        <span>Physiotherapy</span>
                        <span>Rehabilitation</span>
                        <span>Wellness</span>
                        <span>Geriatrics</span>
                    </div>
                </div>
            </div>

            {/* === 3. Features Section === */}
            <section className="py-5 my-5">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-5">
                            <h2 className="mb-4" style={{ fontWeight: "500", color: brandDark }}>
                                Why choose FITWAVE?
                            </h2>
                            <p className="text-secondary fs-5 mb-5 lh-base">
                                Advanced computer vision meets medical expertise.
                            </p>
                            
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center fs-5 text-dark">
                                    <CheckIcon /> <span style={{fontWeight: 500}}>Tailored for ages 40+</span>
                                </div>
                                <div className="d-flex align-items-center fs-5 text-dark">
                                    <CheckIcon /> <span style={{fontWeight: 500}}>100% Private & Secure</span>
                                </div>
                                <div className="d-flex align-items-center fs-5 text-dark">
                                    <CheckIcon /> <span style={{fontWeight: 500}}>Instant AI Feedback</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-7">
                            <div className="row g-4">
                                {[
                                    { icon: "🛡️", title: "Prevent Injuries", text: "Identify imbalances early." },
                                    { icon: "🏠", title: "Test at Home", text: "Professional tests, no waiting." },
                                    { icon: "📊", title: "Track Progress", text: "See your mobility improve." },
                                    { icon: "🤖", title: "AI Instructor", text: "Guided movement correction." }
                                ].map((feature, index) => (
                                    <div className="col-md-6" key={index}>
                                        <div className="feature-card p-4 rounded-4 border bg-white h-100">
                                            <div className="mb-3 display-6">{feature.icon}</div>
                                            <h4 className="fw-medium mb-2" style={{fontSize: "24px"}}>{feature.title}</h4>
                                            <p className="text-muted mb-0">{feature.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === 4. Dark Section === */}
            <section className="text-white py-5 position-relative" style={{backgroundColor: brandDark}}>
                <div className="container py-5 text-center">
                    <h2 className="mb-5" style={{ fontWeight: "500" }}>How it works</h2>
                    <div className="row g-5">
                        {["Setup Camera", "Follow AI", "Get Results"].map((step, idx) => (
                            <div className="col-md-4" key={idx}>
                                <div className="d-flex flex-column align-items-center group">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center mb-4 text-dark bg-white shadow" 
                                         style={{width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold'}}>
                                        {idx + 1}
                                    </div>
                                    <h3 className="h4 mb-3">{step}</h3>
                                    <p className="text-white-50 px-4">Simple, fast, and effective process designed for home use.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === 5. CTA === */}
            <section className="py-5 text-center bg-white">
                <div className="container py-5">
                    <h2 className="mb-4" style={{ fontWeight: "500", color: brandDark }}>
                        Ready to start?
                    </h2>
                    <button 
                        onClick={toSignUp} 
                        className="btn btn-lg px-5 py-3 fw-medium rounded-pill btn-brand-orange" 
                    >
                        Start Free Assessment
                    </button>
                </div>
            </section>

            {/* === Footer === */}
            <footer className="bg-white py-4 border-top mt-auto">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                         {/* הלוגו בפוטר (רק טקסט) */}
                         <span className="logo-font text-muted" style={{fontSize: "28px"}}>FitWave.ai</span>
                    </div>
                    <div className="small text-muted">© 2025 FITWAVE.AI</div>
                </div>
            </footer>
        </div>
    );
}

export default Welcome;