import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

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
  const p11Y = useRef(null);
  const p12Y = useRef(null);
  const p13Y = useRef(null);
  const p14Y = useRef(null);
  const p15Y = useRef(null);
  const p16Y = useRef(null);
  const p23Y = useRef(null);
  const p24Y = useRef(null);
  const p25Y = useRef(null);
  const p26Y = useRef(null);
  const p27Y = useRef(null);
  const p28Y = useRef(null);
  const p31Y = useRef(null);
  const p32Y = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  // use state so changes trigger re-renders (e.g., to disable/enable the Next button)
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState('');
  // const feedbackRef = useRef('');

  const poseLandmarkerRef = useRef(null);
  const assessmentIndexRef = useRef(assessmentIndex);

  useEffect(() => {
    assessmentIndexRef.current = assessmentIndex;
  }, [assessmentIndex]);

  const toOutCome = () => {
    nav("/OutCome");
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
            const connections = [
              [11, 12], [12, 14], [14, 16], [11, 13], [13, 15], // arms
              [12, 24], [11, 23], [23, 24], // torso
              [24, 26], [26, 28], [28, 32], [23, 25], [25, 27], [27, 31] // legs
            ];
            connections.forEach(([start, end]) => {
              const p1 = landmarks[start];
              const p2 = landmarks[end];

              if (start === 11) { p11Y.current = p1.y; }
              if (start === 12) { p12Y.current = p1.y; }
              if (start === 13) { p13Y.current = p1.y; }
              if (start === 14) { p14Y.current = p1.y; }
              if (end === 15) { p15Y.current = p1.y; }
              if (end === 16) { p16Y.current = p1.y; }
              if (start === 23) { p23Y.current = p1.y; }  
              if (start === 24) { p24Y.current = p1.y; }
              if (start === 25) { p25Y.current = p1.y; }
              if (start === 26) { p26Y.current = p1.y; }
              if (start === 27) { p27Y.current = p1.y; }
              if (start === 28) { p28Y.current = p1.y; }
              if (end === 31) { p31Y.current = p1.y; }
              if (end === 32) { p32Y.current = p1.y; }

            });

            const xs = landmarks.map(p => p.x);
            const ys = landmarks.map(p => p.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);

            const boxHeight = (maxY - minY) * videoHeight;
            const centerX = ((minX + maxX) / 2) * videoWidth;
            const centerY = ((minY + maxY) / 2) * videoHeight;

            const toleranceX = videoWidth * 0.1;
            const toleranceY = videoHeight * 0.1;

            let isAboveShoulder = false;

            const ifAssessmentDone = [
              p13Y.current < p11Y.current,
              true,
              true,
              true,
              true,
              true,
              true
            ]

            const feedbackAssessments = [
              'Raise your left hand higher',
              'Good job on assessment 2',
              'Good job on assessment 3',
              'Good job on assessment 4',
              'Good job on assessment 5',
              'Good job on assessment 6',
              'Good job on assessment 7'
            ];

            isAboveShoulder = ifAssessmentDone[assessmentIndexRef.current];

            if (!isValid && isAboveShoulder) {
              setIsValid(true);
            }

            const newFeedback = !isAboveShoulder ? feedbackAssessments[assessmentIndexRef.current] : 'Perfect!';
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
  const Next = () => {
    if(assessmentIndex < assessments.length - 1){
     setassessmentIndex(assessmentIndex + 1)
      setIsValid(false);
      return;
    } 
    const finishMsg = "You have completed the test — you are being redirected to the report page.";
    setIsValid(false);
    window.alert(finishMsg);
    stopCamera();
    toOutCome();
  };
 
  const name = () => {
    return assessments[assessmentIndex].name
  };





  return (
    <div className="d-flex flex-column align-items-center my-4 ">
      <div className="d-flex justify-content-center align-items-center gap-4 py-3">
        {assessments.map((s, i) => (
          <div key={i} className="d-flex align-items-center">
            {i !== 0 && (<div style={{ width: 40, height: 3, background: i <= assessmentIndex ? "#6d28d9" : "#d1d5db", marginRight: 20, transition: "0.3s" }} />)}
            <div style={{ textAlign: "center", opacity: i === assessmentIndex ? 1 : 0.4 }}>
              <div className="rounded-circle border d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32, border: "2px solid #6d28d9", background: i === assessmentIndex ? "#6d28d9" : "white", color: i === assessmentIndex ? "white" : "#6d28d9", margin: "0 auto" }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 13, marginTop: 5 }}>{s.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="m-1 shadow-lg p-2 d-flex flex-column text-center" style={{ width: '95%', maxWidth: '50%', height: '80vh', backgroundColor: 'white' }}> */}
      <div className=" d-flex justify-content-center gap-3 " style={{ width: '95%', maxWidth: '80%', height: '80vh' }}>
        {/* <h4 className="m-1">{name()}</h4> */}
        <div className='text-center my-3 borderRadius-10px' style={{ position: 'relative', width: '100%' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              maxHeight: '60vh',
              width: '720',
              borderRadius: '10px',
              transform: 'scaleX(-1)'
            }}
          />
          <canvas ref={canvasRef} style={{ position: "absolute" }} />
          <p style={{ marginTop: '10px', fontWeight: 'bold', color: 'blue' }}> {feedback}</p>
        </div>
        <div className='text-center' style={{ position: 'relative', width: '100%' }}>
          <video

            width="100%"
            controls
            className="my-3 rounded border"
          >
            <source src="/videos/121212.mp4" type="video/mp4" />
            הדפדפן שלך לא תומך בווידאו.
          </video>
        </div>
      </div>
      {/* </div> */}
      <div className="d-flex gap-3 mt-4 ">
        <button onClick={Back} style={{ padding: "8px 24px", background: "white", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer" }} className="me-2">Back</button>
        <button
          onClick={() => {
            const confirmExit = window.confirm("You are about to leave the test page. Current test will be lost. Are you sure you want to continue?");
            if (confirmExit) {
              stopCamera();
              toOutCome();
            }
          }}
          style={{
            padding: "8px 24px",
            background: "white",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            cursor: "pointer"
          }}
          className="me-2"
        >
          Exit
        </button>
        <button
          disabled={!isValid}
          onClick={Next}
          style={{ padding: "8px 24px", background: "#7c3aed", color: "white", border: "none", borderRadius: 8 }}>
          Next
        </button>
      </div>
    </div>
  );
}

export default BiomechanicalAss;



