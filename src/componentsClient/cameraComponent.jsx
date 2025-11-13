import React ,{  useEffect, useRef, useState} from 'react'

const CameraComponent = () => {
  const videoRef = useRef(null);
    const [error, setError] = useState(null);
    
    useEffect(() => { 
      const openCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true, audio: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          } 
        } catch (err) {
          setError(`Error opening camera: ${err.message}`);
        }
      };

      openCamera();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
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