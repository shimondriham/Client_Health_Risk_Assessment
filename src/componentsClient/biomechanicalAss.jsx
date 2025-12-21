import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import logo from '../assets/react.svg'; 

const ChevronRight = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const ChevronLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;

const assessments = [
  { name: "Assessment 1" }, { name: "Assessment 2" }, { name: "Assessment 3" },
  { name: "Assessment 4" }, { name: "Assessment 5" }, { name: "Assessment 6" },
  { name: "Assessment 7" }
];

function BiomechanicalAss() {
  const [assessmentIndex, setassessmentIndex] = useState(0);
  const nav = useNavigate();
  // ... Refs ...
  const p11Y = useRef(null); const p12Y = useRef(null); const p13Y = useRef(null);
  const p14Y = useRef(null); const p15Y = useRef(null); const p16Y = useRef(null);
  const p23Y = useRef(null); const p24Y = useRef(null); const p25Y = useRef(null);
  const p26Y = useRef(null); const p27Y = useRef(null); const p28Y = useRef(null);
  const p31Y = useRef(null); const p32Y = useRef(null);
  const videoRef = useRef(null); const canvasRef = useRef(null);
  const poseLandmarkerRef = useRef(null); const assessmentIndexRef = useRef(assessmentIndex);
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState('');
  const ORANGE = "#F96424"; 

  useEffect(() => { assessmentIndexRef.current = assessmentIndex; }, [assessmentIndex]);
  const toOutCome = () => { nav("/OutCome"); };

  // ... MediaPipe Logic (אותו לוגיקה בדיוק) ...
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
            // Logic mapping...
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

  const stopCamera = () => { /* ... */ };
  const Back = () => { assessmentIndex > 0 ? setassessmentIndex(assessmentIndex - 1) : null };
  const handleExit = () => { if (window.confirm("Exit test?")) { stopCamera(); toOutCome(); } };
  const Next = () => {
    if(assessmentIndex < assessments.length - 1){ setassessmentIndex(assessmentIndex + 1); setIsValid(false); return; } 
    alert("Test Completed!"); stopCamera(); toOutCome();
  };

  return (
    // מבנה קשיח: גובה 100% מהמסך, ללא גלילה (overflow-hidden)
    <div className="vh-100 d-flex flex-column bg-light text-dark overflow-hidden" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. Header (גובה קבוע 60px) */}
      <nav className="d-flex align-items-center justify-content-between px-4 bg-white border-bottom" style={{ height: '60px', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo" width="24" />
            <span className="fw-bold fs-5 text-dark">Fitwave</span>
        </div>
        <button onClick={handleExit} className="btn btn-link text-decoration-none text-secondary fw-bold" style={{ fontSize: '0.95rem' }}>
            Exit Test
        </button>
      </nav>

      {/* 2. Stepper (גובה קבוע 80px) */}
      <div className="d-flex justify-content-center align-items-center border-bottom bg-white" style={{ height: '80px', flexShrink: 0, overflowX: 'auto' }}>
         <div className="d-flex px-4" style={{ gap: '2rem' }}>
             {assessments.map((s, i) => {
                 const isActive = i === assessmentIndex;
                 const isCompleted = i < assessmentIndex;
                 return (
                  <div key={i} className="d-flex flex-column align-items-center" style={{ opacity: isActive || isCompleted ? 1 : 0.4 }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                        style={{ 
                            width: '32px', height: '32px', 
                            backgroundColor: isActive ? ORANGE : (isCompleted ? '#10B981' : '#E5E7EB'), 
                            color: (isActive || isCompleted) ? 'white' : '#6B7280',
                            fontSize: '0.9rem', marginBottom: '4px'
                        }}>
                        {isCompleted ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '600' : '500', color: isActive ? '#111' : '#6B7280' }}>
                        {s.name}
                    </span>
                  </div>
                 );
             })}
         </div>
      </div>

      {/* 3. Main Split Screen (תופס את כל הגובה שנשאר) */}
      <div className="flex-grow-1 d-flex p-3 gap-3" style={{ minHeight: 0 }}>
            
            {/* צד שמאל: מצלמת משתמש (גדול) */}
            <div className="flex-grow-1 bg-black rounded-3 overflow-hidden position-relative border shadow-sm" style={{ flexBasis: '60%' }}>
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                
                {/* פידבק ברור למטה */}
                <div className="position-absolute bottom-0 w-100 py-2 text-center bg-white border-top">
                     <span className="fw-bold fs-5" style={{ color: isValid ? '#10B981' : ORANGE }}>
                        {feedback || "Adjusting..."}
                     </span>
                </div>
            </div>

            {/* צד ימין: הוראות (צר יותר) */}
            <div className="d-flex flex-column gap-3" style={{ flexBasis: '40%', maxWidth: '500px' }}>
                 {/* כותרת הנחיה */}
                 <div className="bg-white p-3 rounded-3 border shadow-sm flex-shrink-0">
                    <h5 className="m-0 fw-bold">Instructions</h5>
                    <p className="text-muted m-0 small">Follow the video below precisely.</p>
                 </div>

                 {/* וידאו הדרכה */}
                 <div className="flex-grow-1 bg-white rounded-3 overflow-hidden border shadow-sm position-relative">
                    <video width="100%" height="100%" controls style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}>
                        <source src="/videos/121212.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
      </div>

      {/* 4. Footer Buttons (גובה קבוע 70px) */}
      <div className="d-flex justify-content-between align-items-center px-4 bg-white border-top" style={{ height: '70px', flexShrink: 0 }}>
         <button 
            onClick={Back} 
            className="btn btn-outline-secondary px-4 fw-bold" 
            style={{ visibility: assessmentIndex === 0 ? 'hidden' : 'visible' }}
         >
            Back
         </button>

         <button
            onClick={Next}
            disabled={!isValid}
            className="btn text-white px-5 fw-bold d-flex align-items-center gap-2"
            style={{ backgroundColor: isValid ? ORANGE : '#ccc', border: 'none', fontSize: '1.1rem' }}
         >
            {assessmentIndex === assessments.length - 1 ? 'Finish' : 'Next Step'} <ChevronRight />
         </button>
      </div>

    </div>
  );
}

export default BiomechanicalAss;