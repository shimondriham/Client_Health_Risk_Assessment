import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import logo from '../assets/react.svg'; 

// --- Icons ---
const ChevronRight = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const ChevronLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;

const assessments = [
  { name: "First assessment" },
  { name: "Second assessment" },
  { name: "Third assessment" },
  { name: "Fourth assessment" },
  { name: "Fifth assessment" },
  { name: "Sixth assessment" },
  { name: "Seventh assessment" }
];

function BiomechanicalAss() {
  const [assessmentIndex, setassessmentIndex] = useState(0);
  const nav = useNavigate();
  
  // --- Refs ---
  const p11Y = useRef(null); const p12Y = useRef(null); const p13Y = useRef(null);
  const p14Y = useRef(null); const p15Y = useRef(null); const p16Y = useRef(null);
  const p23Y = useRef(null); const p24Y = useRef(null); const p25Y = useRef(null);
  const p26Y = useRef(null); const p27Y = useRef(null); const p28Y = useRef(null);
  const p31Y = useRef(null); const p32Y = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const assessmentIndexRef = useRef(assessmentIndex);

  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const ORANGE = "#F96424"; 

  useEffect(() => {
    assessmentIndexRef.current = assessmentIndex;
  }, [assessmentIndex]);

  const toOutCome = () => {
    nav("/OutCome");
  };

  // --- MediaPipe Logic ---
  useEffect(() => {
    let animationId;
    const initPoseLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
          },
          runningMode: 'VIDEO',
          numPoses: 1
        });
        startCamera();
      } catch (error) { console.error(error); }
    };

    const startCamera = async () => {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          processFrames();
        };
      } catch (err) { console.error(err); }
    };

    const processFrames = () => {
      const loop = () => {
        if (poseLandmarkerRef.current && videoRef.current) {
          const now = performance.now();
          const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;

          if(canvasRef.current){
              canvasRef.current.width = videoWidth;
              canvasRef.current.height = videoHeight;
          }

          if (!results.landmarks || results.landmarks.length === 0) {
            setFeedback('No person detected');
          } else {
            const landmarks = results.landmarks[0];
            const connections = [
              [11, 12], [12, 14], [14, 16], [11, 13], [13, 15], 
              [12, 24], [11, 23], [23, 24], 
              [24, 26], [26, 28], [28, 32], [23, 25], [25, 27], [27, 31]
            ];
            
            connections.forEach(([start, end]) => {
                const p1 = landmarks[start];
                if (start === 11) p11Y.current = p1.y;
                if (start === 13) p13Y.current = p1.y;
            });

            const ifAssessmentDone = [ p13Y.current < p11Y.current, true, true, true, true, true, true ];
            const feedbackAssessments = [
              'Raise your left hand higher', 'Good job 2', 'Good job 3', 'Good job 4', 'Good job 5', 'Good job 6', 'Good job 7'
            ];
            const isAboveShoulder = ifAssessmentDone[assessmentIndexRef.current];

            if (!isValid && isAboveShoulder) setIsValid(true);
            const newFeedback = !isAboveShoulder ? feedbackAssessments[assessmentIndexRef.current] : 'Perfect!';
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
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    } catch (err) { console.warn(err); }
  };

  const Back = () => { assessmentIndex > 0 ? setassessmentIndex(assessmentIndex - 1) : null };

  const handleExit = () => {
    if (window.confirm("Exit test? Current progress will be lost.")) {
      stopCamera();
      toOutCome();
    }
  };

  const Next = () => {
    if(assessmentIndex < assessments.length - 1){
      setassessmentIndex(assessmentIndex + 1);
      setIsValid(false);
      return;
    } 
    alert("Test Completed!");
    stopCamera();
    toOutCome();
  };

  return (
    // vh-100 overflow-hidden: מונע גלילה של כל העמוד
    <div className="vh-100 bg-white d-flex flex-column font-sans text-dark overflow-hidden">
      
      {/* 1. Navbar - גובה קבוע */}
      <nav className="d-flex align-items-center px-4 py-3" style={{ height: '60px', flexShrink: 0 }}>
        <img src={logo} alt="Logo" width="22" className="opacity-75" />
        <span className="ms-2 fw-normal fst-italic" style={{fontSize: '1rem', color: '#333'}}>Fitwave.ai</span>
        <span onClick={handleExit} className="ms-auto text-muted small" style={{cursor: 'pointer', fontSize: '0.85rem', fontWeight: '300'}}>Exit Test</span>
      </nav>

      {/* 2. Main Content - Flex Grow תופס את שאר המקום */}
      <div className="flex-grow-1 d-flex flex-column p-3" style={{ minHeight: 0 }}> {/* minHeight: 0 קריטי כדי שהילדים לא ימתחו את ההורה */}
        
        {/* --- STEPPER --- */}
        <div className="d-flex justify-content-center align-items-start mb-3 w-100" style={{ flexShrink: 0 }}>
             {assessments.map((s, i) => {
                 const isActive = i === assessmentIndex;
                 const isCompleted = i < assessmentIndex;
                 const color = (isActive || isCompleted) ? ORANGE : "#E5E7EB"; 
                 
                 return (
                  <div key={i} className="d-flex align-items-center">
                    {/* קו מחבר */}
                    {i !== 0 && (
                        <div style={{ width: '40px', height: '2px', background: i <= assessmentIndex ? ORANGE : "#E5E7EB", margin: '0 8px', marginTop: '-20px' }} />
                    )}

                    <div className="d-flex flex-column align-items-center" style={{ opacity: isActive || isCompleted ? 1 : 0.5 }}>
                        {/* עיגול */}
                        <div 
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                            style={{ 
                                width: '32px', height: '32px', 
                                border: `2px solid ${color}`, 
                                background: isActive ? color : "white", 
                                color: isActive ? "white" : color,
                                marginBottom: '6px', fontSize: '0.9rem'
                            }}
                        >
                            {i + 1}
                        </div>
                        {/* טקסט */}
                        <div style={{ fontSize: '0.7rem', color: isActive ? '#333' : '#9CA3AF', fontWeight: isActive ? '600' : '400', width: '70px', textAlign: 'center', lineHeight: '1.2' }}>
                            {s.name}
                        </div>
                    </div>
                  </div>
                 );
             })}
        </div>

        {/* --- אזור הוידאו --- 
            flex: 1 ו-minHeight: 0 גורמים לו למלא את המקום שנשאר ולא פיקסל אחד יותר 
        */}
        <div className="d-flex justify-content-center gap-4 w-100" style={{ flex: 1, minHeight: 0 }}>
            
            {/* צד שמאל: מצלמה */}
            <div className="d-flex flex-column align-items-center w-100 h-100" style={{ maxWidth: '600px' }}>
                <div className="position-relative w-100 bg-black rounded-4 overflow-hidden shadow-sm border" style={{ flex: 1, minHeight: 0 }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                    />
                    <canvas 
                        ref={canvasRef} 
                        style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
                    />
                    {/* פידבק - על גבי הוידאו למטה */}
                    <div className="position-absolute bottom-0 w-100 p-2 text-center" style={{ background: 'rgba(255,255,255,0.95)' }}>
                         <p className="m-0 fw-bold" style={{ color: isValid ? '#22c55e' : ORANGE, fontSize: '1rem' }}>{feedback}</p>
                    </div>
                </div>
                <p className="text-muted small mt-2 fw-light">Your Camera</p>
            </div>

            {/* צד ימין: וידאו הדרכה */}
            <div className="d-flex flex-column align-items-center w-100 h-100" style={{ maxWidth: '600px' }}>
                 <div className="w-100 bg-light rounded-4 overflow-hidden shadow-sm border" style={{ flex: 1, minHeight: 0 }}>
                    <video width="100%" height="100%" controls style={{ objectFit: 'cover' }}>
                        <source src="/videos/121212.mp4" type="video/mp4" />
                    </video>
                </div>
                <p className="text-muted small mt-2 fw-light">Instruction</p>
            </div>
        </div>

      </div>

      {/* 3. Footer Buttons - גובה קבוע */}
      <div className="d-flex justify-content-center align-items-center gap-3 py-3" style={{ height: '70px', flexShrink: 0 }}>
         <button onClick={Back} className="btn text-secondary px-4 rounded-pill" style={{ visibility: assessmentIndex === 0 ? 'hidden' : 'visible', border: '1px solid #E5E7EB', backgroundColor: 'white' }}>
            <ChevronLeft /> Back
         </button>
         <button
            onClick={Next}
            disabled={!isValid}
            className="btn text-white px-5 rounded-pill shadow-none d-flex align-items-center gap-2"
            style={{ backgroundColor: isValid ? ORANGE : '#E5E7EB', color: isValid ? 'white' : '#9CA3AF', minWidth: '160px', justifyContent: 'center', fontWeight: '500' }}
         >
            {assessmentIndex === assessments.length - 1 ? 'Finish' : 'Next'} <ChevronRight />
         </button>
      </div>
    </div>
  );
}

export default BiomechanicalAss;