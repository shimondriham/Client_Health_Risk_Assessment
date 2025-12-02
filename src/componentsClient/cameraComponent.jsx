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


import React from 'react'

function cameraComponent() {
  return (
    <div>cameraComponent</div>
  )
}

export default cameraComponent