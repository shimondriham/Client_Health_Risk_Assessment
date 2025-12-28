import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import logo from '../assets/react.svg'; 

// --- Icons (תוקן PlayIcon) ---
const ChevronRight = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const ChevronLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
// הוספתי viewBox="0 0 24 24" כדי שהאייקון לא ייחתך
const PlayIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;

const assessments = [
  { name: "Assessment 1" }, { name: "Assessment 2" }, { name: "Assessment 3" },
  { name: "Assessment 4" }, { name: "Assessment 5" }, { name: "Assessment 6" },
  { name: "Assessment 7" }
];

function BiomechanicalAss() {
  const [assessmentIndex, setassessmentIndex] = useState(0);
  const nav = useNavigate();
  
  // Refs & State
  const p11Y = useRef(null); const p12Y = useRef(null); const p13Y = useRef(null);
  const videoRef = useRef(null); const canvasRef = useRef(null);
  const poseLandmarkerRef = useRef(null); const assessmentIndexRef = useRef(assessmentIndex);
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const ORANGE = "#F96424"; 

  useEffect(() => { assessmentIndexRef.current = assessmentIndex; }, [assessmentIndex]);
  const toOutCome = () => { nav("/OutCome"); };

  // --- MediaPipe Logic (ללא שינוי) ---
  useEffect(() => {
    let animationId;
    const initPoseLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task' },
          runningMode: 'VIDEO', numPoses: 1
        });
        startCamera();
      } catch (error) { console.error(error); }
    };
    const startCamera = async () => {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => { videoRef.current.play(); processFrames(); };
      } catch (err) { console.error(err); }
    };
    const processFrames = () => {
      const loop = () => {
        if (poseLandmarkerRef.current && videoRef.current) {
          const now = performance.now();
          const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);
          if(canvasRef.current){
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
          }
          if (!results.landmarks || results.landmarks.length === 0) {
            setFeedback('Detecting body...');
          } else {
            const landmarks = results.landmarks[0];
            if (landmarks[11]) p11Y.current = landmarks[11].y;
            if (landmarks[13]) p13Y.current = landmarks[13].y;
            
            const ifAssessmentDone = [ p13Y.current < p11Y.current, true, true, true, true, true, true ];
            const feedbackAssessments = [ 'Raise hand higher', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good' ];
            const isAboveShoulder = ifAssessmentDone[assessmentIndexRef.current];
            if (!isValid && isAboveShoulder) setIsValid(true);
            const newFeedback = !isAboveShoulder ? feedbackAssessments[assessmentIndexRef.current] : 'Position Correct';
            setFeedback(prev => (prev !== newFeedback ? newFeedback : prev));
          }
        }
        animationId = requestAnimationFrame(loop);
      };
      loop();
    };
    initPoseLandmarker();
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  const stopCamera = () => { 
      if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
  };
  const Back = () => { assessmentIndex > 0 ? setassessmentIndex(assessmentIndex - 1) : null };
  const handleExit = () => { if (window.confirm("Exit test?")) { stopCamera(); toOutCome(); } };
  const Next = () => {
    if(assessmentIndex < assessments.length - 1){ setassessmentIndex(assessmentIndex + 1); setIsValid(false); return; } 
    alert("Test Completed!"); stopCamera(); toOutCome();
  };

  return (
    <>
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        
        .video-card {
            border: 1px solid #E5E7EB;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            position: relative; /* חשוב למיקום התוויות */
        }
        
        /* אנימציה עדינה לפידבק */
        .status-indicator { transition: all 0.3s ease; }
        `}
    </style>

    {/* מבנה קשיח: גובה 100% מהמסך, ללא גלילה */}
    <div className="vh-100 d-flex flex-column font-inter text-dark overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
      
      {/* 1. Navbar */}
      <nav className="d-flex align-items-center justify-content-between px-4 bg-white border-bottom" style={{ height: '60px', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo" width="22" />
            <span className="font-outfit fw-bold" style={{fontSize: '1.1rem', color: '#111'}}>Fitwave.ai</span>
        </div>
        <button onClick={handleExit} className="btn btn-link text-decoration-none text-secondary font-outfit fw-bold" style={{ fontSize: '0.85rem' }}>
            EXIT TEST
        </button>
      </nav>

      {/* 2. Stepper */}
      <div className="d-flex justify-content-center align-items-center border-bottom bg-white" style={{ height: '70px', flexShrink: 0, overflowX: 'auto' }}>
         <div className="d-flex px-4" style={{ gap: '2rem' }}>
             {assessments.map((s, i) => {
                 const isActive = i === assessmentIndex;
                 const isCompleted = i < assessmentIndex;
                 return (
                  <div key={i} className="d-flex flex-column align-items-center" style={{ opacity: isActive || isCompleted ? 1 : 0.4 }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                        style={{ 
                            width: '28px', height: '28px', 
                            backgroundColor: isActive ? ORANGE : (isCompleted ? '#10B981' : '#E5E7EB'), 
                            color: (isActive || isCompleted) ? 'white' : '#6B7280',
                            fontSize: '0.8rem', marginBottom: '4px'
                        }}>
                        {isCompleted ? '✓' : i + 1}
                    </div>
                    <span className="font-outfit" style={{ fontSize: '0.7rem', fontWeight: isActive ? '600' : '500', color: isActive ? '#111' : '#6B7280' }}>
                        {s.name}
                    </span>
                  </div>
                 );
             })}
         </div>
      </div>

      {/* 3. Main Content Area (3 עמודות) */}
      <div className="flex-grow-1 d-flex p-3 gap-3 align-items-stretch" style={{ minHeight: 0 }}>
            
            {/* שמאל: מצלמת משתמש (flex: 1) */}
            <div className="video-card bg-black rounded-4 overflow-hidden" style={{ flex: 1 }}>
                {/* תווית צפה */}
                <div className="position-absolute top-0 start-0 m-3 px-3 py-1 bg-white rounded-pill shadow-sm d-flex align-items-center gap-2" style={{zIndex: 10}}>
                    <div className="rounded-circle bg-danger" style={{width:'8px', height:'8px'}}></div>
                    <span className="font-outfit fw-bold small">LIVE FEED</span>
                </div>

                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                
                {/* הסרתי את הפידבק מכאן */}
            </div>

            {/* אמצע: פאנל סטטוס/פידבק (רוחב קבוע) */}
            <div className="d-flex flex-column justify-content-center text-center bg-white rounded-4 shadow-sm border p-3" 
                 style={{ width: '220px', flexShrink: 0 }}>
                
                <span className="text-muted small font-outfit fw-bold text-uppercase mb-3" style={{letterSpacing:'1px', fontSize:'0.75rem'}}>
                    Current Status
                </span>
                
                {/* אינדיקטור ויזואלי */}
                <div className="mb-3 d-flex justify-content-center">
                    <div className={`status-indicator rounded-circle d-flex align-items-center justify-content-center ${isValid ? 'bg-success-subtle' : 'bg-warning-subtle'}`} 
                         style={{width:'48px', height:'48px', transition: 'all 0.3s ease'}}>
                         <div className={`rounded-circle ${isValid ? 'bg-success' : ORANGE}`} style={{width:'16px', height:'16px', boxShadow: `0 0 15px ${isValid ? '#10B981' : ORANGE}`}}></div>
                    </div>
                </div>

                {/* טקסט הפידבק */}
                <span className="font-outfit fw-bold fs-5" style={{ color: isValid ? '#10B981' : ORANGE, lineHeight: 1.2, transition: 'color 0.3s ease' }}>
                    {feedback || "Get Ready..."}
                </span>
            </div>

            {/* ימין: הוראות (flex: 1 - זהה לשמאל) */}
            <div className="video-card bg-white rounded-4 overflow-hidden" style={{ flex: 1 }}>
                 {/* תווית צפה (תוקן האייקון) */}
                 <div className="position-absolute top-0 start-0 m-3 px-3 py-1 bg-white rounded-pill shadow-sm d-flex align-items-center gap-2 border" style={{zIndex: 10}}>
                    <PlayIcon />
                    <span className="font-outfit fw-bold small">INSTRUCTION</span>
                 </div>

                 <video width="100%" height="100%" controls style={{ objectFit: 'cover' }}>
                    <source src="/videos/121212.mp4" type="video/mp4" />
                 </video>
            </div>
      </div>

      {/* 4. Footer Buttons */}
      <div className="d-flex justify-content-between align-items-center px-4 bg-white border-top" style={{ height: '80px', flexShrink: 0 }}>
         <button 
            onClick={Back} 
            className="btn btn-white border px-4 py-2 rounded-pill font-outfit fw-bold text-secondary shadow-sm" 
            style={{ visibility: assessmentIndex === 0 ? 'hidden' : 'visible' }}
         >
            <ChevronLeft /> Back
         </button>

         <button
            onClick={Next}
            disabled={!isValid}
            className="btn text-white px-5 py-2 rounded-pill font-outfit fw-bold d-flex align-items-center gap-2"
            style={{ 
                backgroundColor: isValid ? ORANGE : '#E5E7EB', 
                color: isValid ? 'white' : '#9CA3AF',
                border: 'none', fontSize: '1rem',
                boxShadow: isValid ? `0 4px 15px ${ORANGE}40` : 'none',
                transition: 'all 0.3s ease'
            }}
         >
            {assessmentIndex === assessments.length - 1 ? 'Finish' : 'Next Step'} <ChevronRight />
         </button>
      </div>

    </div>
    </>
  );
}

export default BiomechanicalAss;