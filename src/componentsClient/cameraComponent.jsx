import React, { useEffect, useRef, useState } from 'react'

const CameraComponent = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true, audio: true,
        });
        
        if (isMounted && videoRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        if (isMounted) {
          setError(`Error opening camera: ${err.message}`);
        }
      }
    };

    openCamera();

    return () => {
      isMounted = false;
      
      if (streamRef.current) {
        console.log("הפונקציה רצה!");
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        style={{ borderRadius: '24px', width: '100%', height: '100%' }}
        autoPlay
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CameraComponent;