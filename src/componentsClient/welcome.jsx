import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addIfShowNav } from "../featuers/myDetailsSlice";
import thisIcon from '../assets/icon.png'; 

const Welcome = () => {
    let nav = useNavigate();
    const dispatch = useDispatch();
    
    // State לאפקט הפרלקס (תזוזה עם העכבר)
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    useEffect(() => {
        dispatch(addIfShowNav({ ifShowNav: false }));
    }, []);

    const toSignIn = () => nav("/login");
    const toSignUp = () => nav("/SignUp");

    // פונקציה לחישוב תזוזת העכבר
    const handleMouseMove = (e) => {
        if (!heroRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // חישוב עדין של הזווית (מקסימום 15 מעלות)
        const y = (clientX / innerWidth - 0.5) * 15;
        const x = (clientY / innerHeight - 0.5) * -15;
        
        setRotation({ x, y });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 }); // איפוס ביציאה
    };

    // --- עיצוב ---
    const brandOrange = "#F96424";
    const brandDark = "#1a1a1a";

    // --- אייקונים ---
    const ArrowRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
    const ScanIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={brandOrange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="2"/></svg>;
    const BrainIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={brandOrange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
    const BoltIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={brandOrange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

    return (
        <div className="min-vh-100 bg-white d-flex flex-column overflow-hidden" 
             onMouseMove={handleMouseMove} 
             onMouseLeave={handleMouseLeave}
             ref={heroRef}>
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oooh+Baby&family=Inter:wght@300;400;500;600;700&display=swap');

                body { font-family: 'Swissintl', 'Inter', sans-serif; color: ${brandDark}; }
                .logo-font { font-family: 'Oooh Baby', cursive; }

                /* אנימציית טקסט זוהר */
                @keyframes shine {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                .shimmer-text {
                    background: linear-gradient(90deg, #1a1a1a, #F96424, #1a1a1a);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shine 3s linear infinite;
                }

                /* אנימציית גלילה אינסופית (Marquee) */
                @keyframes scrollLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-container {
                    display: flex;
                    overflow: hidden;
                    white-space: nowrap;
                    position: relative;
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
                .marquee-content {
                    display: flex;
                    gap: 4rem;
                    animation: scrollLeft 20s linear infinite;
                    padding: 20px 0;
                }

                /* כפתור */
                .btn-cta {
                    background-color: ${brandOrange};
                    color: white;
                    border: none;
                    padding: 16px 48px;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 10px 30px rgba(249, 100, 36, 0.25);
                }
                .btn-cta:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(249, 100, 36, 0.4);
                    color: white;
                }

                /* Mockup 3D */
                .mockup-3d {
                    transition: transform 0.1s ease-out; /* תגובה מהירה לעכבר */
                    transform-style: preserve-3d;
                    perspective: 1000px;
                    width: 90%; max-width: 1000px;
                    border-radius: 24px;
                    box-shadow: 0 30px 80px -20px rgba(0,0,0,0.15);
                    border: 1px solid rgba(0,0,0,0.05);
                    background: white;
                    overflow: hidden;
                }

                /* Bento Grid */
                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .bento-item {
                    background: #f8f9fa;
                    border-radius: 24px;
                    padding: 40px;
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                }
                .bento-item:hover {
                    background: #fff;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    border-color: #eee;
                    transform: translateY(-5px);
                }
                @media(max-width: 768px) {
                    .bento-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            {/* === Navbar === */}
            <nav className="d-flex justify-content-between align-items-center px-4 py-4 fixed-top bg-white/90 backdrop-blur" 
                 style={{zIndex: 100, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)'}}>
                
                <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <img src={thisIcon} alt="Logo" width="35" className="opacity-75" />
                    <span className="logo-font" style={{ fontSize: '2rem', lineHeight: 0.8 }}>Fitwave.ai</span>
                </div>

                <div className="d-flex gap-3">
                    <button onClick={toSignIn} className="btn fw-medium px-4 text-dark rounded-pill" style={{fontSize: '0.95rem'}}>Log In</button>
                    <button onClick={toSignUp} className="btn fw-medium px-4 bg-dark text-white rounded-pill d-none d-md-block" style={{fontSize: '0.95rem'}}>Sign Up</button>
                </div>
            </nav>

            {/* === Hero Section (With Mouse Interaction) === */}
            <section className="d-flex flex-column align-items-center text-center px-3 position-relative" 
                     style={{ paddingTop: "160px", paddingBottom: "80px", perspective: '1000px' }}>
                
                <div className="mb-3 px-3 py-1 rounded-pill bg-light border d-inline-flex align-items-center gap-2 text-muted small fw-bold text-uppercase" style={{letterSpacing:'1px'}}>
                    <span style={{width:8, height:8, background:brandOrange, borderRadius:'50%'}}></span>
                    AI-Powered Biomechanics
                </div>

                <h1 className="display-1 fw-bold mb-4" style={{ color: brandDark, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
                    Your Body.<br/>
                    <span className="shimmer-text">Optimized.</span>
                </h1>
                
                <p className="text-secondary mb-5" style={{ maxWidth: "550px", fontSize: "1.25rem", lineHeight: "1.6", fontWeight: '300' }}>
                    Precision movement analysis tailored for your physiology. 
                    Detect risks, correct form, and perform better.
                </p>
                
                <button onClick={toSignUp} className="btn-cta d-flex align-items-center gap-2 mb-5">
                    Start Free Assessment <ArrowRight />
                </button>

                {/* === 3D Interactive Mockup === */}
                <div className="mockup-3d" 
                     style={{ 
                         transform: `rotateX(${10 + rotation.x}deg) rotateY(${rotation.y}deg)`, // תזוזה דינמית
                     }}>
                    {/* תוכן המוקאפ */}
                    <div className="d-flex flex-column p-0" style={{background: 'white', height: '500px'}}>
                        {/* Header בתוך המוקאפ */}
                        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white">
                            <div className="d-flex gap-2">
                                <div className="rounded-circle bg-danger opacity-25" style={{width:10, height:10}}></div>
                                <div className="rounded-circle bg-warning opacity-25" style={{width:10, height:10}}></div>
                            </div>
                            <div className="text-muted small fw-bold text-uppercase" style={{letterSpacing:1, fontSize:'0.7rem'}}>Dashboard View</div>
                        </div>

                        {/* גוף המוקאפ */}
                        <div className="d-flex h-100">
                            {/* סרגל צד */}
                            <div className="border-end p-3 d-none d-md-block" style={{width: '200px', background:'#fafafa'}}>
                                <div className="mb-2 p-2 rounded bg-white shadow-sm text-dark fw-bold small">Overview</div>
                                <div className="mb-2 p-2 text-muted small">Analysis</div>
                                <div className="mb-2 p-2 text-muted small">History</div>
                            </div>
                            
                            {/* אזור ראשי */}
                            <div className="flex-grow-1 p-4 bg-light">
                                <div className="row g-3 h-100">
                                    <div className="col-8">
                                        <div className="bg-white rounded-4 p-4 h-100 shadow-sm border border-light d-flex align-items-end justify-content-between px-5 pb-5">
                                            {[30, 50, 40, 70, 60, 90, 80].map((h,i) => (
                                                <div key={i} style={{width:'40px', height:`${h}%`, background: i===5 ? brandOrange : '#eee', borderRadius:'8px'}}></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-4 d-flex flex-column gap-3">
                                        <div className="bg-white rounded-4 p-3 shadow-sm border border-light flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                                            <div className="text-muted small mb-1">Score</div>
                                            <div className="fw-bold" style={{fontSize:'3.5rem', color: brandDark, lineHeight:1}}>94</div>
                                        </div>
                                        <div className="bg-white rounded-4 p-3 shadow-sm border border-light flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                                            <div className="text-muted small mb-1">Stability</div>
                                            <div className="fw-bold" style={{fontSize:'2rem', color: brandOrange}}>High</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === Infinite Marquee (פיצ'ר חדש) === */}
            <div className="py-4 border-top border-bottom bg-light overflow-hidden">
                <div className="marquee-container">
                    {/* תוכן כפול לאנימציה רציפה */}
                    <div className="marquee-content text-uppercase fw-bold text-muted" style={{letterSpacing:'2px', fontSize:'0.9rem'}}>
                        <span>Physiotherapy AI</span> • <span>Injury Prevention</span> • <span>Motion Tracking</span> • 
                        <span>Real-time Feedback</span> • <span>Home Assessment</span> • <span>Medical Grade</span> •
                        <span>Physiotherapy AI</span> • <span>Injury Prevention</span> • <span>Motion Tracking</span> • 
                        <span>Real-time Feedback</span> • <span>Home Assessment</span> • <span>Medical Grade</span>
                    </div>
                    <div className="marquee-content text-uppercase fw-bold text-muted" style={{letterSpacing:'2px', fontSize:'0.9rem'}}>
                        <span>Physiotherapy AI</span> • <span>Injury Prevention</span> • <span>Motion Tracking</span> • 
                        <span>Real-time Feedback</span> • <span>Home Assessment</span> • <span>Medical Grade</span> •
                        <span>Physiotherapy AI</span> • <span>Injury Prevention</span> • <span>Motion Tracking</span> • 
                        <span>Real-time Feedback</span> • <span>Home Assessment</span> • <span>Medical Grade</span>
                    </div>
                </div>
            </div>

            {/* === Bento Grid Features === */}
            <section className="py-5 mb-5 mt-4">
                <div className="container text-center mb-5">
                    <h2 className="display-5 fw-bold" style={{color: brandDark}}>Advanced Technology</h2>
                    <p className="text-muted">Designed for accuracy, built for simplicity.</p>
                </div>
                
                <div className="bento-grid">
                    {/* כרטיס גדול */}
                    <div className="bento-item" style={{gridColumn: 'span 2'}}>
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div className="p-3 rounded-circle" style={{background:'#FFF4F0'}}><ScanIcon /></div>
                            <span className="badge bg-dark rounded-pill px-3 py-2 fw-normal">Core Feature</span>
                        </div>
                        <h3 className="h3 fw-bold mb-3">AI Motion Scan</h3>
                        <p className="text-muted fs-5">
                            Our computer vision algorithms track 24 key body points in real-time to analyze your biomechanics with clinical precision.
                        </p>
                    </div>

                    {/* כרטיס קטן 1 */}
                    <div className="bento-item">
                        <div className="p-3 rounded-circle d-inline-block mb-4" style={{background:'#FFF4F0'}}><BrainIcon /></div>
                        <h4 className="fw-bold mb-2">Deep Analysis</h4>
                        <p className="text-muted small">Detects micro-imbalances invisible to the human eye.</p>
                    </div>

                    {/* כרטיס קטן 2 */}
                    <div className="bento-item">
                        <div className="p-3 rounded-circle d-inline-block mb-4" style={{background:'#FFF4F0'}}><BoltIcon /></div>
                        <h4 className="fw-bold mb-2">Fast Results</h4>
                        <p className="text-muted small">Get a comprehensive report in under 60 seconds.</p>
                    </div>

                    {/* כרטיס רחב תחתון */}
                    <div className="bento-item" style={{gridColumn: 'span 2'}}>
                        <h3 className="h3 fw-bold mb-3">Personalized Recovery</h3>
                        <p className="text-muted">
                            Receive actionable insights and corrective exercises tailored specifically to your body's needs.
                        </p>
                    </div>
                </div>
            </section>

            {/* === Footer === */}
            <footer className="text-center py-5 border-top mt-auto bg-white">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3 opacity-50">
                    <img src={thisIcon} alt="Logo" width="35" />
                    <span className="logo-font" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
                </div>
                <p className="text-muted small m-0">© 2026 Fitwave Inc. All rights reserved.</p>
            </footer>

        </div>
    );
}

export default Welcome;