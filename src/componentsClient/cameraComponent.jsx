// import React, { useEffect, useRef, useState } from 'react'
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
// import '@tensorflow/tfjs-backend-webgl';

// const CameraComponent = () => {
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [status, setStatus] = useState('A loading model...');
//   const [inPosition, setInPosition] = useState(false);
//   const [error, setError] = useState(null);

//   const targetCenter = { x: 360, y: 240 };
//   const targetRadius = 150;
//   let timer = 0;
//   let detector = null;



//   useEffect(() => {
//     let isMounted = true;

//     const openCamera = async () => {
//       try {
//         await import('@tensorflow/tfjs-backend-webgl');
//         const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
//         detector = await faceLandmarksDetection.createDetector(model, {
//           runtime: 'tfjs',
//           refineLandmarks: true,
//           maxFaces: 1,
//         });
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { width: 720, height: 480 }, audio: true,
//         });

//         if (isMounted && videoRef.current) {
//           streamRef.current = stream;
//           videoRef.current.srcObject = stream;
//           await videoRef.current.play();
//         }
//         await new Promise((resolve) => {
//           if (videoRef.current.readyState >= 3) {
//             resolve();
//           } else {
//             videoRef.current.onloadeddata = () => {
//               resolve();
//             };
//           }
//         });

//         await new Promise(resolve => setTimeout(resolve, 300));

//         setStatus('Place the face in the yellow circle.');
//         detectFrame();
//       } catch (err) {
//         if (isMounted) {
//           setError(`Error opening camera: ${err.message}`);
//         }
//       }
//     };

//     const detectFrame = async () => {
//       if (!videoRef.current || !canvasRef.current || !detector) {
//         requestAnimationFrame(detectFrame);
//         return;
//       }

//       const faces = await detector.estimateFaces(videoRef.current, { flipHorizontal: false });
//       const ctx = canvasRef.current.getContext('2d');
//       ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//       let nosePoint = null;

//       if (faces.length > 0) {
//         const keypoints = faces[0].keypoints;
//         nosePoint = keypoints[1];

//         keypoints.forEach(p => {
//           ctx.fillStyle = '#00ffff';
//           ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
//         });
//       }
//       ctx.lineWidth = 6;
//       ctx.strokeStyle = inPosition ? '#00ff1eff' : '#ffff00';
//       ctx.beginPath();
//       ctx.arc(targetCenter.x, targetCenter.y, targetRadius, 0, Math.PI * 2);
//       ctx.stroke();

//       if (nosePoint) {
//         const distance = Math.hypot(nosePoint.x - targetCenter.x, nosePoint.y - targetCenter.y);
//         const nowInPosition = distance < targetRadius - 40;

//         if (nowInPosition) {
//           timer++;
//           if (timer >= 90) {
//             setStatus("Great!!! Let's move on to the next exercise. ");
//             // כאן תקרא לפונקציה שלך: nextExercise() או מה שתרצה
//           } else {
//             setStatus(`Time:${(timer / 30).toFixed(1)} sec - Hold still!`);
//           }
//         } else {
//           timer = 0;
//           setStatus('Move your face into the circle');
//         }
//         setInPosition(nowInPosition);
//       } else {
//         timer = 0;
//         setInPosition(false);
//         setStatus('No face detected - Please align your face within the circle');
//       }

//       requestAnimationFrame(detectFrame);
//     };
//     openCamera();

//     return () => {
//       isMounted = false;

//       if (streamRef.current) {
//         console.log("הפונקציה רצה!");
//         streamRef.current.getTracks().forEach(track => track.stop());
//         streamRef.current = null;
//       }

//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }
//     };
//   }, []);

//   return (
//     <div style={{ position: 'relative', width: 720, height: 480, margin: '30px auto' }}>

//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         playsInline
//         width={720}
//         height={480}
//         style={{
//           borderRadius: '20px',
//           boxShadow: '0 0 30px rgba(0,255,255,0.6)',
//           transform: 'scaleX(-1)',   // ← הופך את התמונה כמו במראה (כדי שמאל יהיה מאל)
//         }}
//       />

//       {/* 2. הקנבס – שקוף מעל הווידאו – כאן נצייר עיגול, נקודות, דהייה */}
//       <canvas
//         ref={canvasRef}
//         width={720}
//         height={480}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           borderRadius: '20px',
//           transform: 'scaleX(-1)',   
//         }}
//       />

//       {/* 3. ההודעה למטה */}
//       <div style={{
//         position: 'absolute',
//         bottom: 20,
//         left: 0,
//         right: 0,
//         textAlign: 'center',
//         fontSize: '28px',
//         fontWeight: 'bold',
//         color: error ? 'red' : inPosition ? 'lime' : 'yellow',
//         textShadow: '2px 2px 8px black',
//         pointerEvents: 'none',
//       }}>
//         {status}
//       </div>
//     </div>
//   );
// }

// export default CameraComponent;

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
// import reactIcon from '../assets/react.svg';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

function CameraComponent() {
  const nav = useNavigate();
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [feedback, setFeedback] = useState('');
  const [isValid, setIsValid] = useState(false);

  const poseLandmarkerRef = useRef(null);

  useEffect(() => {
    let animationId;

    const closseCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

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
          video: { width: 640, height: 480 },
          audio: true,
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
          //console.log(results);

          const ctx = canvasRef.current.getContext('2d');
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          ctx.clearRect(0, 0, videoWidth, videoHeight);
          ctx.save(); 
          ctx.scale(-1, 1); 
          ctx.translate(-videoWidth, 0); 
          if (!results.landmarks || results.landmarks.length === 0) {
            setFeedback('No person detected');
            //לבדוק למה הוא משמש??
            setIsValid(false);
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
            setIsValid(valid);

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
      closseCamera();
    };
  }, []);

  return (
    <div>
      <div
        className="container mt-5 shadow-lg p-4 d-flex flex-column text-center"
        style={{ width: '80%', maxWidth: '500px', backgroundColor: 'white' }}
      >
        <div className="row justify-content-center">
          {/* <img src={reactIcon} alt="React" style={{ width: '64px', height: '64px' }} /> */}
          <h4 className="m-2">Camera Calibration</h4>

          {/* Video + Canvas Overlay */}
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

          {/* Feedback */}
          <p style={{ marginTop: '10px', fontWeight: 'bold', color: 'blue' }}>{feedback}</p>
        </div>
      </div>

      {/* Continue Button */}
      <div>
        <button
          onClick={() => {
            closseCamera();
            nav('/' + fromPage);
          }}
          style={{
            width: '6%',
            maxWidth: '500px',
            backgroundColor: 'rgb(54, 227, 215)',
            bottom: '20px',
            right: '20px',
            position: 'fixed',
            borderColor: 'rgb(54, 227, 215)',
            borderRadius: '5px',
            padding: '10px',
            color: 'white',
            fontWeight: 'bold'
          }}
        disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default CameraComponent;