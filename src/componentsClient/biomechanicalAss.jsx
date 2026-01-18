import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { doApiMethod } from '../services/apiService';
import { useSelector } from 'react-redux';
import thisIcon from '../assets/icon.png';

const ChevronRight = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>;
const ChevronLeft = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>;
const assessments = [
  { name: "Chair Stand" },
  { name: "Comfortable Stand" },
  { name: "Weight Shift" },
  { name: "Forward Reach" },
  { name: "Arm Raise" },
  { name: "Seated Trunk Turn" }
];

const feedbackAssessments = [
  'Stand up from the chair and sit back down twice at a comfortable pace.',
  'Stand comfortably in front of the chair for about 15 seconds.',
  'Gently shift your weight from side to side while standing',
  'Raise one arm and gently reach forward, then return.',
  'Slowly raise both arms up and lower them back down while seated.',
  'Turn your upper body gently to each side while seated.'
];

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
// orange button style similar to healthForm
styles.orangeButton = (disabled) => ({
  backgroundColor: disabled ? "#E5E7EB" : "#F96424",
  color: disabled ? "#9CA3AF" : "white",
  border: "none",
  borderRadius: "50px",
  padding: "14px 40px",
  fontSize: "1.1rem",
  fontWeight: "600",
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: disabled ? "none" : "0 4px 14px rgba(249, 100, 36, 0.4)",
  display: "flex", alignItems: "center", gap: "10px",
  transition: "all 0.3s ease"
});
let resultsData = {
  assessment1: false,
  Chair_Stand: false,
  Comfortable_Stand: false,
  Weight_Shift: {
    right: false,
    left: false
  },
  Forward_Reach: false,
  Arm_Raise: false,
  Seated_Trunk_Turn: {
    right: false,
    left: false
  }
};

function BiomechanicalAss() {
  const thisidQuestions = useSelector(state => state.myDetailsSlice.idQuestions);
  const nav = useNavigate();
  const [assessmentIndex, setassessmentIndex] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState('');
  const poseLandmarkerRef = useRef(null);
  const assessmentIndexRef = useRef(assessmentIndex);
  let isDone = false;
  useEffect(() => {
    assessmentIndexRef.current = assessmentIndex;
  }, [assessmentIndex]);

  const toOutCome = () => {
    nav("/outCome");
  };

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
      } catch (error) {
        console.error('Error initializing PoseLandmarker:', error);
      }
    };

    const startCamera = async () => {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
          // { width: 640, height: 480 }
        });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          processFrames();
        };
      } catch (err) {
        console.error('Camera access error:', err);
      }
    };

    const processFrames = () => {
      const loop = () => {
        if (poseLandmarkerRef.current && videoRef.current) {
          const now = performance.now();
          const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, now);
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          if (!results.landmarks || results.landmarks.length === 0) {
            setFeedback('No person detected');
          } else {
            const landmarks = results.landmarks[0];
            landmarks.forEach(point => {
              const x = point.x * videoWidth;
              const y = point.y * videoHeight;
            });

            const ifAssessmentDone = [
              () => {
                if (!resultsData.Chair_Stand)
                  resultsData.Chair_Stand = landmarks[23].y > landmarks[25].y;
                return resultsData.Chair_Stand;
              },
              () => {
                if (!resultsData.Comfortable_Stand)
                  resultsData.Comfortable_Stand = Math.trunc(landmarks[27].x * 10) === Math.trunc(landmarks[11].x * 10) && Math.trunc(landmarks[28].x * 10) === Math.trunc(landmarks[12].x * 10);
                return resultsData.Comfortable_Stand;
              },
              () => {
                if (!resultsData.Weight_Shift.right)
                  resultsData.Weight_Shift.right = landmarks[0].x < landmarks[24].x;
                if (!resultsData.Weight_Shift.left)
                  resultsData.Weight_Shift.left = landmarks[0].x > landmarks[23].x;
                return resultsData.Weight_Shift.right && resultsData.Weight_Shift.left;
              },
              () => {
                if (!resultsData.Forward_Reach)
                  resultsData.Forward_Reach = Math.trunc(landmarks[16].x * 10) === Math.trunc(landmarks[12].x * 10) && Math.trunc(landmarks[16].y * 10) === Math.trunc(landmarks[12].y * 10);
                return resultsData.Forward_Reach;
              },
              () => {
                if (!resultsData.Arm_Raise)
                  resultsData.Arm_Raise = landmarks[14].y < landmarks[0].y && landmarks[15].y < landmarks[0].y;
                return resultsData.Arm_Raise;
              },
              () => {
                if (!resultsData.Seated_Trunk_Turn.right) {
                  resultsData.Seated_Trunk_Turn.right = landmarks[12].x >= landmarks[0].x;
                }
                if (!resultsData.Seated_Trunk_Turn.left) {
                  resultsData.Seated_Trunk_Turn.left = landmarks[11].x <= landmarks[0].x;
                }
                return resultsData.Seated_Trunk_Turn.right && resultsData.Seated_Trunk_Turn.left;
              }
            ];

            isDone = ifAssessmentDone[assessmentIndexRef.current]();

            const newFeedback = !isDone ? " " : 'Perfect!';
            setFeedback(prev => (prev !== newFeedback ? newFeedback : prev));
          }
        }
        animationId = requestAnimationFrame(loop);
      };
      loop();
    };

    initPoseLandmarker();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const stopCamera = () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();
      }
    } catch (err) {
      console.warn('Error stopping camera:', err);
    }
  };

  const Back = () => {
    assessmentIndex > 0 ? setassessmentIndex(assessmentIndex - 1) : null
  };
  const Next = async () => {
    if (assessmentIndex < assessments.length - 1) {
      setassessmentIndex(assessmentIndex + 1)
      return;
    }
    const finishMsg = "You have completed the test — you are being redirected to the report page.";
    window.alert(finishMsg);
    await doApi()
    //console.log(resultsData);
  };

  const doApi = async () => {
    let data = {
      resultsData: resultsData,
      section: "bio section",
      idQuestions: thisidQuestions
      // idQuestions: "695a9e908ac90d64613448b4"
    }
    try {
      let resData = await doApiMethod("/questions/edit", "PUT", data);
      console.log("resData" + resData);
      if (resData.status == 200) {
        {
          stopCamera();
          toOutCome();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }



  const getAssessmentName = () => {
    return assessments[assessmentIndex].name;
  }

  const ORANGE = '#FF5722';
  return (
    // מבנה קשיח: גובה 100% מהמסך, ללא גלילה (overflow-hidden)
    <div className="vh-100 bg-white d-flex flex-column page-wrapper overflow-hidden">

      {/* Navbar */}
      <nav className="d-flex align-items-center justify-content-between px-4  flex-shrink-0" style={{ height: '70px', padding: '5px 0' }}>
        <div className="d-flex align-items-center gap-2">
          <img src={thisIcon} alt="Logo" width="35" className="logo-icon opacity-75" />
          <span className="logo-text" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
        </div>
        <button
          onClick={() => { stopCamera(); nav("/HomeClient"); }}
          style={styles.exitButton}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          <HomeIcon /> Home
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
        <div className="flex-grow-1 bg-black  overflow-hidden position-relative  " style={{ flexBasis: '60%' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
          <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />

          {/* פידבק ברור למטה */}
          <div className="position-absolute bottom-0 w-100 py-2 text-center bg-white border-top">
            <span className="fw-bold fs-5" style={{ color: isDone ? '#10B981' : ORANGE }}>
              {feedback || "Adjusting..."}
            </span>
          </div>
        </div>

        {/* צד ימין: הוראות (צר יותר) */}
        <div className="d-flex flex-column gap-3" style={{ flexBasis: '40%' }}>
          {/* כותרת הנחיה */}


          {/* וידאו הדרכה */}
          <div className="flex-grow-1 bg-white rounded-3 overflow-hidden border shadow-sm position-relative">
            <img src={`src/assets/pic${assessmentIndex + 1}.jpg`} alt="Logo" height="100%" width="100%" className="opacity-75" />
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
      <div className="bg-orange px-4 py-2  d-flex flex-column align-items-center" style={{borderRadius: "20px", backgroundColor: "#FF5722" ,opacity: "0.8" , color: "white"}}>
          <h5 className="m-0 fw-bold ">{getAssessmentName()}</h5>
          <p  className=" m-0 small" >{feedbackAssessments[assessmentIndex]}</p>
        </div>
        <button
          onClick={Next}
          className="d-flex align-items-center gap-2 fw-bold"
          style={styles.orangeButton(false)}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(249, 100, 36, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(249, 100, 36, 0.4)";
          }}
        >
          {assessmentIndex === assessments.length - 1 ? 'Finish' : 'Next Step'} <ChevronRight />
        </button>
      </div>

    </div>
  );
}

export default BiomechanicalAss;