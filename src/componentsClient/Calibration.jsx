import React from 'react';
import { useNavigate } from 'react-router-dom';
import thisIcon from '../assets/icon.png'; 

function Calibration() {
  const nav = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isValid = useRef(false);
  const [feedback, setFeedback] = useState('');
  const poseLandmarkerRef = useRef(null);

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
          video: { width: 640, height: 480 }
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

          const ctx = canvasRef.current.getContext('2d');
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;

          // Ensure canvas matches video size
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          ctx.clearRect(0, 0, videoWidth, videoHeight);
          ctx.save(); // Save current state
          ctx.scale(-1, 1); // Flip horizontally
          ctx.translate(-videoWidth, 0); // Shift back after flip
          if (!results.landmarks || results.landmarks.length === 0) {
            setFeedback('No person detected');
          } else {
            const landmarks = results.landmarks[0];
            ctx.fillStyle = 'orange';
            landmarks.forEach(point => {
              const x = point.x * videoWidth;
              const y = point.y * videoHeight;
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.fill();
            });

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            const connections = [
              [15, 21], [16, 22],
              [11, 12], [12, 14], [14, 16], [11, 13], [13, 15], // arms
              [12, 24], [11, 23], [23, 24], // torso
              [24, 26], [26, 28], [28, 32], [23, 25], [25, 27], [27, 31] // legs
            ];
            connections.forEach(([start, end]) => {
              const p1 = landmarks[start];
              const p2 = landmarks[end];
              ctx.beginPath();
              ctx.moveTo(p1.x * videoWidth, p1.y * videoHeight);
              ctx.lineTo(p2.x * videoWidth, p2.y * videoHeight);
              ctx.stroke();
            });
            ctx.restore();

            // Validation logic
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
            const isCentered =
              Math.abs(centerX - videoWidth / 2) < toleranceX &&
              Math.abs(centerY - videoHeight / 2) < toleranceY;
            const isVisible = boxHeight > videoHeight * 0.6 && boxHeight < videoHeight * 0.95;

            const valid = isCentered && isVisible;
            if (!isValid.current) {
              isValid.current = valid;
            }

            if (!isCentered) setFeedback('Move to center');
            else if (!isVisible) setFeedback('Adjust distance');
            else setFeedback('Perfect!');
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

  // const handleNext = () => {
  //   nav("/h_statement");
  // };

  const goBackHome = () => {
    nav("/homeClient");
  };

  const toBiomechanicalAss = () => {
    nav("/biomechanicalAss");
  };
  
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


  return (
    <div className="vh-100 bg-white d-flex flex-column page-wrapper overflow-hidden">

      {/* Navbar */}
      <nav className="d-flex align-items-center justify-content-between px-4 py-2 flex-shrink-0" style={{ height: '70px', padding: '5px 0' }}>
        <div className="d-flex align-items-center gap-2">
             <img src={thisIcon} alt="Logo" width="35" className="logo-icon opacity-75" />
             <span className="logo-text" style={{ fontSize: '2rem' }}>Fitwave.ai</span>
        </div>

        <div onClick={()=>{stopCamera(); goBackHome();}} className="btn-exit d-flex align-items-center gap-2">
          <span>Exit to Home</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column align-items-center p-3" style={{ minHeight: 0 }}>

        <div className="text-center mb-3 flex-shrink-0">
          <h2 className="mb-1" style={{ fontSize: '2rem', fontWeight: '500' }}>
            System Check
          </h2>
          <p className="text-secondary m-0">
            Ensure your whole body is visible in the frame
          </p>
        </div>

        {/* Camera Wrapper */}
        <div
          className="camera-wrapper w-100 rounded-4 overflow-hidden bg-black mb-4 shadow-sm"
          style={{
            flex: '1 1 auto',
            maxWidth: '900px',
            maxHeight: '55vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '1px solid #eee'
          }}
        >
          <div>
            <div
              className="container mt-5 shadow-lg p-4 d-flex flex-column text-center"
              style={{ width: '95%', maxWidth: '80%', height: '90vh', backgroundColor: 'white' }}
            >
              <div className="row justify-content-center">
                <h4 className="m-2">Camera Calibration</h4>
                <div style={{ position: 'relative', width: '100%' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      transform: 'scaleX(-1)'
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
                <p style={{ marginTop: '10px', fontWeight: 'bold', color: 'blue' }}>{feedback}</p>
              </div>
            </div>
            <div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 pb-2">
          <button
            onClick={() => { toBiomechanicalAss(); }}
            className="btn btn-lg px-5 py-3 rounded-pill btn-brand-orange"
            style={{
              minWidth: '240px',
              fontSize: '1.2rem',
            }}
            disabled={!isValid.current}
          >
            Start Analysis
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center py-2 text-muted small flex-shrink-0">
        FitWave AI © 2026
      </div>

    </div>
  );
}

export default Calibration;